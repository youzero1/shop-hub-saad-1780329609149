import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';

type ProductCardProps = { product: Product };

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const { toggleWishlist, isWishlisted } = useWishlistContext();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <button
          onClick={() => toggleWishlist(product)}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full bg-white shadow transition-colors',
            wishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
          )}
        >
          <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className={cn(
              'p-2 rounded-full transition-colors',
              product.inStock
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
