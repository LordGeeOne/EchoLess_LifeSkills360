import React from 'react';
import { useLocation } from 'react-router-dom';

const ScenarioSelection = ({ scenarios, onSelectScenario }) => {
  const location = useLocation();
  const { townshipName } = location.state || {};

  return (
    <div className="scenario-selection" style={{
      position: 'relative',
      zIndex: 2,
      padding: '20px',
    }}>
      <h2>Select a Scenario in {townshipName}</h2>
      {scenarios.map((scenario, index) => (
        <button 
          key={index} 
          onClick={() => onSelectScenario(scenario)}
          style={{
            background: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            margin: '8px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            ':hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          {scenario.name}
        </button>
      ))}
    </div>
  );
};

export default ScenarioSelection;