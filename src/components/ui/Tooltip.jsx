import React from 'react';
import './Tooltip.css';

/**
 * Tooltip al pasar el mouse
 */
const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltipContainer">
      {children}
      <span className="tooltipText">{text}</span>
    </div>
  );
};

export default Tooltip;