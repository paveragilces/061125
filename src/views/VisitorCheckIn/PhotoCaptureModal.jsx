// src/views/VisitorCheckIn/PhotoCaptureModal.jsx
import React, { useRef, useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './VisitorCheckIn.css'; // Reutilizamos el CSS

function PhotoCaptureModal({ show, onClose, onCapture, setModal }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // 1. Efecto para iniciar la cámara cuando el modal se abre
  useEffect(() => {
    if (show) {
      // Solicita acceso a la cámara (webcam o cámara trasera de cel)
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Prefiere la cámara trasera
      })
      .then(stream => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error al acceder a la cámara: ", err);
        setModal({ 
          show: true, 
          message: `Error de cámara: ${err.name}. Asegúrate de dar permiso y usar HTTPS o localhost.`, 
          type: 'error' 
        });
        onClose(); // Cierra el modal si hay un error
      });
    } else {
      // 3. Limpieza: Detiene la cámara cuando el modal se cierra
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]); // Se ejecuta solo cuando 'show' cambia

  // 2. Función para tomar la foto
  const handleCaptureClick = () => {
    if (!videoRef.current) return;

    // Crea un canvas temporal para dibujar la imagen
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    
    // Dibuja el frame actual del video en el canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convierte el canvas a una imagen DataURL (formato JPEG)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% calidad
    
    // Llama a la función onCapture del padre con la imagen
    onCapture(dataUrl);
    
    // Cierra el modal
    onClose();
  };

  if (!show) {
    return null;
  }

  // Usamos el componente Modal que ya tienes
  return (
    <Modal title="Capturar Foto" onClose={onClose} size="large">
      <div className="photoCaptureContainer">
        <video ref={videoRef} autoPlay playsInline className="photoCaptureVideo" />
        <Button variant="primary" onClick={handleCaptureClick} style={{width: '100%', marginTop: '15px'}}>
          <Icon path={ICONS.camera} /> Tomar Foto
        </Button>
      </div>
    </Modal>
  );
}

export default PhotoCaptureModal;