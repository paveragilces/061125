// En: src/components/ui/InspectionStepper.jsx
// --- ARCHIVO COMPLETO Y CORREGIDO PARA SER REUTILIZABLE ---

import React from 'react';
import Icon from './Icon';
import { ICONS } from '../../config/icons';
import './InspectionStepper.css';

// --- CAMBIO 1: Estos son ahora los pasos "por defecto" (para el Técnico) ---
const defaultSteps = [
  { id: 'audit', name: 'Auditoría', icon: ICONS.audit },
  { id: 'drone', name: 'Vuelo Drone', icon: ICONS.drone },
  { id: 'plant', name: 'Diagnóstico', icon: ICONS.plant }
];

/**
 * Stepper de Inspección
 * AHORA ACEPTA la prop 'steps' para hacerlo reutilizable.
 */
const InspectionStepper = ({ 
  currentModule, 
  modules, 
  steps: customSteps // <-- CAMBIO 2: Aceptamos una prop 'steps'
}) => {
  
  // --- CAMBIO 3: Usamos los 'steps' personalizados o los de por defecto ---
  const steps = customSteps || defaultSteps;

  const getStepStatus = (step, index) => {
    const moduleStatus = modules[step.id]?.status;
    const isCurrent = step.id === currentModule || (currentModule === null && index === 0);

    if (moduleStatus === 'Completado') {
      return 'completed';
    }
    if (isCurrent) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="stepperContainer">
      {steps.map((step, index) => {
        const status = getStepStatus(step, index);
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';

        return (
          <React.Fragment key={step.id}>
            {index > 0 && <div className={`stepperLine ${isCompleted ? 'completed' : ''}`}></div>}
            <div className={`stepperStep ${status}`}>
              <div className="stepIconContainer">
                {(isCompleted && !isCurrent) ? <Icon path={ICONS.checkCircle} /> : <Icon path={step.icon} />}
              </div>
              <span className="stepName">{step.name}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default InspectionStepper;