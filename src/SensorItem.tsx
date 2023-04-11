import React from "react";

interface Props {
  icon: string;
  name: string;
  value: string;
  critical?: boolean;
}

const SensorItem = ({ icon, name, value, critical}: Props) => {
  const containerStyle = {
    margin: '5px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: critical ? 'red' : undefined, 
  };
  
  return (
    <div className="sensor-item" style={containerStyle}>
      <div className="sensor-icon">
        <img src={icon} width="50" height="50" alt={`Icon ${name}`} style={{ boxShadow: '0px 0px 10px #aaa' }} />
      </div>
      <div className="sensor-info" style={{ marginTop: '10px' }}>
        <div className="sensor-name" style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '18px' }}>{name}</div>
        <div className="sensor-value" style={{ fontFamily: 'Arial', fontSize: '16px', marginTop: '5px' }}>{value}</div>
      </div>
    </div>
  );
};

export default SensorItem;