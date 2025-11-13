import React, { useState } from 'react';

const ZORK_MAP = {
  'start': {
    description: 'You are standing in an open field west of a white house, with a boarded front door.',
    actions: {
      'go north': 'forest',
      'go east': 'house',
      'look': 'start',
    }
  },
  'forest': {
    description: 'You are in a dark forest. Paths lead south and east.',
    actions: {
      'go south': 'start',
      'go east': 'clearing',
      'look': 'forest',
    }
  },
  'house': {
    description: 'You are at the front door of the house. It is boarded shut.',
    actions: {
      'go west': 'start',
      'look': 'house',
    }
  },
  'clearing': {
    description: 'You are in a clearing. There is a small mailbox here.',
    actions: {
      'go west': 'forest',
      'open mailbox': 'mailbox',
      'look': 'clearing',
    }
  },
  'mailbox': {
    description: 'You open the mailbox. Inside is a leaflet.',
    actions: {
      'read leaflet': 'leaflet',
      'go west': 'forest',
      'look': 'mailbox',
    }
  },
  'leaflet': {
    description: 'Welcome to Zork! This is a simple demo.',
    actions: {
      'go west': 'forest',
      'look': 'leaflet',
    }
  }
};

function Zork() {
  const [location, setLocation] = useState('start');
  const [history, setHistory] = useState([ZORK_MAP['start'].description]);
  const [input, setInput] = useState('');

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();
    const actions = ZORK_MAP[location].actions;
    if (actions[command]) {
      const newLoc = actions[command];
      setLocation(newLoc);
      setHistory([...history, ZORK_MAP[newLoc].description]);
    } else {
      setHistory([...history, `I don't understand "${command}".`]);
    }
    setInput('');
  };

  return (
    <div className="zork-container" style={{ maxWidth: 600, margin: '40px auto', background: '#222', color: '#eee', padding: 20, borderRadius: 8 }}>
      <h2>Zork Demo</h2>
      <div className="zork-history" style={{ minHeight: 200, marginBottom: 20 }}>
        {history.map((line, idx) => <div key={idx}>{line}</div>)}
      </div>
      <form onSubmit={handleCommand} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={handleInput} style={{ flex: 1, padding: 8, fontSize: 16, background: '#333', color: '#eee', border: '1px solid #444', borderRadius: 4 }} placeholder="Type a command..." />
        <button type="submit" style={{ padding: '8px 16px', fontSize: 16, background: '#667eea', color: '#fff', border: 'none', borderRadius: 4 }}>Go</button>
      </form>
    </div>
  );
}

export default Zork;
