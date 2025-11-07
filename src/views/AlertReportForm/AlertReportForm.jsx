// En: src/views/AlertReportForm/AlertReportForm.jsx
// --- ESTE ES EL CÓDIGO QUE TÚ PEGaste, ES CORRECTO ---

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import FileUploadButton from '../../components/ui/FileUploadButton';
import InspectionStepper from '../../components/ui/InspectionStepper'; 
import MapPinSelector from '../../components/ui/MapPinSelector/MapPinSelector'; 
import Button from '../../components/ui/Button'; 
import { ICONS } from '../../config/icons';
import { ALERT_SYMPTOMS_DATA } from '../../data/constants';
import './AlertReportForm.css';

const AlertReportForm = ({ producer, onSubmitAlert, setModal }) => {
  const fincas = producer.fincas || [];
  
  const [selectedFincaId, setSelectedFincaId] = useState(fincas[0]?.id || '');
  const [selectedLote, setSelectedLote] = useState('');
  const [selectedParts, setSelectedParts] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [photos, setPhotos] = useState({}); // <-- El estado de fotos SÍ existe
  const [location, setLocation] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { id: '1', name: 'Lugar', icon: ICONS.location },
    { id: '2', name: 'Síntomas', icon: ICONS.disease },
    { id: '3', name: 'Evidencia', icon: ICONS.camera },
  ];

  const selectedFinca = fincas.find(f => f.id === selectedFincaId);
  const lotes = selectedFinca?.lotes || [];

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
    setPhotos(prev => ({ ...prev, [part]: fileData })); // <-- La foto SÍ se guarda en el estado
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
      photos: photos, // <-- ¡¡LA LÍNEA ESTÁ AQUÍ Y ES CORRECTA!!
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
          <div className="formStep">
            <h2 className="h2">Paso 1: ¿Dónde es la alerta?</h2>
            <div className="formGrid">
              <div className="formGroup">
                <label className="label" htmlFor="fincaSelect">1. Seleccione la Finca</label>
                <select id="fincaSelect" className="select" value={selectedFincaId} onChange={handleFincaChange}>
                  {fincas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="formGroup">
                <label className="label" htmlFor="loteSelect">2. Seleccione el Lote</label>
                <select id="loteSelect" className="select" value={selectedLote} onChange={(e) => setSelectedLote(e.target.value)} disabled={lotes.length === 0}>
                  <option value="">{lotes.length > 0 ? 'Seleccione un lote...' : 'Seleccione una finca primero'}</option>
                  {lotes.map(lote => <option key={lote} value={lote}>{lote}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="formStep">
            <h2 className="h2">Paso 2: ¿Qué síntomas observa?</h2>
            <div className="formGroup">
              <label className="label">1. Marque la(s) parte(s) afectada(s) de la planta</label>
              <div className="checkboxGrid">
                {Object.keys(ALERT_SYMPTOMS_DATA).map(part => (
                  <label key={part} className="checkboxItem">
                    <input type="checkbox" className="checkboxInput" checked={!!selectedParts[part]} onChange={() => handlePartToggle(part)} />
                    <span className="checkboxLabel">{part}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {Object.keys(selectedParts).some(part => selectedParts[part]) && (
              <div className="formGroup">
                <label className="label">2. Marque lo(s) síntoma(s) específico(s)</label>
                <div className="checkboxGrid symptoms">
                  {Object.keys(selectedParts).map(part => selectedParts[part] && (
                    ALERT_SYMPTOMS_DATA[part].map(symptom => (
                      <label key={symptom} className="checkboxItem">
                        <input type="checkbox" className="checkboxInput" checked={symptoms.includes(symptom)} onChange={() => handleSymptomToggle(symptom)} />
                        <span className="checkboxLabel">{symptom}</span>
                      </label>
                    ))
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="formStep">
            <h2 className="h2">Paso 3: Evidencia (Fotos y Ubicación)</h2>
            <div className="formGroup">
              <label className="label">1. Adjunte fotos de las partes afectadas (Opcional)</label>
              <div className="photoUploadGrid">
                {Object.keys(selectedParts).filter(part => selectedParts[part]).length > 0 ? (
                  Object.keys(selectedParts).map(part => selectedParts[part] && (
                    <div className="formGroup" key={`photo-${part}`}>
                      <label className="label"><Icon path={ICONS.camera} size={16} /> Foto de: <strong>{part}</strong></label>
                      <FileUploadButton
                        label={`[+] Adjuntar Foto ${part}`}
                        onUpload={(file) => handlePhotoUpload(part, file)}
                        evidenceLoaded={!!photos[part]}
                      />
                      {/* El preview SÍ debería funcionar con esta línea */}
                      {photos[part] && <img src={photos[part]} alt={`Preview ${part}`} className="photoPreview" />}
                    </div>
                  ))
                ) : (
                  <p className="textMuted">Vuelva al Paso 2 y seleccione una parte afectada para habilitar la carga de fotos.</p>
                )}
              </div>
            </div>

            <div className="formGroup">
              <label className="label">2. Fije la ubicación exacta de la planta (Obligatorio)</label>
              <MapPinSelector 
                onLocationSet={setLocation}
                initialLocation={selectedFinca?.location} 
              />
              {location && (
                <p className="locationFeedback">
                  Ubicación de la alerta fijada: Lat {location.lat.toFixed(6)}, Lon {location.lon.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container alert-report-form">
      <h1 className="h1">Reportar Nueva Alerta</h1>
      
      <InspectionStepper 
        currentModule={String(currentStep)}
        modules={{
          '1': { status: currentStep > 1 || (currentStep === 1 && isStep1Complete) ? 'Completado' : 'Pendiente' },
          '2': { status: currentStep > 2 || (currentStep === 2 && isStep2Complete) ? 'Completado' : 'Pendiente' },
          '3': { status: currentStep > 3 || (currentStep === 3 && isStep3Complete) ? 'Completado' : 'Pendiente' },
        }}
        steps={steps} // <-- Pasa los pasos correctos
      />

      <form onSubmit={handleSubmit}>
        
        {renderStepContent()}

        <hr className="formDivider" />

        <div className="formActions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <Icon path={ICONS.back} /> Atrás
          </Button>
          
          {currentStep < 3 && (
            <Button 
              type="button" 
              variant="primary" 
              onClick={nextStep}
              disabled={(currentStep === 1 && !isStep1Complete) || (currentStep === 2 && !isStep2Complete)}
              title={
                (currentStep === 1 && !isStep1Complete) ? "Debe seleccionar finca y lote" : 
                (currentStep === 2 && !isStep2Complete) ? "Debe seleccionar al menos un síntoma" : 
                "Siguiente Paso"
              }
            >
              Siguiente <Icon path={ICONS.chevronDown} style={{ transform: 'rotate(-90deg)' }} />
            </Button>
          )}

          {currentStep === 3 && (
            <Button 
              type="submit" 
              variant="success"
              disabled={!isStep3Complete}
              title={!isStep3Complete ? "Debe fijar la ubicación en el mapa" : "Enviar Reporte"}
            >
              <Icon path={ICONS.approve} /> Enviar Reporte de Alerta
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AlertReportForm;