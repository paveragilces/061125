import React from 'react';
import BarChart from '../../components/ui/BarChart';
import EmptyState from '../../components/ui/EmptyState';
import { ICONS } from '../../config/icons';
// ¡CORREGIDO! Ahora 'TECHNICIAN_ACTIONS' existe en constants.js
import { TECHNICIAN_ACTIONS } from '../../data/constants'; 
import './ManagerDashboard.css';

/**
 * Dashboard del Gerente (con Gráfico de Barras)
 */
const ManagerDashboard = ({ alerts, visits, technicians, onNavigate }) => {
  const pendingAlerts = alerts.filter(a => a.status === 'pending').length;
  const pendingVisits = visits.filter(v => v.status === 'pending').length;

  const completedInspections = alerts.filter(a => a.status === 'completed' && a.inspectionData?.plant);
  
  // Esta lógica ahora funcionará
  const actionCounts = TECHNICIAN_ACTIONS.reduce((acc, action) => {
    acc[action] = completedInspections.filter(a =>
      a.inspectionData.plant.data.actions.includes(action)
    ).length;
    return acc;
  }, {});

  const chartData = TECHNICIAN_ACTIONS.map(action => ({
    label: action,
    value: actionCounts[action] || 0
  })).filter(d => d.value > 0);

  return (
    <>
      <div className="container">
        <h1 className="h1">Dashboard Gerente</h1>
        <div className="dashboardGrid">
          <div onClick={() => onNavigate('alertTriage')} className="card card-interactive">
            <h2 className="cardTitle">Alertas Pendientes</h2>
            <p className="cardNumericValue" style={{ color: pendingAlerts > 0 ? '#d9534f' : '#5cb85c' }}>
              {pendingAlerts}
            </p>
          </div>
          <div onClick={() => onNavigate('technicianControl')} className="card card-interactive">
            <h2 className="cardTitle">Técnicos Activos</h2>
            <p className="cardNumericValue">{technicians.length}</p>
          </div>
          <div onClick={() => onNavigate('visitorReport')} className="card card-interactive">
            <h2 className="cardTitle">Visitas Hoy (Total)</h2>
            <p className="cardNumericValue">
              {visits.filter(v => v.date === new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
          <div onClick={() => onNavigate('visitorReport', { filter: 'PENDING' })} className="card card-interactive">
            <h2 className="cardTitle">Visitas Pendientes Aprobación</h2>
            <p className="cardNumericValue" style={{ color: pendingVisits > 0 ? '#f0ad4e' : '#5cb85c' }}>
              {pendingVisits}
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="h2">Estado Actual de Acciones en Finca</h2>
        {chartData.length > 0 ? (
          <BarChart data={chartData} />
        ) : (
          <EmptyState
            iconPath={ICONS.action}
            title="Sin Acciones Registradas"
            message="Aún no se han completado inspecciones que registren acciones en finca."
          />
        )}
      </div>
    </>
  );
};

export default ManagerDashboard;