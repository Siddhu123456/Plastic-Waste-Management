import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaSort, FaEye, FaCheck, FaFilter, FaSearch, FaCalendar } from 'react-icons/fa';
import { LuBadge, LuChevronDown, LuFilter, LuSearch, LuX } from 'react-icons/lu';

// Sample data
const sampleOrders = [
  { id: 'ORD-001', customerId: 'CUST-101', date: '2025-05-01', subtotal: 125.99, status: 'preparing' },
  { id: 'ORD-002', customerId: 'CUST-102', date: '2025-05-01', subtotal: 79.50, status: 'shipped' },
  { id: 'ORD-003', customerId: 'CUST-103', date: '2025-05-02', subtotal: 299.99, status: 'out for delivery' },
  { id: 'ORD-004', customerId: 'CUST-104', date: '2025-05-02', subtotal: 149.99, status: 'delivered' },
  { id: 'ORD-005', customerId: 'CUST-105', date: '2025-05-03', subtotal: 85.75, status: 'preparing' },
  { id: 'ORD-006', customerId: 'CUST-106', date: '2025-05-03', subtotal: 235.50, status: 'shipped' },
  { id: 'ORD-007', customerId: 'CUST-107', date: '2025-05-04', subtotal: 55.25, status: 'delivered' },
  { id: 'ORD-008', customerId: 'CUST-108', date: '2025-05-04', subtotal: 310.49, status: 'out for delivery' },
  { id: 'ORD-009', customerId: 'CUST-109', date: '2025-05-04', subtotal: 199.99, status: 'preparing' },
  { id: 'ORD-010', customerId: 'CUST-110', date: '2025-05-05', subtotal: 89.99, status: 'shipped' },
  { id: 'ORD-011', customerId: 'CUST-111', date: '2025-05-05', subtotal: 149.50, status: 'out for delivery' },
  { id: 'ORD-012', customerId: 'CUST-112', date: '2025-05-05', subtotal: 67.25, status: 'delivered' },
  { id: 'ORD-013', customerId: 'CUST-113', date: '2025-05-05', subtotal: 275.00, status: 'preparing' },
  { id: 'ORD-014', customerId: 'CUST-114', date: '2025-04-30', subtotal: 125.75, status: 'shipped' },
  { id: 'ORD-015', customerId: 'CUST-115', date: '2025-04-30', subtotal: 189.99, status: 'out for delivery' },
  { id: 'ORD-016', customerId: 'CUST-116', date: '2025-04-29', subtotal: 210.50, status: 'delivered' },
  { id: 'ORD-017', customerId: 'CUST-117', date: '2025-04-29', subtotal: 99.99, status: 'preparing' },
  { id: 'ORD-018', customerId: 'CUST-118', date: '2025-04-28', subtotal: 155.49, status: 'shipped' },
  { id: 'ORD-019', customerId: 'CUST-119', date: '2025-04-28', subtotal: 78.25, status: 'out for delivery' },
  { id: 'ORD-020', customerId: 'CUST-120', date: '2025-04-27', subtotal: 299.99, status: 'delivered' }
];

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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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


  console.log(orders)
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortConfig.key === 'subtotal') {
      return sortConfig.direction === 'asc' 
        ? a.subtotal - b.subtotal
        : b.subtotal - a.subtotal;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(order => {
    // Status filter
    if (statusFilter && order.status !== statusFilter) return false;
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return order.id.toLowerCase().includes(query) || 
             order.customerId.toLowerCase().includes(query);
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
    // Don't allow selection of delivered items
    if (order.status === 'delivered') return;
    
    const orderId = order.id;
    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleUpdateStatus = () => {
    if (selectedOrders.length === 0) return;
    
    console.log(selectedOrders)
    setOrders(prev => 
      prev.map(order => {
        if (selectedOrders.includes(order.id) && order.status !== 'delivered') {
          return { ...order, status: getNextStatus(order.status) };
        }
        return order;
      })
    );
    
    // Clear selected orders that have been updated to 'delivered'
    setSelectedOrders(prev => {
      const updatedSelectedOrders = [];
      for (const orderId of prev) {
        const order = orders.find(o => o.id === orderId);
        if (order && getNextStatus(order.status) !== 'delivered') {
          updatedSelectedOrders.push(orderId);
        }
      }
      return updatedSelectedOrders;
    });
  };


  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <LuFilter className="h-4 w-4 mr-2 text-gray-500" />
              {statusFilter === '' ? 'all':statusFilter}
            <LuChevronDown className="h-4 w-4 ml-2 text-gray-500" />
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
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
        </div>
      </div>


    
    <div className="flex items-center w-full md:w-96">
      <div className="relative flex-grow">
        <input 
          type="text" 
          placeholder="Search orders..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <LuSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
    </div>
        
      
      {/* Actions */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">{selectedOrders.length} selected</span>
          {selectedOrders.length > 0 && (
            <>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
              <button 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setSelectedOrders([])}
              >
                Clear Selection
              </button>
            </>
          )}
        </div>
        <div className="text-gray-700">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer ID
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date
                <FaSort className="inline ml-1" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('subtotal')}
              >
                Subtotal
                <FaSort className="inline ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.subtotal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewOrder(order);
                    }}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Modal */}
      {viewOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium">Order Details: {viewOrder.id}</h3>
                    <button onClick={() => setViewOrder(null)}>
                      <LuX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{viewOrder.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{viewOrder.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <LuBadge status={viewOrder.status} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-medium">${viewOrder.subtotal}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">Products</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(viewOrder).products.map((product, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{product.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{product.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-700">${product.price.toFixed(2)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-700">${(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 rounded-b-lg">
                    <button 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setViewOrder(null)}
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                      Edit Order
                    </button>
                  </div>
                </div>
              </div>
      )}
    </div>
  );
}