
import React from 'react';
import { AppTab } from '../types';
import { Menu, Trophy, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, toggleSidebar }) => {
  const titles = {
    [AppTab.RACE]: 'ĐƯỜNG ĐUA VỊT VÀNG',
    [AppTab.HISTORY]: 'BẢNG VÀNG CHIẾN THẮNG'
  };

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0c]/80 backdrop-blur-2xl sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all md:hidden"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            {titles[activeTab]}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
             <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Trạng thái: Đang sẵn sàng</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5">
           <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-500" />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Kỷ lục hôm nay</span>
              <span className="text-xs font-black text-white tracking-tight">VỊT TÈO (3.2s)</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400">
              <Users className="w-5 h-5" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
