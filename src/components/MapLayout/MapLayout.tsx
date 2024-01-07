import React, {
  useState,
  //  useEffect
} from 'react';
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { LatLng, LatLngBounds, LatLngTuple, Map } from 'leaflet';
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
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [center, setCenter] = useState<LatLngTuple>([48.6211999, 24.5759679]);
  const [map, setMap] = useState<Map | null>(null);
  const [cords, setCords] = useState<LatLng | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number[] | null>(null);

  const dispatch = useAppDispatch();
  const dispatcher = useThunkDispatch();
  const dispatchType = useAppDispatch();

  console.log({ selectedMarker, cords, center, bounds, map });

  const handleCoords = (coords: LatLng) => {
    setCords(() => coords);

    if (type === 'modal') {
      dispatch(addCoords([coords]));
    }
  };

  // useEffect(() => {
  //   map?.locate({
  //     setView: true,
  //   });
  //   map?.flyToBounds([center]);
  // }, [center]);

  const handleMarkerClick = (marker: number[]) => {
    console.log(marker);
    setSelectedMarker(marker);

    if (type !== 'modal' && marker) {
      dispatcher(fetchAdverts(JSON.stringify(marker)));
      dispatchType(changeType('one'));
    }
  };

  const handleSetBounds = (bounds: LatLngBounds) => {
    if (type !== 'modal' && bounds) {
      dispatch(setUpBounds(bounds));
      setBounds(bounds);
    }
  };

  return (
    <MapContainer
      center={center} zoom={18}
      scrollWheelZoom={true}>
      <MyComponent
        setBounds={handleSetBounds}
        setCenter={setCenter}
        setMap={setMap}
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
