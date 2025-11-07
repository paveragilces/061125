// src/views/VisitorAccess/VisitorAccessPage.jsx
import React, { useState } from 'react';
import RequestVisitForm from './RequestVisitForm';
import ApprovedCodes from './ApprovedCodes';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './VisitorAccess.css'; // CSS compartido para esta sección

function VisitorAccessPage({ onNewRequest, approvedVisits, onNavigate }) {
  const [activeTab, setActiveTab] = useState('request'); // 'request' o 'codes'

  return (
    <div className="loginContainer">
      <div className="visitorBox">
        {/* Encabezado y Logo */}
        <div>
          <span className="loginLogo">Agro</span>
          <span className="loginLogoSub">Aliados</span>
        </div>
        <h1 className="loginTitle">Portal de Visitantes</h1>

        {/* Contenedor de Pestañas */}
        <div className="tabContainer">
          <button
            className={`tabButton ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <Icon path={ICONS.report} size={18} /> Solicitar Visita
          </button>
          <button
            className={`tabButton ${activeTab === 'codes' ? 'active' : ''}`}
            onClick={() => setActiveTab('codes')}
          >
            <Icon path={ICONS.certification} size={18} /> Mis Pases QR
          </button>
        </div>

        {/* Contenido de la Pestaña */}
        <div className="tabContent">
          {activeTab === 'request' && (
            <RequestVisitForm onNewRequest={onNewRequest} />
          )}
          {activeTab === 'codes' && (
            <ApprovedCodes approvedVisits={approvedVisits} />
          )}
        </div>

        <button
          className="button button-secondary"
          style={{ width: '100%', marginTop: '20px' }}
          onClick={() => onNavigate('login')}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default VisitorAccessPage;