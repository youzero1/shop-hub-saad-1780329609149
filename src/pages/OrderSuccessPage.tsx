import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

export default function OrderSuccessPage() {
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 inline-block px-4 py-1.5 rounded-full mb-8">
        Order ID: {orderId}
      </p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">What happens next?</h2>
        <div className="space-y-4">
          {[
            { icon: CheckCircle, title: 'Order Confirmed', desc: 'Your order has been placed and is being processed.' },
            { icon: Package, title: 'Preparing Shipment', desc: 'Your items will be packed and shipped within 1-2 business days.' },
            { icon: ShoppingBag, title: 'Delivery', desc: 'Estimated delivery in 3-7 business days.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="bg-indigo-100 rounded-xl p-2 shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
