import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, MarketItem } from '@/types/market';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        item: MarketItem;
        quantity: number;
        selectedSize?: string;
      }>,
    ) => {
      const { item, quantity, selectedSize } = action.payload;

      const existingItemIndex = state.items.findIndex(
        (cartItem) =>
          cartItem.item.id === item.id &&
          cartItem.selectedSize === selectedSize,
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const price =
          typeof item.fields.Cues === 'string'
            ? parseFloat(item.fields.Cues)
            : (item.fields.Cues as number) || 0;

        const newItem: CartItem = {
          id: `${item.id}-${selectedSize || 'default'}`,
          item,
          quantity,
          selectedSize,
          price,
        };

        state.items.push(newItem);
      }

      // Recalculate totals
      state.total = state.items.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0,
      );
      state.itemCount = state.items.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0,
      );
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        itemId: string;
        selectedSize?: string;
      }>,
    ) => {
      const { itemId, selectedSize } = action.payload;

      state.items = state.items.filter(
        (cartItem) =>
          !(
            cartItem.item.id === itemId &&
            cartItem.selectedSize === selectedSize
          ),
      );

      // Recalculate totals
      state.total = state.items.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0,
      );
      state.itemCount = state.items.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0,
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        itemId: string;
        quantity: number;
        selectedSize?: string;
      }>,
    ) => {
      const { itemId, quantity, selectedSize } = action.payload;

      const itemIndex = state.items.findIndex(
        (cartItem) =>
          cartItem.item.id === itemId && cartItem.selectedSize === selectedSize,
      );

      if (itemIndex > -1) {
        state.items[itemIndex].quantity = quantity;
      }

      // Recalculate totals
      state.total = state.items.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0,
      );
      state.itemCount = state.items.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0,
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
