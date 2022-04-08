import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './index.css';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={'/contracts'} replace />} />
        <Route path="/contracts" element={<App />} />
      </Routes>
    </BrowserRouter>
    
  </React.StrictMode>,
  document.getElementById('root')
);

