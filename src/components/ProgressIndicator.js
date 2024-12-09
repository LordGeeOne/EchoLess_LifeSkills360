import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="step-progress-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-indicator ${index === currentStep ? 'current' : ''}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;