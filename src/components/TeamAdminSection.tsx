
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Edit, Settings, UserPlus, BookOpen, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamAdminSectionProps {
  teamId: string;
  teamSlug: string;
  teamName: string;
  isOwner: boolean;
  memberCount?: number;
}

const TeamAdminSection: React.FC<TeamAdminSectionProps> = ({ 
  teamId, 
  teamSlug, 
  teamName,
  isOwner,
  memberCount = 0
}) => {
  if (!isOwner) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Administration</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Member Management
            </CardTitle>
            <CardDescription>
              Manage team members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Current members: {memberCount}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to={`/teams/${teamSlug}/members`}>
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Members
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit Team Details
            </CardTitle>
            <CardDescription>
              Update team information and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Edit name, colors, and other details</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to={`/teams/${teamSlug}/edit`}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Team
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>
              Manage memories and cards for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Review, approve, and organize team content</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to={`/teams/${teamSlug}/content`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Content
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Access Controls
            </CardTitle>
            <CardDescription>
              Configure team permissions and access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Set permissions for team content</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to={`/teams/${teamSlug}/permissions`}>
                <Settings className="mr-2 h-4 w-4" />
                Access Controls
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Alert>
        <AlertDescription>
          As the team owner, you have full administrative rights for this team. You can add members, 
          manage content, and configure team settings.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TeamAdminSection;
