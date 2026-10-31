import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { StoreProvider } from '../shared/StoreContext';
import DreamTab from './DreamTab';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><StoreProvider><DreamTab /></StoreProvider></React.StrictMode>
);