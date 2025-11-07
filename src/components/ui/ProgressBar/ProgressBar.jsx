// En: src/components/ui/ProgressBar/ProgressBar.jsx
// --- ARCHIVO COMPLETO Y MEJORADO ---

import React from 'react';
import './ProgressBar.css';

/**
 * Componente de barra de progreso que ahora es "inteligente".
 * Muestra el porcentaje y cambia de color según el puntaje.
 */
const ProgressBar = ({ label, score }) => {

  // 1. Lógica para determinar el color
  const getColorForScore = (s) => {
    if (s >= 90) return '#28a745'; // Verde (Éxito)
    if (s >= 70) return '#f0ad4e'; // Amarillo (Advertencia)
    return '#d9534f'; // Rojo (Peligro)
  };

  const barColor = getColorForScore(score);

  return (
    <div className="progressBarContainer">
      {/* La etiqueta no cambia */}
      <label className="progressBarLabel">{label}</label>
      
      {/* 2. Contenedor para alinear la barra y el porcentaje */}
      <div className="progressBarWrapper">
        <div className="progressBarTrack">
          <div 
            className="progressBarFill"
            style={{ 
              width: `${score}%`,
              backgroundColor: barColor // 3. Color dinámico aplicado
            }}
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        {/* 4. Span para mostrar el porcentaje */}
        <span 
          className="progressBarPercentage" 
          style={{ color: barColor }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;