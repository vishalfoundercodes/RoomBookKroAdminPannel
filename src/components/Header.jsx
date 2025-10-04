import { Bell, Mail, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import { FaUser, FaCogs, FaSignOutAlt } from 'react-icons/fa';


// Header Component
 export const Header = ({ isScrolled, onToggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className={`
      fixed top-0 right-0 z-40 transition-all duration-300
      lg:left-64 left-0
      ${isScrolled ? 'shadow-md bg-white dark:bg-gray-800' : 'bg-white/95 dark:bg-gray-800/95'}
      backdrop-blur-sm
    `}>
      <div className="flex items-center justify-between px-1 pl-[2px] py-2 h-16">
        {/* Left side: Menu Icon (Mobile) */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
            <Search className="text-gray-500 dark:text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent ml-2 outline-none flex-1 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side: Notifications, Mail, Profile */}
        <div className="flex items-center ">
          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Bell className="text-gray-600 dark:text-gray-400" size={18} />
            <span className="absolute -top-1 -right-1 bg-red1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Mail Icon */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Mail className="text-gray-600 dark:text-gray-400" size={18} />
          </button>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User className="text-gray-600 dark:text-gray-400" size={18} />
            </button>

            {isProfileMenuOpen && (
                 <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 w-48 py-2">
      <a href="#" className="flex items-center text-gray-800 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <FaUser className="mr-2" size={18} /> {/* Icon for "View Profile" */}
        View Profile
      </a>
      <a href="#" className="flex items-center text-gray-800 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <FaCogs className="mr-2" size={18} /> {/* Icon for "Settings" */}
        Settings
      </a>
      <hr className="my-1 border-gray-200 dark:border-gray-600" />
      <button className="flex items-center block w-full text-left text-gray-800 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <FaSignOutAlt className="mr-2" size={18} /> {/* Icon for "Logout" */}
        Logout
      </button>
      {/* Dark/Light Mode Toggle Button */}
      {/* <button 
        onClick={toggleDarkMode} 
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none">
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button> */}
    </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};