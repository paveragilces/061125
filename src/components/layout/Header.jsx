import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { ICONS } from '../../config/icons';
import './Header.css';

/**
 * Header (Cabecera) - REDISEÑADO
 * - Se elimina el botón "Salir" suelto.
 * - Se añade el botón "Mi Perfil" al dropdown.
 * - El botón "Cerrar Sesión" ahora funciona.
 */
const Header = ({ userRole, currentUser, unreadNotifications, onNavigate, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determina el nombre a mostrar
  const userName = currentUser?.name || (currentUser?.owner || 'Usuario');
  
  // Icono de usuario (default o por rol)
  const userIcon = userRole === 'producer' 
    ? ICONS.user 
    : (userRole === 'manager' ? ICONS.manager : ICONS.technician);

  // --- ¡NUEVA LÓGICA DE NAVEGACIÓN DE PERFIL! ---
  const handleProfileNavigation = () => {
    if (userRole === 'producer') {
      onNavigate('producerProfile'); // Fincas del Productor
    } else if (userRole === 'technician') {
      onNavigate('technicianProfile'); // Perfil del Técnico
    }
    // El Gerente no tiene página de perfil
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="headerRight">
        
        {/* Botón de Notificaciones (Solo Productor) */}
        {userRole === 'producer' && (
          <button 
            className="notificationButton" 
            onClick={() => onNavigate('notifications')}
          >
            <Icon path={ICONS.notifications} size={22} />
            {unreadNotifications > 0 && (
              <span className="notificationBadge">{unreadNotifications}</span>
            )}
          </button>
        )}

        {/* Separador Visual */}
        <div className="headerSeparator"></div>

        {/* Menú de Usuario Desplegable */}
        <div className="userMenu">
          <button 
            className="userMenuButton" 
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <span className="userMenuAvatar">
              <Icon path={userIcon} size={20} />
            </span>
            <span className="userMenuName">{userName}</span>
            <Icon 
              path={dropdownOpen ? ICONS.chevronUp : ICONS.chevronDown} 
              size={16} 
              color="#718096"
            />
          </button>

          {/* El Menú Desplegable */}
          {dropdownOpen && (
            <div className="userDropdown">
              
              {/* --- ¡NUEVO BOTÓN DE PERFIL! --- */}
              {/* Solo se muestra si no es Gerente */}
              {userRole !== 'manager' && (
                <button 
                  className="dropdownButton" 
                  onClick={handleProfileNavigation}
                >
                  <Icon path={ICONS.user} size={16} /> Mi Perfil
                </button>
              )}
              
              <button 
                className="dropdownButton logout" 
                onClick={onLogout} // Ahora recibe la prop onLogout
              >
                <Icon path={ICONS.logout} size={16} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* --- ¡BOTÓN "SALIR" EXTRA ELIMINADO! --- */}
      
    </header>
  );
};

export default Header;