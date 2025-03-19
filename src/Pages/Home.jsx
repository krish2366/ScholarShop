import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Home() {
  const [products, setproducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    // fetch the data
    fetch("http://localhost:5000/item/get-all-items")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setproducts(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#FFF4DC] flex flex-col ">

        {/* hero section */}
        <div className="container mx-auto px-10 pt-24 pb-10 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-3/5 bg-white p-10 rounded-xl rounded-e-none shadow-lg">
            <h1 className="text-4xl font-semibold text-[#F47C26] text-center mb-6">
              Turn your stuff into savings!
            </h1>
            <h2 className="text-3xl font-light text-[#333333] text-center mb-8">
              Find the greatest deals in one place.
            </h2>
            <div className="flex justify-center gap-4">
              <a
                href="#categories"
                className="bg-[#F47C26] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Deal Now!
              </a>
              {isLoggedIn && (
                <Link
                  to="/post"
                  className="bg-[#F47C26] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                >
                  Add Item
                </Link>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/5 mt-6 md:mt-0">
            <div className="bg-gray-200 h-64 rounded-xl rounded-s-none shadow-lg" />
            {/* Placeholder for image */}
          </div>
        </div>

        {/* categories */}
        <div className="container mx-auto px-6 py-10">
        <h1
            id="categories"
            className="text-4xl font-medium text-[#333333] text-center mb-10"
          >
            Popular Categories
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Books
              </h1>
            </div>
            <div className="p-4 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                PYQs
              </h1>
            </div>
            <div className="p-4 ">
              <div className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none">
                {/* image */}
              </div>
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Instruments
              </h1>
            </div>
            <div className="p-4 ">
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
        <div className="container mx-auto px-6 py-10">
          <h3 className="text-4xl font-medium text-[#333333] text-center mb-10">
            Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-5">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg overflow-hidden shadow-lg bg-white"
                >
                  <img
                    className="w-full h-48 object-cover"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-[#333333]">
                      {product.title}
                    </h5>
                    <p className="text-[#333333] mt-2">{product.description}</p>
                    <p className="text-[#333333] mt-2">₹{product.price}</p>
                    <Link
                      to={`/item/${product.id}`}
                      className="mt-4 inline-block bg-[#F47C26] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                      Explore This
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#333333] text-xl">Loading...</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
