// En: src/views/FincaRegistration/FincaRegistration.jsx
// --- ARCHIVO COMPLETO PREPARADO PARA CREAR Y EDITAR ---

import React, { useState, useEffect } from 'react';
import Icon from '../../components/ui/Icon';
import Input from '../../components/ui/Input';
import MapPinSelector from '../../components/ui/MapPinSelector/MapPinSelector';
import { ICONS } from '../../config/icons';
import './FincaRegistration.css'; // <-- Corregido

/**
 * VISTA: FincaRegistration
 * Formulario para REGISTRAR o MODIFICAR una finca.
 */
const FincaRegistration = ({ 
  onRegisterFinca, 
  onUpdateFinca,  // <-- Nueva prop para guardar cambios
  onNavigate, 
  setModal,
  fincaToEdit = null // <-- Prop para recibir la finca a editar
}) => {
  
  const isEditMode = Boolean(fincaToEdit);

  const [fincaName, setFincaName] = useState('');
  const [hectares, setHectares] = useState('');
  const [loteCount, setLoteCount] = useState('');
  const [location, setLocation] = useState(null);

  // useEffect para rellenar el formulario si estamos editando
  useEffect(() => {
    if (isEditMode) {
      setFincaName(fincaToEdit.name);
      setHectares(fincaToEdit.hectares);
      setLoteCount(fincaToEdit.lotes.length); 
      setLocation(fincaToEdit.location);
    }
  }, [fincaToEdit, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const numLotes = parseInt(loteCount, 10);

    if (!fincaName || !hectares || !location || !numLotes || numLotes <= 0) {
      setModal({
        show: true,
        message: 'Por favor complete todos los campos: Nombre, Hectáreas, un Número de Lotes válido y fije la Ubicación.',
        type: 'error'
      });
      return;
    }

    const generatedLotes = Array.from({ length: numLotes }, (_, i) => `Lote ${i + 1}`);

    const fincaData = {
      name: fincaName,
      hectares: parseFloat(hectares),
      lotes: generatedLotes,
      location,
      id: isEditMode ? fincaToEdit.id : `f${Date.now()}` 
    };

    if (isEditMode) {
      onUpdateFinca(fincaData); // Llama a la nueva función de actualizar
    } else {
      onRegisterFinca(fincaData); // Llama a la función original de registrar
    }
  };

  return (
    <div className="container">
      <button className="button button-secondary" onClick={() => onNavigate('producerProfile')} style={{marginBottom: '15px'}}>
        <Icon path={ICONS.back} /> Volver a Mis Fincas
      </button>
      
      <h1 className="h1">
        {isEditMode ? 'Modificar Finca' : 'Registrar Nueva Finca'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="formGrid">
          <Input
            label="Nombre de la Finca"
            name="fincaName"
            value={fincaName}
            onChange={(e) => setFincaName(e.target.value)}
            placeholder="Ej: Hacienda El Sol"
            required
          />
          <Input
            label="Hectáreas Totales"
            name="hectares"
            type="number"
            value={hectares}
            onChange={(e) => setHectares(e.target.value)}
            placeholder="Ej: 120"
            required
          />
          <Input
            label="Número Total de Lotes"
            name="loteCount"
            type="number"
            value={loteCount}
            onChange={(e) => setLoteCount(e.target.value)}
            placeholder="Ej: 15"
            required
          />
        </div>

        <h2 className="h2">Ubicación de la Finca</h2>
        <p>Arrastra el mapa y presiona "Fijar Ubicación" cuando el pin esté sobre la entrada principal de la finca.</p>
        
        <MapPinSelector 
          key={fincaToEdit ? fincaToEdit.id : 'new'} 
          onLocationSet={setLocation} 
          initialLocation={isEditMode ? fincaToEdit.location : null}
        />

        {location && (
          <div className="location-feedback">
            <Icon path={ICONS.checkCircle} />
            Ubicación fijada con éxito: {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
          </div>
        )}

        <hr className="formDivider" />

        <button className="button btn-primary" type="submit">
          {isEditMode ? 'Guardar Cambios' : 'Guardar Finca'}
        </button>
      </form>
    </div>
  );
};

export default FincaRegistration;