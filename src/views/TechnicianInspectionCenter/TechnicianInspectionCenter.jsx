import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import InspectionStepper from '../../components/ui/InspectionStepper';
import { ICONS } from '../../config/icons';
import TechnicianModuleAudit from './TechnicianModuleAudit';
import TechnicianModuleDrone from './TechnicianModuleDrone';
import TechnicianModulePlant from './TechnicianModulePlant';
import './TechnicianInspectionCenter.css';

/**
 * Centro de Inspección (Técnico, con Stepper)
 */
const TechnicianInspectionCenter = ({ alert, onNavigate, onSaveInspection, setModal }) => {
  const [inspectionData, setInspectionData] = useState(
    alert.inspectionData || {
      audit: { status: 'Pendiente', ratings: {}, evidence: {} },
      drone: { status: 'Pendiente', data: { altitude: '', plan: 'libre', hectares: '', observations: '' } },
      plant: { status: 'Pendiente', data: { diagnosis: [], actions: [], incidence: 0, severity: 0, recommendations: '' } },
    }
  );

  const [currentModule, setCurrentModule] = useState(null); // 'audit', 'drone', 'plant'

  const handleSaveModule = (moduleKey, moduleData) => {
    const updatedData = {
      ...inspectionData,
      [moduleKey]: {
        ...inspectionData[moduleKey],
        ...moduleData,
        status: 'Completado',
      }
    };
    setInspectionData(updatedData);
    onSaveInspection(alert.id, updatedData);
    setCurrentModule(null);
    setModal({ show: true, message: `Módulo "${moduleKey}" guardado con éxito.`, type: 'success' });
  };

  const handleFinalizeInspection = () => {
    if (inspectionData.audit.status !== 'Completado' || inspectionData.plant.status !== 'Completado') {
      setModal({ show: true, message: 'Debe completar la "Auditoría de Bioseguridad" y la "Inspección de Planta" para finalizar.', type: 'error' });
      return;
    }
    onSaveInspection(alert.id, inspectionData, true); // true = finalizar
  };

  // ----- Vistas de Módulos -----

  // Vista 1: Centro de Inspección (Dashboard)
  if (!currentModule) {
    const getStatusTag = (status) => (
      status === 'Completado'
        ? <span className="tag tag-completed">Completado</span>
        : <span className="tag tag-pending">Pendiente</span>
    );

    return (
      <div className="container">
        <button
          className="button button-secondary"
          style={{ marginBottom: '20px' }}
          onClick={() => onNavigate('technicianSchedule')}
        >
          <Icon path={ICONS.back} /> Volver a la Agenda
        </button>

        <InspectionStepper currentModule={null} modules={inspectionData} />

        <h1 className="h1">Inspección: {alert.farmName}</h1>
        <h2 className="h2">Alerta #{alert.id} ({alert.visitDate})</h2>

        {/* Tarea 1: Auditoría */}
        <div className="listItem moduleItem">
          <div className="listItemContent">
            <Icon path={ICONS.audit} size={24} color="#005a3a" />
            <span className="moduleTitle">1. Auditoría de Bioseguridad</span>
          </div>
          <div className="listItemActions">
            {getStatusTag(inspectionData.audit.status)}
            <button className="button btn-primary" onClick={() => setCurrentModule('audit')}>
              {inspectionData.audit.status === 'Completado' ? 'Editar' : 'Iniciar'}
            </button>
          </div>
        </div>

        {/* Tarea 2: Vuelo Drone */}
        <div className="listItem moduleItem">
          <div className="listItemContent">
            <Icon path={ICONS.drone} size={24} color="#005a3a" />
            <span className="moduleTitle">2. Reporte de Vuelo Drone (Opcional)</span>
          </div>
          <div className="listItemActions">
            {getStatusTag(inspectionData.drone.status)}
            <button className="button btn-primary" onClick={() => setCurrentModule('drone')}>
              {inspectionData.drone.status === 'Completado' ? 'Editar' : 'Iniciar'}
            </button>
          </div>
        </div>

        {/* Tarea 3: Inspección Planta */}
        <div className="listItem moduleItem">
          <div className="listItemContent">
            <Icon path={ICONS.plant} size={24} color="#005a3a" />
            <span className="moduleTitle">3. Inspección de Planta (Diagnóstico)</span>
          </div>
          <div className="listItemActions">
            {getStatusTag(inspectionData.plant.status)}
            <button className="button btn-primary" onClick={() => setCurrentModule('plant')}>
              {inspectionData.plant.status === 'Completado' ? 'Editar' : 'Iniciar'}
            </button>
          </div>
        </div>

        {/* Botón de Finalizar */}
        <div className="finalizeContainer">
          <button
            className="button button-success finalizeButton"
            onClick={handleFinalizeInspection}
          >
            Finalizar y Enviar Inspección
          </button>
        </div>
      </div>
    );
  }

  // Vista 2: Renderizar módulo seleccionado
  return (
    <div className="container">
      <button
        className="button button-secondary"
        style={{ marginBottom: '20px' }}
        onClick={() => setCurrentModule(null)}
      >
        <Icon path={ICONS.back} /> Volver al Centro de Inspección
      </button>

      <InspectionStepper currentModule={currentModule} modules={inspectionData} />

      {currentModule === 'audit' && (
        <TechnicianModuleAudit
          initialData={inspectionData.audit}
          onSubmit={(data) => handleSaveModule('audit', data)}
          setModal={setModal}
        />
      )}

      {currentModule === 'drone' && (
        <TechnicianModuleDrone
          initialData={inspectionData.drone.data}
          onSubmit={(data) => handleSaveModule('drone', { data })}
        />
      )}

      {currentModule === 'plant' && (
        <TechnicianModulePlant
          alert={alert}
          initialData={inspectionData.plant.data}
          onSubmit={(data) => handleSaveModule('plant', { data })}
        />
      )}
    </div>
  );
};

export default TechnicianInspectionCenter;