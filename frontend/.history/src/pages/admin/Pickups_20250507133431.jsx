import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaSort, FaEye } from 'react-icons/fa';
import { LuBadge, LuChevronDown, LuFilter, LuSearch, LuX } from 'react-icons/lu';


const getNextStatus = (currentStatus) => {
  const statusFlow = {
    'pending': 'out for pickup',
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

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/pickups/all`);
        setPickups(response.data);
      } catch (error) {
        console.error("Error fetching pickup:", error);
      }
    };

    fetchPickups();
  }, []);

  console.log(pickups)
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

  const filteredPickups = sortedPickups.filter(pickup => {
    // Status filter
    if (statusFilter && pickup.status !== statusFilter) return false;
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return String(pickup.id).toLowerCase().includes(query) || 
             String(pickup.customer).toLowerCase().includes(query);
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

  const handleRowClick = (pickup) => {
    if (pickup.status === 'picked') return;

    const pickupId = pickup.id;

    if (!selectedPickups.includes(pickupId)) {
      setSelectedPickups(prev => [...prev, pickupId]);
    } else {
      setSelectedPickups(prev => prev.filter(id => id !== pickupId));
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedPickups.length === 0) return;
  
    for (const pickupId of selectedPickups) {
      const pickup = pickups.find(p=> p.id === pickupId);
      if (pickup && pickup.status !== 'picked') {
        const newStatus = getNextStatus(pickup.status);
  
        try {
          await axios.put(`http://localhost:8080/api/pickups/update/${pickupId}/status`, {
            status: newStatus
          });
  
          setPickups(prev =>
            prev.map(p=>
              p.id === pickupId ? { ...p, status: newStatus } : o
            )
          );
  
        } catch (error) {
          console.error(`Failed to update status for pickup ${pickupId}`, error);
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
            {filteredPickups.map((pickup) => (
              <tr 
                key={pickup.id} 
                className={`${selectedPickups.includes(pickup.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} ${pickup.status === 'picked' ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => handleRowClick(pickup)}
              >
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  {pickup.status !== 'picked' && (
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedPickups.includes(pickup.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(pickup.id);
                      }}
                    />
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                  {pickup.id}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {pickup.customer}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {pickup.requestedDate}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {pickup.weight} kg
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-xs">
                  <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${pickup.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${pickup.status === 'out for pickup' ? 'bg-purple-100 text-purple-800' : ''}
                    ${pickup.status === 'picked' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-center">
                  {pickup.greenCoinsEarned}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}