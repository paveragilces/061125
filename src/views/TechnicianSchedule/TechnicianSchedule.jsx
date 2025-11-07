import React from 'react';
import { ICONS } from '../../config/icons';
import './TechnicianSchedule.css';

/**
 * Agenda del Técnico (con Filtro Hoy/Próximas)
 */
const TechnicianSchedule = ({ technician, alerts, onNavigate }) => {
  const myAssignedAlerts = alerts.filter(a => a.techId === technician.id && a.status === 'assigned');
  const myCompletedAlerts = alerts.filter(a => a.techId === technician.id && a.status === 'completed');

  // Lógica de Filtro de Fecha
  const today = new Date().toISOString().split('T')[0];
  const todayAlerts = myAssignedAlerts.filter(a => a.visitDate === today);
  const upcomingAlerts = myAssignedAlerts.filter(a => a.visitDate !== today);

  const getPriorityTag = (priority) => {
    if (priority === 'Alta') return 'tag-high';
    if (priority === 'Media') return 'tag-medium';
    if (priority === 'Baja') return 'tag-low';
    return '';
  };

  const AlertItem = ({ alert, isCompleted = false }) => (
    <div 
      className="listItem" 
      style={{ 
        borderLeft: `5px solid ${alert.priority === 'Alta' ? '#d9534f' : (alert.priority === 'Media' ? '#f0ad4e' : '#5bc0de')}`, 
        opacity: isCompleted ? 0.7 : 1 
      }}
    >
      <div className="listItemContent" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
        <span className="farmName">{alert.farmName}</span>
        {!isCompleted && (
          <span className={`tag ${getPriorityTag(alert.priority)}`}>
            {alert.priority}
          </span>
        )}
        {isCompleted && (
          <span className="tag tag-completed">Completada</span>
        )}
        <p>Fecha Visita: <strong>{alert.visitDate}</strong></p>
        <p className="managerComment">Comentario Gerente: {alert.managerComment || 'N/A'}</p>
      </div>
      <div className="listItemActions">
        <button 
          className={`button ${isCompleted ? 'button-secondary' : 'btn-primary'}`}
          onClick={() => onNavigate('technicianInspection', alert)}
        >
          {isCompleted ? 'Ver Reporte' : 'Iniciar Inspección'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="h1">Mi Agenda ({technician.name})</h1>

      {/* SECCIÓN HOY */}
      <h2 className="h2 h2-today">Visitas de Hoy ({todayAlerts.length})</h2>
      {todayAlerts.length === 0 ? (
        <p>No tienes visitas programadas para hoy.</p>
      ) : (
        todayAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
      )}

      {/* SECCIÓN PRÓXIMAS */}
      <h2 className="h2" style={{ marginTop: '30px' }}>Próximas Visitas ({upcomingAlerts.length})</h2>
      {upcomingAlerts.length === 0 ? (
        <p>No tienes visitas próximas.</p>
      ) : (
        upcomingAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
      )}

      {/* SECCIÓN COMPLETADAS */}
      {myCompletedAlerts.length > 0 && (
        <>
          <h2 className="h2" style={{ marginTop: '30px' }}>Visitas Completadas</h2>
          {myCompletedAlerts.map(alert => <AlertItem key={alert.id} alert={alert} isCompleted={true} />)}
        </>
      )}
    </div>
  );
};

export default TechnicianSchedule;