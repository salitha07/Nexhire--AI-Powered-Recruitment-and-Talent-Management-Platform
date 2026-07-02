import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css'; // or wherever you put the Tailwind directives
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);