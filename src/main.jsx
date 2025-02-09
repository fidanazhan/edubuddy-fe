import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { JWTProvider } from './context/JWTContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JWTProvider>
      <App />
    </JWTProvider>
  </StrictMode>,
)
