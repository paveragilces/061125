// En: src/components/layout/Sidebar.jsx
// --- ARCHIVO MODIFICADO (con Grupos y nuevos Iconos) ---

import React from 'react';
import Icon from '../ui/Icon';
// Importamos los iconos desde tu archivo de configuración
import { ICONS } from '../../config/icons'; 
import './Sidebar.css';

/**
 * Componente interno para un botón de navegación
 */
const SidebarButton = ({ page, iconPath, label, isSelected, onNavigate }) => {
  const buttonClasses = `sidebarButton ${isSelected ? 'selected' : ''}`;

  return (
    <button
      className={buttonClasses}
      onClick={() => onNavigate(page)}
    >
      {/* Asignamos el color dinámicamente basado en la selección */}
      <Icon path={iconPath} color={isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)'} />
      <span>{label}</span>
    </button>
  );
};

/**
 * Componente interno para un título de grupo
 */
const SidebarGroup = ({ title }) => (
  <h4 className="sidebarGroupTitle">{title}</h4>
);

/**
 * Barra Lateral (Sidebar) - REDISEÑADO
 */
const Sidebar = ({ userRole, currentPage, onNavigate }) => {
  if (!userRole) return null;

  return (
    <div className="sidebar">
      <div>
        <div className="sidebarLogo">
          <span>Agro</span>
          <span className="sidebarLogoSub">Aliados</span>
        </div>

        <nav className="sidebarNav">
          {/* --- Vistas de Productor --- */}
          {userRole === 'producer' && (
            <>
              <SidebarGroup title="Principal" />
              <SidebarButton 
                page="producerDashboard" 
                iconPath={ICONS.dashboard} 
                label="Dashboard" 
                isSelected={currentPage === 'producerDashboard'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="producerProfile" 
                iconPath={ICONS.user} // De tu archivo icons.js
                label="Mis Fincas" 
                isSelected={currentPage === 'producerProfile'}
                onNavigate={onNavigate}
              />

              <SidebarGroup title="Alertas y Tareas" />
              <SidebarButton 
                page="producerAlertList" 
                iconPath={ICONS.alert} 
                label="Registro de Alertas" 
                isSelected={currentPage === 'producerAlertList'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="producerTasks" 
                iconPath={ICONS.tasks} 
                label="Tareas Pendientes" 
                isSelected={currentPage === 'producerTasks'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="containmentPlans" 
                iconPath={ICONS.certification}  // <-- ICONO ASIGNADO (Escudo)
                label="Planes de Contención" 
                isSelected={currentPage === 'containmentPlans'}
                onNavigate={onNavigate}
              />

              <SidebarGroup title="Gestión de Finca" />
              <SidebarButton 
                page="visitorApproval" 
                iconPath={ICONS.checkCircle} // <-- ICONO MEJORADO (Círculo de Check)
                label="Aprobar Visitas" 
                isSelected={currentPage === 'visitorApproval'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="manageWorkers" 
                iconPath={ICONS.visit} // <-- ICONO ASIGNADO (es el 'userPlus' en tu archivo)
                label="Mis Trabajadores" 
                isSelected={currentPage === 'manageWorkers'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="producerVisitorLog" 
                iconPath={ICONS.report} // <-- ICONO ASIGNADO
                label="Log de Visitas" 
                isSelected={currentPage === 'producerVisitorLog'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="workLogViewer" 
                iconPath={ICONS.audit} // <-- ICONO ASIGNADO (Clipboard)
                label="Registro de Labores" 
                isSelected={currentPage === 'workLogViewer'}
                onNavigate={onNavigate}
              />

              <SidebarGroup title="Certificación" />
              <SidebarButton 
                page="producerCertification" 
                iconPath={ICONS.certification} // Re-usamos el escudo
                label="Bioseguridad" 
                isSelected={currentPage === 'producerCertification'}
                onNavigate={onNavigate}
              />
            </>
          )}

          {/* --- Vistas de Gerente --- */}
          {userRole === 'manager' && (
            <>
              <SidebarButton 
                page="managerDashboard" 
                iconPath={ICONS.dashboard} 
                label="Dashboard" 
                isSelected={currentPage === 'managerDashboard'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="alertTriage" 
                iconPath={ICONS.alert} 
                label="Alertas" 
                isSelected={currentPage === 'alertTriage'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="technicianControl" 
                iconPath={ICONS.technician} 
                label="Técnicos" 
                isSelected={currentPage === 'technicianControl'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="visitorReport" 
                iconPath={ICONS.report} // <-- Usamos 'report' ya que 'visit' es 'userPlus'
                label="Visitas" 
                isSelected={currentPage === 'visitorReport'}
                onNavigate={onNavigate}
              />
            </>
          )}

          {/* --- Vistas de Técnico --- */}
          {userRole === 'technician' && (
            <>
              <SidebarButton 
                page="technicianSchedule" 
                iconPath={ICONS.calendar} 
                label="Mi Agenda" 
                isSelected={currentPage === 'technicianSchedule'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="technicianProfile" 
                iconPath={ICONS.user} 
                label="Mi Perfil" 
                isSelected={currentPage === 'technicianProfile'}
                onNavigate={onNavigate}
              />
            </>
          )}

          {/* --- Vistas de Trabajador --- */}
          {userRole === 'worker' && (
            <>
              <SidebarButton 
                page="workerProfile" 
                iconPath={ICONS.user} 
                label="Mi Perfil / QR" 
                isSelected={currentPage === 'workerProfile'}
                onNavigate={onNavigate}
              />
              <SidebarButton 
                page="submitWorkLog" 
                iconPath={ICONS.tasks} 
                label="Registrar Labor" 
                isSelected={currentPage === 'submitWorkLog'}
                onNavigate={onNavigate}
              />
            </>
          )}
        </nav>
      </div>

      <div className="sidebarFooter">
        <div className="footerLogoContainer">
          <img 
            src="https://res.cloudinary.com/do4vybtt4/image/upload/v1762369002/Lytiks-02_indfgk.svg" 
            alt="Lytiks Logo" 
            className="footerLogo"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;