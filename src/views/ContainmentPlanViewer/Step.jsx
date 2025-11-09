// En: src/views/ContainmentPlanViewer/Step.jsx
import React, { useMemo } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import TimelineCard from './TimelineCard';
import './PlanStepper.css';

const STEP_STATUS_META = {
  completed: { icon: ICONS.checkCircle, label: 'Etapa completada' },
  active: { icon: ICONS.time, label: 'Etapa en curso' },
  pending: { icon: ICONS.checkboxEmpty, label: 'Etapa pendiente' },
};

const Step = ({ step, status, isOpen, onToggle, onOpenTaskDetails }) => {
  const tasks = step.tasks || [];

  const progress = useMemo(() => {
    if (!tasks.length) {
      return 100;
    }
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return (completed / tasks.length) * 100;
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.status === 'completed').length;
  const totalCount = tasks.length;
  const statusMeta = STEP_STATUS_META[status];

  return (
    <div className={`step-item status-${status}`}>
      <button type="button" className="step-header" onClick={onToggle}>
        <div className="step-header-title">
          <div className="step-title-row">
            {statusMeta && (
              <span className={`step-status-chip tone-${status}`}>
                <Icon path={statusMeta.icon} size={16} />
                {statusMeta.label}
              </span>
            )}
            <h3 className="h3">{step.title}</h3>
          </div>
          <span className="step-progress-text">
            {completedCount} de {totalCount} tareas completadas
          </span>
        </div>

        <div className="step-header-actions">
          <div className="step-progress-bar" title={`${Math.round(progress)}%`}>
            <div className="step-progress-bar-inner" style={{ width: `${progress}%` }} />
          </div>

          <div className={`step-header-toggle ${isOpen ? 'open' : ''}`}>
            <Icon path={ICONS.chevronDown} size={22} />
          </div>
        </div>
      </button>

      <div className={`step-content ${isOpen ? 'open' : ''}`}>
        <div className="step-tasks-list">
          {tasks.map((task) => (
            <TimelineCard key={task.id} task={task} onOpenTaskDetails={onOpenTaskDetails} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step;