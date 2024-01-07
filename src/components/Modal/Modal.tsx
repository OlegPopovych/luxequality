import React, { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot">
          <button className="button" onClick={onClose}>
            Назад
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
