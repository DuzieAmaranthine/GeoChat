import { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { Router } from './components/router';
import { ApiContext } from './utils/api_context';
import { AuthContext } from './utils/auth_context';
import { useApi } from './utils/use_api';
import { useJwtRefresh } from './utils/use_jwt_refresh';
import { RolesContext } from './utils/roles_context';
import { parseJwt } from './utils/parse_jwt';
import './app.css';
import mapboxgl from 'mapbox-gl';
import { map } from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';

export const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh the jwt token automatically
  useJwtRefresh(authToken, setAuthToken);

  mapboxgl.accessToken = 'pk.eyJ1IjoiamVzc2x5bm45IiwiYSI6ImNsMWg3NWp1bjAyY2QzamxpcDl6aTNpZncifQ.dSLXsFNzpP8EBuC_Cf1AUw';
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (mapContainer.current && !map) {
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom
      });
      setMap(map);
    }
  }, [mapContainer, map]);

  // api instance
  const api = useApi(authToken);

  // get initial jwt using refresh token
  useEffect(async () => {
    const result = await api.get('/refresh_token');
    if (result.token) {
      setAuthToken(result.token);
    }
    setLoading(false);
  }, []);

  const jwtPayload = parseJwt(authToken);

  // don't display anything while trying to get user token
  // can display a loading screen here if desired
  if (loading) return null;

  return (
    <AuthContext.Provider value={[authToken, setAuthToken]}>
      <ApiContext.Provider value={api}>
        <RolesContext.Provider value={jwtPayload.roles}>
          <HashRouter>
            <Router />
          </HashRouter>
        </RolesContext.Provider>
      </ApiContext.Provider>
    </AuthContext.Provider>
  );
};
