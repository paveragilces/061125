// En: src/views/ContainmentPlanViewer/ContainmentPlanViewer.jsx
// --- ARCHIVO MODIFICADO ---

import React, { useMemo, useState, useEffect } from 'react';
import TaskDetailsModal from './TaskDetailsModal';
import PlanStepper from './PlanStepper';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ContainmentPlanViewer.css';
import './PlanStepper.css';

const getStatusToken = (status) => {
  if (status === 'completed') {
    return { label: 'Plan completado', tone: 'success', icon: ICONS.checkCircle };
  }
  if (status === 'active') {
    return { label: 'Plan en curso', tone: 'info', icon: ICONS.time };
  }
  return { label: 'Plan pendiente', tone: 'neutral', icon: ICONS.checkboxEmpty };
};

const ContainmentPlanViewer = ({ producer, plans, fincas, onUpdatePlanTask, onNavigate }) => {
  const producerPlans = useMemo(
    () => plans.filter((plan) => plan.producerId === producer.id),
    [plans, producer.id]
  );

  const [selectedPlanId, setSelectedPlanId] = useState(producerPlans[0]?.id || '');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (!producerPlans.length) {
      setSelectedPlanId('');
      return;
    }

    const exists = producerPlans.some((plan) => plan.id === selectedPlanId);
    if (!exists) {
      setSelectedPlanId(producerPlans[0].id);
    }
  }, [producerPlans, selectedPlanId]);

  const selectedPlan = useMemo(
    () => producerPlans.find((plan) => plan.id === selectedPlanId) || null,
    [producerPlans, selectedPlanId]
  );

  const getFincaName = (fincaId) => {
    const finca = fincas.find((item) => item.id === fincaId);
    return finca ? finca.name : 'Finca desconocida';
  };

  const planAnalytics = useMemo(() => {
    if (!selectedPlan) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        completionPercent: 0,
        nextTask: null,
        latestUpdate: null,
      };
    }

    const steps = selectedPlan.steps || [];
    const allTasks = steps.flatMap((step) => step.tasks || []);
    const withStepContext = steps.flatMap((step) =>
      (step.tasks || []).map((task) => ({ ...task, stepTitle: step.title }))
    );

    const completedTasks = allTasks.filter((task) => task.status === 'completed').length;
    const inProgressTasks = allTasks.filter((task) => task.status === 'in_progress').length;
    const pendingTasks = allTasks.filter((task) => task.status === 'pending').length;
    const totalTasks = allTasks.length;
    const completionPercent = totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);

    const nextTask =
      withStepContext.find((task) => task.status === 'in_progress') ||
      withStepContext.find((task) => task.status === 'pending') ||
      null;

    const logs = withStepContext.flatMap((task) =>
      (task.log || []).map((entry) => ({
        ...entry,
        taskId: task.id,
        taskText: task.text,
        stepTitle: task.stepTitle,
      }))
    );

    const latestUpdate = logs
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionPercent,
      nextTask,
      latestUpdate,
    };
  }, [selectedPlan]);

  const recentUpdates = useMemo(() => {
    if (!selectedPlan) {
      return [];
    }

    return selectedPlan.steps
      .flatMap((step) =>
        (step.tasks || []).flatMap((task) =>
          (task.log || []).map((entry) => ({
            ...entry,
            taskId: task.id,
            taskText: task.text,
            stepTitle: step.title,
          }))
        )
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [selectedPlan]);

  const handleOpenTaskDetails = (task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleSaveTask = (taskId, updates) => {
    if (selectedPlanId) {
      onUpdatePlanTask(selectedPlanId, taskId, updates);
    }
  };

  if (producerPlans.length === 0) {
    return (
      <div className="containment-plan-page">
        <div className="containment-plan-hero empty">
          <div className="hero-heading">
            <div className="hero-icon">
              <Icon path={ICONS.shieldCheck} size={32} />
            </div>
            <div>
              <h1 className="h1">Planes de Contención</h1>
              <p className="hero-subtitle">Por ahora no tienes protocolos activos. Te avisaremos si se genera uno nuevo.</p>
            </div>
          </div>
        </div>
        <div className="emptyState modern">
          <Icon path={ICONS.checkCircle} size={60} />
          <h2>Todo en orden</h2>
          <p>No registramos planes de contención para tus fincas. Sigue monitoreando tus alertas para mantenerte preparado.</p>
        </div>
      </div>
    );
  }

  const statusToken = getStatusToken(selectedPlan?.status);

  const formatDate = (iso) => {
    if (!iso) return 'Sin registro';
    const date = new Date(iso);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="containment-plan-page">
      {editingTask && (
        <TaskDetailsModal task={editingTask} onClose={handleCloseModal} onSaveTask={handleSaveTask} />
      )}

      <section className="containment-plan-hero">
        <div className="hero-top-bar">
          <div className="hero-top-left">
            {onNavigate && (
              <button
                type="button"
                className="hero-back-button"
                onClick={() => onNavigate('producerDashboard')}
              >
                <Icon path={ICONS.back} size={18} />
                Volver al panel
              </button>
            )}
          </div>
          {statusToken && (
            <span className={`hero-status-pill tone-${statusToken.tone}`}>
              <Icon path={statusToken.icon} size={16} />
              {statusToken.label}
            </span>
          )}
        </div>

        <div className="hero-heading">
          <div className="hero-icon">
            <Icon path={ICONS.shieldCheck} size={32} />
          </div>
          <div>
            <h1 className="h1">Planes de Contención</h1>
            <p className="hero-subtitle">
              Seguimiento integral a los protocolos de bioseguridad y contención activos para tus fincas.
            </p>
            <div className="hero-meta">
              <span className="meta-chip">
                <Icon path={ICONS.user} size={16} />
                {producer.owner}
              </span>
              {selectedPlan && (
                <span className="meta-chip">
                  <Icon path={ICONS.location} size={16} />
                  {getFincaName(selectedPlan.fincaId)}
                </span>
              )}
              {selectedPlan && (
                <span className="meta-chip">
                  <Icon path={ICONS.disease} size={16} />
                  {selectedPlan.diseaseName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="plan-selector">
          <label className="label" htmlFor="plan-selector">Seleccionar plan</label>
          <div className="selector-field">
            <Icon path={ICONS.menu} size={18} />
            <select
              id="plan-selector"
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
            >
              {producerPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.diseaseName} · {getFincaName(plan.fincaId)} · {plan.lote}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPlan && (
          <div className="plan-stats-grid">
            <article className="stat-card">
              <header>
                <Icon path={ICONS.tasks} size={20} />
                <span>Avance del plan</span>
              </header>
              <strong>{planAnalytics.completionPercent}%</strong>
              <p>
                {planAnalytics.completedTasks} de {planAnalytics.totalTasks} tareas completadas
              </p>
              <div className="progress-bar">
                <div style={{ width: `${planAnalytics.completionPercent}%` }} />
              </div>
            </article>
            <article className="stat-card">
              <header>
                <Icon path={ICONS.time} size={20} />
                <span>Tareas en seguimiento</span>
              </header>
              <strong>{planAnalytics.inProgressTasks}</strong>
              <p>{planAnalytics.pendingTasks} pendientes por iniciar</p>
            </article>
            <article className="stat-card">
              <header>
                <Icon path={ICONS.calendar} size={20} />
                <span>Creado</span>
              </header>
              <strong>{formatDate(selectedPlan.createdAt)}</strong>
              <p>Última actualización {formatDate(planAnalytics.latestUpdate?.date)}</p>
            </article>
            <article className="stat-card highlight">
              <header>
                <Icon path={ICONS.action} size={20} />
                <span>Próxima acción</span>
              </header>
              {planAnalytics.nextTask ? (
                <>
                  <strong>{planAnalytics.nextTask.text}</strong>
                  <p>{planAnalytics.nextTask.stepTitle}</p>
                </>
              ) : (
                <>
                  <strong>Plan al día</strong>
                  <p>No hay acciones pendientes</p>
                </>
              )}
            </article>
          </div>
        )}
      </section>

      {selectedPlan && (
        <div className="plan-content-grid">
          <div>
            <div className="plan-overview-card">
              <div className="plan-overview-header">
                <div>
                  <h2 className="h2">Itinerario del plan</h2>
                  <p>{selectedPlan.description}</p>
                </div>
              </div>
              <PlanStepper plan={selectedPlan} onOpenTaskDetails={handleOpenTaskDetails} />
            </div>
          </div>
          <aside className="plan-side-panel">
            <div className="side-card">
              <header>
                <Icon path={ICONS.info} size={18} />
                <span>Resumen del plan</span>
              </header>
              <ul>
                <li>
                  <Icon path={ICONS.location} size={16} />
                  {getFincaName(selectedPlan.fincaId)} · {selectedPlan.lote}
                </li>
                <li>
                  <Icon path={ICONS.disease} size={16} />
                  {selectedPlan.diseaseName}
                </li>
                <li>
                  <Icon path={ICONS.tasks} size={16} />
                  {planAnalytics.totalTasks} tareas · {(selectedPlan.steps || []).length} etapas
                </li>
              </ul>
            </div>

            <div className="side-card next-action">
              <header>
                <Icon path={ICONS.action} size={18} />
                <span>Siguiente paso sugerido</span>
              </header>
              {planAnalytics.nextTask ? (
                <>
                  <h3>{planAnalytics.nextTask.text}</h3>
                  <p>{planAnalytics.nextTask.stepTitle}</p>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleOpenTaskDetails(planAnalytics.nextTask)}
                  >
                    Actualizar tarea
                  </button>
                </>
              ) : (
                <p className="empty">Todas las tareas están finalizadas.</p>
              )}
            </div>

            <div className="side-card timeline">
              <header>
                <Icon path={ICONS.comment} size={18} />
                <span>Últimos movimientos</span>
              </header>
              {recentUpdates.length === 0 ? (
                <p className="empty">Aún no registras novedades dentro del plan.</p>
              ) : (
                <ul>
                  {recentUpdates.map((entry) => (
                    <li key={`${entry.taskId}-${entry.date}`}>
                      <span className="timeline-date">{formatDate(entry.date)}</span>
                      <p>
                        <strong>{entry.user}</strong> registró actividad en
                        {' '}
                        <em>{entry.stepTitle}</em>:
                        {' '}
                        <span>“{entry.comment}”</span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ContainmentPlanViewer;