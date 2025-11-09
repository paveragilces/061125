// En: src/views/ContainmentPlanViewer/TimelineCard.jsx
// --- ARCHIVO MODIFICADO ---

import React from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ContainmentPlanViewer.css';

const TASK_STATUS_META = {
  pending: { icon: ICONS.checkboxEmpty, label: 'Pendiente', tone: 'pending' },
  in_progress: { icon: ICONS.time, label: 'En progreso', tone: 'in-progress' },
  completed: { icon: ICONS.checkCircle, label: 'Completada', tone: 'completed' },
};

const TimelineCard = ({ task, onOpenTaskDetails }) => {
  const handleOpen = () => {
    onOpenTaskDetails(task);
  };

  const hasComment = Boolean(task.log && task.log.length);
  const hasEvidence = Boolean(task.evidencePhoto);
  const latestLog = task.log && task.log.length ? task.log[task.log.length - 1] : null;
  const statusMeta = TASK_STATUS_META[task.status] || TASK_STATUS_META.pending;

  return (
    <button
      type="button"
      className={`timeline-card ${task.status}`}
      onClick={handleOpen}
      title="Haz clic para ver detalles y actualizar la tarea"
    >
      <div className="timeline-card-header">
        <span className={`timeline-task-status tone-${statusMeta.tone}`}>
          <Icon path={statusMeta.icon} size={14} />
          {statusMeta.label}
        </span>
        <div className="timeline-card-flags">
          {hasComment && (
            <span title="Tiene comentarios" aria-label="Tiene comentarios">
              <Icon path={ICONS.comment} size={15} />
            </span>
          )}
          {hasEvidence && (
            <span title="Incluye evidencia" aria-label="Incluye evidencia">
              <Icon path={ICONS.evidence} size={15} />
            </span>
          )}
        </div>
      </div>

      <p className="card-text">{task.text}</p>

      <div className="timeline-card-footer">
        {latestLog ? (
          <span className="timeline-note">
            Último registro por <strong>{latestLog.user}</strong>
          </span>
        ) : (
          <span className="timeline-note muted">Sin actualizaciones registradas</span>
        )}
        <span className="timeline-open-label">
          Ver detalle
          <Icon path={ICONS.chevronDown} size={14} />
        </span>
      </div>
    </button>
  );
};

export default TimelineCard;