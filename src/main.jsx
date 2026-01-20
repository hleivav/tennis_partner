import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/header.css'
import App from './App.jsx'  
// import { clearAllInvitations } from './services/api'; // Only needed for manual reset

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

