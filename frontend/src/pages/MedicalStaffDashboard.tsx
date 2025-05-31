import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useWaste, WasteRequest } from '../contexts/WasteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateWasteRequest from '../components/CreateWasteRequest';
import { Plus, Clock, CheckCircle, AlertTriangle, Leaf, Loader2 } from 'lucide-react';
import CompletedRequestDetailsModal from '../components/CompletedRequestDetailsModal';
import { useNavigate } from 'react-router-dom';


const MedicalStaffDashboard = () => {
  const { user } = useAuth();
  const { requests, loading, error, fetchRequests } = useWaste();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCompletedRequest, setSelectedCompletedRequest] = useState<WasteRequest | null>(null);
  const [isCompletedDetailsModalOpen, setIsCompletedDetailsModalOpen] = useState(false);
  
  // Add a useEffect to refresh data when component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests for the current user
  const userRequests = requests;  // All requests should already be filtered by the backend
  const pendingRequests = userRequests.filter(r => r.status === 'pending');
  const inProgressRequests = userRequests.filter(r => r.status === 'in-progress');
  const completedRequests = userRequests.filter(r => r.status === 'completed');

  // Calculate environmental score (placeholder calculation)
  const calculateEnvironmentalScore = () => {
    if (completedRequests.length === 0) return 95; // Default score
    
    // This would be replaced with actual calculation based on disposal methods
    // For now, just a placeholder calculation
    return Math.min(95, 85 + completedRequests.length * 2);
  };

  const environmentalScore = calculateEnvironmentalScore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
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

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchRequests(); // Refresh the requests after creating a new one
  };

  // Handler to open the completed request details modal
  const handleViewCompletedDetails = (request: WasteRequest) => {
    setSelectedCompletedRequest(request);
    setIsCompletedDetailsModalOpen(true);
  };

  // Handler to close the completed request details modal
  const handleCloseCompletedDetailsModal = () => {
    setSelectedCompletedRequest(null);
    setIsCompletedDetailsModalOpen(false);
  };

  const navigate = useNavigate();
  const handleOpenAIRecommendations = () => {
  navigate('/ai-recommendations'); // or any route you've defined
};

  return (
    <Layout title="Medical Staff Dashboard">
      <div className="space-y-6">
        {/* Header
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div> */}

        {/* Header */}
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
    <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
  </div>
  <div className="flex space-x-2">
    <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" />
      New Request
    </Button>
    <Button onClick={handleOpenAIRecommendations} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
      AI Waste Findings
    </Button>
  </div>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environmental Score</CardTitle>
              <Leaf className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{environmentalScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Requests Summary</CardTitle>
            <CardDescription>
              Overview of completed disposal activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div key="completed" className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedRequests.length}</p>
                <p className="text-sm text-green-700">Requests Completed</p>
              </div>
              <div key="weight" className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {completedRequests.reduce((sum, req) => sum + req.quantity, 0).toFixed(1)}
                </p>
                <p className="text-sm text-blue-700">Total Weight (kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Waste Disposal Requests</CardTitle>
            <CardDescription>
              Track the status of your submitted requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Loading requests...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading requests: {error}</p>
                <Button onClick={fetchRequests} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : userRequests.length > 0 ? (
              <div className="space-y-4">
                {userRequests.slice(0, 5).map((request) => (
                  <div 
                    key={request.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg ${request.status === 'completed' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={request.status === 'completed' ? () => handleViewCompletedDetails(request) : undefined}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">
                          {request.requestId || 'ID Pending'} - {request.quantity} {request.unit} {request.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.department} • {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getWasteTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No requests yet. Create your first waste disposal request!</p>
                <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                  Create Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Section - Unchanged */}
        
        {/* Create Request Modal */}
        {showCreateForm && (
          <CreateWasteRequest
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        )}

        {/* Completed Request Details Modal */}
        {selectedCompletedRequest && isCompletedDetailsModalOpen && (
          <CompletedRequestDetailsModal 
            request={selectedCompletedRequest} 
            onClose={handleCloseCompletedDetailsModal} 
          />
        )}
      </div>
    </Layout>
  );
};

export default MedicalStaffDashboard;
