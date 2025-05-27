import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import MonthlyChart from '@/components/MonthlyChart';
import CancellationAssistant from '@/components/CancellationAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  renewal_date: string;
  category: string;
  is_active: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔄 Load subscriptions from Supabase
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Error loading subscriptions:', error);
      else setSubscriptions(data as Subscription[]);
    };
    load();
  }, [user]);

  // ➕ Add new subscription
  const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ ...sub, user_id: user.id }])
      .select();

    if (error) console.error('Add error:', error);
    else setSubscriptions(prev => [...prev, data[0]]);
  };

  // ✏️ Update subscription
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) console.error('Update error:', error);
    else setSubscriptions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  // ❌ Delete subscription
  const deleteSubscription = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) console.error('Delete error:', error);
    else setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12);
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
              <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalMonthlySpend.toFixed(2)}</div>
              <p className="text-xs text-gray-600">${(totalMonthlySpend * 12).toFixed(2)} annually</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Next Payment</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {activeSubscriptions.length > 0
                  ? new Date(Math.min(...activeSubscriptions.map(s => new Date(s.renewal_date).getTime()))).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'None'}
              </div>
              <p className="text-xs text-gray-600">Upcoming renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Subscription Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddModal(true)} disabled={hasReachedLimit} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
          {hasReachedLimit && (
            <p className="text-sm text-orange-600 mt-2">Free plan limited to 3 subscriptions. Upgrade for unlimited access.</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SubscriptionList subscriptions={subscriptions} onUpdate={updateSubscription} onDelete={deleteSubscription} />
          </div>
          <div className="space-y-8">
            <MonthlyChart subscriptions={subscriptions} />
            <CancellationAssistant />
          </div>
        </div>
      </main>

      <AddSubscriptionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={addSubscription} />
    </div>
  );
};

export default Dashboard;
