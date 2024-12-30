import React from 'react'
import follow from'../assets/follow.svg'
import Heart from'../assets/Heart.svg'
import redHeart from'../assets/redHeart.svg'
import camera from '../assets/camera.svg'

const Profile = () => {
  return (
    <div class='bg-[#DCE6EC] '>
        <div class='border border-solid border-black ml-96 flex'>
            <h2 className='font-bold text-3xl mt-10 mb-10 ml-72'>Posts uploaded</h2>
            <div class='h-8 w-9 border-black border rounded-full mt-10 ml-4 pl-3 pt-1 font-bold'>2</div>
        </div>
        <div className='flex'>
            <div class='border-x border-black h-screen w-96'>
                <div class="justify-items-center  mr-12 ml-16 bg-[#D9D9D9] h-60 w-60 p-20 border border-solid border-black  rounded-full">
                
                <img src={camera} alt="pic" class='h-16' />
                </div>
                <div className='flex'>
                <p class='font-bold ml-28 mt-8 text-xl'>User Name</p>
                <div class='h-7 w-12 border border-black rounded-full mt-8 ml-4 flex'>
                    <img src={follow} alt="" class='size-6 ml-2' />
                    <p>+</p>
                </div>
                </div>  
                <div className='flex ml-20 mt-7 gap-10'>
                    <p class='font-regular '>Year: 2nd</p>
                    <p>Branch : CSE AI</p>
                </div>
                <p class='font-mediam ml-20 mt-5'>Bio</p>
                <div className='flex'>
                <p class='mt-10 ml-14 font-medium'>0 Followers</p>
                <p class='font-bold mt-9 ml-10 text-xl'>|</p>
                <p class='mt-10 ml-12 font-medium'>0 Following</p>
                </div>
                
            </div>
            <section className='flex-wrap flex '>
                <div class='ml-20 mt-10 h-72 border bg-[#D9D9D9] rounded-xl '>
                    <div className='h-56 w-64 border border-b-[#A8A6A6] bg-[#D9D9D9] rounded-t-xl shadow-lg'></div>
                    <img src={Heart} alt="" class='ml-52 mt-3' />
                </div>
                <div class='ml-20 mt-10 h-72 border bg-[#D9D9D9] rounded-xl '>
                    <div className='h-56 w-64 border  border-b-[#A8A6A6] bg-[#D9D9D9] rounded-t-xl shadow-lg'></div>
                    <img src={redHeart} alt="" class='ml-52 mt-3' />
                </div>
                
            </section>
        </div>
    </div>

  )
}

export default Profile
