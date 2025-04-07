import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Camera, Users, Clock, Trophy, Leaf, CalendarDays, 
  Layers
} from 'lucide-react';

const OaklandLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24">
        <div className="bg-gradient-to-b from-[#003831] to-[#006341] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <img 
                  src="/oakland/oak-fan-logo.png" 
                  alt="OAK.FAN" 
                  className="h-16 w-16 mr-4"
                />
                <h2 className="text-lg font-bold border-l-2 border-[#EFB21E] pl-4">PRESERVE THE ROOTS</h2>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Capture Your Oakland A's Memories
              </h1>
              
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Create digital cards of your games, tailgates, and memorabilia. Preserve the Green & Gold spirit for generations to come.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/oakland-memories/create">
                  <Button className="bg-[#EFB21E] hover:bg-[#CFA028] text-[#003831] font-bold py-3 px-6 text-lg">
                    Create Memory
                  </Button>
                </Link>
                
                <Link to="/oakland-memories">
                  <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white text-white py-3 px-6 text-lg">
                    View Gallery
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -right-6 w-64 h-64 bg-[#EFB21E]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-6 w-64 h-64 bg-[#EFB21E]/10 rounded-full blur-3xl"></div>
              
              <div className="relative grid grid-cols-2 gap-4 transform rotate-3">
                <div className="transform -rotate-6">
                  <img 
                    src="/oakland/memory-sample-1.jpg" 
                    alt="Oakland Coliseum" 
                    className="rounded-lg shadow-xl"
                  />
                </div>
                <div className="transform rotate-6 mt-12">
                  <img 
                    src="/oakland/memory-sample-2.jpg" 
                    alt="A's fans tailgating" 
                    className="rounded-lg shadow-xl" 
                  />
                </div>
                <div className="transform rotate-12">
                  <img 
                    src="/oakland/memory-sample-3.jpg" 
                    alt="Game ticket" 
                    className="rounded-lg shadow-xl"
                  />
                </div>
                <div className="transform -rotate-3 mt-8">
                  <img 
                    src="/oakland/memory-sample-4.jpg" 
                    alt="A's memorabilia" 
                    className="rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Wave Divider */}
        <div className="bg-[#006341]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#003831] mb-4">Preserve Your Oakland A's Legacy</h2>
            <p className="text-lg text-gray-600">
              Create digital cards of your most cherished A's memories and experiences, from tailgates to memorable games.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera />}
              title="Capture Game Memories"
              description="Transform your photos from the Coliseum into beautiful digital cards with details like opponent, score, and section."
            />
            <FeatureCard
              icon={<Users />}
              title="Document Tailgate Moments"
              description="Preserve the pre-game atmosphere with friends and family in the parking lot before the first pitch."
            />
            <FeatureCard
              icon={<Layers />} 
              title="Digitize Memorabilia"
              description="Create digital versions of your physical memorabilia like tickets, programs, and signed items."
            />
            <FeatureCard
              icon={<Leaf />}
              title="Oakland Roots"
              description="Maintain your connection to Oakland baseball history regardless of where the team plays."
            />
            <FeatureCard
              icon={<Clock />}
              title="Time Capsules"
              description="Group related memories into time-locked collections to be opened in the future on special dates."
            />
            <FeatureCard
              icon={<Trophy />}
              title="Championship Era Templates"
              description="Special templates for different eras of A's baseball, from the 70's dynasty to Moneyball."
            />
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#003831] mb-4">Oakland A's Timeline</h2>
            <p className="text-lg text-gray-600">
              Place your memories in the context of Oakland A's history, from championships to iconic moments.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#EFB21E]"></div>
            
            <div className="space-y-16 relative">
              <TimelineItem 
                year="1968"
                title="A's Arrive in Oakland"
                description="The Athletics move from Kansas City to Oakland, beginning a new chapter in Bay Area baseball."
                position="left"
              />
              <TimelineItem 
                year="1972-1974"
                title="Dynasty Years"
                description="The Oakland A's win three consecutive World Series championships under Charlie Finley's ownership."
                position="right"
              />
              <TimelineItem 
                year="1989"
                title="Battle of the Bay Series"
                description="The A's sweep the Giants in the earthquake-interrupted World Series."
                position="left"
              />
              <TimelineItem 
                year="2002"
                title="The Streak"
                description="The Moneyball A's win 20 consecutive games, setting an American League record."
                position="right"
              />
              <TimelineItem 
                year="Present"
                title="Your Memories"
                description="Add your personal Oakland A's experiences to the ongoing timeline."
                position="left"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#003831] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Preserving Your A's Memories Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Create digital cards that capture the spirit, community, and passion of Oakland Athletics baseball.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/oakland-memories/create">
              <Button className="bg-[#EFB21E] hover:bg-[#CFA028] text-[#003831] font-bold py-3 px-8 text-lg">
                Create Your First Memory
              </Button>
            </Link>
            <Link to="/oakland-memories">
              <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white text-white py-3 px-8 text-lg">
                Explore Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-[#006341]/10 text-[#006341] rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#003831] mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  position: 'left' | 'right';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, position }) => (
  <div className={`flex items-center ${position === 'left' ? 'flex-row-reverse' : ''}`}>
    <div className="w-1/2"></div>
    
    <div className="relative flex items-center">
      <div className="h-8 w-8 bg-[#003831] rounded-full border-4 border-[#EFB21E] z-10"></div>
      <div className={`absolute top-1/2 transform -translate-y-1/2 ${position === 'left' ? 'right-10' : 'left-10'} w-8 h-1 bg-[#EFB21E]`}></div>
    </div>
    
    <div className="w-1/2 p-4">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center mb-2">
          <CalendarDays className="h-5 w-5 text-[#006341] mr-2" />
          <span className="text-lg font-bold text-[#006341]">{year}</span>
        </div>
        <h3 className="text-xl font-bold text-[#003831] mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

export default OaklandLanding;
