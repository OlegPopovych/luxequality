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
import { MyComponent } from './MapComponent';
import { PointType } from '../../util/types';
import { useAppDispatch, useThunkDispatch } from '../../store/hooks';
import { addCoords } from '../../store/coordsSlice';
import { changeType, fetchAdverts, setUpBounds } from '../../store/advertSlice';

interface MainMapProps {
  points: PointType[] | null;
  type?: string;
}

export const MapLayout: React.FC<MainMapProps> = ({ points, type }) => {
  const [center, setCenter] = useState<LatLngTuple>([48.6211999, 24.5759679]);

  const dispatch = useAppDispatch();
  const dispatcher = useThunkDispatch();
  const dispatchType = useAppDispatch();

  const handleCoords = (coords: LatLng) => {
    if (type === 'modal') {
      dispatch(addCoords([coords]));
    }
  };

  const handleMarkerClick = (marker: number[]) => {
    if (type !== 'modal' && marker) {
      dispatcher(fetchAdverts(JSON.stringify(marker)));
      dispatchType(changeType('one'));
    }
  };

  const handleSetBounds = (bounds: LatLngBounds) => {
    if (type !== 'modal' && bounds) {
      dispatch(setUpBounds(bounds));
      dispatcher(fetchAdverts());
      dispatchType(changeType('all'));
    }
  };

  return (
    <MapContainer
      center={center} zoom={18}
      scrollWheelZoom={true}>
      <MyComponent
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
