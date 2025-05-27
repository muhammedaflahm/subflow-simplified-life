
import { useState } from 'react';
import { Subscription } from '@/pages/Dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
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

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
          <p className="text-gray-600">Add your first subscription to get started tracking your expenses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const daysUntilRenewal = getDaysUntilRenewal(subscription.renewalDate);
              const isExpiringSoon = daysUntilRenewal <= 7;
              
              return (
                <div
                  key={subscription.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{subscription.name}</h4>
                      <p className="text-sm text-gray-600">{subscription.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSubscription(subscription)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(subscription.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${subscription.price}</span>
                        <span>/{subscription.billingCycle}</span>
                      </div>
                      
                      <Badge variant={subscription.isActive ? "default" : "secondary"}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={isExpiringSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                        {daysUntilRenewal > 0 ? `${daysUntilRenewal}d` : 'Today'}
                      </span>
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
