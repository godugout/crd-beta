
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/cards/CardGrid';
import FilterPanel from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, LayoutList, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CardCollectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  // Handler for card clicks
  const handleCardClick = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };

  return (
    <PageLayout
      title="Cards"
      description="Browse and discover unique digital cards"
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
            onClick={() => navigate('/cards/create')}
            className="bg-[var(--brand-primary)] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Card
          </Button>
        </div>
      }
    >
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-[var(--bg-secondary)]/30 backdrop-blur-md border border-[var(--border-primary)] rounded-xl overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-1 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                All Cards
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                Recent
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-[var(--brand-primary)]/10 data-[state=active]:text-[var(--brand-primary)] rounded-lg py-2.5 h-auto">
                Favorites
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <CardGrid cards={[]} onCardClick={handleCardClick} />
          </TabsContent>
          
          <TabsContent value="recent">
            <CardGrid cards={[]} onCardClick={handleCardClick} />
          </TabsContent>
          
          <TabsContent value="favorites">
            <CardGrid cards={[]} onCardClick={handleCardClick} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default CardCollectionPage;
