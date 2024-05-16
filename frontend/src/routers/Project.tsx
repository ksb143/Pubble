import { Routes, Route } from 'react-router-dom';
import ProjectPage from '@/pages/project/ProjectPage';
import RequirementPage from '@/pages/requirement/RequirementPage';
import RichEditorPage from '@/pages/rich/RichEditorPage.tsx';

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
        element={<RichEditorPage />}
      />
    </Routes>
  );
};

export default Project;
