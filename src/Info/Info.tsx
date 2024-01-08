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
            <h3 className="info__title title is-4">{`Знайдено ${adverts.length} оголошень`}</h3>
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
                      <svg
                        width="13"
                        height="16"
                        viewBox="0 0 13 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.53091 8.90128V8.90128C5.22167 8.90128 4.16054 7.84014 4.16054 6.53091V6.53091C4.16054 5.22167 5.22167 4.16054 6.53091 4.16054V4.16054C7.84014 4.16054 8.90128 5.22167 8.90128 6.53091V6.53091C8.90128 7.84014 7.84014 8.90128 6.53091 8.90128Z"
                          stroke="#404B69"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.53086 15.2222C6.53086 15.2222 1 10.679 1 6.53086C1 3.47625 3.47625 1 6.53086 1C9.58548 1 12.0617 3.47625 12.0617 6.53086C12.0617 10.679 6.53086 15.2222 6.53086 15.2222Z"
                          stroke="#404B69"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
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
