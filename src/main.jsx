import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'          // ← base styles
import "./styles/motion.css"; // ← motion on top ✅
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)