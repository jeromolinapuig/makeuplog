import { FormEvent, useMemo, useState } from 'react';
import { groupLabels } from '../data';
import { Category, Product, ProductDraft } from '../types';
import { ImageUploader } from './ImageUploader';

type ProductFormProps = {
  categories: Category[];
  product?: Product;
  onSubmit: (draft: ProductDraft) => void | Promise<void>;
  onCancel: () => void;
};

type FormErrors = Partial<Record<'name' | 'brand' | 'categoryId' | 'price' | 'rating', string>>;

const emptyDraft: ProductDraft = {
  name: '',
  brand: '',
  categoryId: '',
  group: 'makeup',
  price: undefined,
  shade: '',
  rating: undefined,
  isFavorite: false,
  isShared: false,
  purchaseDate: '',
  mainImage: '',
  extraImages: [],
  notes: '',
};

export function ProductForm({ categories, product, onSubmit, onCancel }: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(() =>
    product
      ? {
          name: product.name,
          brand: product.brand,
          categoryId: product.categoryId,
          group: product.group,
          price: product.price,
          shade: product.shade ?? '',
          rating: product.rating,
          isFavorite: product.isFavorite,
          isShared: product.isShared,
          purchaseDate: product.purchaseDate ?? '',
          mainImage: product.mainImage ?? '',
          extraImages: product.extraImages ?? [],
          notes: product.notes ?? '',
        }
      : emptyDraft,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');

  const visibleCategories = useMemo(() => categories.filter((category) => category.group === draft.group), [categories, draft.group]);

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: FormErrors = {};
    if (!draft.name.trim()) nextErrors.name = 'El nombre es obligatorio.';
    if (!draft.brand.trim()) nextErrors.brand = 'La marca es obligatoria.';
    if (!draft.categoryId) nextErrors.categoryId = 'Selecciona una categoria.';
    if (draft.price !== undefined && draft.price < 0) nextErrors.price = 'El precio no puede ser negativo.';
    if (draft.rating !== undefined && (draft.rating < 1 || draft.rating > 10)) nextErrors.rating = 'La valoracion debe estar entre 1 y 10.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      await onSubmit({
        ...draft,
        name: draft.name.trim(),
        brand: draft.brand.trim(),
        shade: draft.shade?.trim() || undefined,
        notes: draft.notes?.trim() || undefined,
        purchaseDate: draft.purchaseDate || undefined,
        price: draft.price === undefined || Number.isNaN(draft.price) ? undefined : draft.price,
        rating: draft.rating === undefined || Number.isNaN(draft.rating) ? undefined : draft.rating,
        mainImage: draft.mainImage || undefined,
        extraImages: draft.extraImages?.filter(Boolean) ?? [],
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se ha podido guardar el producto.');
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Nombre del producto
          <input value={draft.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Marca
          <input value={draft.brand} onChange={(event) => update('brand', event.target.value)} aria-invalid={Boolean(errors.brand)} />
          {errors.brand && <span className="field-error">{errors.brand}</span>}
        </label>
        <label>
          Grupo
          <select
            value={draft.group}
            onChange={(event) => {
              update('group', event.target.value as ProductDraft['group']);
              update('categoryId', '');
            }}
          >
            {Object.entries(groupLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoria
          <select value={draft.categoryId} onChange={(event) => update('categoryId', event.target.value)} aria-invalid={Boolean(errors.categoryId)}>
            <option value="">Selecciona categoria</option>
            {visibleCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
        </label>
        <label>
          Precio habitual
          <input min="0" step="0.01" type="number" value={draft.price ?? ''} onChange={(event) => update('price', event.target.value === '' ? undefined : Number(event.target.value))} />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </label>
        <label>
          Tono
          <input value={draft.shade ?? ''} onChange={(event) => update('shade', event.target.value)} />
        </label>
        <label>
          Valoracion
          <input min="1" max="10" type="number" value={draft.rating ?? ''} onChange={(event) => update('rating', event.target.value === '' ? undefined : Number(event.target.value))} />
          {errors.rating && <span className="field-error">{errors.rating}</span>}
        </label>
        <label>
          Fecha de compra
          <input type="date" value={draft.purchaseDate ?? ''} onChange={(event) => update('purchaseDate', event.target.value)} />
        </label>
      </div>
      <div className="toggle-grid">
        <label className="check-row">
          <input type="checkbox" checked={draft.isFavorite} onChange={(event) => update('isFavorite', event.target.checked)} />
          Favorito
        </label>
        <label className="check-row">
          <input type="checkbox" checked={draft.isShared} onChange={(event) => update('isShared', event.target.checked)} />
          Compartir en lista
        </label>
      </div>
      <ImageUploader label="Foto principal" images={draft.mainImage ? [draft.mainImage] : []} onChange={(images) => update('mainImage', images[0] ?? '')} />
      <ImageUploader label="Fotos extra" multiple images={draft.extraImages ?? []} onChange={(images) => update('extraImages', images)} />
      <label>
        Notas
        <textarea rows={5} value={draft.notes ?? ''} onChange={(event) => update('notes', event.target.value)} placeholder="Textura, cobertura, duracion, tono..." />
      </label>
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary-button" type="submit">
          {product ? 'Guardar cambios' : 'Anadir producto'}
        </button>
      </div>
      {submitError && <p className="field-error">{submitError}</p>}
    </form>
  );
}
