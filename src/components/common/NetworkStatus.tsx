
import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showStatus, setShowStatus] = useState(false)
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  if (!showStatus && isOnline) return null
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-md shadow-md transition-opacity duration-300 ${showStatus ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Back online</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>You are offline</span>
          </>
        )}
      </div>
    </div>
  )
}

export default NetworkStatus
