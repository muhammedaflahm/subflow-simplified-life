
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, CreditCard, TrendingUp, Shield } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Menu className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SubSimplify</h1>
          </div>
          
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Manage Your Subscriptions
            <span className="block text-gray-600">Simply & Freely</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track all your subscriptions in one place. Get insights into your spending. 
            Never miss a payment again. Completely free, forever.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Everything</h3>
              <p className="text-gray-600">
                Add unlimited subscriptions and keep track of all your recurring payments in one dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analytics</h3>
              <p className="text-gray-600">
                Get insights into your spending patterns with beautiful charts and spending breakdowns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600">
                No hidden fees, no premium plans, no limits. SubSimplify is completely free to use forever.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
