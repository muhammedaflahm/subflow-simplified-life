
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, formatPrice, currencies } from '@/utils/currencyUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SubscriptionUpgrade = () => {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Convert base prices to user's currency
  const monthlyPrice = convertPrice(3, currencies.USD, currency);
  const yearlyPrice = convertPrice(30, currencies.USD, currency);

  const plans = [
    {
      name: 'Monthly',
      price: monthlyPrice,
      period: 'month',
      subscriptionType: 'monthly',
      variantId: '123456', // Replace with actual Lemon Squeezy variant ID
      savings: null,
      popular: false,
    },
    {
      name: 'Annual',
      price: yearlyPrice,
      period: 'year',
      subscriptionType: 'yearly',
      variantId: '123457', // Replace with actual Lemon Squeezy variant ID
      savings: 'Save 17%',
      popular: true,
    }
  ];

  const features = [
    'Unlimited subscriptions',
    'AI-powered insights',
    'Advanced analytics',
    'Priority support',
    'Export data',
    'Custom categories',
    'Smart notifications',
    'One-click cancellation'
  ];

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upgrade your subscription.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting Lemon Squeezy checkout process for plan:', plan);
      
      // Create Lemon Squeezy checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-lemon-squeezy-checkout', {
        body: {
          variantId: plan.variantId,
          customData: {
            user_id: user.id,
            subscription_type: plan.subscriptionType,
            user_email: user.email,
          }
        }
      });

      if (checkoutError) {
        console.error('Checkout creation error:', checkoutError);
        throw new Error(checkoutError.message || 'Failed to create checkout session');
      }

      if (!checkoutData?.checkout) {
        throw new Error('Invalid checkout response from server');
      }

      console.log('Checkout session created:', checkoutData.checkout);

      // Redirect to Lemon Squeezy checkout page
      const checkoutUrl = checkoutData.checkout.attributes.url;
      window.open(checkoutUrl, '_blank');

      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to complete your payment.",
      });

    } catch (error) {
      console.error('Checkout initiation failed:', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Unable to create checkout session. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user?.subscriptionTier === 'premium') {
    return (
      <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border-yellow-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="w-8 h-8 text-yellow-600" />
            <CardTitle className="text-2xl text-yellow-800">Premium Member</CardTitle>
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-yellow-700 text-lg">You're already enjoying Premium benefits!</p>
          <div className="mt-4 p-4 bg-white/50 rounded-lg">
            <p className="text-sm text-yellow-600">🚀 Unlimited subscriptions, AI insights, and priority support</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 mb-4">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Unlock Premium Features</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600 text-lg">Get unlimited subscriptions, AI insights, and advanced analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
              plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                  🔥 Most Popular
                </Badge>
              </div>
            )}
            {plan.savings && !plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                {plan.savings}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {formatPrice(plan.price, currency)}
                <span className="text-lg text-gray-500">/{plan.period}</span>
              </div>
              {plan.popular && (
                <div className="text-sm text-green-600 font-medium">
                  💰 Best value for money
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button 
                onClick={() => handleUpgrade(plan)}
                disabled={loading}
                className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to {plan.name}
                  </>
                )}
              </Button>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-center">Everything included:</h4>
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          🔒 Secure payment powered by Lemon Squeezy • 🔄 Cancel anytime • 💳 All major payment methods accepted
        </p>
        <p className="text-xs text-gray-400">
          Prices shown in {currency.name} ({currency.code}). Automatically detected based on your location.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;
