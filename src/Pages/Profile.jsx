import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import follow from "../assets/follow.svg";
import Heart from "../assets/Heart.svg";
import redHeart from "../assets/redHeart.svg";
import camera from "../assets/camera.svg";

const Profile = () => {

  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchProfile = async () =>{
      const token = localStorage.getItem("accessToken");

      try {
        const res = await fetch("http://localhost:5000/profile/get-profile",{
          method: "GET",
          headers:{
            Authorization: `Bearer ${token}`
          },
        })

        const resData = await res.json();
        // console.log(resData)
        if(resData.sucess){
          console.log(resData.data)
          setUser(resData.data)

        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchProfile();
  
    
  }, [])
  
  console.log(user)























    
  return (
    <>
      <Navbar />
      <div className="bg-[#FFF4DC] min-h-screen ">
        <div className="border border-solid border-black ml-96 flex">
          <h2 className="font-bold text-3xl mt-10 mb-10 ml-72">
            Posts uploaded
          </h2>
          <div className="h-8 w-9 border-black border rounded-full mt-10 ml-4 pl-3 pt-1 font-bold">
            {user?.items?.length}
          </div>
        </div>
        <div className="flex">
          <div className=" flex flex-col justify-start items-center border-x border-black w-96">
            <div className="justify-items-center  mr-12 ml-16 bg-[#D9D9D9] h-60 w-60 p-20 border border-solid border-black  rounded-full">
              <img src={camera} alt="pic" className="h-16" />
            </div>
            <p className="font-bold mt-8 text-xl">@{user?.profile?.userName}</p>
          </div>

          <section className="grid grid-cols-3 gap-10 p-5">
            {user?.items?.length > 0 ? (
              user.items.map((product) => (
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
            
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;
