import { NavLink, useLocation } from "react-router-dom";
import { menusByRole } from "./menu";
import {
  RiLogoutBoxLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openInventory, setOpenInventory] = useState(
    pathname.includes("inventory")
  );

  const role = "admin";
  const menuItems = role ? menusByRole[role] ?? [] : [];

  return (
    <>
      <aside
        className={`sticky h-full rounded-2xl bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col border-r border-slate-100 shadow-sm
        ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6">
          {!isCollapsed && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
              <div className="h-9 w-9 rounded-xl bg-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-400/20">
                <div className="h-4 w-4 border-2 border-white rounded-sm rotate-45" />
              </div>
              <span className="font-bold text-slate-800 text-xl tracking-tight">
                Focus
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? (
              <RiMenuUnfoldLine size={22} />
            ) : (
              <RiMenuFoldLine size={22} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">
              Main Menu
            </p>
          )}

          {menuItems.map((item) => {
            const isInventory = item.label === "Inventory";
            const isActive = pathname.startsWith(item.path || "");

            if (!isInventory) {
              return (
                <NavLink
                  key={item.label}
                  to={item.path!}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }
                  `}
                >
                  <item.icon
                    className={`text-xl ${
                      isActive
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              );
            }

            return (
              <div key={item.label} className="space-y-1">
                {/* Inventory Parent */}
                <button
                  onClick={() => setOpenInventory(!openInventory)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${
                      openInventory || isActive
                        ? "text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <item.icon
                    className={`text-xl ${
                      openInventory || isActive
                        ? "text-indigo-500"
                        : "text-slate-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium">Inventory</span>
                      <ChevronRight
                        size={14}
                        className={`ml-auto transition-transform duration-300 ${
                          openInventory
                            ? "rotate-90 text-indigo-500"
                            : "text-slate-300"
                        }`}
                      />
                    </>
                  )}
                </button>

                {/* Inventory Children */}
                {openInventory && !isCollapsed && (
                  <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.children!.map((child) => {
                      const isChildActive = pathname.includes(child.id);

                      return (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          className={`
                            ml-9 w-[calc(100%-2.25rem)] block px-3 py-2 rounded-lg text-xs font-medium transition-all
                            ${
                              isChildActive
                                ? "bg-indigo-400 text-white shadow-md shadow-indigo-400/20"
                                : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            }
                          `}
                        >
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Profile & Logout */}
        <div className="p-4 mt-auto border-t border-slate-50 space-y-2">
          <div
            className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100 transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-400 to-indigo-300 flex items-center justify-center text-white font-semibold shadow-md">
              {role.charAt(0).toUpperCase()}
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  Admin User
                </span>
                <span className="text-[10px] text-indigo-500 font-medium uppercase tracking-tighter">
                  Premium Access
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <RiLogoutBoxLine className="text-xl group-hover:rotate-12 transition-transform" />
            {!isCollapsed && (
              <span className="text-sm font-semibold">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Confirmation Modal (unchanged) */}
    </>
  );
}
