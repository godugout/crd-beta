
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile', {
          description: result.error || 'Please try again later'
        });
      }
    } catch (error) {
      toast.error('Failed to update profile', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cancelEdit = () => {
    setFormData({
      displayName: user?.displayName || '',
      name: user?.name || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    });
    setIsEditing(false);
  };
  
  // Function to get initials for avatar fallback
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email.substring(0, 2).toUpperCase() || 'U';
  };
  
  return (
    <ProtectedRoute>
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>Your public information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-medium">{user?.displayName || user?.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                <div className="w-full mt-4">
                  <div className="bg-muted p-3 rounded-md text-sm mt-2">
                    <p className="font-medium">Role:</p> 
                    <span className="capitalize">{user?.role}</span>
                  </div>
                  {user?.bio && (
                    <div className="mt-4">
                      <p className="font-medium text-sm mb-1">Bio:</p>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Profile Edit Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Profile' : 'Account Information'}</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? 'Update your profile information below' 
                    : 'Your account details and preferences'}
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          placeholder="How you want to be known"
                          value={formData.displayName}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                          id="avatarUrl"
                          name="avatarUrl"
                          placeholder="https://example.com/avatar.jpg"
                          value={formData.avatarUrl}
                          onChange={handleChange}
                        />
                        {formData.avatarUrl && (
                          <div className="mt-2 flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">Preview:</span>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={formData.avatarUrl} alt="Avatar preview" />
                              <AvatarFallback>{getInitials()}</AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium">Email</h3>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Full Name</h3>
                          <p className="text-sm text-muted-foreground">{user?.name || 'Not set'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Display Name</h3>
                        <p className="text-sm text-muted-foreground">{user?.displayName || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Biography</h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.bio || 'No biography provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Account Created</h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {isEditing && (
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default Profile;
