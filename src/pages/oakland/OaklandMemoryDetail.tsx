
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import Navbar from '@/components/Navbar';
import { ChevronRight, Clock, MapPin, Users, Calendar, Edit, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OaklandCardTemplate from '@/components/oakland/OaklandCardTemplates';
import { format } from 'date-fns';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

const OaklandMemoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCard } = useCards();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const card = getCard(id);
      if (card) {
        setMemory(card);
      } else {
        toast.error('Memory not found');
      }
      setIsLoading(false);
    }
  }, [id, getCard]);

  // Get Oakland specific metadata
  const oaklandData = memory?.designMetadata?.oaklandMemory;
  const templateType = oaklandData?.template || 'classic';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-20">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 aspect-[2.5/3.5] bg-gray-200 rounded-xl"></div>
            <div className="w-full md:w-1/2">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-100 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memory || !oaklandData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-20">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Not Found</h2>
            <p className="text-gray-600 mb-8">The memory you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/oakland/memories">
                <ArrowLeft className="mr-2 h-4 w-4" /> 
                Back to Memories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <Link to="/" className="hover:text-[#006341]">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/oakland" className="hover:text-[#006341]">Oakland A's</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/oakland/memories" className="hover:text-[#006341]">Memories</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-[#003831] font-medium">{memory.title}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Memory Card */}
          <div className="flex justify-center">
            <OaklandCardTemplate type={templateType} className="w-full max-w-md">
              <div className="relative h-full">
                <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/50 to-transparent">
                  <h2 className="text-2xl font-bold text-white">{memory.title}</h2>
                  {oaklandData.date && (
                    <div className="flex items-center text-sm text-white/90 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(oaklandData.date), 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>
                
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={memory.imageUrl} 
                    alt={memory.title} 
                    className="object-contain max-h-full"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  {oaklandData.location && (
                    <div className="flex items-center text-sm text-white/90 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {oaklandData.location}
                      {oaklandData.section && ` • ${oaklandData.section}`}
                    </div>
                  )}
                  
                  {oaklandData.opponent && (
                    <div className="text-sm text-white/80">
                      vs {oaklandData.opponent}
                      {oaklandData.score && ` • ${oaklandData.score}`}
                    </div>
                  )}
                </div>
              </div>
            </OaklandCardTemplate>
          </div>
          
          {/* Memory Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-[#003831]">{memory.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/oakland/memories/${id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{memory.description}</p>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-medium text-[#003831] mb-2">Memory Details</h3>
              <div className="space-y-2">
                {oaklandData.date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-[#006341]" />
                    <span>Date: {format(new Date(oaklandData.date), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                
                {oaklandData.memoryType && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-[#006341]" />
                    <span>Memory Type: {oaklandData.memoryType.charAt(0).toUpperCase() + oaklandData.memoryType.slice(1)}</span>
                  </div>
                )}
                
                {oaklandData.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-[#006341]" />
                    <span>Location: {oaklandData.location}{oaklandData.section && ` (${oaklandData.section})`}</span>
                  </div>
                )}
                
                {oaklandData.attendees && oaklandData.attendees.length > 0 && (
                  <div className="flex items-start text-gray-600">
                    <Users className="h-4 w-4 mr-2 mt-1 text-[#006341]" />
                    <div>
                      <span>Attended With: </span>
                      <span>{oaklandData.attendees.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {oaklandData.historicalContext && (
              <div className="mb-6">
                <h3 className="font-medium text-[#003831] mb-2">Historical Context</h3>
                <p className="text-gray-700">{oaklandData.historicalContext}</p>
              </div>
            )}
            
            {oaklandData.personalSignificance && (
              <div className="mb-6">
                <h3 className="font-medium text-[#003831] mb-2">Personal Significance</h3>
                <p className="text-gray-700">{oaklandData.personalSignificance}</p>
              </div>
            )}
            
            {memory.tags && memory.tags.length > 0 && (
              <div>
                <h3 className="font-medium text-[#003831] mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map(tag => (
                    <div key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OaklandMemoryDetail;
