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
  
  import SidebarItem from './SidebarItem';
  
  const Sidebar = ({ activePage, setActivePage, sidebarOpen, toggleSidebar }) => {
    return (
      <div className={`fixed md:static inset-y-0 left-0 top-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">ShopAdmin</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-md md:hidden">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            <SidebarItem 
              icon={<FiHome className="h-5 w-5" />} 
              title="Dashboard" 
              active={activePage === 'dashboard'} 
              onClick={() => setActivePage('dashboard')} 
            />
            <SidebarItem 
              icon={<FiShoppingBag className="h-5 w-5" />} 
              title="Orders" 
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
            <div className="pt-4 mt-4 border-t">
              <SidebarItem 
                icon={<FiUsers className="h-5 w-5" />} 
                title="Customers" 
                active={false} 
              />
              <SidebarItem 
                icon={<FiSettings className="h-5 w-5" />} 
                title="Settings" 
                active={false} 
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