import { useContext, useEffect, useState, useRef } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import { Header } from '../common/header';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

export const Home = () => {
  const api = useContext(ApiContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [location, setLocation] = useState(null);
  const [dist, setDist] = useState(50);
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
    if (location && chatRooms) {
      console.log(location);
      const userMB = new mapboxgl.LngLat(location.longitude, location.latitude);
      for (let room of chatRooms) {
        console.log(room);
        const roomLocation = new mapboxgl.LngLat(room.long, room.lat);
        const distance = .62137 * userMB.distanceTo(roomLocation) / 1000;
        if (distance <= dist) {
          nearbyRooms.push(room);
        }
      }
      setChatRooms(nearbyRooms);
    }

  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

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
        <Header logout={logout}></Header>
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
            <Route path="/*" element={<div className="inst">Select a room to get started</div>} />
          </Routes>
        </div>
        {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={() => setIsOpen(false)} /> : null}
        </div>
    </div>
  );
};