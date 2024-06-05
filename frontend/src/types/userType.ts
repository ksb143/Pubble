// 유저 관련 타입 정의

// 유저 정보 타입 정의
export interface UserInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string; // 관리자 여부
  isApprovable: 'y' | 'n'; // 결재자 여부
  profileColor: string;
}
