import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { MapLayout } from '../MapLayout/MapLayout';
import { useAppSelector } from '../../store/hooks';
import { selectCoords } from '../../store/coordsSlice';
import cn from 'classnames';
import { usePageError } from '../../hooks/usePageError';
import { MapType } from '../../util/types';

const BASE_URL = 'https://luxequality-test-api-docker.onrender.com';

interface FormData {
  name: string;
  location: string;
  photo: File | null;
  price: string;
  desc: string;
}

export const AddForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    photo: null,
    price: '',
    desc: '',
  });

  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = usePageError(null);
  const [isCreated, setIsCreated] = useState(false);

  const coords = useAppSelector(selectCoords)[0];

  const handleClearForm = () => {
    setFormData({
      name: '',
      location: '',
      photo: null,
      price: '',
      desc: '',
    });
  };

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`,
        );

        const data = await res.json();
        const address = `${
          data.address.city || data.address.town || data.address.village || ''
        }, ${data.address.road || ''} ${data.address.house_number || ''} ${
          data.address.country || ''
        }, ${data.address.district || ''}`;
        setFormData((prevData) => ({ ...prevData, ['location']: address }));
      } catch (error) {
        console.log(error);
      }
    };
    if (coords && coords.lat && coords.lng) {
      getAddress();
    }
  }, [coords]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (isCreated) {
      setIsCreated(true);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, photo: photoFile }));

    if (isCreated) {
      setIsCreated(true);
    }
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.photo) {
      alert('Будь ласка, заповніть всі поля форми.');
      return;
    }

    const apiUrl = `${BASE_URL}/advertisement`;

    setIsloading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('coords', JSON.stringify([coords.lat, coords.lng]));
    data.append('photo', formData.photo);
    data.append('desc', formData.desc);
    data.append('price', formData.price);

    fetch(apiUrl, {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then(() => {
        setIsCreated(true);
        handleClearForm();
      })
      .catch(() => {
        setError({ error: 'Помилка' });
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <form onSubmit={handleCreate}>
      <div className="field">
        <label className="label">Назва</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Назва"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Розташування на мапі</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Розташування"
            name="location"
            value={formData.location}
            onChange={()=> {}}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Опис</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Опис"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Ціна</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Ціна"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Photo</label>
        <div className="file has-name is-fullwidth">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="photo"
              onChange={handleFileChange}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Choose a file…</span>
            </span>
            <span className="file-name">
              {formData.photo ? formData.photo.name : 'No file chosen'}
            </span>
          </label>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button
            type="submit"
            className={cn(
              'button is-primary',
              { 'is-loading': isLoading },
              { 'is-danger': error },
            )}
            disabled={isLoading}
          >
            {!error && !isCreated && 'Створити'}
            {isCreated && 'Успішно!'}
            {error && 'Помилка'}
          </button>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <MapLayout
          points={
            coords
              ? [
                {
                  ...coords,
                  title: '',
                },
              ]
              : []
          }
          type={MapType.Modal}
        />
      </div>
    </form>
  );
};
