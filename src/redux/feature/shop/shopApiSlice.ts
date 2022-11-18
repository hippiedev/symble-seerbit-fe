import { Product } from '../../../constants/types';
import { apiSlice } from '../../apiSlice';

export const shopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<
      { message: string; data: Product },
      { images: string[]; price: string; name: string; quantity: number }
    >({
      query: (payload) => ({
        url: 'products',
        method: 'post',
        data: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    bookmarkProduct: builder.mutation<
      { message: string; products: string[] },
      any
    >({
      query: ({ user, productId }) => ({
        url: `users/${user}/save`,
        method: 'post',
        params: { product: productId },
      }),
      invalidatesTags: ['User'],
    }),
    updateProduct: builder.mutation<
      { message: string; data: Product },
      Partial<Product> & Pick<Product, 'id'>
    >({
      query: (payload) => ({
        url: `products/${payload.id}`,
        method: 'post',
        data: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    getProduct: builder.query<Product, string>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: 'get',
      }),
      transformResponse: (response) =>
        (response as { message: string; data: Product }).data,
    }),
    deleteProduct: builder.mutation<Product, string>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: 'delete',
      }),
      invalidatesTags: ['User', 'Event'],
      transformResponse: (response) =>
        (response as { message: string; data: Product }).data,
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBookmarkProductMutation,
} = shopApiSlice;
