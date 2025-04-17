
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { EnhancedCardProvider } from '@/context/CardEnhancedContext';

const Admin: React.FC = () => {
  return (
    <EnhancedCardProvider>
      <PageLayout
        title="Admin Dashboard"
        description="Manage cards, collections and users"
      >
        <AdminDashboard />
      </PageLayout>
    </EnhancedCardProvider>
  );
};

export default Admin;
