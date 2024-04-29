import axios, { AxiosInstance } from 'axios';
import { httpStatusCode } from '@/utils/http-status';

const { VITE_API_URI } = import.meta.env;

interface ApiConfig {
  baseURL: string;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

let isTokenRefreshing = false;

const createApi = ({
  baseURL,
  withCredentials,
  headers = {},
}: ApiConfig): AxiosInstance => {
  const api = axios.create({
    baseURL,
    withCredentials,
    headers,
  });

  api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    } else {
      // 토큰이 없어, 로그인 페이지로 이동
      return Promise.reject(
        new Error('토큰이 없어, 사용자 인증이 필요합니다.'),
      );
    }
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error);
      const {
        config,
        response: { status },
      } = error;
      if (status === httpStatusCode.UNAUTHORIZED && !isTokenRefreshing) {
        isTokenRefreshing = true;
        try {
          // 토큰 재발급 성공
          const { data } = await api.post('/users/reissue');
          localStorage.setItem('accessToken', data.newAccessToken);
          return api(config);
        } catch (error) {
          // 토큰 재발급 실패
          return Promise.reject(error);
        } finally {
          isTokenRefreshing = false;
        }
      } else {
        // 토큰 재발급 못했거나, 다른 오류로 인증 실패, 로그인 페이지로 이동
        return Promise.reject(error);
      }
    },
  );
  return api;
};

// 기초 api
export const noneApi = createApi({
  baseURL: VITE_API_URI,
});
// 토큰 존재하지 않는 api ex. 회원가입, 로그인
export const publicApi = createApi({
  baseURL: VITE_API_URI,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
// 토큰 존재하는 api
export const privateApi = createApi({
  baseURL: VITE_API_URI,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});
