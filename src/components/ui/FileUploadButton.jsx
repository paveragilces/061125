// En: src/components/ui/FileUploadButton.jsx
// --- ARCHIVO COMPLETO Y CORREGIDO ---

import React, { useRef } from 'react';
import Icon from './Icon';
import { ICONS } from '../../config/icons';
import './FileUploadButton.css';

/**
 * Componente de Carga de Archivos
 * AHORA CONVIERTE la imagen a Base64 para el preview y guardado.
 */
const FileUploadButton = ({ label, onUpload, evidenceLoaded }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // --- ¡AQUÍ ESTÁ LA LÓGICA QUE FALTABA! ---
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // e.target.result contiene el string Base64 (data:image/png;base64,...)
        onUpload(e.target.result); 
      };
      
      reader.onerror = (err) => {
        console.error("Error al leer el archivo:", err);
        // Opcional: notificar al usuario
        // setModal({ show: true, message: 'Error al cargar la imagen.', type: 'error' });
      };

      // Inicia la lectura del archivo
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Determina el estilo y el icono basado en si la evidencia está cargada
  const buttonClassName = `fileUploadButton ${evidenceLoaded ? 'loaded' : ''}`;
  const buttonIcon = evidenceLoaded ? ICONS.checkCircle : ICONS.evidence;
  const buttonLabel = evidenceLoaded ? 'Foto Cargada' : label;

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
    >
      <Icon path={buttonIcon} size={16} />
      <span>{buttonLabel}</span>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*" // Solo acepta imágenes
      />
    </button>
  );
};

export default FileUploadButton;