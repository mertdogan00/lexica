import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './bootstrap/index.ts';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
