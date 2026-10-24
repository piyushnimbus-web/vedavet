import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// The router's basename is /beta/node; outside it (e.g. https://vedavet.onrender.com/) it renders nothing.
const BASENAME = '/beta/node';
const { pathname, search, hash } = window.location;
if (pathname !== BASENAME && !pathname.startsWith(BASENAME + '/')) {
  window.location.replace(BASENAME + pathname + search + hash);
}

const element = document.getElementById('root');
if (!element) throw new Error('Root mount element missing');
createRoot(element).render(<React.StrictMode><App /></React.StrictMode>);
