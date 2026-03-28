import { useState } from 'react';
import TopBar from './TopBar';
import AnatomySidebar from './AnatomySidebar';
import ProcedurePanel from '../procedure/ProcedurePanel';
import KneeScene from '../scene/KneeScene';
import InfoCard from '../procedure/InfoCard';
import { useAppStore } from '../../store/appStore';

export default function Layout() {
  const viewMode = useAppStore((s) => s.viewMode);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      <TopBar onMenuToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — collapsible, 240px wide */}
        <div
          className="flex-shrink-0 overflow-hidden bg-slate-800 border-r border-slate-700 transition-[width] duration-300 ease-in-out"
          style={{ width: sidebarOpen ? '240px' : '0px' }}
        >
          {/* Inner wrapper keeps content at fixed width so it doesn't reflow */}
          <div className="w-60 h-full overflow-y-auto overflow-x-hidden">
            <AnatomySidebar />
          </div>
        </div>

        {/* Center viewport — R3F Canvas fills this area */}
        <main
          id="viewport-container"
          className="flex-1 relative bg-slate-950 overflow-hidden"
        >
          <KneeScene />
          <InfoCard />
        </main>

        {/* Right panel — 320px, slides in when procedure mode is active */}
        <div
          className="flex-shrink-0 overflow-hidden bg-slate-800 border-l border-slate-700 transition-[width] duration-300 ease-in-out"
          style={{ width: viewMode === 'procedure' ? '320px' : '0px' }}
        >
          <div className="w-80 h-full overflow-y-auto overflow-x-hidden">
            <ProcedurePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
