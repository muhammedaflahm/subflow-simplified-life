
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Search, Phone, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CancellationScript {
  service: string;
  method: 'phone' | 'email' | 'chat';
  script: string;
  tips: string[];
}

const cancellationScripts: CancellationScript[] = [
  {
    service: 'Netflix',
    method: 'chat',
    script: "Hi, I'd like to cancel my Netflix subscription. I no longer need the service. Can you please process the cancellation immediately and confirm when my access will end?",
    tips: ['You can also cancel directly in account settings', 'No cancellation fee', 'Access continues until end of billing period']
  },
  {
    service: 'Spotify',
    method: 'chat',
    script: "Hello, I want to cancel my Spotify Premium subscription. Please process this cancellation and let me know when it will take effect. I understand I'll revert to the free tier.",
    tips: ['Can be done through app settings', 'Reverts to free tier', 'Download offline music before cancellation']
  },
  {
    service: 'Adobe Creative Cloud',
    method: 'phone',
    script: "I'm calling to cancel my Adobe Creative Cloud subscription. I understand there may be an early termination fee, but I'd like to proceed with the cancellation. Can you please process this and send me confirmation?",
    tips: ['May have early termination fees', 'Consider downgrading first', 'Export your work before cancelling']
  },
  {
    service: 'Disney+',
    method: 'chat',
    script: "I'd like to cancel my Disney+ subscription. Please process this cancellation and confirm the end date of my service. I no longer need access to the platform.",
    tips: ['Can cancel through account settings', 'No cancellation penalty', 'Consider seasonal subscriptions']
  },
  {
    service: 'Amazon Prime',
    method: 'phone',
    script: "I want to cancel my Amazon Prime membership. Please process the cancellation and let me know about any refund for unused time. I understand I'll lose Prime benefits.",
    tips: ['May offer prorated refund', 'Loses shipping benefits', 'Can cancel through account settings']
  },
  {
    service: 'Default',
    method: 'phone',
    script: "Hello, I'm calling to cancel my subscription to [SERVICE NAME]. I no longer need the service and would like to process the cancellation immediately. Can you please confirm the cancellation and provide me with a reference number?",
    tips: ['Be firm but polite', 'Ask for confirmation email', 'Note down reference numbers', 'Don\'t accept retention offers if you\'re decided']
  }
];

const CancellationAssistant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredScripts = cancellationScripts.filter(script =>
    script.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyScript = (script: string, service: string) => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Script copied!",
      description: `${service} cancellation script copied to clipboard.`,
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'phone': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'chat': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Cancellation Assistant</CardTitle>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredScripts.map((script, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{script.service}</h4>
                <Badge className={`${getMethodColor(script.method)} flex items-center space-x-1`}>
                  {getMethodIcon(script.method)}
                  <span className="capitalize">{script.method}</span>
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-700 leading-relaxed">{script.script}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyScript(script.script, script.service)}
                  className="flex items-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Script</span>
                </Button>
              </div>
              
              {script.tips.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-600 mb-1">Tips:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {script.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-1">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {filteredScripts.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <p>No scripts found for "{searchTerm}"</p>
              <p className="text-sm mt-1">Try the "Default" script as a starting point.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CancellationAssistant;
