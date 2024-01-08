import './mainMap.scss';
import Info from '../../Info/Info';
import { MapLayout } from '../MapLayout/MapLayout';
import { useAppSelector } from '../../store/hooks';
import { selectAdverts } from '../../store/advertSlice';
import { PointType } from '../../util/types';
interface MainMapProps {}

export const MainMap: React.FC<MainMapProps> = () => {
  const points = useAppSelector(selectAdverts);
  let pointsToRender: PointType[] | null;

  if (points.length !== 0) {
    pointsToRender = points.map((elem) => {
      return {
        lat: JSON.parse(elem.coords)[0],
        lng: JSON.parse(elem.coords)[1],
        title: elem.name,
      };
    });
  } else {
    pointsToRender = null;
  }

  return (
    <div className="main__containter">
      <MapLayout points={pointsToRender} />
      <Info />
    </div>
  );
};

export default MainMap;
