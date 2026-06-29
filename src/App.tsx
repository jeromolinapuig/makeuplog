import { useEffect, useMemo, useState } from 'react';
import { Gift, Grid3X3, Heart, Home, LogOut, Plus, Sparkles } from 'lucide-react';
import { CategoryManager } from './components/CategoryManager';
import { DashboardSummary } from './components/DashboardSummary';
import { EmptyState } from './components/EmptyState';
import { ProductDetail } from './components/ProductDetail';
import { ProductFilters } from './components/ProductFilters';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { ShareList } from './components/ShareList';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './hooks/useAuth';
import { useMakeUpLog } from './hooks/useMakeUpLog';
import { ProductFiltersState } from './types';
import { filterAndSortProducts } from './utils/products';

const initialFilters: ProductFiltersState = {
  query: '',
  categoryId: '',
  group: '',
  brand: '',
  favoritesOnly: false,
  minRating: '',
  sort: 'recent',
};

type Route =
  | { name: 'dashboard' }
  | { name: 'products' }
  | { name: 'newProduct' }
  | { name: 'productDetail'; id: string }
  | { name: 'editProduct'; id: string }
  | { name: 'favorites' }
  | { name: 'categories' }
  | { name: 'shareList' };

function parseRoute(): Route {
  const path = window.location.pathname;
  if (path === '/products/new') return { name: 'newProduct' };
  if (path === '/favorites') return { name: 'favorites' };
  if (path === '/categories') return { name: 'categories' };
  if (path === '/share-list') return { name: 'shareList' };
  const editMatch = path.match(/^\/products\/([^/]+)\/edit$/);
  if (editMatch) return { name: 'editProduct', id: editMatch[1] };
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) return { name: 'productDetail', id: productMatch[1] };
  if (path === '/products') return { name: 'products' };
  return { name: 'dashboard' };
}

function pathFor(route: Route) {
  if (route.name === 'products') return '/products';
  if (route.name === 'newProduct') return '/products/new';
  if (route.name === 'productDetail') return `/products/${route.id}`;
  if (route.name === 'editProduct') return `/products/${route.id}/edit`;
  if (route.name === 'favorites') return '/favorites';
  if (route.name === 'categories') return '/categories';
  if (route.name === 'shareList') return '/share-list';
  return '/';
}

function routeSection(route: Route) {
  if (route.name === 'newProduct' || route.name === 'productDetail' || route.name === 'editProduct') return 'products';
  return route.name;
}

export default function App() {
  const auth = useAuth();
  const store = useMakeUpLog(auth.user?.id ?? null);
  const [route, setRoute] = useState<Route>(() => parseRoute());
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [actionError, setActionError] = useState('');

  function navigate(nextRoute: Route) {
    window.history.pushState(null, '', pathFor(nextRoute));
    setRoute(nextRoute);
  }

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const visibleProducts = useMemo(() => filterAndSortProducts(store.products, filters), [store.products, filters]);
  const favoriteProducts = store.products.filter((product) => product.isFavorite);
  const sharedProducts = store.products.filter((product) => product.isShared);
  const recentProducts = [...store.products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const productNames = useMemo(
    () => Array.from(new Set(store.products.map((product) => product.name).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [store.products],
  );

  async function runAction(action: () => Promise<void>) {
    setActionError('');
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No se ha podido completar la acción.');
    }
  }

  function deleteProduct(id: string) {
    if (window.confirm('Quieres eliminar este producto?')) {
      runAction(async () => {
        await store.deleteProduct(id);
        navigate({ name: 'products' });
      });
    }
  }

  const editingProduct = route.name === 'editProduct' ? store.products.find((product) => product.id === route.id) : undefined;
  const detailProduct = route.name === 'productDetail' ? store.products.find((product) => product.id === route.id) : undefined;
  const activeSection = routeSection(route);
  const navItems = [
    { label: 'Inicio', route: { name: 'dashboard' } as Route, section: 'dashboard', Icon: Home },
    { label: 'Productos', route: { name: 'products' } as Route, section: 'products', Icon: Sparkles },
    { label: 'Favoritos', route: { name: 'favorites' } as Route, section: 'favorites', Icon: Heart },
    { label: 'Categorías', route: { name: 'categories' } as Route, section: 'categories', Icon: Grid3X3 },
    { label: 'Lista', route: { name: 'shareList' } as Route, section: 'shareList', Icon: Gift },
  ];

  if (auth.isLoading) {
    return <main className="status-page">Cargando sesión...</main>;
  }

  if (!auth.user) {
    return <LoginScreen onSignIn={auth.signInWithGoogle} />;
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <button className="brand-button" type="button" onClick={() => navigate({ name: 'dashboard' })}>
          <span className="brand-mark" aria-hidden="true"><Sparkles size={20} /></span>
          <span>MakeUpLog</span>
          <small>Catálogo privado</small>
        </button>
        <nav className="app-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button
              className={activeSection === item.section ? 'is-active' : ''}
              type="button"
              key={item.section}
              onClick={() => navigate(item.route)}
            >
              <item.Icon className="nav-icon" size={18} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="user-panel">
          <span>{auth.user.email}</span>
          <button className="secondary-button" type="button" onClick={auth.signOut}>
            <LogOut className="button-icon" size={18} aria-hidden="true" />
            Salir
          </button>
        </div>
      </aside>

      <main className="app-main">
        {(store.error || actionError) && (
          <div className="notice-panel" role="alert">
            {store.error || actionError}
          </div>
        )}
        {store.isLoading && <div className="notice-panel">Cargando datos...</div>}

        {route.name === 'dashboard' && (
          <div className="page-stack">
            <section className="page-heading">
              <p className="eyebrow">Catálogo privado</p>
              <h1>Tu registro de belleza</h1>
              <p>Productos, valoraciones, favoritos e ideas para regalar en un único lugar.</p>
            </section>
            <DashboardSummary products={store.products} />
            <section className="quick-actions" aria-label="Accesos rapidos">
              <button className="primary-button" type="button" onClick={() => navigate({ name: 'newProduct' })}><Plus className="button-icon" size={18} aria-hidden="true" />Añadir producto</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'products' })}><Sparkles className="button-icon" size={18} aria-hidden="true" />Ver productos</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'favorites' })}><Heart className="button-icon" size={18} aria-hidden="true" />Ver favoritos</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'categories' })}><Grid3X3 className="button-icon" size={18} aria-hidden="true" />Gestionar categorías</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'shareList' })}><Gift className="button-icon" size={18} aria-hidden="true" />Lista compartible</button>
            </section>
            <section>
              <h2>Últimos productos</h2>
              <ProductList
                products={recentProducts}
                emptyText="Todavía no has registrado ningún producto. Añade el primero para empezar tu colección."
                onOpen={(id) => navigate({ name: 'productDetail', id })}
                onToggleFavorite={(id) => runAction(() => store.toggleFavorite(id))}
                onToggleShared={(id) => runAction(() => store.toggleShared(id))}
              />
            </section>
          </div>
        )}

        {route.name === 'products' && (
          <div className="page-stack">
            <div className="title-row">
              <section className="page-heading">
                <h1>Productos</h1>
                <p>Busca, filtra y ordena tu catálogo.</p>
              </section>
              <button className="primary-button" type="button" onClick={() => navigate({ name: 'newProduct' })}><Plus className="button-icon" size={18} aria-hidden="true" />Añadir</button>
            </div>
            <ProductFilters filters={filters} categories={store.categories} brands={store.brands} onChange={setFilters} />
            <ProductList
              products={visibleProducts}
              emptyText={store.products.length === 0 ? 'Todavía no has registrado ningún producto. Añade el primero para empezar tu colección.' : 'No se han encontrado productos con esos filtros.'}
              onOpen={(id) => navigate({ name: 'productDetail', id })}
              onToggleFavorite={(id) => runAction(() => store.toggleFavorite(id))}
              onToggleShared={(id) => runAction(() => store.toggleShared(id))}
            />
          </div>
        )}

        {route.name === 'newProduct' && (
          <div className="page-stack narrow">
            <section className="page-heading">
              <h1>Añadir producto</h1>
            </section>
            <ProductForm
              categories={store.categories}
              brandSuggestions={store.brands}
              productNameSuggestions={productNames}
              onCancel={() => navigate({ name: 'products' })}
              onSubmit={(draft) =>
                runAction(async () => {
                  const id = await store.addProduct(draft);
                  navigate({ name: 'productDetail', id });
                })
              }
            />
          </div>
        )}

        {route.name === 'editProduct' && editingProduct && (
          <div className="page-stack narrow">
            <section className="page-heading">
              <h1>Editar producto</h1>
            </section>
            <ProductForm
              categories={store.categories}
              product={editingProduct}
              brandSuggestions={store.brands}
              productNameSuggestions={productNames}
              onCancel={() => navigate({ name: 'productDetail', id: editingProduct.id })}
              onSubmit={(draft) =>
                runAction(async () => {
                  await store.updateProduct(editingProduct.id, draft);
                  navigate({ name: 'productDetail', id: editingProduct.id });
                })
              }
            />
          </div>
        )}

        {route.name === 'editProduct' && !editingProduct && <EmptyState title="No se ha encontrado el producto." />}

        {route.name === 'productDetail' && detailProduct && (
          <ProductDetail
            product={detailProduct}
            onBack={() => navigate({ name: 'products' })}
            onEdit={() => navigate({ name: 'editProduct', id: detailProduct.id })}
            onDelete={() => deleteProduct(detailProduct.id)}
            onToggleFavorite={() => runAction(() => store.toggleFavorite(detailProduct.id))}
            onToggleShared={() => runAction(() => store.toggleShared(detailProduct.id))}
          />
        )}

        {route.name === 'productDetail' && !detailProduct && <EmptyState title="No se ha encontrado el producto." />}

        {route.name === 'favorites' && (
          <div className="page-stack">
            <section className="page-heading">
              <h1>Favoritos</h1>
              <p>Productos que más te gustan o que repetirías.</p>
            </section>
            <ProductList
              products={favoriteProducts}
              emptyText="Todavía no has marcado favoritos. Cuando valores tus productos, aparecerán aquí los que más te gustan."
              onOpen={(id) => navigate({ name: 'productDetail', id })}
              onToggleFavorite={(id) => runAction(() => store.toggleFavorite(id))}
              onToggleShared={(id) => runAction(() => store.toggleShared(id))}
            />
          </div>
        )}

        {route.name === 'categories' && (
          <div className="page-stack">
            <section className="page-heading">
              <h1>Categorías</h1>
              <p>Crea y ajusta categorías para productos futuros.</p>
            </section>
            <CategoryManager
              categories={store.categories}
              products={store.products}
              onAdd={(name, group) => runAction(() => store.addCategory(name, group))}
              onUpdate={(id, name, group) => runAction(() => store.updateCategory(id, name, group))}
              onDelete={(id) => runAction(() => store.deleteCategory(id))}
            />
          </div>
        )}

        {route.name === 'shareList' && (
          <div className="page-stack narrow">
            <section className="page-heading">
              <h1>Ideas para regalar</h1>
              <p>Copia una lista simple con los productos marcados para compartir.</p>
            </section>
            <ShareList products={sharedProducts} onOpen={(id) => navigate({ name: 'productDetail', id })} />
          </div>
        )}
      </main>

      {route.name === 'dashboard' && (
        <button className="mobile-add-button" type="button" onClick={() => navigate({ name: 'newProduct' })}>
          <Plus className="button-icon" size={20} aria-hidden="true" />
          Añadir producto
        </button>
      )}

      <nav className="mobile-nav" aria-label="Navegación principal móvil">
        {navItems.map((item) => (
          <button
            className={activeSection === item.section ? 'is-active' : ''}
            type="button"
            key={item.section}
            onClick={() => navigate(item.route)}
          >
            <item.Icon className="nav-icon" size={18} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
