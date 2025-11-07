// En: src/views/ProducerCertification/ProducerCertification.jsx
// --- ARCHIVO COMPLETO CON HEADER FUSIONADO ---

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'; 
import { ICONS } from '../../config/icons';
import { MOCK_INSPECTION_MODULES } from '../../data/mockData'; 
import './ProducerCertification.css';

const ProducerCertification = ({ certificationHistory, onShowHistoryModal }) => {
  
  const [expandedId, setExpandedId] = useState(null);
  // --- CAMBIO 1: Nuevo estado para el acordeón principal ---
  const [isCurrentExpanded, setIsCurrentExpanded] = useState(false);

  const currentStatus = certificationHistory[0];
  const totalScore = currentStatus.averageScore;
  const isCertified = totalScore > 90;

  const handleToggleHistory = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="container">
      <h1 className="h1">Certificación Interna "Sello AgroAliados"</h1>
      
      {/* --- HEADER DE CERTIFICACIÓN (Ahora es un contenedor) --- */}
      <div className={`certificationContainer ${isCertified ? 'certified' : 'pending'}`}>
        <div className="certificationHeader">
          <div className="certificationBadge">
            <Icon path={ICONS.certification} size={40} />
          </div>
          <div className="certificationSummary">
            <span className="summaryTitle">{isCertified ? '¡SELLO OBTENIDO!' : 'EN PROCESO'}</span>
            <p>
              {isCertified
                ? 'Has obtenido el Sello por mantener un cumplimiento promedio superior al 90%.'
                : 'Tu puntaje de cumplimiento es bueno, pero necesitas superar el 90% para obtener el Sello.'
              }
            </p>
            
            {/* --- CAMBIO 3: Botón para expandir el desglose actual --- */}
            <button 
              className="headerCta" 
              onClick={() => setIsCurrentExpanded(!isCurrentExpanded)}
              aria-expanded={isCurrentExpanded}
            >
              Ver Desglose Actual
              <Icon 
                path={ICONS.chevronDown} 
                size={16} 
                className={`historyCtaIcon ${isCurrentExpanded ? 'expanded' : ''}`}
              />
            </button>
          </div>
          <div className="certificationScoreBox">
            <span className="scoreLabel">Promedio Actual</span>
            <span className="scoreValue">{totalScore}%</span>
          </div>
        </div>
        
        {/* --- CAMBIO 4: Desglose "smooth" fusionado --- */}
        <div className={`currentBreakdown ${isCurrentExpanded ? 'expanded' : ''}`}>
          <div className="progressGrid">
            {MOCK_INSPECTION_MODULES.map(module => (
              <ProgressBar 
                key={module.id}
                label={`${module.id}. ${module.name}`}
                score={currentStatus.breakdown[module.name] || 0}
              />
            ))}
          </div>
        </div>
      </div>


      {/* --- CAMBIO 2: SECCIÓN DE DESGLOSE ESTÁTICO ELIMINADA --- */}
      
      {/* --- HISTORIAL DE REVISIONES (Funciona igual que antes) --- */}
      <div className="certificationHistory">
        <h2 className="h2">Historial de Revisiones</h2>
        <div className="historyList">
          {certificationHistory.map(historyItem => {
            const isExpanded = expandedId === historyItem.id;
            
            return (
              <div key={historyItem.id} className="historyItemContainer">
                <button 
                  className="historyItem"
                  onClick={() => handleToggleHistory(historyItem.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="historyInfo">
                    <span className="historyDate">Revisión: {historyItem.date}</span>
                    <span className="historyScore">Promedio: <strong>{historyItem.averageScore}%</strong></span>
                  </div>
                  <div className="historyActions">
                    <span 
                      className={`tag ${historyItem.status === 'Aprobado' ? 'tag-aprobado' : 'tag-no-aprobado'}`}
                    >
                      {historyItem.status}
                    </span>
                    <span className="historyCta">
                      Ver Desglose 
                      <Icon 
                        path={ICONS.chevronDown} 
                        size={16} 
                        className={`historyCtaIcon ${isExpanded ? 'expanded' : ''}`}
                      />
                    </span>
                  </div>
                </button>
                
                <div className={`historyBreakdown ${isExpanded ? 'expanded' : ''}`}>
                  <div className="progressGrid">
                    {MOCK_INSPECTION_MODULES.map(module => (
                      <ProgressBar 
                        key={module.id}
                        label={`${module.id}. ${module.name}`}
                        score={historyItem.breakdown[module.name] || 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ProducerCertification;