import React from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoadingSpinner = ({ animation = 'border', variant = 'primary', size = null, message = '' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
      <Spinner animation={animation} variant={variant} size={size} role="status">
        <span className="visually-hidden">{message}</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
