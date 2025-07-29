const StatCard = ({ title, value, change, icon, positive }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${positive ? 'bg-green-100' : 'bg-red-100'}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      </div>
    );
  };
  
  export default StatCard;