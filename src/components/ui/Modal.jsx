import React from 'react';
import './Modal.css';

/**
 * Componente Modal
 */
const Modal = ({ title, children, message, type = 'info', onClose, size }) => {
  const titleMap = {
    success: 'Éxito',
    error: 'Error',
    info: 'Aviso',
  };
  
  const modalTitle = title || titleMap[type];

  const modalContentClasses = `
    modalContent
    ${size === 'large' ? 'large' : ''}
  `;

  const modalTitleClasses = `
    modalTitle
    ${title ? 'info' : type}
  `;
  
  const modalBodyClasses = `
    modalBody
    ${size === 'large' ? 'left' : ''}
  `;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className={modalContentClasses} onClick={(e) => e.stopPropagation()}>
        <h2 className={modalTitleClasses}>
          {modalTitle}
        </h2>
        <div className={modalBodyClasses}>
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className="modalActions">
          <button className="modalButton" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;