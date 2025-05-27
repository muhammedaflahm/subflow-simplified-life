
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import MonthlyChart from '@/components/MonthlyChart';
import CancellationAssistant from '@/components/CancellationAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  isActive: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load subscriptions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`subscriptions_${user?.id}`);
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    }
  }, [user?.id]);

  // Save subscriptions to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(subscriptions));
    }
  }, [subscriptions, user?.id]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  const hasReachedLimit = user?.subscriptionTier === 'free' && subscriptions.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</div>
              <p className="text-xs text-gray-600">
                {user?.subscriptionTier === 'free' ? `${3 - subscriptions.length} remaining` : 'Unlimited'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Monthly Spend
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalMonthlySpend.toFixed(2)}</div>
              <p className="text-xs text-gray-600">
                ${(totalMonthlySpend * 12).toFixed(2)} annually
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Next Payment
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {activeSubscriptions.length > 0 ? 
                  new Date(Math.min(...activeSubscriptions.map(s => new Date(s.renewalDate).getTime())))
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                  : 'None'
                }
              </div>
              <p className="text-xs text-gray-600">Upcoming renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Subscription Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAddModal(true)}
            disabled={hasReachedLimit}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
          {hasReachedLimit && (
            <p className="text-sm text-orange-600 mt-2">
              Free plan limited to 3 subscriptions. Upgrade for unlimited access.
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscriptions List */}
          <div>
            <SubscriptionList 
              subscriptions={subscriptions}
              onUpdate={updateSubscription}
              onDelete={deleteSubscription}
            />
          </div>

          {/* Charts and Tools */}
          <div className="space-y-8">
            <MonthlyChart subscriptions={subscriptions} />
            <CancellationAssistant />
          </div>
        </div>
      </main>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addSubscription}
      />
    </div>
  );
};

export default Dashboard;
