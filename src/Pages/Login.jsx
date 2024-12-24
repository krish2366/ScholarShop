import React from 'react'
import logo from '../assets/logo1.svg'
import lginimg from '../assets/login.svg'
import google from '../assets/google_logo.svg'
function Login() {
  return (
    <div className='flex'>
        <section className='w-2/3 bg-[#DCE6EC] h-screen p-28  pb-0'> 
            <div className='flex items-center gap-10 mb-12'>
                <h1 className='font-bold text-3xl italic'>ScholarShop</h1>
                <img src={logo} alt="scholar shop" className='h-28'/>
            </div>
            <button className='bg-[#fff] font-semibold rounded-full w-5/6 p-2 mb-5 mt-8  flex items-center justify-center gap-6'>
                <img src={google} alt="google" className='h-8'/>
                <span className='font-bold'>Login with Google</span>
            </button>
            <div className="flex items-center p-7 pr-40 pt-0">
                <div className="flex-grow border-t-2 border-gray-400 "></div>
                <span className="mx-6 text-gray-500">OR LOGIN WITH EMAIL</span>
                <div className="flex-grow border-t-2 border-gray-400"></div>
            </div>

            <input className='border-2 border-[#D9D9D9] rounded-full p-2 pl-7 w-5/6 font-bold placeholder-black mb-8' type='text' placeholder='Your Email'/>
            <input className='border-2 border-[#D9D9D9] rounded-full p-2 pl-7 w-5/6 font-bold placeholder-black' type='password' placeholder='Your Password'/>

            <div className='p-3'>
                <a href="#" className='font-normal '>Forgot Password?</a>
                <p className='mt-3'>
                    Don't have an account? <a href="/signup" className='text-[#2F46BD] underline'>Sign Up</a>
                </p>
            </div>

            <button className='bg-[#2F46BD] text-2xl text-white rounded-full w-5/6 p-2 mt-8'>Login</button>
        </section>
        <section className='w-1/3 bg-[#FEF3DC] flex flex-col items-center justify-center h-screen'>
            <p className='text-2xl font-semibold'>Welcome back!</p>
            <img src={lginimg} alt="login" className='h-96'/>
        </section>
      
    </div>
  )
}

export default Login
