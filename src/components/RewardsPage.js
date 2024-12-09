import React, { useState } from 'react';
import { FaTrophy, FaLock, FaCheck, FaGift } from 'react-icons/fa';
// Remove the import and use direct public path
const defaultProfile = '/assets/images/users/default-profile.jpg';

const RewardsPage = () => {
  const [activeCategory, setActiveCategory] = useState('daily');

  const rewards = {
    daily: [
      { 
        id: 1, 
        title: "Early Bird",
        description: "Log in before 8 AM",
        points: 50,
        progress: 1,
        total: 1,
        completed: true,
        icon: "🌅",
        userImage: "/assets/images/users/user1.jpg" // This path is correct as it references the public folder
      },
      {
        id: 2,
        title: "Quick Learner",
        description: "Complete 3 scenarios today",
        points: 100,
        progress: 2,
        total: 3,
        completed: false,
        icon: "📚",
        userImage: "/assets/images/users/user2.jpg"
      },
      {
        id: 3,
        title: "Social Butterfly",
        description: "Share your progress on social media",
        points: 75,
        progress: 0,
        total: 1,
        completed: false,
        icon: "🦋",
        userImage: "/assets/images/users/user3.jpg"
      }
    ],
    weekly: [
      {
        id: 4,
        title: "Township Champion",
        description: "Complete all scenarios in one township",
        points: 500,
        progress: 5,
        total: 7,
        completed: false,
        icon: "🏆",
        userImage: "/assets/images/users/user4.jpg"
      },
      {
        id: 5,
        title: "Perfect Score",
        description: "Get 100% in 5 scenarios",
        points: 300,
        progress: 3,
        total: 5,
        completed: false,
        icon: "⭐",
        userImage: "/assets/images/users/user5.jpg"
      }
    ],
    achievements: [
      {
        id: 6,
        title: "Master Decision Maker",
        description: "Complete all scenarios with perfect scores",
        points: 1000,
        progress: 12,
        total: 20,
        completed: false,
        icon: "👑",
        userImage: "/assets/images/users/user6.jpg"
      },
      {
        id: 7,
        title: "Township Explorer",
        description: "Visit all townships",
        points: 750,
        progress: 3,
        total: 5,
        completed: false,
        icon: "🗺️",
        userImage: "/assets/images/users/user7.jpg"
      }
    ],
    vouchers: [
      {
        id: 8,
        title: "1GB MTN Data Bundle",
        description: "Mobile data valid for 30 days",
        points: 2000,
        progress: 1500,
        total: 2000,
        completed: false,
        icon: "📱",
        userImage: "/assets/images/users/user8.jpg"
      },
      {
        id: 9,
        title: "R50 Vodacom Airtime",
        description: "Prepaid airtime voucher",
        points: 1000,
        progress: 800,
        total: 1000,
        completed: false,
        icon: "📞",
        userImage: "/assets/images/users/user9.jpg"
      },
      {
        id: 10,
        title: "KFC Bucket Feast",
        description: "9-piece bucket meal voucher",
        points: 3000,
        progress: 1200,
        total: 3000,
        completed: false,
        icon: "🍗",
        userImage: "/assets/images/users/user10.jpg"
      },
      {
        id: 11,
        title: "Nando's Quarter Chicken",
        description: "Quarter chicken meal with sides",
        points: 1500,
        progress: 900,
        total: 1500,
        completed: false,
        icon: "🔥",
        userImage: "/assets/images/users/user11.jpg"
      },
      {
        id: 12,
        title: "Steers Burger Combo",
        description: "King Steer Burger with chips and drink",
        points: 1800,
        progress: 1000,
        total: 1800,
        completed: false,
        icon: "🍔",
        userImage: "/assets/images/users/user12.jpg"
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <h1 style={{ 
          color: '#fff',
          textAlign: 'center',
          marginBottom: '2rem',
          fontFamily: 'Kanit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <FaGift />
          Rewards & Achievements
        </h1>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {['daily', 'weekly', 'achievements', 'vouchers'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '0.5rem 1.5rem',
                background: activeCategory === category ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Conditional Rendering based on Category */}
        {activeCategory === 'vouchers' ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginTop: '1rem'
          }}>
            {rewards.vouchers.map(reward => (
              <div
                key={reward.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  gap: '1.5rem',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                  margin: '0.5rem 0'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '2rem' }}>{reward.icon}</span>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', marginBottom: '0.25rem' }}>{reward.title}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    {reward.description}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end',
                  minWidth: '120px' 
                }}>
                  <span style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    color: '#4CAF50',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '15px',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    {reward.points} pts
                  </span>
                  <div style={{ 
                    width: '100px',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(reward.progress / reward.total) * 100}%`,
                      height: '100%',
                      background: '#2196F3',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Original grid layout for other categories
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '1rem'
          }}>
            {rewards[activeCategory].map(reward => (
              <div
                key={reward.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={reward.userImage || defaultProfile} 
                      alt="User"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    <span style={{ fontSize: '2rem' }}>{reward.icon}</span>
                  </div>
                  <span style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    color: '#4CAF50',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '15px',
                    fontSize: '0.9rem'
                  }}>
                    {reward.points} pts
                  </span>
                </div>

                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{reward.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {reward.description}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>
                      Progress: {reward.progress}/{reward.total}
                    </span>
                    {reward.completed ? (
                      <FaCheck style={{ color: '#4CAF50' }} />
                    ) : (
                      <FaLock style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    )}
                  </div>

                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(reward.progress / reward.total) * 100}%`,
                      height: '100%',
                      background: reward.completed ? '#4CAF50' : '#2196F3',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
