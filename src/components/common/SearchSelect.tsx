import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Option = {
  id: string;
  name: string;
};

type Props = {
  title: string;
  options: Option[];
  // New prop to distinguish between 'room' or 'rate'
  type: "room" | "rate"; 
  onSelect?: (option: Option) => void;
};

export default function SidebarSearchSelect({
  title,
  options,
  type,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelection = (option: Option) => {
    if (onSelect) onSelect(option);

    // Conditional Navigation Logic
    if (type === "room") {
      navigate(`/inventory/room-type/${option.id}`);
    } else {
      navigate(`/inventory/rate-plan/${option.id}`);
    }
  };

  return (
    <div className="mx-3 mt-2 rounded-2xl bg-slate-50/50 p-3 space-y-3 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <span className="text-[10px] bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded-full font-bold">
          {options.length}
        </span>
      </div>

      {/* Indigo-Themed Search */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-400/10 transition-all duration-300">
        <Search size={14} className="text-slate-400" />
        <input
          className="w-full text-xs outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Scrollable Results */}
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {filtered.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelection(option)}
            className="w-full flex items-center justify-between group px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-indigo-400 hover:text-white transition-all duration-200"
          >
            <span className="truncate">{option.name}</span>
            <ChevronRight 
              size={12} 
              className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" 
            />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="py-6 text-center animate-pulse">
            <p className="text-[11px] text-slate-400 italic">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}