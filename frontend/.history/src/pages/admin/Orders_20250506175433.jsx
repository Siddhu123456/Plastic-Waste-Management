import { FiSearch } from 'react-icons/fi';

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

export default Orders;