
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditSubscriptionModal from './EditSubscriptionModal';

interface Subscription {
  id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  renewal_date: string;
  category: string;
  is_active: boolean;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onUpdate: (id: string, updates: Partial<Subscription>) => void;
  onDelete: (id: string) => void;
}

const SubscriptionList = ({ subscriptions, onUpdate, onDelete }: SubscriptionListProps) => {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      entertainment: 'bg-purple-100 text-purple-800',
      productivity: 'bg-blue-100 text-blue-800',
      fitness: 'bg-green-100 text-green-800',
      education: 'bg-yellow-100 text-yellow-800',
      music: 'bg-pink-100 text-pink-800',
      news: 'bg-orange-100 text-orange-800',
      software: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category.toLowerCase()] || colors.other;
  };

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No subscriptions yet</h3>
          <p className="text-gray-500">Add your first subscription to start tracking your expenses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscriptions</h2>
      {subscriptions.map((subscription) => {
        const nextRenewal = new Date(subscription.renewal_date);
        const isUpcoming = nextRenewal.getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000; // Within 7 days

        return (
          <Card 
            key={subscription.id} 
            className={`bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
              !subscription.is_active ? 'opacity-60' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{subscription.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getCategoryColor(subscription.category)}>
                        {subscription.category}
                      </Badge>
                      {!subscription.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {isUpcoming && subscription.is_active && (
                        <Badge className="bg-orange-100 text-orange-800">Renewing Soon</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingSubscription(subscription)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(subscription.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(subscription.price)}/{subscription.billing_cycle === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Next Payment</p>
                    <p className="font-semibold text-gray-900">
                      {nextRenewal.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          isOpen={!!editingSubscription}
          onClose={() => setEditingSubscription(null)}
          onUpdate={(updates) => {
            onUpdate(editingSubscription.id, updates);
            setEditingSubscription(null);
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionList;
