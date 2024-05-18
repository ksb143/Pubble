// 1. react 관련
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
import RequirementList from '@/components/requirement/RequirementList';
import RequirementAddModal from '@/components/requirement/RequirementAddModal';
import { Button } from '@/components/ui/button';
// 개별 프로젝트 페이지를 보여주는 페이지 컴포넌트
const ProjectPage = () => {
  // page 컴포넌트 이므로, setPageType을 설정해준다.
  // 이 페이지에서 사용하는 상태값들을 가져온다.
  // pId, pCode, pName 를,,, store에서 가져와 정의한다.
  const pId = usePageInfoStore.getState().projectId;
  const pCode = usePageInfoStore.getState().projectCode;

  return (
    <>
      <RequirementList pId={pId} pCode={pCode} />
    </>
  );
};

export default ProjectPage;
