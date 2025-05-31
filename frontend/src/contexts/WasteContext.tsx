import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wasteRequestService, WasteRequestData } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface WasteRequest {
  id: string;
  requestId?: string;
  type: 'biohazardous' | 'pharmaceutical' | 'chemical' | 'general';
  quantity: number;
  unit: string;
  department: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  instructions: string;
  status: 'pending' | 'processing' | 'completed' | 'in-progress';
  createdBy: string;
  createdAt: Date;
  assignedTo?: string;
  completedAt?: Date;
  disposalMethod?: string;
  disposalLocation?: string;
  environmentalImpact?: {
    carbonFootprint?: number;
    costEstimate?: number;
    recyclingPotential?: number;
  };
}

interface WasteContextType {
  requests: WasteRequest[];
  loading: boolean;
  error: string | null;
  addRequest: (request: Omit<WasteRequest, 'id' | 'createdAt' | 'status' | 'requestId'>) => Promise<void>;
  updateRequestStatus: (id: string, status: WasteRequest['status'], updates?: Partial<WasteRequest>) => Promise<WasteRequest>; // Updated return type
  getRequestsByUser: (userId: string) => WasteRequest[];
  getPendingRequests: () => WasteRequest[];
  fetchRequests: () => Promise<void>;
  fetchPendingRequests: (forceRefresh?: boolean) => Promise<void>;
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Add these state variables to WasteProvider
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const CACHE_DURATION = 10000; // 10 seconds in milliseconds

  // Convert backend data format to frontend format
  const mapRequestData = (data: WasteRequestData): WasteRequest => ({
    id: data._id,
    requestId: data.requestId,
    type: data.wasteType as any,
    quantity: data.quantity,
    unit: data.unit,
    department: data.department,
    urgency: data.urgency as any,
    instructions: data.instructions || '',
    status: data.status === 'processing' ? 'in-progress' : data.status as any,
    createdBy: data.createdBy || '',  // Ensure createdBy is properly mapped
    createdAt: new Date(data.createdAt),
    assignedTo: data.assignedTo,
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
    disposalMethod: data.disposalMethod,
    disposalLocation: data.disposalLocation,
    environmentalImpact: data.environmentalImpact
  });

  // Fetch all requests for the logged-in user - memoize with useCallback
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wasteRequestService.getMyRequests();
      if (response.success && response.requests) {
        const mappedRequests = response.requests.map(mapRequestData);
        setRequests(mappedRequests);
      } else {
        setError(response.message || 'Failed to fetch requests');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching requests');
      toast({
        title: "Error",
        description: err.message || 'Failed to load waste requests',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // Only depends on toast

  // Fetch pending requests for disposal staff with caching
  const fetchPendingRequests = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < CACHE_DURATION) {
      // Data is fresh enough, don't fetch again
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await wasteRequestService.getPendingRequests();
      if (response.success && response.requests) {
        const mappedRequests = response.requests.map(mapRequestData);
        setRequests(mappedRequests);
        setLastFetchTime(now);
      } else {
        setError(response.message || 'Failed to fetch pending requests');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching pending requests');
      toast({
        title: "Error",
        description: err.message || 'Failed to load pending waste requests',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, lastFetchTime, CACHE_DURATION]);

  // Load requests when component mounts
  useEffect(() => {
    if (user) { // Only fetch requests if user is authenticated
      if (user.role === 'medical') {
        fetchRequests();
      } else if (user.role === 'disposal') {
        fetchPendingRequests();
      }
    }
  }, [user, fetchRequests, fetchPendingRequests]); // These dependencies are now stable

  const addRequest = async (request: Omit<WasteRequest, 'id' | 'createdAt' | 'status' | 'requestId'>) => {
    setLoading(true);
    try {
      // Map frontend format to backend format
      const requestData = {
        wasteType: request.type,
        quantity: request.quantity,
        unit: request.unit,
        department: request.department,
        urgency: request.urgency,
        instructions: request.instructions
      };
      
      const response = await wasteRequestService.createRequest(requestData);
      
      if (response.success && response.request) {
        const newRequest = mapRequestData(response.request);
        setRequests(prev => [...prev, newRequest]);
        return;
      } else {
        throw new Error(response.message || 'Failed to create request');
      }
    } catch (err: any) {
      toast({
        title: "Error creating request",
        description: err.message || 'An error occurred',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update the updateRequestStatus function to use API calls
  const updateRequestStatus = async (id: string, status: WasteRequest['status'], updates?: Partial<WasteRequest>) => {
    try {
      let response;
      
      if (status === 'in-progress') {
        response = await wasteRequestService.assignRequest(id);
      } else if (status === 'completed' && updates) {
        // Ensure we're sending the required fields to the backend
        response = await wasteRequestService.completeRequest(id, {
          disposalMethod: updates.disposalMethod || '',
          disposalLocation: updates.disposalLocation || ''
        });
      } else {
        throw new Error('Invalid status update');
      }
      
      if (response.success && response.request) {
        const updatedRequest = mapRequestData(response.request);
        setRequests(prev => prev.map(request => 
          request.id === id ? updatedRequest : request
        ));
        
        // Refresh the requests list after updating
        if (user?.role === 'medical') {
          fetchRequests();
        } else if (user?.role === 'disposal') {
          fetchPendingRequests(true); // Force refresh
        }
        
        return updatedRequest; // Return the updated request for UI feedback
      } else {
        throw new Error(response.message || 'Failed to update request status');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to update request status',
        variant: "destructive",
      });
      throw err; // Re-throw to allow handling in the component
    }
  };

  const getRequestsByUser = (userId: string) => {
    return requests.filter(request => request.createdBy === userId);
  };

  const getPendingRequests = () => {
    return requests.filter(request => request.status === 'pending');
  };

  return (
    <WasteContext.Provider value={{
      requests,
      loading,
      error,
      addRequest,
      updateRequestStatus,
      getRequestsByUser,
      getPendingRequests,
      fetchRequests,
      fetchPendingRequests
    }}>
      {children}
    </WasteContext.Provider>
  );
};
