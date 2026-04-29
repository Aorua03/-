import { useState } from 'react';
import { usePrompts } from '../context/PromptContext';
import { Save, Plus, Trash2, CheckCircle2, ChevronRight, Copy } from 'lucide-react';
import { PromptModule, PromptVersion } from '../data/prompts';

export function PromptManager() {
  const { modules, setModules, chainConfig, setChainConfig } = usePrompts();
  const [activeModuleId, setActiveModuleId] = useState<string>(modules[0]?.id || '');
  const [activeVersionId, setActiveVersionId] = useState<string>(modules[0]?.versions[0]?.id || '');
  const [savedStatus, setSavedStatus] = useState(false);

  // Derive active items
  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const activeVersion = activeModule?.versions.find(v => v.id === activeVersionId) || activeModule?.versions[0];

  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    const mod = modules.find(m => m.id === moduleId);
    if (mod && mod.versions.length > 0) {
      setActiveVersionId(mod.versions[0].id);
    } else {
      setActiveVersionId('');
    }
  };

  const handleVersionSelect = (versionId: string) => {
    setActiveVersionId(versionId);
  };

  const addVersion = () => {
    if (!activeModule) return;
    const newVersion: PromptVersion = {
      id: `${activeModule.id}_v${Date.now()}`,
      name: `新版本 ${new Date().toLocaleTimeString()}`,
      content: activeVersion ? activeVersion.content : '',
      updatedAt: Date.now()
    };

    setModules(modules.map(m => {
      if (m.id === activeModule.id) {
        return { ...m, versions: [...m.versions, newVersion] };
      }
      return m;
    }));
    setActiveVersionId(newVersion.id);
  };

  const deleteVersion = (versionId: string) => {
    if (!activeModule || activeModule.versions.length <= 1) return; // don't delete last version
    
    setModules(modules.map(m => {
      if (m.id === activeModule.id) {
        return { ...m, versions: m.versions.filter(v => v.id !== versionId) };
      }
      return m;
    }));
    
    if (activeVersionId === versionId) {
      const remaining = activeModule.versions.filter(v => v.id !== versionId);
      setActiveVersionId(remaining[0]?.id || '');
    }
  };

  const updateVersionContent = (content: string) => {
    if (!activeModule || !activeVersion) return;
    setModules(modules.map(m => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          versions: m.versions.map(v => v.id === activeVersion.id ? { ...v, content, updatedAt: Date.now() } : v)
        };
      }
      return m;
    }));
    setSavedStatus(false);
  };

  const updateVersionName = (name: string) => {
    if (!activeModule || !activeVersion) return;
    setModules(modules.map(m => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          versions: m.versions.map(v => v.id === activeVersion.id ? { ...v, name, updatedAt: Date.now() } : v)
        };
      }
      return m;
    }));
    setSavedStatus(false);
  };

  const updateModuleName = (name: string) => {
    if (!activeModule) return;
    setModules(modules.map(m => m.id === activeModule.id ? { ...m, name } : m));
  };

  const updateModuleTask = (coreTask: string) => {
    if (!activeModule) return;
    setModules(modules.map(m => m.id === activeModule.id ? { ...m, coreTask } : m));
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar: List of Modules */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-slate-900 font-semibold text-sm">业务阶段模块</h3>
          <p className="text-xs text-slate-500 mt-1">选择模块管理其提示词</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => handleModuleSelect(mod.id)}
              className={`w-full text-left px-3 py-3 transition-colors flex flex-col gap-1 group border-l-2 ${
                activeModuleId === mod.id 
                  ? 'bg-blue-50 border-blue-600' 
                  : 'hover:bg-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-medium text-sm truncate ${activeModuleId === mod.id ? 'text-blue-900' : 'text-slate-700'}`}>{mod.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${activeModuleId === mod.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>{mod.versions.length}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Versions for Module */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-slate-900 font-semibold text-sm">版本列表</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{activeModule?.name}</p>
          </div>
          <button 
            onClick={addVersion}
            className="text-blue-600 hover:bg-blue-50 p-1.5 transition-colors bg-white border border-slate-200 rounded"
            title="添加新版本"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeModule?.versions.map(version => (
            <div
              key={version.id}
              onClick={() => handleVersionSelect(version.id)}
              className={`w-full text-left px-3 py-2 border-b border-slate-100 text-sm transition-all cursor-pointer flex items-center justify-between group ${
                activeVersionId === version.id 
                  ? 'bg-blue-50 border-l-2 border-l-blue-500 font-medium' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-l-2 border-l-transparent'
              }`}
            >
              <div className="min-w-0 pr-6">
                <div className={`truncate ${activeVersionId === version.id ? 'text-blue-800' : 'text-slate-700'}`}>
                  {version.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  更新于: {new Date(version.updatedAt).toLocaleTimeString()}
                </div>
              </div>
              {activeModule.versions.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteVersion(version.id); }}
                  className="absolute right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Editor */}
      <div className="flex-1 flex flex-col bg-white">
        {activeVersion ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <input
                type="text"
                value={activeModule.name}
                onChange={(e) => updateModuleName(e.target.value)}
                className="text-lg font-semibold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:outline-none focus:border-blue-500 px-2 py-1 w-1/2"
                placeholder="模块名称"
              />
              <div className="flex items-center gap-3">
                {savedStatus && (
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 已保存
                  </span>
                )}
                <button
                  onClick={() => setChainConfig({ ...chainConfig, [activeModule.id]: activeVersion.id })}
                  className={`px-3 py-1.5 text-sm flex items-center gap-2 transition-colors border ${
                    chainConfig[activeModule.id] === activeVersion.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {chainConfig[activeModule.id] === activeVersion.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-blue-600" /> 当前测试版本
                    </>
                  ) : (
                    '设为当前测试版本'
                  )}
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-1.5 text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存至系统
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 relative flex flex-col">
              <div className="bg-slate-50 border border-slate-200 p-4 mb-4 flex flex-col gap-3 text-sm text-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  <label className="font-bold opacity-70 text-xs">当前版本提示词名称：</label>
                  <input
                    type="text"
                    value={activeVersion.name}
                    onChange={(e) => updateVersionName(e.target.value)}
                    className="bg-white border border-slate-300 px-2 py-1.5 focus:outline-none focus:border-blue-500 w-full"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-bold opacity-70 text-xs">模块说明：</label>
                    <input
                      type="text"
                      value={activeModule.coreTask}
                      onChange={(e) => updateModuleTask(e.target.value)}
                      className="bg-white border border-slate-300 px-2 py-1.5 focus:outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-70 text-xs">AI人设：</label>
                    <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-500">{activeModule.aiPersona}</div>
                  </div>
                </div>
              </div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                System Prompt（系统提示词内容）
              </label>
              <textarea
                value={activeVersion.content}
                onChange={(e) => updateVersionContent(e.target.value)}
                className="flex-1 w-full p-4 bg-white border border-slate-300 text-sm text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed whitespace-pre-wrap resize-none"
                placeholder="在此输入系统提示词..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <p>选择或创建一个版本以开始编辑</p>
          </div>
        )}
      </div>
    </div>
  );
}
