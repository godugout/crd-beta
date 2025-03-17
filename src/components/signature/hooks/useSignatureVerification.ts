
import { useState, useEffect } from 'react';
import { Point } from './useSignatureCanvas';

export const useSignatureVerification = () => {
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [signatureHash, setSignatureHash] = useState<string>('');
  
  // Update timestamp periodically
  useEffect(() => {
    setTimestamp(Date.now());
    
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  /**
   * Generate a cryptographic hash of the signature using Web Crypto API
   */
  const generateSignatureHash = async (points: Point[]) => {
    try {
      // Create a string representation of the signature
      const signatureData = points.map(p => 
        `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.pressure.toFixed(4)},${p.timestamp}`
      ).join(';');
      
      // Add current timestamp for uniqueness
      const dataWithTimestamp = `${signatureData}|${timestamp}`;
      
      // Convert to buffer for hashing
      const encoder = new TextEncoder();
      const data = encoder.encode(dataWithTimestamp);
      
      // Use Web Crypto API to generate a SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setSignatureHash(hashHex);
      return hashHex;
    } catch (error) {
      console.error("Error generating signature hash:", error);
      return '';
    }
  };
  
  /**
   * Verify a signature against a stored hash
   */
  const verifySignature = async (points: Point[], storedHash: string) => {
    try {
      const currentHash = await generateSignatureHash(points);
      return currentHash === storedHash;
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  };
  
  return {
    timestamp,
    signatureHash,
    generateSignatureHash,
    verifySignature
  };
};
