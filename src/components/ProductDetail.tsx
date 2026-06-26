import { ArrowLeft, Gift, Pencil, Trash2 } from 'lucide-react';
import { groupLabels } from '../data';
import { Product } from '../types';
import { formatPrice, ratingText } from '../utils/products';
import { FavoriteButton } from './FavoriteButton';
import { RatingBadge } from './RatingBadge';

type ProductDetailProps = {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onToggleShared: () => void;
};

export function ProductDetail({ product, onBack, onEdit, onDelete, onToggleFavorite, onToggleShared }: ProductDetailProps) {
  return (
    <div className="detail-layout">
      <button className="text-link" type="button" onClick={onBack}>
        <ArrowLeft className="button-icon" size={18} aria-hidden="true" />
        Volver
      </button>
      <section className="detail-hero">
        <div className="detail-image">
          {product.mainImage ? <img src={product.mainImage} alt={`Producto ${product.name}`} /> : <span>Sin foto</span>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <div className="button-row">
            <FavoriteButton isFavorite={product.isFavorite} onClick={onToggleFavorite} />
            <button className="icon-button" type="button" onClick={onToggleShared} aria-pressed={product.isShared}>
              <Gift className="button-icon" size={18} aria-hidden="true" />
              {product.isShared ? 'En lista' : 'Compartir'}
            </button>
          </div>
          <dl className="detail-list">
            <div><dt>Categoría</dt><dd>{product.categoryName}</dd></div>
            <div><dt>Grupo</dt><dd>{groupLabels[product.group]}</dd></div>
            <div><dt>Precio</dt><dd>{product.price !== undefined ? formatPrice(product.price) : 'Sin precio'}</dd></div>
            <div><dt>Tono</dt><dd>{product.shade || 'Sin tono'}</dd></div>
            <div><dt>Valoración</dt><dd><RatingBadge rating={product.rating} /> {ratingText(product.rating)}</dd></div>
          </dl>
          {product.notes && <p className="notes">{product.notes}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onEdit}><Pencil className="button-icon" size={18} aria-hidden="true" />Editar</button>
            <button className="danger-button" type="button" onClick={onDelete}><Trash2 className="button-icon" size={18} aria-hidden="true" />Eliminar</button>
          </div>
        </div>
      </section>
      {product.extraImages && product.extraImages.length > 0 && (
        <section>
          <h2>Fotos extra</h2>
          <div className="gallery-grid">
            {product.extraImages.map((image, index) => (
              <img key={`${image.slice(0, 24)}-${index}`} src={image} alt={`Foto extra ${index + 1} de ${product.name}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
