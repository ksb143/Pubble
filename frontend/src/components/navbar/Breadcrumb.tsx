import usePageInfoStore from '@/stores/pageInfoStore';
import Right from '@/assets/icons/chevron-right.svg?react';

const Breadcrumb = () => {
  const { projectName, requirementName, isRichPage } = usePageInfoStore();

  return (
    <>
      <div className='mx-10 flex items-center'>
        <p className='text-xl font-normal'>{projectName}</p>
        {requirementName && (
          <Right className='mx-2 h-4 w-4 stroke-gray-500/50 stroke-2' />
        )}
        <p className='text-xl font-normal'>{requirementName}</p>
        {isRichPage && (
          <>
            <Right className='mx-2 h-4 w-4 stroke-gray-500/50 stroke-2' />
            <p className='text-xl font-normal'>에디터</p>
          </>
        )}
      </div>
    </>
  );
};

export default Breadcrumb;
