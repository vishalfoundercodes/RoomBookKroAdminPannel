import React, { useState, useEffect } from 'react';
import Card from '../../reusable_components/Card';
import StatCard from '../../reusable_components/StatCard';
import ChatComponent from '../../reusable_components/ChatComponent';
import LineChartComponent from '../../reusable_components/LineChart';
import BarChartComponent from '../../reusable_components/BarChart';
import PieChartComponent from '../../reusable_components/PieChart';
import AreaChartComponent from '../../reusable_components/AreaChart';
import DataTable from '../../reusable_components/DataTable';
import ActivityTimeline from '../../reusable_components/ActivityTimeline';
import ProgressCard from '../../reusable_components/ProgressCard';
import ReportsCard from '../../reusable_components/ReportsCard';
import NotificationPanel from '../../reusable_components/NotificationPanel';
import CalendarWidget from '../../reusable_components/CalendarWidget';

import { DollarSign, Users, ShoppingCart, Eye, Target, Award, Phone, CreditCard, User, TrendingUp, Clock, MapPin, Smartphone, Globe, Monitor, Tablet } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', value: 4000, users: 2400, revenue: 4000 },
    { name: 'Feb', value: 3000, users: 1398, revenue: 3000 },
    { name: 'Mar', value: 2000, users: 9800, revenue: 2000 },
    { name: 'Apr', value: 2780, users: 3908, revenue: 2780 },
    { name: 'May', value: 1890, users: 4800, revenue: 1890 },
    { name: 'Jun', value: 2390, users: 3800, revenue: 2390 },
    { name: 'Jul', value: 3490, users: 4300, revenue: 3490 }
  ];

  const deviceData = [
    // { name: 'Desktop', value: 65 },
    // { name: 'Mobile', value: 30 },
    // { name: 'Tablet', value: 5 }
     { name: 'Active', value: 65, color: '#10b981' },
    { name: 'Pending', value: 30, color: '#f59e0b' },
    { name: 'Inactive', value: 5, color: '#ef4444' }
  ];

  const ageGroupData = [
    { name: '18-24', value: 1250 },
    { name: '25-34', value: 2100 },
    { name: '35-44', value: 1800 },
    { name: '45-54', value: 950 },
    { name: '55+', value: 650 }
  ];

  const trafficSourcesData = [
    { name: 'Organic Search', value: 4820 },
    { name: 'Direct', value: 3240 },
    { name: 'Social Media', value: 1620 },
    { name: 'Referral', value: 1080 }
  ];

  const hourlyTrafficData = [
    { name: '00', value: 120 },
    { name: '02', value: 80 },
    { name: '04', value: 60 },
    { name: '06', value: 150 },
    { name: '08', value: 450 },
    { name: '10', value: 520 },
    { name: '12', value: 500 },
    { name: '14', value: 420 },
    { name: '16', value: 350 },
    { name: '18', value: 280 },
    { name: '20', value: 200 },
    { name: '22', value: 160 }
  ];

  // Table data for top pages
  const topPagesData = [
    { page: '/dashboard', views: '4,500', time: '3:24', bounceRate: '45%' },
    { page: '/products', views: '3,200', time: '2:18', bounceRate: '38%' },
    { page: '/analytics', views: '2,800', time: '4:12', bounceRate: '25%' },
    { page: '/settings', views: '1,900', time: '1:45', bounceRate: '52%' },
    { page: '/profile', views: '1,200', time: '2:33', bounceRate: '41%' }
  ];

  const topPagesColumns = [
    { key: 'page', label: 'Page', sortable: true },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'time', label: 'Avg Time', sortable: true },
    { key: 'bounceRate', label: 'Bounce Rate', sortable: true }
  ];

  // Geographic data for progress cards
  const geographicData = [
    { country: 'United States', users: 1234, percentage: 45 },
    { country: 'United Kingdom', users: 856, percentage: 31 },
    { country: 'Germany', users: 432, percentage: 16 },
    { country: 'France', users: 278, percentage: 10 }
  ];

  // Activity timeline data
  const activityData = [
    {
      id: 1,
      action: 'New user registration spike',
      time: '2 hours ago',
      type: 'info',
      details: '+180 new users in the last hour'
    },
    {
      id: 2,
      action: 'Revenue milestone reached',
      time: '4 hours ago',
      type: 'success',
      details: '$50K monthly revenue achieved'
    },
    {
      id: 3,
      action: 'High bounce rate detected',
      time: '6 hours ago',
      type: 'warning',
      details: 'Landing page bounce rate above 70%'
    },
    {
      id: 4,
      action: 'Server response time improved',
      time: '1 day ago',
      type: 'success',
      details: 'Average response time reduced to 200ms'
    }
  ];

  // Notification data
  const notifications = [
    {
      id: 1,
      title: 'Traffic Alert',
      message: 'Unusual traffic spike detected on /products page',
      time: '5 minutes ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Goal Achievement',
      message: 'Monthly active users goal exceeded by 15%',
      time: '1 hour ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Performance Update',
      message: 'Site speed optimization completed',
      time: '3 hours ago',
      type: 'info'
    }
  ];

  // Reports data
  const reportsData = [
    {
      title: 'Monthly Performance Report',
      description: 'Comprehensive analysis of website performance metrics',
      date: '2024-01-15',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      title: 'User Behavior Analysis',
      description: 'Deep dive into user engagement patterns',
      date: '2024-01-10',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      title: 'Revenue Analytics Report',
      description: 'Financial performance and conversion metrics',
      date: '2024-01-08',
      status: 'pending',
      downloadUrl: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your website performance and user engagement</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {range === '24h' ? 'Last 24 hours' : 
               range === '7d' ? 'Last 7 days' :
               range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['overview', 'traffic', 'audience', 'content', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value="$45,231.89"
                change="+20.1%"
                changeType="positive"
                icon={DollarSign}
              />
              <StatCard
                title="Active Users"
                value="2,350"
                change="+180.1%"
                changeType="positive"
                icon={Users}
              />
              <StatCard
                title="Page Views"
                value="12,234"
                change="-19%"
                changeType="negative"
                icon={Eye}
              />
              <StatCard
                title="Conversion Rate"
                value="3.45%"
                change="+12%"
                changeType="positive"
                icon={Target}
              />
            </div>

            {/* Revenue Trend */}
            <Card title="Revenue & Users Trend" className="p-6">
              <AreaChartComponent
                data={revenueData}
                height={400}
                dataKeys={['revenue', 'users']}
                colors={['#8884d8', '#82ca9d']}
              />
            </Card>

            {/* Device Usage and Geographic Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Device Usage" className="p-6">
                <PieChartComponent
                  data={deviceData}
                  height={300}
                  // colors={['#8884d8', '#82ca9d', '#ffc658']}
                />
              </Card>

              <Card title="Top Geographic Locations" className="p-6">
                <div className="space-y-4">
                  {geographicData.map((location, index) => (
                    <ProgressCard
                      key={index}
                      title={location.country}
                      value={location.users}
                      progress={location.percentage}
                      icon={MapPin}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* Activity Timeline and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Recent Activity" className="p-6">
                <ActivityTimeline activities={activityData} />
              </Card>

              <Card title="Notifications" className="p-6">
                <NotificationPanel notifications={notifications} />
              </Card>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Traffic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Sessions"
                value="24,567"
                change="+12.5%"
                changeType="positive"
                icon={Users}
              />
              <StatCard
                title="Avg Session Duration"
                value="3:24"
                change="+8.2%"
                changeType="positive"
                icon={Clock}
              />
              <StatCard
                title="Bounce Rate"
                value="65.8%"
                change="-5.1%"
                changeType="positive"
                icon={TrendingUp}
              />
            </div>

            {/* Hourly Traffic Pattern */}
            <Card title="24-Hour Traffic Pattern" className="p-6">
              <LineChartComponent
                data={hourlyTrafficData}
                height={400}
                dataKey="value"
                stroke="#8884d8"
              />
            </Card>

            {/* Traffic Sources and Browser Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Traffic Sources" className="p-6">
                <BarChartComponent
                  data={trafficSourcesData}
                  height={300}
                  dataKey="value"
                  fill="#82ca9d"
                />
              </Card>

              <Card title="Browser Distribution" className="p-6">
                <div className="space-y-4">
                  <ProgressCard title="Chrome" value="5,420" progress={68} icon={Globe} />
                  <ProgressCard title="Safari" value="1,890" progress={24} icon={Globe} />
                  <ProgressCard title="Firefox" value="480" progress={6} icon={Globe} />
                  <ProgressCard title="Edge" value="160" progress={2} icon={Globe} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Audience Tab */}
        {activeTab === 'audience' && (
          <div className="space-y-6">
            {/* Audience Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="New Visitors"
                value="65.8%"
                change="+2.1%"
                changeType="positive"
                icon={User}
              />
              <StatCard
                title="Return Visitors"
                value="34.2%"
                change="-2.1%"
                changeType="negative"
                icon={Users}
              />
              <StatCard
                title="Pages/Session"
                value="2.4"
                change="+0.3"
                changeType="positive"
                icon={Eye}
              />
              <StatCard
                title="User Retention"
                value="78.5%"
                change="+5.2%"
                changeType="positive"
                icon={Award}
              />
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Age Distribution" className="p-6">
                <BarChartComponent
                  data={ageGroupData}
                  height={300}
                  dataKey="value"
                  fill="#8884d8"
                />
              </Card>

              <Card title="Device Categories" className="p-6">
                <div className="space-y-4">
                  <ProgressCard title="Desktop" value="3,240" progress={65} icon={Monitor} />
                  <ProgressCard title="Mobile" value="1,890" progress={30} icon={Smartphone} />
                  <ProgressCard title="Tablet" value="180" progress={5} icon={Tablet} />
                </div>
              </Card>
            </div>

            {/* User Engagement Metrics */}
            <Card title="User Engagement Overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">2.4</div>
                  <div className="text-sm text-gray-600">Pages per Session</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">3:24</div>
                  <div className="text-sm text-gray-600">Avg Session Duration</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">65.8%</div>
                  <div className="text-sm text-gray-600">Bounce Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">34.2%</div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Content Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Page Views"
                value="45,678"
                change="+15.3%"
                changeType="positive"
                icon={Eye}
              />
              <StatCard
                title="Avg Time on Page"
                value="2:45"
                change="+8.7%"
                changeType="positive"
                icon={Clock}
              />
              <StatCard
                title="Content Engagement"
                value="78.2%"
                change="+12.1%"
                changeType="positive"
                icon={Target}
              />
            </div>

            {/* Top Pages Table */}
            <Card title="Top Performing Pages" className="p-6">
              <DataTable
                data={topPagesData}
                columns={topPagesColumns}
                itemsPerPage={5}
                searchable={true}
                sortable={true}
              />
            </Card>

            {/* Search Terms and Exit Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Top Search Terms" className="p-6">
                <div className="space-y-3">
                  {[
                    { term: 'dashboard analytics', searches: 1250 },
                    { term: 'user management', searches: 890 },
                    { term: 'data visualization', searches: 670 },
                    { term: 'reporting tools', searches: 450 },
                    { term: 'integration guide', searches: 320 }
                  ].map((term, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{term.term}</span>
                      <span className="text-sm font-bold text-blue-600">{term.searches.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Exit Pages Analysis" className="p-6">
                <div className="space-y-3">
                  {[
                    { page: '/checkout', exits: 1890, rate: 45 },
                    { page: '/contact', exits: 1240, rate: 32 },
                    { page: '/pricing', exits: 890, rate: 28 },
                    { page: '/about', exits: 670, rate: 25 },
                    { page: '/blog', exits: 450, rate: 18 }
                  ].map((page, index) => (
                    <ProgressCard
                      key={index}
                      title={page.page}
                      value={page.exits}
                      progress={page.rate}
                      icon={Eye}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Reports Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Generated Reports"
                value="24"
                change="+3"
                changeType="positive"
                icon={Award}
              />
              <StatCard
                title="Scheduled Reports"
                value="8"
                change="+2"
                changeType="positive"
                icon={Clock}
              />
              <StatCard
                title="Data Points"
                value="1.2M"
                change="+125K"
                changeType="positive"
                icon={Target}
              />
            </div>

            {/* Reports and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportsCard
                title="Analytics Reports"
                reports={reportsData}
                onDownload={(report) => console.log('Download report:', report)}
                onSchedule={() => console.log('Schedule new report')}
              />

              <CalendarWidget
                title="Scheduled Reports"
                events={[
                  { date: '2024-01-20', title: 'Monthly Report', type: 'report' },
                  { date: '2024-01-25', title: 'User Analysis', type: 'analysis' },
                  { date: '2024-01-30', title: 'Revenue Report', type: 'financial' }
                ]}
              />
            </div>

            {/* Chat Component for Report Assistance */}
            <Card title="Report Assistant" className="p-6">
              <ChatComponent
                title="Analytics Assistant"
                placeholder="Ask me about your analytics data or request custom reports..."
                onSendMessage={(message) => console.log('Chat message:', message)}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;