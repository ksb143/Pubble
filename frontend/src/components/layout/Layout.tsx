// 1. react
import { Outlet } from 'react-router-dom';
// 2. library
// 3. api

// 4. store
// 5. component
import Navbar from '@/components/navbar/Navbar';
// 6. assets

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
