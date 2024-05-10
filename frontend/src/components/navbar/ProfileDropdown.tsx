import { useNavigate } from 'react-router-dom';
import { logout } from '@/apis/user';
import useUserStore from '@/stores/userStore';
import Profile from '@/components/layout/Profile';
import Exit from '@/assets/icons/exit.svg?react';

interface ProfileDropdownProps {
  isOpen: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const { department, position, employeeId } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`absolute -right-6 top-full z-20 mt-4 flex w-fit min-w-56 flex-col items-center rounded border border-gray-200 bg-white shadow transition duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none -z-10 opacity-0'}`}>
      <div className='flex items-center px-6 py-6'>
        <Profile width='3rem' height='3rem' />
        <div className='ml-5'>
          <p className='text-nowrap text-2xl font-normal'>
            {department} {position}
          </p>
          <p>{employeeId}</p>
        </div>
      </div>
      <div className='flex-start flex w-full border-t border-gray-200 px-3 py-3'>
        <div
          className='flex w-full cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-400/10'
          onClick={handleLogout}>
          <Exit className='h-6 w-6 fill-gray-500/50' />
          <p className='mx-3 w-full text-lg'>로그아웃</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
