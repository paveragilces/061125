// src/views/VisitorCheckIn/VisitorCheckIn.jsx
import React, { useState, useRef, useEffect } from 'react'; // Importamos useEffect
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { ICONS } from '../../config/icons';
import { Html5QrcodeScanner } from 'html5-qrcode';
import SignatureCanvas from 'react-signature-canvas';
import PhotoCaptureModal from './PhotoCaptureModal';
import './VisitorCheckIn.css';

const VisitorCheckIn = ({ onNavigate, onScanQr, onCaptureEvidence, setModal }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [photoType, setPhotoType] = useState(null);
  const sigPadRef = useRef(null);
  
  const scannerRegionId = "qr-scanner-region";

  useEffect(() => {
    if (!isScanning) return;
    const html5QrcodeScanner = new Html5QrcodeScanner(scannerRegionId, { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [0] }, false);

    const onScanSuccess = async (qrData, decodedResult) => {
      html5QrcodeScanner.clear().catch(err => console.error("Fallo al limpiar el escáner", err));
      setIsScanning(false);
      try {
        const scanResponse = await onScanQr(qrData);
        let message = '';
        if (scanResponse.status === 'CHECKED_IN') {
          message = `✅ INGRESO REGISTRADO:\n${scanResponse.name} (${scanResponse.company})`;
        } else if (scanResponse.status === 'CHECKED_OUT') {
          message = `🛑 SALIDA REGISTRADA:\n${scanResponse.name} (${scanResponse.company})`;
        }
        setScanResult(scanResponse);
        setModal({ show: true, message: message, type: 'success' });
      } catch (err) {
        setScanResult(null);
        setModal({ show: true, message: err.message, type: 'error' });
      }
    };
    const onScanFailure = (error) => { /* No hacer nada en fallo */ };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrcodeScanner.clear().catch(err => console.error("Fallo al limpiar el escáner al salir", err));
    };
  }, [isScanning, onScanQr, setModal]);

  const handleOpenPhoto = (type) => {
    setPhotoType(type);
    setIsCapturingPhoto(true);
  };

  const handlePhotoCaptured = (dataUrl) => {
    onCaptureEvidence(scanResult.id, photoType, dataUrl);
    setScanResult(prev => ({ ...prev, [photoType]: dataUrl }));
    setModal({ show: true, message: 'Foto guardada con éxito.', type: 'success' }); // ¡MENSAJE AÑADIDO!
    setIsCapturingPhoto(false);
  };
  
  const handleClearSignature = () => {
    sigPadRef.current.clear();
    setModal({ show: true, message: 'Firma borrada.', type: 'info' }); // ¡MENSAJE AÑADIDO!
  };
  
  const handleSaveSignature = () => {
    if (sigPadRef.current.isEmpty()) {
      setModal({ show: true, message: 'La firma no puede estar vacía.', type: 'error' });
      return;
    }
    const dataUrl = sigPadRef.current.getCanvas().toDataURL('image/png');
    onCaptureEvidence(scanResult.id, 'signature', dataUrl);
    setScanResult(prev => ({ ...prev, signature: dataUrl }));
    setModal({ show: true, message: 'Firma guardada con éxito.', type: 'success' }); // ¡MENSAJE AÑADIDO!
  };
  
  return (
    <>
      <PhotoCaptureModal 
        show={isCapturingPhoto}
        onClose={() => setIsCapturingPhoto(false)}
        onCapture={handlePhotoCaptured}
        setModal={setModal}
      />
    
      <div className="loginContainer">
        <div className="checkInBox">
          <h1 className="h1" style={{ textAlign: 'center' }}>Control de Acceso (Portería)</h1>

          <div className="checkInSection">
            
            {!isScanning ? (
              <Button 
                variant="primary" 
                onClick={() => setIsScanning(true)}
                style={{ width: '100%', padding: '20px', fontSize: '18px' }}
              >
                <Icon path={ICONS.camera} size={24} /> Escanear Código QR
              </Button>
            ) : (
              <div className="qrScannerContainer">
                <div id={scannerRegionId}></div> 
                <Button 
                  variant="secondary" 
                  onClick={() => setIsScanning(false)}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Cancelar Escaneo
                </Button>
              </div>
            )}

            {scanResult && (
              <div className="scanResult">
                <h3 className="h2">Visitante: {scanResult.name}</h3>
                <p>Estado: <strong>{scanResult.status.replace('_', ' ')}</strong></p>
                <p>Compañía: {scanResult.company}</p>
                <p className={`riskTag ${scanResult.risk?.toLowerCase()}`}>
                  Riesgo Fitosanitario: <strong>{scanResult.risk}</strong>
                </p>
                
                {scanResult.status === 'CHECKED_IN' && (
                  <div className="evidenceGroup">
                    <h4 className="h3">Captura de Evidencia (Ingreso)</h4>
                    
                    <div className="evidenceItem">
                      <Button 
                        variant="secondary" 
                        onClick={() => handleOpenPhoto('visitorPhoto')}
                        disabled={!!scanResult.visitorPhoto}
                      >
                        <Icon path={ICONS.technician} /> {scanResult.visitorPhoto ? "Foto Capturada" : "Foto Visitante"}
                      </Button>
                      {scanResult.visitorPhoto && <img src={scanResult.visitorPhoto} alt="Foto Visitante" className="evidenceThumbnail" />}
                    </div>
                    
                    <div className="evidenceItem">
                      <Button 
                        variant="secondary" 
                        onClick={() => handleOpenPhoto('vehiclePhoto')}
                        disabled={!!scanResult.vehiclePhoto}
                      >
                        <Icon path={ICONS.visit} /> {scanResult.vehiclePhoto ? "Foto Capturada" : "Foto Vehículo/Placa"}
                      </Button>
                      {scanResult.vehiclePhoto && <img src={scanResult.vehiclePhoto} alt="Foto Vehículo" className="evidenceThumbnail" />}
                    </div>
                    
                    <div className="evidenceItem signatureArea">
                      {!scanResult.signature ? (
                        <>
                          <div className="signaturePadContainer">
                            <SignatureCanvas 
                              ref={sigPadRef}
                              penColor='#333'
                              canvasProps={{ className: 'signatureCanvasElement' }} 
                            />
                          </div>
                          <div className="signatureButtons">
                            <Button variant="secondary" onClick={handleClearSignature}>
                              <Icon path={ICONS.reject} /> Limpiar
                            </Button>
                            <Button variant="primary" onClick={handleSaveSignature}>
                              <Icon path={ICONS.approve} /> Guardar Firma
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="signaturePadContainer">
                          <img src={scanResult.signature} alt="Firma Capturada" className="evidenceSignature" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="button button-secondary"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={() => onNavigate('login')}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </>
  );
};

export default VisitorCheckIn;