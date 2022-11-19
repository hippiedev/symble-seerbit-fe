import { Notification, Product, User } from "../../../constants/types";
import { apiSlice } from "../../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      { message: string; data: User },
      { updateData: any; username: string }
    >({
      query: ({ updateData, username }) => ({
        url: `users/${username}`,
        method: "post",
        data: updateData,
      }),
      invalidatesTags: ["User"],
    }),
    setPin: builder.mutation<{ message: string; data: User }, string>({
      query: (pin) => ({
        url: `auth/pin`,
        method: "post",
        data: { pin },
      }),
      invalidatesTags: ["User"],
    }),
    validatePin: builder.mutation<{ message: string; }, string>({
      query: (pin) => ({
        url: `wallet/validate-pin`,
        method: "post",
        data: { pin },
      }),
    }),
    getUser: builder.query<User, string>({
      query: (payload) => ({
        url: `users/${payload}`,
        method: "get",
      }),
      providesTags: ["User"],
      transformResponse: (response) =>
        (response as { message: string; data: User }).data,
    }),
    getAllUsers: builder.query<{ message: string; data: User[] }, undefined>({
      query: () => ({
        url: `users/`,
        method: "get",
      }),
      providesTags: ["User"],
    }),
    getAuthUser: builder.query<User, undefined>({
      query: () => ({
        url: `account/`,
        method: "get",
      }),
      providesTags: ["User"],
      transformResponse: (response) =>
        (response as { message: string; data: User }).data,
    }),
    getUserProducts: builder.query<Product[] | [], string>({
      query: (payload) => ({
        url: `users/${payload}`,
        method: "get",
      }),
      providesTags: ["User"],
      transformResponse: (response) =>
        (response as { message: string; data: User }).data.products,
    }),
    followUser: builder.mutation<
      {
        message: string;
        data: User;
      },
      string
    >({
      query: (username) => ({
        url: `users/${username}/follows`,
        method: "post",
      }),
      invalidatesTags: ["User"],
    }),
    closeAccount: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `users/`,
        method: "delete",
        data: { _id: id },
      }),
      invalidatesTags: ["User"],
    }),
    getNotifcations: builder.query<
      { message: string; result: Notification[] },
      string
    >({
      query: (id) => ({
        url: `notifications/`,
        method: "get",
        data: { id },
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetUserQuery,
  useGetAuthUserQuery,
  useGetUserProductsQuery,
  useFollowUserMutation,
  useGetAllUsersQuery,
  useCloseAccountMutation,
  useGetNotifcationsQuery,
  useSetPinMutation,
  useValidatePinMutation,
} = userApiSlice;
