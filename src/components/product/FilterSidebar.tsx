import { X } from 'lucide-react';
import { FilterState, SortOption } from '@/types';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

type FilterSidebarProps = {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function FilterSidebar({ filters, updateFilter, resetFilters, isOpen, onClose }: FilterSidebarProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white lg:bg-transparent border-r lg:border-0 border-gray-200 p-5 overflow-y-auto transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <h2 className="font-semibold text-gray-800">Filters</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Category</h3>
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id)}
                className={cn(
                  'flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.category === cat.id
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter('minPrice', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Sort By</h3>
          <div className="space-y-1">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateFilter('sortBy', opt.value)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.sortBy === opt.value
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* In stock */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter('inStock', e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </aside>
    </>
  );
}
