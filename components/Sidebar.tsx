
import React from 'react';
import { AppTab } from '../types';
import { Trophy, Flag, History } from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle }) => {
  const menuItems = [
    { 
      id: AppTab.RACE, 
      label: 'ĐUA VỊT', 
      icon: <Flag className="w-5 h-5" />
    },
    { 
      id: AppTab.HISTORY, 
      label: 'LỊCH SỬ', 
      icon: <History className="w-5 h-5" />
    },
  ];

  return (
    <aside className={`${isOpen ? 'w-72' : 'w-0'} bg-[#111114] border-r border-white/5 transition-all duration-300 flex flex-col overflow-hidden z-30 shadow-2xl`}>
      <div className="p-8 border-b border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          D
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tighter text-white uppercase">DUCK RACE</span>
          <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Arena Edition</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-3 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-500 text-white' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-yellow-500' : 'text-slate-600'} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 m-4 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-3xl border border-white/5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Mẹo chơi</span>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Nhập nhiều tên hơn để cuộc đua thêm phần kịch tính và bất ngờ!</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
