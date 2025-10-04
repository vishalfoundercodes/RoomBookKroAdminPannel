import React, { useState } from 'react';
import { 
  Crown, CreditCard, Users, TrendingUp, Calendar, Star, 
  Check, X, AlertTriangle, Gift, Zap, Shield, 
  Bell, Mail, Phone, Globe, Download, Settings,
  DollarSign, Clock, Award, Target, Eye, Sparkles,
  Search, Filter, MoreVertical, Edit, Trash2, UserX,
  Plus, RefreshCw, FileText, BarChart3, PieChart
} from 'lucide-react';

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Admin subscription overview data
  const subscriptionStats = {
    totalAstrologers: 1247,
    activeSubscriptions: 892,
    revenue: 1789000,
    churnRate: 8.5,
    monthlyGrowth: 12.3,
    averageRevenue: 2006
  };

  // Subscription plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic Astrologer',
      price: 999,
      period: 'month',
      subscribers: 234,
      revenue: 234000,
      features: [
        'Up to 50 consultations/month',
        'Basic horoscope generation',
        'Email support',
        'Client management system',
        'Payment processing',
        'Basic analytics'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Astrologer',
      price: 1999,
      period: 'month',
      subscribers: 456,
      revenue: 912000,
      features: [
        'Unlimited consultations',
        'Advanced horoscope & predictions',
        'Video & voice consultations',
        'Priority support',
        'Advanced analytics & reports',
        'Custom branding',
        'API integrations',
        'Marketing tools'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Astrologer',
      price: 3999,
      period: 'month',
      subscribers: 202,
      revenue: 808000,
      features: [
        'Everything in Premium',
        'Unlimited storage',
        'White-label solutions',
        'Advanced AI predictions',
        'Multi-language support',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features'
      ]
    }
  ];

  // Astrologers subscription data
  const astrologers = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@email.com',
      plan: 'Premium',
      status: 'active',
      joined: '2024-01-15',
      lastPayment: '2024-01-15',
      nextBilling: '2024-02-15',
      amount: 1999,
      consultations: 156,
      revenue: 39000,
      location: 'Mumbai, India'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      plan: 'Professional',
      status: 'active',
      joined: '2023-11-20',
      lastPayment: '2024-01-10',
      nextBilling: '2024-02-10',
      amount: 3999,
      consultations: 234,
      revenue: 58500,
      location: 'Delhi, India'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      plan: 'Basic',
      status: 'cancelled',
      joined: '2023-08-12',
      lastPayment: '2023-12-12',
      nextBilling: '-',
      amount: 999,
      consultations: 45,
      revenue: 11250,
      location: 'Ahmedabad, India'
    },
    {
      id: 4,
      name: 'Meera Krishnan',
      email: 'meera.k@email.com',
      plan: 'Premium',
      status: 'overdue',
      joined: '2023-09-05',
      lastPayment: '2023-12-05',
      nextBilling: '2024-01-05',
      amount: 1999,
      consultations: 89,
      revenue: 22250,
      location: 'Chennai, India'
    },
    {
      id: 5,
      name: 'Suresh Gupta',
      email: 'suresh.gupta@email.com',
      plan: 'Professional',
      status: 'trial',
      joined: '2024-01-25',
      lastPayment: '-',
      nextBilling: '2024-02-25',
      amount: 3999,
      consultations: 12,
      revenue: 3000,
      location: 'Pune, India'
    }
  ];

  // Revenue data for charts
  const revenueData = [
    { month: 'Aug', revenue: 1450000, subscribers: 823 },
    { month: 'Sep', revenue: 1520000, subscribers: 847 },
    { month: 'Oct', revenue: 1580000, subscribers: 865 },
    { month: 'Nov', revenue: 1650000, subscribers: 878 },
    { month: 'Dec', revenue: 1720000, subscribers: 886 },
    { month: 'Jan', revenue: 1789000, subscribers: 892 }
  ];

  // Plan distribution data
  const planDistribution = [
    { name: 'Basic', value: 234, percentage: 26.2 },
    { name: 'Premium', value: 456, percentage: 51.1 },
    { name: 'Professional', value: 202, percentage: 22.6 }
  ];

  // Filter astrologers based on search and status
  const filteredAstrologers = astrologers.filter(astrologer => {
    const matchesSearch = astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         astrologer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || astrologer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-yellow-100 text-yellow-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <Icon className="h-8 w-8 text-blue-600" />
          {change && (
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const PlanCard = ({ plan }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <Crown className="h-6 w-6 text-yellow-600" />
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Price</span>
          <span className="font-medium">₹{plan.price.toLocaleString()}/month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Subscribers</span>
          <span className="font-medium">{plan.subscribers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Revenue</span>
          <span className="font-medium">₹{(plan.revenue/1000).toFixed(0)}K</span>
        </div>
      </div>
      
      <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm">
        View Details
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Crown className="mr-3 h-8 w-8 text-yellow-600" />
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">Manage astrologer subscriptions and billing</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Astrologers"
            value={subscriptionStats.totalAstrologers.toLocaleString()}
            change="+45 this month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Active Subscriptions"
            value={subscriptionStats.activeSubscriptions}
            change="+12.3%"
            changeType="positive"
            icon={Check}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${(subscriptionStats.revenue/100000).toFixed(1)}L`}
            change="+18.5%"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Churn Rate"
            value={`${subscriptionStats.churnRate}%`}
            change="-2.1%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Avg Revenue/User"
            value={`₹${subscriptionStats.averageRevenue}`}
            change="+5.2%"
            changeType="positive"
            icon={Target}
          />
          <StatCard
            title="Growth Rate"
            value={`${subscriptionStats.monthlyGrowth}%`}
            change="+3.1%"
            changeType="positive"
            icon={BarChart3}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'astrologers', label: 'Astrologers', icon: Users },
              { id: 'plans', label: 'Plans & Pricing', icon: Crown },
              { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
              { id: 'billing', label: 'Billing & Payments', icon: CreditCard }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Plan Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium text-green-600">892 (71.5%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trial</span>
                    <span className="font-medium text-blue-600">156 (12.5%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overdue</span>
                    <span className="font-medium text-yellow-600">89 (7.1%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-medium text-red-600">110 (8.8%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Basic Plans</span>
                    <span className="font-medium">₹2.34L (13.1%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium Plans</span>
                    <span className="font-medium">₹9.12L (51.0%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Professional Plans</span>
                    <span className="font-medium">₹8.08L (45.2%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-medium">₹0.35L (2.0%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New subscription', user: 'Dr. Amit Sharma', plan: 'Premium', time: '2 hours ago', type: 'success' },
                  { action: 'Plan upgraded', user: 'Priya Patel', plan: 'Professional', time: '4 hours ago', type: 'info' },
                  { action: 'Payment failed', user: 'Rajesh Kumar', plan: 'Premium', time: '6 hours ago', type: 'warning' },
                  { action: 'Subscription cancelled', user: 'Meera Singh', plan: 'Basic', time: '8 hours ago', type: 'error' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user} - {activity.plan}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Astrologers Tab */}
        {activeTab === 'astrologers' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search astrologers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Astrologer
                </button>
              </div>
            </div>

            {/* Astrologers Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Astrologer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAstrologers.map((astrologer) => (
                      <tr key={astrologer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{astrologer.name}</div>
                            <div className="text-sm text-gray-500">{astrologer.email}</div>
                            <div className="text-xs text-gray-400">{astrologer.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-900">{astrologer.plan}</span>
                          </div>
                          <div className="text-xs text-gray-500">₹{astrologer.amount}/month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(astrologer.status)}`}>
                            {astrologer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>₹{astrologer.revenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{astrologer.consultations} consultations</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {astrologer.nextBilling !== '-' ? astrologer.nextBilling : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <FileText className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Plan Management */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</div>
                    <div className="text-gray-500">per month</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Subscribers</span>
                      <span className="font-medium">{plan.subscribers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Revenue</span>
                      <span className="font-medium">₹{(plan.revenue/100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                      Edit Plan
                    </button>
                    <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Matrix */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison Matrix</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Features</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Basic</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Premium</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Monthly Consultations', basic: '50', premium: 'Unlimited', professional: 'Unlimited' },
                      { feature: 'Video Consultations', basic: '✗', premium: '✓', professional: '✓' },
                      { feature: 'Advanced Analytics', basic: '✗', premium: '✓', professional: '✓' },
                      { feature: 'Custom Branding', basic: '✗', premium: '✓', professional: '✓' },
                      { feature: 'API Access', basic: '✗', premium: 'Basic', professional: 'Advanced' },
                      { feature: 'Storage', basic: '1 GB', premium: '10 GB', professional: 'Unlimited' },
                      { feature: 'Support', basic: 'Email', premium: 'Priority', professional: 'Dedicated' }
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{row.feature}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{row.basic}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{row.premium}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{row.professional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value="₹17.89L"
                change="+18.5%"
                changeType="positive"
                icon={DollarSign}
                subtitle="This month"
              />
              <StatCard
                title="MRR Growth"
                value="12.3%"
                change="+2.1%"
                changeType="positive"
                icon={TrendingUp}
                subtitle="Month over month"
              />
              <StatCard
                title="ARPU"
                value="₹2,006"
                change="+₹156"
                changeType="positive"
                icon={Target}
                subtitle="Per astrologer"
              />
              <StatCard
                title="Churn Impact"
                value="-₹1.2L"
                change="8.5% rate"
                changeType="negative"
                icon={AlertTriangle}
                subtitle="Revenue lost"
              />
            </div>

            {/* Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue chart would go here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Revenue Distribution</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Plan distribution chart would go here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
                <div className="space-y-4">
                  {plans.map((plan, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                    const percentage = ((plan.revenue / subscriptionStats.revenue) * 100).toFixed(1);
                    return (
                      <div key={plan.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[index]} mr-3`}></div>
                          <span className="text-gray-700">{plan.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{(plan.revenue/100000).toFixed(1)}L</div>
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Lifetime Value</span>
                    <span className="font-medium">₹24,072</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Acquisition Cost</span>
                    <span className="font-medium">₹2,850</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-medium">1.4 months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Revenue Retention</span>
                    <span className="font-medium">118%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gross Revenue Retention</span>
                    <span className="font-medium">91.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Generating Astrologers</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Astrologer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Monthly Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Total Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {astrologers
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((astrologer, index) => (
                        <tr key={astrologer.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{astrologer.name}</div>
                            <div className="text-sm text-gray-500">{astrologer.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-900">{astrologer.plan}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₹{astrologer.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₹{astrologer.revenue.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-green-600 font-medium">+{Math.floor(Math.random() * 20 + 5)}%</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Billing Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Pending Payments"
                value="₹2.4L"
                change="23 invoices"
                changeType="warning"
                icon={Clock}
                subtitle="Requires attention"
              />
              <StatCard
                title="Failed Payments"
                value="₹0.8L"
                change="12 failures"
                changeType="negative"
                icon={X}
                subtitle="Last 7 days"
              />
              <StatCard
                title="Successful Payments"
                value="₹16.6L"
                change="98.2% success"
                changeType="positive"
                icon={Check}
                subtitle="This month"
              />
              <StatCard
                title="Refunds Issued"
                value="₹0.2L"
                change="8 refunds"
                changeType="neutral"
                icon={RefreshCw}
                subtitle="This month"
              />
            </div>

            {/* Payment Issues */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Issues Requiring Attention</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Astrologer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Issue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: 'Dr. Rajesh Kumar',
                        issue: 'Payment Failed',
                        amount: 1999,
                        dueDate: '2024-01-15',
                        status: 'overdue',
                        action: 'retry'
                      },
                      {
                        name: 'Priya Sharma',
                        issue: 'Card Expired',
                        amount: 3999,
                        dueDate: '2024-01-18',
                        status: 'pending',
                        action: 'contact'
                      },
                      {
                        name: 'Amit Patel',
                        issue: 'Insufficient Funds',
                        amount: 999,
                        dueDate: '2024-01-20',
                        status: 'failed',
                        action: 'retry'
                      }
                    ].map((issue, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">{issue.name}</td>
                        <td className="py-3 px-4 text-gray-600">{issue.issue}</td>
                        <td className="py-3 px-4 font-medium">₹{issue.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-600">{issue.dueDate}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            {issue.action === 'retry' ? 'Retry Payment' : 'Contact User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Distribution</h3>
                <div className="space-y-4">
                  {[
                    // { method: 'Credit Cards', percentage: 45, amount: '₹8.05L' },
                    // { method: 'Debit Cards', percentage: 30, amount: '₹5.37L' },
                    { method: 'Phone Pay', percentage: 15, amount: '₹2.68L' },
                    // { method: 'Net Banking', percentage: 8, amount: '₹1.43L' },
                    // { method: 'Wallets', percentage: 2, amount: '₹0.36L' }
                  ].map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 min-w-0 flex-1">{method.method}</span>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-medium">{method.amount}</div>
                        <div className="text-sm text-gray-500">{method.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {[
                    { user: 'Dr. Rajesh Kumar', amount: 1999, status: 'success', time: '2 hours ago' },
                    { user: 'Priya Sharma', amount: 3999, status: 'success', time: '4 hours ago' },
                    { user: 'Amit Patel', amount: 999, status: 'failed', time: '6 hours ago' },
                    { user: 'Meera Singh', amount: 1999, status: 'pending', time: '8 hours ago' },
                    { user: 'Suresh Gupta', amount: 3999, status: 'success', time: '10 hours ago' }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.user}</div>
                        <div className="text-sm text-gray-500">₹{transaction.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{transaction.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto-retry failed payments</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email payment reminders</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Grace period for overdue</span>
                      <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                        <option>3 days</option>
                        <option>7 days</option>
                        <option>15 days</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Invoicing</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto-generate invoices</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Include GST breakdown</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Invoice prefix</span>
                      <input 
                        type="text" 
                        defaultValue="AST-"
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;