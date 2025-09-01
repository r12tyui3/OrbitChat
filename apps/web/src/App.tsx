import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RealtimeHandler } from './ws/realtime';
import { useStore } from './state/store';

function App() {
  const { messages } = useStore();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className="message">{msg.text}</div>
              ))}
            </div>
            <RealtimeHandler />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;