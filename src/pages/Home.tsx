
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Users, Download, Upload, Tag } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout
      title="Cardshow (CRD) Platform"
      description="Create and customize digital trading cards with our powerful tools"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to the Cardshow Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, customize, and share stunning digital trading cards with our powerful tools and marketplace
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => navigate('/cards/create')}>
              Create New Card
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/assets')}>
              Explore Assets
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Create Custom Elements"
            description="Design and upload your own stickers, logos, frames, badges, and overlays to use in your cards."
            icon={<Upload className="h-12 w-12" />}
            action={() => navigate('/assets')}
            actionText="Asset Library"
          />
          
          <FeatureCard
            title="Browse the Marketplace"
            description="Discover premium and free elements created by our community of designers and artists."
            icon={<Download className="h-12 w-12" />}
            action={() => navigate('/assets')}
            actionText="Marketplace"
          />
          
          <FeatureCard
            title="Content Moderation"
            description="Our robust moderation system ensures all content is safe, appropriate and of high quality."
            icon={<Shield className="h-12 w-12" />}
            action={() => navigate('/admin')}
            actionText="Admin Dashboard"
          />
        </div>
        
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StepCard
              step={1}
              title="Upload Your Assets"
              description="Create and upload your custom elements like stickers, logos, frames, and more."
              icon={<Upload className="h-8 w-8" />}
            />
            <StepCard
              step={2}
              title="Browse & Discover"
              description="Explore the marketplace to find premium and free elements created by the community."
              icon={<Tag className="h-8 w-8" />}
            />
            <StepCard
              step={3}
              title="Create Amazing Cards"
              description="Combine elements to create stunning custom digital trading cards."
              icon={<Users className="h-8 w-8" />}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
  actionText?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  action,
  actionText
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="p-2 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        {action && actionText && (
          <Button variant="outline" onClick={action}>
            {actionText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  icon
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default HomePage;
