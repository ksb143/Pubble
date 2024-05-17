import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectPage from '@/pages/project/ProjectPage';
import RequirementPage from '@/pages/requirement/RequirementPage';
import RichEditorPage from '@/pages/rich/RichEditorPage.tsx';
import { generateJwt } from '@/utils/tiptap';

const Project = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const jwt = await generateJwt();
      setToken(jwt);
    };

    fetchToken();
  }, []);

  return (
    <Routes>
      <Route path='/:projectCode' element={<ProjectPage />} />
      <Route
        path='/:projectCode/requirement/:requirementCode'
        element={<RequirementPage />}
      />
      <Route
        path='/:projectCode/requirement/:requirementCode/detail'
        element={<RichEditorPage tiptapToken={token} />}
      />
    </Routes>
  );
};

export default Project;
