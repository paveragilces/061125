// src/views/ProducerVisitorLog/ProducerVisitorLog.jsx
// --- TU CÓDIGO ORIGINAL RESTAURADO ---

import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table/Table';
// ¡REMOVIMOS 'Button' de esta importación, ya que no lo usamos para los filtros!
import Icon from '../../components/ui/Icon';
import RiskTag from '../../components/ui/RiskTag/RiskTag';
import { ICONS } from '../../config/icons';
import { VISIT_PURPOSES } from '../../data/constants';
import './ProducerVisitorLog.css';

// Importamos el componente Button por separado para usarlo en la tabla
import Button from '../../components/ui/Button';


const ProducerVisitorLog = ({ producerLog, onGeneratePDF, producer }) => {
  const [filteredLog, setFilteredLog] = useState(producerLog);
  
  // --- Estados de Filtro ---
  const [fincaFilter, setFincaFilter] = useState('Todos');
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [purposeFilter, setPurposeFilter] = useState('Todos');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  const [showAdvanced, setShowAdvanced] = useState(false);


  // Opciones para los <select>
  const statusOptions = [
    { value: 'Todos', label: 'Todos los Estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobada' },
    { value: 'DENIED', label: 'Rechazada' },
    { value: 'CHECKED_IN', label: 'Ingresó' },
    { value: 'CHECKED_OUT', label: 'Salió' }
  ];

  const riskOptions = [
    { value: 'Todos', label: 'Todos los Riesgos' },
    { value: 'low', label: 'Bajo' },
    { value: 'middle', label: 'Medio' },
    { value: 'high', label: 'Alto' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Cualquier Fecha' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Últimos 7 días' },
    { value: 'month', label: 'Últimos 30 días' },
  ];
  
  const purposeOptions = ['Todos', ...VISIT_PURPOSES];
  const fincaOptions = [{ id: 'Todos', name: 'Todas mis Fincas' }, ...(producer.fincas || [])];


  // Lógica de filtrado
  useEffect(() => {
    let tempLog = producerLog;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateRangeFilter !== 'all') {
      let startDate = new Date(today);
      if (dateRangeFilter === 'week') {
        startDate.setDate(today.getDate() - 7);
      } else if (dateRangeFilter === 'month') {
        startDate.setDate(today.getDate() - 30);
      }
      tempLog = tempLog.filter(visit => {
        const visitDateString = visit.checkIn || visit.entryTime || visit.date;
        if (!visitDateString) return false;
        const visitDate = new Date(visitDateString);
        if (dateRangeFilter === 'today') {
          return visitDate.toDateString() === today.toDateString();
        }
        return visitDate >= startDate && visitDate <= now;
      });
    }
    if (fincaFilter !== 'Todos') {
      tempLog = tempLog.filter(visit => visit.fincaId === fincaFilter);
    }
    if (nameFilter) {
      tempLog = tempLog.filter(visit =>
        visit.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (companyFilter) {
      tempLog = tempLog.filter(visit =>
        visit.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    if (riskFilter !== 'Todos') {
      tempLog = tempLog.filter(visit =>
        (visit.risk || 'N/A').toLowerCase() === riskFilter.toLowerCase()
      );
    }
    if (statusFilter !== 'Todos') {
      tempLog = tempLog.filter(visit =>
        visit.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (purposeFilter !== 'Todos') {
      tempLog = tempLog.filter(visit => visit.purpose === purposeFilter);
    }

    setFilteredLog(tempLog);
  }, [producerLog, fincaFilter, nameFilter, companyFilter, riskFilter, statusFilter, purposeFilter, dateRangeFilter]);

  const tableHeaders = [
    { label: 'Nombre' },
    { label: 'Compañía' },
    { label: 'Riesgo', className: 'text-center' },
    { label: 'Entrada' },
    { label: 'Salida' },
    { label: 'Estado' },
    { label: 'Reporte', className: 'text-center' },
  ];

  const renderVisitRow = (visit) => (
    <>
      <td>{visit.name}</td>
      <td>{visit.company}</td>
      <td className="text-center">
        <RiskTag riskLevel={visit.risk} />
      </td>
      <td>{visit.checkIn ? new Date(visit.checkIn).toLocaleString() : 'N/A'}</td>
      <td>{visit.checkOut ? new Date(visit.checkOut).toLocaleString() : 'N/A'}</td>
      <td>
        <span className={`visitStatusTag ${visit.status.toLowerCase()}`}>
          {statusOptions.find(opt => opt.value === visit.status)?.label || visit.status}
        </span>
      </td>
      <td className="text-center">
        {/* Usamos el componente <Button> de /ui solo para el botón de la tabla */}
        <Button 
          variant="icon" 
          onClick={() => onGeneratePDF(visit)} // <-- Esta llamada es correcta
          disabled={!visit.checkIn}
          className={visit.checkIn ? 'pdfButton enabled' : 'pdfButton'}
          title={!visit.checkIn ? "El reporte está disponible después del ingreso real." : "Generar Reporte PDF"}
        >
          <Icon path={ICONS.download} size={20} />
        </Button>
      </td>
    </>
  );
  
  const clearFilters = () => {
    setFincaFilter('Todos');
    setNameFilter('');
    setCompanyFilter('');
    setRiskFilter('Todos');
    setStatusFilter('Todos');
    setPurposeFilter('Todos');
    setDateRangeFilter('all');
    setShowAdvanced(false); 
  };

  return (
    <div className="producerVisitorLog">
      <h1 className="h1">Registro de Visitas a la Finca</h1>

      {/* --- BARRA DE FILTROS REDISEÑADA --- */}
      <div className="filtersContainer">
        
        {/* --- FILA 1: Filtros Principales --- */}
        <div className="filtersRow primary">
          <div className="filterGroup">
            <label htmlFor="dateRangeFilter">Rango de Fecha</label>
            <select
              id="dateRangeFilter"
              className="filterSelect"
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="filterGroup">
            <label htmlFor="fincaFilter">Finca</label>
            <select
              id="fincaFilter"
              className="filterSelect"
              value={fincaFilter}
              onChange={(e) => setFincaFilter(e.target.value)}
            >
              {fincaOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="filterGroup">
            <label htmlFor="statusFilter">Estado</label>
            <select
              id="statusFilter"
              className="filterSelect"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Botones de acción en la fila principal */}
          <div className="filterGroup actionButtons">
            {/* ¡CAMBIO! Usamos <button> estándar */}
            <button 
              type="button"
              className="button button-secondary-outline"
              onClick={() => setShowAdvanced(prev => !prev)}
            >
              <Icon path={ICONS.filter} size={16} />
              <span>{showAdvanced ? 'Ocultar' : 'Avanzados'}</span>
              <Icon path={showAdvanced ? ICONS.chevronUp : ICONS.chevronDown} size={16} />
            </button>
            
            {/* ¡CAMBIO! Usamos <button> estándar */}
            <button 
              type="button"
              onClick={clearFilters}
              className="button clearFiltersButton icon"
              title="Limpiar filtros"
            >
              <Icon path={ICONS.reject} size={16} />
            </button>
          </div>
        </div>

        {/* --- FILA 2: Filtros Avanzados (Colapsable) --- */}
        <div className={`filtersRow advanced ${showAdvanced ? 'expanded' : ''}`}>
          <div className="filterGroup">
            <label htmlFor="nameFilter">Nombre:</label>
            <input
              type="text"
              id="nameFilter"
              className="filterInput"
              placeholder="Filtrar Nombre..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="filterGroup">
            <label htmlFor="companyFilter">Compañía:</label>
            <input
              type="text"
              id="companyFilter"
              className="filterInput"
              placeholder="Filtrar Compañía..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
          </div>
          <div className="filterGroup">
            <label htmlFor="purposeFilter">Tipo de Visitante</label>
            <select
              id="purposeFilter"
              className="filterSelect"
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
            >
              {purposeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="filterGroup">
            <label htmlFor="riskFilter">Riesgo:</label>
            <select
              id="riskFilter"
              className="filterSelect"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              {riskOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table
        headers={tableHeaders}
        data={filteredLog}
        renderRow={renderVisitRow}
        emptyMessage="No hay visitas que coincidan con los filtros."
      />
    </div>
  );
};

export default ProducerVisitorLog;