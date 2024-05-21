import { UserInfo } from '@/types/userType';

/**
 * 사용자 검색어에 따라 자동완성 결과를 반환하는 함수
 * @param users 사용자 리스트
 * @param query 사용자 검색어
 * @return {UserInfo[]} 필터링된 사용자 리스트
 */
export const autocompleteUser = (
  users: UserInfo[],
  query: string,
): UserInfo[] => {
  return users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
};
