
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Calendar, Users, Clock, Edit, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import OaklandCardTemplate from '@/components/oakland/OaklandCardTemplates';
import { toast } from 'sonner';
import { OaklandTemplateType } from '@/components/oakland/OaklandCardTemplates';

const OaklandMemoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCard } = useCards();
  const card = getCard(id || '');
  
  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-700">Memory not found</h1>
            <p className="mt-2 text-gray-500">The memory you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="mt-6">
              <Link to="/oakland-memories">Back to Memories</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const memory = card.designMetadata?.oaklandMemory;
  
  // Handle copy link functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/oakland-memories">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Button>
          </Link>
          
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-8">
            {/* Card Display */}
            <div className="w-full md:w-1/3 max-w-xs mx-auto md:mx-0">
              <OaklandCardTemplate 
                type={(memory?.template as OaklandTemplateType) || 'classic'} 
                className="mx-auto md:mx-0 shadow-xl"
              >
                {card.imageUrl && (
                  <img 
                    src={memory?.imageUrl || card.imageUrl} 
                    alt={card.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                )}
                
                <div className="relative z-10 p-5 flex flex-col h-full text-white">
                  <h2 className="text-xl font-bold text-[#EFB21E] mb-2">{card.title}</h2>
                  
                  {memory?.date && (
                    <div className="flex items-center text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-[#EFB21E]" />
                      {format(new Date(memory.date), 'MMMM d, yyyy')}
                    </div>
                  )}
                  
                  <p className="flex-grow text-sm">{card.description}</p>
                  
                  {memory?.opponent && (
                    <div className="mt-4 p-2 bg-[#003831]/50 rounded-md">
                      <div className="font-semibold text-[#EFB21E]">vs {memory.opponent}</div>
                      {memory.score && (
                        <div className="text-sm mt-1">{memory.score}</div>
                      )}
                    </div>
                  )}
                </div>
              </OaklandCardTemplate>
              
              <div className="flex justify-center mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                <Button asChild size="sm">
                  <Link to={`/oakland-memory-editor/${card.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Memory Details */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-[#003831]">{card.title}</h1>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#003831]">About this memory</h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{card.description}</p>
                </div>
                
                {memory && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {memory.location && (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-[#006341] mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-gray-600">
                              {memory.location}
                              {memory.section && <span className="block text-sm">{memory.section}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {memory.date && (
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-[#006341] mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">Date</div>
                            <div className="text-gray-600">{format(new Date(memory.date), 'MMMM d, yyyy')}</div>
                          </div>
                        </div>
                      )}
                      
                      {memory.attendees && memory.attendees.length > 0 && (
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-[#006341] mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">With</div>
                            <div className="text-gray-600">
                              {memory.attendees.join(', ')}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {memory.memoryType && (
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-[#006341] mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">Memory Type</div>
                            <div className="text-gray-600">
                              {memory.memoryType.charAt(0).toUpperCase() + memory.memoryType.slice(1)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {memory.tags && memory.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-[#003831]">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {memory.tags.map(tag => (
                            <div key={tag} className="px-3 py-1 bg-[#EFB21E]/20 text-[#003831] rounded-full text-sm">
                              #{tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OaklandMemoryDetail;
