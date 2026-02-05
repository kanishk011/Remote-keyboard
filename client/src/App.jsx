import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [keys, setKeys] = useState([]);
  const [control, setControl] = useState({ userId: null, acquiredAt: null });
  // Get user ID from query params
  const params = new URLSearchParams(window.location.search);
  const [userId] = useState(parseInt(params.get('user')) || 1);

  // Poll for updates every 1 second
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch(`${API_URL}/keyboard`);
        const data = await response.json();
        setKeys(data.keys);
        setControl(data.control);
      } catch (error) {
        console.error('Error fetching state:', error);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  // take control for the keyboard 
  const handleTakeControl = async () => {
    try {
      const response = await fetch(`${API_URL}/keyboard/control/take`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error taking control:', error);
    }
  };

  // Toggle key to update the key board color
  const handleKeyClick = async (keyId) => {
    if (control.userId !== userId) {
      alert('You need to take control first!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/keyboard/key/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId, userId })
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error toggling key:', error);
    }
  };

  // Get which user have control - status message
  const getStatusMessage = () => {
    if (!control.userId) {
      return 'No user has control now';
    }
    return `User ${control.userId} has control`;
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
