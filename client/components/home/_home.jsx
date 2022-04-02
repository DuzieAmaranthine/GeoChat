import { useContext, useEffect, useState, useRef } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import { Header } from '../common/header';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessTOken = 'pk.eyJ1IjoiamVzc2x5bm45IiwiYSI6ImNsMWg3NWp1bjAyY2QzamxpcDl6aTNpZncifQ.dSLXsFNzpP8EBuC_Cf1AUw';

export const Home = () => {
  const api = useContext(ApiContext);


  const [chatRooms, setChatRooms] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(50);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const mapContainer = useRef(null);


  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);

    navigator.geolocation.getCurrentPosition((location) => {
      setLocation(location.coords);
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [location.coords.longitude, location.coords.latitude],
        zoom: 9
      });
    });

    const { chatRooms } = await api.get('/chat_rooms');
    setChatRooms(chatRooms);
  }, []);

  useEffect(async () => {
    let nearbyRooms = [];
    if (location) {
      const userLocation = new mapboxgl.LngLat(-70.9, 42.35);
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
          <div className="map-container" id="map" />
        </div>
        {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={() => setIsOpen(false)} /> : null}
        </div>
    </div>
  );
};