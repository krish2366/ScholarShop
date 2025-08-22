import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import { Upload, Calendar, User, BookOpen, LogOut } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MAIN_BACKEND_URL}/profile/get-profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resData = await res.json();
        if (resData.success) setUser(resData.data);
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

  const triggerFileInput = () => {
    document.getElementById("profile-upload-main").click();
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const userId = localStorage.getItem("userId") || user.id || user.userId;
      if (!userId) {
        alert("User ID not found. Please login again.");
        setUploading(false);
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BACKEND_URL}/profile/update-profile-picture/${userId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
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
        }
      } else {
        alert("Failed to upload profile picture. Please try again.");
      }
    } catch {
      alert("An error occurred while uploading the profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Helpers for image URLs
  const parseImageUrl = (imageUrl) => {
    if (!imageUrl) return [];
    const urlString =
      Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : imageUrl;
    if (typeof urlString === "string") return [urlString];
    if (Array.isArray(urlString)) return urlString;
    return [urlString];
  };
  const getFirstImageUrl = (imageUrl) => {
    const parsedUrls = parseImageUrl(imageUrl);
    return parsedUrls.length > 0 ? parsedUrls[0] : "";
  };
  const getProfilePictureUrl = () => {
    const profilePic =
      user?.profile?.profilePicUrl || user?.profile?.profilePicture;
    if (profilePic) {
      if (typeof profilePic === "string") return profilePic;
      if (Array.isArray(profilePic) && profilePic.length > 0)
        return profilePic[0];
    }
    return null;
  };

  return (
    <>
      <Navbar />
      {/* Container */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-4 px-2 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 lg:gap-10">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-white/20 h-fit lg:sticky lg:top-8">
              {/* Profile Picture */}
              <div className="text-center mb-4">
                <div className="relative group inline-block">
                  {getProfilePictureUrl() ? (
                    <img
                      src={getProfilePictureUrl()}
                      alt="Profile"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-4 border-orange-400 cursor-pointer"
                      onClick={triggerFileInput}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto bg-orange-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-orange-400 cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {user?.profile?.userName
                        ? user.profile.userName.charAt(0).toUpperCase()
                        : user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <Upload size={20} className="text-white" />
                  </div>
                </div>
              </div>
              {/* User Info */}
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  @{user?.profile?.userName || user?.username || "Aryan"}
                </h2>
                {/* Stats */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4">
                  <span className="flex items-center justify-center gap-1 text-gray-600 text-sm">
                    <BookOpen size={16} />
                    {user?.items?.length || 0} uploads
                  </span>
                  <span className="flex items-center justify-center gap-1 text-gray-600 text-sm">
                    <Calendar size={16} />
                    Joined {new Date().getFullYear()}
                  </span>
                </div>
                {/* Upload Button */}
                <button
                  className="w-full bg-orange-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mb-3"
                  disabled={uploading}
                  onClick={triggerFileInput}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload New
                    </>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full mt-1 bg-orange-100 text-orange-500 font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-200 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>

                <input
                  id="profile-upload-main"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                {/* Email */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="flex items-center justify-center gap-2 text-gray-600 text-sm break-words">
                    <User size={16} />
                    {user?.email || user?.profile?.email || "Loading..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Uploads Section */}
            <div className="min-h-[400px]">
              <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-white/20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b-2 border-orange-400">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">My Uploads</h3>
                  <span className="bg-orange-100 text-gray-600 text-sm px-3 py-1 rounded-full self-start sm:self-center">
                    {user?.items?.length || 0} items
                  </span>
                </div>
                {/* Uploads Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user?.items && user.items.length > 0 ? (
                    user.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="h-40 sm:h-48 overflow-hidden">
                          <img
                            src={getFirstImageUrl(item.imageUrl)}
                            alt={item.title || `Item ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzlhYTJhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 text-base">
                            {item.title || `Item ${index + 1}`}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.description || "No description available"}
                          </p>
                          <Link
                            to={`/item/${item.id || index}`}
                            className="block w-full bg-orange-400 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <BookOpen size={48} className="mx-auto mb-4 text-orange-400 opacity-50" />
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">No uploads yet</h4>
                      <p className="text-gray-500">Share your first item to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}