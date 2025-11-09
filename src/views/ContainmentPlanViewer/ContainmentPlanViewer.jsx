// En: src/views/ContainmentPlanViewer/ContainmentPlanViewer.jsx
// --- ARCHIVO MODIFICADO ---

import React, { useState, useMemo } from 'react';
// Importamos el Modal y el NUEVO Stepper
import TaskDetailsModal from './TaskDetailsModal'; 
import PlanStepper from './PlanStepper'; // <-- NUEVO
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ContainmentPlanViewer.css'; // CSS Principal (modificado)
import './PlanStepper.css'; // CSS del Stepper (nuevo)

/**
 * Vista principal que ahora usa el Stepper Vertical
 */
const ContainmentPlanViewer = ({ producer, plans, fincas, onUpdatePlanTask, onNavigate }) => {
  
  const producerPlans = useMemo(() => {
    return plans.filter(p => p.producerId === producer.id);
  }, [plans, producer.id]);

  const [selectedPlanId, setSelectedPlanId] = useState(producerPlans[0]?.id || null);
  
  const [editingTask, setEditingTask] = useState(null); 

  const selectedPlan = useMemo(() => {
    return plans.find(p => p.id === selectedPlanId);
  }, [plans, selectedPlanId]);

  const getFincaName = (fincaId) => {
    const finca = fincas.find(f => f.id === fincaId);
    return finca ? finca.name : 'Finca desconocida';
  };

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
      <div className="container">
        <h1 className="h1">Planes de Contención</h1>
        <div className="emptyState">
          <Icon path={ICONS.shieldCheck} size={60} color="#ccc" />
          <h2>Todo en Orden</h2>
          <p>No tienes planes de contención activos en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* --- MODAL DE DETALLE DE TAREA (Sin cambios en su lógica) --- */}
      {editingTask && (
        <TaskDetailsModal
          task={editingTask}
          onClose={handleCloseModal}
          onSaveTask={handleSaveTask}
        />
      )}

      {/* --- Encabezado con selector (Sin cambios) --- */}
      <div className="plan-viewer-header">
        <h1 className="h1">Planes de Contención</h1>
        <div className="formGroup">
          <label className="label" htmlFor="plan-selector">Seleccionar Plan</label>
          <select
            id="plan-selector"
            className="select"
            value={selectedPlanId || ''}
            onChange={(e) => setSelectedPlanId(e.target.value)}
          >
            {producerPlans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.diseaseName} - {getFincaName(plan.fincaId)} (Lote: {plan.lote})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- RENDERIZADO DEL PLAN (MODIFICADO) --- */}
      {selectedPlan && (
        <div className="plan-details">
          <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '900px', margin: '0 auto 20px auto' }}>
            Plan: {selectedPlan.diseaseName}
            {selectedPlan.status === 'completed' ? (
              <span className="tag tag-completed">Completado</span>
            ) : (
              <span className="tag tag-pending" style={{backgroundColor: '#EBF8FF', color: '#3182CE'}}>En Progreso</span>
            )}
          </h2>
          <p className="plan-description">{selectedPlan.description}</p>
          
          {/* --- AQUÍ REEMPLAZAMOS EL KANBAN POR EL STEPPER --- */}
          <PlanStepper
            plan={selectedPlan}
            onOpenTaskDetails={handleOpenTaskDetails}
          />
          
        </div>
      )}
    </div>
  );
};

export default ContainmentPlanViewer;