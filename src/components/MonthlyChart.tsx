
import { useMemo } from 'react';
import { Subscription } from '@/pages/Dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MonthlyChartProps {
  subscriptions: Subscription[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

const MonthlyChart = ({ subscriptions }: MonthlyChartProps) => {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    subscriptions.forEach(sub => {
      if (sub.is_active) {
        const monthlyAmount = sub.billing_cycle === 'monthly' ? sub.price : sub.price / 12;
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount;
      }
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
      name: category
    }));
  }, [subscriptions]);

  const totalSpend = chartData.reduce((sum, item) => sum + item.amount, 0);

  if (chartData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-600">No active subscriptions to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Monthly Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Monthly Spend']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                className="drop-shadow-sm"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Spending Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ category, amount }) => `${category}: $${amount}`}
                    labelLine={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Monthly Spend']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 mb-3">Total: ${totalSpend.toFixed(2)}/month</h4>
              {chartData.map((item, index) => (
                <div key={item.category} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700">{item.category}</span>
                  <span className="font-medium">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyChart;
