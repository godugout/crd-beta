
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetMarketplace from '@/components/ugc/AssetMarketplace';
import AssetUploader from '@/components/ugc/AssetUploader';
import ModerationDashboard from '@/components/ugc/ModerationDashboard';
import { UGCAsset } from '@/lib/types/ugcTypes';
import { AlertTriangle, Plus, AlertCircle, ShieldAlert } from 'lucide-react';
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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  
  const navigate = useNavigate();
  const { isLoggedIn, user, isAdmin } = useAuth();
  const { reportAsset } = useUGCSystem();
  
  const handleAssetSelect = (asset: UGCAsset) => {
    setSelectedAsset(asset);
  };
  
  const handleAddToCard = (asset: UGCAsset) => {
    // In a real implementation, this would add the asset to the current card being edited
    navigate(`/card-creator?add-asset=${asset.id}`);
  };

  const handleReportSubmit = async () => {
    if (!selectedAsset) return;
    
    await reportAsset.mutateAsync({
      assetId: selectedAsset.id,
      reason: reportReason,
      details: reportDetails
    });
    
    setReportDialogOpen(false);
    setReportReason('');
    setReportDetails('');
  };

  return (
    <PageLayout
      title="Asset Library"
      description="Browse, use, and upload custom assets for your cards"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Asset Library</h1>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('moderation')}
                className="flex items-center gap-1"
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="hidden md:inline">Moderation</span>
              </Button>
            )}
            
            {isLoggedIn && (
              <Button onClick={() => setShowUploader(true)}>
                <Plus className="mr-1 h-4 w-4" /> Upload Asset
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
            <TabsTrigger value="moderation" className={!isAdmin ? 'hidden' : ''}>
              Moderation
            </TabsTrigger>
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
          
          <TabsContent value="moderation" className="space-y-6">
            <ModerationDashboard isAdmin={isAdmin} />
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
            
            <DialogFooter className="flex justify-between items-center flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setReportDialogOpen(true);
                }}
                className="flex items-center"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Report
              </Button>
              
              <div>
                {selectedAsset.marketplace?.isForSale ? (
                  <>
                    <Button variant="outline" className="mr-2">
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
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Please let us know why you're reporting this content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="report-reason" className="text-sm font-medium">
                Reason
              </label>
              <select
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="copyright">Copyright violation</option>
                <option value="quality">Poor quality</option>
                <option value="duplicate">Duplicate</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="report-details" className="text-sm font-medium">
                Details
              </label>
              <textarea
                id="report-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Please provide additional details about the issue"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReportSubmit}
              disabled={!reportReason || !reportDetails || reportAsset.isPending}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
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
  const { usePublicAssets } = useUGCSystem();
  
  // Fetch the current user's assets
  const { data: userAssets, isLoading } = usePublicAssets({
    // In a real implementation, this would filter by the current user's ID
    // creatorId: user?.id
  });
  
  // For demo purposes, assume no user assets yet
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
