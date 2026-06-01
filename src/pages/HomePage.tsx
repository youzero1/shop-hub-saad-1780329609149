import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const featured = products.filter(p => p.rating >= 4.6).slice(0, 4);
  const onSale = products.filter(p => p.originalPrice).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🎉 New arrivals every week
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Shop the <br />
              <span className="text-yellow-300">Best Deals</span>
            </h1>
            <p className="text-indigo-200 text-lg mb-8 max-w-md">
              Discover thousands of products at unbeatable prices. Free shipping on orders over $50.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=electronics"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                View Electronics
              </Link>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm">
            {products.slice(0, 4).map(p => (
              <Link key={p.id} to={`/products/${p.id}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-3">
              <div className="bg-indigo-100 rounded-xl p-2.5 shrink-0">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.filter(c => c.id !== 'all').map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-indigo-700 transition-all shadow-sm"
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
          <Link to="/products?sort=rating" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* On Sale */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 On Sale</h2>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {onSale.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-indigo-200 mb-6">Get exclusive deals and new arrivals delivered to your inbox.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
