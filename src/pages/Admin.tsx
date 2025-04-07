
import React from 'react';
import { Container } from '@/components/ui/container';
import PopulateDatabase from '@/components/admin/PopulateDatabase';
import Navbar from '@/components/Navbar';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container className="py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Tools</h1>
          <p className="text-gray-600 mt-2">Tools for managing your card collection system</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <PopulateDatabase />
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;
