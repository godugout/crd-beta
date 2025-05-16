
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetMarketplace from '@/components/ugc/AssetMarketplace';
import AssetUploader from '@/components/ugc/AssetUploader';
import { UGCAsset } from '@/lib/types/ugcTypes';
import { AlertTriangle, Plus, AlertCircle } from 'lucide-react';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { useAuth } from '@/hooks/useAuth';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

const AssetLibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<UGCAsset | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const handleAssetSelect = (asset: UGCAsset) => {
    setSelectedAsset(asset);
  };
  
  const handleAddToCard = (asset: UGCAsset) => {
    // In a real implementation, this would add the asset to the current card being edited
    navigate(`/card-creator?add-asset=${asset.id}`);
  };

  return (
    <PageLayout
      title="Asset Library"
      description="Browse, use, and upload custom assets for your cards"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Asset Library</h1>
          
          {isLoggedIn && (
            <Button onClick={() => setShowUploader(true)}>
              <Plus className="mr-1 h-4 w-4" /> Upload New Asset
            </Button>
          )}
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="space-y-6">
            <AssetMarketplace onAssetSelect={handleAssetSelect} />
          </TabsContent>
          
          <TabsContent value="my-assets" className="space-y-6">
            {!isLoggedIn ? (
              <div className="text-center py-12 border rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
                <p className="text-muted-foreground mb-4">
                  You need to sign in to view your assets.
                </p>
                <Button onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              </div>
            ) : (
              <MyAssets onAssetSelect={handleAssetSelect} />
            )}
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-6">
            <div className="text-center py-12 border rounded-lg">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                Asset collections are under development and will be available soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Asset Upload Dialog */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload New Asset</DialogTitle>
            <DialogDescription>
              Create and share your custom elements with the community.
            </DialogDescription>
          </DialogHeader>
          
          <AssetUploader 
            onUploadComplete={(assetId) => {
              setShowUploader(false);
              setActiveTab('my-assets');
            }}
            className="border-0 shadow-none"
          />
        </DialogContent>
      </Dialog>
      
      {/* Asset Detail Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        {selectedAsset && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAsset.title}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <img 
                  src={selectedAsset.assetUrl}
                  alt={selectedAsset.title}
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>
              
              <div className="space-y-4">
                {selectedAsset.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedAsset.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-muted-foreground">{selectedAsset.assetType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="font-medium">File Size</p>
                    <p className="text-muted-foreground">
                      {(selectedAsset.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Dimensions</p>
                    <p className="text-muted-foreground">
                      {selectedAsset.dimensions ? 
                        `${selectedAsset.dimensions.width} × ${selectedAsset.dimensions.height}` : 
                        'Unknown'}
                    </p>
                  </div>
                </div>
                
                {selectedAsset.tags.length > 0 && (
                  <div>
                    <p className="font-medium text-sm">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAsset.tags.map(tag => (
                        <span key={tag} className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedAsset.performance && (
                  <div>
                    <p className="font-medium text-sm">Performance Impact</p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-1">
                      <div 
                        className={`h-full rounded-full ${
                          selectedAsset.performance.renderComplexity > 7 ? 'bg-destructive' :
                          selectedAsset.performance.renderComplexity > 4 ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${selectedAsset.performance.renderComplexity * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedAsset.performance.renderComplexity <= 3 ? 'Low impact' :
                       selectedAsset.performance.renderComplexity <= 7 ? 'Medium impact' :
                       'High impact'} - Recommended max uses: {selectedAsset.performance.recommendedMaxUses}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              {selectedAsset.marketplace?.isForSale ? (
                <>
                  <Button variant="outline">
                    {selectedAsset.marketplace.price} Credits
                  </Button>
                  <Button onClick={() => handleAddToCard(selectedAsset)}>
                    Purchase & Add to Card
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleAddToCard(selectedAsset)}>
                  Add to Card
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </PageLayout>
  );
};

// My Assets tab content
interface MyAssetsProps {
  onAssetSelect?: (asset: UGCAsset) => void;
}

const MyAssets: React.FC<MyAssetsProps> = ({ onAssetSelect }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // In a real implementation, we would fetch the user's assets from the API
  // For now, we'll show a placeholder
  
  return (
    <div className="text-center py-12 border rounded-lg">
      <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Assets Found</h2>
      <p className="text-muted-foreground mb-4">
        You haven't uploaded any assets yet.
      </p>
      <Button>Upload Your First Asset</Button>
    </div>
  );
};

export default AssetLibraryPage;
