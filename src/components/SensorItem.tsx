import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import '../styles/SensorItem.css';

interface Props {
  icon: string;
  name: string;
  value: string;
  critical: boolean;
  changeUserAlias: (name: string, alias: string) => void;
}

const SensorItem = ({ icon, name, value, critical, changeUserAlias }: Props) => {
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSaveName = () => {
    changeUserAlias(name, newName);
    setShowEditName(false);
  };

  return (
    <div className="sensor-item" style={{backgroundColor: critical ? 'red' : undefined}}>
      <img src={icon} alt={`Icon ${name}`} />
      <div className="sensor-info">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <div className="sensor-name">{name}</div>
          <FaEdit style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => setShowEditName(!showEditName)} />
        </span>
        {showEditName && (
          <div>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button className="save-button" type="button" onClick={handleSaveName}>Save</button>
          </div>
        )}
        <div className="sensor-value">{value}</div>
      </div>
    </div>
  );
};

export default SensorItem;