import { useState } from 'react';
import { 
  FiMenu,
  FiX,
  FiBell,
  FiSearch
} from 'react-icons/fi';

import Sidebar from '../../components/Sidebar'
import Dashboard from './Dashboard';
import Orders from './Orders';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'pickups':
        return <Pickups />;
      case 'products':
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar overlay for mobile */}
      <div className={`md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
           onClick={toggleSidebar}>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="p-2 rounded-md md:hidden">
                <FiMenu className="h-6 w-6" />
              </button>
              <h2 className="ml-2 text-xl font-semibold text-gray-800 md:ml-0">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiBell className="h-6 w-6" />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              <div className="flex items-center">
                <img src="/api/placeholder/40/40" alt="User Avatar" className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;