const StatCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl text-neutral-600 font-semibold mt-2">{value}</p>
          </div>
          <div className="p-3 rounded-full text-neutral-500 bg-lgg/20">
            {icon}
          </div>
        </div>
      </div>
    );
  };
  
  export default StatCard;