import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import { Header } from '../common/header';
import mapboxgl from 'mapbox-gl';

export const Home = () => {
  const api = useContext(ApiContext);


  const [chatRooms, setChatRooms] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistrance] = useState(25);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);

    navigator.geolocation.getCurrentPosition((location) => {
      setLocation(location.coords);
    });

    const { chatRooms } = await api.get('/chat_rooms');
    setChatRooms(chatRooms);
  }, []);

  useEffect(async () => {
    let nearbyRooms = [];
    if (location) {
      const userLocation = new mapboxgl.LngLat(location.longitude, location.latitude)
      for (let room of chatRooms) {
        const roomLocation = new mapboxgl.LngLat(room.longitude, room.latitude);
        const distance = .62137 * userLocation.distanceTo(roomLocation) / 1000;
        if (distance < setDistance) {
          nearbyRooms.push(room);
        }
      }
      setChatRooms(nearbyRooms);
    }

  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async (name) => {
    const sendRoom = {
      name: name,
      longitude: location.longitude,
      latitude: location.latitude,
    };
    setIsOpen(false);
    const { chatRoom } = await api.post('/chat_rooms', sendRoom);
    setChatRooms([...chatRooms, chatRoom]);
  };



  return (
    <div className="my-container">
      <div className="head-container">
        <Header></Header>
      </div>
      <div className="body-container">
        <Rooms>
          {chatRooms.map((room) => {
            return (
              <Room key={room.id} to={`chat_rooms/${room.id}`}>
                {room.name}
              </Room>
            );
          })}
          <Room action={() => setIsOpen(true)}>+</Room>
        </Rooms>
        <div className="chat-window">
          <Routes>
            <Route path="chat_rooms/:id" element={<ChatRoom />} />
            <Route path="/*" element={<div>Select a room to get started</div>} />
          </Routes>
        </div>
        {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={() => setIsOpen(false)} /> : null}
        </div>
    </div>
  );
};