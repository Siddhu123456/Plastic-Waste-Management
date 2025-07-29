import { useState } from "react";
import { LuArrowUpDown, LuBadge, LuBell, LuBrush, LuCalendar, LuChevronDown, LuEye, LuFilter, LuLayers, LuPlus, LuSearch, LuSettings, LuTrash2, LuUser } from "react-icons/lu";

export default function OrderDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample data for demonstration
  const orders = [
    {
      id: "ORD-2023-001",
      products: [
        { name: "Premium Headphones", quantity: 1, price: 199.99 },
        { name: "USB-C Cable", quantity: 2, price: 12.99 }
      ],
      customer: "John Smith",
      orderDate: "2025-05-01",
      subTotal: 225.97,
      status: "completed"
    },
    {
      id: "ORD-2023-002",
      products: [
        { name: "Wireless Keyboard", quantity: 1, price: 89.99 }
      ],
      customer: "Sarah Johnson",
      orderDate: "2025-05-02",
      subTotal: 89.99,
      status: "processing"
    },
    {
      id: "ORD-2023-003",
      products: [
        { name: "Smart Watch", quantity: 1, price: 249.99 },
        { name: "Watch Band", quantity: 1, price: 24.99 }
      ],
      customer: "Michael Wilson",
      orderDate: "2025-05-03",
      subTotal: 274.98,
      status: "pending"
    },
    {
      id: "ORD-2023-004",
      products: [
        { name: "Bluetooth Speaker", quantity: 2, price: 69.99 }
      ],
      customer: "Emily Davis",
      orderDate: "2025-05-04",
      subTotal: 139.98,
      status: "shipped"
    },
    {
      id: "ORD-2023-005",
      products: [
        { name: "Laptop Stand", quantity: 1, price: 45.99 },
        { name: "Wireless Mouse", quantity: 1, price: 29.99 }
      ],
      customer: "David Brown",
      orderDate: "2025-05-04",
      subTotal: 75.98,
      status: "cancelled"
    }
  ];

  // Status badge component with appropriate colors based on status
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter orders based on selected status
  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // Handle bulk selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // For view order modal (simplified for this example)
  const [viewOrder, setViewOrder] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LuLayers className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">OrderFlow</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <LuBell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <LuSettings className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <LuUser className="h-4 w-4" />
            </div>
            <LuChevronDown className="h-4 w-4 ml-1 text-gray-500" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
            <LuPlus className="h-4 w-4 mr-2" />
            Create Order
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center w-full md:w-96">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <LuSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <LuFilter className="h-4 w-4 mr-2 text-gray-500" />
                  Filter
                  <LuChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button 
                        onClick={() => {setSelectedStatus("all"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        All Orders
                      </button>
                      <button 
                        onClick={() => {setSelectedStatus("pending"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => {setSelectedStatus("processing"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Processing
                      </button>
                      <button 
                        onClick={() => {setSelectedStatus("shipped"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Shipped
                      </button>
                      <button 
                        onClick={() => {setSelectedStatus("completed"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Completed
                      </button>
                      <button 
                        onClick={() => {setSelectedStatus("cancelled"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <LuCalendar className="h-4 w-4 mr-2 text-gray-500" />
                  Date Range
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-indigo-50 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-indigo-700 font-medium">{selectedOrders.length} orders selected</span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Update Status</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => setSelectedOrders([])}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        onChange={handleSelectAll}
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Order ID
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Customer
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Products
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Date
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Subtotal
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Status
                      <LuArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex flex-col">
                        {order.products.map((product, index) => (
                          <div key={index} className="text-sm">
                            {product.quantity}x {product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">${order.subTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LuBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setViewOrder(order)}
                        >
                          <LuEye className="h-5 w-5" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <LuBrush className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <LuTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{" "}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <LuChevronDown className="h-5 w-5 rotate-90" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <LuChevronDown className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
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
                  <p className="font-medium">${viewOrder.subTotal.toFixed(2)}</p>
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
                    {viewOrder.products.map((product, index) => (
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