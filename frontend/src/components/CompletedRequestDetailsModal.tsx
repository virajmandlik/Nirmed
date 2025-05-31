import React from 'react';
import { WasteRequest } from '../contexts/WasteContext'; // Import WasteRequest type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

// Define helper functions (can be shared or defined locally if used only here)
const getWasteTypeColor = (type: string): string => {
  switch (type) {
    case 'biohazardous': return 'bg-red-100 text-red-800';
    case 'pharmaceutical': return 'bg-blue-100 text-blue-800';
    case 'chemical': return 'bg-purple-100 text-purple-800';
    case 'general': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-orange-100 text-orange-800';
    case 'completed': return 'bg-green-100 text-green-800';
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

interface CompletedRequestDetailsModalProps {
  request: WasteRequest; // Use the imported type
  onClose: () => void;
}

const CompletedRequestDetailsModal: React.FC<CompletedRequestDetailsModalProps> = ({ request, onClose }) => {
  if (!request) return null; // Should not happen if used correctly, but good practice

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Completed Request Details</CardTitle>
              <CardDescription>
                Details of the completed waste disposal request
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Request Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Request ID:</p>
                <p className="font-medium">{request.requestId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
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
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-600">Created At:</p>
                <p className="font-medium">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
               {request.instructions && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-gray-600">Special Instructions:</p>
                  <p className="font-medium">{request.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Completion Details */}
          <div className="p-4 bg-green-50 rounded-lg">
             <h3 className="font-medium mb-3">Completion Details</h3>
             {request.status === 'completed' && request.completedAt ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                 <div className="col-span-1 md:col-span-2">
                   <p className="text-gray-600">Completed At:</p>
                   <p className="font-medium">{new Date(request.completedAt).toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-gray-600">Disposal Method:</p>
                    <p className="font-medium">{request.disposalMethod || 'N/A'}</p>
                 </div>
                 <div>
                    <p className="text-gray-600">Disposal Location:</p>
                    <p className="font-medium">{request.disposalLocation || 'N/A'}</p>
                 </div>
              </div>
             ) : (
               <p className="text-gray-600">Request is not yet completed.</p>
             )}
          </div>

          {/* Environmental Impact (if available) */}
          {request.environmentalImpact && (request.environmentalImpact.carbonFootprint || request.environmentalImpact.costEstimate || request.environmentalImpact.recyclingPotential !== undefined) && (
             <div className="p-4 bg-blue-50 rounded-lg">
               <h3 className="font-medium mb-3">Environmental Impact</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                 {request.environmentalImpact.carbonFootprint !== undefined && (
                   <div>
                     <p className="text-gray-600">Carbon Footprint:</p>
                     <p className="font-medium">{request.environmentalImpact.carbonFootprint.toFixed(2)} kg CO2e</p>
                   </div>
                 )}
                 {request.environmentalImpact.costEstimate !== undefined && (
                    <div>
                      <p className="text-gray-600">Cost Estimate:</p>
                      <p className="font-medium">${request.environmentalImpact.costEstimate.toFixed(2)}</p>
                    </div>
                 )}
                 {request.environmentalImpact.recyclingPotential !== undefined && (
                    <div>
                      <p className="text-gray-600">Recycling Potential:</p>
                      <p className="font-medium">{(request.environmentalImpact.recyclingPotential * 100).toFixed(0)}%</p>
                    </div>
                 )}
               </div>
             </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedRequestDetailsModal; 