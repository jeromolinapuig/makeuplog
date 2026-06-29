import { FormEvent, useState } from 'react';
import { Check, Copy, Plus } from 'lucide-react';
import { GiftIdeaDraft, Product } from '../types';
import { buildShareText } from '../utils/products';
import { EmptyState } from './EmptyState';
import { ImageUploader } from './ImageUploader';

type ShareListProps = {
  products: Product[];
  onOpen: (id: string) => void;
  onAddGiftIdea: (draft: GiftIdeaDraft) => void | Promise<void>;
};

type GiftFormErrors = Partial<Record<'name' | 'store' | 'price', string>>;

const emptyGiftDraft: GiftIdeaDraft = {
  name: '',
  store: '',
  price: undefined,
  image: '',
};

export function ShareList({ products, onOpen, onAddGiftIdea }: ShareListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<GiftIdeaDraft>(emptyGiftDraft);
  const [errors, setErrors] = useState<GiftFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const text = buildShareText(products);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  function update<K extends keyof GiftIdeaDraft>(key: K, value: GiftIdeaDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: GiftFormErrors = {};
    if (!draft.name.trim()) nextErrors.name = 'El nombre es obligatorio.';
    if (!draft.store.trim()) nextErrors.store = 'La tienda o marca es obligatoria.';
    if (draft.price !== undefined && draft.price < 0) nextErrors.price = 'El precio no puede ser negativo.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitGiftIdea(event: FormEvent) {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      await onAddGiftIdea({
        name: draft.name.trim(),
        store: draft.store.trim(),
        price: draft.price === undefined || Number.isNaN(draft.price) ? undefined : draft.price,
        image: draft.image || undefined,
      });
      setDraft(emptyGiftDraft);
      setErrors({});
      setIsAdding(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se ha podido guardar la idea.');
    }
  }

  return (
    <div className="share-layout">
      <button className="primary-button share-add-button" type="button" onClick={() => setIsAdding((current) => !current)} aria-expanded={isAdding}>
        <Plus className="button-icon" size={18} aria-hidden="true" />
        Añadir idea
      </button>

      {isAdding && (
        <form className="gift-idea-form" onSubmit={submitGiftIdea} noValidate>
          <div className="form-grid">
            <label>
              Producto
              <input value={draft.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              Tienda o marca
              <input value={draft.store} onChange={(event) => update('store', event.target.value)} aria-invalid={Boolean(errors.store)} />
              {errors.store && <span className="field-error">{errors.store}</span>}
            </label>
            <label>
              Precio
              <input min="0" step="0.01" type="number" value={draft.price ?? ''} onChange={(event) => update('price', event.target.value === '' ? undefined : Number(event.target.value))} />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </label>
          </div>
          <ImageUploader label="Foto" images={draft.image ? [draft.image] : []} onChange={(images) => update('image', images[0] ?? '')} />
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => setIsAdding(false)}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              Guardar en lista
            </button>
          </div>
          {submitError && <p className="field-error">{submitError}</p>}
        </form>
      )}

      {products.length === 0 ? (
        <EmptyState title="Todavia no has anadido productos a la lista para compartir." />
      ) : (
        <>
          <textarea readOnly rows={Math.min(10, products.length + 1)} value={text} aria-label="Texto para compartir" />
          <button className="primary-button" type="button" onClick={copy}>
            {copied ? <Check className="button-icon" size={18} aria-hidden="true" /> : <Copy className="button-icon" size={18} aria-hidden="true" />}
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
        </>
      )}
    </div>
  );
}
