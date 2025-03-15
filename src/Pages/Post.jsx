import React from "react";
import camera from "../assets/camera.svg";
import Navbar from "../Components/Navbar";

const Post = () => {
  return (
    <>
      <Navbar />
      <div class="bg-[#DCE6EC] h-screen">
        <h2 className="font-bold  text-4xl pt-16 ml-[36rem] ">
          Post Your Item
        </h2>
        <div className="flex">
          <div class="justify-items-center  scroll-mr-12 ml-16 mb-20 mt-12 h-96 w-[37.5rem] p-20 pt-24 border border-dashed border-black  rounded-xl">
            <div class="flex-wrap ">
              <img src={camera} alt="pic" class="size-20 ml-[1.9rem]" />
              <div class="p-2">
                <button className="bg-[#0057A1] text-white rounded-md py-2 px-4  ">
                  Upload photos
                </button>
              </div>
              <p>Upload upto 4 photos</p>
            </div>
          </div>
          <section class=" font-medium m-[50px]">
            <div>
              <p>Title</p>
              <input className="border border-black w-[31.25rem] p-1.5 rounded-md shadow-md "></input>
            </div>
            <div class="mt-[30px]">
              <p>Description</p>
              <input className="border border-black h-16 w-[31.25rem] p-1.5 rounded-md shadow-md "></input>
            </div>
            <div class="mt-[30px]">
              <p>Category</p>
              <select className="border border-black w-[31.25rem] p-1.5 rounded-md shadow-md ">
                <option>Books</option>
                <option>Notes</option>
                <option>Drafter</option>
                <option>Essentials</option>
                <option>PYQ's</option>
              </select>
            </div>
            <div class="mt-[30px]">
              <p>price</p>
              <input className="border border-black w-[31.25rem] p-1.5 rounded-md shadow-md "></input>
            </div>
          </section>
        </div>
        <div className="flex justify-center">
          <button className="bg-[#183C6D] text-white rounded-xl w-64 p-2 h-12 font-bold text-xl">
            Post
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
