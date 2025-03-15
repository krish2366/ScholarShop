import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import user from "../assets/user.svg";
import { useParams } from 'react-router-dom';

function Item() {

    const [product, setProduct] = useState({})

    const { id } = useParams();
    useEffect(()=>{
        fetch(`http://localhost:5000/item/get-item-details/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setProduct(data.data)
        })
        .catch(err => console.log(err))



    },[])


  return (
    <section className="bg-[#DCE6EC] min-h-screen">
      <Navbar/>
      <section className="flex">
        <section className="w-[60%] ">
            <div className='bg-white mx-14 my-10 px-5 pt-5 pb-10 '>
                <img src={product.imageUrl} className=' rounded-xl shadow-lg' />
            </div>
            <div className='bg-white mx-14 mt-10 px-5 pt-5 pb-5 '>
                <h3 className='text-2xl font-semibold'>{product.title}</h3>
                <h6 className='text-xl pt-2'>₹{product.price}</h6>
            </div>

            <h4 className='text-end text-xl my-5 mr-14'>Posted on {new Date(product.createdAt).toLocaleDateString()} </h4>

        </section>
        <section className=" w-[40%] border-l-2 border-black">
            <div className='m-10 mb-20 min-h-40 bg-white'>
                <h1 className='text-2xl font-semibold text-center pt-2'>{product.title}</h1>
                <p className='p-4 text-gray-600'>{product.description}</p>

            </div>

            <div className='m-10 min-h-20 bg-white'>
                <div className='flex gap-5 justify-center items-center py-5'>
                    <div className='h-10 w-10 rounded-full bg-red-300 flex items-center justify-center'>
                        <img src={user} alt="user" className="h-7 w-7" />
                    </div>
                    <h1 className='text-2xl font-semibold'>{product.User?.email || "User Uncertain"}</h1>
                </div>
                <div className='flex justify-center items-center'>
                    <button className='text-xl font-semibold bg-blue-400 rounded-2xl px-4 py-2 mb-5 '>Chat with Seller</button>

                </div>
            </div>
        </section>
      </section>
    </section>
  )
}

export default Item
