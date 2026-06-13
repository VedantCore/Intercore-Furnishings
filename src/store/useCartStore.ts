import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;     // Fixed: Renamed from isCartOpen
  cartTotal: number;   // Fixed: Added to satisfy your checkout and sidebar
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Helper function to keep the total perfectly accurate on every action
const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// 2. Store Implementation
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      cartTotal: 0, 
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        let newItems;
        
        if (existingItem) {
          newItems = currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...currentItems, { ...item, quantity: 1 }];
        }
        
        // Save items, auto-open the sidebar, and update the total!
        set({ 
          items: newItems, 
          isOpen: true, 
          cartTotal: calculateTotal(newItems) 
        });
      },
      
      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ items: newItems, cartTotal: calculateTotal(newItems) });
      },
      
      updateQuantity: (id, quantity) => {
        const newItems = get().items.map((i) => (i.id === id ? { ...i, quantity } : i));
        set({ items: newItems, cartTotal: calculateTotal(newItems) });
      },
      
      clearCart: () => set({ items: [], cartTotal: 0 }),
    }),
    { name: 'cart-storage' }
  )
);