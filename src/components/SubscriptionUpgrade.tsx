
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionUpgrade = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Monthly',
      price: 3,
      period: 'month',
      subscriptionType: 'monthly',
      savings: null,
    },
    {
      name: 'Annual',
      price: 30,
      period: 'year',
      subscriptionType: 'yearly',
      savings: 'Save $6',
    }
  ];

  const features = [
    'Unlimited subscriptions',
    'Advanced analytics',
    'Priority support',
    'Export data',
    'Custom categories',
    'Renewal reminders'
  ];

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user) return;

    setLoading(true);
    try {
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: plan.price,
          currency: 'USD',
          subscriptionType: plan.subscriptionType
        }
      });

      if (orderError) throw orderError;

      const options = {
        key: 'rzp_test_qDFJwdL3wflxyR', // Your Razorpay key from env
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'SubSimplify',
        description: `${plan.name} Premium Subscription`,
        order_id: orderData.order.id,
        prefill: {
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: plan.price,
                subscriptionType: plan.subscriptionType
              }
            });

            if (verifyError) throw verifyError;

            toast({
              title: "Payment successful!",
              description: "Your subscription has been upgraded to Premium. Please refresh the page.",
            });
            
            // Refresh the page to update user state
            window.location.reload();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              variant: "destructive",
              title: "Payment verification failed",
              description: "Please contact support if your payment was deducted.",
            });
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "Unable to process payment. Please try again.",
      });
      setLoading(false);
    }
  };

  if (user?.subscriptionTier === 'premium') {
    return (
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-600" />
            <CardTitle className="text-yellow-800">Premium Member</CardTitle>
            <Sparkles className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-yellow-700">You're already enjoying Premium benefits!</p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600">Unlock unlimited subscriptions and advanced features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            {plan.savings && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                {plan.savings}
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-blue-600">
                ${plan.price}
                <span className="text-lg text-gray-500">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleUpgrade(plan)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
              </Button>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;
