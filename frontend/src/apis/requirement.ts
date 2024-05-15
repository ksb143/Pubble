import { privateApi } from '@/utils/http-commons.ts';

// 요구사항 조회 함수
export const getRequirement = async (
  projectId: number,
  requirementId: number,
) => {
  const { data } = await privateApi.post(
    `/projects/${projectId}/requirements/${requirementId}`,
  );
  return data;
};
