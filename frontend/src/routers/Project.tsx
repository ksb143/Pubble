// 1. react
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// 2. library
// 3. api
import { generateJwt } from '@/utils/tiptap';
// 4. store
// 5. component
import ProjectPage from '@/pages/project/ProjectPage';
import RequirementPage from '@/pages/requirement/RequirementPage';
import RichEditorPage from '@/pages/rich/RichEditorPage.tsx';
// 6. asset

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
