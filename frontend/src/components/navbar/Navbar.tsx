// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getFCMToken, setupFCMListener } from '@/apis/notification';
// 4. store
import useUserStore from '@/stores/userStore';
import useNotificationStore from '@/stores/notificationStore';
// 5. component
import Message from '@/components/navbar/Message';
import Notification from '@/components/navbar/Notification';
import Profile from '@/components/layout/Profile';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';
import Breadcrumb from '@/components/navbar/Breadcrumb';
import Badge from '@/components/navbar/Badge';
// 6. assets
import Logo from '@/assets/images/logo_long.png';
import Envelope from '@/assets/icons/envelope.svg?react';
import Bell from '@/assets/icons/bell.svg?react';

const Navbar = () => {
  const navigate = useNavigate();
  const { name, profileColor } = useUserStore();
  const {
    hasNewMessage,
    hasNewNotification,
    setHasNewMessage,
    setHasNewNotification,
  } = useNotificationStore();

  // 클릭한 메뉴 상태
  const [activeMenu, setActiveMenu] = useState<
    null | 'message' | 'notification' | 'profile'
  >(null);

  // 메뉴 토글 함수
  const toggleMenu = (menu: 'message' | 'notification' | 'profile') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // firebase 초기 설정
  useEffect(() => {
    // FCM 토큰 요청
    getFCMToken();
    // FCM 리스너 등록
    setupFCMListener();
  }, []);

  // 해당 메뉴 선택시 배지 비활성화
  useEffect(() => {
    if (activeMenu === 'message') {
      setHasNewMessage(false);
    }

    if (activeMenu === 'notification') {
      setHasNewNotification(false);
    }
  }, [activeMenu, hasNewMessage, hasNewNotification]);

  return (
    <>
      {/* 모달 backdrop */}
      <div
        className={`fixed inset-0 z-10 transition duration-700 ${activeMenu ? (activeMenu === 'profile' ? 'bg-transperant backdrop-blur-none' : 'bg-gray-900/30 backdrop-blur-none') : 'pointer-events-none -z-10'}`}
        onClick={() => setActiveMenu(null)}></div>

      {/* 쪽지 모달 */}
      <Message
        isOpen={activeMenu === 'message'}
        closeMenu={() => setActiveMenu(null)}
      />

      {/* 알림 모달 */}
      <Notification
        isOpen={activeMenu === 'notification'}
        closeMenu={() => setActiveMenu(null)}
        setActiveMenu={setActiveMenu}
      />

      {/* 상단바 전체 */}
      <div className='fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-16 shadow'>
        <div className='flex items-center'>
          {/* 퍼블 로고 */}
          <img
            className='h-12 cursor-pointer'
            src={Logo}
            alt='logo'
            onClick={() => {
              navigate('/main');
            }}
          />

          {/* 페이지 정보 */}
          <Breadcrumb />
        </div>

        <div className='flex items-center'>
          <div className='mr-8'>현재 접속자 표시</div>

          {/* 쪽지 아이콘 */}
          <div
            className={`relative mr-6 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-500/10 ${activeMenu === 'message' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleMenu('message')}>
            <Envelope
              className={`h-8 w-8 stroke-gray-900 ${activeMenu === 'message' ? 'stroke-[1.5]' : 'stroke-1'}`}
            />
            {hasNewMessage && <Badge size='sm' position='right' />}
          </div>

          {/* 알림 아이콘 */}
          <div
            className={`relative mr-8 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-gray-500/10 ${activeMenu === 'notification' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleMenu('notification')}>
            <Bell
              className={`h-8 w-8 fill-gray-900 stroke-gray-900 ${activeMenu === 'notification' ? 'stroke-[6]' : 'stroke-2'}`}
            />
            {hasNewNotification && <Badge size='sm' position='right-sm' />}
          </div>

          {/* 프로필 아이콘 */}
          <div className='relative'>
            <div
              className='cursor-pointer'
              onClick={() => toggleMenu('profile')}>
              <Profile
                width='3rem'
                height='3rem'
                name={name}
                profileColor={profileColor}
              />
            </div>
            {/* 프로필 모달 */}
            <ProfileDropdown isOpen={activeMenu === 'profile'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
