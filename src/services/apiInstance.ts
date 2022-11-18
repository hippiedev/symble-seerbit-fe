/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASE_URL } from '../constants/values';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-version': '3.1',
    'Access-Control-Allow-Origin': '*',
  },
});
