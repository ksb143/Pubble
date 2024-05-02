import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className='h-full pt-16'>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
