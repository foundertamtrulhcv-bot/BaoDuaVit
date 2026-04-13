
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import DuckRace from './components/DuckRace';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.RACE);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Header activeTab={activeTab} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 overflow-hidden relative bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.05)_0%,_rgba(0,0,0,0)_50%)]">
          {activeTab === AppTab.RACE && <DuckRace />}
        </div>
      </main>
    </div>
  );
};

export default App;
