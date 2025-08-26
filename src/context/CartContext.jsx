import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { allProducts } from '@/components/catalog/productsData';

const useCartStore = create(
  persist(
    (set, get) => ({
      itemIds: [],
      isInitialized: false,
      
      initialize: () => {
        const { isInitialized } = get();
        if (!isInitialized) {
          const currentIds = get().itemIds;
          if (currentIds.length === 0) {
            set({ itemIds: [allProducts[0].id, allProducts[1].id, allProducts[2].id], isInitialized: true });
          } else {
            set({ isInitialized: true });
          }
        }
      },

      add: (product, quantity) => {
        const newIds = Array(quantity).fill(product.id);
        set((state) => ({ itemIds: [...state.itemIds, ...newIds] }));
      },

      update: (id, quantity) => {
        set((state) => {
          const otherIds = state.itemIds.filter(itemId => itemId !== id);
          const newIds = Array(quantity).fill(id);
          return { itemIds: [...otherIds, ...newIds] };
        });
      },

      remove: (id) => {
        set((state) => ({
          itemIds: state.itemIds.filter((itemId) => itemId !== id),
        }));
      },

      clear: () => {
        set({ itemIds: [] });
      },

      get groupedItems() {
        const itemMap = get().itemIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        return Object.entries(itemMap).map(([id, qty]) => {
          const product = allProducts.find(p => p.id === parseInt(id));
          return { ...product, qty };
        }).filter(Boolean);
      },

      get count() {
        return get().itemIds.length;
      },

      get subtotal() {
        return get().groupedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      },
    }),
    {
      name: 'botocoin_cart_ids',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ itemIds: state.itemIds }),
    }
  )
);

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const store = useCartStore();
  
  useEffect(() => {
    store.initialize();
  }, [store]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};