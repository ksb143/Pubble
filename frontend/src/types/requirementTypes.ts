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
  role: 'USER' | 'ADMIN';
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
  version: string; // 'h'는 hold, 그 외는 'V.1.0.' 형태의 텍스트
  isLock: 'l' | 'u'; // 'l'은 locked, 'u'는 unlocked
  approval: 'u' | 'a' | 'h'; // 'u'는 초기값, 'a'는 approved 승인, 'h'는 hold 보류
  approvalComment: string; // 승인 또는 보류 이유
  code: string;
  requirementName: string;
  details: RequirementDetail[];
  manager: Manager; // 담당자
  targetUser: string;
  createdAt: string;
  author: Author; // 작성자
}

// 스레드 관련 타입 정의

// 댓글 정보
export interface Comment {
  commentId: number;
  userId: number;
  content: string;
  commentAuthorInfo: Person;
}

// 서버에서 보내는 스레드 정보
export interface ThreadInfo {
  userThreadId: number;
  commentList: Comment[];
  isLocked: 'y' | 'n'; // 'y' 또는 'n'만 가능
  threadAuthorInfo: Person;
}
