
import { useState } from 'react';
import { Subscription } from '@/pages/Dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, DollarSign, Timer } from 'lucide-react';
import EditSubscriptionModal from './EditSubscriptionModal';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onUpdate: (id: string, updates: Partial<Subscription>) => void;
  onDelete: (id: string) => void;
}

const SubscriptionList = ({ subscriptions, onUpdate, onDelete }: SubscriptionListProps) => {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
      'Productivity': 'bg-blue-100 text-blue-800 border-blue-200',
      'Cloud Storage': 'bg-gray-100 text-gray-800 border-gray-200',
      'Music & Audio': 'bg-pink-100 text-pink-800 border-pink-200',
      'Video Streaming': 'bg-red-100 text-red-800 border-red-200',
      'News & Media': 'bg-orange-100 text-orange-800 border-orange-200',
      'Health & Fitness': 'bg-green-100 text-green-800 border-green-200',
      'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Business': 'bg-slate-100 text-slate-800 border-slate-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors['Other'];
  };

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No subscriptions yet</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Start tracking your recurring expenses by adding your first subscription. 
            Get insights into your spending patterns and never miss a payment again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Your Subscriptions ({subscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const daysUntilRenewal = getDaysUntilRenewal(subscription.renewal_date);
              const isExpiringSoon = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
              const isOverdue = daysUntilRenewal < 0;
              
              return (
                <div
                  key={subscription.id}
                  className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-white/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{subscription.name}</h4>
                        <Badge className={`${getCategoryColor(subscription.category)} border text-xs`}>
                          {subscription.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSubscription(subscription)}
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(subscription.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700">${subscription.price}</span>
                      <span className="text-gray-600">/{subscription.billing_cycle}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={subscription.is_active ? "default" : "secondary"} className="text-xs">
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isOverdue ? (
                        <>
                          <Timer className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">Overdue</span>
                        </>
                      ) : isExpiringSoon ? (
                        <>
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600 font-medium">
                            {daysUntilRenewal === 0 ? 'Due Today' : `${daysUntilRenewal}d left`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Renews {formatDate(subscription.renewal_date)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          isOpen={true}
          onClose={() => setEditingSubscription(null)}
          onUpdate={(updates) => {
            onUpdate(editingSubscription.id, updates);
            setEditingSubscription(null);
          }}
        />
      )}
    </>
  );
};

export default SubscriptionList;
