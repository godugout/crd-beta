
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SignatureAnalyzer, { SignatureData } from '@/components/signature/SignatureAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const SignatureDemo = () => {
  const [savedSignatures, setSavedSignatures] = useState<SignatureData[]>([]);
  
  const handleSaveSignature = (signatureData: SignatureData) => {
    setSavedSignatures(prev => [signatureData, ...prev]);
    toast.success('Signature saved successfully');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Signature Analysis</h1>
            <p className="text-cardshow-slate">
              Create, analyze, and verify digital signatures with advanced ink simulation technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Here</CardTitle>
                  <CardDescription>
                    Draw your signature in the box below. The system will analyze pressure, ink flow, and generate a secure hash.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignatureAnalyzer onSave={handleSaveSignature} />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Signatures</CardTitle>
                  <CardDescription>
                    Your verified signatures with cryptographic timestamps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedSignatures.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No saved signatures yet</p>
                      <p className="text-sm mt-2">Create and save a signature to see it here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedSignatures.map((sig, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="bg-white p-2 rounded border mb-2">
                            <div dangerouslySetInnerHTML={{ __html: sig.svg }} />
                          </div>
                          <div className="text-xs text-gray-500">
                            <p>Signed: {new Date(sig.timestamp).toLocaleString()}</p>
                            <p className="truncate">
                              Hash: {sig.signatureHash.substring(0, 16)}...
                            </p>
                            <div className="flex justify-between mt-1 text-xs">
                              <span>Points: {sig.metadata.points}</span>
                              <span>Strokes: {sig.metadata.strokes}</span>
                              <span>Duration: {sig.metadata.duration / 1000}s</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignatureDemo;
