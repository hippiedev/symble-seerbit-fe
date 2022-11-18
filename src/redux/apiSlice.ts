/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { BASE_URL } from '../constants/values';
import { apiInstance } from '../services/apiInstance';
import { logoutUser, tokenReceived } from './feature/auth/authSlice';
import { RootState } from './store';

console.log(apiInstance.defaults.headers);
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');
console.log(token);

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }, api) => {
    let result;
    try {
      result = await apiInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          Authorization: (api.getState() as RootState).auth.token || '',
          'x-auth-token': (api.getState() as RootState).auth.token || '',
        },
      });
      if (result.status === 403) {
        api.dispatch(logoutUser('Your session has expired'));
      }
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 403) {
        try {
          const refreshResult = await apiInstance({
            url: `${baseUrl}auth/refresh-tokens`,
            data: {
              refreshToken: refreshToken ? JSON.parse(refreshToken) : '',
            },
            method: 'POST',
          });
          if (refreshResult?.data) {
            // store the new token
            api.dispatch(tokenReceived(refreshResult?.data));
            // retry the initial query
            result = await apiInstance({
              url: baseUrl + url,
              method,
              data,
              params,
              headers: {
                Authorization: (api.getState() as RootState).auth.token || '',
                'x-auth-token': (api.getState() as RootState).auth.token || '',
              },
            });
            return { data: result.data };
          }
          api.dispatch(logoutUser('Your session has expired. Sign in'));
        } catch (e) {
          api.dispatch(
            logoutUser(
              "Your session expired and we couldn't log you back in... for some reason",
            ),
          );
        }
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Event', 'User', 'Wallet'],
  endpoints: (builder) => ({}),
});
