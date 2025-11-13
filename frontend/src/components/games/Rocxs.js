import React, { useState } from 'react';
import './Rocxs.css';
import rocxsImg1 from './Images/rocx1.png';
import rocxsImg2 from './Images/roxs2.png';

function Rocxs({ user, token }) {
  const [showFirst, setShowFirst] = useState(true);

  const handleImageClick = () => {
    setShowFirst(!showFirst);
  };

  return (
    <div className="rocxs-game">
      <h2 className="rocxs-title">ROCXS</h2>
      <div className="rocxs-gif-wrapper">
        <img
          src={showFirst ? rocxsImg1 : rocxsImg2}
          alt="ROCXS"
          className="rocxs-gif"
          onClick={handleImageClick}
        />
      </div>
    </div>
  );
}


export default Rocxs;