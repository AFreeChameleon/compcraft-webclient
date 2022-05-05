import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Index from './pages/Index';
import RoomCodeIndex from './pages/Room';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/code/:roomCode" element={<RoomCodeIndex />}/>
      </Routes>
    </div>
  );
}

export default App;