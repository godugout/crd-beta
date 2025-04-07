
import React from 'react';
import Navbar from '@/components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit, Calendar, MapPin, Users, Tag, Award, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// This is a placeholder component - in a real app, you'd fetch the memory data from an API
const OaklandMemoryDetail = () => {
  const { id } = useParams();
  
  // Mock data for the memory
  const memory = {
    id,
    title: "First A's Game at the Coliseum",
    date: "2023-06-15",
    location: "Oakland Coliseum, Section 220",
    opponent: "Tampa Bay Rays",
    description: "My first time visiting the Oakland Coliseum to watch the A's play. Despite the team struggling, the atmosphere was amazing and the fans were incredibly welcoming. The A's won 4-2 with a clutch home run in the 8th inning.",
    images: ["/oakland/sample-memory.jpg"],
    tags: ["First Game", "Home Run", "Win"],
    attendees: ["Sarah", "Mike", "Carlos"],
    memorabiliaType: "game",
    userNotes: "Need to try the garlic fries next time!",
    historicalContext: "This was during the A's final season at the Coliseum before their planned move.",
    template: "classic",
    comments: [
      { author: "BaseballFan22", text: "Great memory! I was at that game too.", date: "2023-06-16" },
      { author: "OaklandLifer", text: "Those 8th inning comebacks are the best!", date: "2023-06-17" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/oakland/memories">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#003831]">{memory.title}</h1>
            
            <Link to={`/oakland/memories/${id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Memory
              </Button>
            </Link>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-[#003831] via-[#006341] to-[#EFB21E] mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              {memory.images.map((img, index) => (
                <div key={index} className="relative aspect-[5/4]">
                  <img 
                    src={img} 
                    alt={`${memory.title} image ${index+1}`} 
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12 text-white">
                    <div className="flex items-center text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>{memory.date}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1.5" />
                      <span>{memory.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {memory.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-[#003831]">About This Memory</h2>
                <p className="text-gray-700 mb-6">{memory.description}</p>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Game Details
                    </h3>
                    <p className="text-gray-800">Oakland A's vs {memory.opponent}</p>
                    <p className="text-gray-800">{memory.date}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </h3>
                    <p className="text-gray-800">{memory.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Historical Context
                    </h3>
                    <p className="text-gray-800">{memory.historicalContext}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Attended With
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {memory.attendees.map(person => (
                        <span 
                          key={person} 
                          className="bg-gray-100 text-gray-800 text-sm py-1 px-2 rounded-md"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Personal Notes
                  </h3>
                  <p className="text-gray-800 italic">{memory.userNotes}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#003831]">Comments</h2>
                  <span className="bg-gray-100 text-gray-600 text-sm py-1 px-2 rounded-full">
                    {memory.comments.length}
                  </span>
                </div>
                
                {memory.comments.map((comment, index) => (
                  <div key={index} className={`${index > 0 ? 'border-t pt-4 mt-4' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
                
                <div className="mt-6">
                  <textarea 
                    className="w-full border-gray-300 rounded-md focus:ring-[#006341] focus:border-[#006341]" 
                    rows={3}
                    placeholder="Add a comment..."
                  />
                  <div className="flex justify-end mt-2">
                    <Button className="bg-[#006341] hover:bg-[#006341]/90">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 text-[#003831]">Memory Template</h2>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  <div className="w-32 h-44 bg-[#006341] rounded-md flex items-center justify-center text-white font-bold">
                    Classic
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                  <Button className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Memory
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Creator
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 text-[#003831]">Related Memories</h2>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <Link to={`/oakland/memories/${item}`} key={item}>
                      <div className="flex items-center gap-3 group">
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src="/oakland/sample-memory.jpg" 
                            alt={`Related memory ${item}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-[#006341] transition-colors">
                            Another A's Memory
                          </h3>
                          <p className="text-sm text-gray-500">May 22, 2023</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OaklandMemoryDetail;
