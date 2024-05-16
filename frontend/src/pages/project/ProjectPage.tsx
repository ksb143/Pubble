// 1. react 관련
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. components
import RequirementList from '@/components/requirement/RequirementList';

const ProjectPage = () => {
  const location = useLocation();
  const { prdId, projectId, projectTitle } = location.state;
  const projectCode = prdId;
  const projectName = projectTitle;
  // store에서 projectId, projectCode, projectName을 업데이트 하는 함수를 가져옴
  const { setPageType } = usePageInfoStore();
  // 컴포넌트가 마운트 될 때, projectId, projectCode, projectName을 업데이트
  useEffect(() => {
    setPageType('project', {
      projectId: projectId,
      projectCode: projectCode,
      projectName: projectName,
    });
  }, [projectId, projectCode, projectName, setPageType]);
  // // 스토어에 잘 저장되었는지 체크
  // console.log('zustand 스토어에 잘 저장되었는지 체크')
  // console.log("projectId : ", projectId)
  // console.log("projectCode : ", projectCode)
  // console.log("projectName : ", projectName)

  return (
    <div>
      <RequirementList
        projectId={projectId}
        projectName={projectName}
        projectCode={projectCode || '프로젝트 코드 예시'}
      />
    </div>
  );
};

export default ProjectPage;
