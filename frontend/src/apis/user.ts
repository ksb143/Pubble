import { publicApi } from '@/utils/http-commons.ts';

// 로그인 함수
export const login = async (employeeId: string, password: string) => {
  const { data } = await publicApi.post('/users/signin', {
    employeeId,
    password,
  });
  return data;
};
