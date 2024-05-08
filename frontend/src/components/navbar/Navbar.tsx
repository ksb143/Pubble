import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from '@/components/navbar/Message';
import Notification from '@/components/navbar/Notification';
import Profile from '@/components/layouts/Profile';
import Logo from '@/assets/images/logo_long.png';
import Envelope from '@/assets/icons/envelope.svg?react';
import Bell from '@/assets/icons/bell.svg?react';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<
    null | 'message' | 'notification' | 'profile'
  >(null);

  const toggleModal = (modal: 'message' | 'notification' | 'profile') => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-10 transition duration-700 ${activeModal ? 'bg-gray-900/30 backdrop-blur-none' : 'pointer-events-none opacity-0'}`}
        onClick={() => setActiveModal(null)}></div>

      <Message
        isOpen={activeModal === 'message'}
        closeModal={() => setActiveModal(null)}
      />

      <Notification
        isOpen={activeModal === 'notification'}
        closeModal={() => setActiveModal(null)}
      />

      <div className='fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-16 shadow'>
        <img
          className='h-12 cursor-pointer'
          src={Logo}
          alt='logo'
          onClick={() => {
            navigate('/main');
          }}
        />

        <div className='flex items-center'>
          <div
            className={`mr-8 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10 ${activeModal === 'message' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleModal('message')}>
            <Envelope
              className={`h-8 w-8 stroke-gray-900 ${activeModal === 'message' ? 'stroke-[1.5]' : 'stroke-1'}`}
            />
          </div>

          <div
            className={`mr-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10 ${activeModal === 'notification' ? ' bg-gray-900/10' : ''}`}
            onClick={() => toggleModal('notification')}>
            <Bell
              className={`h-8 w-8 fill-gray-900 stroke-gray-900 ${activeModal === 'notification' ? 'stroke-[6]' : 'stroke-2'}`}
            />
          </div>

          <Profile />
        </div>
      </div>
    </>
  );
};

export default Navbar;
