
import React, { useState } from 'react';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { UGCModerationStatus, UGCReport } from '@/lib/types/ugcTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertCircle, Check, X, Flag, AlertTriangle, Shield, 
  RefreshCcw, ChevronRight, User, Calendar, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ModerationDashboardProps {
  isAdmin: boolean;
}

const ModerationDashboard: React.FC<ModerationDashboardProps> = ({ isAdmin }) => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedReport, setSelectedReport] = useState<UGCReport | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionStatus, setDecisionStatus] = useState<UGCModerationStatus>('approved');
  
  // Use hooks for fetching data
  const { useModerationStats, usePendingReports, moderateAsset } = useUGCSystem();
  
  const { data: stats, isLoading: statsLoading } = useModerationStats();
  const { data: reports, isLoading: reportsLoading } = usePendingReports();
  
  // Handle moderation decision
  const handleModerateAsset = async () => {
    if (!selectedAsset) return;
    
    try {
      await moderateAsset.mutateAsync({
        assetId: selectedAsset.id,
        status: decisionStatus as any,
        moderatorId: 'admin', // In a real app, this would be the current user's ID
        reason: decisionStatus === 'rejected' ? 'inappropriate' : undefined,
        notes: decisionNotes
      });
      
      // Close dialog and reset state
      setSelectedAsset(null);
      setDecisionNotes('');
      setDecisionStatus('approved');
    } catch (error) {
      console.error('Error moderating asset:', error);
    }
  };
  
  // Handle report resolution
  const handleResolveReport = async () => {
    if (!selectedReport) return;
    
    // In a real implementation, this would call an API
    // For now, we'll just close the dialog
    setSelectedReport(null);
  };

  // Not an admin view
  if (!isAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">
            You need administrator privileges to access the moderation dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Content Moderation Dashboard</span>
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-1 h-4 w-4" /> Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ModStat 
            title="Pending Review" 
            value={stats?.pendingCount || 0}
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            loading={statsLoading}
          />
          <ModStat 
            title="Open Reports" 
            value={stats?.openReports || 0}
            icon={<Flag className="h-5 w-5 text-red-500" />}
            loading={statsLoading}
          />
          <ModStat 
            title="Approved Assets" 
            value={stats?.approvedCount || 0}
            icon={<Check className="h-5 w-5 text-green-500" />}
            loading={statsLoading}
          />
          <ModStat 
            title="Rejected Assets" 
            value={stats?.rejectedCount || 0}
            icon={<X className="h-5 w-5 text-destructive" />}
            loading={statsLoading}
          />
        </div>
        
        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="queue">Review Queue</TabsTrigger>
            <TabsTrigger value="reports">User Reports</TabsTrigger>
            <TabsTrigger value="appeals">Appeals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queue" className="space-y-4">
            <h3 className="text-lg font-medium">Pending Content Review</h3>
            
            {statsLoading ? (
              <p className="text-muted-foreground">Loading queue...</p>
            ) : stats?.pendingCount === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-muted-foreground">No pending content to review</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Placeholder for pending content items */}
                {Array.from({ length: Math.min(stats?.pendingCount || 0, 8) }).map((_, i) => (
                  <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-md">
                    <div className="aspect-square bg-muted relative">
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-amber-500/80 text-white">Pending</Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium truncate">Pending Asset #{i+1}</h4>
                      <p className="text-xs text-muted-foreground">Uploaded 2h ago</p>
                      
                      <div className="mt-2 flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-7 px-2"
                          onClick={() => {
                            setSelectedAsset({
                              id: `pending-${i}`,
                              title: `Pending Asset #${i+1}`,
                              assetUrl: '/placeholder.jpg'
                            });
                            setDecisionStatus('rejected');
                          }}
                        >
                          <X size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="h-7 px-2"
                          onClick={() => {
                            setSelectedAsset({
                              id: `pending-${i}`,
                              title: `Pending Asset #${i+1}`,
                              assetUrl: '/placeholder.jpg'
                            });
                            setDecisionStatus('approved');
                          }}
                        >
                          <Check size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {stats && stats.pendingCount > 8 && (
              <div className="text-center mt-4">
                <Button variant="outline">
                  View All {stats.pendingCount} Pending Items
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <h3 className="text-lg font-medium">User Reports</h3>
            
            {reportsLoading ? (
              <p className="text-muted-foreground">Loading reports...</p>
            ) : !reports || reports.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-muted-foreground">No open reports</p>
              </div>
            ) : (
              <Card>
                <ScrollArea className="h-[400px]">
                  <div className="p-4">
                    {reports.map((report, i) => (
                      <div 
                        key={i} 
                        className="py-3 border-b last:border-0 flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded-md"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-muted rounded-md h-12 w-12 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-medium">Report #{i+1}</h4>
                            <p className="text-xs text-muted-foreground">
                              Reason: {report.reason}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="appeals" className="space-y-4">
            <h3 className="text-lg font-medium">Content Appeals</h3>
            <div className="text-center py-8 border rounded-lg">
              <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <p className="text-muted-foreground">No pending appeals</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Moderation Decision Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        {selectedAsset && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Moderate Content</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-md">
                <p className="font-medium">{selectedAsset.title}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Moderation Decision</p>
                <Select value={decisionStatus} onValueChange={(v) => setDecisionStatus(v as UGCModerationStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="approved">Approve Content</SelectItem>
                      <SelectItem value="rejected">Reject Content</SelectItem>
                      <SelectItem value="flagged">Flag for Review</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Notes (optional)</p>
                <Textarea 
                  placeholder="Add notes about this moderation decision..." 
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAsset(null);
                  setDecisionNotes('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleModerateAsset}
                disabled={moderateAsset.isPending}
                variant={decisionStatus === 'rejected' ? 'destructive' : 'default'}
              >
                {decisionStatus === 'approved' ? 'Approve' : 
                 decisionStatus === 'rejected' ? 'Reject' : 'Flag'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        {selectedReport && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium truncate">Reported Content</h4>
                    <p className="text-xs text-muted-foreground">
                      Type: {selectedReport.assetId}
                    </p>
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Report Reason</p>
                    <p className="text-muted-foreground">{selectedReport.reason}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Details</p>
                    <p className="text-muted-foreground">{selectedReport.details}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <User size={14} className="text-muted-foreground" />
                      <span>Reported by: {selectedReport.reporterId}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span>Reported on: {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Moderation Decision</p>
                <Select defaultValue="take_down">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="take_down">Take Down Content</SelectItem>
                      <SelectItem value="keep">Keep Content</SelectItem>
                      <SelectItem value="warning">Issue Warning</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Notes (optional)</p>
                <Textarea 
                  placeholder="Add notes about this report resolution..." 
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <Button
                onClick={handleResolveReport}
              >
                Resolve Report
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
};

// Moderation stat card component
interface ModStatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}

const ModStat: React.FC<ModStatProps> = ({ title, value, icon, loading }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {loading ? '...' : value}
            </h3>
          </div>
          <div className="bg-muted p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationDashboard;
