// 요구사항 페이지 관련 타입 정의

// 요구사항 상세 항목 리스트
export interface RequirementDetail {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd'; // 'u'는 활성화, 'd'는 비활성화
}

// 작성자, 담당자 유저 정보
export interface Person {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: 'USER' | 'ADMIN'; // 추가적인 역할 구분이 필요하다면 여기에 추가 가능
  isApprovable: 'y' | 'n';
  profileColor: string;
}

// Manager와 Author 타입은 Person 인터페이스를 확장
export type Manager = Person;
export type Author = Person;

// 서버에서 보내는 요구사항 정보
export interface RequirementInfo {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'l' | 'u'; // 'l'은 locked, 'u'는 unlocked 상태를 나타냅니다.
  approval: 'a' | 'd'; // 'a'는 approved, 'd'는 denied를 의미합니다.
  approvalComment: string;
  code: string;
  requirementName: string;
  details: RequirementDetail[];
  manager: Manager;
  targetUser: string;
  createdAt: string;
  author: Author;
}
