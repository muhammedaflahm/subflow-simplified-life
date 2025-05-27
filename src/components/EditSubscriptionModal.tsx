
import { useState, useEffect } from 'react';
import { Subscription } from '@/pages/Dashboard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EditSubscriptionModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Subscription>) => void;
}

const categories = [
  'Entertainment',
  'Productivity',
  'Cloud Storage',
  'Music & Audio',
  'Video Streaming',
  'News & Media',
  'Health & Fitness',
  'Education',
  'Business',
  'Other'
];

const EditSubscriptionModal = ({ subscription, isOpen, onClose, onUpdate }: EditSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: subscription.name,
    price: subscription.price.toString(),
    billingCycle: subscription.billingCycle,
    renewalDate: subscription.renewalDate,
    category: subscription.category,
    isActive: subscription.isActive
  });

  useEffect(() => {
    setFormData({
      name: subscription.name,
      price: subscription.price.toString(),
      billingCycle: subscription.billingCycle,
      renewalDate: subscription.renewalDate,
      category: subscription.category,
      isActive: subscription.isActive
    });
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.renewalDate || !formData.category) {
      return;
    }

    onUpdate({
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      renewalDate: formData.renewalDate,
      category: formData.category,
      isActive: formData.isActive
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update your subscription details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Netflix, Spotify"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="9.99"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select 
                value={formData.billingCycle} 
                onValueChange={(value: 'monthly' | 'yearly') => 
                  setFormData(prev => ({ ...prev, billingCycle: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="renewalDate">Next Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData(prev => ({ ...prev, renewalDate: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active subscription</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionModal;
