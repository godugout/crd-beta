
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { TeamThemeProvider } from './context/ThemeContext.tsx'
import { BrandThemeProvider } from './context/BrandThemeContext.tsx'
import { AuthProvider } from './context/auth'
import { HelmetProvider } from 'react-helmet-async'
import { CardProvider } from './context/CardContext'
import { SessionProvider } from './providers/session-provider'
import { Toaster } from '@/components/ui/toaster'
import './index.css'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <TeamThemeProvider>
            <BrandThemeProvider>
              <SessionProvider>
                <AuthProvider>
                  <CardProvider>
                    <App />
                    <Toaster />
                  </CardProvider>
                </AuthProvider>
              </SessionProvider>
            </BrandThemeProvider>
          </TeamThemeProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
