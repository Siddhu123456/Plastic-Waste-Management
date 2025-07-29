import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaSort, FaEye } from 'react-icons/fa';
import { LuBadge, LuChevronDown, LuFilter, LuSearch, LuX } from 'react-icons/lu';


const getNextStatus = (currentStatus) => {
  const statusFlow = {
    'preparing': 'shipped',
    'shipped': 'out for delivery',
    'out for delivery': 'delivered'
  };
  return statusFlow[currentStatus] || currentStatus;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/all`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === 'orderDate') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.orderDate) - new Date(b.orderDate)
        : new Date(b.orderDate) - new Date(a.orderDate);
    } else if (sortConfig.key === 'subTotal') {
      return sortConfig.direction === 'asc' 
        ? a.subTotal - b.subTotal
        : b.subTotal - a.subTotal;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(order => {
    // Status filter
    if (statusFilter && order.status !== statusFilter) return false;
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return String(order.id).toLowerCase().includes(query) || 
             String(order.customer).toLowerCase().includes(query);
    }
    
    return true;
  });

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleRowClick = (order) => {
    if (order.status === 'delivered') return;

    const orderId = order.id;

    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedOrders.length === 0) return;
  
    for (const orderId of selectedOrders) {
      const order = orders.find(o => o.id === orderId);
      if (order && order.status !== 'delivered') {
        const newStatus = getNextStatus(order.status);
  
        try {
          await axios.put(`http://localhost:8080/api/orders/update/${orderId}/status`, {
            status: newStatus
          });
  
          setOrders(prev =>
            prev.map(o =>
              o.id === orderId ? { ...o, status: newStatus } : o
            )
          );
  
        } catch (error) {
          console.error(`Failed to update status for order ${orderId}`, error);
        }
      }
    }
  
    setSelectedOrders([]);
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm mb-6 w-full">
      {/* Header with Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <LuFilter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="capitalize">{statusFilter || 'All'}</span>
            <LuChevronDown className="h-4 w-4 ml-2 text-gray-500" />
          </button>
          
          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button 
                  onClick={() => {setStatusFilter(""); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  All
                </button>
                <button 
                  onClick={() => {setStatusFilter("preparing"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Preparing
                </button>
                <button 
                  onClick={() => {setStatusFilter("shipped"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Shipped
                </button>
                <button 
                  onClick={() => {setStatusFilter("out for delivery"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Out for Delivery
                </button>
                <button 
                  onClick={() => {setStatusFilter("delivered"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Delivered
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-grow w-full sm:w-64 md:w-96">
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <LuSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Actions Bar */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">{selectedOrders.length} selected</span>
          {selectedOrders.length > 0 && (
            <>
              <button 
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
              <button 
                className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-400 transition"
                onClick={() => setSelectedOrders([])}
              >
                Clear
              </button>
            </>
          )}
        </div>
        <div className="text-sm text-gray-700 whitespace-nowrap mt-2 sm:mt-0">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Checkbox Column */}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('orderDate')}
              >
                <div className="flex items-center">
                  Date
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('subTotal')}
              >
                <div className="flex items-center">
                  Total
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-10 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className={`${selectedOrders.includes(order.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} ${order.status === 'delivered' ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => handleRowClick(order)}
              >
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  {order.status !== 'delivered' && (
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(order.id);
                      }}
                    />
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {order.orderDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  ${order.subTotal}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs">
                  <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewOrder(order);
                    }}
                  >
                    <FaEye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Modal */ console.log(viewOrder)}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl mx-auto overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-base sm:text-lg font-medium">Order Details: {viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)}>
                <LuX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-3 sm:p-4 overflow-y-auto max-h-80vh">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Customer</p>
                  <p className="text-sm sm:text-base font-medium">{viewOrder.customer}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Order Date</p>
                  <p className="text-sm sm:text-base font-medium">{viewOrder.orderDate}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${viewOrder.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${viewOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${viewOrder.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' : ''}
                    ${viewOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm sm:text-base font-medium">${viewOrder.subTotal}</p>
                </div>
              </div>
              
              <h4 className="font-medium text-sm sm:text-base mb-2">Products</h4>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewOrder.items && viewOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{item.product.name}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-50 px-3 py-2 flex justify-end gap-2 rounded-b-lg">
              <button 
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
              <button className="px-3 py-1 bg-indigo-600 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white hover:bg-indigo-700">
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}