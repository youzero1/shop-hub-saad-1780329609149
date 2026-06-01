import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', country: 'US',
  cardName: '', cardNumber: '', expiry: '', cvv: '',
};

function InputField({ label, name, value, onChange, placeholder, type = 'text' }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/order-success');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-indigo-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: forms */}
          <div className="flex-1 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                <div className="col-span-2">
                  <InputField label="Email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" type="email" />
                </div>
                <div className="col-span-2">
                  <InputField label="Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" />
                </div>
                <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                <InputField label="State" name="state" value={form.state} onChange={handleChange} placeholder="NY" />
                <InputField label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" />
                <InputField label="Country" name="country" value={form.country} onChange={handleChange} placeholder="US" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900">Payment Details</h2>
                <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" /> Secure
                </div>
              </div>
              <div className="space-y-4">
                <InputField label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} placeholder="John Doe" />
                <InputField label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Expiry Date" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
                  <InputField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-70 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
