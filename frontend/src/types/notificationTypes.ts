interface NotificationInfo {
  notificationId: string | null;
  isChecked: boolean;
  content: string;
  senderInfo: SenderInfo;
  createdAt: string;
  type: string;
  typeData: TypeData;
}

interface SenderInfo {
  name: string;
  employeeId: string;
  position: string;
  department: string;
  profileColor: string;
}

interface TypeData {
  projectId: string | null;
  projectCode: string | null;
  requirementId: string | null;
  requirementCode: string | null;
  threadId: string | null;
}
