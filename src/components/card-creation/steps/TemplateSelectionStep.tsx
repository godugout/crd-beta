
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardTemplate {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  era: string;
  style: string;
  isPremium: boolean;
}

interface TemplateSelectionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  completeStep: () => void;
}

const TEMPLATE_ERAS = ["All Eras", "Vintage (Pre-1970)", "Classic (1970-1990)", "Modern (1990-2010)", "Contemporary (2010+)"];
const TEMPLATE_STYLES = ["All Styles", "Standard", "Premium", "Refractor", "Holographic", "Artistic"];

// Sample template data - in a real app, this would come from an API
const SAMPLE_TEMPLATES: CardTemplate[] = [
  {
    id: "template-classic-1",
    name: "Classic Baseball",
    imageUrl: "https://storage.googleapis.com/pai-images/6c54daa7570e4349a79659ecfca0f14c.jpeg",
    description: "Traditional baseball card design with clean layout",
    era: "Classic (1970-1990)",
    style: "Standard",
    isPremium: false
  },
  {
    id: "template-modern-1",
    name: "Modern Refractor",
    imageUrl: "https://storage.googleapis.com/pai-images/b15a9344da0042a487c36248e9c269f2.jpeg",
    description: "Contemporary design with refractor finish",
    era: "Modern (1990-2010)",
    style: "Refractor",
    isPremium: true
  },
  {
    id: "template-vintage-1",
    name: "Vintage Classic",
    imageUrl: "https://storage.googleapis.com/pai-images/db68568c82fe42c8bb55b62a8d5f3407.jpeg",
    description: "Throwback to the golden era of baseball cards",
    era: "Vintage (Pre-1970)",
    style: "Standard",
    isPremium: false
  },
  {
    id: "template-premium-1",
    name: "Elite Series",
    imageUrl: "https://storage.googleapis.com/pai-images/22aacb65dd274e6fa3b7f74c7a7195a7.jpeg", 
    description: "Premium design with gold accents",
    era: "Contemporary (2010+)",
    style: "Premium",
    isPremium: true
  },
  {
    id: "template-holographic-1",
    name: "Holographic Special",
    imageUrl: "https://storage.googleapis.com/pai-images/5b9197449731422c8c0781b33b909640.jpeg",
    description: "Eye-catching holographic design",
    era: "Modern (1990-2010)",
    style: "Holographic",
    isPremium: true
  },
  {
    id: "template-artistic-1",
    name: "Artistic Edition",
    imageUrl: "https://storage.googleapis.com/pai-images/9399d4c7706d4641accb06d6fda62c21.jpeg",
    description: "Unique artistic interpretation of the classic card",
    era: "Contemporary (2010+)",
    style: "Artistic",
    isPremium: false
  },
];

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  formData,
  updateFormData,
  completeStep
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(formData.templateId || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [eraFilter, setEraFilter] = useState("All Eras");
  const [styleFilter, setStyleFilter] = useState("All Styles");
  const [filteredTemplates, setFilteredTemplates] = useState<CardTemplate[]>(SAMPLE_TEMPLATES);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = SAMPLE_TEMPLATES;
    
    // Apply era filter
    if (eraFilter !== "All Eras") {
      filtered = filtered.filter(template => template.era === eraFilter);
    }
    
    // Apply style filter
    if (styleFilter !== "All Styles") {
      filtered = filtered.filter(template => template.style === styleFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(lowerSearchTerm) ||
        template.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredTemplates(filtered);
  }, [searchTerm, eraFilter, styleFilter]);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const selectedTemplateData = SAMPLE_TEMPLATES.find(t => t.id === templateId);
    if (selectedTemplateData) {
      updateFormData({
        templateId: templateId,
        templateName: selectedTemplateData.name,
        templateStyle: selectedTemplateData.style,
        templateEra: selectedTemplateData.era,
        isPremiumTemplate: selectedTemplateData.isPremium
      });
      
      completeStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-gray-500 text-sm">
          Select a template that best matches the style you want for your card.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-4">
          <div>
            <Label htmlFor="search-template">Search Templates</Label>
            <Input 
              id="search-template" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="era-filter">Filter by Era</Label>
            <Select
              value={eraFilter}
              onValueChange={setEraFilter}
            >
              <SelectTrigger id="era-filter" className="mt-1">
                <SelectValue placeholder="Select Era" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TEMPLATE_ERAS.map((era) => (
                    <SelectItem key={era} value={era}>
                      {era}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="style-filter">Filter by Style</Label>
            <Select
              value={styleFilter}
              onValueChange={setStyleFilter}
            >
              <SelectTrigger id="style-filter" className="mt-1">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TEMPLATE_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Preview with your image</h3>
            <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden bg-gray-100">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Your uploaded card" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  No image uploaded
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="w-full md:w-3/4">
          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No templates match your search criteria.</p>
            </div>
          ) : (
            <RadioGroup 
              value={selectedTemplate} 
              onValueChange={handleTemplateSelect}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredTemplates.map((template) => (
                <div key={template.id} className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  selectedTemplate === template.id ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-gray-200'
                }`}>
                  <Label 
                    htmlFor={template.id}
                    className="cursor-pointer block h-full"
                  >
                    <div className="aspect-[2.5/3.5] overflow-hidden">
                      <img 
                        src={template.imageUrl} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{template.name}</span>
                        {template.isPremium && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                    <RadioGroupItem 
                      value={template.id} 
                      id={template.id} 
                      className="sr-only"
                    />
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
