import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import Slider from '../../components/ui/Slider';
import Tooltip from '../../components/ui/Tooltip';
import { ICONS } from '../../config/icons';
import { BANANA_DISEASES, TECHNICIAN_ACTIONS } from '../../data/constants'; // Asumiendo que se movió
import './TechnicianModulePlant.css';

/**
 * Módulo de Inspección de Planta (Técnico, con Tooltips)
 */
const TechnicianModulePlant = ({ alert, initialData, onSubmit }) => {
  const [data, setData] = useState(initialData);

  const handleToggleDiagnosis = (d) => {
    const newDiagnosis = data.diagnosis.includes(d) ? data.diagnosis.filter(item => item !== d) : [...data.diagnosis, d];
    setData(prev => ({ ...prev, diagnosis: newDiagnosis }));
  };
  const handleToggleAction = (a) => {
    const newActions = data.actions.includes(a) ? data.actions.filter(item => item !== a) : [...data.actions, a];
    setData(prev => ({ ...prev, actions: newActions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h1">Módulo: Inspección de Planta (Diagnóstico)</h1>

      {/* Datos del Productor */}
      <div className="card producerReportCard">
        <h2 className="cardTitle">Reporte Original del Productor</h2>
        <p><strong>Síntomas:</strong> {alert.symptoms.join(', ')}</p>
        <p><strong>Ubicación:</strong> Lat: {alert.location.lat.toFixed(4)}, Lon: {alert.location.lon.toFixed(4)}</p>
        <div className="producerPhotoGallery">
          {alert.photos && Object.entries(alert.photos).map(([key, value]) => value && (
            <img key={key} src={value} alt={key} className="producerPhoto" />
          ))}
        </div>
      </div>

      {/* Formulario del Técnico */}
      <div className="formGroup">
        <label className="label"><Icon path={ICONS.disease} /> Diagnóstico Final (Selección Múltiple)</label>
        <div className="buttonToggleGroup">
          {BANANA_DISEASES.map(disease => (
            <button
              type="button" key={disease} onClick={() => handleToggleDiagnosis(disease)}
              className={`button ${data.diagnosis.includes(disease) ? 'btn-primary' : 'button-secondary'}`}
            >
              {disease} {data.diagnosis.includes(disease) ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* SLIDERS CON TOOLTIP */}
      <div className="sliderGrid">
        <Slider
          label={
            <div className="labelWithTooltip">
              Nivel de Incidencia
              <Tooltip text="Porcentaje de plantas en el lote que muestran síntomas (Ej: 10 de 100 plantas = 10%).">
                <Icon path={ICONS.info} size={16} color="#aaa" />
              </Tooltip>
            </div>
          }
          value={data.incidence}
          onChange={(e) => setData(prev => ({ ...prev, incidence: parseInt(e.target.value, 10) }))}
        />
        <Slider
          label={
            <div className="labelWithTooltip">
              Nivel de Severidad
              <Tooltip text="Grado de afectación promedio en las plantas enfermas (0-100%).">
                <Icon path={ICONS.info} size={16} color="#aaa" />
              </Tooltip>
            </div>
          }
          value={data.severity}
          onChange={(e) => setData(prev => ({ ...prev, severity: parseInt(e.target.value, 10) }))}
        />
      </div>

      <div className="formGroup">
        <label className="label"><Icon path={ICONS.action} /> Acciones Tomadas (Selección Múltiple)</label>
        <div className="buttonToggleGroup">
          {TECHNICIAN_ACTIONS.map(action => (
            <button
              type="button" key={action} onClick={() => handleToggleAction(action)}
              className={`button ${data.actions.includes(action) ? 'btn-primary' : 'button-secondary'}`}
            >
              {action} {data.actions.includes(action) ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* RECOMENDACIONES */}
      <div className="formGroup">
        <label className="label"><Icon path={ICONS.comment} /> Recomendaciones para el Productor</label>
        <textarea
          className="textarea"
          style={{ minHeight: '120px' }}
          value={data.recommendations}
          onChange={(e) => setData(prev => ({ ...prev, recommendations: e.target.value }))}
          placeholder="Describa las acciones y recomendaciones detalladas para el productor..."
        ></textarea>
      </div>

      <div className="submitContainer">
        <button className="button btn-primary" type="submit">Guardar Módulo Inspección</button>
      </div>
    </form>
  );
};

export default TechnicianModulePlant;