import logo from '@/assets/images/logo_long.png';
import Envelope from '@/components/icons/envelope.svg?react';

const Navbar = () => {
  return(
    <div className="w-full h-16 flex items-center fixed top-0 left-0 right-0 border border-red-600">
      <img className='h-12 mx-16 border border-blue-600' src={logo} alt="logo" />
      <Envelope className='w-8 h-8'/>
    </div>
  )
}

export default Navbar