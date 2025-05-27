
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, Crown, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SubSimplify
            </h1>
          </div>
          {user?.subscriptionTier === 'premium' && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Crown className="w-3 h-3" />
              <span>Pro</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user?.isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin')}
              className="hidden sm:flex border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                {user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.subscriptionTier} Plan</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
