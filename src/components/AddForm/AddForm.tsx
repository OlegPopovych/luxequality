import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { MapLayout } from '../MapLayout/MapLayout';
import { useAppSelector } from '../../store/hooks';
import { selectCoords } from '../../store/coordsSlice';
import cn from 'classnames';
import { usePageError } from '../../hooks/usePageError';
// import axios from 'axios';

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

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`,
        );

        const data = await res.json();
        console.log(data);
        const address = `${
          data.address.city || data.address.town || data.address.village || ''
        }, ${data.address.road || ''} ${data.address.house_number || ''} ${
          data.address.country
        }, ${data.address.district}`;
        setFormData((prevData) => ({ ...prevData, ['location']: address }));

        setIsCreated(true);
      } catch (error) {
        console.error('Error getting address:', error);
      }
    };
    if (coords && coords.lat && coords.lng) {
      getAddress();
      // axios
      //   .get(
      //     `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`,
      //   )
      //   .then((response) => {
      //     const address = response.data.display_name;
      //     const data = response.data.address;
      //     console.log(`Address: ${response.data.display_name}`);
      //     console.log(`data: ${data}`);
      //     setFormData((prevData) => ({ ...prevData, ['location']: address }));
      //   })
      //   .catch((error) => {
      //     console.error('Error getting address:', error);
      //   });
    }
  }, [coords]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, photo: photoFile }));
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.photo) {
      alert('Будь ласка, заповніть всі поля форми.');
      return;
    }

    const apiUrl = 'http://localhost:8000/advertisement';

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
      .then((data) => {
        console.log('Успішно створено:', data);
      })
      .catch((error) => {
        console.error('Помилка при створенні:', error);
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
        <label className="label">Розташування</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Розташування"
            name="location"
            value={formData.location}
            // onChange={() => {}}
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
            {!error && !isCreated ? 'Створити' : 'Помилка'}
            {isCreated && 'Успішно!'}
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
          type={'modal'}
        />
      </div>
    </form>
  );
};
