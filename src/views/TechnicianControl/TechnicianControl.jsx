import React from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './TechnicianControl.css';

/**
 * Vista de Control de Técnicos (Gerente)
 * ACTUALIZADO: Muestra especialidades y permite registrar nuevos técnicos.
 */
const TechnicianControl = ({ technicians, onNavigate, onShowRegisterModal }) => {
  return (
    <div className="container">
      <div className="controlHeader">
        <h1 className="h1">Control de Técnicos ({technicians.length})</h1>
        {/* --- ¡NUEVO BOTÓN! --- */}
        <button
          className="button btn-primary"
          onClick={onShowRegisterModal}
        >
          <Icon path={ICONS.technician} /> Registrar Nuevo Técnico
        </button>
      </div>

      <div className="technicianList">
        {technicians.map(tech => (
          <div 
            key={tech.id} 
            className="card card-interactive"
            onClick={() => onNavigate('technicianSchedule', tech)}
            title={`Clic para ver agenda de ${tech.name}`}
          >
            <div className="cardHeader">
              <span className="techAvatar">
                <Icon path={ICONS.technician} size={20} />
              </span>
              <div>
                <h2 className="techName">{tech.name}</h2>
                <span className="techZone">Zona: {tech.zone}</span>
              </div>
            </div>
            
            <div className="cardBody">
              <div className="techWorkload">
                <span className="workloadLabel">Carga de Trabajo</span>
                <span className="workloadValue">{tech.workload}</span>
                <span className="workloadLabel">alerta(s) asignada(s)</span>
              </div>
              
              {/* --- ¡NUEVA SECCIÓN DE HABILIDADES! --- */}
              <div className="specialtySection">
                <h3 className="specialtyTitle">Especialidades</h3>
                <div className="specialtyTags">
                  {tech.specialties?.length > 0 ? (
                    tech.specialties.map(skill => (
                      <span key={skill} className="tag tag-skill">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="tag tag-info">Sin especialidades registradas</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianControl;