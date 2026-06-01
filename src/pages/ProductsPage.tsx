import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/product/FilterSidebar';

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { filters, updateFilter, resetFilters, filteredProducts } = useFilters();

  // Sync URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) updateFilter('category', category);
    if (search) updateFilter('search', search);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products found</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter('search', e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
