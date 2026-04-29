import { useState } from 'react';
import { Settings, Cpu, Mic, Volume2, Radio, Check } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  description: string;
  isAdvanced?: boolean;
}

interface ComponentConfig {
  id: string;
  title: string;
  icon: any;
  options: ModelOption[];
}

const configModules: ComponentConfig[] = [
  {
    id: 'asr',
    title: 'ASR (自动语音识别)',
    icon: Mic,
    options: [
      { id: 'asr-basic', name: 'Standard ASR', description: '基础语音识别，延迟低，适合日常对话。' },
      { id: 'asr-pro', name: 'Advanced ASR', description: '高精度语音识别，支持多语种和方言。', isAdvanced: true },
      { id: 'asr-realtime', name: 'Realtime Streaming', description: '实时流式识别，极低延迟。', isAdvanced: true },
    ],
  },
  {
    id: 'llm',
    title: 'LLM (大语言模型)',
    icon: Cpu,
    options: [
      { id: 'llm-basic', name: 'Gemini 3.1 Flash', description: '快速、低成本，适合简单推理和闲聊。' },
      { id: 'llm-pro', name: 'Gemini 3.1 Pro', description: '强大的推理和复杂逻辑处理能力。', isAdvanced: true },
      { id: 'llm-ultra', name: 'Gemini 3.1 Ultra', description: '最高精度的理解和代码生成能力。', isAdvanced: true },
    ],
  },
  {
    id: 'tts',
    title: 'TTS (文本到语音)',
    icon: Volume2,
    options: [
      { id: 'tts-basic', name: 'Standard TTS', description: '基础语音合成，响应速度快。' },
      { id: 'tts-hd', name: 'HD Voice TTS', description: '高保真情感语音，音色丰富自然。', isAdvanced: true },
      { id: 'tts-clone', name: 'Voice Cloning TTS', description: '支持少量音频克隆音色。', isAdvanced: true },
    ],
  },
  {
    id: 'voice',
    title: '音色选择 (Voice)',
    icon: Mic,
    options: [
      { id: 'voice-peach', name: '小蜜桃 (默认)', description: '甜美可爱风，充满活力的少女音色。' },
      { id: 'voice-sister', name: '温柔御姐', description: '成熟稳重，知性温柔的女声音色。' },
      { id: 'voice-loli', name: '软萌萝莉', description: '软萌可爱，适合撒娇的小女声音色。' },
      { id: 'voice-boy', name: '清朗青年', description: '阳光清亮的青年男声音色。' },
    ],
  },
  {
    id: 'rtc',
    title: 'RTC (实时通信)',
    icon: Radio,
    options: [
      { id: 'rtc-basic', name: 'Standard WebRTC', description: '标准的点对点和服务器中转通信。' },
      { id: 'rtc-low-latency', name: 'Ultra Low Latency RTC', description: '专为语音房优化的超低延迟传输。', isAdvanced: true },
    ],
  },
];

export function ModelConfigManager() {
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>({
    asr: 'asr-basic',
    llm: 'llm-basic',
    tts: 'tts-basic',
    voice: 'voice-peach',
    rtc: 'rtc-basic',
  });

  const handleSelect = (moduleId: string, optionId: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [moduleId]: optionId
    }));
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            模型与引擎配置
          </h2>
          <p className="text-slate-500 mt-2">
            为语音交互链路的不同节点选择合适的底层引擎和模型。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {configModules.map((module) => {
            const Icon = module.icon;
            const selectedId = selectedModels[module.id];

            return (
              <div key={module.id} className="bg-white border border-slate-300 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-800">{module.title}</h3>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-3 bg-white">
                  {module.options.map((option) => {
                    const isSelected = selectedId === option.id;
                    return (
                      <div 
                        key={option.id}
                        onClick={() => handleSelect(module.id, option.id)}
                        className={`relative border p-3 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                              {option.name}
                            </span>
                            {option.isAdvanced && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-1.5 py-0.5 border border-slate-300">
                                Pro
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <div className="text-blue-600">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                          {option.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
