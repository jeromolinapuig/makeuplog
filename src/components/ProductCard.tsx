import { Product } from '../types';
import { formatPrice } from '../utils/products';
import { RatingBadge } from './RatingBadge';

type ProductCardProps = {
  product: Product;
  onOpen: () => void;
  onToggleFavorite: () => void;
  onToggleShared: () => void;
};

export function ProductCard({ product, onOpen, onToggleFavorite, onToggleShared }: ProductCardProps) {
  return (
    <article className="product-card">
      <button className="product-card__media" type="button" onClick={onOpen} aria-label={`Ver detalle de ${product.name}`}>
        {product.mainImage ? <img src={product.mainImage} alt={`Producto ${product.name}`} /> : <span>{product.brand.slice(0, 1)}{product.name.slice(0, 1)}</span>}
      </button>
      <div className="product-card__body">
        <div>
          <button className="text-link product-card__title" type="button" onClick={onOpen}>
            {product.name}
          </button>
          <p>{product.brand}</p>
        </div>
        <div className="meta-row">
          <span>{product.categoryName}</span>
          {product.shade && <span>Tono {product.shade}</span>}
        </div>
        <div className="product-card__footer">
          <RatingBadge rating={product.rating} />
          {product.price !== undefined && <span>{formatPrice(product.price)}</span>}
        </div>
        <div className="button-row">
          <button className="small-button" type="button" onClick={onToggleFavorite} aria-pressed={product.isFavorite}>
            {product.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
          </button>
          <button className="small-button" type="button" onClick={onToggleShared} aria-pressed={product.isShared}>
            {product.isShared ? 'Quitar de lista' : 'Compartir'}
          </button>
        </div>
      </div>
    </article>
  );
}
