import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import { Toaster } from 'sonner'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
    {/* Todo: Use sooner instead of toaster */}
    <Toaster  richColors position='bottom-left'/>
  </>
  // </StrictMode>
)
