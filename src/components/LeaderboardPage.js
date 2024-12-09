import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMedal, FaFilter, FaSearch } from 'react-icons/fa';

const LeaderboardPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTownship, setSelectedTownship] = useState('all');

  const dummyData = {
    weekly: [
      { id: 1, name: "Lethabo M.", township: "Soweto", points: 2500, avatar: "/assets/images/users/user1.jpg" },
      { id: 2, name: "Sbuda D.", township: "Alexandra", points: 2350, avatar: "/assets/images/users/user2.jpg" },
      { id: 3, name: "Hloni R.", township: "Tembisa", points: 2200, avatar: "/assets/images/users/user3.jpg" },
      // Add more dummy data...
    ],
    monthly: [
      { id: 1, name: "Tumisho K.", township: "Soweto", points: 9500, avatar: "/assets/images/users/user4.jpg" },
      { id: 2, name: "Lethabo T.", township: "Alexandra", points: 9200, avatar: "/assets/images/users/user5.jpg" },
      // Add more dummy data...
    ],
    allTime: [
      { id: 1, name: "Luyands M.", township: "Tembisa", points: 25000, avatar: "/assets/images/users/user6.jpg" },
      { id: 2, name: "Phila S.", township: "Soweto", points: 24500, avatar: "/assets/images/users/user1.jpg" },
      // Add more dummy data...
    ]
  };

  const townships = ['all', 'Soweto', 'Alexandra', 'Tembisa'];

  const filteredData = dummyData[activeTab]
    .filter(player => 
      (selectedTownship === 'all' || player.township === selectedTownship) &&
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '2rem'
    }}>
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
          fontFamily: 'Kanit, sans-serif'
        }}>
          Leaderboard
        </h1>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['weekly', 'monthly', 'allTime'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === tab ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.5)'
              }} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  color: '#fff'
                }}
              />
            </div>

            <select
              value={selectedTownship}
              onChange={(e) => setSelectedTownship(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                color: '#fff'
              }}
            >
              {townships.map(township => (
                <option key={township} value={township}>
                  {township.charAt(0).toUpperCase() + township.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <th style={{ padding: '1rem', color: '#fff', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '1rem', color: '#fff', textAlign: 'left' }}>Player</th>
                <th style={{ padding: '1rem', color: '#fff', textAlign: 'left' }}>Township</th>
                <th style={{ padding: '1rem', color: '#fff', textAlign: 'right' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player, index) => (
                <tr 
                  key={player.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '1rem', color: '#fff' }}>
                    {index < 3 ? (
                      <FaMedal style={{ 
                        color: ['gold', 'silver', '#cd7f32'][index],
                        fontSize: '1.5rem'
                      }} />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={player.avatar} 
                        alt={player.name}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      {player.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#fff' }}>{player.township}</td>
                  <td style={{ padding: '1rem', color: '#fff', textAlign: 'right' }}>
                    {player.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
