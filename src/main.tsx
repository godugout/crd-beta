
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { TeamThemeProvider } from './context/ThemeContext.tsx'
import { BrandThemeProvider } from './context/BrandThemeContext.tsx'
import { AuthProvider as RootAuthProvider } from './context/auth/AuthProvider'
import { HelmetProvider } from 'react-helmet-async'
import { CardProvider } from './context/CardContext'
import './index.css'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <TeamThemeProvider>
            <BrandThemeProvider>
              <RootAuthProvider>
                <CardProvider>
                  <App />
                </CardProvider>
              </RootAuthProvider>
            </BrandThemeProvider>
          </TeamThemeProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
