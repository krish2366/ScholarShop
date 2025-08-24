import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import user from "../assets/User.svg";
import { useNavigate, useParams, Link } from "react-router-dom";

function Item() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState("other");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_MAIN_BACKEND_URL}/item/get-item-details/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const productData = { ...data.data };
          if (
            productData.imageUrl &&
            typeof productData.imageUrl === "string"
          ) {
            try {
              productData.imageUrl = JSON.parse(productData.imageUrl);
            } catch (e) {
              // console.log(
              //   "Direct JSON parse failed, trying alternative parsing..."
              // );
              try {
                let cleanedImageUrl = productData.imageUrl
                  .replace(/\\/g, "")
                  .replace(/"/g, '"')
                  .trim();

                if (
                  cleanedImageUrl.startsWith('"') &&
                  cleanedImageUrl.endsWith('"')
                ) {
                  cleanedImageUrl = cleanedImageUrl.slice(1, -1);
                }

                productData.imageUrl = JSON.parse(cleanedImageUrl);
              } catch (e2) {
                console.error("All parsing attempts failed:", e2);
                const urlMatches = productData.imageUrl.match(
                  /https?:\/\/[^\s"',\]]+/g
                );
                if (urlMatches && urlMatches.length > 0) {
                  productData.imageUrl = urlMatches;
                  // console.log("Extracted URLs using regex:", urlMatches);
                } else {
                  productData.imageUrl = [productData.imageUrl];
                }
              }
            }
          }
          setProduct(productData);
          setIsAvailable(productData.isAvailable);
        } else {
          throw new Error(data.message || "Item not found.");
        }
      })
      .catch((err) => {
        // console.log(err);
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

  const soldClick = async () => {
    const proceed = confirm(
      "This action can't be reversed without admin's request. Do you want to proceed?"
    );
    if (proceed) {
      try {
        const token = localStorage.getItem('accessToken')

        const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/item/mark-as-sold/${id}`,{
            method: "PATCH",
            headers:{
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          alert("Action completed successfully!");
          setIsAvailable(false);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server.");
      }
    } else {
      alert("Action cancelled.");
    }
  };

  const handleReportItem = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!reportMessage.trim()) {
      alert("Please provide a reason for reporting this item.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BACKEND_URL}/report/report-item/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaint: reportMessage,
            type: reportType, // Send the selected report type
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          "Item reported successfully. Thank you for helping keep our platform safe."
        );
        setShowReportModal(false);
        setReportMessage("");
        setReportType("other"); // Reset report type
      } else {
        alert(data.message || "Failed to report item. Please try again.");
      }
    } catch (err) {
      console.error("Error reporting item:", err);
      alert("An error occurred while reporting the item. Please try again.");
    }
  };

  const getCurrentImageUrl = () => {
    if (
      product.imageUrl &&
      Array.isArray(product.imageUrl) &&
      product.imageUrl.length > 0
    ) {
      return product.imageUrl[currentImageIndex];
    }
    return product.imageUrl || "";
  };

  const nextImage = () => {
    if (
      product.imageUrl &&
      Array.isArray(product.imageUrl) &&
      product.imageUrl.length > 1
    ) {
      setCurrentImageIndex((prev) =>
        prev === product.imageUrl.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (
      product.imageUrl &&
      Array.isArray(product.imageUrl) &&
      product.imageUrl.length > 1
    ) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.imageUrl.length - 1 : prev - 1
      );
    }
  };

  if (error) {
    return (
      <section className="min-h-screen bg-[#FFF4DC] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar />
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-lg">
          <div className="relative mb-6">
            <img
              src={getCurrentImageUrl()}
              alt={product.title}
              className="w-full h-96 object-contain rounded-lg"
            />

            {product.imageUrl &&
              Array.isArray(product.imageUrl) &&
              product.imageUrl.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    &#8250;
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.imageUrl.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition
                        ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
          </div>

          {product.imageUrl &&
            Array.isArray(product.imageUrl) &&
            product.imageUrl.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {product.imageUrl.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer transition
                    ${
                      index === currentImageIndex
                        ? "border-2 border-[#F47C26]"
                        : "border border-gray-300 hover:border-[#F47C26]"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}

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
            <h4 className="text-xl font-semibold text-[#F47C26] mb-4">
              Description
            </h4>
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
            {product.userId == userId ? (
              <>

                {isAvailable && <button
                  className="w-full mt-4 block text-center bg-[#F47C26] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                  onClick={senderClick}
                >
                  See Interested Buyers
                </button>}

                

                {isAvailable ? (
                  <button
                    className="w-full mt-4 block text-center bg-[#f71616] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                    onClick={soldClick}
                  >
                    Mark as Sold
                  </button>
                ) : (
                  <button
                    className="w-full mt-4 block text-center bg-[#db5656] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                    onClick={() =>{alert("this product is sold")}}
                  >
                    Sold
                  </button>
                )}

                {isAvailable && <Link
                  to={`/update-item/${id}`}
                  className="w-full mt-4 block text-center bg-[#F47C26] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Update Item
                </Link>}
                
              </>
            ) : (
              <>
                <button
                  onClick={buyerClick}
                  className="w-full bg-[#F47C26] text-white py-2 rounded-lg font-semibant hover:bg-orange-600 transition"
                >
                  Chat with Seller
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Report Item
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-[#F47C26] mb-4">
              Report Item
            </h3>
            <p className="text-[#333333] mb-4">
              Please provide a reason for reporting this item:
            </p>
            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-[#F47C26]"
              placeholder="Describe why you're reporting this item..."
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F47C26]"
              >
                <option value="other">Other</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="fraud">Fraudulent Activity</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportMessage("");
                  setReportType("other");
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportItem}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Item;
