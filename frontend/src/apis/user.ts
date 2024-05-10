import { publicApi, privateApi } from '@/utils/http-commons.ts';

// 로그인 함수
export const login = async (employeeId: string, password: string) => {
  const { data } = await publicApi.post('/users/signin', {
    employeeId,
    password,
  });
  return data;
};

// 로그아웃 함수
export const logout = async () => {
  const { data } = await privateApi.post('/users/logout');
  console.log('로그아웃 api : ', data);
  return data;
};
