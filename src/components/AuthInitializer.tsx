import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';

import { Skeleton } from './ui/skeleton';

import { setupApiInterceptors } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Import Loader2 for a better loading indicator

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, isAuthenticated, user, signupInProgress } = useAuthStore(); // Get signupInProgress

  const location = useLocation();

  const [isAuthAndDataLoaded, setIsAuthAndDataLoaded] = useState(false); // Combined loading state
  const hasSetupInterceptors = useRef(false);

  // Use TanStack Query for the initial auth check
  const { data, isLoading: isAuthQueryLoading, isError: isAuthQueryError } = useQuery({
    queryKey: ['authStatus', location.pathname],
    queryFn: async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/auth/check-auth', {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        throw error; 
      }
    },
    enabled: true,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  // This effect runs once to set up interceptors
  useEffect(() => {
    if (!hasSetupInterceptors.current) {
      setupApiInterceptors(logout);
      hasSetupInterceptors.current = true;
    }
  }, [logout]);

  // This effect handles the result of the auth query
  useEffect(() => {
    // Only proceed if the auth query has finished loading
    if (!isAuthQueryLoading) {
      // If data is successfully fetched and user is present
      if (data?.success && data.user) {
        console.log("[AuthInitializer] User authenticated:", data.user.userName);
        // Check if the user is already set in the store to prevent redundant calls
        if (!isAuthenticated || user?._id !== data.user._id) {
          login(data.user, false); // Login without showing toast
        }
  
        console.log("[AuthInitializer] Cart and Wishlist initialization triggered.");
      } else {
        console.log("[AuthInitializer] User not authenticated or check failed.");
        // Only call logout if not in signup progress AND currently authenticated
        // This prevents clearing signupInProgress if the user is in the verification flow
        // and prevents redundant logout calls if already logged out.
        if (!signupInProgress && isAuthenticated) {
          logout(true);
        }
      }
      // Mark initial check as complete regardless of success or failure
      setIsAuthAndDataLoaded(true);
    }
  }, [isAuthQueryLoading, data, isAuthQueryError, login, logout,  isAuthenticated, user, signupInProgress]);

  // If the initial check or data loading is still in progress, show a loading skeleton
  if (!isAuthAndDataLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-8">
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl text-gray-700">Loading your session...</p>
            <div className="mt-8 w-full max-w-3xl space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // After the initial check and data loading is finished, render children.
  // ProtectedRoute will then handle further redirection if isAuthenticated is false.
  return <>{children}</>;
};

export default AuthInitializer;