import React, { useState } from 'react';
import Icon from './Icon';
import './NavButton.css';

/**
 * Botón de Navegación (con estado de hover)
 */
const NavButton = ({ onClick, children, iconPath, badgeCount }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      className={`navButton ${hover ? 'hover' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {iconPath && <Icon path={iconPath} color="white" />}
      {children}
      {badgeCount > 0 && <span className="notificationBadge">{badgeCount}</span>}
    </button>
  );
};

export default NavButton;