import { Routes, Route } from 'react-router-dom';

import LoginPage from '@/pages/user/LoginPage.tsx';

const User = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
};

export default User;
