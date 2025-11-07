import React, { useState } from 'react';
import StarRating from '../../components/ui/StarRating';
import FileUploadButton from '../../components/ui/FileUploadButton';
import { MOCK_INSPECTION_MODULES } from '../../data/mockData'; // Asumiendo que se movió
import './TechnicianModuleAudit.css';

/**
 * Módulo de Auditoría (Técnico)
 */
const TechnicianModuleAudit = ({ initialData, onSubmit, setModal }) => {
  const [ratings, setRatings] = useState(initialData.ratings || {});
  const [evidence, setEvidence] = useState(initialData.evidence || {});

  const handleSetRating = (questionId, rating) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleUploadEvidence = (questionId, file) => {
    const evidenceUrl = `data:image/png;base64,SIMULATED_EVIDENCE_${questionId}`;
    setEvidence(prev => ({ ...prev, [questionId]: evidenceUrl }));
    setModal({ show: true, message: `Evidencia para ${questionId} adjuntada (simulado).`, type: 'success' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const auditQuestionsCount = MOCK_INSPECTION_MODULES.reduce((acc, mod) => acc + mod.questions.length, 0);
    if (Object.keys(ratings).length < auditQuestionsCount) {
      setModal({ show: true, message: 'Faltan preguntas por calificar.', type: 'error' });
      return;
    }
    onSubmit({ ratings, evidence });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="h1">Módulo: Auditoría de Bioseguridad</h1>
      {MOCK_INSPECTION_MODULES.map(module => (
        <div key={module.id} style={{ marginBottom: '20px' }}>
          <h2 className="h2">Módulo {module.id}: {module.name}</h2>
          {module.questions.map(q => {
            const rating = ratings[q.id] || 0;
            const showEvidenceButton = rating > 0 && rating < 3;
            const evidenceLoaded = evidence[q.id];

            return (
              <div key={q.id} className="listItem auditQuestion">
                <label className="label" style={{ marginBottom: '15px', fontSize: '18px' }}>
                  {q.id} - {q.text}
                </label>
                <StarRating
                  rating={rating}
                  setRating={(rating) => handleSetRating(q.id, rating)}
                />
                {showEvidenceButton && (
                  <FileUploadButton
                    label="[+] Adjuntar Evidencia (Puntaje bajo)"
                    onUpload={(file) => handleUploadEvidence(q.id, file)}
                    evidenceLoaded={!!evidenceLoaded}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="submitContainer">
        <button className="button btn-primary" type="submit">Guardar Módulo Auditoría</button>
      </div>
    </form>
  );
};

export default TechnicianModuleAudit;