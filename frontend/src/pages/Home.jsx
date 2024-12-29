import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  // useEffect(() =>{
  //   const isLoggedIn = localStorage.getItem('auth');
  //   if(isLoggedIn){
  //     navigate('/chat')
  //   }
  // },[])
  return (
    <div className='flex flex-col h-screen'>
      <nav className='flex justify-end bg-gray-700 p-2'>
        <div className='mx-2 text-white font-semibold'>
          <Link to = '/login'>Login</Link>
        </div>
        <div className='mx-2 text-white font-semibold'>
          <Link to  = '/signup'>Sign Up</Link>
        </div>
      </nav>
      <main className='flex flex-1 flex-col items-center justify-center'>
        <p className='font-bold text-5xl my-4 text-gray-700'>Aa Gye GupShup karne 😁</p>
        <p className='text-indigo-500 font-bold text-xl'>Meet your freinds and chat with them</p>
      </main>
    </div>
  )
}

export default Home