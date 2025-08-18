import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please log in to edit this item.");
      setIsLoading(false);
      return;
    }

    fetch(`/api/item/get-item-details/${itemId}`, {
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
          setExistingPhotos([item.imageUrl]); 
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
    if (files.length + photos.length + existingPhotos.length > 4) {
      setError("You can upload up to 4 photos total.");
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
    if (!token) {
      setError("Please log in to update this item.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    formData.append("category", category);
    photos.forEach((photo) => formData.append("images", photo)); // Changed from "photos" to "images"

    try {
      const res = await fetch(`/api/item/update-item/${itemId}`, {
        method: "PUT", 
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await res.json();
      if (res.ok) {
        navigate(`/item/${itemId}`); // Redirect to item details on success
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

  if (isLoading) return <div className="text-center py-20 text-[#333333]">Loading...</div>;
  if (!isOwner) return <div className="text-center py-20 text-[#333333]">You are not authorized to edit this item.</div>;

  return (
    <div className="min-h-screen bg-[#FFF4DC] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row justify-center gap-10">
        {/* Photo Upload Section */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-[#F47C26] mb-6">Update Photos</h2>
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
              Upload New Photos
            </label>
            <p className="text-[#333333] mt-2">Upload up to 4 photos total</p>
            {existingPhotos.length > 0 && (
              <div className="mt-4">
                <p className="text-[#333333]">Current Photo:</p>
                <img src={existingPhotos[0]} alt="Current" className="h-20 w-20 object-cover mt-2" />
              </div>
            )}
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
            Update Item
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
              <option value="Notes">Notes</option>
              <option value="Drafter">Drafter</option>
              <option value="Essentials">Essentials</option>
              <option value="PYQs">PYQs</option>
            </select>
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#F47C26] text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateItem;