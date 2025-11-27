// Utility: Group by Month
//./revenueData.jsx
export const getMonthlyRevenue = (revenueList) => {
  const monthly = {};

  revenueList.forEach((item) => {
    const month = new Date(item.checkInDate).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthly[month]) {
      monthly[month] = {
        month,
        finalAmount: 0,
        vendorRevenue: 0,
        commission: 0,
      };
    }

    monthly[month].finalAmount += item.finalAmount || 0;
    monthly[month].vendorRevenue += item.vendorRevenue || 0;
    monthly[month].commission += item.commisionAmount || 0;
  });

  return Object.values(monthly);
};

// Utility: Pie Chart Revenue Split
export const getRevenueSplit = (revenueList) => {
  let totalFinal = 0;
  let totalVendor = 0;
  let totalCommission = 0;

  revenueList.forEach((item) => {
    totalFinal += item.finalAmount || 0;
    totalVendor += item.vendorRevenue || 0;
    totalCommission += item.commisionAmount || 0;
  });

  return [
    { name: "Final Amount", value: totalFinal },
    { name: "Vendor Revenue", value: totalVendor },
    { name: "Commission", value: totalCommission },
  ];
};
