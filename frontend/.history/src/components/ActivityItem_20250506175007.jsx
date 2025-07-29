const ActivityItem = ({ icon, title, description, time }) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            {icon}
          </div>
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
          <div className="text-xs text-gray-400 mt-1">{time}</div>
        </div>
      </div>
    );
  };
  
  export default ActivityItem;