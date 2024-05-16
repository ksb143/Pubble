import { Routes, Route } from 'react-router-dom';
import AdminPage from '@/pages/admin/AdminPage';

const Admin = () => {
  return (
    <Routes>
      <Route path='*' element={<AdminPage />} />
    </Routes>
  );
};

export default Admin;
