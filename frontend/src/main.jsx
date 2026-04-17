import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import './index.css'
import AuthProvider from './providers/AuthProvider.jsx'

const queryClient = new QueryClient()

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>

        <QueryClientProvider client={queryClient}>

          <AuthProvider>
            <App />
          </AuthProvider>
          <Toaster position='top-center' />

        </QueryClientProvider>

      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
