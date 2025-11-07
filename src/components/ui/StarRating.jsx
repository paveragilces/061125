import React from 'react';
import './StarRating.css';

/**
 * Componente de Icono SVG de Estrella (uso interno)
 */
const StarIcon = ({ filled, onClick }) => {
  return (
    <svg 
      onClick={onClick} 
      className="starIcon" 
      viewBox="0 0 24 24" 
      fill={filled ? '#ffc107' : '#e0e0e0'} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  );
};

/**
 * Componente de Calificación por Estrellas
 */
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="starRatingContainer">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= rating}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;