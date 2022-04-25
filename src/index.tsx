import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Vykreslení instance aplikační komponenty do HTML struktury.
const root2 = document.getElementById('root');

if (root2!=null){
const root = ReactDOM.createRoot(root2);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
