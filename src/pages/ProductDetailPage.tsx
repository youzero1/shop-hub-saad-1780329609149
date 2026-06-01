import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Truck, RotateCcw, ArrowLeft, Plus, Minus } from 'lucide-react';
import { products } from '@/lib/data';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const { toggleWishlist, isWishlisted } = useWishlistContext();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Badge variant="default">{product.category}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Quantity */}
          {product.inStock && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              fullWidth
              className="gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                'p-3 rounded-xl border transition-colors',
                wishlisted
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500'
              )}
            >
              <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Shipping info */}
          <div className="space-y-3 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
