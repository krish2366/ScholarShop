import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Chat({buyerId}) {
    const { sellerId, productId } = useParams();
    const userId = localStorage.getItem("userId");
    console.log(userId);
    const role = userId === sellerId ? "seller" : "buyer";

    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);
    const [availableBuyers, setAvailableBuyers] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeBuyerId, setActiveBuyerId] = useState(null);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if(!token) return console.log("token not present");

        // Establish socket connection
        const newSocket = io("http://localhost:4001", {
            auth: { token },
            transports: ["websocket","polling"],
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
            setSocket(newSocket);
            joinRoom(newSocket);
            console.log(newSocket.id);
        });

        newSocket.on("error-message", (err) => console.log(err));

        newSocket.on("room-joined", handleRoomJoined);
        newSocket.on("room-switched", handleRoomSwitched);
        newSocket.on("receive-message", handleReceiveMessage);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleRoomJoined = (data) => {
        console.log("Joined Room:", data);
        setRoomId(data.roomId);
        setMessages(data.messages);
    };

    const handleRoomSwitched = (data) => {
        setRoomId(data.roomId);
        setMessages([]);
    };

    const handleReceiveMessage = (data) => {
        setMessages((prevMessages) => {
            return Array.isArray(prevMessages) ? [...prevMessages,data] : [data];
        });
        setTimeout(() => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight), 100);
    };

    const joinRoom = (socket) => {
        if (!productId) return alert("Please enter an Item ID");
        if (!socket) {
            console.log("Socket not connected");
            return;
        }
        socket.emit("join room", { itemId: productId, userType: role, buyerId });
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (!messageInput.trim() || !socket) return;

        socket.emit("send-message", { roomId, message: messageInput });
        // setMessages(
        //     prevMsg => (Array.isArray(prevMsg) ? [...prevMsg, {message: messageInput, senderId: socket.id}] : [{message: messageInput, senderId: socket.id}])
        // );

        setMessageInput("");
        setTimeout(() => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight), 100);
    };

    if (!socket) return <h1 className="text-center text-xl font-bold">Connecting...</h1>;

    return (
        <section className="bg-[#FFF4DC] h-screen">
            <Navbar />
            <section>
                <h1 className="text-center text-3xl font-bold m-6">Chat Section</h1>

                <div className="border-8 border-gray-500 rounded-lg border-double m-6 p-6 h-[70vh]">
                    <div
                        className="h-[85%] relative bg-white p-6 rounded-lg overflow-y-auto"
                        ref={chatBoxRef}
                    >
                        {messages && messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`w-full mb-5 ${
                                    msg.senderId == userId ? "flex justify-end" : "flex justify-start"
                                } `}
                            >
                                <div className="border-2 border-gray-500 p-2 rounded-lg w-fit max-w-[40%] bg-gray-100">
                                    <span className="font-bold">{msg.userId == userId ? "You" : "Other"}:</span>
                                    <p>{msg.message}</p>
                                    {console.log(msg)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form className="h-[10%] mt-5 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-[90%] p-2 border-2 border-gray-500 rounded-lg"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white p-2 rounded-lg w-[9%]"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </section>
        </section>
    );
}

export default Chat;
