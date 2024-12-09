import React, { useState, useRef, useEffect } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrophy, FaGift, FaBell, FaUserCircle, FaRobot, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const Header = ({ user, progress = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const pathname = location.pathname;
  const [redirectingToMap, setRedirectingToMap] = useState(false);

  const closeModals = () => {
    setShowProfileMenu(false);
    setShowLoginModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModals();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // If we're on home page without township, set map as active
    if (pathname === '/' && (!location.state?.townshipName || location.state?.townshipName === 'Your Township')) {
      setRedirectingToMap(true);
    } else {
      setRedirectingToMap(false);
    }
  }, [pathname, location.state?.townshipName]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoginModal(false);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (error) {
      setError('Error signing in with Google');
    }
  };

  return (
    <>
      <header className="header-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '50px', // Reduced from 70px
        padding: '0.5rem 2rem', // Reduced padding
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Add Home Button */}
        <div style={{ marginRight: '1rem' }}>
          <IconLink 
            icon={FaHome} 
            label="Home" 
            onClick={() => navigate('/')} 
          />
        </div>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem', // Reduced gap
          flex: 1
        }}>
          <div style={{
            width: '150px', // Reduced width
            height: '6px',  // Reduced height
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4CAF50, #81C784)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ 
            color: '#fff', 
            fontSize: '0.8rem' // Reduced font size
          }}>
            {progress}% Complete
          </span>
        </div>

        {/* Navigation Icons */}
        <nav style={{
          display: 'flex',
          gap: '1rem', // Reduced gap
          marginRight: '1rem' // Reduced margin
        }}>
          <IconLink 
            icon={FaMapMarkerAlt} 
            label="My Kasi" 
            onClick={() => navigate('/map')} 
            active={pathname === '/map' || redirectingToMap}
          />
          <IconLink 
            icon={FaTrophy} 
            label="Leaderboard"
            onClick={() => navigate('/leaderboard')}
            active={pathname === '/leaderboard'}
          />
          <IconLink 
            icon={FaGift} 
            label="Rewards"
            onClick={() => navigate('/rewards')}
            active={pathname === '/rewards'}
          />
          <IconLink 
            icon={FaBell} 
            label="Notifications"
            onClick={() => navigate('/notifications')}
            active={pathname === '/notifications'}
            badge="3"
          />
          <IconLink 
            icon={FaRobot} 
            label="AI Advisor" 
            onClick={() => navigate('/chat', { 
              state: { 
                backgroundImage: location.state?.backgroundImage,
                townshipName: location.state?.townshipName 
              } 
            })} 
            active={pathname === '/chat'}
          />
        </nav>

        {/* Profile Section */}
        <div style={{ position: 'relative' }} ref={modalRef}>
          <button
            onClick={() => user ? setShowProfileMenu(!showProfileMenu) : setShowLoginModal(!showLoginModal)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#fff'
            }}
          >
            <FaUserCircle size={24} />
            <span>{user?.email || 'Login'}</span>
          </button>

          {/* Login Modal */}
          {showLoginModal && !user && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'rgba(30, 30, 30, 0.9)', // More opaque background
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem',
              minWidth: '250px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '250px', // Fixed width
            }}>
              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                {error && <p style={{color: 'red', fontSize: '0.8rem', margin: '0 0 0.5rem'}}>{error}</p>}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    boxSizing: 'border-box', // Add this
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    boxSizing: 'border-box', // Add this
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    marginBottom: '0.5rem'
                  }}
                >
                  Login
                </button>
                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: '#4285f4',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  <img 
                    src="/assets/images/google-icon.png" 
                    alt="Google" 
                    style={{ width: '20px', height: '20px' }}
                  />
                  Sign in with Google
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Create Account
                </button>
              </form>
            </div>
          )}

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'rgba(30, 30, 30, 0.95)', // More opaque background
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              minWidth: '200px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '250px', // Fixed width
            }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  borderRadius: '4px'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.target.style.background = 'none'}
              >
                <RiLogoutBoxRLine />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Add spacer div to prevent content from hiding under header */}
      <div style={{ height: '50px' }} /> {/* Adjust spacer height to match new header height */}
    </>
  );
};

// Helper component for navigation icons
const IconLink = ({ icon: Icon, label, badge, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      position: 'relative',
      background: active ? 'rgba(255, 255, 255, 0.2)' : 'none',
      border: 'none',
      padding: '0.25rem', // Reduced padding
      cursor: 'pointer',
      color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem', // Reduced gap
      borderRadius: '4px',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateZ(0)', // Enable hardware acceleration
      willChange: 'transform, color', // Optimize animations
    }}
    onMouseEnter={e => {
      if (!active) {
        e.currentTarget.style.transform = 'scale(1.1) translateZ(0)';
        e.currentTarget.style.color = '#fff';
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        e.currentTarget.style.transform = 'scale(1) translateZ(0)';
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
      }
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    }}>
      <Icon size={16} /> {/* Reduced icon size */}
      <span style={{ fontSize: '0.8rem' }}>{label}</span>
    </div>
    {badge && (
      <span style={{
        position: 'absolute',
        top: 0,
        right: 0,
        background: '#ff4444',
        color: '#fff',
        borderRadius: '50%',
        padding: '0.1rem 0.4rem',
        fontSize: '0.7rem',
        transform: 'translateZ(0)', // Enable hardware acceleration for badge
      }}>
        {badge}
      </span>
    )}
  </button>
);

export default Header;