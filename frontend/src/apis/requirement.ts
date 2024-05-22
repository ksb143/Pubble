import { privateApi } from '@/utils/http-commons.ts';
import { CommentData } from '@/types/threadType';

// 요구사항 조회 함수
export const getRequirement = async (
  projectId: number,
  requirementId: number,
) => {
  const { data } = await privateApi.get(
    `/projects/${projectId}/requirements/${requirementId}`,
  );
  return data;
};

// 요구사항 잠금 함수
export const lockRequirement = async (
  projectId: number,
  requirementId: number,
) => {
  const { data } = await privateApi.put(
    `/projects/${projectId}/requirements/${requirementId}/lock`,
  );
  return data;
};

// 스레드 조회 함수
export const getThread = async (requirementId: number) => {
  const { data } = await privateApi.get(
    `/requirements/details/requirements-all-threads/${requirementId}`,
  );
  return data;
};

// 스레드 생성 함수
export const createThread = async (detailId: number) => {
  const { data } = await privateApi.post(
    `/requirements/details/${detailId}/threads`,
  );
  return data;
};

// 댓글 작성 함수
export const createComment = async (
  threadId: number,
  CommentData: CommentData,
) => {
  const { data } = await privateApi.post(
    `/requirements/details/threads/${threadId}/comments`,
    CommentData,
  );
  return data;
};

// 스레드 잠금 함수
export const lockThread = async (userThreadId: number) => {
  const { data } = await privateApi.put(
    `/requirements/details/threads/${userThreadId}/lock`,
  );
  return data;
};

// 요구사항 디테일 추가 함수
export const createRequirementDetail = async (
  requirementId: number,
  content: string,
) => {
  const { data } = await privateApi.post(
    `/projects/reuqirements/${requirementId}`,
    { content },
  );
  return data;
};

// 요구사항 디테일 상태 변경 함수
export const updateRequirementDetailStatus = async (
  requirementId: number,
  detailId: number,
  command: string,
) => {
  const { data } = await privateApi.put(
    `/projects/reuqirements/${requirementId}/details/${detailId}/status`,
    { command },
  );
  return data;
};

// 요구사항 이력 조회 함수
export const getRequirementHistory = async (
  projectId: number,
  code: string,
) => {
  const { data } = await privateApi.get(`/projects/${projectId}/requirements`, {
    params: { code },
  });
  return data;
};
