
import React, { Suspense } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Badge } from '@/components/ui/badge';
import { Zap, Beaker, Lightbulb, Sparkles, MessageSquare, FlaskConical, Palette, Camera, Code, RotateCw } from 'lucide-react';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-t-[var(--brand-primary)] border-[var(--brand-primary)]/20 rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-xl font-semibold text-white">Loading Dugout Labs...</p>
    </div>
  </div>
);

const Labs = () => {
  const labFeatures = [
    {
      id: 1,
      title: "AR Card Viewer",
      description: "Experience your cards in augmented reality with stunning 3D effects and realistic lighting",
      icon: <Sparkles className="h-7 w-7 text-white" />,
      status: "beta",
      statusColor: "from-[var(--brand-primary)] to-[var(--brand-secondary)]",
      link: "/ar-card-viewer",
      gradient: "from-[var(--brand-primary)]/10 to-[var(--brand-secondary)]/5",
      border: "[var(--brand-primary)]/20",
      hoverBorder: "[var(--brand-primary)]/40"
    },
    {
      id: 2,
      title: "Card Animation Studio",
      description: "Create animated effects and transitions for your digital cards with professional tools",
      icon: <RotateCw className="h-7 w-7 text-white" />,
      status: "alpha",
      statusColor: "from-[var(--brand-accent)] to-[var(--brand-warning)]",
      link: "/features/animation",
      gradient: "from-[var(--brand-accent)]/10 to-[var(--brand-warning)]/5",
      border: "[var(--brand-accent)]/20",
      hoverBorder: "[var(--brand-accent)]/40"
    },
    {
      id: 3,
      title: "Card Condition Detector",
      description: "AI-powered tool to analyze and grade physical card conditions with professional accuracy",
      icon: <Camera className="h-7 w-7 text-white" />,
      status: "experimental",
      statusColor: "from-[var(--brand-success)] to-[var(--brand-primary)]",
      link: "/detector",
      gradient: "from-[var(--brand-success)]/10 to-[var(--brand-primary)]/5",
      border: "[var(--brand-success)]/20",
      hoverBorder: "[var(--brand-success)]/40"
    },
    {
      id: 4,
      title: "PBR Rendering Engine",
      description: "Physically-based rendering for ultra-realistic card materials and lighting effects",
      icon: <Beaker className="h-7 w-7 text-white" />,
      status: "prototype",
      statusColor: "from-[var(--brand-warning)] to-[var(--brand-accent)]",
      link: "/labs/pbr",
      gradient: "from-[var(--brand-warning)]/10 to-[var(--brand-accent)]/5",
      border: "[var(--brand-warning)]/20",
      hoverBorder: "[var(--brand-warning)]/40"
    },
    {
      id: 5,
      title: "Signature Analyzer",
      description: "Authenticate and analyze player signatures using advanced machine learning",
      icon: <Palette className="h-7 w-7 text-white" />,
      status: "beta",
      statusColor: "from-[var(--brand-secondary)] to-[var(--brand-primary)]",
      link: "/labs/signature",
      gradient: "from-[var(--brand-secondary)]/10 to-[var(--brand-primary)]/5",
      border: "[var(--brand-secondary)]/20",
      hoverBorder: "[var(--brand-secondary)]/40"
    },
    {
      id: 6,
      title: "Collection Comparison",
      description: "Compare your collection with others and discover trade opportunities using smart matching",
      icon: <Code className="h-7 w-7 text-white" />,
      status: "prototype",
      statusColor: "from-[var(--brand-accent)] to-[var(--brand-secondary)]",
      link: "/collections",
      gradient: "from-[var(--brand-accent)]/10 to-[var(--brand-secondary)]/5",
      border: "[var(--brand-accent)]/20",
      hoverBorder: "[var(--brand-accent)]/40"
    }
  ];

  const getStatusBadge = (status: string, gradient: string) => {
    const statusConfig = {
      beta: { label: 'Beta', color: 'text-[var(--brand-primary)]' },
      alpha: { label: 'Alpha', color: 'text-[var(--brand-accent)]' },
      experimental: { label: 'Experimental', color: 'text-[var(--brand-success)]' },
      prototype: { label: 'Prototype', color: 'text-[var(--brand-warning)]' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.prototype;

    return (
      <Badge className={`px-3 py-1 text-xs font-semibold ${config.color} bg-gradient-to-r ${gradient} border border-current/20 rounded-full`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <CardEnhancedProvider>
      <PageLayout
        title="Dugout Labs | CardShow"
        description="Preview experimental features and provide feedback"
        fullWidth={true}
        hideBreadcrumbs={true}
      >
        {/* Enhanced Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[var(--brand-warning)]/20 to-[var(--brand-accent)]/10 rounded-full blur-3xl animate-pulse-fast"></div>
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-secondary)]/10 rounded-full blur-3xl"></div>
          </div>

          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative mb-8">
                <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                  Dugout
                  <span className="block text-brand-gradient">Labs</span>
                </h1>
                {/* Sharp accent corner */}
                <div className="absolute -top-4 -right-8 w-8 h-8 bg-gradient-to-br from-[var(--brand-warning)] to-[var(--brand-accent)] clip-corner-tr opacity-80"></div>
              </div>
              
              <p className="text-2xl text-[var(--text-secondary)] mb-6 font-semibold">
                Experimental Features & Innovation Hub
              </p>
              <p className="text-xl text-[var(--text-tertiary)] max-w-3xl mx-auto leading-relaxed mb-12">
                Preview cutting-edge features, provide feedback, and help shape the future of digital card collecting
              </p>

              {/* Enhanced CTA */}
              <div className="flex flex-wrap justify-center gap-6">
                <CrdButton 
                  variant="featured" 
                  size="lg"
                  className="btn-sharp font-bold px-10 py-4 text-lg shadow-[var(--shadow-accent)]"
                >
                  <FlaskConical className="mr-3 h-6 w-6" />
                  Start Experimenting
                </CrdButton>
                
                <Button 
                  variant="glass" 
                  size="lg"
                  className="font-bold px-10 py-4 text-lg border-2 border-[var(--border-highlight)] hover:border-[var(--border-glow)]"
                >
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Give Feedback
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          {/* Enhanced Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                Experimental <span className="text-brand-gradient">Features</span>
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Try out the latest innovations and help us build the future of digital cards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {labFeatures.map(feature => (
                <div key={feature.id} className="group">
                  <div className={`bento-card relative overflow-hidden h-full bg-gradient-to-br ${feature.gradient} border border-${feature.border} hover:border-${feature.hoverBorder} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                    {/* Sharp accent corner */}
                    <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${feature.statusColor} clip-corner-tr`}></div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.statusColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        {getStatusBadge(feature.status, feature.statusColor)}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                      
                      <div className="flex gap-3">
                        <CrdButton 
                          asChild 
                          variant="spectrum" 
                          size="sm"
                          className="flex-1 font-semibold"
                        >
                          <a href={feature.link}>Try It Out</a>
                        </CrdButton>
                        <Button 
                          variant="glass" 
                          size="sm"
                          className="px-4"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Submit Idea Section */}
          <div className="relative">
            <div className="bento-card bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/5 border border-[var(--brand-primary)]/20 relative overflow-hidden">
              {/* Sharp accent corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] clip-corner-tr"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                      Submit Your <span className="text-brand-gradient">Idea</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] mb-4 font-medium">
                      Have a brilliant feature idea?
                    </p>
                    <p className="text-[var(--text-tertiary)] leading-relaxed">
                      We'd love to hear your suggestions for new experimental features, improvements, or entirely new ways to experience digital cards.
                    </p>
                  </div>
                  
                  <div className="relative">
                    <CrdButton 
                      variant="featured" 
                      size="lg"
                      className="btn-sharp font-bold px-8 py-4 text-lg shadow-[var(--shadow-accent)]"
                    >
                      <Lightbulb className="h-6 w-6 mr-3" />
                      Submit Feature Idea
                    </CrdButton>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--brand-warning)] clip-corner-tr opacity-90"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageLayout>
    </CardEnhancedProvider>
  );
};

export default Labs;
