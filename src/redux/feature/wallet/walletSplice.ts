import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../../constants/types';

export interface WalletState {
  message: string | null;
  wallet: Wallet | null;
  showEnterPinDrawer: boolean;
}

const initialState: WalletState = {
  message: null,
  wallet: null,
  showEnterPinDrawer: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    handleCreateWallet: (
      state,
      action: PayloadAction<{ message: string; data: Wallet }>,
    ) => {
      state.message = action.payload.message;
      state.wallet = action.payload.data;
    },
    handleSendFund: (
      state,
      action: PayloadAction<{ message: string; data: Wallet }>,
    ) => {
      state.message = action.payload.message;
      state.wallet = action.payload.data;
    },
    handleEnterPinDrawer: (state) => {
      state.showEnterPinDrawer = !state.showEnterPinDrawer;
    },
    handleGetWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload;
    },
  },
});

export const {
  handleCreateWallet,
  handleSendFund,
  handleEnterPinDrawer,
  handleGetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
