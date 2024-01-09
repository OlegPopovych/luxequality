import { useEffect } from 'react';
import {
  changeType,
  fetchAdverts,
  selectAdvertsLoadingStatus,
  selectAdvertsType,
  selectAdvertsWithBounds,
} from '../store/advertSlice';
import {
  useAppDispatch,
  useAppSelector,
  useThunkDispatch,
} from '../store/hooks';
import './info.scss';
import { Spinner } from '../components/Loader/Spinner';
import { InfoType } from '../util/types';
import { LocationIcon } from './LocationIcon';

const Info = () => {
  const adverts = useAppSelector(selectAdvertsWithBounds);
  const loadingAllStatus = useAppSelector(selectAdvertsLoadingStatus);
  const type = useAppSelector(selectAdvertsType);
  const dispatcher = useThunkDispatch();
  const dispatchType = useAppDispatch();

  useEffect(() => {
    dispatcher(fetchAdverts());
    dispatchType(changeType(InfoType.All));
  }, []);

  return (
    <div className="info">
      {loadingAllStatus === 'loading' && <Spinner />}

      {loadingAllStatus === 'error' && (
        <p className="subtitle is-4 has-text-danger">Помилка</p>
      )}

      {true && loadingAllStatus === 'idle' && (
        <>
          {type === 'all' && (
            <h3 className="info__title title is-4">{`Знайдено: ${adverts.length}`}</h3>
          )}

          <div className="content info__element">
            {adverts.map((advert) => {
              return (
                <div className="card" key={advert.id}>
                  <div className="card-content">
                    <div className="title is-3">{advert.name}</div>
                  </div>

                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={advert.imageUrl} alt="Placeholder image" />
                    </figure>
                  </div>

                  <div className="card-content">
                    <p className="subtitle is-4">{advert.desc}</p>

                    <div>
                      <LocationIcon />
                      <span className="info__location subtitle is-5">
                        {advert.location}
                      </span>
                    </div>

                    <p className="title is-4">{`${advert.price} ГРН`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Info;
