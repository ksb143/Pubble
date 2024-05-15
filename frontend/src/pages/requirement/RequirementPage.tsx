// 1. react
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement } from '@/apis/requirement';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
// 6. asset

const RequirementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    projectId,
    projectCode,
    requirementCode,
    requirementName,
    setPageType,
  } = usePageInfoStore();
  const requirementId = location.state?.requirementId;

  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getRequirement(projectId, requirementId);
        console.log(response.data);
        setPageType('requirement', {
          requirementId: response.data.requirementId,
          requirementCode: response.data.code,
          requirementName: response.data.requirementName,
          isRichPage: false,
        });
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, []);

  return (
    <div className='flex h-full w-full items-center justify-center py-3'>
      <div className='h-full w-1/3 rounded bg-white p-6 shadow'>
        <div className='mb-4 flex text-2xl font-normal'>
          <p>
            {requirementCode} {requirementName}
          </p>
        </div>
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
