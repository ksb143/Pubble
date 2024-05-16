// 1. react 관련
// 2. library
// 3. api
// 4. store
// 5. components
import { useState } from 'react';
import { addProject } from '@/apis/project';
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
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [participant, setParticipant] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const handleAddProject = () => {
    const participantsArray = participant.split(',').map((part) => part.trim());
    console.log('api 호출시작');
    addProject(title, code, participantsArray, startAt, endAt);
    console.log('api 호출종료');
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
            <Label htmlFor='projectTitle' className='text-right'>
              이름
            </Label>
            <Input
              id='projectTitle'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='projectCode' className='text-right'>
              Code
            </Label>
            <Input
              id='projectCode'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='participant' className='text-right'>
              참여자
            </Label>
            <Input
              id='projectParticipant'
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='startAt' className='text-right'>
              시작일
            </Label>
            <Input
              id='startAt'
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='endAt' className='text-right'>
              종료일
            </Label>
            <Input
              id='endAt'
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className='col-span-3'
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProject}>생성</Button>
            <Button onClick={onClose}>취소</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementAddModal;
