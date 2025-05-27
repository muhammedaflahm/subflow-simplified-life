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
import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  isActive: boolean;
  user_id?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load subscriptions from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      setIsPremium(profileData?.is_premium || false);

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) console.error('Fetch subscriptions failed:', error.message);
      else setSubscriptions(data || []);
    };

    fetchData();
  }, [user?.id]);

  // Add new subscription to Supabase
  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    if (!isPremium && subscriptions.length >= 3) {
      alert('Free users can only add 3 subscriptions. Upgrade for more.');
      return;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        ...subscription,
        user_id: user?.id,
      })
      .select()
      .single();

    if (error) {
      alert('Failed to add subscription');
      return;
    }

    setSubscriptions(prev => [...prev, data]);
  };

  // Update subscription in Supabase
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    const { error } = await supabase.from('subscriptions').update(updates).eq('id', id);
    if (!error) {
      setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub));
    }
  };

  // Delete subscription from Supabase
  const deleteSubscription = async (id: string) => {
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (error) {
      alert('Failed to delete');
      return;
    }
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  const hasReachedLimit = !isPremium && subscriptions.length >= 3;

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
                {isPremium ? 'Unlimited' : `${3 - subscriptions.length} remaining`}
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
                {activeSubscriptions.length > 0
                  ? new Date(
                      Math.min(...activeSubscriptions.map(s => new Date(s.renewalDate).getTime()))
                    ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'None'}
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
