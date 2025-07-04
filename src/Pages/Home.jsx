import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import essentials from "../assets/essentials.webp";
import Instruments from "../assets/instrument.jpg";
import herosection from "../assets/herosection.jpg";
import Footer from "../Components/Footer";
import { ArrowRight, ShoppingBag, Users, Shield, Star } from 'lucide-react';

const Home = () => {

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    fetch("http://localhost:5000/item/get-all-items")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data.slice(0,8));
          setLoading(false);
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

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

  const categories = [
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    },
    {
      name: "PYQs",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop",
    },
    {
      name: "Instruments",
      image: Instruments,
    },
    {
      name: "Essentials",
      image: essentials,
    }
  ];

  const stats = [
    { icon: Users, label: "Active Students", value: "2,500+" },
    { icon: ShoppingBag, label: "Items Sold", value: "15,000+" },
    { icon: Shield, label: "Safe Transactions", value: "100%" },
    { icon: Star, label: "Average Rating", value: "4.8/5" }
  ];

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#FFF4DC]">

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between  transform hover:scale-[1.02] transition-transform duration-300">

            <div className="w-full lg:w-3/5 bg-white p-8 lg:p-12 rounded-2xl lg:rounded-r-none shadow-2xl ">

              <div className="text-center space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F47C26] leading-tight">
                  Turn your stuff into
                  <span className="block text-[#333333]">savings!</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto">
                  Find the greatest deals in one place. Connect with fellow students and trade safely.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <a
                    href="#products"
                    className="group bg-[#F47C26] text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Deal Now!
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  {isLoggedIn && (
                    <Link to="/post" className="bg-white text-[#F47C26] border-2 border-[#F47C26] px-8 py-4 rounded-full font-semibold hover:bg-[#F47C26] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Add Item
                    </Link>
                  )}

                </div>

              </div>
            </div>

            <div className="w-full lg:w-2/5 lg:h-[23rem]">
              <img src={herosection} className="bg-gray-200 w-full h-full rounded-xl rounded-s-none" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333] mb-4">
              Popular Categories
            </h2>
            <div className="w-20 h-1 bg-[#F47C26] mx-auto rounded-full"></div>
          </div>
          
          <div id="products" className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                to={`/category/${category.name}`}
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-40 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  
                </div>
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#333333] group-hover:text-[#F47C26] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#333333] mb-2">
                  Featured Products
                </h3>
                <p className="text-gray-600">Handpicked deals from your campus community</p>
              </div>
              <Link to="/category/Electronics" className="hidden sm:flex items-center gap-2 text-[#F47C26] font-semibold hover:gap-4 transition-all group">
                View All
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-2xl"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        src={getFirstImageUrl(product.imageUrl)}
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-[#F47C26] text-white px-2 py-1 rounded-full text-xs font-semibold">
                          New
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h5 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#F47C26] transition-colors">
                        {product.title}
                      </h5>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#F47C26]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <Link to={`/item/${product.id}`} className="bg-[#F47C26] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 group-hover:shadow-lg">
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </section>
      <Footer />
    </>
  );
};

export default Home;