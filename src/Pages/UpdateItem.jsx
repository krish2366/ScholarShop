import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import camera from "../assets/camera.svg";

function UpdateItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Frontend validation limits based on itemModel
  const LIMITS = {
    TITLE_MAX: 255, // Default STRING length in Sequelize
    DESCRIPTION_MAX: 255, // From your model
    IMAGE_SIZE_MAX: 8 * 1024 * 1024, // 8MB
    MAX_IMAGES: 4
  };

  const categories = ['Electronics', 'Books', 'PYQs', 'Instruments', 'Essentials', 'OTHERS'];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please log in to edit this item.");
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/item/get-item-details/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const item = data.data;
          setTitle(item.title);
          setDescription(item.description);
          setPrice(item.price);
          setCategory(item.category);
          
          // Handle existing photos properly
          if (Array.isArray(item.imageUrl)) {
            setExistingPhotos(item.imageUrl);
          } else {
            setExistingPhotos([item.imageUrl]);
          }
          
          const loggedInUserId = localStorage.getItem("userId");
          setIsOwner(item.userId === parseInt(loggedInUserId));
        } else {
          setError(data.message || "Item not found.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Something went wrong. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [itemId]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = LIMITS.IMAGE_SIZE_MAX;
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`These files exceed 8MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    if (files.length + photos.length + existingPhotos.length > LIMITS.MAX_IMAGES) {
      setError(`You can upload up to ${LIMITS.MAX_IMAGES} photos total.`);
      return;
    }

    setPhotos((prev) => [...prev, ...files]);
    setError("");
  };

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    setError("");
  };

  const removeExistingPhoto = (indexToRemove) => {
    setExistingPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    setError("");
  };

  const clearAllNewPhotos = () => {
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
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price greater than ₹0.");
      setIsSubmitting(false);
      return;
    }

    if (!category || !categories.includes(category)) {
      setError("Please select a valid category.");
      setIsSubmitting(false);
      return;
    }

    // Check if at least one photo exists (existing or new)
    if (existingPhotos.length === 0 && photos.length === 0) {
      setError("Please keep at least one photo.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please log in to update this item.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", priceNum);
    formData.append("category", category);
    
    // Send the remaining existing photos (the ones user wants to keep)
    formData.append("keepExistingImages", JSON.stringify(existingPhotos));

    // Add new photos
    photos.forEach((photo) => {
      formData.append("images", photo);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/item/update-item/${itemId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await res.json();

      if (res.ok) {
        navigate(`/item/${itemId}`);
      } else {
        setError(resData.message || "Failed to update item.");
      }
    } catch (err) {
      console.error("Update item error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading item details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isOwner) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">You don't have permission to edit this item.</p>
          </div>
        </div>
      </>
    );
  }

  const totalPhotos = existingPhotos.length + photos.length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">Update Photos</h2>
              
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
                  Upload Additional Photos
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  Total: {totalPhotos}/{LIMITS.MAX_IMAGES} photos (max 8MB each)
                </p>
              </div>

              {/* Display existing photos */}
              {existingPhotos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-blue-700">Current Photos ({existingPhotos.length}):</p>
                  {existingPhotos.map((photo, index) => (
                    <div key={`existing-${index}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex-1">
                        <span className="text-sm font-medium">Existing photo {index + 1}</span>
                        <span className="text-xs text-blue-600 block">Currently saved</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="ml-3 text-red-500 hover:text-red-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                        title="Remove existing photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Display newly selected photos */}
              {photos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-green-700">New Photos ({photos.length}):</p>
                  {photos.map((photo, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <span className="text-sm font-medium truncate block">{photo.name}</span>
                        <span className="text-xs text-green-600">
                          {(photo.size / 1024 / 1024).toFixed(2)} MB - Will be uploaded
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="ml-3 text-red-500 hover:text-red-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                        title="Remove new photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearAllNewPhotos}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all new photos
                  </button>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">Update Item Details</h2>
              
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter price in ₹ (minimum ₹0.01)
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
                  {isSubmitting ? "Updating Item..." : "Update Item"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateItem;
