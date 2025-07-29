import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaSort, FaEye } from 'react-icons/fa';
import { LuBadge, LuChevronDown, LuFilter, LuSearch, LuX } from 'react-icons/lu';


const getNextStatus = (currentStatus) => {
  const statusFlow = {
    'preparing': 'pending',
    'shipped': 'out for pickup',
    'out for pickup': 'picked'
  };
  return statusFlow[currentStatus] || currentStatus;
};

export default function Pickups() {
  const [pickups, setPickups] = useState([]);
  const [selectedPickups, setSelectedPickups] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [viewPickup, setViewPickup] = useState(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/pickups/all`);
        setPickups(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchPickups();
  }, []);

  console.log(selectedPickups)
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedPickups = [...pickups].sort((a, b) => {
    if (sortConfig.key === 'requestedDate') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.requestedDate) - new Date(b.requestedDate)
        : new Date(b.requestedDate) - new Date(a.requestedDate);
    } else if (sortConfig.key === 'weight') {
      return sortConfig.direction === 'asc' 
        ? a.weight - b.weight
        : b.weight - a.weight;
    }
    return 0;
  });

  const filteredPickups = sortedPickups.filter(order => {
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

  const handleCheckboxChange = (pickupId) => {
    setSelectedPickups(prev => {
      if (prev.includes(pickupId)) {
        return prev.filter(id => id !== pickupId);
      } else {
        return [...prev, pickupId];
      }
    });
  };

  const handleRowClick = (order) => {
    if (order.status === 'picked') return;

    const pickupId = order.id;

    if (!selectedPickups.includes(pickupId)) {
      setSelectedPickups(prev => [...prev, pickupId]);
    } else {
      setSelectedPickups(prev => prev.filter(id => id !== pickupId));
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedPickups.length === 0) return;
  
    for (const pickupId of selectedPickups) {
      const order = pickups.find(p=> p.id === pickupId);
      if (order && order.status !== 'picked') {
        const newStatus = getNextStatus(order.status);
  
        try {
          await axios.put(`http://localhost:8080/api/pickups/update/${pickupId}/status`, {
            status: newStatus
          });
  
          setPickups(prev =>
            prev.map(p=>
              p.id === pickupId ? { ...o, status: newStatus } : o
            )
          );
  
        } catch (error) {
          console.error(`Failed to update status for order ${pickupId}`, error);
        }
      }
    }
  
    setSelectedPickups([]);
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
                  onClick={() => {setStatusFilter("pending"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Pending
                </button>
                <button 
                  onClick={() => {setStatusFilter("shipped"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Shipped
                </button>
                <button 
                  onClick={() => {setStatusFilter("out for pickup"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Out for Delivery
                </button>
                <button 
                  onClick={() => {setStatusFilter("picked"); setIsFilterOpen(false);}}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Picked
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-grow w-full sm:w-64 md:w-96">
          <input 
            type="text" 
            placeholder="Search pickups..." 
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
          <span className="text-sm text-gray-700 whitespace-nowrap">{selectedPickups.length} selected</span>
          {selectedPickups.length > 0 && (
            <>
              <button 
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
              <button 
                className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-400 transition"
                onClick={() => setSelectedPickups([])}
              >
                Clear
              </button>
            </>
          )}
        </div>
        <div className="text-sm text-gray-700 whitespace-nowrap mt-2 sm:mt-0">
          Showing {filteredPickups.length} of {pickups.length} pickups
        </div>
      </div>
      
      {/* Pickups Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Checkbox Column */}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('requestedDate')}
              >
                <div className="flex items-center">
                  Date
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('weight')}
              >
                <div className="flex items-center">
                  Weight
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
            {filteredPickups.map((order) => (
              <tr 
                key={order.id} 
                className={`${selectedPickups.includes(order.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} ${order.status === 'picked' ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => handleRowClick(order)}
              >
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  {order.status !== 'picked' && (
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedPickups.includes(order.id)}
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
                  {order.requestedDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {order.weight} kg
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs">
                  <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'out for pickup' ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 'picked' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewPickup(order);
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
      
      {/* Pickup Details Modal */ }
      {viewPickup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl mx-auto overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h3 className="text-base sm:text-lg font-medium">Pickup Details: {viewPickup.id}</h3>
              <button onClick={() => setViewPickup(null)}>
                <LuX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-3 sm:p-6 overflow-y-auto max-h-80vh">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Customer</p>
                  <p className="text-sm sm:text-base font-medium">{viewPickup.customer}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Pickup Date</p>
                  <p className="text-sm sm:text-base font-medium">{viewPickup.requestedDate}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${viewPickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${viewPickup.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${viewPickup.status === 'out for pickup' ? 'bg-purple-100 text-purple-800' : ''}
                    ${viewPickup.status === 'picked' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {viewPickup.status.charAt(0).toUpperCase() + viewPickup.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm sm:text-base font-medium">{viewPickup.weight}</p>
                </div>
              
              </div>
              
              <h4 className="font-medium text-sm sm:text-base mb-2">Products</h4>
              <div className="rounded-lg overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewPickup.items && viewPickup.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{item.product.pName}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}