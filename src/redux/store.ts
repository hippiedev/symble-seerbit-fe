/* eslint-disable import/no-cycle */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './feature/auth/authSlice';
import eventsReducer from './feature/events/eventsSlice';
import userReducer from './feature/user/userSlice';
import shopReducer from './feature/shop/shopSlice';
import walletReducer from './feature/wallet/walletSplice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    events: eventsReducer,
    user: userReducer,
    shop: shopReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/handleShowEnterPinDrawer'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['user.nextEnterPinAction'],
      },
    }).concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
