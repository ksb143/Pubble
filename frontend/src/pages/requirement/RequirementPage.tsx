// 1. react 관련
import { useLocation } from "react-router-dom";
// 2. library
// 3. api
// 4. store
// 5. components
import { Requirement } from '@/components/requirement/RequirementList';

const RequirementPage = () => {
  const location = useLocation();
  const { requirement } = location.state as { requirement: Requirement };
  return (
    <>
      <div>
        <p>요구사항 페이지</p>
        <p>{requirement.requirementId}</p>
        <p>{requirement.requirementName}</p>
        <p>{requirement.description}</p>

      </div>
    </>
  );
};

export default RequirementPage;
