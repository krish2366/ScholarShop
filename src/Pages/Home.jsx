import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import essentials from "../assets/essentials.webp";
import pyqs from "../assets/pyqs.webp";
import Instruments from "../assets/instrument.jpg";
import books from "../assets/books.jpg";
import herosection from "../assets/herosection.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  const parseImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn("imageUrl is null or undefined");
      return [];
    }

    const urlString = Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : imageUrl;

    if (typeof urlString === "string") {
      try {
        let cleanedUrlString = urlString
          .replace(/^"\s*{/, "[") 
          .replace(/}\s*"$/, "]") 
          .replace(/\\"/g, '"') 
          .trim();

        const parsed = JSON.parse(cleanedUrlString);
        console.log("Parsed URLs:", parsed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.warn("JSON parse failed for:", urlString, e.message);
        const urlMatches = urlString.match(/https?:\/\/[^\s"',\]]+/g);
        if (urlMatches && urlMatches.length > 0) {
          console.log("Extracted URLs with regex:", urlMatches);
          return urlMatches;
        }
        console.log("Treating as single URL:", urlString);
        return [urlString];
      }
    }

    if (Array.isArray(urlString)) {
      console.log("imageUrl is already an array:", urlString);
      return urlString;
    }

    console.warn("imageUrl is not a string or array:", urlString);
    return [urlString]; 
  };

  const getFirstImageUrl = (imageUrl) => {
    const parsedUrls = parseImageUrl(imageUrl);
    const firstUrl = parsedUrls.length > 0 ? parsedUrls[0] : "";
    console.log("First image URL:", firstUrl);
    return firstUrl;
  };

  useEffect(() => {
    fetch("http://localhost:5000/item/get-all-items")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#FFF4DC] flex flex-col">
        {/* Hero Section */}
        <div className="container mx-auto px-10 py-24 pb-10 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-3/5  bg-white p-10 rounded-xl rounded-e-none shadow-lg">
            <h1 className="text-4xl font-semibold text-[#F47C26] text-center mb-6">
              Turn your stuff into savings!
            </h1>
            <h2 className="text-3xl font-light text-[#333333] text-center mb-8">
              Find the greatest deals in one place.
            </h2>
            <div className="flex justify-center gap-4">
              <a
                href="#products"
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
            <img src={herosection} className="bg-gray-200 w-full h-64 rounded-xl rounded-s-none shadow-lg" />
          </div>
        </div>

        {/* Categories */}
        <div className="container mx-auto px-6 py-10">
          <h1
            className="text-4xl font-medium text-[#333333] text-center mb-10"
          >
            Popular Categories
          </h1>
          <div id="products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Link to="/category/Books" className="p-4">
              <img src={books} className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none" />
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Books
              </h1>
            </Link>
            <Link to="/category/PYQs" className="p-4">
              <img src={pyqs} className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none" />
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                PYQs
              </h1>
            </Link>
            <Link to="/category/Instruments" className="p-4">
              <img src={Instruments} className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none" />
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Instruments
              </h1>
            </Link>
            <Link to="/category/Essentials" className="p-4">
              <img src={essentials} className="w-[100%] h-56 bg-[#D9D9D9] rounded-xl rounded-b-none" />
              <h1 className="text-center text-[1.5rem] font-semibold my-3">
                Essentials
              </h1>
            </Link>
          </div>
        </div>

        {/* Products */}
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
                    src={getFirstImageUrl(product.imageUrl)}
                    alt={product.title}
                    onError={(e) => {
                      console.error("Image load failed for:", product.title, getFirstImageUrl(product.imageUrl));
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-[#333333]">
                      {product.title}
                    </h5>
                    <p className="text-[#333333] mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-[#333333] mt-2 font-semibold">
                      ₹{product.price}
                    </p>
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