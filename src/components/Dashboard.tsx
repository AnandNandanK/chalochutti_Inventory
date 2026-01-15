import { Link } from "react-router-dom";
import { 
  DoorOpen, 
  Package, 
  ArrowUpRight, 
  Plus, 
  LayoutGrid, 
  History, 
  AlertCircle 
} from "lucide-react";

const Dashboard = () => {
  // Mock data for the "Modern" look
  const stats = [
    { label: "Total Rooms", value: "124", change: "+4 this month", icon: DoorOpen },
    { label: "Inventory Items", value: "1,205", change: "+12% vs last week", icon: Package },
    { label: "Pending Maintenance", value: "12", change: "5 Urgent", icon: AlertCircle, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Inventory <span className="text-indigo-500">&</span> Facilities
          </h1>
          <p className="text-slate-500 font-medium">
            Overview of your rooms, assets, and operational status.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <History size={18} />
            Recent Activity
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-400 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-400/30">
            <Plus size={18} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className={`text-[11px] mt-1 font-semibold ${stat.color || 'text-emerald-500'}`}>
                {stat.change}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Management Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        
        {/* Rooms Management */}
        <Link
          to="/admin/rooms"
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-indigo-400/10 hover:-translate-y-1"
        >
          {/* Decorative background shape */}
          <div className="absolute -right-8 -top-8 h-32 w-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-400 text-white shadow-lg shadow-indigo-400/40 mb-6">
              <DoorOpen size={28} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-800">Room Management</h3>
              <ArrowUpRight className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Configure room layouts, manage occupancy, and assign specific facility categories.
            </p>

            <div className="mt-8 flex gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                12 Categories
              </span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Real-time Status
              </span>
            </div>
          </div>
        </Link>

        {/* Inventory Management */}
        <Link
          to="/admin/inventory"
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-emerald-400/10 hover:-translate-y-1"
        >
          {/* Decorative background shape */}
          <div className="absolute -right-8 -top-8 h-32 w-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />

          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 mb-6">
              <Package size={28} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-800">Stock & Assets</h3>
              <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Track asset lifecycle, monitor stock levels, and manage vendor procurement data.
            </p>

            <div className="mt-8 flex gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Automatic Alerts
              </span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Asset QR Codes
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Modern List View (Example for Recent Assets) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-800">Active Allocations</h3>
          </div>
          <button className="text-sm font-semibold text-indigo-500 hover:text-indigo-600">View all</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-50">
                <th className="pb-4 font-medium">Item Name</th>
                <th className="pb-4 font-medium">Location</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Last Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="group">
                  <td className="py-4 font-semibold text-slate-700 text-sm">Projector 4K - Sony</td>
                  <td className="py-4 text-slate-500 text-sm">Conference Room B</td>
                  <td className="py-4 text-sm">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium">
                      In Use
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-400 text-sm">2 hours ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;