import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <span>ShopHub</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Your one-stop destination for quality products at great prices. Shop with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
              <li><Link to="/products?category=sports" className="hover:text-white transition-colors">Sports</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-white transition-colors">FAQ</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Shipping</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Returns</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 ShopHub. All rights reserved.</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> for shoppers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
