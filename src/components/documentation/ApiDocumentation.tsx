
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ApiEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestExample?: string;
  responseExample?: string;
}

interface ApiSection {
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

interface ApiDocumentationProps {
  sections: ApiSection[];
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ sections }) => {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h1>API Documentation</h1>
        <p className="lead">
          This documentation provides details about available API endpoints, how to use them,
          and what responses to expect.
        </p>
      </div>
      
      <Tabs defaultValue={sections[0]?.title.toLowerCase().replace(/\s+/g, '-')}>
        <TabsList className="w-full flex overflow-x-auto">
          {sections.map(section => (
            <TabsTrigger 
              key={section.title} 
              value={section.title.toLowerCase().replace(/\s+/g, '-')}
              className="flex-1"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {sections.map(section => (
          <TabsContent 
            key={section.title} 
            value={section.title.toLowerCase().replace(/\s+/g, '-')}
            className="space-y-6"
          >
            <div className="prose max-w-none">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            
            <div className="space-y-6">
              {section.endpoints.map(endpoint => (
                <EndpointCard key={endpoint.endpoint} endpoint={endpoint} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const EndpointCard: React.FC<{ endpoint: ApiEndpoint }> = ({ endpoint }) => {
  const methodColors = {
    GET: 'bg-blue-500',
    POST: 'bg-green-500',
    PUT: 'bg-amber-500',
    PATCH: 'bg-purple-500',
    DELETE: 'bg-red-500'
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Badge className={`mr-2 ${methodColors[endpoint.method]}`}>
                {endpoint.method}
              </Badge>
              {endpoint.name}
            </CardTitle>
            <CardDescription className="mt-1 font-mono text-sm">
              {endpoint.endpoint}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p>{endpoint.description}</p>
        </div>
        
        {endpoint.parameters && endpoint.parameters.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Parameters</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                <div>Name</div>
                <div>Type</div>
                <div>Required</div>
                <div>Description</div>
              </div>
              {endpoint.parameters.map((param, idx) => (
                <div 
                  key={param.name}
                  className={`grid grid-cols-4 gap-4 p-3 text-sm ${
                    idx < endpoint.parameters!.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="font-mono">{param.name}</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">{param.type}</div>
                  <div>{param.required ? 'Yes' : 'No'}</div>
                  <div>{param.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(endpoint.requestExample || endpoint.responseExample) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoint.requestExample && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Request Example
                </h3>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 bg-muted font-mono text-xs whitespace-pre overflow-x-auto">
                    {endpoint.requestExample}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {endpoint.responseExample && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Response Example
                </h3>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 bg-muted font-mono text-xs whitespace-pre overflow-x-auto">
                    {endpoint.responseExample}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/30 text-xs text-muted-foreground">
        For more details, see the full documentation.
      </CardFooter>
    </Card>
  );
};

export default ApiDocumentation;
