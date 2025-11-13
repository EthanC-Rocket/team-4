import React from 'react';
import { useNavigate } from 'react-router-dom';

function MiniGameHub() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Mini Game Hub</h1>
      <button onClick={() => navigate('/would-you-rather')} style={{ fontSize: '1.2em', padding: '10px 20px' }}>
        Play Would You Rather
      </button>
    </div>
  );
}

export default MiniGameHub;
