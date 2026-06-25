import { useEffect, useMemo, useState } from 'react';
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

  async function runAction(action: () => Promise<void>) {
    setActionError('');
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No se ha podido completar la accion.');
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

  if (auth.isLoading) {
    return <main className="status-page">Cargando sesion...</main>;
  }

  if (!auth.user) {
    return <LoginScreen onSignIn={auth.signInWithGoogle} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand-button" type="button" onClick={() => navigate({ name: 'dashboard' })}>
          MakeUpLog
        </button>
        <nav aria-label="Navegacion principal">
          <button type="button" onClick={() => navigate({ name: 'products' })}>Productos</button>
          <button type="button" onClick={() => navigate({ name: 'favorites' })}>Favoritos</button>
          <button type="button" onClick={() => navigate({ name: 'categories' })}>Categorias</button>
          <button type="button" onClick={() => navigate({ name: 'shareList' })}>Lista</button>
          <button type="button" onClick={auth.signOut}>Salir</button>
        </nav>
      </header>

      <main>
        {(store.error || actionError) && (
          <div className="notice-panel" role="alert">
            {store.error || actionError}
          </div>
        )}
        {store.isLoading && <div className="notice-panel">Cargando datos...</div>}

        {route.name === 'dashboard' && (
          <div className="page-stack">
            <section className="page-heading">
              <p className="eyebrow">Catalogo privado</p>
              <h1>Tu registro de belleza</h1>
              <p>Productos, valoraciones, favoritos e ideas para regalar en un unico lugar.</p>
            </section>
            <DashboardSummary products={store.products} />
            <section className="quick-actions" aria-label="Accesos rapidos">
              <button className="primary-button" type="button" onClick={() => navigate({ name: 'newProduct' })}>Anadir producto</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'products' })}>Ver productos</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'favorites' })}>Ver favoritos</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'categories' })}>Gestionar categorias</button>
              <button className="secondary-button" type="button" onClick={() => navigate({ name: 'shareList' })}>Lista compartible</button>
            </section>
            <section>
              <h2>Ultimos productos</h2>
              <ProductList
                products={recentProducts}
                emptyText="Todavia no has registrado ningun producto. Anade el primero para empezar tu coleccion."
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
                <p>Busca, filtra y ordena tu catalogo.</p>
              </section>
              <button className="primary-button" type="button" onClick={() => navigate({ name: 'newProduct' })}>Anadir</button>
            </div>
            <ProductFilters filters={filters} categories={store.categories} brands={store.brands} onChange={setFilters} />
            <ProductList
              products={visibleProducts}
              emptyText={store.products.length === 0 ? 'Todavia no has registrado ningun producto. Anade el primero para empezar tu coleccion.' : 'No se han encontrado productos con esos filtros.'}
              onOpen={(id) => navigate({ name: 'productDetail', id })}
              onToggleFavorite={(id) => runAction(() => store.toggleFavorite(id))}
              onToggleShared={(id) => runAction(() => store.toggleShared(id))}
            />
          </div>
        )}

        {route.name === 'newProduct' && (
          <div className="page-stack narrow">
            <section className="page-heading">
              <h1>Anadir producto</h1>
            </section>
            <ProductForm
              categories={store.categories}
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
              <p>Productos que mas te gustan o que repetirias.</p>
            </section>
            <ProductList
              products={favoriteProducts}
              emptyText="Todavia no has marcado favoritos. Cuando valores tus productos, apareceran aqui los que mas te gustan."
              onOpen={(id) => navigate({ name: 'productDetail', id })}
              onToggleFavorite={(id) => runAction(() => store.toggleFavorite(id))}
              onToggleShared={(id) => runAction(() => store.toggleShared(id))}
            />
          </div>
        )}

        {route.name === 'categories' && (
          <div className="page-stack">
            <section className="page-heading">
              <h1>Categorias</h1>
              <p>Crea y ajusta categorias para productos futuros.</p>
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
    </div>
  );
}
