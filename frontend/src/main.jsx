import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import { Toaster } from './components/ui/toaster.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster />
  </>
  // </StrictMode>
)
