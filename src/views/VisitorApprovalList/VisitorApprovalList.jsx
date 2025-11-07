// En: src/views/VisitorApprovalList/VisitorApprovalList.jsx
// --- ARCHIVO COMPLETO CON LA CORRECCIÓN DE 'calculateRisk' ---

import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import { calculateRisk } from '../../utils/riskCalculator';
import Table from '../../components/ui/Table/Table'; 
import RiskTag from '../../components/ui/RiskTag/RiskTag'; 
import './VisitorApprovalList.css'; 

/**
 * Aprobación de Visitas (Productor) - REDISEÑADO
 */
const VisitorApprovalList = ({ producer, visits, onApproveVisit, onRejectVisit, pageData }) => {
  
  const pendingVisits = visits.filter(v => 
    v.producerId === producer.id && v.status === 'PENDING'
  );

  // --- DEFINICIÓN DE TABLA (CON COLUMNA "FINCA" AÑADIDA) ---
  const tableHeaders = [
    { label: 'Nombre' },
    { label: 'Finca' }, // <-- Columna re-añadida
    { label: 'Compañía' },
    { label: 'Motivo' },
    { label: 'Cadena de Valor' },
    { label: 'Riesgo Potencial', className: 'text-center' },
    { label: 'Acción', className: 'text-center' },
  ];

  // --- FUNCIÓN renderRow (CORREGIDA) ---
  const renderVisitRow = (req) => {
    
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // 1. Nos aseguramos de que los valores sean strings vacíos en lugar de null/undefined
    const safeCompany = req.company || '';
    const safePurpose = req.purpose || '';
    const safeValueChain = req.valueChain || '';

    // 2. Llamamos a calculateRisk con los valores seguros
    const potentialRisk = calculateRisk(safeCompany, safePurpose, safeValueChain);
    // --- FIN DE LA CORRECCIÓN ---

    // 3. Buscamos la finca (mejora anterior)
    const finca = producer.fincas.find(f => f.id === req.fincaId);

    return (
      <>
        <td>{req.name} ({req.idNumber})</td>
        <td>{finca ? finca.name : <span style={{color: '#888'}}>N/A</span>}</td>
        <td>{req.company}</td>
        <td>{req.purpose}</td>
        <td>{req.valueChain}</td>
        <td className="text-center">
          <RiskTag riskLevel={potentialRisk} />
        </td>
        <td className="text-center actionCell">
          <button
            onClick={() => onApproveVisit(req.id, potentialRisk)}
            className="button icon approveButton"
            title="Aprobar y generar código QR"
          >
            <Icon path={ICONS.approve} size={20} />
          </button>
          <button
            onClick={() => onRejectVisit(req.id)}
            className="button icon rejectButton"
            title="Rechazar la solicitud"
          >
            <Icon path={ICONS.reject} size={16} />
          </button>
        </td>
      </>
    );
  };

  return (
    <div className="container">
      <h1 className="h1">Aprobación de Visitas ({pendingVisits.length})</h1>
      {pendingVisits.length === 0 ? (
        <EmptyState
          iconPath={ICONS.visit}
          title="No hay Visitas Pendientes"
          message="No tienes solicitudes de visitantes por aprobar."
        />
      ) : (
        <Table
          headers={tableHeaders}
          data={pendingVisits}
          renderRow={renderVisitRow}
          emptyMessage="No hay visitas pendientes."
        />
      )}
    </div>
  );
};

export default VisitorApprovalList;