// 1. react 관련
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement } from '@/apis/requirement';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components

const RequirementPage = () => {
  const navigate = useNavigate();
  const {
    projectId,
    setRequirementId,
    setRequirementCode,
    setRequirementName,
    setIsRichPage,
  } = usePageInfoStore();

  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  useEffect(() => {
    // 조회 api 호출
    (async () => {
      try {
        const response = getRequirement(projectId, Number(requirementId));
        console.log('요구사항 데이터 :', response);
        // setRequirementId();
        // setRequirementCode();
        // setRequirementName();
        // setIsRichPage(false);
      } catch (error) {
        console.log('요구사항 조회 실패 : ', error);
      }
    })();
  }, []);

  return (
    <div className='flex h-full w-full items-center justify-center py-3'>
      <div className='h-full w-1/3 rounded bg-white p-6 shadow'>
        <div className='mb-4 flex text-2xl font-normal'>
          {/* <p>
            {requirementId} {requirementName}
          </p> */}
        </div>
        {/* <p>{description}</p> */}
        <button
          className='w-1/4 rounded bg-pubble py-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
          onClick={goRich}>
          에디터 이동
        </button>
      </div>
    </div>
  );
};

export default RequirementPage;
