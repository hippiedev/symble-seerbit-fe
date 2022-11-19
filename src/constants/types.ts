export interface User {
  toLowerCase(): unknown;
  amount: number;
  id: string;
  avatar: string;
  username: string;
  email: string;
  preferences: string[];
  bio: string;
  country: string;
  phone: string;
  events: Event[];
  products: Product[];
  bookmarks: { products: Product[] };
  is_verified: boolean;
  followers: { username: string; avatar: string; id: string }[];
  following: { username: string; avatar: string; id: string }[];
  followersCount: number;
  followingCount: number;
  subscribed_events: Event[];
  name: { first: string; last: string; full: string };
  pin: string;
}

export interface Product {
  id: string;
  images: string[];
  name: string;
  quantity: number;
  url: string;
  price: { $numberDecimal: string };
  paymentLinkUrl: string;
}

export interface Event {
  access_fee: number;
  id: string;
  name: string;
  image: string;
  url: string;
  class: 'PAID' | 'FREE';
  description: string;
  type: string;
  event_code: string;
  amount: number;
  participants: {
    is_active: boolean;
    money_spent: { $numberDecimal: string };
    user_id: { id: string; wallet_id: string };
  }[];
  qrcode: string;
  category: string;
  currency: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  participantCount: number;
  room_id: string;
  room_token: string;
  products: Product[];
  owner: User;
  tags: string[];
  start_date: string;
  subscribers: string[];
}

export interface Wallet {
  user: User;
  currency: 'NGN';
  balance: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  date: string;
  type: 'FUND' | 'REDEEM' | 'SEND' | 'EVENT';
  id: string;
  reference: string;
  amount: number;
  description: string;
  event_id: string;
  currency: 'NGN';
  payment_method: 'bank' | 'card' | 'na';
  status: 'pending' | 'success' | 'cancelled' | 'failed';
  sender: Wallet;
  recipient: Wallet;
  meta: object;
}

export interface Notification {
  channel: string;
  recipients: string[];
  data: {};
  type: string;
  message: string;
  id: string;
  sender: string;
}

export interface EventRoom {
  participantData: { role: 'owner' | 'participant'; token: string };
  roomData: { room_token: string };
  event: Event;
}
