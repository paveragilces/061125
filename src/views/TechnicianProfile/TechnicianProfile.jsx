import React, { useState } from 'react';
import { TECHNICIAN_SPECIALTIES } from '../../data/constants';
import './TechnicianProfile.css';

/**
 * NUEVA VISTA: Perfil del Técnico
 * Permite al técnico ver su información y actualizar sus especialidades.
 */
const TechnicianProfile = ({ currentUser, onSaveProfile }) => {
  // Estado local para manejar los checkboxes
  const [mySkills, setMySkills] = useState(currentUser.specialties || []);

  const handleToggleSkill = (skill) => {
    setMySkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(mySkills);
  };

  return (
    <div className="container">
      <h1 className="h1">Mi Perfil de Técnico</h1>
      
      <div className="profileInfoCard">
        <h2 className="h2">{currentUser.name}</h2>
        <p><strong>Zona Asignada:</strong> {currentUser.zone}</p>
        <p><strong>ID de Técnico:</strong> {currentUser.id}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="h2">Mis Especialidades</h2>
        <p>Selecciona las áreas en las que tienes experiencia certificada.</p>
        
        <div className="specialtyGrid">
          {TECHNICIAN_SPECIALTIES.map(skill => (
            <div key={skill} className="checkboxItem">
              <label className="checkboxLabel">
                <input
                  type="checkbox"
                  checked={mySkills.includes(skill)}
                  onChange={() => handleToggleSkill(skill)}
                  className="checkboxInput"
                />
                {skill}
              </label>
            </div>
          ))}
        </div>

        <hr className="formDivider" />

        <button className="button btn-primary" type="submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default TechnicianProfile;