import { useState } from 'react';
import Modal from '../Modal/Modal';
import { AddForm } from '../AddForm/AddForm';

import './header.scss';
import './nav.scss';
import { HeaderLogo } from './HeaderLogo';
import { ButtonIcon } from './ButtonIcon';

const Header = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const handleSaveChanges = (): void => {
    handleCloseModal();
  };

  return (
    <div className="header">
      <div className="header__logo">
        <a href="/">
          <div data-testid="logo" style={{ height: '28px' }}>
            <HeaderLogo />
          </div>
        </a>
      </div>

      <nav className="nav">
        <ul className="nav__list">
          <li>
            <a className="nav__item" href="/products/">
              Оголошення
            </a>
          </li>

          <li>
            <a className="nav__item" href="/jobs/">
              Запити на роботу
            </a>
          </li>

          <li>
            <a className="nav__item" href="/tenders/">
              Тендери
            </a>
          </li>
        </ul>
      </nav>

      <a className="header__btn" onClick={handleOpenModal}>
        <ButtonIcon />
        Подати оголошення
      </a>

      {isModalOpen && (
        <Modal
          title="Нове оголошення"
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        >
          <AddForm />
        </Modal>
      )}
    </div>
  );
};

export default Header;
