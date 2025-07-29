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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PiCoinVertical } from 'react-icons/pi';
  
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};
  const Dashboard = () => {

      const [orders, setOrders] = useState([]);
      const [pickups, setPickups] = useState([]);


      const fetchOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/orders/status/preparing`);
          setOrders(response.data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };

      const fetchPickups = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/pickups/status/pending`);
          setPickups(response.data);
        } catch (error) {
          console.error("Failed to fetch pickups:", error);
        }
      };
    
      useEffect(() => {
          fetchOrders()
          fetchPickups()
      }, [])


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
            value={`${orders.length}`} 
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pending Orders</h3>
              <button className="text-blue-600 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {/* Order Items */}
              {orders.slice(0,5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <div className="rounded-md bg-gray-100 p-2">
                      <FiPackage className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">ORD {order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PiCoinVertical />
                    <span className="ml-1 font-medium">{order.subTotal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pending Pickups</h3>
              <button className="text-blue-600 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {pickups.slice(0,5).map((pickup) => (
                <div key={pickup.id} className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <div className="rounded-md bg-gray-100 p-2">
                      <FiTruck className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">PKP {pickup.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(pickup.requestedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="ml-1 font-medium">{pickup.weight} kg</span>
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