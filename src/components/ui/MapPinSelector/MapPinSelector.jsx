import React, { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Icon from '../Icon';
// --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
import { ICONS } from '../../../config/icons'; 
import './MapPinSelector.css';

// Centro inicial (Guayaquil, Ecuador)
const defaultCenter = [-2.170998, -79.922356]; // Leaflet usa [lat, lon]
const defaultZoom = 13;

/**
 * NUEVO COMPONENTE: MapPinSelector (Versión Leaflet)
 * Usa react-leaflet para un mapa real con un pin central fijo.
 * El usuario mueve el mapa, no el pin.
 */
const MapPinSelector = ({ onLocationSet }) => {
  const [position, setPosition] = useState(defaultCenter);
  const [locationFixed, setLocationFixed] = useState(false);

  // Callback para cuando el usuario SUELTA el mapa
  const onMoveEnd = useCallback((e) => {
    const newCenter = e.target.getCenter();
    setPosition([newCenter.lat, newCenter.lng]);
  }, []);

  // Fija la ubicación y la envía al formulario
  const handleFixLocation = () => {
    const finalCoords = {
      lat: parseFloat(position[0].toFixed(6)),
      lon: parseFloat(position[1].toFixed(6)) // Usamos 'lon'
    };
    onLocationSet(finalCoords);
    setLocationFixed(true);
  };

  // Resetea la ubicación para seleccionar de nuevo
  const handleResetLocation = () => {
    onLocationSet(null);
    setLocationFixed(false);
  };

  if (locationFixed) {
    return (
      <div className="mapPinContainer locationFeedback success">
        <Icon path={ICONS.checkCircle} size={24} />
        <div>
          <strong>Ubicación Fijada:</strong>
          <p>Lat: {position[0].toFixed(6)}, Lon: {position[1].toFixed(6)}</p>
          <button type="button" className="button button-secondary" onClick={handleResetLocation}>
            Seleccionar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mapPinContainer">
      {/* El mapa real */}
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        className="leaflet-container"
        // Leaflet no tiene un onDragEnd simple, usamos moveend
        onMoveEnd={onMoveEnd}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Capa de Satélite Opcional (se puede descomentar si se prefiere) */}
        {/* <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        /> */}
      </MapContainer>

      {/* El Pin Fijo en el Centro */}
      <div className="mapPinCenter">
        <Icon path={ICONS.location} size={48} color="#d9534f" />
      </div>
      
      <div className="mapInstructions">
        <p>Arrastra el mapa para ubicar el pin en la entrada de tu finca.</p>
      </div>
      
      <button 
        type="button" 
        className="button btn-primary" 
        onClick={handleFixLocation}
      >
        Fijar Ubicación
      </button>
    </div>
  );
};

export default MapPinSelector;