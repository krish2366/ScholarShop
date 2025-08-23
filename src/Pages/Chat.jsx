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

  // console.log("URL Params:", { param1, param2, userId });

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

  const chatBoxRef = useRef(null);

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
        // console.log("No otherUserId found:", {
        //   userRole,
        //   itemInfo,
        //   actualBuyerId_state,
        // });
        return;
      }

      // console.log(
      //   "Fetching username for user:",
      //   otherUserId,
      //   "| User role:",
      //   userRole
      // );

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

      // console.log("User endpoint response:", {
      //   status: response.status,
      //   ok: response.ok,
      //   statusText: response.statusText,
      //   url: `${
      //     import.meta.env.VITE_MAIN_BACKEND_URL
      //   }/auth/user/${otherUserId}`,
      // });

      if (response.ok) {
        const userData = await response.json();
        // console.log("Raw user data received:", userData);
        // console.log("Available properties:", Object.keys(userData));

        // Fix: Access userName from the nested data object
        const userName =
          userData.data?.userName ||
          userData.data?.name ||
          userData.userName ||
          userData.name ||
          `User ${otherUserId}`;
        // console.log("Extracted username:", userName);
        setOtherUserName(userName);
      } else {
        // console.log(
        //   `User ${otherUserId} not found (${response.status}), using fallback name`
        // );
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

      // console.log(
      //   `Loading history for item: ${productId_state}, buyer: ${actualBuyerId_state}`
      // );

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
        // console.log(
        //   "Filtered historical messages loaded from backend:",
        //   historicalChats
        // );

        const formattedMessages = historicalChats.map((chat) => ({
          id: chat.id,
          message: chat.message,
          senderId: parseInt(chat.userId),
          userId: parseInt(chat.userId),
          timestamp: chat.timestamp || chat.createdAt,
          roomId: `${productId_state}-${actualBuyerId_state}`,
        }));

        // console.log("Final formatted messages:", formattedMessages);
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
            `${import.meta.env.VITE_MAIN_BACKEND_URL}/user/${userId}`,
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

            // console.log("Item found with param1 as productId:", {
            //   itemSellerId,
            //   currentUserId: userId,
            //   param1,
            //   param2,
            // });

            // If current user is the seller, this is seller pattern
            if (userId === itemSellerId) {
              detectedPattern = "seller";
              setProductId(param1);
              setActualBuyerId(parseInt(param2));
              setUserRole("seller");
              setItemInfo(itemData);
              itemFound = true;
              // console.log("Seller pattern confirmed");
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
                // console.log("Buyer pattern with param1 as productId");
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

              // console.log("Item found with param2 as productId:", {
              //   itemSellerId,
              //   currentUserId: userId,
              //   param1,
              //   param2,
              // });

              // If param1 matches sellerId, this is buyer pattern
              if (parseInt(param1) === itemSellerId) {
                detectedPattern = "buyer";
                setProductId(param2);
                setActualBuyerId(userId);
                setUserRole("buyer");
                setItemInfo(itemData);
                itemFound = true;
                // console.log("Buyer pattern confirmed");
              }
            }
          } catch (err) {
            // console.log("Param2 as productId failed:", err.message);
          }
        }

        if (itemFound) {
          setUrlPattern(detectedPattern);
          // console.log(`Pattern detected: ${detectedPattern}`);
        } else {
          // Fallback: Make educated guess based on typical patterns
          // console.log("No item found, making educated guess...");

          // Assume seller pattern if param2 looks like a user ID
          if (userId && (userId === parseInt(param1) || param2.length < 10)) {
            setUrlPattern("seller");
            setProductId(param1);
            setActualBuyerId(parseInt(param2));
            setUserRole("seller");
            // console.log("Fallback: Assuming seller pattern");
          } else {
            setUrlPattern("buyer");
            setProductId(param2);
            setActualBuyerId(userId);
            setUserRole("buyer");
            // console.log("Fallback: Assuming buyer pattern");
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

    // console.log("Setting up socket connection...");

    // Establish socket connection
    const newSocket = io(import.meta.env.VITE_CHAT_BACKEND_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      // console.log("Socket connected successfully");
      setSocket(newSocket);
      setReconnectAttempts(0);
      joinRoom(newSocket);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      // console.log("Socket reconnected after", attemptNumber, "attempts");
      setReconnectAttempts(0);
      // Reload historical messages on reconnect
      loadHistoricalMessages();
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      // console.log("Attempting to reconnect, attempt:", attemptNumber);
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
      // console.log("Auto-connected:", data);
      setActiveBuyerId(data.buyerId);
    });

    return () => {
      // console.log("Cleaning up socket connection");
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

    // console.log("Attempting to join room with:", {
    //   itemId: productId_state,
    //   userType: userRole,
    //   buyerId: actualBuyerId_state,
    // });

    socket.emit("join room", {
      itemId: productId_state,
      userType: userRole,
      buyerId: actualBuyerId_state,
    });
  };

  const handleRoomJoined = (data) => {
    // console.log("Successfully joined room:", data);
    setRoomId(data.roomId);

    // Only set messages from socket if we don't have historical messages loaded
    if (data.messages && data.messages.length > 0 && messages.length === 0) {
      // console.log("Setting messages from room join:", data.messages);
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
    // console.log("Room switched:", data);
    setRoomId(data.roomId);
    // Don't clear messages immediately, let them load from HTTP
    // setMessages([]);
  };

  const handleReceiveMessage = (data) => {
    // console.log("Received new message:", data);

    // Ensure the message has consistent format with proper ID parsing
    const formattedMessage = {
      ...data,
      senderId: parseInt(data.senderId || data.userId),
      userId: parseInt(data.userId || data.senderId),
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // console.log("Formatted message:", formattedMessage);

    setMessages((prevMessages) => {
      // Prevent duplicate messages
      const existingMessage = prevMessages.find(
        (msg) =>
          msg.id === formattedMessage.id ||
          (msg.message === formattedMessage.message &&
            msg.timestamp === formattedMessage.timestamp)
      );

      if (existingMessage) {
        // console.log("Duplicate message detected, skipping");
        return prevMessages;
      }

      const newMessages = Array.isArray(prevMessages)
        ? [...prevMessages, formattedMessage]
        : [formattedMessage];
      // console.log("Updated messages array:", newMessages);
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
      // console.warn("Cannot send message:", {
      //   hasMessage: !!messageInput.trim(),
      //   hasSocket: !!socket,
      //   hasRoom: !!roomId,
      // });
      return;
    }

    const messageData = {
      roomId,
      message: messageInput.trim(),
      senderId: parseInt(userId), // Ensure it's a number
      userId: parseInt(userId), // Ensure it's a number
      timestamp: new Date().toISOString(),
    };

    // console.log("Sending message:", messageData);
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
    <section className=" h-screen">
      <Navbar />
      <section className="bg-[#FFF4DC] pb-5">
        <h1 className="text-center text-3xl font-bold m-6 mt-0 pt-6">
          Chat Section
          {/* {itemInfo && (
            <span className="block text-lg font-normal mt-2">
              Item: {itemInfo.title}
            </span>
          )}
          <span className="block text-sm font-normal text-gray-600">
            You are: {userRole} | Pattern: {urlPattern}
          </span>
          <span className="block text-xs font-normal text-gray-500">
            Product: {productId_state} | Buyer: {actualBuyerId_state}
          </span>
          {roomId && (
            <span className="block text-xs font-normal text-gray-500">
              Room: {roomId}
            </span>
          )}
          <span className="block text-xs font-normal text-gray-400">
            Messages: {messages.length} | Socket:{" "}
            {socket?.connected ? "Connected" : "Disconnected"}
          </span>
          <span className="block text-xs font-normal text-gray-400">
            Chatting with: {otherUserName}
          </span> */}
        </h1>

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

                      // console.log("Message debug:", {
                      //   msgSenderId,
                      //   currentUserId,
                      //   isCurrentUser,
                      //   originalMsg: msg,
                      // });

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
    </section>
  );
}

export default Chat;
