import { groupLabels } from '../data';
import { Category, ProductFiltersState } from '../types';

type ProductFiltersProps = {
  filters: ProductFiltersState;
  categories: Category[];
  brands: string[];
  onChange: (filters: ProductFiltersState) => void;
};

export function ProductFilters({ filters, categories, brands, onChange }: ProductFiltersProps) {
  const update = <K extends keyof ProductFiltersState>(key: K, value: ProductFiltersState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="filters" aria-label="Filtros de productos">
      <label>
        Buscar
        <input value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Nombre, marca, tono o notas" />
      </label>
      <label>
        Categoría
        <select value={filters.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Grupo
        <select value={filters.group} onChange={(event) => update('group', event.target.value as ProductFiltersState['group'])}>
          <option value="">Todos</option>
          {Object.entries(groupLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Marca
        <select value={filters.brand} onChange={(event) => update('brand', event.target.value)}>
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>
      <label>
        Valoración mínima
        <input min="1" max="10" type="number" value={filters.minRating} onChange={(event) => update('minRating', event.target.value)} />
      </label>
      <label>
        Orden
        <select value={filters.sort} onChange={(event) => update('sort', event.target.value as ProductFiltersState['sort'])}>
          <option value="recent">Mas recientes</option>
          <option value="name">Nombre</option>
          <option value="brand">Marca</option>
          <option value="ratingDesc">Valoración más alta</option>
          <option value="ratingAsc">Valoración más baja</option>
          <option value="price">Precio</option>
        </select>
      </label>
      <label className="check-row">
        <input type="checkbox" checked={filters.favoritesOnly} onChange={(event) => update('favoritesOnly', event.target.checked)} />
        Solo favoritos
      </label>
    </section>
  );
}
