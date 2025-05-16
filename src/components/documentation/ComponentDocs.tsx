
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeIcon, Book } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PropDefinition {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

interface ComponentDocumentation {
  name: string;
  description: string;
  props: PropDefinition[];
  examples: {
    title: string;
    code: string;
    preview?: React.ReactNode;
  }[];
  notes?: string[];
  imports?: string[];
}

interface ComponentDocsProps {
  components: ComponentDocumentation[];
}

const ComponentDocs: React.FC<ComponentDocsProps> = ({ components }) => {
  const [activeTab, setActiveTab] = React.useState(components[0]?.name);

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h1>Component Documentation</h1>
        <p className="lead">
          This documentation provides usage details for the UI components in the CardShow design system.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="pb-4">
          <TabsList className="w-auto inline-flex">
            {components.map(component => (
              <TabsTrigger 
                key={component.name} 
                value={component.name}
              >
                {component.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        {components.map(component => (
          <TabsContent 
            key={component.name} 
            value={component.name}
            className="space-y-6"
          >
            <ComponentDetailCard component={component} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const ComponentDetailCard: React.FC<{ component: ComponentDocumentation }> = ({ component }) => {
  const [showCode, setShowCode] = React.useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{component.name}</CardTitle>
          <CardDescription>{component.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Import Example */}
          {component.imports && component.imports.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Imports</h3>
              <Card className="bg-muted/50 border">
                <ScrollArea className="max-h-[120px]">
                  <pre className="p-4 text-xs font-mono">
                    {component.imports.map((importStr, idx) => (
                      <div key={idx}>{importStr}</div>
                    ))}
                  </pre>
                </ScrollArea>
              </Card>
            </div>
          )}
          
          {/* Props Documentation */}
          <div>
            <h3 className="text-sm font-medium mb-2">Props</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-5 gap-2 p-3 border-b bg-muted/50 text-xs font-medium">
                <div>Name</div>
                <div>Type</div>
                <div className="text-center">Required</div>
                <div>Default</div>
                <div>Description</div>
              </div>
              
              <ScrollArea className="max-h-[300px]">
                {component.props.map((prop, idx) => (
                  <div 
                    key={prop.name}
                    className={cn(
                      "grid grid-cols-5 gap-2 p-3 text-xs",
                      idx < component.props.length - 1 ? 'border-b' : '',
                      prop.required ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                    )}
                  >
                    <div className="font-mono font-semibold">{prop.name}</div>
                    <div className="font-mono text-blue-600 dark:text-blue-400 break-all">{prop.type}</div>
                    <div className="text-center">{prop.required ? '✓' : '–'}</div>
                    <div className="font-mono">{prop.defaultValue || '–'}</div>
                    <div>{prop.description}</div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          
          {/* Examples */}
          <div>
            <h3 className="text-sm font-medium mb-4">Examples</h3>
            <div className="space-y-6">
              {component.examples.map((example, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardHeader className="bg-muted/20">
                    <CardTitle className="text-base">{example.title}</CardTitle>
                  </CardHeader>
                  
                  {example.preview && (
                    <CardContent className="border-b p-6 flex justify-center items-center bg-white dark:bg-black">
                      <div className="preview-container">{example.preview}</div>
                    </CardContent>
                  )}
                  
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
                    <span className="text-xs text-muted-foreground">Code example</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowCode(showCode === `${component.name}-${idx}` ? null : `${component.name}-${idx}`)}
                    >
                      {showCode === `${component.name}-${idx}` ? 'Hide Code' : 'Show Code'}
                      <CodeIcon className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                  
                  {showCode === `${component.name}-${idx}` && (
                    <ScrollArea className="max-h-[300px] border-t">
                      <pre className="p-4 text-xs font-mono bg-muted/20 overflow-auto">
                        {example.code}
                      </pre>
                    </ScrollArea>
                  )}
                </Card>
              ))}
            </div>
          </div>
          
          {/* Notes */}
          {component.notes && component.notes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Book className="h-4 w-4 mr-1" /> 
                Notes
              </h3>
              <Card className="bg-muted/20">
                <CardContent className="pt-6">
                  <ul className="list-disc pl-4 space-y-2">
                    {component.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentDocs;
