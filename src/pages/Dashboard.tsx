import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { UserCard } from '@/components/cards/UserCard';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole } from '@/lib/types';

// Add a UserProfile interface that extends User with required role
interface UserProfile extends Omit<User, 'role'> {
  role: UserRole;
}

const Dashboard: React.FC = () => {
  const { users, isLoading, error } = useAuth();

  // Group users by role
  const usersByRole = React.useMemo(() => {
    if (!users) return { admins: [], moderators: [], users: [] };

    const admins: User[] = [];
    const moderators: User[] = [];
    const usersList: User[] = [];

    users.forEach(user => {
      switch (user.role) {
        case UserRole.ADMIN:
          admins.push(user);
          break;
        case UserRole.MODERATOR:
          moderators.push(user);
          break;
        default:
          usersList.push(user);
          break;
      }
    });

    return { admins, moderators, users: usersList };
  }, [users]);

  // Update the transformUser function to ensure the role is always set
  const transformUserToProfile = (user: User): UserProfile => {
    return {
      ...user,
      role: user.role || UserRole.USER // Default to USER if role is undefined
    };
  };

  return (
    <PageLayout title="Dashboard" description="Your personal dashboard">
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">Admin Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersByRole.admins.map(user => (
            <UserCard key={user.id} user={transformUserToProfile(user)} />
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Moderator Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersByRole.moderators.map(user => (
            <UserCard key={user.id} user={transformUserToProfile(user)} />
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Regular Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersByRole.users.map(user => (
            <UserCard key={user.id} user={transformUserToProfile(user)} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
