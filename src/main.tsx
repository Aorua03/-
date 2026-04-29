import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PromptProvider } from './context/PromptContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PromptProvider>
      <App />
    </PromptProvider>
  </StrictMode>,
);
