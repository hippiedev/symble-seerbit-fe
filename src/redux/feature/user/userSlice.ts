import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../constants/types';

export interface UserState {
  hasPin: boolean;
  hasPreferences: boolean;
  message: string | null;
  user: User | null;
  showEnterPinDrawer: boolean;
  nextEnterPinAction: (() => Promise<void>) | undefined;
  readNotifications: string[] | null;
  bookmarkedProducts: string[] | [];
}

const storedUser = localStorage.getItem('user');
const storedNotifications = localStorage.getItem('notifications');
const storedProductBookmarks = localStorage.getItem('bookmarkedProducts');

const initialState: UserState = {
  hasPin: false,
  hasPreferences: false,
  message: null,
  user: storedUser ? JSON.parse(storedUser) : null,
  showEnterPinDrawer: false,
  nextEnterPinAction: undefined,
  bookmarkedProducts: storedProductBookmarks
    ? JSON.parse(storedProductBookmarks)
    : [],
  readNotifications: storedNotifications
    ? JSON.parse(storedNotifications)
    : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onSetCategories: (
      state: UserState,
      action: PayloadAction<{ message: string; data: User }>,
    ) => {
      state.message = action.payload.message;
      state.user = action.payload.data;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
      state.hasPreferences = true;
      localStorage.setItem('hasPreference', 'true');
    },
    onSetPin: (
      state: UserState,
      action: PayloadAction<{ message: string; data: User }>,
    ) => {
      state.message = action.payload.message;
      state.user = action.payload.data;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
      state.hasPin = true;
      localStorage.setItem('hasPin', 'true');
    },
    onEditProfile: (
      state,
      action: PayloadAction<{ message: string; data: User }>,
    ) => {
      state.message = action.payload.message;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
      state.user = action.payload.data;
    },
    onGetUser: (state, action: PayloadAction<User>) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.user = action.payload;
    },
    handleShowEnterPinDrawer: (
      state,
      action: PayloadAction<{ nextAction?: () => Promise<void> }>,
    ) => {
      state.showEnterPinDrawer = true;
      state.nextEnterPinAction = action.payload.nextAction;
    },
    handleCloseEnterPinDrawer: (state) => {
      state.showEnterPinDrawer = false;
      state.nextEnterPinAction = undefined;
    },
    handleGetNotifications: (state, action: PayloadAction<string[]>) => {
      localStorage.setItem('notifications', JSON.stringify(action.payload));
    },
    handleFollowUser: (state, action: PayloadAction<{ data: User }>) => {
      state.user = action.payload.data;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
    },
    productBookmarkHandler: (state, action: PayloadAction<string[]>) => {
      localStorage.setItem(
        'bookmarkedProducts',
        JSON.stringify(action.payload),
      );
      state.bookmarkedProducts = action.payload;
    },
    // onSubscribeToEvent: (
    //   state,
    //   action: PayloadAction<{ subscribed_events: string[] }>,
    // ) => {
    //   state.user = {
    //     ...state.user,
    //     subscribed_events: action.payload.subscribed_events,
    //   };
    // },
  },
});

export const {
  onSetCategories,
  onSetPin,
  onEditProfile,
  onGetUser,
  handleShowEnterPinDrawer,
  handleCloseEnterPinDrawer,
  handleGetNotifications,
  handleFollowUser,
  productBookmarkHandler,
} = userSlice.actions;

export default userSlice.reducer;
