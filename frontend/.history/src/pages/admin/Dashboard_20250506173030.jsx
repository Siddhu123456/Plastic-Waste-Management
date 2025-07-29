import { useState } from 'react';
import { 
  FiHome, 
  FiShoppingBag, 
  FiTruck, 
  FiPackage, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiDollarSign,
  FiTrendingUp,
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const DashboardPage = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'pickups':
        return <Pickups />;
      case 'products':
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
           onClick={toggleSidebar}>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">ShopAdmin</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-md md:hidden">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            <SidebarItem 
              icon={<FiHome className="h-5 w-5" />} 
              title="Dashboard" 
              active={activePage === 'dashboard'} 
              onClick={() => setActivePage('dashboard')} 
            />
            <SidebarItem 
              icon={<FiShoppingBag className="h-5 w-5" />} 
              title="Orders" 
              active={activePage === 'orders'} 
              onClick={() => setActivePage('orders')} 
            />
            <SidebarItem 
              icon={<FiTruck className="h-5 w-5" />} 
              title="Pickups" 
              active={activePage === 'pickups'} 
              onClick={() => setActivePage('pickups')} 
            />
            <SidebarItem 
              icon={<FiPackage className="h-5 w-5" />} 
              title="Products" 
              active={activePage === 'products'} 
              onClick={() => setActivePage('products')} 
            />
            <div className="pt-4 mt-4 border-t">
              <SidebarItem 
                icon={<FiUsers className="h-5 w-5" />} 
                title="Customers" 
                active={false} 
              />
              <SidebarItem 
                icon={<FiSettings className="h-5 w-5" />} 
                title="Settings" 
                active={false} 
              />
              <SidebarItem 
                icon={<FiLogOut className="h-5 w-5" />} 
                title="Logout" 
                active={false} 
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="p-2 rounded-md md:hidden">
                <FiMenu className="h-6 w-6" />
              </button>
              <h2 className="ml-2 text-xl font-semibold text-gray-800 md:ml-0">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiBell className="h-6 w-6" />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              <div className="flex items-center">
                <img src="/api/placeholder/40/40" alt="User Avatar" className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, title, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{title}</span>
    </button>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value="$24,780" 
          change="+12.5%" 
          icon={<FiDollarSign className="h-6 w-6" />} 
          positive 
        />
        <StatCard 
          title="Orders" 
          value="342" 
          change="+8.1%" 
          icon={<FiShoppingCart className="h-6 w-6" />} 
          positive 
        />
        <StatCard 
          title="Pending Pickups" 
          value="28" 
          change="-3.4%" 
          icon={<FiClock className="h-6 w-6" />} 
          positive={false} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.42%" 
          change="+2.3%" 
          icon={<FiTrendingUp className="h-6 w-6" />} 
          positive 
        />
      </div>

      {/* Recent Orders and Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {/* Order Items */}
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <div className="rounded-md bg-gray-100 p-2">
                    <FiPackage className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Order #{10036 + order}</p>
                    <p className="text-sm text-gray-500">May {order + 1}, 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order % 3 === 0 ? 'Processing' : 'Completed'}
                  </span>
                  <span className="ml-4 font-medium">${(Math.random() * 200 + 50).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sales Analytics</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <FiBarChart2 className="h-16 w-16 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Sales chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-blue-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          <ActivityItem 
            icon={<FiShoppingBag className="h-5 w-5" />}
            title="New order received"
            description="Order #10041 from John Doe"
            time="5 minutes ago"
          />
          <ActivityItem 
            icon={<FiCheckCircle className="h-5 w-5" />}
            title="Order completed"
            description="Order #10038 has been delivered"
            time="2 hours ago"
          />
          <ActivityItem 
            icon={<FiTruck className="h-5 w-5" />}
            title="Pickup scheduled"
            description="Order #10039 ready for pickup at 5:00 PM"
            time="3 hours ago"
          />
          <ActivityItem 
            icon={<FiXCircle className="h-5 w-5" />}
            title="Order cancelled"
            description="Order #10036 has been cancelled"
            time="5 hours ago"
          />
        </div>
      </div>
    </div>
  );
};

// Orders Component
const Orders = () => {
  const orders = [
    { id: 10041, customer: 'John Doe', date: 'May 6, 2025', total: '$245.99', status: 'Processing' },
    { id: 10040, customer: 'Jane Smith', date: 'May 5, 2025', total: '$189.50', status: 'Completed' },
    { id: 10039, customer: 'Robert Johnson', date: 'May 5, 2025', total: '$325.75', status: 'Shipped' },
    { id: 10038, customer: 'Emily Davis', date: 'May 4, 2025', total: '$112.30', status: 'Completed' },
    { id: 10037, customer: 'Michael Brown', date: 'May 4, 2025', total: '$89.99', status: 'Processing' },
    { id: 10036, customer: 'Sarah Wilson', date: 'May 3, 2025', total: '$435.00', status: 'Cancelled' },
    { id: 10035, customer: 'David Miller', date: 'May 3, 2025', total: '$178.25', status: 'Completed' },
    { id: 10034, customer: 'Jennifer Taylor', date: 'May 2, 2025', total: '$256.80', status: 'Shipped' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">All Orders</h3>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-64"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white">
                <option>All Statuses</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to 8 of 50 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-50">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md">2</button>
            <button className="px-3 py-1 border rounded-md">3</button>
            <button className="px-3 py-1 border rounded-md">4</button>
            <button className="px-3 py-1 border rounded-md">5</button>
            <button className="px-3 py-1 border rounded-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pickups Component
const Pickups = () => {
  const [expandedId, setExpandedId] = useState(null);
  
  const pickups = [
    { 
      id: 1, 
      orderId: 10039, 
      customer: 'Robert Johnson', 
      date: 'May 6, 2025 - 5:00 PM', 
      status: 'Scheduled',
      items: [
        { name: 'Wireless Headphones', qty: 1, price: '$129.99' },
        { name: 'Power Bank', qty: 1, price: '$45.99' },
      ],
      address: '123 Main St, Anytown, CA 12345',
      notes: 'Customer will pickup after work hours'
    },
    { 
      id: 2, 
      orderId: 10033, 
      customer: 'Alice Thompson', 
      date: 'May 6, 2025 - 2:30 PM', 
      status: 'Ready',
      items: [
        { name: 'Smartwatch', qty: 1, price: '$199.99' },
      ],
      address: '456 Oak Ave, Somecity, CA 54321',
      notes: 'Please have gift wrapping ready'
    },
    { 
      id: 3, 
      orderId: 10031, 
      customer: 'Mark Williams', 
      date: 'May 7, 2025 - 11:00 AM', 
      status: 'Scheduled',
      items: [
        { name: 'Laptop Bag', qty: 1, price: '$79.99' },
        { name: 'USB-C Cable', qty: 2, price: '$29.98' },
        { name: 'Mouse Pad', qty: 1, price: '$15.99' },
      ],
      address: '789 Pine Rd, Othercity, CA 67890',
      notes: ''
    },
    { 
      id: 4, 
      orderId: 10029, 
      customer: 'Susan Martinez', 
      date: 'May 7, 2025 - 1:45 PM', 
      status: 'Processing',
      items: [
        { name: 'Wireless Speaker', qty: 1, price: '$89.99' },
        { name: 'HDMI Cable', qty: 1, price: '$19.99' },
      ],
      address: '321 Maple Dr, Newtown, CA 13579',
      notes: 'Call customer 30 minutes before pickup time'
    },
    { 
      id: 5, 
      orderId: 10025, 
      customer: 'James Wilson', 
      date: 'May 8, 2025 - 10:15 AM', 
      status: 'Processing',
      items: [
        { name: 'Fitness Tracker', qty: 1, price: '$149.99' },
      ],
      address: '654 Cedar Ln, Laketown, CA 24680',
      notes: ''
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Scheduled Pickups</h3>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FiCheckCircle className="mr-2 h-5 w-5" />
            Mark Completed
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiTruck className="mr-2 h-5 w-5" />
            Schedule New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-lg font-semibold">Upcoming Pickups</div>
            <div className="mt-3 sm:mt-0 flex space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search pickups..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-64"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white">
                <option>All Statuses</option>
                <option>Processing</option>
                <option>Ready</option>
                <option>Scheduled</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pickups.map((pickup) => (
            <div key={pickup.id} className="hover:bg-gray-50">
              <div 
                className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between"
                onClick={() => toggleExpand(pickup.id)}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className={`w-3 h-3 rounded-full ${
                      pickup.status === 'Scheduled' ? 'bg-yellow-500' : 
                      pickup.status === 'Ready' ? 'bg-green-500' : 
                      'bg-blue-500'
                    }`}></div>
                  </div>
                  <div>
                    <div className="font-medium">Order #{pickup.orderId} - {pickup.customer}</div>
                    <div className="text-sm text-gray-500">{pickup.date}</div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pickup.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                    pickup.status === 'Ready' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {pickup.status}
                  </span>
                  <button className="ml-4 text-gray-400 hover:text-gray-500">
                    {expandedId === pickup.id ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {expandedId === pickup.id && (
                <div className="px-6 pb-6 pt-2 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Pickup Details</h4>
                        <p><span className="text-gray-500">Address:</span> {pickup.address}</p>
                        <p><span className="text-gray-500">Date & Time:</span> {pickup.date}</p>
                        {pickup.notes && <p><span className="text-gray-500">Notes:</span> {pickup.notes}</p>}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {pickup.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name} × {item.qty}</span>
                              <span>{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-end space-x-3">
                      <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                        Reschedule
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Complete Pickup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 5 of 12 entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md bg-gray-50">Previous</button>
              <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 border rounded-md">2</button>
              <button className="px-3 py-1 border rounded-md">3</button>
              <button className="px-3 py-1 border rounded-md">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Component
const Products = () => {
  const products = [
    { 
      id: 'P001', 
      name: 'Wireless Headphones', 
      category: 'Electronics',
      price: '$129.99',
      stock: 45,
      status: 'Active'
    },
    { 
      id: 'P002', 
      name: 'Power Bank 10000mAh', 
      category: 'Electronics',
      price: '$45.99',
      stock: 78,
      status: 'Active'
    },
    { 
      id: 'P003', 
      name: 'Smartwatch Series X', 
      category: 'Wearables',
      price: '$199.99',
      stock: 23,
      status: 'Active'
    },
    { 
      id: 'P004', 
      name: 'Premium Laptop Bag', 
      category: 'Accessories',
      price: '$79.99',
      stock: 32,
      status: 'Active'
    },
    { 
      id: 'P005', 
      name: 'Bluetooth Speaker', 
      category: 'Electronics',
      price: '$89.99',
      stock: 56,
      status: 'Active'
    },
    { 
      id: 'P006', 
      name: 'USB-C Cable 3-Pack', 
      category: 'Accessories',
      price: '$24.99',
      stock: 120,
      status: 'Active'
    },
    { 
      id: 'P007', 
      name: 'Fitness Tracker Band', 
      category: 'Wearables',
      price: '$149.99',
      stock: 18,
      status: 'Low Stock'
    },
    { 
      id: 'P008', 
      name: 'Wireless Charging Pad', 
      category: 'Electronics',
      price: '$39.99',
      stock: 0,
      status: 'Out of Stock'
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Product Inventory</h3>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPackage className="mr-2 h-5 w-5" />
            Add Product
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiBarChart2 className="mr-2 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Product filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-lg font-semibold">All Products</div>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-64"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Wearables</option>
                <option>Accessories</option>
              </select>
              <select className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                        <FiPackage className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to 8 of 24 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-50">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md">2</button>
            <button className="px-3 py-1 border rounded-md">3</button>
            <button className="px-3 py-1 border rounded-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  )};