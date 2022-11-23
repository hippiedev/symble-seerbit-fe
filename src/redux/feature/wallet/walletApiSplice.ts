import { Wallet } from '../../../constants/types';
import { apiSlice } from '../../apiSlice';

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation<
      { message: string; data: Wallet },
      undefined
    >({
      query: () => ({
        url: 'wallets',
        method: 'post',
      }),
    }),
    topupWallet: builder.mutation<
      { payments: { redirectLink: string } },
      { amount: number }
    >({
      query: (payload) => ({
        url: 'wallets/fund',
        method: 'post',
        data: { ...payload },
      }),
      invalidatesTags: ['Wallet'],
      transformResponse: (response) =>
        (
          response as {
            message: string;
            data: { payments: { redirectLink: string } };
          }
        ).data,
    }),
    getUserWallet: builder.query<Wallet, undefined>({
      query: () => ({
        url: 'wallets/user',
        method: 'get',
      }),
      providesTags: ['Wallet'],
      transformResponse: (response) =>
        (response as { message: string; data: Wallet }).data,
    }),
    sendFund: builder.mutation<
      { message: string; data: Wallet },
      { to: string; amount: number }
    >({
      query: (payload) => ({
        url: 'wallets/send',
        method: 'post',
        data: { ...payload },
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useTopupWalletMutation,
  useGetUserWalletQuery,
  useSendFundMutation,
} = walletApiSlice;
