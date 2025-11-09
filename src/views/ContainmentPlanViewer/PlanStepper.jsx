// En: src/views/ContainmentPlanViewer/PlanStepper.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Step from './Step';
import './PlanStepper.css';

// Función para determinar el estado de un paso
const getStepStatus = (step, isFirstIncompleteStep) => {
  const tasks = step.tasks || [];
  const totalTasks = tasks.length;
  if (totalTasks === 0) return 'completed';

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  
  if (completedTasks === totalTasks) {
    return 'completed';
  }
  if (isFirstIncompleteStep) {
    return 'active';
  }
  return 'pending';
};

const PlanStepper = ({ plan, onOpenTaskDetails }) => {
  const steps = plan.steps || [];

  const firstIncompleteStepIndex = useMemo(() => {
    return steps.findIndex((step) => {
      const tasks = step.tasks || [];
      const total = tasks.length;
      const completed = tasks.filter((task) => task.status === 'completed').length;
      return total > 0 && completed < total;
    });
  }, [steps]);

  // El paso activo por defecto es el primero incompleto.
  // Si todos están completos, no hay paso activo (-1), y abrimos el primero por defecto.
  const defaultOpenStepIndex = firstIncompleteStepIndex === -1 ? 0 : firstIncompleteStepIndex;
  
  // Estado para controlar qué paso está expandido (abierto)
  const [openStepId, setOpenStepId] = useState(steps[defaultOpenStepIndex]?.id);

  useEffect(() => {
    setOpenStepId(steps[defaultOpenStepIndex]?.id);
  }, [steps, defaultOpenStepIndex]);

  const handleToggleStep = (stepId) => {
    setOpenStepId((prevId) => (prevId === stepId ? null : stepId));
  };

  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const isFirstIncomplete =
          (firstIncompleteStepIndex === -1 && index === 0) || firstIncompleteStepIndex === index;

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