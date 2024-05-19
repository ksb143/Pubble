import { css } from '@emotion/react';
import Xmark from '@/assets/icons/x-mark.svg?react';
import ProgressIcon from '@/assets/icons/progress.svg?react';
import ParticipantsIcon from '@/assets/icons/participants.svg?react';

const dialogStyle = css`
  height: calc(100vh - 64px);
  traansition: transform 1s;
`;

interface Participant {
  name: string;
  profileColor: string;
  position: string;
}

interface ProjectStatus {
  lockRatio?: number;
  approveRatio?: number;
  changedRatio?: number;
  participants?: Participant[];
}

interface ProjectStatusSheetProps {
  isOpen: boolean;
  closeSheet: () => void;
  projectStatus: ProjectStatus;
}

const ProjectStatusSheet = ({
  isOpen,
  closeSheet,
  projectStatus,
}: ProjectStatusSheetProps) => {
  return (
    <>
      <div
        className={`fixed  bottom-0 left-0 top-16 z-20 w-1/3 overflow-y-auto rounded-l bg-white p-6 shadow-lg transition-transform duration-1000 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        css={dialogStyle}>
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center'>
            <h2 className='text-2xl font-normal'>프로젝트 상태</h2>
          </div>
          <Xmark
            className='h-8 w-8 cursor-pointer stroke-gray-900 stroke-1'
            onClick={closeSheet}
          />
        </div>
        <div className='mb-4 mt-8 flex items-center'>
          <ProgressIcon className='mr-2 h-6 w-6 fill-gray-900' />
          <h3 className='text-xl'>달성률</h3>
        </div>
        <div>
          <div className='mb-2'>요구사항 완료 비율</div>
          <div className='relative mb-4 h-6 w-5/6 overflow-hidden rounded-full bg-gray-200'>
            <div
              className='h-6 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-pubble'
              style={{
                width: `${projectStatus.lockRatio?.toString()}%`,
              }}>
              <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-black'>
                {projectStatus.lockRatio?.toString()}%
              </span>
            </div>
          </div>
          <div className='mb-2'>요구사항 승인 비율</div>
          <div className='relative mb-4 h-6 w-5/6 overflow-hidden rounded-full bg-gray-200'>
            <div
              className='h-6 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-pubble'
              style={{
                width: `${projectStatus.approveRatio?.toString()}%`,
              }}>
              <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-black'>
                {projectStatus.approveRatio?.toString()}%
              </span>
            </div>
          </div>
          <div className='mb-2'>요구사항 변경 비율</div>
          <div className='relative mb-4 h-6 w-5/6 overflow-hidden rounded-full bg-gray-200'>
            <div
              className='h-6 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-pubble'
              style={{
                width: `${projectStatus.changedRatio?.toString()}%`,
              }}>
              <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-black'>
                {projectStatus.changedRatio?.toString()}%
              </span>
            </div>
          </div>
        </div>
        <div className='mb-4 mt-8 flex items-center'>
          <ParticipantsIcon className='mr-2 h-6 w-6 fill-gray-900' />
          <h3 className='text-xl'>참가 인원</h3>
        </div>
        <div className='flex flex-wrap gap-6'>
          {projectStatus.participants?.map((participant, index) => (
            <div
              key={index}
              className='mb-2 flex flex-col items-center justify-center'>
              <div
                className='flex h-14 w-14 items-center justify-center rounded-full'
                style={{ backgroundColor: participant.profileColor }}>
                {participant.name}
              </div>
              <div>{participant.position}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectStatusSheet;
