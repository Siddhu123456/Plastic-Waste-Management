const StatCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-2">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-lgg/20">
            {icon}
          </div>
        </div>
      </div>
    );
  };
  
  export default StatCard;