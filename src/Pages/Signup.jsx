import React from 'react'
import logo from '../assets/logo1.svg'
import supimg from '../assets/signup.svg'

function Signup() {
  return (
    <div className='flex'>
        <section className='w-1/2 bg-[#DCE6EC] h-screen p-20 pb-0'>
            <p className='font-bold text-4xl'>Sign Up</p>
            <p className='text-2xl p-8 pl-0'>
                Already have an account? <a href="/login" className='text-[#2F46BD] underline'>Login here</a>
            </p>
            <section >
                <form className='flex flex-col mt-9'>
                    <div className='flex justify-between items-center mb-8'>
                        <label className='text-lg font-bold'>Name</label>
                        <input className='border-2 border-[#D9D9D9] rounded-full p-2 w-96 text-center' type='text' placeholder='First Name'/>
                    </div>
                    <div className='flex justify-between items-center mb-8'>
                        <label className='text-lg font-bold'>Email ID</label>
                        <input className='border-2 border-[#D9D9D9] rounded-full p-2 w-96 text-center' type='text' placeholder='Email ID'/>
                    </div>
                    <div className='flex justify-between items-center mb-8'>
                        <label className='text-lg font-bold'>Phone Number</label>
                        <input className='border-2 border-[#D9D9D9] rounded-full p-2 w-96 text-center' type='text' placeholder='Phone Number'/>
                    </div>
                    <div className='flex justify-between items-center mb-8'>
                        <label className='text-lg font-bold'>Password</label>
                        <input className='border-2 border-[#D9D9D9] rounded-full p-2 w-96 text-center' type='password' placeholder='Password'/>
                    </div>
                   
                </form>
                <div className='flex justify-center'>
                    <button className='bg-[#2F46BD] text-white rounded-full w-64 p-2  mt-8'>Sign Up</button>
                </div>
            </section>
        </section>
        <section className='bg-[#FFFFFF] w-1/2 h-screen p-20 pt-12 pr-0 pb-0 shadow-2xl'>
            <img src={logo} alt="scholar shop" className='h-32'/>
            <h2 className='font-bold italic text-6xl mb-[4.5rem]'>ScholarShop</h2>
            <p className='text-3xl font-light italic'>Campus Deals just a click away!</p>
            <img src={supimg} alt="signup" className='h-96 mx-7'/>
        </section>
    </div>
  )
}

export default Signup
