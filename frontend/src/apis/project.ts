import { privateApi } from '@/utils/http-commons';

// 전체 project 조회 함수 - GET
// 로그인시 store에 저장되는 유저 데이터(token)기반으로
// 각 유저별로 맞는 project 목록 조회 가능하게 하는 함수.
export const getProject = async () => {
  const { data } = await privateApi.get('/projects');
  return data;
};

// 전체 project 목록에, 새로운 project 추가하기 - POST
// 로그인시 store에 저장되는 유저 데이터(token)기반으로
// 각 유저별로 맞는 project 목록에 1개씩 추가 가능하게 하는 함수.
export const addProject = async (
  pjtTitle: string,
  pjtCode: string,
  pjtParticipants: Array<string>,
  pjtStartDate: string,
  pjtEndDate: string,
) => {
  const { data } = await privateApi.post('/projects', {
    projectTitle: pjtTitle,
    startAt: pjtStartDate + 'T00:00:00',
    endAt: pjtEndDate + 'T23:59:59',
    code: pjtCode,
    participantsEID: pjtParticipants,
    status: 'before start',
  });
  return data;
};

// 특정한 project의 상황을 확인하는 대시보드 보기 - GET
// 참고: 보안상 pjtId(백엔드 table pk)를 header에 넣어서 보내는게 더 낫지만 일단 params에 붙여서 보냄.
export const getProjectStatus = async (pjtId: number) => {
  const { data } = await privateApi.get(`/projects/${pjtId}/dashboards`);
  return data;
};

// 실질적 요구사항 목록 GET 함수 임
// 특정 프로젝트의 최신 버전 요구사항만 모아진 것 확인 하기 - GET
export const getLatestRequirementVersion = async (pjtId: number) => {
  const { data } = await privateApi.get(
    `/projects/${pjtId}/requirements/recent`,
  );
  return data;
};

// 특정 프로젝트의 모든 요구사항 목록 보기 - GET
// 버전에 무관하게 모두 조회 하는 것이므로, 실제로 중복되는 요구사항 항목이 있을 수 있음.
export const getRequirement = async (pjtId: number, pjtCode: string) => {
  const { data } = await privateApi.get(
    `/projects/${pjtId}/requirements?code=${pjtCode}`,
  );
  return data;
};

// 특정 프로젝트의 특정 요구사항 상세 보기 - GET
export const getRequirementDetail = async (pjtId: number, reqId: number) => {
  const { data } = await privateApi.get(
    `/projects/${pjtId}/requirements/${reqId}`,
  );
  return data;
};

// 고려: 타겟 유저(string)를 request body에 넣어서 보내야하는데, 미리 잠재고객 혹은 잠재사용자 생각해서 보내기.
// 특정 프로젝트의 새로운 요구사항 추가하기 - POST
export const addRequirement = async (
  pjtId: number,
  pjtCode: string, // 프로젝트 코드 추가
  reqName: string,
  detailContents: Array<string>,
  managerEId: string,
  authorEId: string,
  targetUser: string,
) => {
  const { data } = await privateApi.post(`/projects/${pjtId}/requirements`, {
    code: pjtCode,
    requirementName: reqName,
    detailContents: detailContents,
    managerEId: managerEId,
    authorEId: authorEId,
    targetUser: targetUser,
  });
  return data;
};

// 특정 프로젝트의 특정 요구사항의 새 버전 생성 - POST
export const updateRequirementVersion = async (
  pjtId: number,
  reqId: number,
  option: string,
) => {
  const { data } = await privateApi.post(
    `/projects/${pjtId}/requirements/${reqId}/versions`,
    option, // 보류생성일 경우: h(hold), 복제생성일 경우: r(restore)
  );
  return data;
};

export const updateRequirementLockStatus = async (
  pjtId: number,
  reqId: number,
) => {
  const { data } = await privateApi.put(
    `/projects/${pjtId}/requirements/${reqId}/lock`,
  );
  return data;
};
