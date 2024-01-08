/* eslint-disable react/prop-types */
import { LatLng, LatLngBounds, LatLngTuple, Map } from 'leaflet';
import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

type MyComponentProps = {
  setBounds(bounds: LatLngBounds): void;
  setCenter(center: LatLngTuple): void;
  setMap(map: Map): void;
  setCords(map: LatLng): void;
};

export const MapComponent: React.FC<MyComponentProps> = ({
  setBounds,
  setCenter,
  setMap,
  setCords,
}) => {
  const map = useMapEvents({
    zoom: () => {
      const bounds = map.getBounds();
      setBounds(bounds);
    },
    moveend: () => {
      const bounds = map.getBounds();
      setBounds(bounds);
    },
    click: (event) => {
      const coords = event.latlng;
      setCords(coords);
    },
  });

  useEffect(() => {
    setMap(map);
    const locate = map.getCenter();
    setCenter([locate.lat, locate.lng]);
  }, []);

  return null;
};
