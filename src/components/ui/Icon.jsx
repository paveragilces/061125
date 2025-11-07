import React from 'react';

/**
 * Componente de Icono SVG Genérico
 */
const Icon = ({ path, size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={path}></path>
  </svg>
);

export default Icon;