import logo from '@/assets/images/logo_long.png';
import Envelope from '@/components/icons/envelope.svg?react';
import Bell from '@/components/icons/bell.svg?react';

const Navbar = () => {
  return (
    <div className='fixed left-0 right-0 top-0 grid h-16 grid-cols-6 items-center bg-white px-16 shadow'>
      <img className='col-span-1 h-12' src={logo} alt='logo' />
      <div className='col-start-6 flex items-center justify-between'>
        <Envelope className='h-8 w-8 stroke-gray-900 stroke-1' />
        <Bell className='h-8 w-8 stroke-gray-900 stroke-2' />
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-300'>
          <div className='font-normal text-white'>심규영</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
