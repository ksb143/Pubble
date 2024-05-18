// 1. react 관련
// import { useEffect } from 'react';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
import RequirementList from '@/components/requirement/RequirementList';
// 개별 프로젝트 페이지를 보여주는 페이지 컴포넌트
const ProjectPage = () => {
  const { projectId, projectCode } = usePageInfoStore((state) => ({
    projectId: state.projectId,
    projectCode: state.projectCode,
    setPageType: state.setPageType,
  }));
  return (
    <>
      <RequirementList pId={projectId} pCode={projectCode} />
    </>
  );
};

export default ProjectPage;
