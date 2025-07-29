const SidebarItem = ({ icon, title, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
          active ? 'bg-lgg/50 text-lgg' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{title}</span>
      </button>
    );
  };
  
  export default SidebarItem;