import { PiCalendarCheck, PiCaretDoubleRight, PiCoinVerticalDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

// Mock data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-04-20",
    total: 129,
    status: "shipped",
    items: ["Premium Headphones", "USB-C Cable"],
  },
  {
    id: "ORD-002",
    date: "2025-04-15",
    total: 80,
    status: "preparing",
    items: ["Wireless Mouse"],
  },
  {
    id: "ORD-003",
    date: "2025-04-10",
    total: 299,
    status: "out for delivery",
    items: ["Mechanical Keyboard", "Mouse Pad", "Wrist Rest"],
  },
];

// Utility function
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const OrderHistory = () => {

  const getStatusColor = (status) => {
    switch (status) {
      case "shipped":
        return "text-purple-500"
      case "delivered":
        return "text-lgg";
      case "preparing":
        return "text-blue-500";
      case "out for delivery":
        return "text-orange-500";
      default:
        return "bg-neutral-500";
    }
  };

  return (
      <div className="mx-auto px-4 max-w-4xl  text-tc dark:text-ow">
        <div className="flex items-center gap-3 mb-4 mt-4">
          <PiCalendarCheck size={28} className="text-lgg" />
          <h1 className="text-2xl font-semibold">Order History</h1>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-dtc p-6 rounded-md border border-neutral-200 dark:border-neutral-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.id}</p>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(order.date)}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {order.items.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold flex items-center  justify-center text-lg"><PiCoinVerticalDuotone/>{order.total}</p>
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center text-lgd dark:text-lgg hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default OrderHistory;
