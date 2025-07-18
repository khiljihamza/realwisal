import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnalyticsData } from '@/types';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Store,
  Download,
  Calendar
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend = 'neutral' }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <p className={`text-sm ${trendColor} flex items-center mt-1`}>
                <span className="mr-1">{trendIcon}</span>
                {Math.abs(change)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

const LineChart: React.FC<{ data: ChartData; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.datasets[0].data);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <svg viewBox="0 0 600 200" className="w-full h-full">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map(y => (
              <line key={y} x1="50" x2="550" y1={y} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={data.datasets[0].data
                .map((value, index) => {
                  const x = 50 + (index * 500) / (data.datasets[0].data.length - 1);
                  const y = 200 - (value / maxValue) * 200;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            
            {/* Fill area */}
            <polygon
              fill="url(#gradient)"
              points={`50,200 ${data.datasets[0].data
                .map((value, index) => {
                  const x = 50 + (index * 500) / (data.datasets[0].data.length - 1);
                  const y = 200 - (value / maxValue) * 200;
                  return `${x},${y}`;
                })
                .join(' ')} 550,200`}
            />
            
            {/* Data points */}
            {data.datasets[0].data.map((value, index) => {
              const x = 50 + (index * 500) / (data.datasets[0].data.length - 1);
              const y = 200 - (value / maxValue) * 200;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {data.labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BarChart: React.FC<{ data: any[]; title: string; dataKey: string; nameKey: string }> = ({ 
  data, 
  title, 
  dataKey, 
  nameKey 
}) => {
  const maxValue = Math.max(...data.map(item => item[dataKey]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600 truncate">
                {item[nameKey]}
              </div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {item[dataKey].toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        totalUsers: 15420,
        totalSellers: 342,
        totalProducts: 8750,
        totalOrders: 2890,
        totalRevenue: 425300,
        monthlyRevenue: [35000, 42000, 38000, 51000, 49000, 62000, 58000, 71000, 69000, 78000, 85000, 92000],
        topProducts: [],
        topCategories: [
          { name: 'Electronics', count: 2340 },
          { name: 'Clothing', count: 1890 },
          { name: 'Home & Garden', count: 1560 },
          { name: 'Sports', count: 1240 },
          { name: 'Books', count: 980 },
        ],
        userGrowth: [1200, 1350, 1280, 1580, 1720, 1650, 1890, 2100, 2350, 2180, 2420, 2650],
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportData = (type: 'csv' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting data as ${type}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const revenueChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue',
      data: analyticsData.monthlyRevenue,
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
      tension: 0.4,
    }],
  };

  const userGrowthChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'New Users',
      data: analyticsData.userGrowth,
      borderColor: '#10B981',
      backgroundColor: '#10B981',
      tension: 0.4,
    }],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportData('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.totalRevenue)}
          change={12.5}
          trend="up"
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders.toLocaleString()}
          change={8.2}
          trend="up"
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Total Users"
          value={analyticsData.totalUsers.toLocaleString()}
          change={15.3}
          trend="up"
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Total Products"
          value={analyticsData.totalProducts.toLocaleString()}
          change={-2.1}
          trend="down"
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={revenueChartData} title="Revenue Trend" />
        <LineChart data={userGrowthChartData} title="User Growth" />
      </div>

      {/* Top Categories and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analyticsData.topCategories}
          title="Top Categories"
          dataKey="count"
          nameKey="name"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'order', message: 'New order #12345 received', time: '2 minutes ago' },
                { type: 'user', message: 'New user registered', time: '5 minutes ago' },
                { type: 'product', message: 'Product "iPhone 14" updated', time: '10 minutes ago' },
                { type: 'payment', message: 'Payment of $299.99 processed', time: '15 minutes ago' },
                { type: 'review', message: 'New review posted for "Laptop Stand"', time: '20 minutes ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Sellers"
          value={analyticsData.totalSellers}
          change={5.7}
          trend="up"
          icon={<Store className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          change={0.8}
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Avg. Order Value"
          value={formatCurrency(147.12)}
          change={-1.2}
          trend="down"
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
