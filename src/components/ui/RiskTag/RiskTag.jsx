// src/components/ui/RiskTag/RiskTag.jsx
import React from 'react';
import './RiskTag.css';

const RiskTag = ({ riskLevel }) => {
  if (!riskLevel) {
    return <span className="riskTag unknown">N/A</span>;
  }

  const level = riskLevel.toLowerCase();
  let label = '';
  switch (level) {
    case 'low':
      label = 'Bajo';
      break;
    case 'middle':
      label = 'Medio';
      break;
    case 'high':
      label = 'Alto';
      break;
    default:
      label = 'N/A';
      break;
  }

  return (
    <div className={`riskTag ${level}`}>
      <span className="riskCircle"></span>
      <span className="riskLabel">{label}</span>
    </div>
  );
};

export default RiskTag;