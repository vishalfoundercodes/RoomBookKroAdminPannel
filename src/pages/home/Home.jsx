
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
import { fetchProperty } from '../../redux/slices/propertySlice';

import { DollarSign, Users, ShoppingCart, Eye, Target, Award, Phone, CreditCard, User, CardSim, VideoIcon, PhoneCall, Store, ShieldAlert, ShieldCheck, UserMinus, UserCheck, UserRound, Building, Building2, Hotel, UserX, Wallet, Coins, AlertCircle, CheckCircle, XCircle, Clock, Calendar, CalendarDays, IndianRupee, History } from 'lucide-react';
import { BiMobile, BiMoney, BiMoneyWithdraw } from "react-icons/bi";
import { FcCallTransfer } from "react-icons/fc";
import { fetchUsers } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import Loader from "../Loader/Loader";
import { fetchOrderHistory } from "../../redux/slices/historySlice";
import { SiAutoprefixer } from "react-icons/si";
import { fetchRevenue } from "../../redux/slices/revenueSlice";
import RevenuePie from "../Revenue/RevenuePiChart";
import RevenueChart from "../Revenue/RevenueChart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  getRevenueChartData,
  getPropertyChartData,
  getPaymentStatusData,
  getTimeWiseData,
} from "./DashboardData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Home = () => {
  
  const dispatch = useDispatch();
  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.users
  );
  const { data: properties } = useSelector((state) => state.property);
  const {
    loading,
    historyData: historyDataa,
    error,
  } = useSelector((state) => state.history);

  const {
    revenueList,
    totalCommission,
    revenueCount,
    loading: revnueLoading,
  } = useSelector((state) => state.revenue);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrderHistory({ userId: "all" }));
    dispatch(fetchProperty());
    dispatch(fetchRevenue());
  }, [dispatch]);

  useEffect(() => {
    fetchRevenue();
  }, []);
  // console.log("properties home page",properties.length);
  // console.log("historyData home page :", historyDataa ?? "No data yet");

  // console.log("timeWise home page :",historyDataa?.timeWise);
  // console.log("timeWise home page :",historyDataa?.timeWise?.canceled.length);
  // console.log("currentStay home page :",historyDataa?.timeWise?.currentStay?.length);
  // console.log("past home page :",historyDataa?.timeWise?.past.length);
  // console.log("upcoming home page :",historyDataa?.timeWise?.upcoming.length);

  const booking = historyDataa?.timeWise;

  const totalorder =
    booking?.canceled.length +
    booking?.currentStay?.length +
    booking?.past?.length +
    booking?.upcoming?.length;
  // const totalorder = booking?.canceled.length + booking?.currentStay.length;
  // console.log("totalorder",totalorder);

  // Statistics calculations
  const totalUsers = users.filter(
    (u) => u.user_type == "1" || u.user_type == "2"
  ).length;
  const activeUsers = users.filter(
    (u) => u.user_type == "2" && u.userStatus == "1"
  ).length;
  const pendingUsers = users.filter((u) => u.userStatus === "Pending").length;
  const inactiveUsers = users.filter(
    (u) => u.user_type == "2" && u.userStatus == "0"
  ).length;
  const veryfiedVendor = users.filter(
    (u) => u.user_type === "1" && u.isVerified == "1"
  ).length;

  const notVeryfiedVendor = users.filter(
    (u) => u.user_type === "1" && u.isVerified == "0"
  ).length;
  const totalCustomer = users.filter((u) => u.user_type === "2").length;
  const totalVendor = users.filter((u) => u.user_type === "1").length;
  const activeVendor = users.filter(
    (u) => u.user_type == "1" && u.userStatus == "1"
  ).length;
  const inActiveVendor = users.filter(
    (u) => u.user_type == "1" && u.userStatus == "0"
  ).length;

  //   const totalProperty = properties?.length || 0;
  const activeProperty =
    properties?.filter((u) => u.isAvailable === true).length || 0;
  const inactiveProperty =
    properties?.filter((u) => u.isAvailable === false).length || 0;
  const verifyPropertyCount =
    properties?.filter((u) => u.verifyProperty === true).length || 0;
  const notVerifyPropertyCount =
    properties?.filter((u) => u.verifyProperty === false).length || 0;
  const pgCount = properties?.filter((u) => u.type === "pg").length || 0;
  const hotelCount =
    properties?.filter((u) => u.type == "hotel" || u.type == "Hotel").length ||
    0;
  const AppartmentCount =
    properties?.filter((u) => u.type == "appartment").length || 0;
  const dormitaryCount =
    properties?.filter((u) => u.type == "dormitary").length || 0;

  // Sample data
  const salesData = [
    { name: "Jan", sales: 4000, users: 2400, revenue: 2400 },
    { name: "Feb", sales: 3000, users: 1398, revenue: 2210 },
    { name: "Mar", sales: 2000, users: 9800, revenue: 2290 },
    { name: "Apr", sales: 2780, users: 3908, revenue: 2000 },
    { name: "May", sales: 1890, users: 4800, revenue: 2181 },
    { name: "Jun", sales: 2390, users: 3800, revenue: 2500 },
  ];

  const pieData = [
    { name: "Desktop", value: 45, color: "#8884d8" },
    { name: "Mobile", value: 35, color: "#82ca9d" },
    { name: "Tablet", value: 20, color: "#ffc658" },
  ];

  const totalVendorRevenue = revenueList.reduce(
    (total, item) => total + (item.vendorRevenue || 0),
    0
  );

  const totalFinalAmount = revenueList.reduce(
    (total, item) => total + (item.finalAmount || 0),
    0
  );

  // Already extracted data
  const propertyData = properties; // your properties array
  const revenueData = revenueList; // your revenue array
  const paymentHistory = historyDataa; // from fetchOrderHistory
  const timeHistory = historyDataa; // same as above
  

  // Chart data
  const revenueChartData = useMemo(
    () => getRevenueChartData(revenueData || []),
    [revenueData]
  );
  const { cityData } = useMemo(
    () => getPropertyChartData(propertyData || []),
    [propertyData]
  );
  const paymentStatusData = useMemo(
    () => getPaymentStatusData(paymentHistory || {}),
    [paymentHistory]
  );
  const timeWiseData = useMemo(
    () => getTimeWiseData(timeHistory || {}),
    [timeHistory]
  );

  const normalize = (val) => (val || "").trim().toLowerCase();

  const typeData = [
    {
      name: "PG",
      count: properties?.filter((u) => normalize(u.type) === "pg").length || 0,
    },
    {
      name: "Hotel",
      count:
        properties?.filter((u) => normalize(u.type) === "hotel").length || 0,
    },
    {
      name: "Apartment",
      count:
        properties?.filter((u) => normalize(u.type) === "appartment").length ||
        0,
    },
    {
      name: "Dormitory",
      count:
        properties?.filter((u) => normalize(u.type) === "dormitary").length ||
        0,
    },
  ];



  if (usersLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-10 bg-white text-black dark: dark:text-white mb- p-2 mt-4 rounded-[15px]">
      {/* <h1>home</h1> */}
      {/* <div className="min-h-screen bg-gray-50 p-6"> */}
      {/* Header */}
      <div className="mb-8 p-2">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-2">
        <StatCard
          title="Total Revenue"
          value={totalCommission.toString()}
          change="+12.5%"
          changeType="positive"
          icon={IndianRupee}
          color="green"
          route="/revenue"
        />
        <StatCard
          title="Total Vendor Revenue"
          value={totalVendorRevenue.toString()}
          change="Growing steadily this month"
          changeType="positive"
          icon={Coins}
          color="green"
          route="/revenue"
        />

        <StatCard
          title="Total Booking Amount"
          value={totalFinalAmount.toString()}
          change="Increase compared to last month"
          changeType="positive"
          icon={CreditCard}
          color="green"
          route="/revenue"
        />

        <StatCard
          title="Total Users"
          value={totalUsers.toString()}
          change="+12 this month"
          changeType="positive"
          icon={Users}
          color="blue"
          route="/users"
        />
        {/* Total Customers */}
        <StatCard
          title="Total Customers"
          value={totalCustomer.toString()}
          change="Customer base growing steadily"
          changeType="positive"
          icon={UserRound}
          color="green"
          route="/users"
        />

        {/* Active Customers */}
        <StatCard
          title="Active Customers"
          value={activeUsers.toString()}
          change={`${((activeUsers / totalUsers) * 100).toFixed(
            1
          )}% active users`}
          changeType="positive"
          icon={UserCheck}
          color="green"
          route="/users"
        />

        {/* Inactive Customers */}
        <StatCard
          title="Inactive Customers"
          value={inactiveUsers.toString()}
          change="Re-engagement recommended"
          changeType="negative"
          icon={UserMinus}
          color="red"
          route="/users"
        />

        {/* Total Vendors */}
        <StatCard
          title="Total Vendors"
          value={totalVendor.toString()}
          change="Vendor network expanding"
          changeType="positive"
          icon={Store}
          color="purple"
          route="/users"
        />

        {/* Verified Vendors */}
        <StatCard
          title="Verified Vendors"
          value={veryfiedVendor.toString()}
          change="Trusted & verified vendors"
          changeType="positive"
          icon={ShieldCheck}
          color="green"
          route="/vendor"
        />

        {/* Unverified Vendors */}
        <StatCard
          title="Unverified Vendors"
          value={notVeryfiedVendor.toString()}
          change="Verification required"
          changeType="negative"
          icon={ShieldAlert}
          color="red"
          route="/vendor"
        />

        {/* Active Vendors */}
        <StatCard
          title="Active Vendors"
          value={activeVendor.toString()}
          change="Vendors actively serving"
          changeType="positive"
          icon={Store}
          color="green"
          route="/vendor"
        />

        {/* Inactive Vendors */}
        <StatCard
          title="Inactive Vendors"
          value={inActiveVendor.toString()}
          change="Vendor not active currently"
          changeType="negative"
          icon={SiAutoprefixer}
          color="red"
          route="/vendor"
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
          value={properties.length}
          change="+8.7%"
          changeType="positive"
          icon={User}
          color="yellow"
          route="/property"
        />
        {/* <StatCard
                  title="Total Property"
                  value={totalProperty.toString()}
                  change="+12 this month"
                  changeType="positive"
                  icon={Home}
                  color="blue"
                /> */}

        <StatCard
          title="Available Property"
          value={activeProperty.toString()}
          change={`12% available`}
          changeType="positive"
          icon={UserCheck}
          color="green"
          route="/property"
        />

        <StatCard
          title="Not Available Property"
          value={inactiveProperty.toString()}
          change="Unavailable currently"
          changeType="negative"
          icon={UserX}
          color="red"
          route="/property"
        />

        <StatCard
          title="Not Verified Property"
          value={notVerifyPropertyCount.toString()}
          change="Verification pending"
          changeType="warning"
          icon={ShieldCheck}
          color="yellow"
          route="/property"
        />

        <StatCard
          title="Verified Property"
          value={verifyPropertyCount.toString()}
          change="Verified successfully"
          changeType="positive"
          icon={ShieldCheck}
          color="green"
          route="/property"
        />

        <StatCard
          title="Hotel Property"
          value={hotelCount.toString()}
          change="Hotel listings"
          changeType="neutral"
          icon={Hotel}
          color="purple"
          route="/property"
        />

        <StatCard
          title="PG Property"
          value={pgCount.toString()}
          change="PG listings"
          changeType="neutral"
          icon={Building2}
          color="indigo"
          route="/property"
        />

        <StatCard
          title="Apartment Property"
          value={AppartmentCount.toString()}
          change="Apartment listings"
          changeType="neutral"
          icon={Building}
          color="cyan"
          route="/property"
        />

        <StatCard
          title="Dormitory Property"
          value={dormitaryCount.toString()}
          change="Dorm listings"
          changeType="neutral"
          icon={Users}
          color="teal"
          route="/property"
        />
        <StatCard
          title="Total Bookings"
          value={totalorder}
          change="2.1%"
          changeType="positive"
          icon={ShoppingCart}
          color="purple"
          route="/history"
        />
        {/* <StatCard
          title="Total Payments"
          value={totalPayments.toString()}
          change=""
          icon={Wallet}
          color="yellow"
        />
        <StatCard
          title="Total Booking"
          value={totalBookings.toString()}
          change=""
          icon={CalendarDays}
          color="yellow"
        /> */}

        {/* Time Wise */}
        <StatCard
          title="Current Stay"
          value={historyDataa?.timeWise?.currentStay?.length || 0}
          change="Guests staying now"
          changeType="neutral"
          icon={Clock}
          color="blue"
          route="/history"
        />

        <StatCard
          title="Upcoming Bookings"
          value={historyDataa?.timeWise?.upcoming?.length || 0}
          change="Scheduled reservations"
          changeType="positive"
          icon={Calendar}
          color="purple"
          route="/history"
        />

        <StatCard
          title="Past Bookings"
          value={historyDataa?.timeWise?.past?.length || 0}
          change="Completed stays"
          changeType="neutral"
          icon={History}
          color="indigo"
          route="/history"
        />

        <StatCard
          title="Cancelled Bookings"
          value={historyDataa?.timeWise?.cancelled?.length || 0}
          change="Cancelled by user/vendor"
          changeType="negative"
          icon={XCircle}
          color="orange"
        />

        <StatCard
          title="Pending Payments"
          value={historyDataa?.paymentStatusWise?.pending?.length || 0}
          change="Awaiting confirmation"
          changeType="neutral"
          icon={AlertCircle}
          color="yellow"
          route="/history"
        />

        <StatCard
          title="Completed Payments"
          value={historyDataa?.paymentStatusWise?.completed?.length || 0}
          change="Successfully processed"
          changeType="positive"
          icon={CheckCircle}
          color="green"
          route="/history"
        />
        <StatCard
          title="Rejected Payments"
          value={historyDataa?.paymentStatusWise?.rejected?.length || 0}
          change="Failed or declined"
          changeType="negative"
          icon={XCircle}
          color="red"
          route="/history"
        />

        {/* <StatCard
          title="Total Withdrawal "
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={BiMoney}
          color="red"
        /> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border">
          <RevenueChart revenueList={revenueList} />
        </div>

        {/* Revenue Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border">
          <RevenuePie revenueList={revenueList} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Property Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Payment Status</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={paymentStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend Below Pie */}
            <div className="flex justify-center gap-6 mt-4">
              {paymentStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {/* Color Dot */}
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>

                  {/* Text + Values */}
                  <span className="text-sm text-gray-700 font-medium">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Properties by Type</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip />

                <Pie
                  data={typeData}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend Numbers Below */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {typeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}:</span>
                  <span className="text-sm">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status History */}

        {/* Time-Wise History */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Bookings Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeWiseData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* </div> */}
    </div>
  );
};

export default Home;