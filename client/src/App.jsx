import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Chat from './components/Chat.jsx';
import Register from './components/Register.jsx';

const App = () => (
  
  <Router>
    <Routes>
    <Route path="/"  element={<Login/>} />
    <Route path="/register" element={<Register/>} />
    <Route path="/chat" element={<Chat/>} />
    </Routes>
  </Router>
);

export default App;
