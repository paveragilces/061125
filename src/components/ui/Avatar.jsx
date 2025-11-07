// En: src/components/ui/Avatar.jsx
// --- Reemplaza tu archivo con este ---

import React from 'react';
import './Avatar.css';

/**
 * Avatar con Iniciales y color dinámico
 */
const Avatar = ({ name }) => {
  // 1. LÍNEA DE SEGURIDAD:
  // Si 'name' es undefined, null o un string vacío, usará '?' como respaldo.
  const safeName = name || '?';

  const getInitials = (nameStr) => {
    // 2. Usamos 'nameStr' (el valor seguro)
    const names = nameStr.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getColor = (nameStr) => {
    const colors = ['#d9534f', '#f0ad4e', '#5cb85c', '#5bc0de', '#005a3a'];
    let hash = 0;
    // 3. Usamos 'nameStr' (el valor seguro)
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    // 4. Pasamos 'safeName' a las funciones
    <div className="avatar" style={{ backgroundColor: getColor(safeName) }}>
      {getInitials(safeName)}
    </div>
  );
};

export default Avatar;