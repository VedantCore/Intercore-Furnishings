import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  isOpen: false,
  items: [
    // Pre-loaded for testing the checkout UI. Remove this default item later!
    { id: "1", name: "The Minimalist Lounge", price: 12500, quantity: 1 }
  ],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity === 0 
      ? state.items.filter(i => i.id !== id) 
      : state.items.map(i => i.id === id ? { ...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
  cartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}));