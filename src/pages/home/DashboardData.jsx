// utils/dashboardData.js

// Revenue Data Transformation
export const getRevenueChartData = (revenueList) => {
  // Revenue per month & total users per month
  const data = {};

  revenueList.forEach((item) => {
    const month = new Date(item.checkInDate).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!data[month]) data[month] = { revenue: 0, users: new Set() };
    data[month].revenue += item.finalAmount;
    data[month].users.add(item.userId);
  });

  return Object.keys(data).map((month) => ({
    month,
    revenue: data[month].revenue,
    users: data[month].users.size,
  }));
};

// Property Data Transformation
export const getPropertyChartData = (properties) => {
  const cityCount = {};
  const typeCount = { dormitary: 0, hotel: 0, appartment: 0, pg: 0 };

  properties.forEach((p) => {
    cityCount[p.city] = (cityCount[p.city] || 0) + 1;
    typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  });

  const cityData = Object.keys(cityCount).map((city) => ({
    name: city,
    count: cityCount[city],
  }));
  const typeData = Object.keys(typeCount).map((type) => ({
    name: type,
    count: typeCount[type],
  }));

  return { cityData, typeData };
};

// History Payment-Wise Data
export const getPaymentStatusData = (history) => {
  const {
    completed = [],
    pending = [],
    rejected = [],
  } = history.paymentStatusWise || {};
  return [
    { name: "Completed", value: completed.length },
    { name: "Pending", value: pending.length },
    { name: "Rejected", value: rejected.length },
  ];
};

// History Time-Wise Data
export const getTimeWiseData = (history) => {
  const monthlyBookings = {};

  const allData = [
    ...(history.timeWise?.currentStay || []),
    ...(history.timeWise?.past || []),
    ...(history.timeWise?.upcoming || []),
  ];

  allData.forEach((item) => {
    const month = new Date(item.checkInDate).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
  });

  return Object.keys(monthlyBookings).map((month) => ({
    month,
    bookings: monthlyBookings[month],
  }));
};
