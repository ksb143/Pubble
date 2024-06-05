// 웹소켓 관련 타입 정의
import { UserInfo } from '@/types/userType';

// 서버와 통신하는 메세지 정보
export interface SocketInfo {
  operation: string; // e : enter 입장, m : move 이동, l : leave 퇴장
  employeeId: string;
  userInfoDto?: UserInfo;
  locationName?: string;
  locationUrl?: string;
  isConnected?: boolean;
}
