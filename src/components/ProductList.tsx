import { Product } from '../types';
import { EmptyState } from './EmptyState';
import { ProductCard } from './ProductCard';

type ProductListProps = {
  products: Product[];
  emptyText: string;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleShared: (id: string) => void;
};

export function ProductList({ products, emptyText, onOpen, onToggleFavorite, onToggleShared }: ProductListProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyText} />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpen={() => onOpen(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
          onToggleShared={() => onToggleShared(product.id)}
        />
      ))}
    </div>
  );
}
