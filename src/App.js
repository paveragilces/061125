// src/App.js
// --- ARCHIVO COMPLETO CON LÓGICA DE PDF DE ALERTA ---

import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

// --- SECCIÓN 1: IMPORTAR ESTILOS GLOBALES ---
import './styles/index.css';
import './App.css';

// --- SECCIÓN 2: IMPORTAR DATOS Y CONSTANTES ---
// ... (Tus imports no cambian) ...
import {
  MOCK_PRODUCERS,
  MOCK_TECHNICIANS_PROFILES,
  MOCK_ALERTS,
  MOCK_VISITS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_INSPECTION_MODULES,
  MOCK_FINCAS_FLAT,
  MOCK_CERTIFICATION_HISTORY
} from './data/mockData';
import { 
  MOCK_TASK_TEMPLATES, 
  TECHNICIAN_SPECIALTIES, 
  BANANA_DISEASES, 
  TECHNICIAN_ACTIONS 
} from './data/constants';
import { calculateRisk } from './utils/riskCalculator';

// --- SECCIÓN 3: IMPORTAR COMPONENTES REUTILIZABLES ---
// ... (Tus imports no cambian) ...
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input'; 
import ProgressBar from './components/ui/ProgressBar/ProgressBar'; 

// --- SECCIÓN 4: IMPORTAR VISTAS (PÁGINAS) ---
// ... (Tus imports no cambian) ...
import LoginScreen from './views/LoginScreen/LoginScreen';
import ManagerDashboard from './views/ManagerDashboard/ManagerDashboard';
import TechnicianControl from './views/TechnicianControl/TechnicianControl';
import VisitorReport from './views/VisitorReport/VisitorReport';
import AlertTriageView from './views/AlertTriageView/AlertTriageView';
import TechnicianSchedule from './views/TechnicianSchedule/TechnicianSchedule';
import ProducerDashboard from './views/ProducerDashboard/ProducerDashboard';
import AlertReportForm from './views/AlertReportForm/AlertReportForm';
import VisitorApprovalList from './views/VisitorApprovalList/VisitorApprovalList';
import ProducerTasks from './views/ProducerTasks/ProducerTasks';
import ProducerCertification from './views/ProducerCertification/ProducerCertification';
import NotificationCenter from './views/NotificationCenter/NotificationCenter';
import TechnicianInspectionCenter from './views/TechnicianInspectionCenter/TechnicianInspectionCenter';
import ProducerProfile from './views/ProducerProfile/ProducerProfile'; 
import ProducerAlertList from './views/ProducerAlertList/ProducerAlertList'; 
import TechnicianProfile from './views/TechnicianProfile/TechnicianProfile'; 
import FincaRegistration from './views/FincaRegistration/FincaRegistration'; 
import VisitorAccessPage from './views/VisitorAccess/VisitorAccessPage';
import VisitorCheckIn from './views/VisitorCheckIn/VisitorCheckIn';
import ProducerVisitorLog from './views/ProducerVisitorLog/ProducerVisitorLog';

// --- IMPORTACIONES PARA GENERACIÓN DE PDF ---
import { jsPDF } from 'jspdf'; // <-- Ya está importado


// --- COMPONENTE INTERNO: Formulario de Registro de Técnico ---
// ... (Tu componente RegisterTechnicianForm no cambia) ...
const RegisterTechnicianForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('Norte');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && zone) {
      onSubmit(name, zone);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Input
        label="Nombre Completo del Técnico"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="formGroup">
        <label className="label" htmlFor="zone">Zona Asignada</label>
        <select
          id="zone"
          name="zone"
          className="select" 
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
          <option value="Este">Este</option>
          <option value="Oeste">Oeste</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="button btn-primary">
          Registrar Técnico
        </button>
      </div>
    </form>
  );
};


function App() {
  // --- Estado de Navegación ---
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageData, setPageData] = useState(null);

  // --- Estado Global de la App ---
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '', type: 'info' });
  const [trainingModalTask, setTrainingModalTask] = useState(null);
  const [registerTechModal, setRegisterTechModal] = useState(false); 
  const [certHistoryModal, setCertHistoryModal] = useState(null); 
  const [fincaToEdit, setFincaToEdit] = useState(null);
  const [completedTrainingIds, setCompletedTrainingIds] = useState([]);
  const [trainingStartTime, setTrainingStartTime] = useState(null);


  // --- Estado de Datos (Mocks) ---
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [technicians, setTechnicians] = useState(
    MOCK_TECHNICIANS_PROFILES.map(t => ({
      ...t,
      workload: MOCK_ALERTS.filter(a => a.techId === t.id && a.status === 'assigned').length
    }))
  );
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [producers, setProducers] = useState(MOCK_PRODUCERS);
  const [fincas, setFincas] = useState(MOCK_FINCAS_FLAT);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [certificationHistory, setCertificationHistory] = useState(MOCK_CERTIFICATION_HISTORY);


  // --- Efecto para generar tareas iniciales (basado en mocks) ---
  useEffect(() => {
    // ... (Tu useEffect no cambia) ...
    const initialTasks = [];
    const completedAlerts = MOCK_ALERTS.filter(a => a.status === 'completed' && a.inspectionData?.audit?.ratings);

    completedAlerts.forEach(alert => {
      const ratings = alert.inspectionData.audit.ratings;
      MOCK_INSPECTION_MODULES.forEach(module => {
        module.questions.forEach(q => {
          if (ratings[q.id] && ratings[q.id] < 3) {
            const template = MOCK_TASK_TEMPLATES[q.id];
            if (template && !tasks.find(t => t.id === `t-${alert.id}-${q.id}`)) {
              initialTasks.push({
                id: `t-${alert.id}-${q.id}`,
                ...template,
                producerId: alert.producerId,
                alertId: alert.id,
                questionId: q.id,
                status: 'pending',
                createdAt: new Date().toISOString(),
              });
            }
          }
        });
      });
    });
    if (initialTasks.length > 0) {
      setTasks(prev => [...prev, ...initialTasks]);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Lógica de Negocio (Handlers) ---

  const showLoadingAndModal = (message, type = 'success', duration = 500) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message, type });
    }, duration);
  };

  const createNotification = (producerId, text, link) => {
    const newNotif = {
      id: `n${Date.now()}`,
      producerId,
      text,
      link,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleShowTraining = (task) => {
    setTrainingStartTime(Date.now()); 
    setTrainingModalTask(task);
  };

  const handleTrainingComplete = (task) => {
    const timeElapsed = (Date.now() - trainingStartTime) / 1000; 
    const requiredDuration = task.minWatchTime || 60; 

    if (timeElapsed < requiredDuration) {
      setModal({ 
        show: true, 
        message: `Debe ver la capacitación por al menos ${requiredDuration} segundos para completarla. Solo la vio por ${Math.round(timeElapsed)} segundos.`, 
        type: 'error' 
      });
      return; 
    }
    if (!completedTrainingIds.includes(task.id)) {
      setCompletedTrainingIds(prev => [...prev, task.id]);
    }
  };

  const handleLogin = (role, page = null) => {
    // ... (Tu lógica de login no cambia) ...
    setUserRole(role);
    if (role === 'manager') {
      setCurrentUser({ id: 'm1', name: 'Gerente Palmar' });
      setCurrentPage(page || 'managerDashboard');
    } else if (role === 'producer') {
      setCurrentUser(producers[0]);
      setCurrentPage(page || 'producerDashboard');
    } else if (role === 'technician') {
      const techUser = technicians[0];
      setCurrentUser(techUser);
      setCurrentPage(page || 'technicianSchedule');
    } else if (role === 'public') {
      setCurrentUser(null);
      if (page === 'visitorForm') {
        setCurrentPage('visitorAccessPage'); 
      } else if (page === 'visitorCheckIn') {
        setCurrentPage('visitorCheckIn'); 
      }
    } else {
      setCurrentUser(null);
      setCurrentPage('login');
    }
  };

  const handleLogout = () => {
    // ... (Tu lógica de logout no cambia) ...
    setUserRole(null);
    setCurrentUser(null);
    setCurrentPage('login');
    setPageData(null);
    setFincaToEdit(null); 
  };

  const handleNavigate = (page, data = null) => {
    // ... (Tu lógica de navigate no cambia) ...
    if (page === 'logout') {
      handleLogout();
      return;
    }
    if (page === 'fincaRegistration' && data === null) {
      setFincaToEdit(null);
    }
    setCurrentPage(page);
    setPageData(data); 
  };
  
  const handleSubmitAlert = (newAlert) => {
    // ... (Tu lógica de submit alert no cambia) ...
    setLoading(true);
    setTimeout(() => {
      const alertWithId = { ...newAlert, id: `a${Date.now()}` };
      setAlerts(prev => [alertWithId, ...prev]);
      createNotification(newAlert.producerId, `Tu Alerta #${alertWithId.id} (${newAlert.farmName}) ha sido recibida.`, 'producerDashboard');
      setLoading(false);
      setModal({ show: true, message: 'Alerta enviada con éxito. El gerente será notificado.', type: 'success' });
      handleNavigate('producerDashboard');
    }, 500);
  };

  const handleSubmitVisitRequest = (requestData) => {
    // ... (Tu lógica de submit visit no cambia) ...
    return new Promise((resolve) => { 
      setLoading(true);
      setTimeout(() => {
        const fincaData = fincas.find(f => f.id === requestData.fincaId);
        const producerId = fincaData ? fincaData.producerId : null;
        const newVisit = {
          id: `V-${requestData.fincaId}-${Date.now()}-${requestData.id.slice(-3)}`,
          producerId: producerId, 
          fincaId: requestData.fincaId, 
          name: requestData.name,
          idNumber: requestData.id,
          company: requestData.company,
          purpose: requestData.purpose,
          valueChain: requestData.valueChain,
          entryTime: requestData.entryTime, 
          exitTime: requestData.exitTime,   
          status: 'PENDING',
          qrData: null,
          risk: null,
          checkIn: null, 
          checkOut: null, 
          signature: null,
          visitorPhoto: null, 
          vehiclePhoto: null, 
        };
        setVisits(prev => [newVisit, ...prev]);
        if (producerId) {
           createNotification(producerId, `Nueva solicitud de visita de ${newVisit.name} para ${fincaData.name}.`, 'visitorApproval');
        }
        setLoading(false);
        resolve(true); 
      }, 500);
    });
  };

  const handleApproveVisit = (visitId, potentialRisk) => { 
    // ... (Tu lógica de approve visit no cambia) ...
    setLoading(true);
    setTimeout(() => {
      let producerId = '';
      let visitName = '';
      setVisits(prev => prev.map(v => {
        if (v.id === visitId) {
          producerId = v.producerId;
          visitName = v.name;
          return {
            ...v,
            status: 'APPROVED',
            risk: potentialRisk, 
            qrData: `${v.id}|${v.idNumber}|${potentialRisk.toUpperCase()}`, 
          };
        }
        return v;
      }));
      if (producerId) {
        createNotification(producerId, `Has aprobado la visita de ${visitName}.`, 'visitorApproval');
      }
      showLoadingAndModal('Visita aprobada. Se generó el código QR.', 'success');
    }, 500);
  };

  const handleRejectVisit = (visitId) => {
    // ... (Tu lógica de reject visit no cambia) ...
    setLoading(true);
    setTimeout(() => {
      setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'DENIED' } : v));
      showLoadingAndModal('Visita rechazada.', 'info');
      setLoading(false);
    }, 500);
  };

  const handleScanQr = (qrData) => {
    // ... (Tu lógica de scan qr no cambia) ...
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        const now = new Date().toISOString();
        const visitIndex = visits.findIndex(v => v.qrData === qrData);
        if (visitIndex === -1) {
          setLoading(false);
          reject(new Error("QR Inválido. La visita no se encuentra."));
          return;
        }
        const originalVisit = visits[visitIndex];
        let updatedVisit;
        if (originalVisit.status === 'APPROVED') {
          updatedVisit = { ...originalVisit, status: 'CHECKED_IN', checkIn: now, scannedTime: now };
        } else if (originalVisit.status === 'CHECKED_IN') {
          updatedVisit = { ...originalVisit, status: 'CHECKED_OUT', checkOut: now, scannedTime: now };
        } else if (originalVisit.status === 'CHECKED_OUT') {
          setLoading(false);
          reject(new Error("Esta visita ya fue registrada como SALIDA."));
          return;
        } else {
          setLoading(false);
          reject(new Error(`El estado de esta visita es '${originalVisit.status}'. No se puede escanear.`));
          return;
        }
        setVisits(prev => prev.map((v, index) => index === visitIndex ? updatedVisit : v));
        setLoading(false);
        resolve(updatedVisit); 
      }, 500);
    });
  };
  
  const handleCaptureEvidence = (visitId, type, data) => { /* ... */ };
  
  // --- LÓGICA DE PDF PARA VISITAS (YA EXISTENTE) ---
  const handleGeneratePDF = async (visit) => {
    setLoading(true);
    const doc = new jsPDF();
    try {
      const finca = fincas.find(f => f.id === visit.fincaId);
      const fincaName = finca ? finca.name : 'Finca Desconocida';
      // ... (Resto de tu lógica de PDF... )
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text("Reporte de Visita de Bioseguridad", 105, 22, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100);
      doc.text(`Visita ID: ${visit.id}`, 14, 35);
      doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 196, 35, { align: 'right' });
      doc.line(14, 40, 196, 40); 
      let y = 50; 
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Detalles del Visitante", 14, y);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Nombre: ${visit.name}`, 14, y += 7);
      doc.text(`Cédula/ID: ${visit.idNumber}`, 14, y += 7);
      doc.text(`Compañía: ${visit.company}`, 14, y += 7);
      doc.text(`Propósito: ${visit.purpose}`, 14, y += 7);
      doc.text(`Nivel de Riesgo: ${visit.risk || 'N/A'}`, 14, y += 7);
      y += 12;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Registro de Tiempos y Finca", 14, y);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Finca Visitada: ${fincaName}`, 14, y += 7);
      doc.text(`Ingreso Aprobado: ${new Date(visit.entryTime).toLocaleString()}`, 14, y += 7);
      doc.text(`Ingreso Real (Check-In): ${visit.checkIn ? new Date(visit.checkIn).toLocaleString() : 'N/A'}`, 14, y += 7);
      doc.text(`Salida Real (Check-Out): ${visit.checkOut ? new Date(visit.checkOut).toLocaleString() : 'N/A'}`, 14, y += 7);
      y += 12;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Evidencia Recolectada", 14, y);
      y += 7;
      const addImageToPdf = (label, imageData, startY) => {
        if (imageData) {
          try {
            doc.setFont(undefined, 'normal');
            doc.text(label, 14, startY);
            doc.addImage(imageData, 'PNG', 14, startY + 2, 80, 60);
            return startY + 70; 
          } catch (e) {
            console.error("Error al añadir imagen al PDF:", e);
            doc.setTextColor(255, 0, 0);
            doc.text("Error al cargar la imagen (formato inválido).", 14, startY + 5);
            doc.setTextColor(100);
            return startY + 10;
          }
        }
        return startY;
      };
      y = addImageToPdf('Foto del Visitante:', visit.visitorPhoto, y);
      if (y > 220) { doc.addPage(); y = 20; }
      y = addImageToPdf('Firma de Conformidad:', visit.signature, y);
      if (y > 220) { doc.addPage(); y = 20; }
      addImageToPdf('Foto del Vehículo:', visit.vehiclePhoto, y);
    } catch (error) {
      console.error("Error al generar PDF: ", error);
      setModal({ show: true, message: 'Hubo un error al generar el PDF.', type: 'error' });
    }
    doc.save(`Reporte_Visita_${visit.id}.pdf`);
    setLoading(false);
  };
  
  // --- CAMBIO 1: NUEVA FUNCIÓN PARA GENERAR PDF DE ALERTA ---
  const handleGenerateAlertPDF = (alert) => {
    setLoading(true);
    const doc = new jsPDF();
    try {
      const tech = technicians.find(t => t.id === alert.techId);
      const resolution = alert.inspectionData?.plant?.data;
      
      // Título
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text("Reporte de Alerta de Bioseguridad", 105, 22, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100);
      doc.text(`Alerta ID: ${alert.id}`, 14, 35);
      doc.text(`Fecha de Reporte: ${new Date(alert.date).toLocaleDateString()}`, 196, 35, { align: 'right' });
      doc.line(14, 40, 196, 40);

      // Detalles de la Alerta
      let y = 50;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Detalles del Reporte (Productor)", 14, y);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Finca: ${alert.farmName}`, 14, y += 7);
      doc.text(`Lote: ${alert.lote}`, 14, y += 7);
      doc.text(`Síntomas Reportados: ${alert.symptoms.join(', ')}`, 14, y += 7, { maxWidth: 180 });
      y += 7; // Espacio extra para síntomas
      
      const attachedPhotos = alert.photos ? Object.entries(alert.photos).filter(([key, value]) => value) : [];
      doc.text(`Fotos Adjuntas: ${attachedPhotos.length}`, 14, y += 7);

      // Estado de Asignación
      y += 12;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Estado de la Alerta", 14, y);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Estado: ${alert.status.toUpperCase()}`, 14, y += 7);
      doc.text(`Prioridad: ${alert.priority || 'N/A'}`, 14, y += 7);

      if (alert.status === 'assigned' && tech) {
        doc.text(`Técnico Asignado: ${tech.name}`, 14, y += 7);
        doc.text(`Fecha Programada: ${alert.visitDate}`, 14, y += 7);
      }

      // Resolución (Si está completada)
      if (alert.status === 'completed' && resolution) {
        y += 12;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Resolución del Técnico", 14, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`Diagnóstico Final: ${resolution.diagnosis.join(', ')}`, 14, y += 7);
        doc.text(`Acciones Tomadas: ${resolution.actions.join(', ')}`, 14, y += 7);
        doc.text(`Recomendaciones: ${resolution.recommendations}`, 14, y += 7, { maxWidth: 180 });
      }

    } catch (error) {
      console.error("Error al generar PDF de Alerta: ", error);
      setModal({ show: true, message: 'Hubo un error al generar el PDF.', type: 'error' });
    }

    doc.save(`Reporte_Alerta_${alert.id}.pdf`);
    setLoading(false);
  };
  // --- FIN DE LA NUEVA FUNCIÓN ---

  const handleAssignAlert = (alertId, comment, diseases, techId, date, priority) => { /* ... */ };
  
  const handleCompleteTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
    showLoadingAndModal('¡Tarea completada!', 'success');
  };

  const handleMarkAsRead = (notificationId) => { /* ... */ };
  const handleSaveInspectionModule = (alertId, partialInspectionData, finalize = false) => { /* ... */ };
  const handleRegisterTechnician = (name, zone) => { /* ... */ };
  const handleUpdateTechnicianProfile = (specialties) => { /* ... */ };
  
  const handleEditFinca = (fincaId) => {
    // ... (Tu lógica de edit finca no cambia) ...
    const finca = currentUser.fincas.find(f => f.id === fincaId);
    if (finca) {
      setFincaToEdit(finca); 
      setCurrentPage('fincaRegistration'); 
    }
  };

  const handleRegisterFinca = (fincaData) => {
    // ... (Tu lógica de register finca no cambia) ...
    setLoading(true);

    const newProducersList = producers.map(producer => {
      if (producer.id === currentUser.id) {
        return {
          ...producer,
          fincas: [...producer.fincas, fincaData]
        };
      }
      return producer;
    });
    setProducers(newProducersList);

    setCurrentUser(prev => ({
      ...prev,
      fincas: [...prev.fincas, fincaData]
    }));
    
    const newFincasFlat = newProducersList.flatMap(p => 
      p.fincas.map(f => ({...f, producerId: p.id, owner: p.owner}))
    );
    setFincas(newFincasFlat);
    
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message: 'Finca registrada con éxito.', type: 'success' });
      handleNavigate('producerProfile'); 
    }, 500);
  };

  const handleUpdateFinca = (updatedFincaData) => {
    // ... (Tu lógica de update finca no cambia) ...
    setLoading(true);

    const newProducersList = producers.map(producer => {
      if (producer.id === currentUser.id) {
        const updatedFincas = producer.fincas.map(finca => 
          finca.id === updatedFincaData.id ? updatedFincaData : finca
        );
        return {
          ...producer,
          fincas: updatedFincas
        };
      }
      return producer;
    });
    setProducers(newProducersList);

    setCurrentUser(prev => ({
      ...prev,
      fincas: prev.fincas.map(finca => 
        finca.id === updatedFincaData.id ? updatedFincaData : finca
      )
    }));

    const newFincasFlat = newProducersList.flatMap(p => 
      p.fincas.map(f => ({...f, producerId: p.id, owner: p.owner}))
    );
    setFincas(newFincasFlat);
    
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message: 'Finca actualizada con éxito.', type: 'success' });
      setFincaToEdit(null); 
      handleNavigate('producerProfile'); 
    }, 500);
  };


  // --- Renderizado Condicional de Páginas ---

  const renderPage = () => {
    // ... (Tus 'case' public, manager no cambian) ...
    // Públicas
    if (currentPage === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }
    if (currentPage === 'visitorAccessPage') {
      const myApprovedVisits = visits.filter(v => v.idNumber === "12345"); 
      return (
        <VisitorAccessPage
          onNewRequest={handleSubmitVisitRequest}
          approvedVisits={myApprovedVisits} 
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPage === 'visitorCheckIn') {
      return (
        <VisitorCheckIn
          onNavigate={handleNavigate}
          onScanQr={handleScanQr}
          onCaptureEvidence={handleCaptureEvidence}
          setModal={setModal}
        />
      );
    }

    if (!userRole || !currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (userRole) {
      case 'manager':
        switch (currentPage) {
          // ... (case manager no cambia) ...
          case 'managerDashboard':
            return <ManagerDashboard alerts={alerts} visits={visits} technicians={technicians} onNavigate={handleNavigate} />;
          case 'technicianControl':
            return <TechnicianControl technicians={technicians} onNavigate={handleNavigate} onShowRegisterModal={() => setRegisterTechModal(true)} />;
          case 'visitorReport':
            return <VisitorReport visits={visits} fincas={fincas} pageData={pageData} />;
          case 'alertTriage':
            return <AlertTriageView alerts={alerts} technicians={technicians} onAssignAlert={handleAssignAlert} setModal={setModal} pageData={pageData} />; 
          case 'technicianSchedule':
            return <TechnicianSchedule technician={pageData || technicians[0]} alerts={alerts} onNavigate={handleNavigate} />;
          default:
            return <ManagerDashboard alerts={alerts} visits={visits} technicians={technicians} onNavigate={handleNavigate} />;
        }

      case 'producer':
        switch (currentPage) {
          // ... (otros case producer no cambian) ...
          case 'producerDashboard':
            return <ProducerDashboard producer={currentUser} alerts={alerts} visits={visits} tasks={tasks} technicians={technicians} onNavigate={handleNavigate} />;
          case 'reportAlert':
            return <AlertReportForm producer={currentUser} onSubmitAlert={handleSubmitAlert} setModal={setModal} />;
          
          // --- CAMBIO 2: Pasamos la nueva prop a ProducerAlertList ---
          case 'producerAlertList': 
            return <ProducerAlertList 
              producer={currentUser} 
              alerts={alerts} 
              technicians={technicians} 
              onNavigate={handleNavigate} 
              pageData={pageData} 
              onGenerateAlertPDF={handleGenerateAlertPDF} // <-- AÑADIDA
            />;
          case 'visitorApproval': 
            const myFincaIds = currentUser.fincas.map(f => f.id);
            const visitsToMe = visits.filter(v => myFincaIds.includes(v.fincaId));
            return <VisitorApprovalList producer={currentUser} visits={visitsToMe} onApproveVisit={handleApproveVisit} onRejectVisit={handleRejectVisit} pageData={pageData} />;
          
          case 'producerVisitorLog': 
            const myFincaIdsLog = currentUser.fincas.map(f => f.id);
            const producerLog = visits.filter(v => myFincaIdsLog.includes(v.fincaId));
            return <ProducerVisitorLog producerLog={producerLog} onGeneratePDF={handleGeneratePDF} producer={currentUser} />;
          
          case 'producerTasks':
            return <ProducerTasks 
              producer={currentUser} 
              tasks={tasks} 
              onCompleteTask={handleCompleteTask} 
              onShowTraining={handleShowTraining} 
              pageData={pageData} 
              completedTrainingIds={completedTrainingIds}
            />;
          case 'producerCertification':
            return <ProducerCertification 
              certificationHistory={certificationHistory}
              onShowHistoryModal={setCertHistoryModal} 
            />;
          case 'notifications':
            return <NotificationCenter
              notifications={notifications.filter(n => n.producerId === currentUser.id)}
              onMarkAsRead={handleMarkAsRead}
              onNavigate={handleNavigate}
            />;
          
          case 'producerProfile': 
            return <ProducerProfile 
              producer={currentUser} 
              onNavigate={handleNavigate} 
              onEditFinca={handleEditFinca}
            />;
          
          case 'fincaRegistration':
            return <FincaRegistration 
              onRegisterFinca={handleRegisterFinca} 
              onNavigate={handleNavigate}
              setModal={setModal}
              onUpdateFinca={handleUpdateFinca}
              fincaToEdit={fincaToEdit}
            />;
            
          default:
            return <ProducerDashboard producer={currentUser} alerts={alerts} visits={visits} tasks={tasks} technicians={technicians} onNavigate={handleNavigate} />;
        }

      case 'technician':
        switch (currentPage) {
          // ... (case technician no cambia) ...
          case 'technicianSchedule':
            return <TechnicianSchedule technician={currentUser} alerts={alerts} onNavigate={handleNavigate} />;
          case 'technicianInspection':
            return <TechnicianInspectionCenter
              alert={pageData}
              onNavigate={handleNavigate}
              onSaveInspection={handleSaveInspectionModule}
              setModal={setModal}
            />;
          case 'technicianProfile':
            return <TechnicianProfile 
              currentUser={currentUser} 
              onSaveProfile={handleUpdateTechnicianProfile} 
            />;
          default:
            return <TechnicianSchedule technician={currentUser} alerts={alerts} onNavigate={handleNavigate} />;
        }

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  const isLoginOrPublicForm = currentPage === 'login' || currentPage === 'visitorAccessPage' || currentPage === 'visitorCheckIn';

  const unreadNotifications = userRole === 'producer'
    ? notifications.filter(n => n.producerId === currentUser?.id && !n.read).length
    : 0;

  // --- ESTRUCTURA PRINCIPAL DE LA APP (con Sidebar) ---
  return (
    <>
      {loading && <LoadingSpinner />}
      
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '' })}
        />
      )}
      
      {trainingModalTask && (
        <Modal
          title={`Capacitación: ${trainingModalTask.title}`}
          onClose={() => setTrainingModalTask(null)}
          size="large"
        >
          <div className="training-modal-content">
            <p>{trainingModalTask.description}</p>
            <div className="video-container">
              <YouTube 
                videoId={trainingModalTask.videoId} 
                opts={{
                  height: '390',
                  width: '640',
                  playerVars: {
                    autoplay: 1, 
                    controls: 1,
                  },
                }}
                onEnd={() => handleTrainingComplete(trainingModalTask)}
                className="youtube-iframe"
              />
            </div>
          </div>
        </Modal>
      )}
      
      {registerTechModal && (
        <Modal
          title="Registrar Nuevo Técnico"
          onClose={() => setRegisterTechModal(false)}
        >
          <RegisterTechnicianForm
            onSubmit={handleRegisterTechnician}
            onCancel={() => setRegisterTechModal(false)}
          />
        </Modal>
      )}
      
      {certHistoryModal && (
        <Modal
          title={`Desglose de la Revisión: ${certHistoryModal.date}`}
          onClose={() => setCertHistoryModal(null)}
          size="large"
        >
          <div className="historyModalContent">
            <div className="historyModalHeader">
              <h2 className="h2">Promedio: {certHistoryModal.averageScore}%</h2>
              <span 
                className={`tag ${certHistoryModal.status === 'Aprobado' ? 'tag-aprobado' : 'tag-no-aprobado'}`}
              >
                {certHistoryModal.status}
              </span>
            </div>
            <p>Este fue el desglose de puntajes para esta revisión:</p>
            <div className="progressGrid">
              {MOCK_INSPECTION_MODULES.map(module => (
                <ProgressBar 
                  key={module.id}
                  label={`${module.id}. ${module.name}`}
                  score={certHistoryModal.breakdown[module.name] || 0}
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
      
      {!isLoginOrPublicForm && (
        <Header
          userRole={userRole}
          currentUser={currentUser} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          unreadNotifications={unreadNotifications}
        />
      )}
      
      {!isLoginOrPublicForm && (
        <Sidebar
          userRole={userRole}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
      
      <main className={!isLoginOrPublicForm ? 'mainContentWithSidebar' : 'mainContentFull'}>
        {renderPage()}
      </main>
    </>
  );
}

export default App;