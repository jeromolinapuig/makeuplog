import { FormEvent, useState } from 'react';
import { groupLabels } from '../data';
import { Category, CategoryGroup, Product } from '../types';

type CategoryManagerProps = {
  categories: Category[];
  products: Product[];
  onAdd: (name: string, group: CategoryGroup) => void | Promise<void>;
  onUpdate: (id: string, name: string, group: CategoryGroup) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export function CategoryManager({ categories, products, onAdd, onUpdate, onDelete }: CategoryManagerProps) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState<CategoryGroup>('makeup');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setMessage('Escribe un nombre de categoría.');
      return;
    }

    try {
      if (editingId) {
        await onUpdate(editingId, name, group);
        setEditingId(null);
      } else {
        await onAdd(name, group);
      }
      setName('');
      setGroup('makeup');
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se ha podido guardar la categoría.');
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setGroup(category.group);
    setMessage('');
  }

  async function remove(category: Category) {
    const usage = products.filter((product) => product.categoryId === category.id).length;
    if (usage > 0) {
      setMessage(`No se puede eliminar "${category.name}" porque tiene ${usage} producto(s) asociados.`);
      return;
    }
    try {
      await onDelete(category.id);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se ha podido eliminar la categoría.');
    }
  }

  return (
    <div className="manager-layout">
      <form className="inline-form" onSubmit={submit}>
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Grupo
          <select value={group} onChange={(event) => setGroup(event.target.value as CategoryGroup)}>
            {Object.entries(groupLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button" type="submit">
          {editingId ? 'Guardar categoría' : 'Crear categoría'}
        </button>
      </form>
      {message && <p className="notice">{message}</p>}
      <div className="category-list">
        {categories.map((category) => (
          <article key={category.id} className="category-item">
            <div>
              <strong>{category.name}</strong>
              <span>{groupLabels[category.group]}</span>
            </div>
            <div className="button-row">
              <button className="small-button" type="button" onClick={() => startEdit(category)}>Editar</button>
              <button className="small-button" type="button" onClick={() => remove(category)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
