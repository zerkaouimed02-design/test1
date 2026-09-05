import React from 'react';
import { Home, Award, PlusCircle, LineChart, User } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

export type TabKey = 'home' | 'progress' | 'track' | 'insights' | 'profile';

interface TabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'progress', label: 'Progress', icon: Award },
    { key: 'track', label: 'Track', icon: PlusCircle },
    { key: 'insights', label: 'Insights', icon: LineChart },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#09090B]/95 backdrop-blur-2xl border-t border-white/5 pb-5 pt-2">
      <div className="max-w-md mx-auto px-6 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isCenter = tab.key === 'track';

          if (isCenter) {
            return (
              <button
                key={tab.key}
                id={`tab-bar-btn-${tab.key}`}
                onClick={() => {
                  soundManager.playHapticTap();
                  onSelectTab(tab.key);
                }}
                className="group relative flex flex-col items-center justify-center -mt-5"
                title="Track Session"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-4 border-[#050507] transition-all active:scale-90 ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                      : 'bg-white text-[#050507] hover:bg-zinc-200'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                    isActive ? 'text-[#3B82F6]' : 'text-[#52525B] group-hover:text-[#A1A1AA]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              id={`tab-bar-btn-${tab.key}`}
              onClick={() => {
                soundManager.playHapticTap();
                onSelectTab(tab.key);
              }}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-[#3B82F6]' : 'text-[#52525B] hover:text-[#A1A1AA]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Bar */}
      <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2" />
    </nav>
  );
};
