import { useState, useMemo } from 'react';
import { FilterState, SortOption, Product } from '@/types';
import { products } from '@/lib/data';

const defaultFilters: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  inStock: false,
  sortBy: 'featured',
  search: '',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredProducts = useMemo<Product[]>(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q))
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    switch (filters.sortBy as SortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  return { filters, updateFilter, resetFilters, filteredProducts };
}
