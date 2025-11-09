// En: src/views/ContainmentPlanViewer/Step.jsx
import React, { useMemo } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import TimelineCard from './TimelineCard'; // Importamos la tarjeta
import './PlanStepper.css'; // Usamos el mismo CSS

const Step = ({ step, status, isOpen, onToggle, onOpenTaskDetails }) => {

  const progress = useMemo(() => {
    const total = step.tasks.length;
    if (total === 0) return 100;
    const completed = step.tasks.filter(t => t.status === 'completed').length;
    return (completed / total) * 100;
  }, [step.tasks]);

  const completedCount = step.tasks.filter(t => t.status === 'completed').length;
  const totalCount = step.tasks.length;

  return (
    <div className={`step-item status-${status}`}>
      <div className="step-header" onClick={onToggle}>
        <div className="step-header-title">
          <h3 className="h3">{step.title}</h3>
          <span className="step-progress-text">
            {completedCount} / {totalCount} tareas completadas
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="step-progress-bar" title={`${Math.round(progress)}%`}>
            <div 
              className="step-progress-bar-inner"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className={`step-header-toggle ${isOpen ? 'open' : ''}`}>
            <Icon path={ICONS.chevronDown} size={24} />
          </div>
        </div>
      </div>
      
      <div className={`step-content ${isOpen ? 'open' : ''}`}>
        <div className="step-tasks-list">
          {step.tasks.map(task => (
            <TimelineCard
              key={task.id}
              task={task}
              onOpenTaskDetails={onOpenTaskDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step;