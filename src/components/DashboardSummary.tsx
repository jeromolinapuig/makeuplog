import { Product } from '../types';

type DashboardSummaryProps = {
  products: Product[];
};

export function DashboardSummary({ products }: DashboardSummaryProps) {
  const favorites = products.filter((product) => product.isFavorite).length;
  const categoryCounts = products.reduce<Record<string, number>>((counts, product) => {
    counts[product.categoryName] = (counts[product.categoryName] ?? 0) + 1;
    return counts;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin datos';

  return (
    <section className="summary-grid" aria-label="Resumen">
      <div>
        <span>Total</span>
        <strong>{products.length}</strong>
      </div>
      <div>
        <span>Favoritos</span>
        <strong>{favorites}</strong>
      </div>
      <div>
        <span>Categoria principal</span>
        <strong>{topCategory}</strong>
      </div>
    </section>
  );
}
