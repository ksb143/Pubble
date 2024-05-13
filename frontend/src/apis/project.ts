import { privateApi } from '@/utils/http-commons';

// 기존 project 목록 조회 함수 - GET
// 로그인시 store에 저장되는 유저 데이터(token)기반으로 
// 각 유저별로 맞는 project 목록 조회 가능하게 하는 함수. 
export const getProject = async() => {
  const { data } = await privateApi.get('/projects');
  return data;
}

// 기존 project 목록에 project 추가하기 - POST
// 로그인시 store에 저장되는 유저 데이터(token)기반으로 
// 각 유저별로 맞는 project 목록에 1개씩 추가 가능하게 하는 함수.
export const addProject = async(pjtTitle: string, pjtCode: string, pjtParticipants: Array<string>, pjtStartDate: string, pjtEndDate: string) => {
  const { data } = await privateApi.post('/projects', {
    projectTitle: pjtTitle,
    startAt: pjtStartDate,
    endAt: pjtEndDate,
    code: pjtCode,
    participantsEID: pjtParticipants,
    status: "before start",
  });
  return data;
}
