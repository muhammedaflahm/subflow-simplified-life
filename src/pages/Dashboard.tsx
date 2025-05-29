
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import MonthlyChart from '@/components/MonthlyChart';
import CancellationAssistant from '@/components/CancellationAssistant';
import SubscriptionUpgrade from '@/components/SubscriptionUpgrade';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CreditCard, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { user, loading } = useAuth();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const loadSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map the data to ensure proper typing
        const typedSubscriptions: Subscription[] = (data || []).map(sub => ({
          id: sub.id,
          name: sub.name || '',
          price: sub.price || 0,
          billing_cycle: (sub.billing_cycle === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly',
          renewal_date: sub.renewal_date || '',
          category: sub.category || '',
          is_active: sub.is_active ?? true
        }));
        
        setSubscriptions(typedSubscriptions);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        toast({
          variant: "destructive",
          title: "Error loading subscriptions",
          description: "Please try refreshing the page."
        });
      } finally {
        setLoadingSubscriptions(false);
      }
    };

    loadSubscriptions();
  }, [user, toast]);

  const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ ...sub, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      // Ensure proper typing for the new subscription
      const newSubscription: Subscription = {
        id: data.id,
        name: data.name || '',
        price: data.price || 0,
        billing_cycle: (data.billing_cycle === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly',
        renewal_date: data.renewal_date || '',
        category: data.category || '',
        is_active: data.is_active ?? true
      };
      
      setSubscriptions(prev => [newSubscription, ...prev]);
      toast({
        title: "Subscription added!",
        description: `${sub.name} has been added to your subscriptions.`
      });
    } catch (error) {
      console.error('Add error:', error);
      toast({
        variant: "destructive",
        title: "Error adding subscription",
        description: "Please try again."
      });
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setSubscriptions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
      );
      
      toast({
        title: "Subscription updated!",
        description: "Your subscription has been updated successfully."
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        variant: "destructive",
        title: "Error updating subscription",
        description: "Please try again."
      });
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed from your list."
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error deleting subscription",
        description: "Please try again."
      });
    }
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  
  // Calculate total monthly spend in user's currency
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    // Convert from USD (stored price) to user's currency
    const convertedPrice = (sub.price * currency.rate) / 1; // currencies.USD.rate is 1
    return total + (sub.billing_cycle === 'monthly' ? convertedPrice : convertedPrice / 12);
  }, 0);

  const hasReachedLimit = user?.subscriptionTier === 'free' && subscriptions.length >= 3;

  if (loading || loadingSubscriptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {user.firstName || 'there'}!
              </h1>
              {user.subscriptionTier === 'premium' && (
                <Sparkles className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            {user.subscriptionTier === 'free' && (
              <Button 
                onClick={() => setShowUpgrade(!showUpgrade)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>
          <p className="text-gray-600">Manage your subscriptions and track your spending</p>
        </div>

        {/* Subscription Upgrade Section */}
        {showUpgrade && user.subscriptionTier === 'free' && (
          <div className="mb-8">
            <SubscriptionUpgrade />
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{activeSubscriptions.length}</div>
              <p className="text-xs text-gray-600">
                {user?.subscriptionTier === 'free' ? `${3 - subscriptions.length} remaining` : 'Unlimited'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Spend</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currency.symbol}{totalMonthlySpend.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">
                {currency.symbol}{(totalMonthlySpend * 12).toFixed(2)} annually
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Next Payment</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
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
        <div className="mb-8">
          <Button 
            onClick={() => setShowAddModal(true)} 
            disabled={hasReachedLimit} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 px-6 py-3 h-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Subscription
          </Button>
          {hasReachedLimit && (
            <div className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 font-medium">
                Free plan limited to 3 subscriptions. Upgrade to Premium for unlimited access.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SubscriptionList 
              subscriptions={subscriptions} 
              onUpdate={updateSubscription} 
              onDelete={deleteSubscription} 
            />
          </div>
          <div className="space-y-8">
            <MonthlyChart subscriptions={subscriptions} />
            <CancellationAssistant />
          </div>
        </div>
      </main>

      <AddSubscriptionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={addSubscription} 
      />
    </div>
  );
};

export default Dashboard;
