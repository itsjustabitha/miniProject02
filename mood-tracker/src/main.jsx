import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Module 7 slide 52
import 'bootstrap/dist/css/bootstrap.min.css';     // Bootstrap CSS loaded globally
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter must wrap App - no other routing components work without it */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);