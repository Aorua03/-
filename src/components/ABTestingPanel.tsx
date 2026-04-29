import { useState } from 'react';
import { usePrompts } from '../context/PromptContext';
import { Split, Send, Activity, MessageSquare } from 'lucide-react';

export function ABTestingPanel() {
  const { modules } = usePrompts();
  
  // Flatten all versions to easily select any version regardless of module
  const allVersions = modules.flatMap(m => 
    m.versions.map(v => ({
      ...v,
      moduleName: m.name
    }))
  );

  const [promptA, setPromptA] = useState<string>(allVersions[0]?.id || '');
  const [promptB, setPromptB] = useState<string>(allVersions.length > 1 ? allVersions[1].id : (allVersions[0]?.id || ''));
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [history, setHistory] = useState<{
    id: string;
    input: string;
    resultA: string;
    thinkingA?: string;
    resultB: string;
    thinkingB?: string;
  }[]>([]);

  const handleTest = () => {
    if (!input.trim() || isProcessing) return;
    
    const currentInput = input;
    setInput('');
    setIsProcessing(true);
    
    const newEntryId = Date.now().toString();
    setHistory(prev => [...prev, { id: newEntryId, input: currentInput, resultA: '', resultB: '' }]);

    const pA = allVersions.find(v => v.id === promptA)?.name || 'Prompt A';
    const pB = allVersions.find(v => v.id === promptB)?.name || 'Prompt B';

    const getMockThinking = (promptName: string, input: string) => `[用户解析]
- 核心意图：${input ? (input.includes('能') || input.includes('吗') ? '发起询问或请求' : '日常闲聊试图互动') : '静默无输入'}
- 情绪感知：${input.includes('!') || input.includes('！') ? '激动 / 高昂' : '平稳 / 放松'}

[执行链路]
- 调用版本：${promptName}
- 回复策略：维持人设，结合上下文进行匹配或话术应对，不超过20字。`;

    setTimeout(() => {
      setHistory(prev => prev.map(entry => 
        entry.id === newEntryId 
          ? { ...entry, 
              thinkingA: getMockThinking(pA, currentInput),
              resultA: `【测试结果】针对输入 "${currentInput}" 的模拟生成回复（使用 ${pA}）` 
            } 
          : entry
      ));
    }, 600);

    setTimeout(() => {
      setHistory(prev => prev.map(entry => 
        entry.id === newEntryId 
          ? { ...entry, 
              thinkingB: getMockThinking(pB, currentInput),
              resultB: `【测试结果】针对输入 "${currentInput}" 的模拟生成回复（使用 ${pB} - 略有不同）` 
            } 
          : entry
      ));
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Configuration Header */}
      <div className="p-6 border-b border-slate-200 bg-white shrink-0">
        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-6 flex items-center gap-2">
            <Split className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">A/B 效果评测</h2>
            <span className="text-xs text-slate-500 ml-2 px-2 py-1 bg-slate-100 border border-slate-200">使用相同输入，横向评估两个提示词方案的区别</span>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 bg-slate-50 p-4 border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">测试组 A (提示词版本)</label>
              <select 
                value={promptA}
                onChange={(e) => setPromptA(e.target.value)}
                className="w-full bg-white border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {modules.map(m => (
                  <optgroup key={m.id} label={m.name}>
                    {m.versions.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex-1 bg-slate-50 p-4 border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">测试组 B (提示词版本)</label>
              <select 
                value={promptB}
                onChange={(e) => setPromptB(e.target.value)}
                className="w-full bg-white border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {modules.map(m => (
                  <optgroup key={m.id} label={m.name}>
                    {m.versions.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Split className="w-12 h-12 mb-4 opacity-20" />
              <p>请在下方输入测试文本进行多路并发对比</p>
            </div>
          ) : (
            history.map((record) => (
              <div key={record.id} className="bg-white border border-slate-300 shadow-sm">
                <div className="bg-slate-50 px-6 py-4 flex items-center gap-3 border-b border-slate-200">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 break-words">{record.input}</p>
                  </div>
                </div>
                
                <div className="flex divide-x divide-slate-100">
                  {/* Result A */}
                  <div className="flex-1 p-6 relative">
                    <div className="text-[10px] uppercase font-bold text-blue-500 mb-3 tracking-widest">A组 生成结果</div>
                    {record.resultA ? (
                      <div>
                        {record.thinkingA && (
                          <div className="bg-slate-50 text-slate-600 text-xs p-3 border border-slate-200 mb-3 font-mono whitespace-pre-wrap leading-relaxed">
                            {record.thinkingA}
                          </div>
                        )}
                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {record.resultA}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-blue-400 animate-pulse">
                        <Activity className="w-4 h-4" /> 生成中...
                      </div>
                    )}
                  </div>

                  {/* Result B */}
                  <div className="flex-1 p-6 relative">
                    <div className="text-[10px] uppercase font-bold text-emerald-500 mb-3 tracking-widest">B组 生成结果</div>
                    {record.resultB ? (
                      <div>
                        {record.thinkingB && (
                          <div className="bg-slate-50 text-slate-600 text-xs p-3 border border-slate-200 mb-3 font-mono whitespace-pre-wrap leading-relaxed">
                            {record.thinkingB}
                          </div>
                        )}
                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {record.resultB}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse">
                        <Activity className="w-4 h-4" /> 生成中...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <div className="max-w-4xl mx-auto w-full relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            placeholder="输入共用的测试输入 (User Input)..."
            className="flex-1 bg-white border border-slate-300 pl-4 pr-16 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            disabled={isProcessing}
          />
          <button 
            onClick={handleTest}
            disabled={!input.trim() || isProcessing}
            className={`absolute right-1 px-4 py-1.5 text-sm flex items-center justify-center transition-colors ${
              !input.trim() || isProcessing ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Send className="w-3.5 h-3.5 mr-1" /> 发送
          </button>
        </div>
      </div>
    </div>
  );
}
