// 1. react 관련
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// 2. library
// 3. api
// 4. store
// 5. components
import { Requirement } from '@/components/requirement/RequirementList';

const RequirementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requirement } = location.state as { requirement: Requirement };
  const { projectId, requirementId } = useParams();
  const goRich = () => {
    // 전달 state: requirementName
    navigate(`/project/${projectId}/requirement/${requirementId}/detail`, {
      state: { requirement },
    });
  };

  useEffect(() => {}, []);
  return (
    <div className='flex h-full w-full items-center justify-center py-3'>
      <div className='h-full w-1/3 rounded bg-white p-6 shadow'>
        <div className='mb-4 flex text-2xl font-normal'>
          <p>
            {requirement.requirementId} {requirement.requirementName}
          </p>
        </div>
        <p>{requirement.description}</p>
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
