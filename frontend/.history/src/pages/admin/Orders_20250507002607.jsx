useEffect(() => {
  // Reset to first page when filters change
  setCurrentPage(1);
}, [statusFilter, searchQuery, startDate, endDate]);  const resetFilters = () => {
  setStatusFilter('');
  setSearchQuery('');
  setStartDate('');
  setEndDate('');
  setCurrentPage(1); // Reset to first page when filters change
};import { useState, useEffect } from 'react';
import { FaSort, FaEye, FaCheck, FaFilter, FaSearch, FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
const [viewedOrder, setViewedOrder] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(5);

useEffect(() => {
  setOrders(sampleOrders);
}, []);

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
  
  // Date range filter
  if (startDate && order.date < startDate) return false;
  if (endDate && order.date > endDate) return false;
  
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

// Get paginated data
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

return (
  <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders Management</h1>
    
    {/* Filters */}
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <FaFilter className="text-gray-500 mr-2" />
          <select 
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="preparing">Preparing</option>
            <option value="shipped">Shipped</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <FaCalendar className="text-gray-500 mr-2" />
          <input 
            type="date" 
            className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="mr-2">to</span>
          <input 
            type="date" 
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        
        <div className="flex items-center flex-grow">
          <FaSearch className="text-gray-500 mr-2" />
          <input 
            type="text" 
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or Customer ID"
          />
        </div>
        
        <button 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
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
        Total: {filteredOrders.length} orders
      </div>
    </div>
    
    {/* Orders Table */}
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Select
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
          {currentItems.map((order) => (
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
                    setViewedOrder(order);
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
    
    {/* Pagination */}
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center">
        <select
          className="border rounded p-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={15}>15 per page</option>
          <option value={20}>20 per page</option>
        </select>
        <span className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
        </span>
      </div>
      
      <div className="flex items-center">
        <button
          className="px-3 py-1 border rounded mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        
        {/* Page number buttons */}
        <div className="flex">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`px-3 py-1 mx-1 border rounded 
                  ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}
                `}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          className="px-3 py-1 border rounded ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
    
    {/* Order Details Modal */}
    {viewedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Details</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setViewedOrder(null)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Order ID:</span> {viewedOrder.id}
            </div>
            <div>
              <span className="font-semibold">Customer ID:</span> {viewedOrder.customerId}
            </div>
            <div>
              <span className="font-semibold">Date:</span> {viewedOrder.date}
            </div>
            <div>
              <span className="font-semibold">Subtotal:</span> ${viewedOrder.subtotal.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Status:</span> 
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${viewedOrder.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${viewedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                ${viewedOrder.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' : ''}
                ${viewedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {viewedOrder.status.charAt(0).toUpperCase() + viewedOrder.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={() => setViewedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}