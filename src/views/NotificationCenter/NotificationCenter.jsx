import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import { ICONS } from '../../config/icons';
import './NotificationCenter.css';

/**
 * Centro de Notificaciones (Productor)
 */
const NotificationCenter = ({ notifications, onMarkAsRead, onNavigate }) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const handleClick = (notification) => {
    onMarkAsRead(notification.id);
    if (notification.link) {
      onNavigate(notification.link);
    }
  };

  const renderItem = (n) => (
    <div
      key={n.id}
      className={`notificationItem ${n.read ? '' : 'unread'}`}
      onClick={() => handleClick(n)}
    >
      <p className="notificationText">{n.text}</p>
      <span className="notificationDate">{new Date(n.date).toLocaleString()}</span>
    </div>
  );

  return (
    <div className="container">
      <h1 className="h1">Centro de Notificaciones</h1>

      {notifications.length === 0 ? (
        <EmptyState
          iconPath={ICONS.notifications}
          title="Bandeja Vacía"
          message="No tienes notificaciones nuevas en este momento."
        />
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <>
              <h2 className="h2">Nuevas ({unreadNotifications.length})</h2>
              <div className="notificationList">
                {unreadNotifications.map(renderItem)}
              </div>
            </>
          )}

          {readNotifications.length > 0 && (
            <>
              <h2 className="h2" style={{ marginTop: '30px' }}>Leídas</h2>
              <div className="notificationList">
                {readNotifications.map(renderItem)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCenter;