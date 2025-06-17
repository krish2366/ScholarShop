import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import user from "../assets/user.svg";

function InterestedBuyers() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [item, setItem] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch item details
        const itemResponse = await fetch(`http://localhost:5000/item/get-item-details/${itemId}`);
        const itemData = await itemResponse.json();
        
        if (itemData.success) {
          setItem(itemData.data);
        }

        // Fetch interested buyers
        const buyersResponse = await fetch(`http://localhost:5000/chat/${itemId}/buyers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!buyersResponse.ok) {
          throw new Error('Failed to fetch buyers');
        }

        const buyersData = await buyersResponse.json();
        setBuyers(buyersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  const handleBuyerClick = (buyerId) => {
    // Navigate to the specific chat room with the format itemId-buyerId
    navigate(`/chat/${itemId}/${buyerId}`);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#FFF4DC] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-xl">Loading interested buyers...</p>
        </div>
      </section>
    );
  }

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
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F47C26] mb-4">
            Interested Buyers for item
          </h1>
          <button
            onClick={() => navigate(`/item/${itemId}`)}
            className="text-[#F47C26] hover:underline"
          >
            ← Back to Item
          </button>
        </div>

        {buyers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">No interested buyers yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {buyers.map((buyer, index) => (
              <div
                key={buyer.userId}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleBuyerClick(buyer.userId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#FFF4DC] flex items-center justify-center">
                      <img src={user} alt="user" className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#333333]">
                        Buyer {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600">
                        User ID: {buyer.userId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="bg-[#F47C26] text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default InterestedBuyers;