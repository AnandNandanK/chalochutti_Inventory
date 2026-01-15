import Sidebar from "@/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function PortalLayout() {
  return (
    <div className="flex h-screen w-screen p-4 space-x-4 bg-gray-200">
      
      {/* Sidebar */}
      <div className="h-full">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full gap-4 overflow-hidden">
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto rounded-xl pr-2 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
