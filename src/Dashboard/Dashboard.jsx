import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Content from "../components/Content";

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(64); // Default to 64px (w-16)
  const [selectedPage, setSelectedPage] = useState("home"); // Default to home page

  // Function to update sidebar width when it changes
  const updateSidebarWidth = (width) => {
    setSidebarWidth(width);
  };

  // Function to handle page selection from sidebar
  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar with margin-left to account for sidebar toggle */}
      <div
        className="fixed top-0 right-0 left-0 z-10"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Topbar />
      </div>

      {/* Sidebar - positioned absolutely */}
      <Sidebar
        onWidthChange={updateSidebarWidth}
        onPageSelect={handlePageSelect}
      />

      {/* Main content - with padding to account for fixed elements */}
      <div className="flex-1 pt-16" style={{ marginLeft: `${sidebarWidth}px` }}>
        <div className="h-full overflow-auto bg-gray-50 p-6">
          <Content selectedPage={selectedPage} />
        </div>
      </div>
    </div>
  );
}
