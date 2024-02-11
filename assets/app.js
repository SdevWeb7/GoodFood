import React from "react";
import ReactDOM from 'react-dom/client'
import './styles/app.scss';
import App from "./App.jsx";


ReactDOM.createRoot(document.querySelector('#react')).render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
)