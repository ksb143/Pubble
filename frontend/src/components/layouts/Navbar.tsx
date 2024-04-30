import logo from '@/assets/images/logo_long.png';
import Envelope from '@/components/icons/envelope.svg?react';
import Bell from '@/components/icons/bell.svg?react';

const Navbar = () => {
  return(
    <div className="w-full h-16 flex items-center fixed top-0 left-0 right-0 px-16 border border-red-600">
      <img className='h-12 border border-blue-600' src={logo} alt="logo" />
      <Envelope className='w-8 h-8 stroke-gray-900 stroke-1'/>
      <Bell className='w-8 h-8 stroke-gray-900 stroke-2'/>
      <div className='w-12 h-12 rounded-full bg-pubble relative'>
        <div className='text-white font-normal absolute border-2 border-purple-600'>심규영</div>
      </div>
    </div>
  )
}

export default Navbar