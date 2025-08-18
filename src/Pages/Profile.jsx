import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import follow from "../assets/follow.svg";
import Heart from "../assets/Heart.svg";
import redHeart from "../assets/redHeart.svg";
import camera from "../assets/camera.svg";

const Profile = () => {

  const [user, setUser] = useState({})
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () =>{
      const token = localStorage.getItem("accessToken");

      try {
        const res = await fetch("/api/profile/get-profile",{
          method: "GET",
          headers:{
            Authorization: `Bearer ${token}`
          },
        })

        const resData = await res.json();
        console.log(resData)
        if(resData.success){
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

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      // Get user ID from localStorage instead of user state (which might not be loaded yet)
      const userId = localStorage.getItem("userId") || user.id || user.userId;
      
      if (!userId) {
        alert("User ID not found. Please login again.");
        setUploading(false);
        return;
      }

      const response = await fetch(`/api/profile/update-profile-picture/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update user state with new profile picture
          setUser(prevUser => ({
            ...prevUser,
            profile: {
              ...prevUser.profile,
              profilePicUrl: result.profilePictureUrl || result.data?.profilePicUrl || result.profilePicUrl
            }
          }));
          console.log("Profile picture uploaded successfully");
        }
      } else {
        console.log("Profile picture upload failed:", response.status);
        alert("Failed to upload profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const parseImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn("imageUrl is null or undefined");
      return [];
    }

    const urlString = Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : imageUrl;

    if (typeof urlString === "string") {
      // Check if it's already a valid URL (starts with http/https)
      if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
        return [urlString];
      }
      console.log("Treating as single URL:", urlString);
      return [urlString];
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

  const getProfilePictureUrl = () => {
    // Fix: Use profilePicUrl instead of profilePicture based on the console logs
    const profilePic = user?.profile?.profilePicUrl || user?.profile?.profilePicture;
    if (profilePic) {
      // Handle different formats of profile picture URLs
      if (typeof profilePic === 'string') {
        return profilePic;
      }
      if (Array.isArray(profilePic) && profilePic.length > 0) {
        return profilePic[0];
      }
    }
    return null;
  };
    
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
            <div className="relative justify-items-center mr-12 ml-16 bg-[#D9D9D9] h-60 w-60 border border-solid border-black rounded-full overflow-hidden">
              {getProfilePictureUrl() ? (
                <img 
                  src={getProfilePictureUrl()} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center p-20 ${getProfilePictureUrl() ? 'hidden' : 'flex'}`}>
                <img src={camera} alt="Upload profile picture" className="h-16" />
              </div>
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="text-white text-center">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <>
                      <img src={camera} alt="Upload" className="h-8 w-8 mx-auto mb-2 filter invert" />
                      <p className="text-sm">Change Photo</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="font-bold mt-8 text-xl">@{user?.profile?.userName}</p>
          </div>

          <section className="grid grid-cols-2 gap-10 p-5">
            {user?.items?.length > 0 ? (
              user.items.map((product) => (
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
              <p className="text-center text-[#333333] text-xl">No Items to show...</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;

