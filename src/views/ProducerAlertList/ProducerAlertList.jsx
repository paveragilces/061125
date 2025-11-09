// En: src/views/ProducerAlertList/ProducerAlertList.jsx
// --- ARCHIVO COMPLETO (Sin cambios, solo para confirmar) ---

import React, { useState, useMemo } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ProducerAlertList.css'; // <-- Importación de CSS

// --- Componente de Modal de Vista Previa de Imagen ---
const ImagePreviewModal = ({ src, onClose }) => (
  <div className="image-preview-backdrop" onClick={onClose}>
    <div className="image-preview-content">
      <button className="image-preview-close" onClick={onClose}>
        <Icon path={ICONS.reject} size={24} color="#fff" />
      </button>
      <img src={src} alt="Vista previa de evidencia" />
    </div>
  </div>
);

// --- Lista de Meses ---
const MONTHS = [
  { value: 'all', label: 'Todos los Meses' },
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const ProducerAlertList = ({ producer, alerts, technicians, onNavigate, pageData, onGenerateAlertPDF }) => {

  const [activeFilter, setActiveFilter] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);

  const getTechnicianName = (techId) => {
    const tech = technicians.find(t => t.id === techId);
    return tech ? tech.name : null;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pendiente', className: 'status-pending' };
      case 'assigned':
        return { text: 'Asignado', className: 'status-assigned' };
      case 'completed':
        return { text: 'Completado', className: 'status-completed' };
      default:
        return { text: status, className: 'status-default' };
    }
  };

  // --- Generar lista de años disponibles ---
  const uniqueYears = useMemo(() => {
    const years = new Set(alerts.map(alert => alert.date.substring(0, 4)));
    return Array.from(years).sort((a, b) => b - a); // Ordenar descendente
  }, [alerts]);

  // --- Lógica de filtrado con Año y Mes ---
  const filteredAlerts = useMemo(() => {
    let sorted = [...alerts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 1. Filtro de estado
    if (activeFilter !== 'all') {
      sorted = sorted.filter(alert => alert.status === activeFilter);
    }
    
    // 2. Filtro de Año
    if (filterYear !== 'all') {
      sorted = sorted.filter(alert => alert.date.substring(0, 4) === filterYear);
    }

    // 3. Filtro de Mes
    if (filterMonth !== 'all') {
      sorted = sorted.filter(alert => alert.date.substring(5, 7) === filterMonth);
    }
    
    return sorted;
  }, [alerts, activeFilter, filterYear, filterMonth]); 


  const renderAlertCard = (alert) => {
    const techName = getTechnicianName(alert.techId);
    const statusInfo = getStatusInfo(alert.status);
    
    const d = new Date(alert.date);
    const day = d.getUTCDate(); // Usar UTC para evitar problemas de zona horaria
    const month = d.toLocaleString('es-ES', { month: 'short', timeZone: 'UTC' }).toUpperCase().replace('.', '');
    
    const photos = alert.photos ? Object.values(alert.photos).filter(Boolean) : [];
    const hasPhotos = photos.length > 0;
    
    let managerDiagnosis = 'Sin Diagnóstico';
    if (alert.possibleDisease && alert.possibleDisease.length > 0) {
      managerDiagnosis = alert.possibleDisease.join(', ');
    } else if (alert.managerComment) {
      managerDiagnosis = alert.managerComment;
    }

    const handleImageClick = (e, photoSrc) => {
      e.stopPropagation(); 
      setPreviewImage(photoSrc);
    };

    return (
      <button 
        key={alert.id} 
        className="alert-card" 
        onClick={() => onNavigate('producerAlertList', alert)}
        title="Ver detalles de la alerta"
      >
        <div className="alert-card-header">
          <div className="alert-card-date">
            <span className="date-day">{day < 10 ? `0${day}` : day}</span>
            <span className="date-month">{month}</span>
          </div>
          
          <div className="alert-card-header-main">
            <h3 className="alert-card-title">{alert.farmName}</h3>
            <span className="alert-card-subtitle">
              <Icon path={ICONS.location} size={14} /> {alert.lote}
            </span>
          </div>
          <span className={`alert-status-tag ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        <div className="alert-card-body">
          {hasPhotos ? (
            <div className="alert-card-mosaic">
              {photos.slice(0, 3).map((photo, index) => (
                <img 
                  key={index} 
                  src={photo} 
                  alt={`Evidencia ${index + 1}`} 
                  className="mosaic-image" 
                  onClick={(e) => handleImageClick(e, photo)}
                />
              ))}
              {photos.length > 3 && (
                <div 
                  className="mosaic-more" 
                  onClick={(e) => handleImageClick(e, photos[3])} 
                >
                  +{photos.length - 3}
                </div>
              )}
            </div>
          ) : (
            <div className="mosaic-placeholder">
              <Icon path={ICONS.camera} size={24} color="#CBD5E0" />
              <span>No hay fotos, síntomas reportados:</span>
              <p>{alert.symptoms.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="alert-card-footer">
          <div className="footer-item">
            <span>Técnico:</span>
            {techName ? (
              <strong>{techName}</strong>
            ) : (
              <strong className="unassigned">Sin Asignar</strong>
            )}
          </div>
          <div className="footer-item">
            <span>Prioridad:</span>
            {alert.priority ? (
              <strong>{alert.priority}</strong>
            ) : (
              <strong className="unassigned">Sin Definir</strong>
            )}
          </div>
          <div className="footer-item">
            <span>Diagnóstico (Gerente):</span>
            {managerDiagnosis !== 'Sin Diagnóstico' ? (
              <strong className="manager-diag">{managerDiagnosis}</strong>
            ) : (
              <strong className="unassigned">{managerDiagnosis}</strong>
            )}
          </div>
        </div>
      </button>
    );
  };

  const renderAlertList = () => {
    return (
      <div className="alert-list-container">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => renderAlertCard(alert))
        ) : (
          <div className="emptyState full-width">
            <Icon path={ICONS.filter} size={60} color="#ccc" />
            <h2>Sin Alertas</h2>
            <p>No se encontraron alertas que coincidan con el filtro seleccionado.</p>
          </div>
        )}
      </div>
    );
  };

  const renderFilterTabs = () => {
    const filters = [
      { key: 'all', label: 'Todos', icon: ICONS.filter },
      { key: 'pending', label: 'Pendientes', icon: ICONS.alert },
      { key: 'assigned', label: 'Asignadas', icon: ICONS.technician },
      { key: 'completed', label: 'Completadas', icon: ICONS.checkCircle }
    ];

    return (
      <div className="filter-controls">
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter.key}
              className={`filter-button ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <Icon path={filter.icon} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
        
        <div className="filter-selects">
          <div className="filter-select-wrapper">
            <Icon path={ICONS.calendar} />
            <select 
              className="filter-select" 
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">Todos los Años</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-select-wrapper">
            <Icon path={ICONS.calendar} />
            <select 
              className="filter-select" 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              disabled={filterYear === 'all'} 
            >
              {MONTHS.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };


  const renderAlertDetail = (alert) => {
    // ... (Sin cambios) ...
    const techName = getTechnicianName(alert.techId);
    const statusInfo = getStatusInfo(alert.status);
    const resolution = alert.inspectionData?.plant?.data;
    return (
      <div className="alert-detail-container">
        <button className="button-back" onClick={() => onNavigate('producerAlertList')}>
          <Icon path={ICONS.back} /> Volver al listado
        </button>
        <div className="alert-detail-header">
          <div>
            <h1 className="h1">Detalle de Alerta #{alert.id}</h1>
            <p className="alert-detail-finca">{alert.farmName} - {alert.lote}</p>
          </div>
          <span className={`alert-status-tag ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>
        <div className="alert-detail-grid">
          <div className="card">
            <h3 className="h3">Reporte del Productor</h3>
            <div className="detail-item">
              <label>Fecha de Reporte:</label>
              <span>{new Date(alert.date).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Partes Afectadas:</label>
              <span>{Object.keys(alert.parts).join(', ')}</span>
            </div>
            <div className="detail-item">
              <label>Síntomas Reportados:</label>
              <span>{alert.symptoms.join(', ')}</span>
            </div>
            <div className="detail-item">
              <label>Fotos Adjuntas:</label>
              <div className="photo-gallery">
                {alert.photos && Object.values(alert.photos).filter(Boolean).length > 0 ? (
                  Object.entries(alert.photos).map(([key, photoData]) => (
                    photoData ? <img key={key} src={photoData} alt={key} /> : null
                  ))
                ) : (
                  <span>No se adjuntaron fotos.</span>
                )}
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="h3">Diagnóstico del Técnico</h3>
            <div className="detail-item">
              <label>Técnico Asignado:</label>
              <span>{techName || 'Pendiente'}</span>
            </div>
            <div className="detail-item">
              <label>Fecha de Visita:</label>
              <span>{alert.visitDate ? new Date(alert.visitDate).toLocaleDateString() : 'Pendiente'}</span>
            </div>
            <div className="detail-item">
              <label>Prioridad:</label>
              <span>{alert.priority || 'Pendiente'}</span>
            </div>
            {resolution ? (
              <>
                <h4 className="h4" style={{marginTop: '20px'}}>Resultados de la Inspección</h4>
                <div className="detail-item">
                  <label>Diagnóstico Final:</label>
                  <span className="tag-diagnosis">{resolution.diagnosis.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <label>Acciones Inmediatas:</label>
                  <span>{resolution.actions.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <label>Recomendaciones:</label>
                  <p>{resolution.recommendations}</p>
                </div>
              </>
            ) : (
              <div className="emptyState mini">
                <Icon path={ICONS.technician} size={40} color="#ccc" />
                <p>La inspección aún no ha sido completada.</p>
              </div>
            )}
          </div>
        </div>
        <div className="alert-detail-actions">
          <button className="button button-secondary" onClick={() => onGenerateAlertPDF(alert)}>
            <Icon path={ICONS.download} /> Descargar Reporte
          </button>
        </div>
      </div>
    );
  };


  // --- Renderizado Principal ---
  return (
    <div className="container">
      {previewImage && (
        <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
      )}
      {pageData ? renderAlertDetail(pageData) : (
        <>
          <div className="header-container">
            <h1 className="h1">Registro de Alertas</h1>
            <button className="button btn-primary" onClick={() => onNavigate('reportAlert')}>
              <Icon path={ICONS.alert} /> Reportar Nueva Alerta
            </button>
          </div>
          {renderFilterTabs()}
          {renderAlertList()}
        </>
      )}
    </div>
  );
};

export default ProducerAlertList;