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
  const [photos, setPhotos] = useState([]); // State variable name remains 'photos'
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 4) {
      setError("You can upload up to 4 photos only.");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("accessToken");
    console.log("Retrieved token:", token);
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
    formData.append("price", parseFloat(price));
    formData.append("category", category);
    photos.forEach((photo, index) => {
      console.log(`Appending image ${index}:`, photo.name, photo.type, photo.size);
      formData.append("images", photo); // Changed field name to "images"
    });

    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
      };
      console.log("Request headers:", headers);

      const res = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/item/add-item`, {
        method: "POST",
        headers,
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Expected JSON, but received: ${text.slice(0, 100)}...`);
      }

      const resData = await res.json();
      console.log("Add item response:", resData);

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
    <div className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row justify-center gap-10">
        {/* Photo Upload Section */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-[#F47C26] mb-6">Upload Photos</h2>
          <div className="border-2 border-dashed border-[#333333] rounded-lg p-10 flex flex-col items-center">
            <img src={camera} alt="camera" className="h-20 w-20 mb-4" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="bg-[#F47C26] text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition cursor-pointer"
            >
              Upload Photos
            </label>
            <p className="text-[#333333] mt-2">Upload up to 4 photos</p>
            {photos.length > 0 && (
              <ul className="mt-4 text-[#333333]">
                {photos.map((photo, index) => (
                  <li key={index}>{photo.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#F47C26] text-center mb-6">
            Add New Item
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              type="text"
              placeholder="Item Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold placeholder-gray-500"
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              required
            />
            <select
              className="w-full px-4 py-2 border rounded-lg mb-4 font-bold text-gray-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Instruments">Instruments</option>
              <option value="Essentials">Essentials</option>
              <option value="PYQs">PYQs</option>
              <option value="OTHERS">OTHERS</option>
            </select>
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#F47C26] text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;