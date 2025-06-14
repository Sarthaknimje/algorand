import 'buffer';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WalletProvider } from './context/WalletContext';
import { GoogleAuthProvider } from './context/GoogleAuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WalletProvider>
      <GoogleAuthProvider>
        <App />
      </GoogleAuthProvider>
    </WalletProvider>
  </React.StrictMode>
); 