// src/store/useCartStore.ts
import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Tracks if sidebar is open
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  
  addItem: (newItem: CartItem) => set((state: CartState) => {
    const existingItem = state.items.find((item: CartItem) => item.id === newItem.id);
    if (existingItem) {
      return {
        items: state.items.map((item: CartItem) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isOpen: true,
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }], isOpen: true };
  }),

  removeItem: (id: string) => set((state: CartState) => ({
    items: state.items.filter((item: CartItem) => item.id !== id)
  })),

  clearCart: () => set({ items: [] }),
  cartTotal: () => (get() as CartState).items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0),
  cartCount: () => (get() as CartState).items.reduce((count: number, item: CartItem) => count + item.quantity, 0),
  
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));