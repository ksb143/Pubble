import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from '@/components/navbar/Message';
import Notification from '@/components/navbar/Notification';
import Profile from '@/components/layout/Profile';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';
import Breadcrumb from '@/components/navbar/Breadcrumb';
import Logo from '@/assets/images/logo_long.png';
import Envelope from '@/assets/icons/envelope.svg?react';
import Bell from '@/assets/icons/bell.svg?react';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<
    null | 'message' | 'notification' | 'profile'
  >(null);

  const toggleMenu = (menu: 'message' | 'notification' | 'profile') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-10 transition duration-700 ${activeMenu ? (activeMenu === 'profile' ? 'bg-transperant backdrop-blur-none' : 'bg-gray-900/30 backdrop-blur-none') : 'pointer-events-none -z-10'}`}
        onClick={() => setActiveMenu(null)}></div>

      <Message
        isOpen={activeMenu === 'message'}
        closeMenu={() => setActiveMenu(null)}
      />

      <Notification
        isOpen={activeMenu === 'notification'}
        closeMenu={() => setActiveMenu(null)}
      />

      <div className='fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-16 shadow'>
        <div className='flex items-center'>
          <img
            className='h-12 cursor-pointer'
            src={Logo}
            alt='logo'
            onClick={() => {
              navigate('/main');
            }}
          />

          <Breadcrumb />
        </div>

        <div className='flex items-center'>
          <div className='mr-8'>프로젝트 참여 인원 및 현재 접속자 표시</div>
          <div
            className={`mr-8 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10 ${activeMenu === 'message' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleMenu('message')}>
            <Envelope
              className={`h-8 w-8 stroke-gray-900 ${activeMenu === 'message' ? 'stroke-[1.5]' : 'stroke-1'}`}
            />
          </div>

          <div
            className={`mr-8 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10 ${activeMenu === 'notification' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleMenu('notification')}>
            <Bell
              className={`h-8 w-8 fill-gray-900 stroke-gray-900 ${activeMenu === 'notification' ? 'stroke-[6]' : 'stroke-2'}`}
            />
          </div>

          <div className='relative'>
            <div
              className='cursor-pointer'
              onClick={() => toggleMenu('profile')}>
              <Profile width='3rem' height='3rem' />
            </div>
            <ProfileDropdown isOpen={activeMenu === 'profile'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
