import { privateApi } from '@/utils/http-commons.ts';
import { CommentData } from '@/types/requirementTypes.ts';

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
  console.log('스레드 생성 api : ', data);
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
  console.log('댓글 작성 api : ', data);
  return data;
};

// 스레드 잠금 함수
export const lockThread = async (userThreadId: number) => {
  const { data } = await privateApi.put(
    `/requirements/details/threads/${userThreadId}/lock`,
  );
  console.log('스레드 잠금 api : ', data);
  return data;
};
