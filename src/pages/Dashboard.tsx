
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import MonthlyChart from '@/components/MonthlyChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CreditCard, TrendingUp, Calendar } from 'lucide-react';
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
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
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
  
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    return total + (sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  if (loading || loadingSubscriptions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back{user.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-gray-600">Manage your subscriptions and track your spending</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${totalMonthlySpend.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">
                ${(totalMonthlySpend * 12).toFixed(2)} yearly
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
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
            </CardContent>
          </Card>
        </div>

        {/* Add Subscription Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SubscriptionList 
              subscriptions={subscriptions} 
              onUpdate={updateSubscription} 
              onDelete={deleteSubscription} 
            />
          </div>
          <div>
            <MonthlyChart subscriptions={subscriptions} />
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
