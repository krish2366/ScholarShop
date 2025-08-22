import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import { Upload } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token.slice(20));
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MAIN_BACKEND_URL}/profile/get-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resData = await res.json();
        console.log(resData);
        if (resData.success) {
          console.log(resData.data);
          setUser(resData.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

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
    formData.append("profilePicture", file);

    try {
      // Get user ID from localStorage instead of user state (which might not be loaded yet)
      const userId = localStorage.getItem("userId") || user.id || user.userId;

      if (!userId) {
        alert("User ID not found. Please login again.");
        setUploading(false);
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BACKEND_URL
        }/profile/update-profile-picture/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update user state with new profile picture
          setUser((prevUser) => ({
            ...prevUser,
            profile: {
              ...prevUser.profile,
              profilePicUrl:
                result.profilePictureUrl ||
                result.data?.profilePicUrl ||
                result.profilePicUrl,
            },
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

    const urlString =
      Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : imageUrl;

    if (typeof urlString === "string") {
      // Check if it's already a valid URL (starts with http/https)
      if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
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
    const profilePic =
      user?.profile?.profilePicUrl || user?.profile?.profilePicture;
    if (profilePic) {
      // Handle different formats of profile picture URLs
      if (typeof profilePic === "string") {
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
      <div className="min-h-screen bg-[#FFF4DC]">
        <div className="max-w-7xl mx-auto ml-0 pl-10 px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-14">
            {/* Left Side - Profile Info */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-8 sticky top-8">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  {getProfilePictureUrl() ? (
                    <img
                      src={getProfilePictureUrl()}
                      alt="Profile"
                      className="w-32 h-32 rounded-full mx-auto shadow-lg object-cover border-4 border-white"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-white bg-[#e98d4b] flex items-center justify-center text-white text-3xl font-bold">
                      {user?.profile?.userName
                        ? user.profile.userName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="text-center mb-6">
                  <h1
                    className="text-2xl font-bold mb-4"
                    style={{ color: "#333333" }}
                  >
                    @{user?.profile?.userName}
                  </h1>

                  <div className="relative">
                    <button className="w-full bg-[#F47C26] py-3 px-6 rounded-lg font-medium transition-colors text-white hover:bg-[#ea580c] relative overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="inline mr-2" size={18} />
                          Upload New
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Uploads */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#333333" }}
                >
                  My Uploads
                </h2>
                <p style={{ color: "#333333" }} className="opacity-70">
                  {user?.items?.length} items
                </p>
              </div>

              {/* Uploads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.items?.length > 0 ? (
                  user.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={getFirstImageUrl(item.imageUrl)}
                          alt={item.title}
                          onError={(e) => {
                            console.error(
                              "Image load failed for:",
                              product.title,
                              getFirstImageUrl(product.imageUrl)
                            );
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                          }}
                          className="w-full h-48 object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <h3
                          className="font-semibold mb-3"
                          style={{ color: "#333333" }}
                        >
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between">
                          <Link
                            to={`/item/${item.id}`}
                            className="px-4 py-2 rounded-lg bg-[#F47C26] text-sm font-medium transition-colors text-white hover:bg-[#ea580c]"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#333333] text-xl">
                    No Items to show...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
