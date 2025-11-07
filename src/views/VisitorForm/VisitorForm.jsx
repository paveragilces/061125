import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './VisitorForm.css';

/**
 * Formulario de Ingreso de Visitante
 */
const VisitorForm = ({ onNavigate, onSubmitVisitRequest, producers }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    reason: '',
    type: 'Otro',
    producerId: 'p1',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitVisitRequest(formData);
  };

  const visitorTypes = [
    'Entrega cartón',
    'Entrega agroinsumos',
    'Fumigación',
    'Mantenimiento',
    'Trabajador cuadrilla',
    'Trabajador recurrente',
    'Técnico Palmar',
    'Visita administrativa',
    'Otro'
  ];

  return (
    <div className="loginBox" style={{ textAlign: 'left', width: '500px' }}>
      <h1 className="h1" style={{ textAlign: 'center' }}>Solicitud de Ingreso</h1>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label className="label">Finca a Visitar</label>
          <select className="select" name="producerId" value={formData.producerId} onChange={handleChange} required>
            {producers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Nombre Completo</label>
          <input className="input" type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label className="label">Empresa</label>
          <input className="input" type="text" name="company" value={formData.company} onChange={handleChange} required />
        </div>

        <div className="formGroup">
          <label className="label">Fecha de Visita</label>
          <div className="dateInputContainer">
            <input
              className="input dateInput"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <div className="dateInputIcon">
              <Icon path={ICONS.calendar} size={18} />
            </div>
          </div>
        </div>

        <div className="formGroup">
          <label className="label">Tipo de Visitante</label>
          <select className="select" name="type" value={formData.type} onChange={handleChange} required>
            {visitorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Motivo Detallado</label>
          <textarea className="textarea" name="reason" value={formData.reason} onChange={handleChange} required></textarea>
        </div>

        <div className="formActions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => onNavigate('login')}
          >
            Cancelar
          </button>
          <button className="button btn-primary" type="submit">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;