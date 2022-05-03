import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Index from './pages/Index';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/code/:roomCode"/>
      </Routes>
    </div>
  );
}

export default App;