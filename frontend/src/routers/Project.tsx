import { Routes, Route } from 'react-router-dom';
import ProjectPage from '@/pages/project/ProjectPage';
import RequirementPage from '@/pages/requirement/RequirementPage';
import RichEditorPage from '@/pages/rich/RichEditorPage.tsx';
import { provider, ydoc } from '@/utils/tiptap';

const Project = () => {
  return (
    <Routes>
      <Route path='/:projectCode' element={<ProjectPage />} />
      <Route
        path='/:projectCode/requirement/:requirementCode'
        element={<RequirementPage />}
      />
      <Route
        path='/:projectCode/requirement/:requirementCode/detail'
        element={<RichEditorPage provider={provider} ydoc={ydoc} />}
      />
    </Routes>
  );
};

export default Project;
