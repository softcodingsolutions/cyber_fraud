import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add your sign-out logic here (e.g., clear tokens, sessions)
    navigate("/login"); // Redirect to login page
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-4">
      {/* Left side - Logo or Title */}
      <div className="flex items-center">
        <h1 className="text-blue-700 font-bold text-xl ml-4">Dashboard</h1>
      </div>

      {/* Right side - Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100"
          >
            <div className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center">
              <User size={16} className="text-blue-700" />
            </div>

            <ChevronDown size={16} className="text-blue-700" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="border-t border-gray-200"></div>
              <DropdownItem
                icon={<LogOut size={16} />}
                text="Logout"
                onClick={handleSignOut} // This triggers the logout and redirect
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DropdownItem({ icon, text, onClick }) {
  return (
    <div
      onClick={onClick} // Use onClick to trigger the function
      className="flex items-center px-4 py-2 hover:bg-blue-50 text-gray-700 cursor-pointer"
    >
      <span className="text-blue-700 mr-3">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
