import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { UserCard } from '@/components/cards/UserCard';
import { User, UserRole } from '@/lib/types/user';
import { useAuth } from '@/hooks/useAuth'; // Assuming this is the auth context

// Define and export UserProfile interface
export interface UserProfile extends User {
  role: UserRole; // Make role required for UserProfile
}

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PageLayout title="Dashboard" description="User Dashboard">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Please sign in to view your dashboard.</p>
        </div>
      </PageLayout>
    );
  }

  // Replace 'users' with manually created profiles or fetch from elsewhere
  const { user } = useAuth(); // Instead of users property
  
  const userProfiles: UserProfile[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl: '/images/avatars/admin.png'
    },
    {
      id: '2',
      email: 'creator@example.com',
      name: 'Content Creator',
      role: UserRole.CREATOR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl: '/images/avatars/creator.png'
    },
    {
      id: '3',
      email: 'user@example.com',
      name: 'Regular User',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Continue with the existing render code, using userProfiles instead of users
  return (
    <PageLayout title="Dashboard" description="User Dashboard">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProfiles.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
