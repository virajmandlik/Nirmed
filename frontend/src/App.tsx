
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WasteProvider } from "./contexts/WasteContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicalStaffDashboard from "./pages/MedicalStaffDashboard";
import DisposalStaffDashboard from "./pages/DisposalStaffDashboard";
import Training from "./pages/Training";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WasteProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/user1" 
                element={
                  <ProtectedRoute requiredRole="medical">
                    <MedicalStaffDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user2" 
                element={
                  <ProtectedRoute requiredRole="disposal">
                    <DisposalStaffDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/training" 
                element={
                  <ProtectedRoute>
                    <Training />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WasteProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
