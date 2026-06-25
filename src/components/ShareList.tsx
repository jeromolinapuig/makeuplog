import { useState } from 'react';
import { Product } from '../types';
import { buildShareText } from '../utils/products';
import { EmptyState } from './EmptyState';

type ShareListProps = {
  products: Product[];
  onOpen: (id: string) => void;
};

export function ShareList({ products, onOpen }: ShareListProps) {
  const [copied, setCopied] = useState(false);
  const text = buildShareText(products);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  if (products.length === 0) {
    return <EmptyState title="Todavía no has añadido productos a la lista para compartir." />;
  }

  return (
    <div className="share-layout">
      <textarea readOnly rows={Math.min(10, products.length + 1)} value={text} aria-label="Texto para compartir" />
      <button className="primary-button" type="button" onClick={copy}>
        {copied ? 'Copiado' : 'Copiar lista'}
      </button>
      <div className="share-items">
        {products.map((product) => (
          <button className="share-item" type="button" key={product.id} onClick={() => onOpen(product.id)}>
            <strong>{product.brand} - {product.name}</strong>
            <span>{product.categoryName}{product.shade ? `, tono ${product.shade}` : ''}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
