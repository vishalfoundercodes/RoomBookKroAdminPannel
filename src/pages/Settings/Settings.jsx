import React, { useState } from 'react';
import Card from '../../reusable_components/Card';
import StatCard from '../../reusable_components/StatCard';
import DataTable from '../../reusable_components/DataTable';
import NotificationPanel from '../../reusable_components/NotificationPanel';
import ProgressCard from '../../reusable_components/ProgressCard';

import { 
  User, Bell, Shield, Palette, Globe, Clock, Star, Moon, 
  Sun, Zap, Mail, Phone, Lock, Eye, EyeOff, Save, 
  Upload, Download, Trash2, Edit3, Settings as SettingsIcon,
  Calendar, MapPin, Languages, CreditCard, Smartphone
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsReminders: true,
    pushNotifications: false,
    weeklyReports: true,
    clientMessages: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Pandit Raj Kumar Sharma',
    email: 'raj.astrologer@example.com',
    phone: '+91 98765 43210',
    specialization: 'Vedic Astrology, Numerology',
    experience: '15 years',
    languages: 'Hindi, English, Sanskrit',
    consultationRate: '₹500',
    location: 'Mumbai, Maharashtra'
  });

  // API Keys data for table
  const apiKeysData = [
    { name: 'Payment Gateway', key: 'pk_live_xxxxx...', status: 'Active', created: '2024-01-15' },
    { name: 'SMS Service', key: 'sk_test_yyyyy...', status: 'Active', created: '2024-01-10' },
    { name: 'Email Service', key: 'api_key_zzzzz...', status: 'Inactive', created: '2024-01-05' }
  ];

  const apiKeysColumns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'key', label: 'API Key', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created', label: 'Created', sortable: true }
  ];

  // Notification settings
  const notificationSettings = [
    {
      id: 1,
      title: 'New Booking Alert',
      message: 'Client booked consultation for tomorrow 3:00 PM',
      time: '2 minutes ago',
      type: 'info'
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of ₹1500 received from Priya Sharma',
      time: '15 minutes ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Horoscope calculation engine updated to v2.1',
      time: '1 hour ago',
      type: 'info'
    }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-purple-600" />
            Settings & Configuration
          </h1>
          <p className="text-gray-600 mt-2">Manage your astrologer profile and system preferences</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Profile Completion"
            value="95%"
            change="+5%"
            changeType="positive"
            icon={User}
          />
          <StatCard
            title="Active Integrations"
            value="8"
            change="+2"
            changeType="positive"
            icon={Zap}
          />
          <StatCard
            title="Security Score"
            value="98%"
            change="+1%"
            changeType="positive"
            icon={Shield}
          />
          <StatCard
            title="Storage Used"
            value="2.3 GB"
            change="+0.5 GB"
            changeType="neutral"
            icon={Star}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'integrations', label: 'Integrations', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Personal Information" className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </Card>

              <Card title="Professional Details" className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <textarea
                      value={profileData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <input
                      type="text"
                      value={profileData.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Rate</label>
                    <input
                      type="text"
                      value={profileData.consultationRate}
                      onChange={(e) => handleInputChange('consultationRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Profile Photo & Documents" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-purple-600" />
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Photo
                  </button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Certificates</h4>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Certificate
                  </button>
                  <div className="text-sm text-gray-600">
                    • Astrology_Certificate.pdf
                    • Vedic_Studies_Diploma.pdf
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">ID Verification</h4>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload ID
                  </button>
                  <div className="text-sm text-green-600">
                    ✓ Identity Verified
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors">
                <Save className="h-4 w-4 inline mr-2" />
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Notification Preferences" className="p-6">
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key === 'emailBookings' ? 'Email Booking Notifications' :
                           key === 'smsReminders' ? 'SMS Reminders' :
                           key === 'pushNotifications' ? 'Push Notifications' :
                           key === 'weeklyReports' ? 'Weekly Reports' :
                           'Client Messages'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailBookings' ? 'Get notified when clients book consultations' :
                           key === 'smsReminders' ? 'Receive SMS for upcoming appointments' :
                           key === 'pushNotifications' ? 'Browser push notifications' :
                           key === 'weeklyReports' ? 'Weekly performance summary' :
                           'Notifications for new client messages'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Recent Notifications" className="p-6">
                <NotificationPanel notifications={notificationSettings} />
              </Card>
            </div>

            <Card title="Notification Schedule" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Quiet Hours</h4>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm text-gray-600">From</label>
                      <input type="time" defaultValue="22:00" className="mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">To</label>
                      <input type="time" defaultValue="08:00" className="mt-1 px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Preferred Days</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <button
                        key={day}
                        className="px-3 py-1 text-sm border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Password & Authentication" className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </Card>

              <Card title="Two-Factor Authentication" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-900">2FA Enabled</h4>
                      <p className="text-sm text-green-700">Your account is protected with 2FA</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
                    Regenerate Backup Codes
                  </button>
                  <button className="w-full bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 transition-colors">
                    Disable 2FA
                  </button>
                </div>
              </Card>
            </div>

            <Card title="Login Activity" className="p-6">
              <DataTable
                data={[
                  { device: 'Desktop - Chrome', location: 'Mumbai, India', time: '2024-01-15 10:30 AM', status: 'Active' },
                  { device: 'Mobile - Safari', location: 'Mumbai, India', time: '2024-01-14 06:45 PM', status: 'Logged Out' },
                  { device: 'Desktop - Firefox', location: 'Delhi, India', time: '2024-01-13 02:15 PM', status: 'Logged Out' }
                ]}
                columns={[
                  { key: 'device', label: 'Device & Browser', sortable: true },
                  { key: 'location', label: 'Location', sortable: true },
                  { key: 'time', label: 'Last Active', sortable: true },
                  { key: 'status', label: 'Status', sortable: true }
                ]}
                itemsPerPage={5}
              />
            </Card>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Theme Settings" className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Color Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Purple', color: 'bg-purple-600' },
                        { name: 'Blue', color: 'bg-blue-600' },
                        { name: 'Green', color: 'bg-green-600' },
                        { name: 'Orange', color: 'bg-orange-600' },
                        { name: 'Pink', color: 'bg-pink-600' },
                        { name: 'Indigo', color: 'bg-indigo-600' }
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className={`p-4 rounded-lg border-2 ${
                            theme.name === 'Purple' ? 'border-purple-600' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-8 ${theme.color} rounded mb-2`}></div>
                          <div className="text-sm font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Display Mode</h4>
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md">
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Layout Preferences" className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sidebar Style</h4>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Expanded</option>
                      <option>Collapsed</option>
                      <option>Mini</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Dashboard Density</h4>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Comfortable</option>
                      <option>Compact</option>
                      <option>Spacious</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Font Size</h4>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      defaultValue="14"
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Small</span>
                      <span>Normal</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Astrology Display Settings" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Chart Style</h4>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>North Indian</option>
                    <option>South Indian</option>
                    <option>Western</option>
                    <option>Eastern</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Calendar System</h4>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Gregorian</option>
                    <option>Hindu Lunar</option>
                    <option>Islamic</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Planet Symbols</h4>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Traditional</option>
                    <option>Modern</option>
                    <option>Sanskrit</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">House System</h4>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Placidus</option>
                    <option>Whole Sign</option>
                    <option>Koch</option>
                    <option>Equal</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <Card title="API Keys & Services" className="p-6">
              <DataTable
                data={apiKeysData}
                columns={apiKeysColumns}
                itemsPerPage={5}
                searchable={true}
              />
              <div className="mt-4">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                  Add New API Key
                </button>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Connected Services" className="p-6">
                <div className="space-y-4">
                  {[
                    { name: 'Google Calendar', status: 'Connected', icon: Calendar },
                    { name: 'Zoom Integration', status: 'Connected', icon: Phone },
                    { name: 'Payment Gateway', status: 'Connected', icon: CreditCard },
                    { name: 'SMS Service', status: 'Disconnected', icon: Smartphone }
                  ].map((service, index) => (
                    <ProgressCard
                      key={index}
                      title={service.name}
                      value={service.status}
                      progress={service.status === 'Connected' ? 100 : 0}
                      icon={service.icon}
                    />
                  ))}
                </div>
              </Card>

              <Card title="Webhook Settings" className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://your-site.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
                    <div className="space-y-2">
                      {['Booking Created', 'Payment Received', 'Consultation Completed'].map((event) => (
                        <label key={event} className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
                    Test Webhook
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;