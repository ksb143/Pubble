// 알림 관련 타입 정의

// 알림 보내는 사람 정보
export interface SenderInfo {
  name: string;
  employeeId: string;
  position: string;
  department: string;
  profileColor: string;
}

// 알림 타입 정보
export interface TypeData {
  projectId: string | null;
  projectCode: string | null;
  requirementId: string | null;
  requirementCode: string | null;
  threadId: string | null;
}

// 서버에서 보내는 알림 정보
export interface NotificationInfo {
  notificationId: number;
  isChecked: boolean;
  content: string;
  senderInfo: SenderInfo;
  createdAt: string;
  type: string;
  typeData: TypeData;
}
