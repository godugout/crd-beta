import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import TeamGalleryCard from '@/components/teams/TeamGalleryCard';
import TeamGalleryFilters from '@/components/teams/TeamGalleryFilters';
import TeamGalleryLoading from '@/components/teams/TeamGalleryLoading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, LayoutList, PlusCircle, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTeamGalleryData from '@/hooks/useTeamGalleryData';

const TeamGallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { teams, loading, error } = useTeamGalleryData();
  
  return (
    <PageLayout 
      title="Teams" 
      description="Browse team memories and collections"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' 
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
          
          <Button variant="soft" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button 
            variant="default" 
            size="sm"
            className="bg-[var(--brand-primary)] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Team
          </Button>
        </div>
      }
    >
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-[var(--bg-secondary)]/30 backdrop-blur-md border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-1 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                All Teams
              </TabsTrigger>
              <TabsTrigger value="league" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                By League
              </TabsTrigger>
              <TabsTrigger value="division" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                By Division
              </TabsTrigger>
            </TabsList>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="all">
            {loading ? (
              <TeamGalleryLoading />
            ) : teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamGalleryCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No teams found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="league">
            {loading ? (
              <TeamGalleryLoading />
            ) : teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamGalleryCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No teams found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="division">
            {loading ? (
              <TeamGalleryLoading />
            ) : teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamGalleryCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No teams found</p>
                <p className="text-gray-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default TeamGallery;
