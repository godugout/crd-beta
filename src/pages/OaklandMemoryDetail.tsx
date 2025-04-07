
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, MapPin, Users, Share2, Trash, Edit, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import OaklandCardTemplate from '@/components/oakland/OaklandCardTemplates';

const OaklandMemoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, deleteCard } = useCards();
  
  // Find the card data
  const card = id ? cards.find(c => c.id === id) : undefined;
  const oaklandMemory = card?.designMetadata?.oaklandMemory;

  if (!card || !oaklandMemory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-[#003831] mb-4">Memory Not Found</h1>
            <p className="mb-6">The memory you're looking for doesn't exist or has been removed.</p>
            <Link to="/oakland-memories">
              <Button className="bg-[#006341] hover:bg-[#003831] text-white">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Memories
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      deleteCard(card.id);
      toast.success('Memory deleted successfully');
      navigate('/oakland-memories');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      })
      .then(() => toast.success('Memory shared successfully'))
      .catch(error => console.error('Error sharing memory:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link to="/oakland-memories">
          <Button variant="ghost" className="mb-4 -ml-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Memories
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Card Display */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="max-w-xs w-full">
              <OaklandCardTemplate
                type={oaklandMemory.template || 'classic'}
                className="shadow-xl"
              >
                <div className="relative w-full h-full">
                  {/* Card Image */}
                  <div className="absolute inset-0">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003831] via-[#00383180] to-transparent"></div>
                  
                  {/* Card Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="text-xl font-bold text-[#EFB21E]">{card.title}</h2>
                    <p className="text-sm mt-1 line-clamp-2">{card.description}</p>
                  </div>
                </div>
              </OaklandCardTemplate>
            </div>
          </div>
          
          {/* Memory Details */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold text-[#003831] mb-2">{card.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#006341]">
                  {oaklandMemory.memoryType === 'game' ? 'Game Memory' : 
                   oaklandMemory.memoryType === 'tailgate' ? 'Tailgate Memory' : 
                   oaklandMemory.memoryType === 'memorabilia' ? 'Memorabilia' : 
                   'Memory'}
                </Badge>
                
                {oaklandMemory.opponent && (
                  <Badge variant="outline" className="border-[#006341] text-[#006341]">
                    vs {oaklandMemory.opponent}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-gray-600">
                {oaklandMemory.date && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[#006341]" />
                    {format(new Date(oaklandMemory.date), 'MMMM d, yyyy')}
                  </div>
                )}
                
                {oaklandMemory.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#006341]" />
                    {oaklandMemory.location}
                    {oaklandMemory.section && ` • ${oaklandMemory.section}`}
                  </div>
                )}
                
                {oaklandMemory.attendees && oaklandMemory.attendees.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#006341]" />
                    {oaklandMemory.attendees.join(', ')}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{card.description}</p>
              </div>
              
              {oaklandMemory.score && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Final Score</h3>
                  <p className="text-xl font-bold text-[#003831]">{oaklandMemory.score}</p>
                </div>
              )}
              
              {card.tags && card.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-[#EFB21E]/10 text-[#003831] border-[#EFB21E]/30">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-8 border-t pt-6">
                <Button 
                  onClick={() => navigate(`/oakland-memories/edit/${card.id}`)}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
                
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="flex-1 sm:flex-none text-red-500 hover:text-red-700 hover:border-red-200 hover:bg-red-50"
                >
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </Button>
                
                <Button className="flex-1 sm:flex-none bg-[#006341] hover:bg-[#003831] text-white ml-auto">
                  <Heart className="mr-1 h-4 w-4" />
                  Save to Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OaklandMemoryDetail;
