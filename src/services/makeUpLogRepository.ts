import { initialCategories } from '../data';
import { supabase } from '../lib/supabase';
import { Category, CategoryGroup, Product, ProductDraft } from '../types';

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  group_name: CategoryGroup;
  created_at: string;
};

type ProductRow = {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  category_id: string;
  category_name: string;
  group_name: CategoryGroup;
  price: number | null;
  shade: string | null;
  rating: number | null;
  is_favorite: boolean;
  is_shared: boolean;
  purchase_date: string | null;
  main_image: string | null;
  extra_images: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.');
  }

  return supabase;
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    group: row.group_name,
    createdAt: row.created_at,
  };
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    categoryId: row.category_id,
    categoryName: row.category_name,
    group: row.group_name,
    price: row.price ?? undefined,
    shade: row.shade ?? undefined,
    rating: row.rating ?? undefined,
    isFavorite: row.is_favorite,
    isShared: row.is_shared,
    purchaseDate: row.purchase_date ?? undefined,
    mainImage: row.main_image ?? undefined,
    extraImages: row.extra_images ?? [],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function productPayload(draft: ProductDraft, category: Category, userId: string) {
  return {
    user_id: userId,
    name: draft.name,
    brand: draft.brand,
    category_id: draft.categoryId,
    category_name: category.name,
    group_name: category.group,
    price: draft.price ?? null,
    shade: draft.shade ?? null,
    rating: draft.rating ?? null,
    is_favorite: draft.isFavorite,
    is_shared: draft.isShared,
    purchase_date: draft.purchaseDate ?? null,
    main_image: draft.mainImage ?? null,
    extra_images: draft.extraImages ?? [],
    notes: draft.notes ?? null,
  };
}

export async function fetchMakeUpLogData(userId: string) {
  const client = requireSupabase();
  const [{ data: categoryRows, error: categoryError }, { data: productRows, error: productError }] = await Promise.all([
    client.from('makeuplog_categories').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    client.from('makeuplog_products').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);

  if (categoryError) throw categoryError;
  if (productError) throw productError;

  let categories = (categoryRows as CategoryRow[]).map(toCategory);

  if (categories.length === 0) {
    const { data, error } = await client
      .from('makeuplog_categories')
      .insert(initialCategories.map((category) => ({ user_id: userId, name: category.name, group_name: category.group })))
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    categories = (data as CategoryRow[]).map(toCategory);
  }

  return {
    categories,
    products: (productRows as ProductRow[]).map(toProduct),
  };
}

export async function createProduct(userId: string, draft: ProductDraft, category: Category) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('makeuplog_products')
    .insert(productPayload(draft, category, userId))
    .select('*')
    .single();

  if (error) throw error;
  return toProduct(data as ProductRow);
}

export async function saveProduct(id: string, userId: string, draft: ProductDraft, category: Category) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('makeuplog_products')
    .update({ ...productPayload(draft, category, userId), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return toProduct(data as ProductRow);
}

export async function removeProduct(id: string, userId: string) {
  const client = requireSupabase();
  const { error } = await client.from('makeuplog_products').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function patchProduct(id: string, userId: string, patch: Partial<Pick<ProductRow, 'is_favorite' | 'is_shared'>>) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('makeuplog_products')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return toProduct(data as ProductRow);
}

export async function createCategory(userId: string, name: string, group: CategoryGroup) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('makeuplog_categories')
    .insert({ user_id: userId, name, group_name: group })
    .select('*')
    .single();

  if (error) throw error;
  return toCategory(data as CategoryRow);
}

export async function saveCategory(id: string, userId: string, name: string, group: CategoryGroup) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('makeuplog_categories')
    .update({ name, group_name: group })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;

  const { error: productsError } = await client
    .from('makeuplog_products')
    .update({ category_name: name, group_name: group, updated_at: new Date().toISOString() })
    .eq('category_id', id)
    .eq('user_id', userId);

  if (productsError) throw productsError;
  return toCategory(data as CategoryRow);
}

export async function removeCategory(id: string, userId: string) {
  const client = requireSupabase();
  const { error } = await client.from('makeuplog_categories').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}
