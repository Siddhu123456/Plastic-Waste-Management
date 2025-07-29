import {
    FiClock,
    FiBarChart2,
    FiPackage,
    FiShoppingBag,
    FiCheckCircle,
    FiTruck,
    FiXCircle,
    FiUsers
  } from 'react-icons/fi';
  
  import StatCard from '../../components/StatCard';
  import ActivityItem from '../../components/ActivityItem';
  
  const Dashboard = () => {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Orders" 
            value="$24,780" 
            icon={<FiPackage className="h-6 w-6" />} 
          />
          <StatCard 
            title="Pending Orders" 
            value="342" 
            icon={<FiClock className="h-6 w-6" />} 
          />
          <StatCard 
            title="Pending Pickups" 
            value="28" 
            icon={<FiTruck className="h-6 w-6" />} 
          />
          <StatCard 
            title="Customers" 
            value="3.42%" 
            icon={<FiUsers className="h-6 w-6" />} 
          />
        </div>
  
        {/* Recent Orders */}
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
                      <p className="font-medium">Ord #{10036 + order}</p>
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
        </div>

      </div>
    );
  };
  
  export default Dashboard;