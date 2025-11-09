// En: src/views/ContainmentPlanViewer/TimelineCard.jsx
// --- ARCHIVO MODIFICADO ---

import React from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS }from '../../config/icons';
import './ContainmentPlanViewer.css'; // Usa el CSS principal de la vista

/**
 * La "Tarjetita" individual.
 */
const TimelineCard = ({ task, onOpenTaskDetails }) => {

  const handleOpen = () => {
    onOpenTaskDetails(task); // Pasamos la tarea completa
  };

  const hasComment = task.log && task.log.length > 0;
  const hasEvidence = task.evidencePhoto;

  return (
    <div 
      className={`timeline-card ${task.status}`} // 'pending', 'in_progress', 'completed'
      onClick={handleOpen}
      title="Haz clic para ver detalles y actualizar la tarea"
    >
      <p className="card-text">{task.text}</p>
      
      <div className="card-status-icons">
        {/* Muestra icono si hay comentario */}
        {hasComment && <Icon path={ICONS.comment} size={16} title="Tiene comentarios" />}
        
        {/* Muestra icono si hay foto */}
        {hasEvidence && <Icon path={ICONS.clip} size={16} title="Tiene evidencia" />}
        
        {/* Icono del estado actual */}
        {task.status === 'in_progress' && <Icon path={ICONS.time} size={16} title="En progreso" />}
        {task.status === 'completed' && <Icon path={ICONS.shieldCheck} size={16} title="Completada" />}
      </div>
    </div>
  );
};

export default TimelineCard;