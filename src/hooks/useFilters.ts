import { useState, useMemo } from 'react';
import { FilterState, SortOption, Product } from '@/types';
import { products } from '@/lib/data';
import { sortByFeatured } from '@/lib/productSorter';

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

  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredProducts = useMemo<Product[]>(() => {
    let result = [...products];

    // --- Text search ---
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q))
      );
    }

    // --- Category ---
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // --- Price range ---
    result = result.filter(
      p => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // --- In-stock filter ---
    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    // --- Sorting ---
    switch (filters.sortBy as SortOption) {
      case 'featured':
        // Use complex multi-factor algorithm for the default "featured" order
        result = sortByFeatured(result);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => {
          // Secondary sort by review count to break ties
          const diff = b.rating - a.rating;
          return diff !== 0 ? diff : b.reviewCount - a.reviewCount;
        });
        break;
      case 'newest':
        result.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
        break;
      default:
        result = sortByFeatured(result);
        break;
    }

    return result;
  }, [filters]);

  return { filters, updateFilter, resetFilters, filteredProducts };
}
