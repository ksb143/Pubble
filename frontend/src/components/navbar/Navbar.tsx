import { useState } from 'react';
import Profile from '@/components/layouts/Profile';
import Notification from '@/components/navbar/Notification';
import logo from '@/assets/images/logo_long.png';
import Envelope from '@/assets/icons/envelope.svg?react';
import Bell from '@/assets/icons/bell.svg?react';

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <>
      {showNotification && (
        <Notification closeNotification={() => setShowNotification(false)} />
      )}
      <div className='fixed left-0 right-0 top-0 flex h-16 items-center justify-between bg-white px-16 shadow'>
        <img className='h-12 cursor-pointer' src={logo} alt='logo' />

        <div className='flex items-center'>
          <div className='mr-8 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10'>
            <Envelope className='h-8 w-8 stroke-gray-900 stroke-1' />
          </div>

          <div
            className='mr-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10'
            onClick={toggleNotification}>
            <Bell className='h-8 w-8 stroke-gray-900 stroke-2' />
          </div>

          <Profile />
        </div>
      </div>
    </>
  );
};

export default Navbar;
