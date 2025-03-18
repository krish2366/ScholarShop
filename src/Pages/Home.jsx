import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";

function Home() {

  const [products, setproducts] = useState([])
  useEffect(() => {
    // fetch the data
    fetch("http://localhost:5000/item/get-all-items")
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setproducts(data.data)
    })
    .catch(err => console.log(err))
  }, [])
  


  return (
    <>
      <Navbar />
      <section className="bg-[#DCE6EC] ">
        {/* hero section */}
        <div className="px-14 pt-[5.7rem] pb-5 flex ">
          <div className="bg-[#90B1DA] w-[60%] p-10 rounded-xl rounded-e-none shadow-lg  ">
            <h1 className=" my-10 text-[2.5rem] font-semibold text-center">
              Turn your stuff into savings!
            </h1>
            <h1 className="  text-[2.5rem] font-light text-center mx-44">
              Find greatest Deals at one place.
            </h1>
            <div className="flex justify-center my-5">
              <a
                href="#categories"
                className="bg-[#fff]  px-10 py-3 rounded-full  font-semibold"
              >
                Deal Now!
              </a>
            </div>
          </div>
          <div className="w-[40%] bg-[#D9D9D9] rounded-xl rounded-s-none shadow-lg">
            {/* image */}
          </div>
        </div>

        {/* categories */}
        <div>
          <h1
            id="categories"
            className="text-center text-[2.5rem] font-medium my-5"
          >
            Popular Categories
          </h1>
          <div className="flex justify-center gap-10">
            <div className="w-[20%] p-5 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Books
              </h1>
            </div>
            <div className="w-[20%] p-5 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                PYQs
              </h1>
            </div>
            <div className="w-[20%] p-5 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Instruments
              </h1>
            </div>
            <div className="w-[20%] p-5 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Essentials
              </h1>
            </div>
          </div>
        </div>

        {/* products */}
        <div>
          <h3 className="text-center text-[2.5rem] font-medium my-5">Products</h3>
          <div className="grid grid-cols-4 gap-10 p-10">
            { products.length > 0 ? products.map((product,index) =>{
              return  <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-200 ">
                        <img className="w-full h-48 object-cover" src={product.imageUrl} alt="Card image" />
                        <div className="p-4">
                          <h5 className="text-lg font-semibold">{product.title}</h5>
                          <p className="text-gray-700 mt-2">{product.description}</p>
                          <p className="text-gray-700 mt-2">₹{product.price}</p>
                          <a href={`/item/${product.id}`} className="mt-4 inline-block bg-blue-500 text-gray-200 px-4 py-2 rounded-lg hover:bg-blue-600">Explore this</a>
                        </div>
                      </div>
            })              
            : <h1>Loading...</h1>}
            

          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
