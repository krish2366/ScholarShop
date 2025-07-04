import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
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
        console.log(`[${timestamp}] ${step}:`, data);
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
            logDebug("Fetch Request Start", { 
                itemId, 
                hasToken: !!token,
                url: `http://localhost:5000/chat/recent/${itemId}`
            });
            
            if (!token) {
                logDebug("No Token Error", "Access token not found");
                setLoading(false);
                return;
            }
            
            const response = await fetch(`http://localhost:5000/chat/recent/${itemId}`, {
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
                
                // Validate the chats data structure
                if (!Array.isArray(chats)) {
                    logDebug("Invalid Data Format", "Chats is not an array");
                    setLoading(false);
                    return;
                }
                
                setRecentChats(chats);
                
                // Process chats to get unique buyers (excluding current user)
                const currentUserId = parseInt(userId);
                logDebug("Processing Chats", { 
                    currentUserId, 
                    totalChats: chats.length,
                    chatsData: chats.map(c => ({ 
                        id: c.id, 
                        userId: c.userId, 
                        message: c.message?.substring(0, 20) + '...' 
                    }))
                });
                
                // Get unique user IDs who have chatted (excluding current user)
                const uniqueUserIds = [...new Set(
                    chats
                        .filter(chat => {
                            const chatUserId = parseInt(chat.userId);
                            const isNotCurrentUser = chatUserId !== currentUserId;
                            logDebug(`Filter Chat ${chat.id}`, { 
                                chatUserId, 
                                currentUserId, 
                                isNotCurrentUser 
                            });
                            return isNotCurrentUser;
                        })
                        .map(chat => parseInt(chat.userId))
                )];
                
                logDebug("Unique User IDs", uniqueUserIds);
                
                // Convert to room format
                const rooms = uniqueUserIds.map(chatUserId => `${itemId}-${chatUserId}`);
                logDebug("Generated Rooms", rooms);
                
                setAvailableRooms(rooms);
                
                // Also setup socket connection after HTTP fetch
                setupSocketConnection();
                
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
                name: error.name,
                stack: error.stack 
            });
            setLoading(false);
        }
    };

    const setupSocketConnection = () => {
        try {
            const token = localStorage.getItem("accessToken");
            logDebug("Socket Setup Start", { hasToken: !!token });
            
            const newSocket = io("http://localhost:4001", {
                auth: { token }
            });
            
            newSocket.on("connect", () => {
                logDebug("Socket Connected", newSocket.id);
                setSocket(newSocket);
                fetchBuyers(newSocket);
            });

            newSocket.on("connect_error", (error) => {
                logDebug("Socket Connect Error", error);
                setLoading(false);
            });

            newSocket.on("error-message", (err) => {
                logDebug("Socket Error Message", err);
                setLoading(false);
            });

            newSocket.on("rooms-list", ({ rooms }) => {
                logDebug("Socket Rooms List", rooms);
                
                // Filter rooms for this item
                const validRooms = rooms.filter(room => {
                    const parts = room.split("-");
                    const isValid = parts.length === 2 && 
                                  parts[1] !== 'waiting' && 
                                  parts[0] === itemId;
                    logDebug(`Room Filter ${room}`, { parts, isValid });
                    return isValid;
                });
                
                logDebug("Valid Socket Rooms", validRooms);
                
                // Merge with HTTP rooms (deduplicate)
                setAvailableRooms(prevRooms => {
                    const merged = [...new Set([...prevRooms, ...validRooms])];
                    logDebug("Merged Rooms", { prevRooms, validRooms, merged });
                    return merged;
                });
                
                setLoading(false);
            });

            newSocket.on("error", (error) => {
                logDebug("Socket Error", error);
                setLoading(false);
            });

            // Cleanup function
            return () => {
                logDebug("Socket Cleanup", "Disconnecting socket");
                newSocket.disconnect();
            };
            
        } catch (error) {
            logDebug("Socket Setup Error", error);
            setLoading(false);
        }
    };

    const fetchBuyers = (socket) => {
        if (socket && itemId) {
            logDebug("Emit Fetch Rooms", { itemId });
            socket.emit("fetch-rooms", { itemId });
        }
    };

    const handleClick = (e, room) => {
        e.preventDefault();
        const buyerId = room.split("-")[1];
        logDebug("Navigate to Chat", { room, buyerId, itemId });
        
        navigate(`/chat/${itemId}/${buyerId}`);
    };

    // Fetch user names for rooms
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
                    console.log(`Fetching user data for ID: ${buyerId}`);
                    
                    // Use the correct route: /user/:userId
                    const response = await fetch(`http://localhost:5000/auth/user/${buyerId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log(`User endpoint response for ${buyerId}:`, {
                        status: response.status,
                        ok: response.ok,
                        statusText: response.statusText,
                        url: `http://localhost:5000/user/${buyerId}`
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        console.log(`Raw user data for ${buyerId}:`, userData);
                        console.log(`Available properties for ${buyerId}:`, Object.keys(userData));
                        logDebug(`User Data from /user/${buyerId}`, userData);
                        
                        const userName = userData.userName || userData.name || `User ${buyerId}`;
                        console.log(`Extracted username for ${buyerId}:`, userName);
                        names[room] = userName;
                    } else {
                        console.log(`User ${buyerId} not found (${response.status}), using fallback name`);
                        logDebug(`User ${buyerId} not found`, response.status);
                        names[room] = `User ${buyerId}`;
                    }
                } catch (error) {
                    console.error(`User fetch exception for ${buyerId}:`, error);
                    logDebug(`User Fetch Exception ${buyerId}`, error);
                    names[room] = `User ${buyerId}`;
                }
            }
            
            console.log("Final extracted names:", names);
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
                        <h1 className="text-2xl font-semibold text-center">Loading...</h1>
                        <div className="mt-4 text-xs text-gray-500">
                            <p>ItemId: {itemId}</p>
                            <p>UserId: {userId}</p>
                            <p>Recent Chats: {recentChats.length}</p>
                            <p>Available Rooms: {availableRooms.length}</p>
                        </div>
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
                                        
                    {/* Show recent chats info */}
                    {recentChats.length > 0 && (
                        <div className="mb-4 text-center text-sm text-gray-600">
                            Found {recentChats.length} recent conversation(s)
                        </div>
                    )}
                    
                    {availableRooms.length === 0 ? (
                        <div className="text-center py-10">
                            <h2 className="text-lg text-gray-600">No buyers have contacted you yet</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Buyers will appear here once they start chatting about your item
                            </p>
                            {recentChats.length > 0 && (
                                <div className="mt-4 p-4 bg-yellow-100 rounded">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Found {recentChats.length} chats in database but no rooms generated
                                    </p>
                                    <p className="text-xs mt-2">Check the debug section above for details</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center gap-5 p-5 flex-wrap">
                            {availableRooms.map((room, index) => {
                                const buyerId = room.split("-")[1];
                                const userName = roomName[room] || `Loading...`;
                                const chatInfo = recentChats.find(chat => chat.userId.toString() === buyerId);
                                
                                return (
                                    <button 
                                        key={index}
                                        className="bg-[#D9D9D9] hover:bg-[#c9c9c9] min-w-40 h-32 rounded-xl transition-colors duration-200 px-4"
                                        onClick={(e) => handleClick(e, room)}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">{userName}</div>
                                            <div className="text-xs text-gray-600">ID: {buyerId}</div>
                                            <div className="text-xs text-gray-500">Room: {room}</div>
                                            {chatInfo && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Last: {new Date(chatInfo.createdAt).toLocaleDateString()}
                                                    <br />
                                                    Msg: {chatInfo.message?.substring(0, 20)}...
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate(`/item/${itemId}`)}
                            className="bg-[#F47C26] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors mr-4"
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