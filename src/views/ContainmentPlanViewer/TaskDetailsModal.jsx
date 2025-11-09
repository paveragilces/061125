// En: src/views/ContainmentPlanViewer/TaskDetailsModal.jsx
// --- ARCHIVO CORREGIDO DEFINITIVAMENTE ---

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
// Asumimos que tienes este componente de tu proyecto (lo vi en los archivos)
import FileUploadButton from '../../components/ui/FileUploadButton'; 
import './ContainmentPlanViewer.css'; 

const TaskDetailsModal = ({ task, onClose, onSaveTask }) => {
  const [status, setStatus] = useState(task.status);
  const [comment, setComment] = useState('');
  const [evidence, setEvidence] = useState(task.evidencePhoto);

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
           <p className="modal-task-text">
            {task.text}
          </p>

          <h3 className="h3">Estado de la Tarea</h3>
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

          <h3 className="h3" style={{ marginTop: '25px' }}>Bitácora y Evidencia</h3>
          <div className="formGroup">
            <label className="label" htmlFor="task-comment">Añadir Comentario (Opcional)</label>
            <textarea
              id="task-comment"
              className="textarea"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ej: Se instalaron 3 pediluvios con cal viva en los accesos de la Zona Roja."
            ></textarea>
          </div>

          <div className="formGroup">
            <label className="label">Adjuntar Foto de Evidencia (Opcional)</label>
            
            {/* --- AQUÍ ESTÁ LA CORRECCIÓN DE SINTAXIS --- */}
            {/* El '>' de la línea 84 del error se ha movido al final (línea 88) */}
            <FileUploadButton
              onUpload={handlePhotoUpload} 
              buttonText="Subir Foto"
              icon={ICONS.camera}
            />
            {/* ------------------------------------------ */}

            {evidence && (
              <div className="evidence-preview">
                <img src={evidence} alt="Evidencia" />
                <button onClick={() => setEvidence(null)} title="Quitar foto">
                  <Icon path={ICONS.close} size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Historial de Bitácora */}
          {task.log && task.log.length > 0 && (
            <div className="task-log-history">
              <h3 className="h3">Historial</h3>
              {task.log.map((entry, index) => (
                <div key={index} className="log-entry">
                  <span className="log-entry-meta">
                    <strong>{entry.user}</strong> - {new Date(entry.date).toLocaleString()}
                  </span>
                  <p className="log-entry-comment">{entry.comment}</p>
                </div>
              ))}
            </div>
          )}
          
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