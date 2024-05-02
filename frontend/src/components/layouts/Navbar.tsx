import logo from '@/assets/images/logo_long.png';
import Envelope from '@/components/icons/envelope.svg?react';
import Bell from '@/components/icons/bell.svg?react';

const Navbar = () => {
  return (
    <div className='fixed left-0 right-0 top-0 grid h-16 grid-cols-8 items-center bg-white px-16 shadow'>
      <img className='col-span-1 h-12 cursor-pointer' src={logo} alt='logo' />

      <div className='col-span-1 col-start-8 flex items-center justify-between'>
        <div className='flex h-11 w-11 items-center justify-center rounded hover:bg-gray-900/10'>
          <span className='relative flex h-3 w-3'>
            <span className='animate-[ping_1s_cubic-bezier(0, 0, 0.2, 1)_3] absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
            <span className='relative inline-flex h-3 w-3 rounded-full bg-sky-500'></span>
          </span>
          <Envelope className='h-8 w-8 stroke-gray-900 stroke-1' />
        </div>

        <div className='flex h-11 w-11 items-center justify-center rounded hover:bg-gray-900/10'>
          <Bell className='h-8 w-8 stroke-gray-900 stroke-2' />
        </div>

        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-300'>
          <div className='font-normal text-white'>심기획</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
