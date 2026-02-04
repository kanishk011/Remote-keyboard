import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [keys, setKeys] = useState([]);
  const [control, setControl] = useState({  });
  const [userId, setUserId] = useState(null);


  const handleTakeControl = async () => {
   
  };

  const handleKeyClick = async (keyId) => {

  };

  // Get status message
  const getStatusMessage = () => {
    
  };

  return (
    <div className="app">
      <h2>Remote Keyboard - User {userId}</h2>

      <div className="keyboard">
        {[0, 1].map(row => (
          <div key={row} className="keyboard-row">
            {[1, 2, 3, 4, 5].map(col => {
              const keyId = row * 5 + col;
              const key = keys.find(k => k.key_id === keyId);
              const color = key ? key.color : 'white';
              return (
                <div
                  key={keyId}
                  className="key"
                  style={{ backgroundColor: color }}
                  onClick={() => handleKeyClick(keyId)}
                >
                  {keyId}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="control-btn" onClick={handleTakeControl}>
        Take Control
      </button>

      <p className="status">
        <strong>Status:</strong> {getStatusMessage()}
      </p>
    </div>
  );
}

export default App;
