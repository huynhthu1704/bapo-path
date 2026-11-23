import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initKnowledge, KB_SOURCE } from './knowledge.js';
import { finishRedirectSignIn } from './firebase.js';
import { track } from './busy.js';
import { capturePreview } from './data/flags.js';
import './styles.css';

capturePreview(); // remembers ?preview=<flag> for design review
// Registered before the router's own listener, so menus see the preview on the same navigation.
for (const ev of ['popstate', 'hashchange']) window.addEventListener(ev, () => capturePreview());

// Show the site straight away with the bundled content. When the cloud knowledge base arrives,
// the pages re-render with it (no waiting screen).
function Root() {
  const [kbVersion, setKbVersion] = useState(0);
  useEffect(() => {
    track(initKnowledge()).then(() => { if (KB_SOURCE.value === 'cloud') setKbVersion((v) => v + 1); });
    track(finishRedirectSignIn()); // completes a Google sign-in that used the redirect fallback
  }, []);
  return <App kbVersion={kbVersion} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Root /></React.StrictMode>);
