
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card as CardType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export interface FeaturedCardsSectionProps {
  title: string;
  cardsData: CardType[];
  isLoading: boolean;
}

const FeaturedCardsSection: React.FC<FeaturedCardsSectionProps> = ({ 
  title, 
  cardsData, 
  isLoading 
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link 
            to="/gallery" 
            className="text-cardshow-blue flex items-center hover:underline"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : (
            // Actual cards
            cardsData.map(card => (
              <Link to={`/card/${card.id}`} key={card.id}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[2.5/3.5] relative">
                    <img 
                      src={card.imageUrl || '/placeholder-card.jpg'} 
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-lg font-medium text-white">{card.name}</h3>
                      <p className="text-sm text-gray-300">
                        {card.year} {card.brand && `• ${card.brand}`}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const LoadingCard = () => (
  <Card className="overflow-hidden">
    <div className="aspect-[2.5/3.5] relative bg-gray-200">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  </Card>
);

export default FeaturedCardsSection;
