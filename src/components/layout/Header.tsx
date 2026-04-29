import { Play } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'prompts': return '提示词配置 - 管理各个阶段的系统提示词';
      case 'chain': return '工作流编排 - 组装搭建提示词执行链路';
      case 'test': return '评测工作台 - 分模块或全链路交互测试 (文字/语音)';
      case 'compare': return 'A/B 效果对比 - 横向评估不同提示词生成效果';
      case 'models': return '底层模型配置 - ASR / LLM / TTS / RTC 引擎选择';
      default: return '工作区';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-900 text-sm font-medium tracking-wide">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-50 px-3 py-1 border border-slate-200 text-xs">
          <span className="text-slate-400 mr-2 font-bold uppercase tracking-wider text-[10px]">状态</span>
          <span className="text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            沙盒可用
          </span>
        </div>
      </div>
    </header>
  );
}
