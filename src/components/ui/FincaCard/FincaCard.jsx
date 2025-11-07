import React from 'react';
import Icon from '../Icon';
import RiskTag from '../RiskTag/RiskTag';
import { ICONS } from '../../../config/icons'; // Corregido con 3 puntos (../)
import './FincaCard.css';

const FincaCard = ({ finca, onClick }) => {
  // Usamos los datos del objeto 'finca' que viene de tu archivo
  // 'finca.hectares' en lugar de 'area'
  // 'finca.name' y 'finca.lotes' ya existen
  const risk = finca.riskLevel || 'Low'; // Asumimos 'riskLevel'
  const owner = finca.owner || 'Propietario'; // 'owner' no está en tu FincaRegistration, así que ponemos un default

  return (
    <div className="finca-card" onClick={onClick}>
      <div className="finca-card-header">
        <Icon path={ICONS.location} className="finca-icon" />
        <h3 className="finca-card-title">{finca.name}</h3>
      </div>
      <div className="finca-card-body">
        <div className="finca-card-detail">
          <span className="detail-label">Propietario:</span>
          <span className="detail-value">{owner}</span>
        </div>
        <div className="finca-card-detail">
          <span className="detail-label">Lotes:</span>
          <span className="detail-value">{finca.lotes.length}</span>
        </div>
        <div className="finca-card-detail">
          <span className="detail-label">Hectáreas:</span>
          <span className="detail-value">{finca.hectares} ha</span>
        </div>
      </div>
      <div className="finca-card-footer">
        <span className="detail-label">Nivel de Riesgo:</span>
        <RiskTag level={risk} />
      </div>
    </div>
  );
};

export default FincaCard;