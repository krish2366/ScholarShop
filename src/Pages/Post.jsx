import { useState } from "react";
import { useNavigate } from "react-router-dom";
import camera from "../assets/camera.svg";
import Navbar from "../Components/Navbar.jsx";

const Post = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Frontend validation limits based on itemModel
  const LIMITS = {
    TITLE_MAX: 255, // Default STRING length in Sequelize
    DESCRIPTION_MAX: 255, // From your model
    PRICE_MAX: 999999.99,
    IMAGE_SIZE_MAX: 8 * 1024 * 1024, // 8MB
    MAX_IMAGES: 4
  };

  const categories = ['Electronics', 'Books', 'PYQs', 'Instruments', 'Essentials', 'OTHERS'];


  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = LIMITS.IMAGE_SIZE_MAX;
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`These files exceed 8MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    if (files.length + photos.length > LIMITS.MAX_IMAGES) {
      setError(`You can upload up to ${LIMITS.MAX_IMAGES} photos only.`);
      return;
    }

    setPhotos((prev) => [...prev, ...files]);
    setError("");
  };

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    setError("");
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Frontend validation
    if (title.length === 0 || title.length > LIMITS.TITLE_MAX) {
      setError(`Title must be between 1 and ${LIMITS.TITLE_MAX} characters.`);
      setIsSubmitting(false);
      return;
    }

    if (description.length === 0 || description.length > LIMITS.DESCRIPTION_MAX) {
      setError(`Description must be between 1 and ${LIMITS.DESCRIPTION_MAX} characters.`);
      setIsSubmitting(false);
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > LIMITS.PRICE_MAX) {
      setError(`Price must be between ₹0.01 and ₹${LIMITS.PRICE_MAX.toLocaleString()}`);
      setIsSubmitting(false);
      return;
    }

    if (!category || !categories.includes(category)) {
      setError("Please select a valid category.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please log in to add an item.");
      setIsSubmitting(false);
      return;
    }

    if (photos.length === 0) {
      setError("Please upload at least one photo.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", priceNum);
    formData.append("category", category);

    photos.forEach((photo) => {
      formData.append("images", photo);
    });

    try {
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
      };

      const res = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/item/add-item`, {
        method: "POST",
        headers,
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON, but received: ${text.slice(0, 100)}...`);
      }

      const resData = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        setError(resData.message || "Failed to add item.");
      }
    } catch (err) {
      console.error("Add item error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">Upload Photos</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <img src={camera} alt="Camera" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Upload Photos
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  Upload up to {LIMITS.MAX_IMAGES} photos (max 8MB each)
                </p>
              </div>

              {/* Display selected photos with remove option */}
              {photos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Photos ({photos.length}/{LIMITS.MAX_IMAGES}):</p>
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="text-sm font-medium truncate block">{photo.name}</span>
                        <span className="text-xs text-gray-500">
                          {(photo.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="ml-3 text-red-500 hover:text-red-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearAllPhotos}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all photos
                  </button>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">Add New Item</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Item Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={LIMITS.TITLE_MAX}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {title.length}/{LIMITS.TITLE_MAX} characters
                  </p>
                </div>

                <div>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                    maxLength={LIMITS.DESCRIPTION_MAX}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/{LIMITS.DESCRIPTION_MAX} characters
                  </p>
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0.01"
                    max={LIMITS.PRICE_MAX}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: ₹{LIMITS.PRICE_MAX.toLocaleString()}
                  </p>
                </div>

                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Adding Item..." : "Add Item"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
