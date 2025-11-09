// En: src/views/ContainmentPlanViewer/PlanStepper.jsx
import React, { useState, useMemo } from 'react';
import Step from './Step';
import './PlanStepper.css';

// Función para determinar el estado de un paso
const getStepStatus = (step, isFirstIncompleteStep) => {
  const totalTasks = step.tasks.length;
  if (totalTasks === 0) return 'completed'; // Un paso sin tareas se considera completo

  const completedTasks = step.tasks.filter(t => t.status === 'completed').length;
  
  if (completedTasks === totalTasks) {
    return 'completed';
  }
  if (isFirstIncompleteStep) {
    return 'active';
  }
  return 'pending';
};

const PlanStepper = ({ plan, onOpenTaskDetails }) => {
  // Encontrar el índice del primer paso que NO esté 100% completado
  const firstIncompleteStepIndex = useMemo(() => {
    return plan.steps.findIndex(step => {
      const total = step.tasks.length;
      const completed = step.tasks.filter(t => t.status === 'completed').length;
      return total > 0 && completed < total;
    });
  }, [plan.steps]);

  // El paso activo por defecto es el primero incompleto.
  // Si todos están completos, no hay paso activo (-1), y abrimos el primero por defecto.
  const defaultOpenStepIndex = firstIncompleteStepIndex === -1 ? 0 : firstIncompleteStepIndex;
  
  // Estado para controlar qué paso está expandido (abierto)
  const [openStepId, setOpenStepId] = useState(plan.steps[defaultOpenStepIndex]?.id);

  const handleToggleStep = (stepId) => {
    setOpenStepId(prevId => (prevId === stepId ? null : stepId));
  };

  return (
    <div className="stepper-container">
      {plan.steps.map((step, index) => {
        // Un paso es "el primero incompleto" si su índice coincide con el que encontramos
        const isFirstIncomplete = (firstIncompleteStepIndex === -1 && index === 0) || (firstIncompleteStepIndex === index);
        
        const status = getStepStatus(step, isFirstIncomplete);
        
        return (
          <Step
            key={step.id}
            step={step}
            status={status}
            isOpen={openStepId === step.id}
            onToggle={() => handleToggleStep(step.id)}
            onOpenTaskDetails={onOpenTaskDetails}
          />
        );
      })}
    </div>
  );
};

export default PlanStepper;