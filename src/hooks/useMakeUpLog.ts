import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createProduct,
  fetchMakeUpLogData,
  patchProduct,
  removeCategory,
  removeProduct,
  saveCategory,
  saveProduct,
} from '../services/makeUpLogRepository';
import { Category, CategoryGroup, Product, ProductDraft } from '../types';

export function useMakeUpLog(userId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!userId) {
      setProducts([]);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchMakeUpLogData(userId);
      setProducts(data.products);
      setCategories(data.categories);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se han podido cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  function findCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error('Selecciona una categoría válida.');
    }

    return category;
  }

  async function addProduct(draft: ProductDraft) {
    if (!userId) throw new Error('Inicia sesión para guardar productos.');
    const product = await createProduct(userId, draft, findCategory(draft.categoryId));
    setProducts((current) => [product, ...current]);
    return product.id;
  }

  async function updateProduct(id: string, draft: ProductDraft) {
    if (!userId) throw new Error('Inicia sesión para editar productos.');
    const product = await saveProduct(id, userId, draft, findCategory(draft.categoryId));
    setProducts((current) => current.map((item) => (item.id === id ? product : item)));
  }

  async function deleteProduct(id: string) {
    if (!userId) throw new Error('Inicia sesión para eliminar productos.');
    await removeProduct(id, userId);
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  async function toggleFavorite(id: string) {
    if (!userId) throw new Error('Inicia sesión para actualizar productos.');
    const currentProduct = products.find((product) => product.id === id);
    if (!currentProduct) return;
    const product = await patchProduct(id, userId, { is_favorite: !currentProduct.isFavorite });
    setProducts((current) => current.map((item) => (item.id === id ? product : item)));
  }

  async function toggleShared(id: string) {
    if (!userId) throw new Error('Inicia sesión para actualizar productos.');
    const currentProduct = products.find((product) => product.id === id);
    if (!currentProduct) return;
    const product = await patchProduct(id, userId, { is_shared: !currentProduct.isShared });
    setProducts((current) => current.map((item) => (item.id === id ? product : item)));
  }

  async function addCategory(name: string, group: CategoryGroup) {
    if (!userId) throw new Error('Inicia sesión para crear categorías.');
    const category = await createCategory(userId, name.trim(), group);
    setCategories((current) => [...current, category]);
  }

  async function updateCategory(id: string, name: string, group: CategoryGroup) {
    if (!userId) throw new Error('Inicia sesión para editar categorías.');
    const category = await saveCategory(id, userId, name.trim(), group);
    setCategories((current) => current.map((item) => (item.id === id ? category : item)));
    setProducts((current) =>
      current.map((product) =>
        product.categoryId === id ? { ...product, categoryName: category.name, group: category.group, updatedAt: new Date().toISOString() } : product,
      ),
    );
  }

  async function deleteCategory(id: string) {
    if (!userId) throw new Error('Inicia sesión para eliminar categorías.');
    await removeCategory(id, userId);
    setCategories((current) => current.filter((category) => category.id !== id));
  }

  return {
    products,
    categories,
    brands,
    isLoading,
    error,
    reload: loadData,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFavorite,
    toggleShared,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
