export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export type FilterState = {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: SortOption;
  search: string;
};
