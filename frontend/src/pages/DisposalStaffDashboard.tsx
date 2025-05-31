import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProcessRequestModal from '../components/ProcessRequestModal';
import { CheckCircle, Clock, AlertTriangle, Truck, BarChart3 } from 'lucide-react';

const DisposalStaffDashboard = () => {
  const { user } = useAuth();
  const { requests, getPendingRequests, fetchPendingRequests, updateRequestStatus } = useWaste();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [processingRequestIds, setProcessingRequestIds] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRequestToComplete, setSelectedRequestToComplete] = useState<string | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);

  // Add a debounce mechanism to prevent too frequent API calls
  const fetchData = useCallback(() => {
    if (user && user.role === 'disposal') {
      fetchPendingRequests();
    }
  }, [user, fetchPendingRequests]);

  // Use the debounced fetch function
  useEffect(() => {
    fetchData();
    
    // Optional: Set up a refresh interval (e.g., every 30 seconds)
    // This is better than continuous polling
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchData]);

  // Handle modal close - reset both selectedRequest and processingRequestIds
  const handleModalClose = () => {
    console.log('Modal closing, resetting states');
    setSelectedRequest(null);
    setIsModalOpen(false);
    // Only reset processing state for the selected request if it exists
    if (selectedRequest) {
      setProcessingRequestIds(prev => {
        const updated = {...prev};
        delete updated[selectedRequest];
        console.log('Updated processingRequestIds:', updated);
        return updated;
      });
    }
  };

  // Handle Mark as Completed modal close - reset selectedRequestToComplete and close modal
  const handleCompletionModalClose = () => {
    console.log('Completion modal closing, resetting state');
    setSelectedRequestToComplete(null);
    setIsCompletionModalOpen(false);
  };

  // Handle process button click
  const handleProcessClick = (requestId: string) => {
    console.log(`Process button clicked for request: ${requestId}`);
    
    // Set this specific request as processing
    setProcessingRequestIds(prev => {
      const updated = {...prev, [requestId]: true};
      console.log('Updated processingRequestIds:', updated);
      return updated;
    });
    
    // Set the selected request and open the modal
    setSelectedRequest(requestId);
    setIsModalOpen(true);
    console.log(`Selected request set to: ${requestId}, modal should open`);
  };

  // Handle process completion or error
  const handleProcessComplete = (requestId: string, success: boolean) => {
    console.log(`Process ${success ? 'completed' : 'failed'} for request: ${requestId}`);
    
    // Remove this request from processing state
    setProcessingRequestIds(prev => {
      const updated = {...prev};
      delete updated[requestId];
      console.log('Updated processingRequestIds after completion:', updated);
      return updated;
    });
    
    // If successful, also close the modal
    if (success) {
      setSelectedRequest(null);
      setIsModalOpen(false);
    }
  };

  // Handle Mark as Completed button click
  const handleCompleteClick = (requestId: string) => {
    console.log(`Mark as Completed button clicked for request: ${requestId}`);
    setSelectedRequestToComplete(requestId);
    setIsCompletionModalOpen(true);
  };

  // Handle completion process completion or error (for in-progress requests being completed)
  const handleCompletionProcessComplete = (requestId: string, success: boolean) => {
    console.log(`Completion process ${success ? 'completed' : 'failed'} for request: ${requestId}`);
    // No need to update processingRequestIds here, as it's for the *initial* processing state
    // The WasteContext will refetch requests, updating the status which will remove it from the in-progress list
    if (success) {
      handleCompletionModalClose(); // Close the modal on success
      // WasteContext will handle fetching updated list
    }
  };

  const pendingRequests = getPendingRequests();
  const inProgressRequests = requests.filter(r => r.status === 'in-progress');
  const completedToday = requests.filter(r => 
    r.status === 'completed' && 
    r.completedAt && 
    new Date(r.completedAt).toDateString() === new Date().toDateString()
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'biohazardous': return 'bg-red-100 text-red-800';
      case 'pharmaceutical': return 'bg-blue-100 text-blue-800';
      case 'chemical': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Disposal Staff Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disposal Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{inProgressRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">98%</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Disposal Requests</CardTitle>
            <CardDescription>
              Requests waiting to be processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">
                          {request.quantity} {request.unit} - {request.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.department} • {request.createdAt.toLocaleDateString()}
                        </p>
                        {request.instructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            Instructions: {request.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getWasteTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => handleProcessClick(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processingRequestIds[request.id]}
                      >
                        {processingRequestIds[request.id] ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">⟳</span> Processing
                          </span>
                        ) : (
                          "Process"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No pending requests. Great job!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In Progress Requests */}
        {inProgressRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>In Progress Disposal Requests</CardTitle>
              <CardDescription>
                Requests currently being processed and awaiting completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">
                          {request.quantity} {request.unit} - {request.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.department} • {request.createdAt.toLocaleDateString()}
                        </p>
                        {request.instructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            Instructions: {request.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getWasteTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteClick(request.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Mark as Completed
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>
              Overview of today's disposal activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div key="completed" className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedToday.length}</p>
                <p className="text-sm text-green-700">Requests Completed</p>
              </div>
              <div key="weight" className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {completedToday.reduce((sum, req) => sum + req.quantity, 0).toFixed(1)}
                </p>
                <p className="text-sm text-blue-700">Total Weight (kg)</p>
              </div>
              <div key="compliance" className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">98%</p>
                <p className="text-sm text-purple-700">Compliance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Request Modal (for pending requests) */}
        {selectedRequest && isModalOpen && (
          <ProcessRequestModal
            requestId={selectedRequest}
            onClose={handleModalClose}
            onProcessComplete={handleProcessComplete}
            actionType="process"
          />
        )}

        {/* Complete Request Modal (for in-progress requests) */}
        {selectedRequestToComplete && isCompletionModalOpen && (
          <ProcessRequestModal
            requestId={selectedRequestToComplete}
            onClose={handleCompletionModalClose}
            onProcessComplete={handleCompletionProcessComplete}
            actionType="complete"
          />
        )}
      </div>
    </Layout>
  );
};

export default DisposalStaffDashboard;
