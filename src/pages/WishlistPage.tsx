import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlistContext } from '@/context/WishlistContext';
import { useCartContext } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
        <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wishlist ({wishlist.length} items)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlist.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative">
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-800 text-sm hover:text-indigo-600 line-clamp-2 mb-1">{product.name}</h3>
              </Link>
              <p className="text-xs text-gray-400 capitalize mb-3">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
