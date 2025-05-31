import * as React from 'react';
import { useWaste } from '../contexts/WasteContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

// Define disposal methods outside the component
const DISPOSAL_METHODS = {
  biohazardous: [
    'Autoclave and Shred',
    'Incineration',
    'Chemical Treatment',
    'Irradiation'
  ],
  pharmaceutical: [
    'High-Temperature Incineration',
    'Controlled Substance Destruction',
    'Return to Manufacturer',
    'Chemical Neutralization'
  ],
  chemical: [
    'Chemical Neutralization',
    'Secure Landfill',
    'Incineration',
    'Distillation Recovery'
  ],
  general: [
    'Autoclave and Landfill',
    'Shredding and Landfill',
    'Recycling',
    'Standard Disposal'
  ]
};

// Define helper functions outside the component
const getWasteTypeColor = (type: string): string => {
  switch (type) {
    case 'biohazardous': return 'bg-red-100 text-red-800';
    case 'pharmaceutical': return 'bg-blue-100 text-blue-800';
    case 'chemical': return 'bg-purple-100 text-purple-800';
    case 'general': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'low': return 'bg-gray-100 text-gray-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Define the props interface
interface ProcessRequestModalProps {
  requestId: string;
  onClose: () => void;
  onProcessComplete: (requestId: string, success: boolean) => void;
  actionType: 'process' | 'complete';
}

// Define the component as a named function declaration
function ProcessRequestModal(props: ProcessRequestModalProps) {
  const { requestId, onClose, onProcessComplete, actionType } = props;
  
  // Use hooks inside the component
  const { requests, updateRequestStatus } = useWaste();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Define state
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalReady, setIsModalReady] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    disposalMethod: '',
    disposalLocation: '',
    notes: ''
  });

  // Log for debugging
  React.useEffect(() => {
    console.log(`ProcessRequestModal rendered for requestId: ${requestId}`);
    
    // Find the request by id
    const foundRequest = requests.find(r => r.id === requestId);
    console.log(`Found request:`, foundRequest);
    
    // Short timeout to ensure the modal is fully rendered
    const timer = setTimeout(() => {
      setIsModalReady(true);
      console.log('Modal is now ready');
    }, 100);
    
    return () => {
      console.log('Modal unmounting, clearing timer');
      clearTimeout(timer);
    };
  }, [requestId, requests]);

  // Reset error when requestId changes
  React.useEffect(() => {
    setModalError(null);
  }, [requestId]);

  // Find the request by id
  const request = requests.find(r => r.id === requestId);
  
  // Handle start processing
  const handleStartProcessing = async () => {
    if (!request) return;
    
    console.log(`Starting processing for request: ${requestId}`);
    try {
      setIsLoading(true);
      setModalError(null);
      
      const updatedRequest = await updateRequestStatus(requestId, 'in-progress', {
        assignedTo: user?.id
      });

      console.log('Request successfully updated:', updatedRequest);
      toast({
        title: "Request accepted",
        description: "You have started processing this disposal request.",
      });
    } catch (error: any) {
      console.error('Failed to start processing:', error);
      setModalError(error.message || 'Failed to start processing');
      toast({
        title: "Error",
        description: "Failed to start processing the request. Please try again.",
        variant: "destructive",
      });
      onProcessComplete(requestId, false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle complete
  const handleComplete = async () => {
    if (!request) return;
    
    if (!formData.disposalMethod || !formData.disposalLocation) {
      toast({
        title: "Missing information",
        description: "Please fill in the disposal method and location.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Completing request: ${requestId} with data:`, formData);
    try {
      setIsLoading(true);
      setModalError(null);
      
      const updatedRequest = await updateRequestStatus(requestId, 'completed', {
        disposalMethod: formData.disposalMethod,
        disposalLocation: formData.disposalLocation,
        assignedTo: user?.id
      });

      console.log('Request successfully completed:', updatedRequest);
      toast({
        title: "Request completed",
        description: "The waste disposal has been marked as completed.",
      });

      onProcessComplete(requestId, true);
    } catch (error: any) {
      console.error('Failed to complete request:', error);
      setModalError(error.message || 'Failed to complete request');
      toast({
        title: "Error",
        description: "Failed to complete the request. Please try again.",
        variant: "destructive",
      });
      onProcessComplete(requestId, false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log('Modal close button clicked, isLoading:', isLoading);
    if (!isLoading) {
      onClose();
    } else {
      console.log('Cannot close modal while processing');
      toast({
        title: "Processing in progress",
        description: "Please wait until the current operation completes.",
      });
    }
  };

  // Early return if request not found
  if (!request) {
    console.error('Request not found for ID:', requestId);
    return null;
  }

  // Early return if modal not ready
  if (!isModalReady) {
    console.log('Modal not ready yet, showing loading state');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
          <span className="animate-spin mr-2 text-2xl">⟳</span>
          <p>Loading request details...</p>
        </div>
      </div>
    );
  }

  // Render the modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{actionType === 'process' ? 'Process Disposal Request' : 'Complete Disposal Request'}</CardTitle>
              <CardDescription>
                {actionType === 'process' ? 'Review and process the waste disposal request' : 'Enter disposal details to complete the request'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleModalClose} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
              {modalError}
            </div>
          )}
          
          {/* Request Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Request Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Waste Type:</p>
                <Badge className={getWasteTypeColor(request.type)}>
                  {request.type}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Urgency:</p>
                <Badge className={getUrgencyColor(request.urgency)}>
                  {request.urgency}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Quantity:</p>
                <p className="font-medium">{request.quantity} {request.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Department:</p>
                <p className="font-medium">{request.department}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Created:</p>
                <p className="font-medium">{request.createdAt.toLocaleString()}</p>
              </div>
              {request.instructions && (
                <div className="col-span-2">
                  <p className="text-gray-600">Special Instructions:</p>
                  <p className="font-medium">{request.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Form */}
          {request.status === 'pending' ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Click "Start Processing" to accept this request and begin disposal procedures.
              </p>
              <Button 
                onClick={handleStartProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Starting...
                  </span>
                ) : (
                  "Start Processing"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disposalMethod">Disposal Method *</Label>
                <Select 
                  value={formData.disposalMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, disposalMethod: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select disposal method" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPOSAL_METHODS[request.type].map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disposalLocation">Disposal Location *</Label>
                <Input
                  id="disposalLocation"
                  value={formData.disposalLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, disposalLocation: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Enter disposal facility or location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Enter any additional notes about the disposal process"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleModalClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span> Completing...
                    </span>
                  ) : (
                    "Mark as Completed"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export the component
export default ProcessRequestModal;
