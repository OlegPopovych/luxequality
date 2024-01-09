import React, {
  useState,
} from 'react';
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { LatLng, LatLngBounds, LatLngTuple } from 'leaflet';
import tileLayer from '../../util/tileLayer';
import { MapComponent } from './MapComponent';
import { InfoType, MapType, PointType } from '../../util/types';
import { useAppDispatch, useThunkDispatch } from '../../store/hooks';
import { addCoords } from '../../store/coordsSlice';
import { changeType, fetchAdverts, setUpBounds } from '../../store/advertSlice';

interface MainMapProps {
  points: PointType[] | null;
  type?: string;
}

export const MapLayout: React.FC<MainMapProps> = ({ points, type }) => {
  const [center, setCenter] = useState<LatLngTuple>([49.440616243432, 32.017632745955446]);

  const dispatch = useAppDispatch();
  const dispatcher = useThunkDispatch();
  const dispatchType = useAppDispatch();

  const handleCoords = (coords: LatLng) => {
    if (type === MapType.Modal) {
      dispatch(addCoords([coords]));
    }
  };

  const handleMarkerClick = (marker: number[]) => {
    if (type !== MapType.Modal && marker) {
      dispatcher(fetchAdverts(JSON.stringify(marker)));
      dispatchType(changeType(InfoType.One));
    }
  };

  const handleSetBounds = (bounds: LatLngBounds) => {
    if (type !== MapType.Modal && bounds) {
      dispatch(setUpBounds(bounds));
      dispatcher(fetchAdverts());
      dispatchType(changeType(InfoType.All));
    }
  };

  return (
    <MapContainer
      center={center} zoom={6}
      scrollWheelZoom={true}>
      <MapComponent
        setBounds={handleSetBounds}
        setCenter={setCenter}
        setMap={()=>{}}
        setCords={handleCoords}
      />

      <FeatureGroup>
        {points &&
          points.map(({ lat, lng, title }, index) => (
            <Marker
              key={index}
              position={[lat, lng]}
              eventHandlers={{
                click: () => handleMarkerClick([lat, lng]),
              }}
            >

              <Popup>{title}</Popup>
            </Marker>
          ))}
      </FeatureGroup>

      <TileLayer {...tileLayer} />
    </MapContainer>
  );
};
