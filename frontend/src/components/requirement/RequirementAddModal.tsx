// 1. react 관련
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
import useUserStore from '@/stores/userStore';
// 5. components
import { useState } from 'react';
import { addRequirement } from '@/apis/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RequirementAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequirementAddModal = ({ isOpen, onClose }: RequirementAddModalProps) => {
  const projectId = usePageInfoStore.getState().projectId;
  const employeeId = useUserStore.getState().employeeId;
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [personInChargeEId, setPersonInChargeEId] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [detail, setDetail] = useState('');

  const handleAddRequirement = async () => {
    try {
      const reqData = {
        pjtId: projectId,
        pjtCode: code,
        reqName: title,
        detailContents: [detail], // 상세 내용이 string 배열이기 때문에 배열로 변환
        managerEId: personInChargeEId,
        authorEId: employeeId,
        targetUser: targetUser,
      };

      await addRequirement(
        reqData.pjtId,
        reqData.pjtCode,
        reqData.reqName,
        reqData.detailContents,
        reqData.managerEId,
        reqData.authorEId,
        reqData.targetUser,
      );
      console.log('api 호출 성공');
      onClose(); // 요구사항 생성 후 모달 닫기
    } catch (error) {
      console.error('api 호출 실패', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>요구사항 생성</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='requirementTitle' className='text-right'>
              이름
            </Label>
            <Input
              id='requirementTitle'
              placeholder='ex) 로그인 기능'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>

        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='requirementCode' className='text-right'>
            CODE
          </Label>
          <Input
            id='requirementCode'
            placeholder='ex) OLD-001'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className='col-span-3'
          />
        </div>

        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='personInCharge' className='text-right'>
            담당자의 사번
          </Label>
          <Input
            id='requirementManager'
            placeholder='ex) SSAFY1001'
            type='text'
            value={personInChargeEId}
            onChange={(e) => setPersonInChargeEId(e.target.value)}
            className='col-span-3'
          />
        </div>

        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='targetUser' className='text-right'>
            타겟 사용자
          </Label>
          <Input
            id='targetUser'
            type='text'
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            className='col-span-3'
          />
        </div>

        <div className='grid gap-4 py-4'>
          {/* 기존 입력 필드들 */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='detail' className='text-right'>
              상세 내용
            </Label>
            <Input
              id='detail'
              placeholder='ex) 로그인 버튼을 누르면 로그인을 할 수 있다.'
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className='col-span-3'
            />
          </div>

          <DialogFooter>
            <Button onClick={handleAddRequirement}>생성</Button>
            <Button onClick={onClose}>취소</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementAddModal;
