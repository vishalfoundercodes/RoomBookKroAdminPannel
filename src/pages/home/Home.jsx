
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
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


import { DollarSign, Users, ShoppingCart, Eye, Target, Award, Phone, CreditCard, User, CardSim, VideoIcon, PhoneCall } from 'lucide-react';
import { BiMobile, BiMoney, BiMoneyWithdraw } from "react-icons/bi";
import { FcCallTransfer } from "react-icons/fc";
import { fetchUsers } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
const Home = () => {
const dispatch = useDispatch();
    const { data: users, loading: usersLoading } = useSelector(
      (state) => state.users
    );

    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);

      if (usersLoading) {
        return <Loader />;
      }

    // Console outputs
    // useEffect(() => {
    //   if (users.length > 0) {
    //     console.log("✅ Users Data:", users);
    //   }
    // }, [users]);

// Sample data
const salesData = [
  { name: 'Jan', sales: 4000, users: 2400, revenue: 2400 },
  { name: 'Feb', sales: 3000, users: 1398, revenue: 2210 },
  { name: 'Mar', sales: 2000, users: 9800, revenue: 2290 },
  { name: 'Apr', sales: 2780, users: 3908, revenue: 2000 },
  { name: 'May', sales: 1890, users: 4800, revenue: 2181 },
  { name: 'Jun', sales: 2390, users: 3800, revenue: 2500 },
];

const pieData = [
  { name: 'Desktop', value: 45, color: '#8884d8' },
  { name: 'Mobile', value: 35, color: '#82ca9d' },
  { name: 'Tablet', value: 20, color: '#ffc658' },
];

  return (
    <div className="space-y-10 bg-white text-black dark: dark:text-white mb- p-2">
      {/* <h1>home</h1> */}
      {/* <div className="min-h-screen bg-gray-50 p-6"> */}
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value="$54,239"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Users"
          value={users.length}
          change="+5.2%"
          changeType="positive"
          icon={Users}
          color="blue"
          route="/users"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          change="-2.1%"
          changeType="negative"
          icon={ShoppingCart}
          color="purple"
        />
        {/* <StatCard
          title="Page Views"
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={Eye}
          color="orange"
        /> */}
        <StatCard
          title="Total Property"
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={User}
          color="yellow"
        />
        {/* <StatCard
          title="Total Calls"
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={Phone}
          color="red"
        />
        <StatCard
          title="Total Subscription"
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={CreditCard}
          color="blue"
        /> */}
        <StatCard
          title="Total Withdrawal "
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={BiMoney}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChartComponent
          title="Revenue & User Growth"
          data={salesData}
          lines={[
            { dataKey: "revenue", stroke: "#8884d8", name: "Revenue" },
            { dataKey: "users", stroke: "#82ca9d", name: "Users" },
          ]}
        />
        <BarChartComponent
          title="Monthly Sales Comparison"
          data={salesData}
          bars={[
            { dataKey: "sales", fill: "#8884d8", name: "Sales" },
            { dataKey: "revenue", fill: "#82ca9d", name: "Revenue" },
          ]}
        />
      </div>

      {/* Mixed Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AreaChartComponent
            title="Performance Overview"
            data={salesData}
            height={250}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chat Component */}
        {/* <div className="lg:col-span-1">
          <ChatComponent height={350} />
        </div> */}

        {/* Data Table */}
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Orders"
            showSearch={true}
            showFilters={true}
          />
        </div>
        <PieChartComponent
          title="Traffic Sources"
          data={pieData}
          height={300}
        />

        {/* Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline title="Recent Activity" maxItems={8} />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {/* Reports Card */}
        <div className="lg:col-span-1">
          <ReportsCard />
        </div>

        {/* Calendar Widget */}
        {/* <div className="lg:col-span-1">
          <CalendarWidget 
            showMiniCalendar={true}
            showUpcomingEvents={true}
          />
        </div> */}
      </div>

      {/* Progress Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressCard
          title="Monthly Goal"
          current="$25,000"
          targets="$50,000"
          percentage={50}
          color="blue"
          icon={Target}
        />
        <ProgressCard
          title="User Acquisition"
          current="750"
          target="1,000"
          percentage={75}
          color="green"
          icon={Users}
        />
        <ProgressCard
          title="Project Completion"
          current="8"
          target="10"
          percentage={80}
          color="purple"
          icon={Award}
          size="large"
        />
        <ProgressCard
          title="Server Usage"
          current="85GB"
          target="100GB"
          percentage={85}
          color="orange"
        />
      </div>
      {/* Notifications Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationPanel allowDismiss={true} maxItems={4} />

        {/* Additional Custom Card */}
        <Card title="Quick Actions" subtitle="Frequently used actions">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Add User</div>
            </button>
            <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">New Order</div>
            </button>
            <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <Eye className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Analytics</div>
            </button>
            <button className="p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Goals</div>
            </button>
          </div>
        </Card>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;