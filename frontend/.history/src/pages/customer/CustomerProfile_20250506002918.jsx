import React from 'react';
import { LuAward, LuChevronRight, LuHeart, LuMapPin, LuPackage, LuShoppingBag, LuShoppingCart, LuTruck, LuWallet } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  // Sample user data - would come from your actual user data in a real app
  const userData = JSON.parse(localStorage.getItem('user'));


  let badge = 'Eco Starter';
  if(userData.plasticContributed >= 100) badge ='Green Champ'
  else if(userData.plasticContributed >= 50) badge = 'Green Hero'

  // Menu items for the profile
  const menuItems = [
    { icon: <LuShoppingBag size={20} />, label: "My Orders", path: "/orders" },
    { icon: <LuTruck size={20} />, label: "My Pickups", path: "/pickups" },
    { icon: <LuWallet size={20} />, label: "My Wallet", path: "/wallet" },
    { icon: <LuMapPin size={20} />, label: "My Addresses", path: "/addresses" },
    { icon: <LuShoppingCart size={20} />, label: "Cart", path: "/cart" },
    { icon: <LuHeart size={20} />, label: "Wishlist", path: "/favorites" }
  ];

  return (
    <div className="mx-auto px-2 py-4 sm:px-4 max-w-4xl">
    <div className="bg-white dark:bg-dtc rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-lgg via-[#1faa59] to-[#018a4c] p-6 pb-16">
        <div className="flex flex-col gap-2 sm:flex-row justify-between items-start">
          <div className="text-white">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-gray-50 opacity-90">{userData.email}</p>
          </div>
          
          {/* Badge on top right */}
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
            <LuAward className='text-lg' />{badge} 
          </div>
        </div>
      </div>
      
      {/* Avatar that overlaps the header */}
      <div className="flex justify-center -mt-8 mb-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lgg to-[#018a4c] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-dtc">
          {userData.name.charAt(0)}
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-6 py-2 mb-6">
        <div className="p-4 flex justify-center">
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wide font-medium">Total Plastic Contributed</span>
            <span className="block text-2xl font-bold text-lgg mt-1">{userData.plasticContributed} kg</span>
          </div>
        </div>
      </div>
      
      {/* Menu links */}
      <div className="px-6 pb-6">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-300 font-semibold mb-3 px-2">Account</h2>
        <div className="grid sm:grid-cols-2 rounded-md overflow-hidden text-tc dark:text-ow">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path} 
              className="flex items-center justify-between p-4 rounded-md hover:bg-gray-100 dark:hover:bg-dsc transition-colors"
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center text-lgg">
                  {item.icon}
                </span>
                <span className="ml-3 font-medium">{item.label}</span>
              </div>
              <LuChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}