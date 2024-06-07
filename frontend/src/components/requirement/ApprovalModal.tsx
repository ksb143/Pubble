// 1. react 관련
import { useState } from 'react';
// 2. library
import * as Dialog from '@radix-ui/react-dialog';
// 3. api
import { requestConfirm } from '@/apis/confirm';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// 6. etc
import ChevronDown from '@/assets/icons/chevron-down.svg?react';

interface Person {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  isApprovable: 'y' | 'n';
  profileColor: string;
}

interface Detail {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd';
}

interface Summary {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'u' | 'l';
  approval: 'u' | 'h' | 'a';
  approvalComment: string | null;
  details: Detail[];
  manager: Person;
  targetUse: string;
  createdAt: string;
  author: Person;
  requirementName: string;
  code: string;
}

interface ApprovalModalProps {
  requirements: Summary;
  isOpen: boolean;
  onClose: () => void;
  updateRequirementList: () => void;
}

const ApprovalModal = ({
  requirements,
  isOpen,
  onClose,
  updateRequirementList,
}: ApprovalModalProps) => {
  const { projectId } = usePageInfoStore();
  const [approvalStatus, setApprovalStatus] = useState<'u' | 'h' | 'a'>('u');
  const [approvalComment, setApprovalComment] = useState('');

  const confirmApproval = async () => {
    if (approvalStatus === 'u') {
      alert('결재 상태를 선택해주세요');
      return;
    }
    try {
      const fullRequestBody = {
        projectId: projectId,
        isLock: requirements.isLock,
        approval: approvalStatus,
        requirementName: requirements.requirementName,
        approvalComment: approvalComment,
      };
      const response = await requestConfirm(
        requirements.requirementId,
        fullRequestBody,
      );
      alert(response.message);
      updateRequirementList();
    } catch (error) {
      console.error(error);
      alert('결재 요청에 실패했습니다. 다시 시도해주세요');
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className='fixed inset-0 left-0 top-0 z-10 h-full w-full bg-black bg-opacity-30'>
        <Dialog.Content className='fixed left-1/2 top-1/2 z-20 flex h-1/3 w-1/4 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded bg-white px-6 pb-4 pt-6 shadow-custom'>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex w-full items-center justify-between rounded border border-gray-200 p-2'>
              {approvalStatus === 'u' && '결재 상태 선택'}
              {approvalStatus === 'h' && '반려'}
              {approvalStatus === 'a' && '승인'}
              <ChevronDown className='ml-2 h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setApprovalStatus('a')}>
                승인
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setApprovalStatus('h')}>
                반려
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <textarea
            className='m-4 block h-24 w-full rounded bg-white p-2 shadow-custom focus:outline-none'
            placeholder='사유를 입력해주세요'
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
          />
          <button
            className='rounded bg-plblue p-2 text-white hover:bg-pubble'
            onClick={confirmApproval}>
            전자서명 제출
          </button>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
};

export default ApprovalModal;
