import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const NavBar = () => {

  const navigate = useNavigate();
  const { user, setShowLogin, logOut, credit } = useContext(AppContext);

  return (
    <div className='flex items-center justify-between py-4'>
      <Link to='/'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32 lg:w-40' />
      </Link>

      {user ? (
        // ✅ LOGGED IN
        <div className='flex items-center gap-2 sm:gap-5'>
          <button
            onClick={() => navigate('/buy')}
            className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 lg:py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'
          >
            <img className='w-5' src={assets.credit_star} alt="" />
            <p>Credits Left: {credit}</p>
          </button>

          <p>Hi {user.name}</p>

          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10 drop-shadow' alt="" />
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
              <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                <li onClick={logOut} className='py-1 px-2 cursor-pointer pr-10'>LogOut</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // ✅ LOGGED OUT
        <div className='flex items-center gap-2 sm:gap-5'>
          <p className='cursor-pointer' onClick={() => navigate('/buy')}>Pricing</p>
          <button onClick={()=>setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer'>
            Login
          </button>
        </div>
      )}
    </div>
  )
}

export default NavBar;

