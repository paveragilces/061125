// src/views/VisitorAccess/ApprovedCodes.jsx
import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import './VisitorAccess.css'; // Usa el CSS compartido
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon'; // Importar Icon
import { ICONS } from '../../config/icons'; // Importar ICONS

function ApprovedCodes({ approvedVisits }) {
  const [activeVisitId, setActiveVisitId] = useState(null);

  const handleToggleQr = (visitId) => {
    setActiveVisitId(prevId => (prevId === visitId ? null : visitId));
  };

  // --- ¡CAMBIO AQUÍ! ---
  // Filtra CUALQUIER estado final, no solo las aprobadas.
  const myVisits = approvedVisits.filter(v => 
    v.status === 'APPROVED' || 
    v.status === 'CHECKED_IN' || 
    v.status === 'DENIED' // Añadido estado 'DENIED'
  );

  return (
    <div className="visitList">
      {myVisits.length === 0 ? (
        <div className="messageBox">
          <p>No tienes pases de visita activos o solicitudes procesadas. Primero solicita una visita y espera que sea aprobada.</p>
        </div>
      ) : (
        myVisits.map(visit => {
          // Determinar la clase de estado
          const statusClass = 
            visit.status === 'CHECKED_IN' ? 'statusIn' :
            visit.status === 'APPROVED' ? 'statusApproved' :
            visit.status === 'DENIED' ? 'statusDenied' : // Nueva clase
            '';

          return (
            <div 
              key={visit.id} 
              // --- ¡CAMBIO AQUÍ! ---
              // Añadir clase de borde dinámico
              className={`visitCard ${visit.status === 'DENIED' ? 'visitCardDenied' : ''}`}
            >
              <div className="visitDetails">
                <h3>{visit.name} ({visit.company})</h3>
                <p>Motivo: {visit.purpose}</p>
                
                {/* --- ¡CAMBIO AQUÍ! ---
                    Mostrar el riesgo solo si existe (no existe en 'DENIED')
                */}
                {visit.risk && (
                  <p className={`riskTag ${visit.risk?.toLowerCase()}`}>
                    Riesgo Fitosanitario: <strong>{visit.risk}</strong>
                  </p>
                )}
                
                <p className="status">
                  Estado:
                  <span className={statusClass}>
                    {visit.status.replace('_', ' ')}
                  </span>
                </p>
              </div>
              
              {/* --- ¡CAMBIO AQUÍ! ---
                  Mostrar botón de QR solo si está Aprobada o Dentro.
                  Mostrar mensaje de Rechazo si está Denegada.
              */}
              {visit.status === 'APPROVED' || visit.status === 'CHECKED_IN' ? (
                <Button 
                  variant="secondary"
                  onClick={() => handleToggleQr(visit.id)}
                >
                  <Icon path={ICONS.camera} size={18} />
                  {activeVisitId === visit.id ? 'Ocultar QR' : 'Mostrar QR'}
                </Button>
              ) : (
                <div className="deniedMessage">
                  <Icon path={ICONS.reject} size={18} />
                  <span>El productor ha rechazado esta solicitud.</span>
                </div>
              )}

              {activeVisitId === visit.id && (
                <div className="qrCodeContainer">
                  <QRCodeDisplay value={visit.qrData} />
                  <p className="qrNote">ID de Visita: {visit.id}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ApprovedCodes;