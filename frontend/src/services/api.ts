import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

// Define response types for API calls
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    department?: string;
  };
  message?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    } else {
      console.log('No token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email: string, password: string, userType: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data as AuthResponse;
  },
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: string;
    department?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data as AuthResponse;
  },
  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/profile');
    return response.data as AuthResponse;
  }
};

// Define waste request response types
export interface WasteRequestResponse {
  success: boolean;
  message?: string;
  requestId?: string;
  request?: WasteRequestData;
  requests?: WasteRequestData[];
  count?: number;
}

export interface WasteRequestData {
  _id: string;
  id: string;
  requestId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  department: string;
  urgency: string;
  instructions: string;
  status: string;
  createdAt: Date;
  createdBy: string;  // Add this line
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

export const wasteRequestService = {
  createRequest: async (requestData: {
    wasteType: string;
    quantity: number;
    unit: string;
    department: string;
    urgency: string;
    instructions: string;
  }): Promise<WasteRequestResponse> => {
    const response = await api.post('/requests/create', requestData);
    return response.data as WasteRequestResponse;
  },
  
  getMyRequests: async (): Promise<WasteRequestResponse> => {
    const response = await api.get('/requests/my-requests');
    return response.data as WasteRequestResponse;
  },
  
  getRequestById: async (id: string): Promise<WasteRequestResponse> => {
    const response = await api.get(`/requests/${id}`);
    return response.data as WasteRequestResponse;
  },
  
  getPendingRequests: async (): Promise<WasteRequestResponse> => {
    const response = await api.get('/requests/pending');
    return response.data as WasteRequestResponse;
  },
  
  assignRequest: async (id: string): Promise<WasteRequestResponse> => {
    const response = await api.put(`/requests/${id}/assign`);
    return response.data as WasteRequestResponse;
  },
  
  completeRequest: async (id: string, data: {
    disposalMethod: string;
    disposalLocation: string;
  }): Promise<WasteRequestResponse> => {
    const response = await api.put(`/requests/${id}/complete`, data);
    return response.data as WasteRequestResponse;
  }
};

export default api;