import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { JWTProvider } from './context/JWTContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JWTProvider>
      <ThemeProvider>
        <Suspense fallback={<div className="text-center text-lg">Loading translations...</div>}>
          <App />
        </Suspense>
      </ThemeProvider>
    </JWTProvider>
  </StrictMode>,
)
