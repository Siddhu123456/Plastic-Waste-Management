import { 
  FiHome, 
  FiShoppingBag, 
  FiTruck, 
  FiPackage, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiX
} from 'react-icons/fi';
import LogoGBB from '../assets/images/logoGBB.png'
import SidebarItem from './SidebarItem';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 top-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 xl:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-300">
        <div className=" flex items-baseline gap-2">   
          <img className="w-30" src={LogoGBB} alt="GreenBin" />
          <p className="text-lg text-neutral-400">Admin</p>
        </div>
        <button onClick={toggleSidebar} className="p-2 rounded-md xl:hidden">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4">
        <nav className="flex flex-col">
          <SidebarItem 
            icon={<FiHome className="h-5 w-5" />} 
            title="Dashboard" 
            val="dashboard"
            active={activePage === 'dashboard'} 
            onClick={() => setActivePage('dashboard')} 
          />
          <SidebarItem 
            icon={<FiShoppingBag className="h-5 w-5" />} 
            title="Orders" 
            val="allorders"
            active={activePage === 'orders'} 
            onClick={() => setActivePage('orders')} 
          />
          <SidebarItem 
            icon={<FiTruck className="h-5 w-5" />} 
            title="Pickups" 
            active={activePage === 'pickups'} 
            onClick={() => setActivePage('pickups')} 
          />
          <SidebarItem 
            icon={<FiPackage className="h-5 w-5" />} 
            title="Products" 
            active={activePage === 'products'} 
            onClick={() => setActivePage('products')} 
          />
          <div className="pt-4 mt-4 border-t border-neutral-300">
            <SidebarItem 
              icon={<FiUsers className="h-5 w-5" />} 
              title="Customers" 
              active={activePage === 'customers'} 
              onClick={() => setActivePage('customers')} 
            />
            <SidebarItem 
              icon={<FiSettings className="h-5 w-5" />} 
              title="Settings" 
              active={activePage === 'settings'} 
              onClick={() => setActivePage('settings')} 
            />
            <SidebarItem 
              icon={<FiLogOut className="h-5 w-5" />} 
              title="Logout" 
              active={false} 
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;