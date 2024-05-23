/** @jsxImportSource @emotion/react */
// 1. react
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
import { css } from '@emotion/react';
// 3. api
import { getFCMToken, setupFCMListener } from '@/apis/notification';
import { getVisitor } from '@/apis/user';
// 4. store
import useUserStore from '@/stores/userStore';
import useNotificationStore from '@/stores/notificationStore';
import useSocketStore from '@/stores/useSocketStore';
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
import Message from '@/components/navbar/Message';
import Notification from '@/components/navbar/Notification';
import Profile from '@/components/layout/Profile';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';
import Breadcrumb from '@/components/navbar/Breadcrumb';
import Badge from '@/components/navbar/Badge';
// 6. asset
import Logo from '@/assets/images/logo_long.png';
import Envelope from '@/assets/icons/envelope.svg?react';
import Bell from '@/assets/icons/bell.svg?react';
// 7. type
import { SocketInfo } from '@/types/socketType';

interface ConnectionInfo {
  users: (SocketInfo & { isConnected: boolean })[];
}

// 프로필 스타일
const zIndexStyle = (index: number, value: number) => css`
  z-index: ${value - index};
`;

const Navbar = () => {
  const navigate = useNavigate();

  // 스토어
  const userState = useUserStore();
  const { projectId } = usePageInfoStore();
  const { connect, disconnect, subscribe, publish } = useSocketStore();
  const {
    hasNewMessage,
    hasNewNotification,
    setHasNewMessage,
    setHasNewNotification,
  } = useNotificationStore();

  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(
    null,
  );
  const previousProjectIdRef = useRef(projectId);

  // 클릭한 메뉴 상태
  const [activeMenu, setActiveMenu] = useState<
    null | 'message' | 'notification' | 'profile'
  >(null);

  // 메뉴 토글 함수
  const toggleMenu = (menu: 'message' | 'notification' | 'profile') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleSendPublish = (publishProjectId: number, operation: string) => {
    // 소켓 통신 데이터
    const socketMessage = {
      operation: operation,
      employeeId: userState.employeeId,
      userInfoDto: {
        name: userState.name,
        employeeId: userState.employeeId,
        department: userState.department,
        position: userState.position,
        role: userState.role,
        isApprovable: userState.isApprovable,
        profileColor: userState.profileColor,
      },
      locationName: 'project',
      locationUrl: '/project',
    };
    publish(`/pub/project/${publishProjectId}`, socketMessage);
    console.log('publish 성공');
  };

  const handleUserChange = (response: SocketInfo) => {
    setConnectionInfo((prevConnectionInfo) => {
      if (!prevConnectionInfo) return prevConnectionInfo;

      if (response.operation === 'e') {
        response.isConnected = true;
        return {
          users: [
            ...prevConnectionInfo.users,
            { ...response, isConnected: true },
          ],
        };
      } else if (response.operation === 'l') {
        response.isConnected = false;
        return {
          users: prevConnectionInfo.users.map((user) =>
            user.employeeId === response.employeeId
              ? { ...user, isConnected: false }
              : user,
          ),
        };
      }
      return prevConnectionInfo;
    });
  };

  // firebase 초기 설정
  useEffect(() => {
    // FCM 토큰 요청
    getFCMToken();
    // FCM 리스너 등록
    setupFCMListener();
  }, []);

  // 해당 메뉴를 선택하거나, 이미 모달이 열려있으면 배지 비활성화
  useEffect(() => {
    if (activeMenu === 'message') {
      setHasNewMessage(false);
    }

    if (activeMenu === 'notification') {
      setHasNewNotification(false);
    }
  }, [activeMenu, hasNewMessage, hasNewNotification]);

  // 웹소켓
  useEffect(() => {
    connect(
      `wss://${import.meta.env.VITE_STOMP_BROKER_URL}`,
      () => {
        subscribe(`/sub/project/${projectId}`, (message) => {
          const response = JSON.parse(message.body);
          handleUserChange(response);
          console.log('프로젝트 구독 성공 : ', response);
        });

        if (previousProjectIdRef.current !== projectId) {
          if (previousProjectIdRef.current > 0) {
            // 이전 프로젝트에서 퇴장 처리
            handleSendPublish(previousProjectIdRef.current, 'l');
          }
          previousProjectIdRef.current = projectId;
        }

        if (projectId > 0) {
          // 새 프로젝트에서 입장 처리
          handleSendPublish(projectId, 'e');

          const fetchUserInfo = async () => {
            // 접속한 유저 정보 받기
            const response = await getVisitor(projectId);
            const dataWithConnectionStatus = {
              users: [
                ...response.data.connected.map((user: SocketInfo) => ({
                  ...user,
                  isConnected: true,
                })),
                ...response.data.nonConnected.map((user: SocketInfo) => ({
                  ...user,
                  isConnected: false,
                })),
              ],
            };
            setConnectionInfo(dataWithConnectionStatus);
            console.log('visitor: ', response.data);
          };
          fetchUserInfo();
        }
      },
      (error) => {
        console.error('연결 오류:', error);
      },
    );

    window.addEventListener('beforeunload', () => {
      handleSendPublish(projectId, 'l');
      disconnect();
    });

    return () => {
      disconnect();
      window.addEventListener('beforeunload', () => {
        handleSendPublish(projectId, 'l');
        disconnect();
      });
    };
  }, [projectId, connect, disconnect, subscribe, publish]);

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
          {/* 접속 유저 */}
          {projectId > 0 && (
            <div className='mr-6 flex w-full items-center justify-center'>
              {/* 접속한 사용자 렌더링 */}
              {connectionInfo?.users.map((user, index) => {
                if (user.userInfoDto && user.isConnected) {
                  return (
                    <div
                      key={`connected_${user.userInfoDto.employeeId}`}
                      css={zIndexStyle(index, 1000)}
                      className={`relative -ml-2 shrink-0 opacity-100 first-of-type:ml-0`}>
                      <Profile
                        width='3rem'
                        height='3rem'
                        name={user.userInfoDto.name}
                        profileColor={user.userInfoDto.profileColor}
                        status='online'
                      />
                    </div>
                  );
                }
              })}
              {/* 비연결된 사용자 렌더링 */}
              {connectionInfo?.users.map((user, index) => {
                if (user.userInfoDto && !user.isConnected) {
                  return (
                    <div
                      key={`nonconnected_${user.userInfoDto.employeeId}`}
                      css={zIndexStyle(index, 500)}
                      className={`relative -ml-2 shrink-0 opacity-100 first-of-type:ml-0`}>
                      <Profile
                        width='3rem'
                        height='3rem'
                        name={user.userInfoDto.name}
                        profileColor={user.userInfoDto.profileColor}
                        status='offline'
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}

          {/* 쪽지 아이콘 */}
          <div
            className={`relative mr-6 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-gray-500/10 ${activeMenu === 'message' ? ' bg-gray-900/10' : ''}`}
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
              className='shrink-0 cursor-pointer'
              onClick={() => toggleMenu('profile')}>
              <Profile
                width='3rem'
                height='3rem'
                name={userState.name}
                profileColor={userState.profileColor}
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
