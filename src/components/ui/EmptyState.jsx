import React from 'react';
import Icon from './Icon';
import './EmptyState.css';

/**
 * Componente de Estado Vacío
 */
const EmptyState = ({ iconPath, title, message }) => {
  return (
    <div className="emptyStateContainer">
      <div className="emptyStateIcon">
        <Icon path={iconPath} size={60} />
      </div>
      <h2 className="emptyStateTitle">{title}</h2>
      <p className="emptyStateMessage">{message}</p>
    </div>
  );
};

export default EmptyState;