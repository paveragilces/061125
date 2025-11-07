// En: src/views/ProducerProfile/ProducerProfile.jsx
// --- ARCHIVO COMPLETO CON DISEÑO CORREGIDO ---

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import Input from '../../components/ui/Input';
import './ProducerProfile.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * Vista de Perfil del Productor (Mis Fincas)
 */
const ProducerProfile = ({ producer, onNavigate, onEditFinca }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!producer) {
    return <LoadingSpinner message="Cargando perfil del productor..." />;
  }

  const fincasOrdenadas = (producer.fincas || []).sort((a, b) => b.hectares - a.hectares);

  const filteredFincas = fincasOrdenadas.filter(finca =>
    finca.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      {/* --- 1. HEADER CORREGIDO: Título a la izquierda, Botón a la derecha --- */}
      <div className="profileHeader">
        <div>
          <h1 className="h1">Mis Fincas ({fincasOrdenadas.length})</h1>
          <p style={{ fontSize: '18px', marginTop: '-15px' }}>
            Productor: <strong>{producer.owner}</strong>
          </p>
        </div>
        <button
          className="button btn-primary"
          onClick={() => onNavigate('fincaRegistration')}
        >
          <Icon path={ICONS.report} /> Registrar Nueva Finca
        </button>
      </div>

      {/* --- 2. NUEVO CONTENEDOR DE FILTRO: Debajo del header --- */}
      {/* Solo mostramos el buscador si hay fincas que buscar */}
      {fincasOrdenadas.length > 0 && (
        <div className="filterContainer">
          <Input
            name="searchFinca"
            placeholder="Buscar finca por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={ICONS.filter}
          />
        </div>
      )}

      {/* --- 3. Lógica de Renderizado (Sin cambios) --- */}
      {fincasOrdenadas.length === 0 ? (
        <div className="emptyStateCard">
          <Icon path={ICONS.info} size={40} />
          <h2 className="h2">Aún no tienes fincas registradas</h2>
          <p>Haz clic en "Registrar Nueva Finca" para empezar a gestionar tu propiedad.</p>
        </div>
      ) : filteredFincas.length === 0 ? (
        <div className="noResultsCard">
          <Icon path={ICONS.filter} size={40} />
          <h2 className="h2">Sin resultados</h2>
          <p>No se encontró ninguna finca con el nombre "{searchQuery}".</p>
        </div>
      ) : (
        filteredFincas.map(finca => {
          const isLarge = finca.hectares > 100;
          const cardClassName = `fincaCard ${isLarge ? 'fincaCard-large' : ''}`;

          return (
            <div 
              key={finca.id} 
              className={cardClassName}
            >
              <div className="fincaHeader">
                <h2 className="h2">{finca.name}</h2>
                
                <div className="fincaCardActions">
                  <span className="fincaHectares">{finca.hectares} hectáreas</span>
                  <button 
                    className="button button-secondary button-small" 
                    onClick={() => onEditFinca(finca.id)}
                  >
                    <Icon path={ICONS.audit} size={14} /> Modificar
                  </button>
                </div>
              </div>
              
              <div className="fincaDetails">
                <p><strong>ID de Finca:</strong> {finca.id}</p>
                {finca.location && (
                  <p><strong>Ubicación:</strong> Lat: {finca.location.lat.toFixed(6)}, Lon: {finca.location.lon.toFixed(6)}</p>
                )}
                <p>
                  <strong>Total Lotes:</strong> {finca.lotes.length}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProducerProfile;