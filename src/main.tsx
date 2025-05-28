
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { TeamThemeProvider } from './context/ThemeContext.tsx'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <TeamThemeProvider>
          <App />
        </TeamThemeProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
