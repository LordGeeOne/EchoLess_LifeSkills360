import React, { useState } from 'react';
import { FaBell, FaCheck, FaTrophy, FaGift, FaUserFriends, FaExclamationCircle } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve completed your first scenario with a perfect score!',
      icon: <FaTrophy />,
      color: '#FFD700',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'reward',
      title: 'Daily Reward Available',
      message: 'Claim your daily login reward - 50 points!',
      icon: <FaGift />,
      color: '#4CAF50',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'social',
      title: 'New Friend Request',
      message: 'John from Alexandra township wants to connect',
      icon: <FaUserFriends />,
      color: '#2196F3',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'alert',
      title: 'Scenario Reminder',
      message: 'Don\'t forget to complete today\'s challenge!',
      icon: <FaExclamationCircle />,
      color: '#FF5722',
      time: '5 hours ago',
      unread: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '2rem'
      // Remove backgroundColor
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontFamily: 'Kanit, sans-serif'
          }}>
            <FaBell />
            Notifications
          </h1>
          
          <button
            onClick={markAllAsRead}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaCheck /> Mark all as read
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              style={{
                background: notification.unread ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                position: 'relative',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(10px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{
                padding: '0.8rem',
                borderRadius: '50%',
                background: `rgba(${hexToRgb(notification.color)}, 0.2)`,
                color: notification.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notification.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ color: '#fff', margin: 0 }}>{notification.title}</h3>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                    {notification.time}
                  </span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                  {notification.message}
                </p>
              </div>

              {notification.unread && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
};

export default NotificationsPage;
