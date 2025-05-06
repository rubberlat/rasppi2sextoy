import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import DiagnosticsPage from './pages/DiagnosticsPage';
import ControlPage from './pages/ControlPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/control" element={<ControlPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;