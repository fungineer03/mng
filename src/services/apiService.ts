import axios from 'axios';

import { BASE_API_URL } from '../utils/constants';
const api = axios.create({
  baseURL: BASE_API_URL, // "https://mashrafgroup.com/apps/fms/index.php/api"
  timeout: 10000,
});

export const getActivationKey = async (key: string) => {
  try {
    const response = await api.post('/license', { key });
    console.log('response.data: ', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log('error: ', JSON.stringify(error));
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getUserData = async (key: string) => {
  try {
    const response = await api.post('/GetUser', { key });
    console.log('response.data: ', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log('error: ', JSON.stringify(error));
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getReportData = async (key: string, lncode: string) => {
  try {
    const response = await api.post('/GetReport', { key, lncode });
    console.log('response.data: ', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log('error: ', JSON.stringify(error));
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const updateReportData = async (key: string, lncode: string, lat: string, long: string, jprid: string, tasks: []) => {
  try {
    const response = await api.post('/UpdateReport', { key, lncode, lat, long, jprid, tasks });
    console.log('response.data: ', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log('error: ', JSON.stringify(error));
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const getMyTasks = async (key: string) => {
  try {
    const response = await api.post('/mytasks', { key });
    console.log('response.data: ', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.log('error: ', JSON.stringify(error));
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};