import { Link } from "react-router-dom";

const SidebarItem = ({ icon, title,val, active, onClick }) => {
    return (
    <Link to={`/${val}`}>
          <button
        onClick={onClick}
        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors cursor-pointer ${
          active ? 'bg-lgg/10 text-lgg' : 'text-neutral-700 hover:bg-lgg/10'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{title}</span>
      </button>
    </Link>
    )
  }
  
  export default SidebarItem;