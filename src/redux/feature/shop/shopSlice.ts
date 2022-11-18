import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShopState {
  message: string | null;
  products: {} | null;
}

const initialState: ShopState = {
  message: null,
  products: null,
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    onCreateProduct: (
      state,
      action: PayloadAction<{ message: string; data: {} }>,
    ) => {
      state.message = action.payload.message;
      state.products = action.payload.data;
    },
  },
});

export const { onCreateProduct } = shopSlice.actions;

export default shopSlice.reducer;
