import React, { useState } from 'react';
import Card from '../../reusable_components/Card';
import StatCard from '../../reusable_components/StatCard';
import LineChartComponent from '../../reusable_components/LineChart';
import BarChartComponent from '../../reusable_components/BarChart';
import PieChartComponent from '../../reusable_components/PieChart';
import AreaChartComponent from '../../reusable_components/AreaChart';
import DataTable from '../../reusable_components/DataTable';
import ReportsCard from '../../reusable_components/ReportsCard';
import CalendarWidget from '../../reusable_components/CalendarWidget';
import ProgressCard from '../../reusable_components/ProgressCard';

import { 
  FileText, Download, Calendar, TrendingUp, DollarSign, Users, 
  Star, Clock, Phone, Mail, Eye, Filter, Search, 
  BarChart3, PieChart, Activity, Target, Award, Zap
} from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('all');

  // Revenue data for charts
  const monthlyRevenueData = [
    { name: 'Jan', value: 45000, consultations: 180 },
    { name: 'Feb', value: 52000, consultations: 208 },
    { name: 'Mar', value: 48000, consultations: 192 },
    { name: 'Apr', value: 61000, consultations: 244 },
    { name: 'May', value: 55000, consultations: 220 },
    { name: 'Jun', value: 67000, consultations: 268 }
  ];

  // Consultation types data
  const consultationTypesData = [
    { name: 'Birth Chart Reading', value: 45 },
    { name: 'Career Guidance', value: 25 },
    { name: 'Relationship Advice', value: 20 },
    { name: 'Health Predictions', value: 10 }
  ];

  // Client demographics
  const clientAgeData = [
    { name: '18-25', value: 850 },
    { name: '26-35', value: 1240 },
    { name: '36-45', value: 980 },
    { name: '46-55', value: 620 },
    { name: '56+', value: 310 }
  ];

  // Performance metrics
  const performanceData = [
    { name: 'Week 1', satisfaction: 4.8, bookings: 45, revenue: 11250 },
    { name: 'Week 2', satisfaction: 4.9, bookings: 52, revenue: 13000 },
    { name: 'Week 3', satisfaction: 4.7, bookings: 48, revenue: 12000 },
    { name: 'Week 4', satisfaction: 4.9, bookings: 55, revenue: 13750 }
  ];

  // Reports data
  const availableReports = [
    {
      title: 'Monthly Financial Report',
      description: 'Comprehensive revenue and expense analysis',
      date: '2024-01-31',
      status: 'completed',
      downloadUrl: '#',
      size: '2.4 MB',
      type: 'financial'
    },
    {
      title: 'Client Satisfaction Analysis',
      description: 'Customer feedback and rating trends',
      date: '2024-01-30',
      status: 'completed',
      downloadUrl: '#',
      size: '1.8 MB',
      type: 'satisfaction'
    },
    {
      title: 'Consultation Performance Report',
      description: 'Analysis of consultation types and success rates',
      date: '2024-01-29',
      status: 'pending',
      downloadUrl: '#',
      size: 'N/A',
      type: 'performance'
    },
    {
      title: 'Marketing Campaign Results',
      description: 'ROI and conversion metrics from marketing efforts',
      date: '2024-01-28',
      status: 'completed',
      downloadUrl: '#',
      size: '3.2 MB',
      type: 'marketing'
    }
  ];

  // Client reports table data
  const clientReportsData = [
    { 
      clientName: 'Priya Sharma', 
      consultationType: 'Birth Chart', 
      date: '2024-01-15', 
      duration: '45 mins', 
      fee: '₹1,500',
      rating: '5.0',
      status: 'Completed'
    },
    { 
      clientName: 'Rahul Gupta', 
      consultationType: 'Career Guidance', 
      date: '2024-01-14', 
      duration: '30 mins', 
      fee: '₹1,000',
      rating: '4.8',
      status: 'Completed'
    },
    { 
      clientName: 'Anjali Patel', 
      consultationType: 'Relationship', 
      date: '2024-01-14', 
      duration: '60 mins', 
      fee: '₹2,000',
      rating: '4.9',
      status: 'Completed'
    },
    { 
      clientName: 'Vikram Singh', 
      consultationType: 'Health Prediction', 
      date: '2024-01-13', 
      duration: '45 mins', 
      fee: '₹1,500',
      rating: '4.7',
      status: 'Completed'
    }
  ];

  const clientReportsColumns = [
    { key: 'clientName', label: 'Client Name', sortable: true },
    { key: 'consultationType', label: 'Type', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true },
    { key: 'fee', label: 'Fee', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  // Calendar events for scheduled reports
  const scheduledReports = [
    { date: '2024-02-01', title: 'Monthly Revenue Report', type: 'financial' },
    { date: '2024-02-07', title: 'Weekly Performance', type: 'performance' },
    { date: '2024-02-14', title: 'Client Feedback Summary', type: 'satisfaction' },
    { date: '2024-02-28', title: 'Quarterly Business Review', type: 'comprehensive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 h-8 w-8 text-blue-600" />
            Reports 
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your astrology practice</p>
        </div>

        {/* Quick Actions & Filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {range === '7d' ? 'Last 7 days' : 
                 range === '30d' ? 'Last 30 days' :
                 range === '90d' ? 'Last 90 days' : 'Last Year'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="₹3,28,000"
            change="+18.2%"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Total Consultations"
            value="1,312"
            change="+24.1%"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Avg Rating"
            value="4.8/5"
            change="+0.2"
            changeType="positive"
            icon={Star}
          />
          <StatCard
            title="Client Retention"
            value="78.5%"
            change="+5.3%"
            changeType="positive"
            icon={Award}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'financial', label: 'Financial', icon: DollarSign },
              { id: 'consultations', label: 'Consultations', icon: Phone },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'scheduled', label: 'Scheduled', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
            {/* Revenue and Consultations Trend */}
            <Card title="Revenue & Consultations Trend" className="p-6">
              <AreaChartComponent
                data={monthlyRevenueData}
                height={400}
                dataKeys={['value', 'consultations']}
                colors={['#3b82f6', '#10b981']}
              />
            </Card>

            {/* Consultation Types and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Consultation Distribution" className="p-6">
                <PieChartComponent
                  data={consultationTypesData}
                  height={300}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
                />
              </Card>

              <Card title="Weekly Performance" className="p-6">
                <LineChartComponent
                  data={performanceData}
                  height={300}
                  dataKey="satisfaction"
                  stroke="#3b82f6"
                />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600">Avg Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">200</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">₹50K</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProgressCard 
                title="Goal Achievement" 
                value="₹3.2L / ₹4L" 
                progress={80} 
                icon={Target}
              />
              <ProgressCard 
                title="Client Satisfaction" 
                value="4.8 / 5.0" 
                progress={96} 
                icon={Star}
              />
              <ProgressCard 
                title="Repeat Clients" 
                value="312 / 400" 
                progress={78} 
                icon={Users}
              />
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Monthly Revenue"
                value="₹67,000"
                change="+22.1%"
                changeType="positive"
                icon={DollarSign}
              />
              <StatCard
                title="Average Per Session"
                value="₹1,340"
                change="+8.5%"
                changeType="positive"
                icon={TrendingUp}
              />
              <StatCard
                title="Pending Payments"
                value="₹12,500"
                change="-15.2%"
                changeType="positive"
                icon={Clock}
              />
            </div>

            {/* Revenue Breakdown */}
            <Card title="Revenue Analysis" className="p-6">
              <BarChartComponent
                data={[
                  { name: 'Birth Chart', value: 125000 },
                  { name: 'Career Guidance', value: 89000 },
                  { name: 'Relationship', value: 67000 },
                  { name: 'Health Predictions', value: 47000 }
                ]}
                height={300}
                dataKey="value"
                fill="#3b82f6"
              />
            </Card>

            {/* Payment Methods and Financial Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Payment Methods" className="p-6">
                <div className="space-y-4">
                  <ProgressCard title="Online Payments" value="₹54,200" progress={81} icon={DollarSign} />
                  <ProgressCard title="Cash Payments" value="₹8,900" progress={13} icon={DollarSign} />
                  <ProgressCard title="Bank Transfer" value="₹3,900" progress={6} icon={DollarSign} />
                </div>
              </Card>

              <Card title="Financial Health" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue Growth</span>
                    <span className="text-green-600 font-medium">+18.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profit Margin</span>
                    <span className="text-blue-600 font-medium">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Collection Rate</span>
                    <span className="text-green-600 font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Deal Size</span>
                    <span className="text-blue-600 font-medium">₹1,340</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {/* Consultation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Sessions"
                value="1,312"
                change="+156"
                changeType="positive"
                icon={Phone}
              />
              <StatCard
                title="Avg Duration"
                value="42 min"
                change="+5 min"
                changeType="positive"
                icon={Clock}
              />
              <StatCard
                title="Completion Rate"
                value="96.8%"
                change="+1.2%"
                changeType="positive"
                icon={Activity}
              />
              <StatCard
                title="Rescheduled"
                value="3.2%"
                change="-0.8%"
                changeType="positive"
                icon={Calendar}
              />
            </div>

            {/* Consultation Types Analysis */}
            <Card title="Consultation Types Performance" className="p-6">
              <AreaChartComponent
                data={[
                  { name: 'Week 1', birthChart: 45, career: 32, relationship: 28, health: 15 },
                  { name: 'Week 2', birthChart: 52, career: 38, relationship: 31, health: 18 },
                  { name: 'Week 3', birthChart: 48, career: 35, relationship: 29, health: 16 },
                  { name: 'Week 4', birthChart: 55, career: 41, relationship: 34, health: 20 }
                ]}
                height={300}
                dataKeys={['birthChart', 'career', 'relationship', 'health']}
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
              />
            </Card>

            {/* Peak Hours and Success Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Peak Consultation Hours" className="p-6">
                <LineChartComponent
                  data={[
                    { name: '9 AM', value: 12 },
                    { name: '11 AM', value: 18 },
                    { name: '1 PM', value: 15 },
                    { name: '3 PM', value: 25 },
                    { name: '5 PM', value: 22 },
                    { name: '7 PM', value: 28 },
                    { name: '9 PM', value: 20 }
                  ]}
                  height={250}
                  dataKey="value"
                  stroke="#10b981"
                />
              </Card>

              <Card title="Success Metrics" className="p-6">
                <div className="space-y-4">
                  <ProgressCard title="Client Satisfaction" value="4.8/5" progress={96} icon={Star} />
                  <ProgressCard title="Follow-up Rate" value="67%" progress={67} icon={Phone} />
                  <ProgressCard title="Referral Rate" value="34%" progress={34} icon={Users} />
                  <ProgressCard title="Repeat Bookings" value="78%" progress={78} icon={Calendar} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Client Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Client Age Distribution" className="p-6">
                <BarChartComponent
                  data={clientAgeData}
                  height={300}
                  dataKey="value"
                  fill="#6366f1"
                />
              </Card>

              <Card title="Client Location Distribution" className="p-6">
                <div className="space-y-4">
                  <ProgressCard title="Mumbai" value="1,245" progress={35} icon={Users} />
                  <ProgressCard title="Delhi" value="890" progress={25} icon={Users} />
                  <ProgressCard title="Bangalore" value="712" progress={20} icon={Users} />
                  <ProgressCard title="Pune" value="534" progress={15} icon={Users} />
                  <ProgressCard title="Others" value="178" progress={5} icon={Users} />
                </div>
              </Card>
            </div>

            {/* Detailed Client Reports Table */}
            <Card title="Recent Consultations" className="p-6">
              <DataTable
                data={clientReportsData}
                columns={clientReportsColumns}
                itemsPerPage={10}
                searchable={true}
                sortable={true}
              />
            </Card>

            {/* Client Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="New vs Returning" className="p-6">
                <PieChartComponent
                  data={[
                    { name: 'Returning Clients', value: 78 },
                    { name: 'New Clients', value: 22 }
                  ]}
                  height={200}
                  colors={['#3b82f6', '#10b981']}
                />
              </Card>

              <Card title="Client Lifetime Value" className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">₹4,250</div>
                  <div className="text-sm text-gray-600 mb-4">Average CLV</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Top 10%</span>
                      <span>₹12,500+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average</span>
                      <span>₹4,250</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>New Clients</span>
                      <span>₹1,200</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Client Satisfaction Trend" className="p-6">
                <LineChartComponent
                  data={[
                    { name: 'Jan', value: 4.6 },
                    { name: 'Feb', value: 4.7 },
                    { name: 'Mar', value: 4.8 },
                    { name: 'Apr', value: 4.9 },
                    { name: 'May', value: 4.8 },
                    { name: 'Jun', value: 4.9 }
                  ]}
                  height={200}
                  dataKey="value"
                  stroke="#f59e0b"
                />
              </Card>
            </div>
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Reports */}
              <ReportsCard
                title="Available Reports"
                reports={availableReports}
                onDownload={(report) => console.log('Download report:', report)}
                onSchedule={() => console.log('Schedule new report')}
              />

              {/* Scheduled Reports Calendar */}
              <CalendarWidget
                title="Scheduled Reports"
                events={scheduledReports}
              />
            </div>

            {/* Report Templates */}
            <Card title="Report Templates" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Daily Summary', desc: 'Quick daily overview', icon: Activity },
                  { name: 'Weekly Performance', desc: 'Detailed weekly analysis', icon: BarChart3 },
                  { name: 'Monthly Financial', desc: 'Complete financial report', icon: DollarSign },
                  { name: 'Client Feedback', desc: 'Satisfaction analysis', icon: Star },
                  { name: 'Marketing ROI', desc: 'Campaign performance', icon: TrendingUp },
                  { name: 'Custom Report', desc: 'Build your own report', icon: Zap }
                ].map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                      <div className="flex items-center mb-2">
                        <Icon className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{template.desc}</p>
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                        Create Report →
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;