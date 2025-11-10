// En: src/views/ContainmentPlanViewer/TaskDetailsModal.jsx
// --- ARCHIVO CORREGIDO DEFINITIVAMENTE ---

import React, { useState, useMemo } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
// Asumimos que tienes este componente de tu proyecto (lo vi en los archivos)
import FileUploadButton from '../../components/ui/FileUploadButton';
import './ContainmentPlanViewer.css';

const STATUS_META = {
  pending: { label: 'Pendiente', tone: 'pending', icon: ICONS.checkboxEmpty },
  in_progress: { label: 'En progreso', tone: 'in-progress', icon: ICONS.time },
  completed: { label: 'Completada', tone: 'completed', icon: ICONS.checkboxChecked },
};

const TaskDetailsModal = ({ task, onClose, onSaveTask }) => {
  const [status, setStatus] = useState(task.status);
  const [comment, setComment] = useState('');
  const [evidence, setEvidence] = useState(task.evidencePhoto);

  const statusMeta = useMemo(() => STATUS_META[status] || STATUS_META.pending, [status]);

  const handleSave = () => {
    onSaveTask(task.id, {
      status,
      comment: comment.trim() || null,
      evidencePhoto: evidence,
      completedAt: (status === 'completed' && !task.completedAt) ? new Date().toISOString() : task.completedAt,
    });
    onClose();
  };

  const handlePhotoUpload = (fileData) => {
    setEvidence(fileData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="h2" style={{ marginTop: 0 }}>Detalle de Tarea</h2>
          <button onClick={onClose} className="modal-close-button">
            <Icon path={ICONS.close} />
          </button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <header className="modal-section-header">
              <span className={`modal-status-chip tone-${statusMeta.tone}`}>
                <Icon path={statusMeta.icon} size={16} />
                {statusMeta.label}
              </span>
            </header>
            <p className="modal-task-text">{task.text}</p>
          </section>

          <section className="modal-section">
            <header className="modal-section-header">
              <h3 className="h3">Actualizar estado</h3>
              <span className="modal-section-subtitle">Selecciona el estado que refleja tu avance.</span>
            </header>
            <div className="status-button-group">
              <button
                className={`button-status ${status === 'pending' ? 'active-pending' : ''}`}
                onClick={() => setStatus('pending')}
              >
                <Icon path={ICONS.checkboxEmpty} /> Pendiente
              </button>
              <button
                className={`button-status ${status === 'in_progress' ? 'active-progress' : ''}`}
                onClick={() => setStatus('in_progress')}
              >
                <Icon path={ICONS.time} /> En Progreso
              </button>
              <button
                className={`button-status ${status === 'completed' ? 'active-completed' : ''}`}
                onClick={() => setStatus('completed')}
              >
                <Icon path={ICONS.checkboxChecked} /> Completado
              </button>
            </div>
          </section>

          <section className="modal-section modal-section-split">
            <div className="formGroup">
              <label className="label" htmlFor="task-comment">Añadir comentario</label>
              <textarea
                id="task-comment"
                className="textarea"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ej: Se instalaron 3 pediluvios con cal viva en los accesos de la Zona Roja."
              ></textarea>
            </div>

            <div className="formGroup">
              <label className="label">Adjuntar evidencia</label>
              <FileUploadButton
                onUpload={handlePhotoUpload}
                buttonText={evidence ? 'Reemplazar foto' : 'Subir foto'}
                icon={ICONS.camera}
              />

              {evidence && (
                <div className="evidence-preview">
                  <img src={evidence} alt="Evidencia" />
                  <button onClick={() => setEvidence(null)} title="Quitar foto">
                    <Icon path={ICONS.close} size={14} />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Historial de Bitácora */}
          <section className="modal-section">
            <header className="modal-section-header">
              <h3 className="h3">Bitácora</h3>
              <span className="modal-section-subtitle">
                {task.log && task.log.length > 0
                  ? 'Revisa los últimos registros capturados en campo.'
                  : 'Aún no hay registros; ¡este es un buen momento para empezar!'}
              </span>
            </header>

            {task.log && task.log.length > 0 ? (
              <div className="task-log-history">
                {task.log.map((entry, index) => (
                  <div key={index} className="log-entry">
                    <span className="log-entry-meta">
                      <strong>{entry.user}</strong> · {new Date(entry.date).toLocaleString('es-ES')}
                    </span>
                    <p className="log-entry-comment">{entry.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="log-empty">Sin registros aún.</p>
            )}
          </section>
        </div>

        <div className="modal-footer">
          <button className="button button-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="button btn-primary" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;