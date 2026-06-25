export type CategoryGroup = 'makeup' | 'skincare' | 'hair' | 'other';

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  group: CategoryGroup;
  price?: number;
  shade?: string;
  rating?: number;
  isFavorite: boolean;
  isShared: boolean;
  mainImage?: string;
  extraImages?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  group: CategoryGroup;
  createdAt: string;
};

export type ProductDraft = Omit<Product, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>;

export type SortKey = 'recent' | 'name' | 'brand' | 'ratingDesc' | 'ratingAsc' | 'price';

export type ProductFiltersState = {
  query: string;
  categoryId: string;
  group: '' | CategoryGroup;
  brand: string;
  favoritesOnly: boolean;
  minRating: string;
  sort: SortKey;
};
