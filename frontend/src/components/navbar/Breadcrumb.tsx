// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
// 6. assets
import Right from '@/assets/icons/chevron-right.svg?react';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const {
    projectCode,
    projectName,
    requirementCode,
    requirementName,
    isRichPage,
  } = usePageInfoStore();

  // hover와 onClick의 활성화 상태를 관리하는 state
  const [isProjectActive, setIsProjectActive] = useState(false);
  const [isRequirementActive, setIsRequirementActive] = useState(false);

  useEffect(() => {
    // 프로젝트 페이지인 경우, 프로젝트 정보의 hover와 onClick 비활성화
    if (!requirementName) {
      setIsProjectActive(false);
    } else {
      setIsProjectActive(true);
    }
    // 리치 페이지가 아닌 경우, 요구사항 정보의 hover와 onClick 비활성화
    if (!isRichPage) {
      setIsRequirementActive(false);
    } else {
      setIsRequirementActive(true);
    }
  }, [requirementName, isRichPage]);

  return (
    <>
      <div className='mx-8 flex items-center'>
        {/* 프로젝트 정보 */}
        <div
          className={`rounded p-1 ${isProjectActive ? 'hover:cursor-pointer hover:bg-gray-500/10' : ''}`}
          onClick={() => {
            if (isProjectActive) {
              navigate(`/project/${projectCode}`);
            }
          }}>
          <p className='text-lg font-normal'>{projectName}</p>
        </div>
        {/* 요구사항 정보 */}
        {requirementName && (
          <>
            <Right className='mx-2 h-4 w-4 stroke-gray-500/50 stroke-2' />
            <div
              className={`rounded p-1 ${isRequirementActive ? 'hover:cursor-pointer hover:bg-gray-500/10' : ''}`}
              onClick={() => {
                if (isRequirementActive) {
                  navigate(
                    `/project/${projectCode}/requirement/${requirementCode}`,
                  );
                }
              }}>
              <p className='text-lg font-normal'>{requirementName}</p>
            </div>
          </>
        )}
        {/* 리치에디터 정보 */}
        {isRichPage && (
          <>
            <Right className='mx-2 h-4 w-4 stroke-gray-500/50 stroke-2' />
            <p className='cursor-default text-lg font-normal'>에디터</p>
          </>
        )}
      </div>
    </>
  );
};

export default Breadcrumb;
