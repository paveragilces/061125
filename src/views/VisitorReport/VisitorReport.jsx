import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table/Table';
import Icon from '../../components/ui/Icon';
import RiskTag from '../../components/ui/RiskTag/RiskTag';
import { ICONS } from '../../config/icons';
import { VISIT_PURPOSES } from '../../data/constants'; // Importamos los motivos
import './VisitorReport.css'; // Usaremos nuevos estilos

/**
 * Reporte General de Visitas (Gerente)
 * REDISEÑADO: Ahora usa la barra de filtros colapsable.
 */
const VisitorReport = ({ visits, fincas, pageData }) => {
  const [filteredLog, setFilteredLog] = useState(visits);

  // --- Estados para los nuevos filtros ---
  const [fincaFilter, setFincaFilter] = useState('Todos');
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState(pageData?.filter || 'Todos');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // --- ¡NUEVO ESTADO! ---
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

  const dateRangeOptions = [
    { value: 'all', label: 'Cualquier Fecha' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Últimos 7 días' },
    { value: 'month', label: 'Últimos 30 días' },
  ];
  
  const purposeOptions = ['Todos', ...VISIT_PURPOSES];
  // El gerente ve TODAS las fincas
  const fincaOptions = [{ id: 'Todos', name: 'Todas las Fincas' }, ...fincas];


  // Lógica de filtrado
  useEffect(() => {
    let tempLog = visits;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Filtro de Rango de Fecha
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

    // 2. Filtro de Finca
    if (fincaFilter !== 'Todos') {
      tempLog = tempLog.filter(visit => visit.fincaId === fincaFilter);
    }
    
    // 3. Filtro de Nombre
    if (nameFilter) {
      tempLog = tempLog.filter(visit =>
        visit.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    // 4. Filtro de Compañía
    if (companyFilter) {
      tempLog = tempLog.filter(visit =>
        visit.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    // 5. Filtro de Motivo (Tipo de visitante)
    if (purposeFilter !== 'Todos') {
      tempLog = tempLog.filter(visit => visit.purpose === purposeFilter);
    }
    
    // 6. Filtro de Estado
    if (statusFilter !== 'Todos') {
      tempLog = tempLog.filter(visit =>
        visit.status.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    setFilteredLog(tempLog);
  }, [visits, fincaFilter, nameFilter, companyFilter, purposeFilter, statusFilter, dateRangeFilter]);

  // Definición de la tabla
  const tableHeaders = [
    { label: 'Visitante' },
    { label: 'Compañía' },
    { label: 'Finca' },
    { label: 'Riesgo', className: 'text-center' },
    { label: 'Ingreso' },
    { label: 'Salida' },
    { label: 'Estado' },
  ];

  // Función para renderizar cada fila de la tabla
  const renderVisitRow = (visit) => (
    <>
      <td>{visit.name}</td>
      <td>{visit.company}</td>
      <td>{fincas.find(f => f.id === visit.fincaId)?.name || 'N/A'}</td>
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
    </>
  );
  
  const clearFilters = () => {
    setFincaFilter('Todos');
    setNameFilter('');
    setCompanyFilter('');
    setPurposeFilter('Todos');
    setStatusFilter('Todos');
    setDateRangeFilter('all');
    setShowAdvanced(false); // Oculta los filtros avanzados
  };

  return (
    <div className="container visitorReportContainer"> 
      <h1 className="h1">Reporte General de Visitas</h1>

      {/* --- ¡NUEVA BARRA DE FILTROS! --- */}
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
            <button 
              type="button"
              className="button button-secondary-outline"
              onClick={() => setShowAdvanced(prev => !prev)}
            >
              <Icon path={ICONS.filter} size={16} />
              <span>{showAdvanced ? 'Ocultar' : 'Avanzados'}</span>
              <Icon path={showAdvanced ? ICONS.chevronUp : ICONS.chevronDown} size={16} />
            </button>
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
            <label htmlFor="nameFilter">Nombre Visitante</label>
            <input
              type="text"
              id="nameFilter"
              className="filterInput"
              placeholder="Buscar por nombre..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="filterGroup">
            <label htmlFor="companyFilter">Compañía</label>
            <input
              type="text"
              id="companyFilter"
              className="filterInput"
              placeholder="Buscar por compañía..."
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
        </div>
      </div>

      {/* --- NUEVA TABLA DE DATOS --- */}
      <Table
        headers={tableHeaders}
        data={filteredLog}
        renderRow={renderVisitRow}
        emptyMessage="No hay visitas que coincidan con los filtros."
      />
    </div>
  );
};

export default VisitorReport;