
import { useState } from 'react';
import { Subscription } from '@/pages/Dashboard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subscription: Omit<Subscription, 'id'>) => void;
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

const AddSubscriptionModal = ({ isOpen, onClose, onAdd }: AddSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    renewalDate: '',
    category: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.renewalDate || !formData.category) {
      return;
    }

    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      renewalDate: formData.renewalDate,
      category: formData.category,
      isActive: formData.isActive
    });

    // Reset form
    setFormData({
      name: '',
      price: '',
      billingCycle: 'monthly',
      renewalDate: '',
      category: '',
      isActive: true
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Add a new subscription to track your recurring expenses.
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
