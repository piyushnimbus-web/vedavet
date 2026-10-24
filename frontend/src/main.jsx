import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const element = document.getElementById('root');
if (!element) throw new Error('Root mount element missing');
createRoot(element).render(<React.StrictMode><App /></React.StrictMode>);
