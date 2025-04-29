import { useState, useEffect } from "react";
import { Menu, X, Home, User } from "lucide-react";

export default function Sidebar({ onWidthChange, onPageSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Notify parent component when sidebar width changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(isOpen ? 256 : 64); // 256px (w-64) or 64px (w-16)
    }
  }, [isOpen, onWidthChange]);

  const handlePageSelect = (page) => {
    setActivePage(page);
    if (onPageSelect) {
      onPageSelect(page);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen z-20">
      {/* Topbar with Toggle Button and Admin Name */}
      <div className="flex items-center bg-blue-500 h-16 w-full shadow-md">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="h-16 w-16 flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Admin Name */}
        {isOpen && (
          <div className="text-white font-semibold ml-4 text-lg">Admin</div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`h-full pt-2 bg-gradient-to-b from-blue-100 to-blue-200 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Navigation Links */}
        <nav className="">
          <NavItem
            icon={<Home size={20} />}
            text="Home"
            isActive={activePage === "home"}
            onClick={() => handlePageSelect("home")}
            isOpen={isOpen}
          />
          <NavItem
            icon={<User size={20} />}
            text="Winner List"
            isActive={activePage === "winners"}
            onClick={() => handlePageSelect("winners")}
            isOpen={isOpen}
          />
        </nav>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, text, isActive, onClick, isOpen }) {
  return (
    <div
      className={`flex items-center h-12 mb-2 hover:bg-blue-300 cursor-pointer group transition-all duration-150 ${
        isActive ? "bg-blue-300" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-16 text-blue-700 group-hover:text-blue-800">
        {icon}
      </div>
      {isOpen && <span className="text-blue-800 font-medium">{text}</span>}
    </div>
  );
}
