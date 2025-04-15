
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import ImageUploader from '@/components/dam/ImageUploader';
import { cardData } from '@/data/cardData';
import CardShowcase from '@/components/home/CardShowcase';
import CardUpload from '@/components/home/CardUpload';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eye, Sparkles, Plus, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'welcome' | 'showcase' | 'collection' | 'upload'>('welcome');
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelectCard = (index: number) => {
    setActiveCard(index);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardCreated = (cardId: string) => {
    toast.success('Card created successfully!');
    navigate(`/immersive/${cardId}`);
  };

  if (view === 'showcase') {
    return (
      <PageLayout>
        <CardShowcase
          cardData={cardData}
          activeCard={activeCard}
          isFlipped={isFlipped}
          selectCard={handleSelectCard}
          flipCard={handleFlipCard}
          setView={setView}
        />
      </PageLayout>
    );
  }

  if (view === 'upload') {
    return (
      <PageLayout>
        <CardUpload 
          setView={setView} 
          onCardCreated={handleCardCreated} 
        />
      </PageLayout>
    );
  }

  // Welcome/Home view
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Welcome to CardShow</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, collect, and experience digital trading cards with stunning visual effects and immersive viewing modes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                <Upload className="h-6 w-6 mb-1" />
                Upload & Create
              </CardTitle>
              <CardDescription>Upload an image and create your card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Start from scratch with your own image and create custom cards with stunning visual effects.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setView('upload')} className="w-full">
                Create a Card <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                <Eye className="h-6 w-6 mb-1" />
                Browse Collection
              </CardTitle>
              <CardDescription>View your card collection</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse through your existing card collection and view details on any card.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/cards')} variant="outline" className="w-full">
                View Collection <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                <Sparkles className="h-6 w-6 mb-1" />
                Interactive Showcase
              </CardTitle>
              <CardDescription>Experience card effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Try out our showcase demo with interactive visual effects and 3D transformations.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setView('showcase')} variant="outline" className="w-full">
                Try Showcase <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardData.slice(0, 4).map((card, index) => (
              <div 
                key={card.id} 
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/immersive/${card.id}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{card.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{card.team}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
