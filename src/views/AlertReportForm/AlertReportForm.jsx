import React, { useMemo, useState } from 'react';
import FileUploadButton from '../../components/ui/FileUploadButton';
import MapPinSelector from '../../components/ui/MapPinSelector/MapPinSelector';
import Button from '../../components/ui/Button';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bug,
  Camera,
  CheckCircle,
  Home,
  Image as ImageIcon,
  Leaf,
  List,
  MapPin,
  Star,
  UploadCloud,
  User,
  X, // <-- Icono añadido para Cancelar y Modal
} from 'lucide-react';
import { ALERT_SYMPTOMS_DATA } from '../../data/constants';
import './AlertReportForm.css';

// --- Componente de Modal de Vista Previa de Imagen ---
const ImagePreviewModal = ({ src, onClose }) => (
  <div className="image-preview-backdrop" onClick={onClose}>
    <div className="image-preview-content">
      <button className="image-preview-close" onClick={onClose}>
        {/* --- CAMBIO: Icono de Lucide --- */}
        <X size={24} color="#fff" />
      </button>
      <img src={src} alt="Vista previa de evidencia" />
    </div>
  </div>
);

// --- Lista de Meses ---
const MONTHS = [
  { value: 'all', label: 'Todos los meses' },
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
];

// --- CAMBIO: Se añade 'onNavigate' a las props ---
const AlertReportForm = ({ producer, onSubmitAlert, onNavigate }) => {
  const fincas = producer.fincas || [];

  const [selectedFincaId, setSelectedFincaId] = useState(fincas[0]?.id || '');
  const [selectedLote, setSelectedLote] = useState('');
  const [selectedParts, setSelectedParts] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [photos, setPhotos] = useState({});
  const [location, setLocation] = useState(null);
  
  // --- CORRECCIÓN: Estado para el modal (estaba faltando) ---
  const [previewImage, setPreviewImage] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Ubicación', description: 'Selecciona la finca y el lote', icon: MapPin },
    { id: 2, title: 'Síntomas', description: 'Describe la afectación observada', icon: Leaf },
    { id: 3, title: 'Evidencia', description: 'Adjunta fotos y fija la ubicación', icon: Camera },
  ];

  const selectedFinca = fincas.find(f => f.id === selectedFincaId);
  const lotes = selectedFinca?.lotes || [];

  const selectedPartsList = useMemo(
    () => Object.keys(selectedParts).filter(part => selectedParts[part]),
    [selectedParts]
  );

  const photosLoaded = useMemo(
    () => selectedPartsList.reduce((count, part) => (photos[part] ? count + 1 : count), 0),
    [photos, selectedPartsList]
  );

  const completedSteps = useMemo(
    () => [
      selectedFincaId && selectedLote,
      symptoms.length > 0,
      location !== null,
    ].filter(Boolean).length,
    [location, selectedFincaId, selectedLote, symptoms]
  );

  const handleFincaChange = (e) => {
    setSelectedFincaId(e.target.value);
    setSelectedLote('');
  };

  const handlePartToggle = (part) => {
    const newParts = { ...selectedParts, [part]: !selectedParts[part] };
    setSelectedParts(newParts);
    if (!newParts[part]) {
      const symptomsOfPart = ALERT_SYMPTOMS_DATA[part] || [];
      setSymptoms(prev => prev.filter(s => !symptomsOfPart.includes(s)));
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handlePhotoUpload = (part, fileData) => {
    setPhotos(prev => ({ ...prev, [part]: fileData }));
  };

  // --- CORRECCIÓN: Función para el modal (estaba faltando) ---
  const handleImageClick = (e, photoSrc) => {
    e.stopPropagation();
    setPreviewImage(photoSrc);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finca = fincas.find(f => f.id === selectedFincaId);
    const alertData = {
      producerId: producer.id,
      fincaId: selectedFincaId,
      lote: selectedLote,
      farmName: finca ? finca.name : 'Finca Desconocida',
      date: new Date().toISOString().split('T')[0],
      parts: selectedParts,
      symptoms,
      photos: photos,
      location,
      status: 'pending',
      priority: null,
    };
    onSubmitAlert(alertData);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStep1Complete = selectedFincaId && selectedLote;
  const isStep2Complete = symptoms.length > 0;
  const isStep3Complete = location !== null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-section">
            <div className="step-header">
              <span className="step-badge">Paso 1</span>
              <h2>Ubicación de la alerta</h2>
              <p>Elige la finca y el lote donde detectaste la anomalía.</p>
            </div>
            <div className="field-grid">
              <div className="field-group">
                <label className="field-label" htmlFor="fincaSelect">Finca</label>
                <div className="input-with-icon">
                  <Home size={18} aria-hidden />
                  <select id="fincaSelect" className="modern-select" value={selectedFincaId} onChange={handleFincaChange}>
                    {fincas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <p className="field-hint">{`Mostrando ${fincas.length} finca(s) asociadas.`}</p>
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="loteSelect">Lote</label>
                <div className={`input-with-icon ${!selectedLote ? 'is-empty' : ''}`}>
                  <List size={18} aria-hidden />
                  <select
                    id="loteSelect"
                    className="modern-select"
                    value={selectedLote}
                    onChange={(e) => setSelectedLote(e.target.value)}
                    disabled={lotes.length === 0}
                  >
                    <option value="">{lotes.length > 0 ? 'Selecciona un lote…' : 'Selecciona una finca primero'}</option>
                    {lotes.map(lote => <option key={lote} value={lote}>{lote}</option>)}
                  </select>
                </div>
                <p className="field-hint">
                  {selectedFinca ? `${selectedFinca.lotes.length} lotes disponibles en ${selectedFinca.name}.` : 'Selecciona una finca para ver sus lotes.'}
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-section">
            <div className="step-header">
              <span className="step-badge">Paso 2</span>
              <h2>Describe la afectación</h2>
              <p>Selecciona las partes de la planta comprometidas y los síntomas observados.</p>
            </div>

            <div className="field-group">
              <span className="field-label">Partes de la planta</span>
              <div className="chip-list">
                {Object.keys(ALERT_SYMPTOMS_DATA).map(part => {
                  const isActive = !!selectedParts[part];
                  return (
                    <label key={part} className={`chip ${isActive ? 'is-active' : ''}`}>
                      <input
                        type="checkbox"
                        className="chip-input"
                        checked={isActive}
                        onChange={() => handlePartToggle(part)}
                      />
                      <Leaf size={16} aria-hidden />
                      <span>{part}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {selectedPartsList.length > 0 ? (
              <div className="field-group">
                <span className="field-label">Síntomas específicos</span>
                <div className="chip-list symptoms">
                  {selectedPartsList.map(part => (
                    ALERT_SYMPTOMS_DATA[part].map(symptom => {
                      const isSelected = symptoms.includes(symptom);
                      return (
                        <label key={`${part}-${symptom}`} className={`chip chip-compact ${isSelected ? 'is-active' : ''}`}>
                          <input
                            type="checkbox"
                            className="chip-input"
                            checked={isSelected}
                            onChange={() => handleSymptomToggle(symptom)}
                          />
                          <Bug size={15} aria-hidden />
                          <span>{symptom}</span>
                        </label>
                      );
                    })
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <AlertTriangle size={18} aria-hidden />
                <span>Selecciona al menos una parte afectada para mostrar los síntomas sugeridos.</span>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="step-section">
            <div className="step-header">
              <span className="step-badge">Paso 3</span>
              <h2>Evidencia y geolocalización</h2>
              <p>Adjunta fotografías opcionales y fija la ubicación exacta en el mapa.</p>
            </div>

            <div className="field-group">
              <span className="field-label with-icon">
                <UploadCloud size={18} aria-hidden /> Evidencia fotográfica
              </span>
              <p className="field-hint">Las imágenes ayudan al equipo técnico a priorizar la atención de forma más precisa.</p>
              <div className="evidence-grid">
                {selectedPartsList.length > 0 ? (
                  selectedPartsList.map(part => (
                    <div className="evidence-card" key={`photo-${part}`}>
                      <div className="evidence-header">
                        <div className="evidence-icon">
                          <Camera size={18} aria-hidden />
                        </div>
                        <div>
                          <h3>Foto de {part}</h3>
                          <p>Opcional · Formato JPG o PNG</p>
                        </div>
                      </div>
                      <FileUploadButton
                        label={`Adjuntar foto de ${part}`}
                        onUpload={(file) => handlePhotoUpload(part, file)}
                        evidenceLoaded={!!photos[part]}
                      />
                      {photos[part] ? (
                        <div className="evidence-preview">
                          <div className="preview-image">
                            <img
                              src={photos[part]}
                              alt={`Evidencia de ${part}`}
                              onClick={(e) => handleImageClick(e, photos[part])}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                          <div className="preview-status">
                            <CheckCircle size={16} aria-hidden />
                            <span>Listo para enviar</span>
                          </div>
                        </div>
                      ) : (
                        <div className="evidence-placeholder">
                          <ImageIcon size={18} aria-hidden />
                          <span>Aún no se adjunta foto</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <AlertTriangle size={18} aria-hidden />
                    <span>Selecciona partes afectadas en el paso anterior para habilitar la carga de fotografías.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="field-group">
              <span className="field-label with-icon">
                <MapPin size={18} aria-hidden /> Geolocalización
              </span>
              <p className="field-hint">Ubica el punto exacto para que el técnico llegue con precisión.</p>
              <div className="map-block">
                <MapPinSelector
                  onLocationSet={setLocation}
                  initialLocation={selectedFinca?.location}
                />
              </div>
              <div className={`map-status ${location ? 'is-complete' : 'is-pending'}`}>
                {location ? <CheckCircle size={16} aria-hidden /> : <AlertTriangle size={16} aria-hidden />}
                <span>
                  {location
                    ? `Ubicación fijada: Lat ${location.lat.toFixed(6)}, Lon ${location.lon.toFixed(6)}`
                    : 'Ubicación pendiente. Haz clic en el mapa para establecerla.'}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const summaryItems = [
    {
      id: 'finca',
      icon: MapPin,
      label: 'Finca seleccionada',
      value: selectedFinca ? selectedFinca.name : 'Selecciona una finca para comenzar',
      completed: !!selectedFinca,
    },
    {
      id: 'lote',
      icon: List,
      label: 'Lote',
      value: selectedLote || 'Aún no has elegido un lote',
      completed: !!selectedLote,
    },
    {
      id: 'parts',
      icon: Leaf,
      label: 'Partes afectadas',
      value: selectedPartsList.length ? selectedPartsList.join(', ') : 'Sin registros por ahora',
      completed: selectedPartsList.length > 0,
    },
    {
      id: 'symptoms',
      icon: Bug,
      label: 'Síntomas reportados',
      value: symptoms.length ? symptoms.join(', ') : 'Selecciona los síntomas observados',
      completed: symptoms.length > 0,
    },
    {
      id: 'photos',
      icon: Camera,
      label: 'Evidencia fotográfica',
      value: selectedPartsList.length > 0 ? `${photosLoaded}/${selectedPartsList.length} fotos` : 'Selecciona partes para adjuntar fotos',
      completed: photosLoaded > 0,
    },
    {
      id: 'location',
      icon: location ? CheckCircle : AlertTriangle,
      label: 'Ubicación georreferenciada',
      value: location ? `Lat ${location.lat.toFixed(5)}, Lon ${location.lon.toFixed(5)}` : 'Fija el punto en el mapa para continuar',
      completed: !!location,
    },
  ];

  const progressValue = Math.round((completedSteps / steps.length) * 100);

  const calloutState = currentStep === 3 && !isStep3Complete
    ? 'warning'
    : (currentStep === 2 && !isStep2Complete) || (currentStep === 1 && !isStep1Complete)
      ? 'info'
      : 'success';

  const calloutMessage = (() => {
    if (currentStep === 3 && !isStep3Complete) {
      return 'Fija la ubicación en el mapa para habilitar el envío del reporte.';
    }
    if (currentStep === 2 && !isStep2Complete) {
      return 'Selecciona al menos un síntoma para continuar al paso final.';
    }
    if (currentStep === 1 && !isStep1Complete) {
      return 'Elige la finca y el lote para desbloquear el siguiente paso.';
    }
    return '¡Excelente! Todo listo para enviar la alerta.';
  })();

  return (
    <div className="container alert-report-form">
      {previewImage && (
        <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
      )}

      <div className="alert-report-hero">
        <div className="hero-content">
          <span className="hero-badge">
            <Star size={16} aria-hidden /> Nuevo reporte de alerta
          </span>
          <h1 className="hero-title">Reportar nueva alerta</h1>
          <p className="hero-description">
            Completa los pasos para compartir la información clave con nuestro equipo técnico.
          </p>
        </div>
        {/* --- CAMBIO: Tarjeta de productor eliminada --- */}
      </div>

      <form onSubmit={handleSubmit} className="alert-report-content">
        <div className="alert-report-layout">
          <section className="alert-report-panel">
            {/* --- CAMBIO: Stepper movido aquí --- */}
            <div className="alert-report-stepper">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const status = index + 1 < currentStep ? 'completed' : index + 1 === currentStep ? 'current' : 'upcoming';
                return (
                  <div key={step.id} className={`step-card ${status}`}>
                    <div className="step-marker">
                      {status === 'completed' ? <CheckCircle size={18} aria-hidden /> : index + 1}
                    </div>
                    <div className="step-text">
                      <div className="step-title">
                        <StepIcon size={18} aria-hidden />
                        <span>{step.title}</span>
                      </div>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* --- Fin del Stepper --- */}

            {renderStepContent()}
          </section>
          
          <aside className="alert-report-summary">
            <div className="summary-header">
              <Star size={18} aria-hidden />
              <div>
                <h3>Resumen del reporte</h3>
                <p>Visualiza el avance y confirma la información clave.</p>
              </div>
            </div>
            <div className="summary-progress">
              <div className="progress-header">
                <span>Progreso</span>
                <span>{progressValue}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressValue}%` }}></div>
              </div>
            </div>
            <div className={`summary-callout ${calloutState}`}>
              {calloutState === 'success' ? <CheckCircle size={16} aria-hidden /> : <AlertTriangle size={16} aria-hidden />}
              <span>{calloutMessage}</span>
            </div>
            <ul className="summary-list">
              {summaryItems.map(item => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.id} className={`summary-item ${item.completed ? 'is-complete' : ''}`}>
                    <div className="summary-icon">
                      <ItemIcon size={18} aria-hidden />
                    </div>
                    <div className="summary-text">
                      <span className="summary-label">{item.label}</span>
                      <span className="summary-value">{item.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        <div className="formActions">
          {/* --- CAMBIO: Botón Cancelar añadido --- */}
          <Button
            type="button"
            variant="secondary" // Usamos 'secondary' para que parezca un botón
            className="button-cancel" // Clase extra para el color rojo en hover
            onClick={() => onNavigate('producerAlertList')}
          >
            <X size={16} aria-hidden /> Cancelar
          </Button>

          {/* --- CAMBIO: Wrapper para botones de navegación --- */}
          <div className="step-navigation">
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft size={16} aria-hidden /> Paso anterior
            </Button>

            {currentStep < 3 && (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                disabled={(currentStep === 1 && !isStep1Complete) || (currentStep === 2 && !isStep2Complete)}
                title={
                  (currentStep === 1 && !isStep1Complete) ? 'Debe seleccionar finca y lote' :
                  (currentStep === 2 && !isStep2Complete) ? 'Debe seleccionar al menos un síntoma' :
                  'Siguiente paso'
                }
              >
                Continuar <ArrowRight size={16} aria-hidden />
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                type="submit"
                variant="primary"
                disabled={!isStep3Complete}
                title={!isStep3Complete ? 'Debe fijar la ubicación en el mapa' : 'Enviar reporte'}
              >
                Enviar reporte <CheckCircle size={16} aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AlertReportForm;