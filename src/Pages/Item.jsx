import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import user from "../assets/user.svg";
import { useNavigate, useParams, Link } from "react-router-dom";

function Item() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/item/get-item-details/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data.data);
          setProduct(data.data);
        } else {
          throw new Error(data.message || "Item not found.");
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  }, [id]);

  const buyerClick = () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    navigate(`/chat/${product.userId}/${product.id}`);
  };

  const senderClick = () => {
    navigate(`/availableBuyers/${product.id}`);
  };

  return (
    <section className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar />
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-10">

        <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <h3 className="text-3xl font-semibold text-[#F47C26]">
            {product.title}
          </h3>
          <p className="text-xl text-[#333333] mt-2">₹{product.price}</p>
          <p className="text-sm text-[#333333] text-right mt-4">
            Posted on {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-[#F47C26] mb-4">Description</h4>
            <p className="text-[#333333]">{product.description}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-[#FFF4DC] flex items-center justify-center">
                <img src={user} alt="user" className="h-7 w-7" />
              </div>
              <h5 className="text-xl font-semibold text-[#333333]">
                {product.User?.userName || "Unknown"}
              </h5>
            </div>
            {
                product.userId == userId ? (
                    <>
                        <button
                            className="w-full mt-4 block text-center bg-[#F47C26] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                            onClick={senderClick}
                        >
                            See Interested Buyers
                        </button>

                        <Link
                            to={`/update-item/${id}`}
                            className="w-full mt-4 block text-center bg-[#F47C26] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Update Item
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={buyerClick}
                        className="w-full bg-[#F47C26] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                        Chat with Seller
                    </button>
                )
            }    
          </div>
        </div>
      </section>
    </section>
  );
}

export default Item;
