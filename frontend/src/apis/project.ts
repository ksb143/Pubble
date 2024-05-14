import { privateApi } from '@/utils/http-commons';

// 전체 project 조회 함수 - GET
// 로그인시 store에 저장되는 유저 데이터(token)기반으로 
// 각 유저별로 맞는 project 목록 조회 가능하게 하는 함수. 
export const getProject = async() => {
  const { data } = await privateApi.get('/projects');
  return data;
}

// 전체 project 목록에, 새로운 project 추가하기 - POST
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

// 특정한 project의 상황을 확인하는 대시보드 보기 - GET
// 참고: 보안상 pjtId(백엔드 table pk)를 header에 넣어서 보내는게 더 낫지만 일단 params에 붙여서 보냄.
export const getProjectStatus = async(pjtId: string) => {
  const { data } = await privateApi.get(`/projects/${pjtId}/dashboards`, {
  });
  return data; 
} 

// 특정 프로젝트의 모든 요구사항 목록 보기 - GET
export const getRequirement = async(pjtId: string, pjtCode: string) => {
  const { data } = await privateApi.get(`/projects/${pjtId}/requirements?code=${pjtCode}`);
  return data;
}

// 특정 프로젝트의 특정 요구사항 상세 보기 - GET
export const getRequirementDetail = async(pjtId: string, reqId: string) => {
  const { data } = await privateApi.get(`/projects/${pjtId}/requirements/${reqId}`);
  return data;
}

// Todo: 사실 정확히 어떤 함수인지 모르겠음. 준영님에게 내일 물어보기
// 특정 프로젝트의 최신 요구사항 버전 확인 하기 - GET
export const getLatestRequirementVersion = async(pjtId: string) => {
  const { data } = await privateApi.get(`/projects/${pjtId}/requirements/recent`);
  return data;
}

// Todo: 타겟 유저의 EmplyeeID를 request body에 넣어서 보내야하는데, 사용하지 않기로 했으므로 없애야함.
// 특정 프로젝트의 새로운 요구사항 추가하기 - POST
export const addRequirement = async(pjtId: string, pjtCode: string, reqTitle: string, reqDetail: string, reqManagerEId: string, reqAuthorEId: string, targetUserEId: string) => {
  const { data } = await privateApi.post(`/projects/${pjtId}/requirements`, {
    code: pjtCode,
    requirementName: reqTitle,
    detail: reqDetail,
    managerEId: reqManagerEId,
    authorEId: reqAuthorEId,
    targetUser: targetUserEId,
  });
  return data;
}

// Todo: version 이라는 requestBody에 정확히 무엇이 들어가는지 준영님에게 물어보기.
// 특정 프로젝트의 특정 요구사항의 새 버전 생성 - POST
export const updateRequirementVersion = async(pjtId: string, reqId: string, version: string) => {
  const { data } = await privateApi.post(`/projects/${pjtId}/requirements/${reqId}/versions`,
    version
  );
  return data;
}

