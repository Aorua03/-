import { Activity, GitMerge, Settings, PlaySquare, FileText, Database, Server, Split, Command, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'prompts', label: '阶段提示词配置', icon: FileText },
    { id: 'test', label: '调试与效果评测', icon: PlaySquare },
    { id: 'compare', label: 'A/B 效果对比', icon: Split },
    { id: 'models', label: '模型与引擎配置', icon: Cpu },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0">
      <header className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
          <Command className="w-5 h-5" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight text-white leading-tight">
          虚拟人<br/>
          <span className="text-[10px] text-blue-300 font-normal">提示词控制台</span>
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2 space-y-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-200' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
