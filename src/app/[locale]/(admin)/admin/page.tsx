import DataCards from "@/components/blocks/data-cards";
// import DataCharts from "@/components/blocks/data-charts";
import Header from "@/components/blocks/header";
import { getOrderCountByDate, getPaidOrdersTotal } from "@/models/order";
import { getUserCountByDate, getUsersTotal } from "@/models/user";
import { getFeedbacksTotal } from "@/models/feedback";
import { getPostsTotal } from "@/models/post";
import { DataCard } from "@/types/blocks/base";

export default async function () {
  let totalPaidOrders = 0;
  let totalUsers = 0;
  let totalFeedbacks = 0;
  let totalPosts = 0;
  let orders: Map<string, number> | undefined;
  let users: Map<string, number> | undefined;

  try {
    // Fetch all data with error handling
    const [paidOrdersResult, usersResult, feedbacksResult, postsResult] = await Promise.allSettled([
      getPaidOrdersTotal(),
      getUsersTotal(),
      getFeedbacksTotal(),
      getPostsTotal(),
    ]);

    totalPaidOrders = paidOrdersResult.status === 'fulfilled' ? (paidOrdersResult.value || 0) : 0;
    totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value || 0) : 0;
    totalFeedbacks = feedbacksResult.status === 'fulfilled' ? (feedbacksResult.value || 0) : 0;
    totalPosts = postsResult.status === 'fulfilled' ? (postsResult.value || 0) : 0;

    // Get data for the last 90 days with error handling
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 90);
    
    const [ordersResult, usersDateResult] = await Promise.allSettled([
      getOrderCountByDate(startTime.toISOString(), "paid"),
      getUserCountByDate(startTime.toISOString()),
    ]);

    orders = ordersResult.status === 'fulfilled' ? ordersResult.value : undefined;
    users = usersDateResult.status === 'fulfilled' ? usersDateResult.value : undefined;

  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    // Continue with default values
  }

  const dataCards: DataCard[] = [
    {
      title: "Total Users",
      label: "",
      value: totalUsers.toString(),
      description: "Total users registered in the system",
    },
    {
      title: "Paid Orders",
      label: "",
      value: totalPaidOrders.toString(),
      description: "User Paid Orders in total",
    },
    {
      title: "System Posts",
      label: "",
      value: totalPosts.toString(),
      description: "Posts in total",
    },
    {
      title: "User Feedbacks",
      label: "",
      value: totalFeedbacks.toString(),
      description: "Feedbacks in total",
    },
  ];

  // Merge the data into a single array
  const allDates = new Set([
    ...(orders ? Array.from(orders.keys()) : []),
    ...(users ? Array.from(users.keys()) : []),
  ]);

  const data = Array.from(allDates)
    .sort()
    .map((date) => ({
      date,
      users: users?.get(date) || 0,
      orders: orders?.get(date) || 0,
    }));

  const fields = [
    { key: "users", label: "Users", color: "var(--primary)" },
    { key: "orders", label: "Orders", color: "var(--secondary)" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Header header={{ disabled: true }} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataCards dataCards={dataCards} />
            {/* <div className="px-4 lg:px-6">
              <DataCharts
                data={data}
                fields={fields}
                title="Users and Orders Overview"
                description="Daily users and orders data"
                defaultTimeRange="90d"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
