import React, { useState } from 'react';
import './TechnicianModuleDrone.css';

/**
 * Módulo de Vuelo Drone (Técnico)
 */
const TechnicianModuleDrone = ({ initialData, onSubmit }) => {
  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h1">Módulo: Reporte de Vuelo de Drone (Opcional)</h1>
      <div className="formGroup">
        <label className="label">Altura de Vuelo (metros)</label>
        <input className="input" type="number" name="altitude" value={data.altitude} onChange={handleChange} placeholder="Ej: 100" />
      </div>
      <div className="formGroup">
        <label className="label">Hectáreas Voladas</label>
        <input className="input" type="number" name="hectares" value={data.hectares} onChange={handleChange} placeholder="Ej: 10" />
      </div>
      <div className="formGroup">
        <label className="label">Plan de Vuelo</label>
        <select className="select" name="plan" value={data.plan} onChange={handleChange}>
          <option value="libre">Libre</option>
          <option value="programado">Programado</option>
        </select>
      </div>
      <div className="formGroup">
        <label className="label">Observaciones del Vuelo</label>
        <textarea className="textarea" name="observations" value={data.observations} onChange={handleChange}></textarea>
      </div>
      <div className="submitContainer">
        <button className="button btn-primary" type="submit">Guardar Módulo Drone</button>
      </div>
    </form>
  );
};

export default TechnicianModuleDrone;