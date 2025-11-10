// En: src/views/FincaRegistration/FincaRegistration.jsx
// --- ARCHIVO COMPLETO PREPARADO PARA CREAR Y EDITAR ---

import React, { useState, useEffect, useMemo } from 'react';
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
  const [mapInstanceKey, setMapInstanceKey] = useState(() => (
    fincaToEdit ? `edit-${fincaToEdit.id}` : 'new'
  ));

  // useEffect para rellenar o limpiar el formulario según el modo
  useEffect(() => {
    if (isEditMode && fincaToEdit) {
      setFincaName(fincaToEdit.name || '');
      setHectares(
        fincaToEdit.hectares !== undefined && fincaToEdit.hectares !== null
          ? String(fincaToEdit.hectares)
          : ''
      );
      setLoteCount(
        Array.isArray(fincaToEdit.lotes)
          ? String(fincaToEdit.lotes.length)
          : ''
      );
      setLocation(fincaToEdit.location || null);
      setMapInstanceKey(`edit-${fincaToEdit.id}`);
    } else {
      setFincaName('');
      setHectares('');
      setLoteCount('');
      setLocation(null);
      setMapInstanceKey('new');
    }
  }, [isEditMode, fincaToEdit]);

  const handleResetForm = () => {
    if (isEditMode && fincaToEdit) {
      setFincaName(fincaToEdit.name || '');
      setHectares(
        fincaToEdit.hectares !== undefined && fincaToEdit.hectares !== null
          ? String(fincaToEdit.hectares)
          : ''
      );
      setLoteCount(
        Array.isArray(fincaToEdit.lotes)
          ? String(fincaToEdit.lotes.length)
          : ''
      );
      setLocation(fincaToEdit.location || null);
      setMapInstanceKey(`edit-${fincaToEdit.id}-reset-${Date.now()}`);
    } else {
      setFincaName('');
      setHectares('');
      setLoteCount('');
      setLocation(null);
      setMapInstanceKey(`new-${Date.now()}`);
    }
  };

  const hectaresNumber = useMemo(() => {
    const parsed = parseFloat(hectares);
    return Number.isFinite(parsed) ? parsed : null;
  }, [hectares]);

  const lotesNumber = useMemo(() => {
    const parsed = parseInt(loteCount, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }, [loteCount]);

  const averageLotSize = useMemo(() => {
    if (!hectaresNumber || !lotesNumber || lotesNumber <= 0) {
      return null;
    }
    const precision = lotesNumber >= 10 ? 1 : 2;
    return (hectaresNumber / lotesNumber).toFixed(precision);
  }, [hectaresNumber, lotesNumber]);

  const lotsPreview = useMemo(() => {
    if (!lotesNumber || lotesNumber <= 0) {
      return [];
    }
    const previewLength = Math.min(lotesNumber, 6);
    return Array.from({ length: previewLength }, (_, index) => `Lote ${index + 1}`);
  }, [lotesNumber]);

  const hasGeneralInfo = Boolean(fincaName.trim()) && Boolean(hectares) && Boolean(loteCount);
  const hasLocation = Boolean(location);
  const isReadyToSubmit = hasGeneralInfo && hasLocation;

  const progressSteps = useMemo(
    () => [
      {
        title: 'Información base',
        description: 'Nombre, hectáreas y número de lotes',
        status: hasGeneralInfo ? 'complete' : 'active',
      },
      {
        title: 'Ubicación georreferenciada',
        description: 'Fija el pin sobre la entrada principal',
        status: hasLocation ? 'complete' : hasGeneralInfo ? 'active' : 'pending',
      },
      {
        title: 'Revisión final',
        description: 'Verifica los datos antes de guardar',
        status: isReadyToSubmit ? 'active' : 'pending',
      },
    ],
    [hasGeneralInfo, hasLocation, isReadyToSubmit]
  );

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

  const formattedHectares = hectaresNumber ? new Intl.NumberFormat('es-EC', {
    maximumFractionDigits: 2,
  }).format(hectaresNumber) : '--';

  const formattedAverageLotSize = averageLotSize
    ? new Intl.NumberFormat('es-EC', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Number(averageLotSize))
    : '--';

  return (
    <div className="container finca-registration">
      <div className="finca-registration__header">
        <button
          className="button button-secondary finca-registration__back-button"
          onClick={() => onNavigate('producerProfile')}
          type="button"
        >
          <Icon path={ICONS.back} /> Volver a Mis Fincas
        </button>

        <div className="finca-registration__titles">
          <h1 className="finca-registration__title">
            {isEditMode ? 'Modificar Finca' : 'Registrar nueva finca'}
          </h1>
          <p className="finca-registration__subtitle">
            Completa los datos clave para mantener tu inventario de predios actualizado y alineado con la información del sidebar.
          </p>
        </div>
      </div>

      <div className="finca-registration__progress" aria-label="Progreso del registro de finca">
        {progressSteps.map((step, index) => (
          <div
            key={step.title}
            className={`finca-registration__progress-step finca-registration__progress-step--${step.status}`}
          >
            <span className="finca-registration__step-index">
              {step.status === 'complete' ? (
                <Icon path={ICONS.checkCircle} size={18} />
              ) : (
                index + 1
              )}
            </span>
            <div className="finca-registration__step-text">
              <span className="finca-registration__step-title">{step.title}</span>
              <span className="finca-registration__step-description">{step.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="finca-registration__layout">
        <form onSubmit={handleSubmit} className="finca-registration__form" noValidate>
          <section className="finca-registration__card">
            <div className="finca-registration__card-header">
              <span className="finca-registration__card-header-icon">
                <Icon path={ICONS.users} size={22} />
              </span>
              <div>
                <h2 className="finca-registration__section-title">Información general</h2>
                <p className="finca-registration__section-subtitle">
                  Estos datos alimentan los reportes productivos y el resumen de la barra lateral.
                </p>
              </div>
            </div>

            <div className="finca-registration__form-grid">
              <Input
                label="Nombre de la finca"
                name="fincaName"
                value={fincaName}
                onChange={(e) => setFincaName(e.target.value)}
                placeholder="Ej: Hacienda El Sol"
                required
              />
              <Input
                label="Hectáreas totales"
                name="hectares"
                type="number"
                min="0"
                step="0.01"
                value={hectares}
                onChange={(e) => setHectares(e.target.value)}
                placeholder="Ej: 120"
                required
              />
              <Input
                label="Número total de lotes"
                name="loteCount"
                type="number"
                min="1"
                step="1"
                value={loteCount}
                onChange={(e) => setLoteCount(e.target.value)}
                placeholder="Ej: 15"
                required
              />
            </div>

            <p className="finca-registration__helper-text">
              Recomendación: usa los datos oficiales de catastro o escrituras para garantizar consistencia entre módulos.
            </p>
          </section>

          <section className="finca-registration__card">
            <div className="finca-registration__card-header">
              <span className="finca-registration__card-header-icon">
                <Icon path={ICONS.location} size={22} />
              </span>
              <div>
                <h2 className="finca-registration__section-title">Ubicación geográfica</h2>
                <p className="finca-registration__section-subtitle">
                  Arrastra el mapa hasta posicionar el pin en la entrada principal de la finca y confirma para fijar las coordenadas.
                </p>
              </div>
            </div>

            <div className="finca-registration__map">
              <MapPinSelector
                key={mapInstanceKey}
                onLocationSet={setLocation}
                initialLocation={isEditMode ? fincaToEdit?.location ?? null : null}
              />
            </div>

            {location ? (
              <div className="finca-registration__location-feedback">
                <Icon path={ICONS.checkCircle} size={18} />
                Ubicación fijada: {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
              </div>
            ) : (
              <div className="finca-registration__map-hint">
                <Icon path={ICONS.info} size={18} />
                Asegúrate de fijar la ubicación para habilitar el botón de guardado.
              </div>
            )}
          </section>

          <section className="finca-registration__card finca-registration__card--summary">
            <div className="finca-registration__card-header">
              <span className="finca-registration__card-header-icon">
                <Icon path={ICONS.report} size={22} />
              </span>
              <div>
                <h2 className="finca-registration__section-title">Resumen previo al guardado</h2>
                <p className="finca-registration__section-subtitle">
                  Revisa la información para asegurarte de que los datos estén listos antes de registrarlos.
                </p>
              </div>
            </div>

            <div className="finca-registration__summary-grid">
              <div className="finca-registration__summary-item">
                <span className="finca-registration__summary-label">Nombre</span>
                <span className="finca-registration__summary-value">{fincaName || 'Sin definir'}</span>
              </div>
              <div className="finca-registration__summary-item">
                <span className="finca-registration__summary-label">Hectáreas</span>
                <span className="finca-registration__summary-value">{formattedHectares}</span>
              </div>
              <div className="finca-registration__summary-item">
                <span className="finca-registration__summary-label">Total de lotes</span>
                <span className="finca-registration__summary-value">{lotesNumber || '--'}</span>
              </div>
              <div className="finca-registration__summary-item">
                <span className="finca-registration__summary-label">Área promedio por lote</span>
                <span className_Name="finca-registration__summary-value">{averageLotSize ? `${formattedAverageLotSize} ha` : '--'}</span>
              </div>
              <div className="finca-registration__summary-item">
                <span className="finca-registration__summary-label">Coordenadas</span>
                <span className="finca-registration__summary-value">
                  {location
                    ? `${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`
                    : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="finca-registration__lots-preview">
              {lotsPreview.length > 0 ? (
                <>
                  <span className="finca-registration__lots-preview-label">Lotes generados:</span>
                  <div className="finca-registration__chip-group">
                    {lotsPreview.map((lote) => (
                      <span key={lote} className="finca-registration__chip">{lote}</span>
                    ))}
                    {lotesNumber && lotesNumber > lotsPreview.length && (
                      <span className="finca-registration__chip finca-registration__chip--muted">
                        +{lotesNumber - lotsPreview.length} más
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="finca-registration__lots-preview-empty">
                  Define el número de lotes para generar los identificadores automáticamente.
                </span>
              )}
            </div>

            <div className="finca-registration__actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={handleResetForm}
              >
                <Icon path={ICONS.reload} size={18} />
                Restablecer
              </button>
              <button
                className="button btn-primary"
                type="submit"
                disabled={!isReadyToSubmit}
              >
                <Icon path={ICONS.checkCircle} size={18} />
                {isEditMode ? 'Guardar cambios' : 'Registrar finca'}
              </button>
            </div>
          </section>
        </form>

        <aside className="finca-registration__aside">
          <div className="finca-registration__aside-card">
            <h3 className="finca-registration__aside-title">Checklist rápido</h3>
            <ul className="finca-registration__tip-list">
              <li className="finca-registration__tip-item">
                <span className="finca-registration__tip-icon">
                  <Icon path={ICONS.checkCircle} size={16} />
                </span>
                <div>
                  <p className="finca-registration__tip-title">Confirma la titularidad</p>
                  <p className="finca-registration__tip-description">
                    Usa la información del último registro catastral para evitar discrepancias con auditorías.
                  </p>
                </div>
              </li>
              <li className="finca-registration__tip-item">
                <span className="finca-registration__tip-icon">
                  <Icon path={ICONS.users} size={16} />
                </span>
                <div>
                  <p className="finca-registration__tip-title">Comparte el plano con tu equipo</p>
                  <p className="finca-registration__tip-description">
                    El número de lotes facilita asignar tareas y turnos a los trabajadores en otros módulos.
                  </p>
                </div>
              </li>
              <li className="finca-registration__tip-item">
                <span className="finca-registration__tip-icon">
                  <Icon path={ICONS.info} size={16} />
                </span>
                <div>
                  <p className="finca-registration__tip-title">Verifica en el mapa</p>
                  <p className="finca-registration__tip-description">
                    Ajusta el pin con zoom para asegurar coordenadas precisas antes de guardar.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="finca-registration__aside-card finca-registration__aside-card--accent">
            <div className="finca-registration__aside-highlight">
              <span className="finca-registration__highlight-icon">
                <Icon path={ICONS.location} size={18} />
              </span>
              <div>
                <p className="finca-registration__highlight-title">Estado de georreferenciación</p>
                <p className="finca-registration__highlight-subtitle">
                  {location
                    ? 'La finca cuenta con coordenadas listas para sincronizar con el resto de módulos.'
                    : 'Aún falta fijar la ubicación en el mapa para completar el registro.'}
                </p>
              </div>
            </div>

            {location && (
              <div className="finca-registration__highlight-coordinates">
                <span>Lat: {location.lat.toFixed(5)}</span>
                <span>Lon: {location.lon.toFixed(5)}</span>
              </div>
            )}

            <p className="finca-registration__aside-footer">
              Esta información alimenta las alertas climáticas y las rutas de inspección en el sidebar.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FincaRegistration;