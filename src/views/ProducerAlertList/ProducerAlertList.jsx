// En: src/views/ProducerAlertList.jsx
// --- ARCHIVO COMPLETO CON VISOR DE FOTOS ---

import React, { useState } from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal'; // <-- CAMBIO 1: Importamos Modal
import { ICONS } from '../../config/icons';
import './ProducerAlertList.css'; 

/**
 * VISTA: Registro de Alertas (Productor)
 * REDISEÑADA para ser más funcional y moderna.
 */
const ProducerAlertList = ({ 
  producer, 
  alerts, 
  technicians, 
  onNavigate, 
  pageData,
  onGenerateAlertPDF 
}) => {
  const [filterStatus, setFilterStatus] = useState(pageData?.filter || 'pending'); 
  
  // --- CAMBIO 2: Nuevo estado para el modal de fotos ---
  const [viewingAlertPhotos, setViewingAlertPhotos] = useState(null);
  
  const myAlerts = alerts.filter(a => a.producerId === producer.id);
  const filteredAlerts = myAlerts.filter(a => a.status === filterStatus);

  // --- Lógica para el Countdown (Sin cambios) ---
  const getCountdown = (date) => {
    if (!date) return { text: 'Sin fecha', className: 'urgency-low' };
    const today = new Date(new Date().toISOString().split('T')[0]);
    const visitDate = new Date(new Date(date).toISOString().split('T')[0]);
    const diffTime = visitDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Visita Atrasada', className: 'urgency-high' };
    if (days === 0) return { text: 'Visita Hoy', className: 'urgency-high' };
    if (days === 1) return { text: 'Visita Mañana', className: 'urgency-medium' };
    return { text: `Visita en ${days} días`, className: 'urgency-low' };
  };

  // --- El nuevo componente de Tarjeta de Alerta ---
  const AlertCard = ({ alert }) => {
    const tech = alert.techId ? technicians.find(t => t.id === alert.techId) : null;
    const countdown = getCountdown(alert.visitDate);
    const resolution = alert.inspectionData?.plant?.data;
    const attachedPhotos = alert.photos ? Object.entries(alert.photos).filter(([key, value]) => value) : [];

    const getStatusTag = () => {
      if (alert.status === 'pending') return <span className="tag tag-pending">Pendiente</span>;
      if (alert.status === 'assigned') return <span className={`tag tag-assigned ${countdown.className}`}>{countdown.text}</span>;
      if (alert.status === 'completed') return <span className="tag tag-completed">Completada</span>;
      return null;
    };

    return (
      <div className="alertCard">
        <div className="alertCardHeader">
          <div className="alertCardTitle">
            <span className="alertFarmName">{alert.farmName}</span>
            <span className="alertLote">(Lote: {alert.lote})</span>
          </div>
          {getStatusTag()}
        </div>

        <div className="alertCardBody">
          {/* --- 1. Mi Reporte (Síntomas y Fotos) --- */}
          <div className="alertCardSection">
            <h3 className="sectionTitle">Mi Reporte</h3>
            <p className="sectionContent symptoms">{alert.symptoms.join(', ')}</p>
            {attachedPhotos.length > 0 && (
              // --- CAMBIO 3: Convertido a <button> ---
              <button 
                className="photoChip"
                onClick={() => setViewingAlertPhotos(attachedPhotos)}
              >
                <Icon path={ICONS.camera} size={14} />
                {attachedPhotos.length} Foto(s) Adjunta(s) (Ver)
              </button>
            )}
          </div>

          {/* --- 2. Asignación (Con comentario del gerente) --- */}
          {alert.status === 'assigned' && tech && (
            <div className="alertCardSection assigned">
              <h3 className="sectionTitle">Visita Programada</h3>
              <p className="sectionContent"><strong>Técnico:</strong> {tech.name}</p>
              <p className="sectionContent"><strong>Fecha:</strong> {alert.visitDate}</p>
              {alert.managerComment && (
                <p className="sectionContent manager-comment">
                  <strong>Comentario del Gerente:</strong> "{alert.managerComment}"
                </p>
              )}
              <p className="sectionContent specialties">
                <strong>Especialidades:</strong> {tech.specialties.join(', ')}
              </p>
            </div>
          )}

          {/* --- 3. Resolución (Sin cambios) --- */}
          {alert.status === 'completed' && resolution && (
            <div className="alertCardSection completed">
              <h3 className="sectionTitle">Resolución del Técnico</h3>
              <p className="sectionContent diagnosis">
                <strong>Diagnóstico:</strong> {resolution.diagnosis.join(', ')}
              </p>
              <p className="sectionContent actions">
                <strong>Acciones:</strong> {resolution.actions.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* --- Footer (Sin cambios) --- */}
        <div className="alertCardFooter">
          <span>Reportada: {alert.date}</span>
          <div className="alertCardFooterActions">
            <span className={`alertPriority ${alert.priority === 'Alta' ? 'priority-high' : 'priority-medium'}`}>
              Prioridad: {alert.priority || 'N/A'}
            </span>
            <button
              className="alertPdfButton"
              onClick={() => onGenerateAlertPDF(alert)}
              title="Descargar Constancia/Reporte PDF"
            >
              <Icon path={ICONS.download} size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container producer-alert-list-page">
      <div className="alertListHeader">
        <h1 className="h1">Mis Alertas Registradas</h1>
        <button
          className="button btn-primary"
          onClick={() => onNavigate('reportAlert')}
        >
          <Icon path={ICONS.report} /> Reportar Nueva Alerta
        </button>
      </div>

      {/* Pestañas de Filtro (Sin cambios) */}
      <div className="tabContainer">
        <button
          className={`tabButton ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}>
          Pendientes ({myAlerts.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'assigned' ? 'active' : ''}`}
          onClick={() => setFilterStatus('assigned')}>
          Asignadas ({myAlerts.filter(a => a.status === 'assigned').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}>
          Completadas ({myAlerts.filter(a => a.status === 'completed').length})
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          iconPath={ICONS.checkCircle}
          title={`No hay alertas ${filterStatus}`}
          message="No tienes alertas en esta categoría."
        />
      ) : (
        <div className="alertListContainer">
          {filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      )}

      {/* --- CAMBIO 4: Añadimos el Modal --- */}
      {viewingAlertPhotos && (
        <Modal
          title="Fotos Adjuntas de la Alerta"
          onClose={() => setViewingAlertPhotos(null)}
          size="large"
        >
          <div className="photoModalGallery">
            {viewingAlertPhotos.length === 0 ? (
              <p>No se encontraron fotos para esta alerta.</p>
            ) : (
              // attachedPhotos es un array de [key, value]
              viewingAlertPhotos.map(([part, photoSrc], index) => (
                <div key={index} className="photoModalItem">
                  <img src={photoSrc} alt={`Evidencia de ${part}`} />
                  <span className="photoModalLabel">Evidencia de: {part}</span>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProducerAlertList;