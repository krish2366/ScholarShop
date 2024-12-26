import React from 'react'

function Home() {
  return (
    <section className='bg-[#DCE6EC] '>
      {/* hero section */}
      <div className='px-14 pt-[5.7rem] pb-5 flex '>
        <div className='bg-[#90B1DA] w-[60%] p-10 rounded-xl rounded-e-none shadow-lg  '>
          <h1 className=' my-10 text-[2.5rem] font-semibold text-center'>Turn your stuff into savings!</h1>
          <h1 className='  text-[2.5rem] font-light text-center mx-44'>Find greatest Deals at
          one place.</h1>
          <div className='flex justify-center my-5'>
            <a href='#categories' className='bg-[#fff]  px-10 py-3 rounded-full  font-semibold'>Deal Now!</a>
          </div>
        </div>
        <div className='w-[40%] bg-[#D9D9D9] rounded-xl rounded-s-none shadow-lg' >
          {/* image */}
        </div>
      </div>

      {/* categories */}
      <div>
        <h1 id='categories' className='text-center text-[2.5rem] font-medium my-5'>Popular Categories</h1>
        <div className='flex justify-center gap-10'>
          <div className='w-[20%] p-5 '>
            <div className='w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none'>
              {/* image */}
            </div>
            <h1 className='text-center text-[1.5rem] font-semibold my-3'>Books</h1>
          </div>
          <div className='w-[20%] p-5 '>
            <div className='w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none'>
              {/* image */}
            </div>
            <h1 className='text-center text-[1.5rem] font-semibold my-3'>PYQs</h1>
          </div>
          <div className='w-[20%] p-5 '>
            <div className='w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none'>
              {/* image */}
            </div>
            <h1 className='text-center text-[1.5rem] font-semibold my-3'>Instruments</h1>
          </div>
          <div className='w-[20%] p-5 '>
            <div className='w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none'>
              {/* image */}
            </div>
            <h1 className='text-center text-[1.5rem] font-semibold my-3'>Essentials</h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
