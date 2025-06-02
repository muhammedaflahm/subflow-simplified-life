
import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { DollarSign } from 'lucide-react';

const Auth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Check if signup parameter is present in URL
    if (searchParams.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SubSimplify
            </h1>
          </div>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
          </p>
        </div>

        {isSignUp ? (
          <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <SignIn onSwitchToSignUp={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
