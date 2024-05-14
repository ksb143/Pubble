import { Routes, Route } from 'react-router-dom';
import ProjectPage from '@/pages/project/ProjectPage';
import RequirementPage from '@/pages/requirement/RequirementPage';
import RichPage from '@/pages/rich/RichPage';

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
        element={<RichPage />}
      />
    </Routes>
  );
};

export default Project;
