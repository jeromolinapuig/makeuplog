import { groupLabels } from '../data';
import { Product, ProductFiltersState } from '../types';

export function formatPrice(price?: number) {
  if (price === undefined || Number.isNaN(price)) {
    return '';
  }

  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

export function ratingText(rating?: number) {
  if (!rating) {
    return 'Sin valorar';
  }

  if (rating <= 3) return 'No repetiria';
  if (rating <= 6) return 'Aceptable';
  if (rating <= 8) return 'Me gusta';
  return 'Favorito / repetiria compra';
}

export function filterAndSortProducts(products: Product[], filters: ProductFiltersState) {
  const query = filters.query.trim().toLowerCase();
  const minRating = filters.minRating ? Number(filters.minRating) : undefined;

  const filtered = products.filter((product) => {
    const searchable = [product.name, product.brand, product.categoryName, product.shade, product.notes].join(' ').toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = !filters.categoryId || product.categoryId === filters.categoryId;
    const matchesGroup = !filters.group || product.group === filters.group;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesFavorite = !filters.favoritesOnly || product.isFavorite;
    const matchesRating = minRating === undefined || (product.rating ?? 0) >= minRating;
    return matchesQuery && matchesCategory && matchesGroup && matchesBrand && matchesFavorite && matchesRating;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === 'name') return a.name.localeCompare(b.name);
    if (filters.sort === 'brand') return a.brand.localeCompare(b.brand);
    if (filters.sort === 'ratingDesc') return (b.rating ?? 0) - (a.rating ?? 0);
    if (filters.sort === 'ratingAsc') return (a.rating ?? 0) - (b.rating ?? 0);
    if (filters.sort === 'price') return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function buildShareText(products: Product[]) {
  return products
    .map((product) => {
      const parts = [
        `${product.brand} - ${product.name}`,
        product.categoryName,
        product.shade ? `Tono: ${product.shade}` : '',
        product.price !== undefined ? `Precio: ${formatPrice(product.price)}` : '',
      ].filter(Boolean);
      return parts.join(' | ');
    })
    .join('\n');
}

export function groupLabel(group: Product['group']) {
  return groupLabels[group];
}
