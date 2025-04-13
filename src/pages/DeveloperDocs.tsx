import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Code, FileJson, Globe, HelpCircle, Info, Server } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { cardsApiDocs, collectionsApiDocs } from '@/lib/api/apiDocumentation';
import { useFeatureEnabled } from '@/hooks/useFeatureFlag';
import EnhancedOfflineIndicator from '@/components/game-day/EnhancedOfflineIndicator';

const DeveloperDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api');
  const isApiDocsEnabled = useFeatureEnabled('api-docs', true);
  
  return (
    <PageLayout
      title="Developer Documentation"
      description="API documentation and developer resources"
      hideBreadcrumbs={false}
    >
      <div className="container mx-auto py-6">
        <EnhancedOfflineIndicator 
          variant="bar" 
          showWhenOnline={true} 
        />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="api">API Documentation</TabsTrigger>
            <TabsTrigger value="offline">Offline Features</TabsTrigger>
            <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api">
            {isApiDocsEnabled ? (
              <ApiDocumentation />
            ) : (
              <FeatureDisabledCard
                title="API Documentation"
                description="This feature is currently disabled. Contact your administrator to enable it."
                featureId="api-docs"
              />
            )}
          </TabsContent>
          
          <TabsContent value="offline">
            <OfflineDocumentation />
          </TabsContent>
          
          <TabsContent value="flags">
            <FeatureFlagsDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const ApiDocumentation: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Globe className="mr-2 h-5 w-5" /> 
            REST API Documentation
          </CardTitle>
          <CardDescription>
            Endpoints for interacting with the application data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <EndpointSection
              title="Cards API"
              endpoints={cardsApiDocs}
              activeEndpoint={activeEndpoint}
              setActiveEndpoint={setActiveEndpoint}
            />
            
            <EndpointSection
              title="Collections API"
              endpoints={collectionsApiDocs}
              activeEndpoint={activeEndpoint}
              setActiveEndpoint={setActiveEndpoint}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EndpointSection: React.FC<{
  title: string;
  endpoints: Record<string, any>;
  activeEndpoint: string | null;
  setActiveEndpoint: (id: string | null) => void;
}> = ({ title, endpoints, activeEndpoint, setActiveEndpoint }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {Object.entries(endpoints).map(([id, endpoint]) => (
        <Card key={id} className={activeEndpoint === id ? 'border-primary' : ''}>
          <div 
            className="p-4 cursor-pointer flex items-center justify-between"
            onClick={() => setActiveEndpoint(activeEndpoint === id ? null : id)}
          >
            <div className="flex items-center">
              <Badge 
                className={`mr-3 ${getMethodColor(endpoint.method)}`}
              >
                {endpoint.method}
              </Badge>
              <span className="font-mono text-sm">{endpoint.path}</span>
            </div>
            <div>
              {endpoint.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="ml-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {activeEndpoint === id && (
            <CardContent className="pt-0 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
                
                {endpoint.parameters?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Parameters</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Location</th>
                            <th className="p-2 text-left">Type</th>
                            <th className="p-2 text-left">Required</th>
                            <th className="p-2 text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param: any) => (
                            <tr key={param.name} className="border-t">
                              <td className="p-2 font-mono">{param.name}</td>
                              <td className="p-2">{param.in}</td>
                              <td className="p-2 font-mono">{param.schema.type}</td>
                              <td className="p-2">
                                {param.required ? <Check className="h-4 w-4 text-green-500" /> : '-'}
                              </td>
                              <td className="p-2">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {endpoint.requestBody && (
                  <div>
                    <h4 className="font-medium mb-1">Request Body</h4>
                    <div className="border rounded-md p-3">
                      <p className="mb-2 text-sm">{endpoint.requestBody.description}</p>
                      <div className="bg-muted p-2 rounded font-mono text-xs whitespace-pre overflow-x-auto">
                        {JSON.stringify(
                          endpoint.requestBody.content && 
                          Object.values(endpoint.requestBody.content)[0] && 
                          (Object.values(endpoint.requestBody.content)[0] as any).schema || {},
                          null,
                          2
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-1">Responses</h4>
                  <div className="space-y-2">
                    {Object.entries(endpoint.responses).map(([status, response]: [string, any]) => (
                      <div key={status} className="border rounded-md p-3">
                        <div className="flex items-center mb-2">
                          <Badge className={getStatusCodeColor(status)}>{status}</Badge>
                          <span className="ml-2 text-sm">{response.description}</span>
                        </div>
                        
                        {response.content && (
                          <div className="bg-muted p-2 rounded font-mono text-xs whitespace-pre overflow-x-auto">
                            {JSON.stringify(
                              response.content && 
                              Object.values(response.content)[0] && 
                              (Object.values(response.content)[0] as any).schema || {},
                              null,
                              2
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Example Usage</h4>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto">
                    {getExampleCode(endpoint)}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

const OfflineDocumentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Server className="mr-2 h-5 w-5" /> 
            Offline Features
          </CardTitle>
          <CardDescription>
            Documentation for working with offline capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Offline Sync</h3>
              <p className="mb-4">
                The platform includes robust offline synchronization with conflict resolution, 
                ensuring smooth operation even when connectivity is intermittent.
              </p>
              
              <Card className="mb-4">
                <CardHeader className="py-3">
                  <CardTitle className="text-md">useOfflineSync Hook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto mb-4">
{`import { useOfflineSync } from '@/hooks/useOfflineSync';

function MyComponent() {
  const {
    stats,        // Current sync statistics
    isSyncing,    // Whether a sync operation is in progress
    isOnline,     // Current online status
    syncOfflineData,  // Function to trigger sync manually
    cancelSync    // Function to cancel ongoing sync
  } = useOfflineSync({
    autoSync: true,
    autoSyncInterval: 60000,  // Sync every minute when online
    conflictStrategy: 'client-wins'
  });

  return (
    <div>
      <p>Pending items: {stats.pending}</p>
      <button 
        onClick={() => syncOfflineData()}
        disabled={!isOnline || isSyncing}
      >
        Sync Now
      </button>
    </div>
  );
}`}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader className="py-3">
                  <CardTitle className="text-md">EnhancedOfflineIndicator Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto mb-4">
{`import EnhancedOfflineIndicator from '@/components/game-day/EnhancedOfflineIndicator';

function MyPage() {
  return (
    <div>
      <EnhancedOfflineIndicator 
        variant="bar"       // 'bar', 'badge', or 'floating'
        showWhenOnline={true}  // Show even when online
      />
      
      {/* Rest of your page content */}
    </div>
  );
}`}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Storage Service</h3>
              <p className="mb-4">
                Offline storage service provides a way to store data locally when offline
                and synchronize it when the connection is restored.
              </p>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-md">Using offlineStorage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto">
{`import { 
  saveOfflineItem, 
  getOfflineItems,
  removeOfflineItem,
  OfflineItem
} from '@/lib/offlineStorage';

// Save an item for offline use
const saveMyData = async (data) => {
  const item: OfflineItem = {
    id: generateId(),
    type: 'my-data-type',
    data: data,
    createdAt: new Date().toISOString(),
    syncPriority: 1
  };
  
  await saveOfflineItem(item);
};

// Retrieve offline items
const getMyData = async () => {
  const items = await getOfflineItems('my-data-type');
  return items;
};`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureFlagsDocumentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileJson className="mr-2 h-5 w-5" /> 
            Feature Flags
          </CardTitle>
          <CardDescription>
            Documentation for using feature flags in the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Using Feature Flags</h3>
              <p className="mb-4">
                Feature flags allow you to toggle features on and off without deploying new code.
                They can be used for A/B testing, gradual rollouts, or to disable problematic features.
              </p>
              
              <Card className="mb-4">
                <CardHeader className="py-3">
                  <CardTitle className="text-md">useFeatureFlag Hook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto mb-4">
{`import { useFeatureFlag, useFeatureEnabled } from '@/hooks/useFeatureFlag';

function MyComponent() {
  // Full hook with value and controls
  const {
    value,         // Current value of the flag
    enabled,       // Whether the flag is enabled
    isOverridden,  // Whether there's a local override
    setOverride,   // Function to set a local override
    removeOverride // Function to remove the local override
  } = useFeatureFlag('my-feature', false);

  // Simplified hook for just checking if enabled
  const isOtherFeatureEnabled = useFeatureEnabled('other-feature');

  return (
    <div>
      {enabled && (
        <div>This feature is enabled!</div>
      )}
      
      <button onClick={() => setOverride(true)}>
        Enable locally
      </button>
    </div>
  );
}`}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-md">Conditional Rendering</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto">
{`import { useFeatureEnabled } from '@/hooks/useFeatureFlag';
import featureFlagService from '@/lib/featureFlags/featureFlagService';

function MyComponent() {
  // Using the hook in components (recommended)
  const isFeatureEnabled = useFeatureEnabled('new-feature');
  
  // For non-React code, use the service directly
  if (featureFlagService.isEnabled('other-feature')) {
    // Do something
  }

  return (
    <div>
      {isFeatureEnabled ? (
        <NewFeatureComponent />
      ) : (
        <LegacyComponent />
      )}
    </div>
  );
}`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureDisabledCard: React.FC<{
  title: string;
  description: string;
  featureId: string;
}> = ({ title, description, featureId }) => {
  return (
    <Card className="border-dashed border-muted-foreground/50">
      <CardHeader>
        <CardTitle className="flex items-center text-muted-foreground">
          <Info className="mr-2 h-5 w-5" />
          {title} (Disabled)
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              Feature ID: <code className="bg-muted px-1 py-0.5 rounded">{featureId}</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-500';
    case 'POST': return 'bg-green-500';
    case 'PUT': return 'bg-amber-500';
    case 'PATCH': return 'bg-orange-500';
    case 'DELETE': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusCodeColor = (code: string): string => {
  const codeNum = parseInt(code);
  if (codeNum < 300) return 'bg-green-500';
  if (codeNum < 400) return 'bg-blue-500';
  if (codeNum < 500) return 'bg-amber-500';
  return 'bg-red-500';
};

const getExampleCode = (endpoint: any): string => {
  const method = endpoint.method.toLowerCase();
  const path = endpoint.path;
  const hasBody = ['post', 'put', 'patch'].includes(method);
  
  let code = `// Using fetch API\n`;
  code += `async function ${method}${capitalize(path.split('/').pop())}() {\n`;
  code += `  const response = await fetch('https://api.example.com${path}'${hasBody ? ',' : ''}\n`;
  
  if (hasBody) {
    code += `  {\n`;
    code += `    method: '${method.toUpperCase()}',\n`;
    code += `    headers: {\n`;
    code += `      'Content-Type': 'application/json',\n`;
    code += `      'Authorization': 'Bearer YOUR_TOKEN'\n`;
    code += `    },\n`;
    code += `    body: JSON.stringify({\n`;
    if (endpoint.requestBody && endpoint.requestBody.content) {
      const contentValues = Object.values(endpoint.requestBody.content);
      if (contentValues.length > 0 && (contentValues[0] as any).schema) {
        const schema = (contentValues[0] as any).schema;
        if (schema.$ref) {
          code += `      // Example request data\n`;
          code += `      "title": "Example Title",\n`;
          code += `      "description": "Example description"\n`;
        }
      } else {
        code += `      // Example request data\n`;
        code += `      "title": "Example Title",\n`;
        code += `      "description": "Example description"\n`;
      }
    }
    code += `    })\n`;
    code += `  });\n\n`;
  } else {
    code += `  {\n`;
    code += `    headers: {\n`;
    code += `      'Authorization': 'Bearer YOUR_TOKEN'\n`;
    code += `    }\n`;
    code += `  });\n\n`;
  }
  
  code += `  if (!response.ok) {\n`;
  code += `    throw new Error('API request failed');\n`;
  code += `  }\n\n`;
  code += `  const data = await response.json();\n`;
  code += `  return data;\n`;
  code += `}`;
  
  return code;
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default DeveloperDocs;
