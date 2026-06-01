import { createContext, useContext, ReactNode } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types';

type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType>(null as any);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlist = useWishlist();
  return <WishlistContext.Provider value={wishlist}>{children}</WishlistContext.Provider>;
}

export function useWishlistContext(): WishlistContextType {
  return useContext(WishlistContext);
}
