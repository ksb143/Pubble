import { css } from '@emotion/react';
const dialogStyle = css`
  height: calc(100vh - 64px);
  traansition: transform 1s;
`;

interface ProjectStatusSheetProps {
  isOpen: boolean;
  closeSheet: () => void;
}

const ProjectStatusSheet = ({
  isOpen,
  closeSheet,
}: ProjectStatusSheetProps) => {
  return (
    <>
      <div
        className={`fixed  bottom-0 left-0 top-16 z-20 w-1/3 overflow-y-auto rounded-l bg-white p-6 shadow-lg transition-transform duration-1000 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        css={dialogStyle}>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <h2 className='text-2xl font-normal'>달성률</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectStatusSheet;
