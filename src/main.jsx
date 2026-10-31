import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initKnowledge } from './knowledge.js';
import { finishRedirectSignIn } from './firebase.js';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif', color: '#94A3B8' }}>Loading BAPO Path…</div>);
Promise.all([initKnowledge(), finishRedirectSignIn()]).finally(() => root.render(<React.StrictMode><App /></React.StrictMode>));
