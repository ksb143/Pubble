import axios, { AxiosInstance } from 'axios';
import { httpStatusCode } from '@/utils/http-status';

const { VITE_API_URI } = import.meta.env;

interface ApiConfig {
  baseURL: string;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  flag?: boolean;
}

const createApi = ({
  baseURL,
  withCredentials,
  headers,
  flag,
}: ApiConfig): AxiosInstance => {
  const api = axios.create({
    baseURL,
    withCredentials,
    headers,
  });

  api.interceptors.request.use((config) => {
    if (flag) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  if (flag) {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response) {
          if (
            error.response.status === httpStatusCode.UNAUTHORIZED &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            try {
              const { data } = await api.post('/users/reissue');
              localStorage.setItem('accessToken', data.resData.newAccessToken);
              return api(originalRequest);
            } catch (refreshError) {
              console.error('토큰 재발급 실패', refreshError);
              return Promise.reject(
                new Error('토큰을 갱신할 수 없습니다. 다시 로그인해주세요.'),
              );
            }
          } else {
            console.error('인증 실패:', error);
            return Promise.reject(
              new Error('인증이 실패했습니다. 다시 로그인해주세요.'),
            );
          }
        } else {
          // 네트워크 오류나 서버 응답 없음
          console.error('서버 응답 없음:', error);
          return Promise.reject(
            new Error(
              '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.',
            ),
          );
        }
      },
    );
  }
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
  flag: false,
});
// 토큰 존재하는 api
export const privateApi = createApi({
  baseURL: VITE_API_URI,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  flag: true,
});
