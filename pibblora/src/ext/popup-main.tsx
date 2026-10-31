import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { StoreProvider } from '../shared/StoreContext';
import Popup from './Popup';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><StoreProvider><Popup /></StoreProvider></React.StrictMode>
);