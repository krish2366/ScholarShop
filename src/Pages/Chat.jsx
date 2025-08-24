import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Send,
  Wifi,
  WifiOff,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Flag,
} from "lucide-react";

function Chat({ buyerId }) {
  const params = useParams();
  const userId = parseInt(localStorage.getItem("userId")); // Parse to number consistently

  // Parse URL parameters - handle both patterns
  let productId, actualBuyerId, sellerId;

  // Pattern 1: /chat/:sellerId/:productId (buyer accessing)
  // Pattern 2: /chat/:productId/:buyerId (seller accessing)

  const param1 = Object.values(params)[0];
  const param2 = Object.values(params)[1];

  // State management
  const [urlPattern, setUrlPattern] = useState(null);
  const [productId_state, setProductId] = useState(null);
  const [actualBuyerId_state, setActualBuyerId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [availableBuyers, setAvailableBuyers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeBuyerId, setActiveBuyerId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [otherUserName, setOtherUserName] = useState("Other"); // Add this state

  // Report functionality states
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    complaint: '',
    type: 'harassment'
  });
  const [isReporting, setIsReporting] = useState(false);

  const chatBoxRef = useRef(null);

  // Get other user ID for reporting
  const getOtherUserId = () => {
    if (userRole === "buyer" && itemInfo) {
      return itemInfo.sellerId || itemInfo.userId;
    } else if (userRole === "seller") {
      return actualBuyerId_state;
    }
    return null;
  };

  // Handle report user
  const handleReportUser = async () => {
    const otherUserId = getOtherUserId();
    if (!otherUserId) {
      alert('Unable to determine user to report');
      return;
    }

    setIsReporting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/user-report/report-user/${otherUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          ...reportData,
          itemId: productId_state,
          roomId: roomId || `${productId_state}-${actualBuyerId_state}`
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('User reported successfully');
        setShowReportModal(false);
        setReportData({ complaint: '', type: 'harassment' });
        setShowDropdown(false);
      } else {
        alert(result.message || 'Failed to report user');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('Failed to report user. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  // Add function to fetch other user's name
  const fetchOtherUserName = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      let otherUserId;
      if (userRole === "buyer") {
        // Buyer wants seller's name - get from itemInfo
        otherUserId = itemInfo?.sellerId || itemInfo?.userId;
      } else {
        // Seller wants buyer's name
        otherUserId = actualBuyerId_state;
      }

      if (!otherUserId) {
        return;
      }

      // Use the correct route pattern: /user/:userId
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_BACKEND_URL}/auth/user/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();

        // Fix: Access userName from the nested data object
        const userName =
          userData.data?.userName ||
          userData.data?.name ||
          userData.userName ||
          userData.name ||
          `User ${otherUserId}`;
        setOtherUserName(userName);
      } else {
        setOtherUserName(`User ${otherUserId}`);
      }
    } catch (error) {
      console.error("Error fetching other user name:", error);
      setOtherUserName("Other");
    }
  };

  // Fetch other user's name when chat context is established
  useEffect(() => {
    if (userRole && itemInfo && actualBuyerId_state && !isLoading) {
      fetchOtherUserName();
    }
  }, [userRole, itemInfo, actualBuyerId_state, isLoading]);

  const loadHistoricalMessages = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !productId_state || !actualBuyerId_state) return;

      // Corrected URL:
      const response = await fetch(
        `${
          import.meta.env.VITE_MAIN_BACKEND_URL
        }/chat/conversation/${productId_state}/${actualBuyerId_state}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const historicalChats = await response.json();

        const formattedMessages = historicalChats.map((chat) => ({
          id: chat.id,
          message: chat.message,
          senderId: parseInt(chat.userId),
          userId: parseInt(chat.userId),
          timestamp: chat.timestamp || chat.createdAt,
          roomId: `${productId_state}-${actualBuyerId_state}`,
        }));

        setMessages(formattedMessages);

        // Scroll to bottom
        setTimeout(() => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error loading historical messages:", error);
    }
  };

  // Improved pattern determination
  useEffect(() => {
    const determineUrlPattern = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }

        // Strategy 1: Try to fetch user info to understand if they're a seller
        let userResponse;
        try {
          userResponse = await fetch(
            `${import.meta.env.VITE_MAIN_BACKEND_URL}/auth/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (err) {
          // console.log("Could not fetch user info, continuing with item lookup");
        }

        // Strategy 2: Try both possible item IDs
        let itemFound = false;
        let itemData = null;
        let detectedPattern = null;

        // First, try param1 as productId (seller pattern: /productId/buyerId)
        try {
          const response = await fetch(
            `${import.meta.env.VITE_MAIN_BACKEND_URL}/item/${param1}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            itemData = await response.json();
            const itemSellerId = parseInt(itemData.sellerId || itemData.userId);

            // If current user is the seller, this is seller pattern
            if (userId === itemSellerId) {
              detectedPattern = "seller";
              setProductId(param1);
              setActualBuyerId(parseInt(param2));
              setUserRole("seller");
              setItemInfo(itemData);
              itemFound = true;
            } else {
              // Current user is not the seller, so they might be the buyer
              // Check if param2 matches current user (buyer pattern)
              if (userId === parseInt(param2)) {
                detectedPattern = "buyer";
                setProductId(param1);
                setActualBuyerId(userId);
                setUserRole("buyer");
                setItemInfo(itemData);
                itemFound = true;
              }
            }
          }
        } catch (err) {
          // console.log("Param1 as productId failed:", err.message);
        }

        // If not found, try param2 as productId (buyer pattern: /sellerId/productId)
        if (!itemFound) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_MAIN_BACKEND_URL}/item/${param2}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.ok) {
              itemData = await response.json();
              const itemSellerId = parseInt(
                itemData.sellerId || itemData.userId
              );

              // If param1 matches sellerId, this is buyer pattern
              if (parseInt(param1) === itemSellerId) {
                detectedPattern = "buyer";
                setProductId(param2);
                setActualBuyerId(userId);
                setUserRole("buyer");
                setItemInfo(itemData);
                itemFound = true;
              }
            }
          } catch (err) {
            // console.log("Param2 as productId failed:", err.message);
          }
        }

        if (itemFound) {
          setUrlPattern(detectedPattern);
        } else {
          // Fallback: Make educated guess based on typical patterns
          // Assume seller pattern if param2 looks like a user ID
          if (userId && (userId === parseInt(param1) || param2.length < 10)) {
            setUrlPattern("seller");
            setProductId(param1);
            setActualBuyerId(parseInt(param2));
            setUserRole("seller");
          } else {
            setUrlPattern("buyer");
            setProductId(param2);
            setActualBuyerId(userId);
            setUserRole("buyer");
          }
        }
      } catch (error) {
        console.error("Error determining URL pattern:", error);
        setError("Failed to determine chat context");
      } finally {
        setIsLoading(false);
      }
    };

    if (param1 && param2 && userId) {
      determineUrlPattern();
    } else {
      setError("Missing required parameters");
      setIsLoading(false);
    }
  }, [param1, param2, userId]);

  // Load historical messages when productId and buyerId are set
  useEffect(() => {
    if (productId_state && actualBuyerId_state && !isLoading) {
      loadHistoricalMessages();
    }
  }, [productId_state, actualBuyerId_state, isLoading]);

  // Socket connection setup
  useEffect(() => {
    if (isLoading || error || !urlPattern || !productId_state || !userRole) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    // Establish socket connection
    const newSocket = io(import.meta.env.VITE_CHAT_BACKEND_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
      setReconnectAttempts(0);
      joinRoom(newSocket);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      setReconnectAttempts(0);
      // Reload historical messages on reconnect
      loadHistoricalMessages();
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      setReconnectAttempts(attemptNumber);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat server");
    });

    newSocket.on("error-message", (err) => {
      console.error("Socket error message:", err);
      setError(err);
    });

    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("Chat connection error");
    });

    newSocket.on("room-joined", handleRoomJoined);
    newSocket.on("room-switched", handleRoomSwitched);
    newSocket.on("receive-message", handleReceiveMessage);
    newSocket.on("auto-connected", (data) => {
      setActiveBuyerId(data.buyerId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [
    urlPattern,
    productId_state,
    userRole,
    actualBuyerId_state,
    isLoading,
    error,
  ]);

  const joinRoom = (socket) => {
    if (!productId_state) {
      console.error("Cannot join room: No product ID");
      return;
    }
    if (!socket) {
      console.error("Cannot join room: Socket not connected");
      return;
    }
    if (!userRole) {
      console.error("Cannot join room: User role not determined");
      return;
    }

    socket.emit("join room", {
      itemId: productId_state,
      userType: userRole,
      buyerId: actualBuyerId_state,
    });
  };

  const handleRoomJoined = (data) => {
    setRoomId(data.roomId);

    // Only set messages from socket if we don't have historical messages loaded
    if (data.messages && data.messages.length > 0 && messages.length === 0) {
      // Ensure all message IDs are parsed consistently
      const formattedMessages = data.messages.map((msg) => ({
        ...msg,
        senderId: parseInt(msg.senderId || msg.userId),
        userId: parseInt(msg.userId || msg.senderId),
      }));
      setMessages(formattedMessages);
    }

    // Scroll to bottom after messages load
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
      }
    }, 100);
  };

  const handleRoomSwitched = (data) => {
    setRoomId(data.roomId);
  };

  const handleReceiveMessage = (data) => {
    // Ensure the message has consistent format with proper ID parsing
    const formattedMessage = {
      ...data,
      senderId: parseInt(data.senderId || data.userId),
      userId: parseInt(data.userId || data.senderId),
      timestamp: data.timestamp || new Date().toISOString(),
    };

    setMessages((prevMessages) => {
      // Prevent duplicate messages
      const existingMessage = prevMessages.find(
        (msg) =>
          msg.id === formattedMessage.id ||
          (msg.message === formattedMessage.message &&
            msg.timestamp === formattedMessage.timestamp)
      );

      if (existingMessage) {
        return prevMessages;
      }

      const newMessages = Array.isArray(prevMessages)
        ? [...prevMessages, formattedMessage]
        : [formattedMessage];
      return newMessages;
    });

    setTimeout(
      () => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight),
      100
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !socket || !roomId) {
      return;
    }

    const messageData = {
      roomId,
      message: messageInput.trim(),
      senderId: parseInt(userId), // Ensure it's a number
      userId: parseInt(userId), // Ensure it's a number
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-message", messageData);

    setMessageInput("");
    setTimeout(
      () => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight),
      100
    );
  };

  // Error state
  if (error) {
    return (
      <div className="bg-[#FFF4DC] h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h2 className="font-bold text-lg mb-2">Connection Error</h2>
            <p>{error}</p>
            {reconnectAttempts > 0 && (
              <p className="text-sm mt-2">
                Reconnection attempt: {reconnectAttempts}/5
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !socket || !userRole || !urlPattern) {
    return (
      <div className="bg-[#FFF4DC] h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-bold">Connecting to chat...</h1>
            <div className="text-sm text-gray-600 mt-2">
              <p>Pattern: {urlPattern || "Detecting..."}</p>
              <p>Role: {userRole || "Determining..."}</p>
              <p>Socket: {socket ? "Connected" : "Connecting..."}</p>
              <p>Messages loaded: {messages.length}</p>
              {reconnectAttempts > 0 && (
                <p className="text-yellow-600">
                  Reconnecting... ({reconnectAttempts}/5)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="h-screen">
      <Navbar />
      <section className="bg-[#FFF4DC] pb-5">
        <div className="flex justify-between items-center px-4 sm:px-8">
          <h1 className="text-center text-3xl font-bold m-6 mt-0 pt-6 flex-1">
            Chat Section
          </h1>
          
          {/* Report Button - Mobile Friendly */}
          <div className="relative pt-6">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="More options"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
            
            {showDropdown && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-10 sm:hidden" 
                  onClick={() => setShowDropdown(false)}
                ></div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                  <button
                    onClick={() => {
                      setShowReportModal(true);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Report {otherUserName}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto h-screen px-4 py-6">
          <div className="bg-white h-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Chat Messages */}
            <div
              className="h-[85%] p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-orange-50 to-white"
              ref={chatBoxRef}
            >
              {messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages
                    .sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    )
                    .map((msg, index) => {
                      const msgSenderId = parseInt(msg.senderId || msg.userId);
                      const currentUserId = parseInt(userId);
                      const isCurrentUser = msgSenderId === currentUserId;

                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%]`}
                          >
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm text-[#333333] ${
                                isCurrentUser
                                  ? "rounded-br-md bg-[#f7a367] "
                                  : "bg-white border border-gray-200 rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {msg.message}
                              </p>
                            </div>

                            <div
                              className={`flex items-center mt-1 px-2 ${
                                isCurrentUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span
                                className={`text-xs font-medium mr-2`}
                                style={
                                  isCurrentUser
                                    ? { color: "#F47C26" }
                                    : { color: "#333333", opacity: 0.7 }
                                }
                              >
                                {isCurrentUser ? "You" : otherUserName}
                              </span>
                              {msg.timestamp && (
                                <span
                                  className="text-xs"
                                  style={{ color: "#333333", opacity: 0.5 }}
                                >
                                  {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center" style={{ color: "#333333" }}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageCircle size={24} className="text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No messages yet</p>
                    <p className="text-sm opacity-70">
                      Start the conversation!
                    </p>

                    {/* Connection Status */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        {socket?.connected ? (
                          <>
                            <Wifi size={14} className="text-green-500" />
                            <span>Connected to {roomId || "room"}</span>
                          </>
                        ) : (
                          <>
                            <WifiOff size={14} className="text-red-500" />
                            <span>Disconnected</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="h-[15%] border-t border-gray-700 bg-white p-4 md:p-6">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    style={{ "--tw-ring-color": "#F47C26" }}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                    disabled={!socket || !roomId}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!socket || !roomId || !messageInput.trim()}
                  className="p-3 rounded-2xl font-medium transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white"
                  style={{ backgroundColor: "#F47C26" }}
                  onMouseEnter={(e) =>
                    !e.target.disabled &&
                    (e.target.style.backgroundColor = "#ea580c")
                  }
                  onMouseLeave={(e) =>
                    !e.target.disabled &&
                    (e.target.style.backgroundColor = "#F47C26")
                  }
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Report {otherUserName}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select
                  value={reportData.type}
                  onChange={(e) => setReportData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="harassment">Harassment</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate_behavior">Inappropriate Behavior</option>
                  <option value="scam">Scam</option>
                  <option value="fake_profile">Fake Profile</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={reportData.complaint}
                  onChange={(e) => setReportData(prev => ({ ...prev, complaint: e.target.value }))}
                  placeholder="Please describe the issue..."
                  className="w-full p-2 border rounded-md h-24 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportData({ complaint: '', type: 'harassment' });
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50 transition-colors text-sm"
                  disabled={isReporting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportUser}
                  disabled={!reportData.complaint.trim() || isReporting}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Chat;
