import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toast from './components/Toast/Toast.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toast />
  </StrictMode>
);
