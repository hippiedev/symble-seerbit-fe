/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/dot-notation */
import { User } from '../../../constants/types';
import { apiInstance } from '../../../services/apiInstance';
import { apiSlice } from '../../apiSlice';

export const setAuthToken = (token: string) => {
  console.log('token saved');
  apiInstance.defaults.headers.post['Authorization'] = `Bearer ${token}`;
  apiInstance.defaults.headers.post['x-auth-token'] = `${token}`;
  console.log(apiInstance.defaults.headers['Authorization']);
};

export const removeAuthToken = () => {
  delete apiInstance.defaults.headers['Authorization'];
  delete apiInstance.defaults.headers['x-auth-token'];
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  removeAuthToken();
};

// export const signIn = async (data: {}) => {
//   const response = await apiInstance.post('auth/login', data);
//   if (response.data) {
//     const expirationDate = new Date(new Date().getTime() + EXPIRES_IN * 1000);
//     console.log(response.data?.token);
//     setAuthToken(response.data?.token);
//     localStorage.setItem('user', JSON.stringify(response.data.data));
//     localStorage.setItem('token', JSON.stringify(response.data.token));
//     localStorage.setItem('expirationDate', `${expirationDate}`);
//     checkTimeout(EXPIRES_IN);
//     console.log(response);
//     return response.data;
//   }
// };
// export const signUp = async (data: {}) => {
//   const response = await apiInstance.post(
//     'https://spray-dev.herokuapp.com/api/auth/register',
//     data,
//   );
//   if (response.data) {
//     localStorage.setItem('user', JSON.stringify(response.data));
//     console.log(response);
//     return response.data;
//   }
// };

export const forgotPassword = async (email: string) => {
  const response = await apiInstance.post(
    'auth/forgot-password',
    JSON.stringify({ email }),
  );
  if (response.data) {
    console.log(response.data);
    return response.data;
  }
};
// export const resetPassword = async (data: {
//   token: string | null;
//   password: string | null;
//   confirmPassword: string | null;
// }) => {
//   const { token, password, confirmPassword } = data;
//   console.log(token, password);
//   const response = await apiInstance.post(
//     `auth/reset-password/?token=${token}`,
//     JSON.stringify({ password, confirmPassword }),
//   );
//   if (response.data) {
//     console.log(response.data);
//     return response.data;
//   }
// };

export const checkTimeout = async (expirationDate: number) => {
  console.log('running');
  await setTimeout(() => {
    logout();
    console.log('running logout already like a bitch');
  }, expirationDate * 1000);
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (payload) => ({
        url: 'auth/register',
        method: 'post',
        data: { ...payload },
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: 'auth/login',
        method: 'post',
        data: { ...payload },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: 'auth/reset-password',
        method: 'post',
        params: { token },
        data: { password, confirmPassword },
      }),
    }),
    googleSignIn: builder.mutation<
      {
        user: User;
        message: string;
        hasPin: boolean;
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
      },
      { token: string }
    >({
      query: (payload) => ({
        url: 'auth/google/signin',
        method: 'post',
        data: { ...payload },
      }),
    }),
    googleSignUp: builder.mutation<
      {
        message: string;
        url: string;
        email: string;
      },
      { token: string }
    >({
      query: (payload) => ({
        url: 'auth/google/signup',
        method: 'post',
        data: { ...payload },
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useResetPasswordMutation,
  useGoogleSignInMutation,
  useGoogleSignUpMutation,
} = authApiSlice;
