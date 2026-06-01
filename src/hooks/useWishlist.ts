import { useState, useEffect } from 'react';
import { Product } from '@/types';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlist.some(p => p.id === productId);
  };

  return { wishlist, toggleWishlist, isWishlisted };
}
