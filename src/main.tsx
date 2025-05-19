
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config';

// Check for initial language and set direction accordingly
const initialLang = localStorage.getItem('i18nextLng') || 'ar';
document.dir = initialLang === 'ar' ? 'rtl' : 'ltr';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
