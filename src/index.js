import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataProvider } from './contexts/dataContext'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);