// 1. react 관련
import { useEffect } from 'react';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
import RequirementList from '@/components/requirement/RequirementList';

// 개별 프로젝트 페이지를 보여주는 페이지 컴포넌트
const ProjectPage = () => {
  // page 컴포넌트 이므로, setPageType을 설정해준다. 
  const { setPageType } = usePageInfoStore();
  // 이 페이지에서 사용하는 상태값들을 가져온다.
  // pId, pCode, pName 를,,, store에서 가져와 정의한다.
  const pId = usePageInfoStore.getState().projectId;
  const pCode = usePageInfoStore.getState().projectCode;
  const pName = usePageInfoStore.getState().projectName;
  // setPageType의 type과 argument를 업데이트한다. useEffect를 사용하여.
  useEffect(() => {
    // setPageType의 type은 'project'이고, argument들은 { projectId: p-Id , projectCode: p-Code, projectName: p-Name }이다.
    // 이를 업데이트한다.
    setPageType('project', {
      projectId: pId,
      projectCode: pCode,
      projectName: pName,
    });
  }, [pId, pCode, pName, setPageType]);


  return (
    <div>
      <RequirementList
        pId={pId}
        pCode={pCode}
        pName={pName}
      />
    </div>
  );
};

export default ProjectPage;
