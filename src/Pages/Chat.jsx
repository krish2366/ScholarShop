import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";

function Chat() {

    
    const {sellerId, productId} = useParams();
    const userId = localStorage.getItem("userId");
    
    const [messageInput, setMessageInput] = useState("");
    const [role, setRole] = useState(userId == sellerId ?"seller" : "buyer");
    const [socket, setSocket] = useState(null);
    const [availableBuyers, setAvailableBuyers] = useState([])
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeBuyerId, setActiveBuyerId] = useState(null);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const newSocket = io("http://localhost:4001",{
            auth:{
                token
            }
        })

        newSocket.on("connect",()=>{
            console.log("socket connected");
            setSocket(newSocket);
        })

        newSocket.on("error-message",(err)=>{
            console.log(err);
        })
        newSocket.on("room-joined", handleRoomJoined);
        newSocket.on("room-switched", handleRoomSwitched);
        newSocket.on("receive-message", handleReceiveMessage);
        newSocket.on("available-buyers", ({ buyers }) => setAvailableBuyers(buyers));
    
        setSocket(newSocket);

        joinRoom(newSocket);
        // return () => {
        //     newSocket.close();
        // }
    }, [])
    

    const handleRoomJoined = (data)=>{
        console.log(data);
        setRoomId(data.roomId);
        setMessages(data.messages);
        setActiveBuyerId(data.roomId.split("-")[1]);
    }

    const handleRoomSwitched = (data) => {
        setRoomId(data.roomId);
        setActiveBuyerId(data.roomId.split("-")[1]);
        setMessages([]);
    };

    const handleReceiveMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        setTimeout(
            () => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
        , 100);
    };

    const joinRoom = (socket) => {
        if (!productId) return alert("Please enter an Item ID");
        if(!socket){
            console.log("socket not connected");
            return;
        }
        socket.emit("join room", { itemId: productId, userType: role, buyerId: userId });
    };







    const sendMessage = () =>{
        if(!messageInput.trim()) return;
        socket.emit("send-message",{roomId, message: messageInput});
        setMessages(
            // (prevMsg) => [...prevMsg,{message: messageInput, senderId: socket.id}]
            prevMsg => (Array.isArray(prevMsg) ? [...prevMsg, {message: messageInput, senderId: socket.id}] : [{message: messageInput, senderId: socket.id}])
        );
        setMessageInput("");
        setTimeout(
            () => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
        , 100);
    }

    {!socket && <h1>Connecting...</h1>}

  return (
    <section className='bg-gray-200 h-screen'>
        <Navbar/>
        <section>
            <h1 className='text-center text-3xl font-bold m-6'>Chat Section</h1>

            <div className='border-8 border-gray-500 rounded-lg border-double m-6 p-6 h-[70vh]'>
                <div className='h-[85%] relative  bg-white p-6 rounded-lg overflow-y-auto' ref={chatBoxRef}>
                    <div className={`w-full mb-5 ${role === "buyer" ? "flex justify-end" : ""}`}>
                        <div className='border-2 border-gray-500 p-2 rounded-lg  w-fit max-w-[40%] '>
                            <span className='font-bold'>{role}:</span>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae velit iure adipisci dicta error labore eos pariatur repellendus? Est voluptatibus aperiam at doloribus quis laborum vitae aut distinctio aspernatur ex.</p>
                        </div>
                    </div>
                    
                    
                </div>

                <div className='h-[10%] mt-5 flex justify-between items-center'>
                    <input 
                        type="text" 
                        placeholder='Type a message...' 
                        className='w-[90%] p-2 border-2 border-gray-500 rounded-lg' 
                        value={messageInput} 
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button 
                        className='bg-blue-500 text-white p-2 rounded-lg w-[9%]'
                        onClick={sendMessage}
                    >
                        Send
                    </button>

                </div>

            </div>
        </section>
    </section>
  )
}

export default Chat
