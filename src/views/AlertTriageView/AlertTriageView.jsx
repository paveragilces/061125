import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import { ICONS } from '../../config/icons';
import { ALERT_SYMPTOMS_DATA } from '../../data/constants';
import './AlertTriageView.css';

/**
 * Triaje de Alertas (Gerente)
 * ACTUALIZADO: Muestra especialidades en el dropdown de técnico.
 */
const AlertTriageView = ({ alerts, technicians, onAssignAlert, setModal, pageData }) => {
  const [filterStatus, setFilterStatus] = useState(pageData?.filter || 'pending');
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Estado para el formulario de asignación
  const [assignComment, setAssignComment] = useState('');
  const [assignDiseases, setAssignDiseases] = useState([]);
  const [assignTechId, setAssignTechId] = useState(technicians[0]?.id || '');
  const [assignDate, setAssignDate] = useState('');
  const [assignPriority, setAssignPriority] = useState('Media');

  const filteredAlerts = alerts.filter(a => a.status === filterStatus);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    // Resetea el formulario
    setAssignComment(alert.managerComment || '');
    setAssignDiseases(alert.possibleDisease || []);
    setAssignTechId(alert.techId || technicians[0]?.id || '');
    setAssignDate(alert.visitDate || new Date().toISOString().split('T')[0]);
    setAssignPriority(alert.priority || 'Media');
  };

  const handleToggleDisease = (disease) => {
    setAssignDiseases(prev =>
      prev.includes(disease) ? prev.filter(d => d !== disease) : [...prev, disease]
    );
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!assignTechId || !assignDate || !assignPriority) {
      setModal({ show: true, message: 'Por favor, seleccione un técnico, fecha y prioridad.', type: 'error' });
      return;
    }
    onAssignAlert(
      selectedAlert.id,
      assignComment,
      assignDiseases,
      assignTechId,
      assignDate,
      assignPriority
    );
    setSelectedAlert(null); // Cierra el formulario
  };

  const possibleDiseases = [
    'Sigatoka Negra', 'Moko (Ralstonia)', 'Pudrición de la Corona', 'Nemátodos', 'Picudo Negro', 'Erwinia', 'Deficiencia Nutricional'
  ];

  return (
    <div className="container">
      {selectedAlert ? (
        // --- FORMULARIO DE TRIAGE (ASIGNACIÓN) ---
        <div>
          <button className="button button-secondary" onClick={() => setSelectedAlert(null)}>
            <Icon path={ICONS.back} /> Volver a la Lista
          </button>
          <h1 className="h1">Asignar Alerta #{selectedAlert.id}</h1>
          <p className="alertFarmInfo">
            <strong>Finca:</strong> {selectedAlert.farmName} (Lote: {selectedAlert.lote})
          </p>
          
          <form onSubmit={handleSubmitAssignment}>
            <div className="formSection">
              <h2 className="h2">1. Detalles de la Alerta</h2>
              <p><strong>Reportada:</strong> {selectedAlert.date}</p>
              <p><strong>Síntomas Reportados:</strong> {selectedAlert.symptoms.join(', ')}</p>
              {/* Aquí irían las fotos y ubicación */}
            </div>

            <div className="formSection">
              <h2 className="h2">2. Evaluación del Gerente</h2>
              <div className="formGroup">
                <label className="label" htmlFor="comment">Comentario Interno / Instrucciones</label>
                <textarea
                  id="comment"
                  className="textarea"
                  rows="3"
                  placeholder="Ej: Revisar el lote 4 también, parece haber síntomas similares..."
                  value={assignComment}
                  onChange={(e) => setAssignComment(e.target.value)}
                ></textarea>
              </div>
              <div className="formGroup">
                <label className="label">Posible(s) Enfermedad(es)</label>
                <div className="buttonToggleGroup">
                  {possibleDiseases.map(disease => (
                    <button
                      type="button"
                      key={disease}
                      onClick={() => handleToggleDisease(disease)}
                      className={`button ${assignDiseases.includes(disease) ? 'btn-primary' : 'button-secondary'}`}
                    >
                      {disease} {assignDiseases.includes(disease) ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="formSection">
              <h2 className="h2">3. Asignación de Técnico</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label className="label" htmlFor="techId">Técnico</label>
                  {/* --- ¡SELECT ACTUALIZADO! --- */}
                  <select
                    id="techId"
                    className="select"
                    value={assignTechId}
                    onChange={(e) => setAssignTechId(e.target.value)}
                  >
                    {technicians.map(tech => {
                      const skills = tech.specialties?.length 
                        ? `Esp: ${tech.specialties.slice(0, 2).join(', ')}` 
                        : 'Sin especialidad';
                      return (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} ({tech.zone}) - {skills}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label" htmlFor="visitDate">Fecha de Visita</label>
                  <input
                    type="date"
                    id="visitDate"
                    className="input"
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                  />
                </div>
                <div className="formGroup">
                  <label className="label" htmlFor="priority">Prioridad</label>
                  <select
                    id="priority"
                    className="select"
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>
            </div>
            
            <hr className="formDivider" />
            <button type="submit" className="button btn-primary">
              Guardar Asignación
            </button>
          </form>
        </div>
      ) : (
        // --- LISTA DE ALERTAS (PENDIENTES, ASIGNADAS, ETC.) ---
        <div>
          <h1 className="h1">Triaje de Alertas</h1>
          <div className="tabContainer">
            <button
              className={`tabButton ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}>
              Pendientes ({alerts.filter(a => a.status === 'pending').length})
            </button>
            <button
              className={`tabButton ${filterStatus === 'assigned' ? 'active' : ''}`}
              onClick={() => setFilterStatus('assigned')}>
              Asignadas ({alerts.filter(a => a.status === 'assigned').length})
            </button>
            <button
              className={`tabButton ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}>
              Completadas ({alerts.filter(a => a.status === 'completed').length})
            </button>
          </div>
          
          {filteredAlerts.length === 0 ? (
            <EmptyState
              iconPath={ICONS.checkCircle}
              title={`No hay alertas ${filterStatus}`}
              message="Todo el trabajo está al día."
            />
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="listItem alertItem"
                onClick={() => handleSelectAlert(alert)}
                title="Clic para asignar o ver detalles"
              >
                <div className="listItemContent">
                  <Icon path={ICONS.alert} size={24} color={alert.priority === 'Alta' ? '#d9534f' : '#f0ad4e'} />
                  <div className="alertInfo">
                    <span className="alertFarmName">{alert.farmName} (Lote: {alert.lote})</span>
                    <span className="alertDate">Reportada: {alert.date}</span>
                    <p className="alertSymptoms">{alert.symptoms.join(', ')}</p>
                  </div>
                </div>
                <div className="listItemActions">
                  <button className="button button-secondary">
                    {filterStatus === 'pending' ? 'Asignar' : 'Ver Detalles'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AlertTriageView;