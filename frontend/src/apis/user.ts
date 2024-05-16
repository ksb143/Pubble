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
  await privateApi.post('/users/logout');
};

// 전체 유저 리스트를 불러오는 함수
export const getUser = async () => {
  const { data } = await privateApi.get('/users/userinfo/all');
  return data;
};

// 프로젝트에 소속된 유저 리스트를 불러오는 함수
export const getUserByProject = async (projectId: number) => {
  const { data } = await privateApi.get(`/users/userinfo/${projectId}`);
  return data;
};
