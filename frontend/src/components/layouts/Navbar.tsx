import Profile from '@/components/layouts/Profile';
import logo from '@/assets/images/logo_long.png';
import Envelope from '@/components/icons/envelope.svg?react';
import Bell from '@/components/icons/bell.svg?react';

const Navbar = () => {
  return (
    <div className='fixed left-0 right-0 top-0 flex h-16 items-center justify-between bg-white px-16 shadow'>
      <img className='h-12 cursor-pointer' src={logo} alt='logo' />

      <div className='flex items-center'>
        <div className='mr-8 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10'>
          <Envelope className='h-8 w-8 stroke-gray-900 stroke-1' />
        </div>

        <div className='mr-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10'>
          <Bell className='h-8 w-8 stroke-gray-900 stroke-2' />
        </div>

        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
