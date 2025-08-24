import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function AvailableBuyers() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const { itemId } = useParams();
    
    const [socket, setSocket] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [roomName, setRoomName] = useState({});
    const [loading, setLoading] = useState(true);
    const [recentChats, setRecentChats] = useState([]);
    const [debugInfo, setDebugInfo] = useState({});

    // Enhanced logging function
    const logDebug = (step, data) => {
        const timestamp = new Date().toISOString();
        // console.log(`[${timestamp}] ${step}:`, data);
        setDebugInfo(prev => ({
            ...prev,
            [step]: { timestamp, data }
        }));
    };

    useEffect(() => {
        logDebug("Component Mount", { itemId, userId });
        
        // Reset state on new itemId
        setRecentChats([]);
        setAvailableRooms([]);
        setRoomName({});
        setLoading(true);
        
        // Fetch recent chats first
        fetchRecentChatsHTTP();
    }, [itemId]); // Only depend on itemId

    const fetchRecentChatsHTTP = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = `${import.meta.env.VITE_MAIN_BACKEND_URL}/chat/item-chats/${itemId}`;

            logDebug("Fetch Request Start", { 
                itemId, 
                hasToken: !!token,
                url: url
            });
            
            if (!token) {
                logDebug("No Token Error", "Access token not found");
                setLoading(false);
                return;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            logDebug("Response Status", { 
                status: response.status, 
                ok: response.ok,
                statusText: response.statusText 
            });
            
            if (response.ok) {
                const chats = await response.json();
                logDebug("Raw Chats Data", chats);
                
                if (!Array.isArray(chats)) {
                    logDebug("Invalid Data Format", "Chats is not an array");
                    setLoading(false);
                    return;
                }
                
                setRecentChats(chats);
                
                const currentUserId = parseInt(userId);
                logDebug("Processing Chats", { 
                    currentUserId, 
                    totalChats: chats.length,
                });
                
                const uniqueUserIds = [...new Set(
                    chats.flatMap(chat => [chat.userId, chat.recieverId])
                         .filter(id => id !== currentUserId)
                )];
                
                logDebug("Unique User IDs", uniqueUserIds);
                
                const rooms = uniqueUserIds.map(chatUserId => `${itemId}-${chatUserId}`);
                logDebug("Generated Rooms", rooms);
                
                setAvailableRooms(rooms);
            } else {
                const errorText = await response.text();
                logDebug("HTTP Error", { 
                    status: response.status, 
                    statusText: response.statusText,
                    errorText 
                });
                setLoading(false);
            }
        } catch (error) {
            logDebug("Fetch Error", { 
                message: error.message, 
                stack: error.stack 
            });
            setLoading(false);
        }
    };
    
    const setupSocketConnection = () => {
        // This function can remain if you have real-time updates on this page
    };

    const handleClick = (e, room) => {
        e.preventDefault();
        const buyerId = room.split("-")[1];
        logDebug("Navigate to Chat", { room, buyerId, itemId });
        
        navigate(`/chat/${itemId}/${buyerId}`);
    };

    useEffect(() => {
        logDebug("User Names Effect", { availableRoomsLength: availableRooms.length });
        
        if (availableRooms.length === 0) {
            setRoomName({});
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            const names = {};
            const token = localStorage.getItem("accessToken");
            
            for (const room of availableRooms) {
                const buyerId = room.split("-")[1];
                logDebug(`Fetch User ${buyerId}`, { room });
                
                try {
                    const response = await fetch(
                        `${import.meta.env.VITE_MAIN_BACKEND_URL}/auth/user/${buyerId}`, 
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    if (response.ok) {
                        const userData = await response.json();
                        const userName = userData.data?.userName || `User ${buyerId}`;
                        logDebug(`User Data for ${buyerId}`, { userName });
                        names[room] = userName;
                    } else {
                        logDebug(`User ${buyerId} not found`, response.status);
                        names[room] = `User ${buyerId}`;
                    }
                } catch (error) {
                    logDebug(`User Fetch Exception ${buyerId}`, error);
                    names[room] = `User ${buyerId}`;
                }
            }
            
            logDebug("Final Room Names", names);
            setRoomName(names);
            setLoading(false);
        };
        
        fetchUsers();
    }, [availableRooms]);
    
    if (loading) {
        return (
            <div>
                <Navbar />
                <section className="bg-[#FFF4DC] py-10 min-h-screen">
                    <div className="bg-white mx-14 px-5 pt-5 pb-10 rounded-xl shadow-lg">
                        <h1 className="text-2xl font-semibold text-center">Loading Available Buyers...</h1>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <section className="bg-[#FFF4DC] py-10 min-h-screen">
                <div className="bg-white mx-14 px-5 pt-5 pb-10 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-6">Available Buyers</h1>
                    
                    {availableRooms.length === 0 ? (
                        <div className="text-center py-10">
                            <h2 className="text-lg text-gray-600">No buyers have contacted you yet</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Buyers will appear here once they start chatting about your item
                            </p>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-5 p-5 flex-wrap">
                            {availableRooms.map((room, index) => {
                                const buyerId = room.split("-")[1];
                                const userName = roomName[room] || "Loading...";
                                
                                return (
                                    <button 
                                        key={index}
                                        className="bg-[#D9D9D9] hover:bg-[#c9c9c9] min-w-40 h-32 rounded-xl transition-colors duration-200 px-4"
                                        onClick={(e) => handleClick(e, room)}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">{userName}</div>
                                            <div className="text-xs text-gray-600">ID: {buyerId}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate(`/item/${itemId}`)}
                            className="bg-[#F47C26] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors mb-2 md:mr-4"
                        >
                            Back to Item
                        </button>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AvailableBuyers;