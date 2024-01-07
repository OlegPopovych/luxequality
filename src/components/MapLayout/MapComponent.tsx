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

export const MyComponent: React.FC<MyComponentProps> = ({
  setBounds,
  setCenter,
  setMap,
  setCords,
}) => {
  const map = useMapEvents({
    // load: () => {
    //   const locate = map.getCenter();
    //   console.log('load', locate);
    //   setCenter(locate);
    // },
    // locationfound: (location) => {
    //   setCords(location.latlng);
    //   console.log('location found:', location);
    // },
    zoom: () => {
      const bounds = map.getBounds();
      setBounds(bounds);
      console.log({ '!!!!!!!': bounds });
    },
    moveend: () => {
      const bounds = map.getBounds();
      setBounds(bounds);
      console.log({ '!!!!!!!': bounds });
    },
    click: (event) => {
      const coords = event.latlng; // Отримати координати при події mouseup
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
