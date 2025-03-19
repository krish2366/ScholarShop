import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function AvailableBuyers({setBuyerId}) {

    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    const {itemId} = useParams();
    const [socket, setSocket] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        const newSocket = io("http://localhost:4001", {
            auth: {
            token: localStorage.getItem("accessToken")
            }
        });
        
        newSocket.on("connect",() => {
            console.log("Socket connected");
            setSocket(newSocket);
            fetchBuyers(newSocket);
        })

        newSocket.on("error-message", (err) => console.log(err));
        newSocket.on("rooms-list",({rooms}) =>{
            console.log(rooms);
            setAvailableRooms(rooms);

        })

    }, [])

    const fetchBuyers = (socket) =>{
        socket.emit("fetch-rooms", {itemId})
    }

    const handleClick = (e,room) =>{
        e.preventDefault();
        setBuyerId(room.split("-")[1]);
        navigate(`/chat/${userId}/${room.split("-")[0]}`)

    }
    
  return (
    <div>
      <Navbar/>
      <section className="bg-[#DCE6EC] py-10 min-h-screen ">
        <div className="bg-white mx-14 px-5 pt-5 pb-10 rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold text-center">Available Buyers</h1>
            <div className="flex justify-center gap-5">
                {availableRooms.length>0 ? (availableRooms.map((room,index) =>{
                    return(
                        <button 
                            key={index}
                            className="bg-[#D9D9D9] w-[20%] h-20 rounded-xl rounded-b-none"
                            onClick={(e) => handleClick(e,room)}
                        >
                            {room}
                        </button>
                    )
                })) 
                : 
                    <h1>No Buyers Available</h1>
                }
                
            </div>
        </div>

      </section>
    </div>
  )
}

export default AvailableBuyers
