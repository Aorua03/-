import { useState, useRef, useEffect } from 'react';
import { usePrompts } from '../context/PromptContext';
import { Mic, Send, Volume2, Activity, Play, StopCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  type: 'text' | 'audio';
  isStreaming?: boolean;
}

export function TestingPanel() {
  const { modules, chainConfig } = usePrompts();
  const [selectedModule, setSelectedModule] = useState<string>('full-chain');
  const [interactionMode, setInteractionMode] = useState<'public_chat' | 'on_mic'>('on_mic');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [outputMode, setOutputMode] = useState<'text_tts' | 'text_only'>('text_tts');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim() || isProcessing) return;

    const actualInputMode = interactionMode === 'public_chat' ? 'text' : inputMode;
    const actualOutputMode = interactionMode === 'public_chat' ? 'text_only' : outputMode;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      type: actualInputMode === 'voice' ? 'audio' : 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setUserInput('');
    setIsProcessing(true);

    // Mock processing & streaming
    setTimeout(() => {
      const responseId = (Date.now() + 1).toString();
      
      // Initial empty response with streaming flag
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'assistant',
        content: '',
        thinking: '',
        type: actualOutputMode === 'text_tts' ? 'audio' : 'text',
        isStreaming: true
      }]);

      const promptName = selectedModule === 'full-chain' 
        ? '智能代理路由系统 (全链路)' 
        : modules.find(p => p.id === selectedModule)?.name || selectedModule;

      let mockIntent = "寻求聊天陪伴或进行互动";
      let mockEmotion = "平稳 / 友好";
      let mockStrategy = "维持设定人设，使用15字以内口语化短句，不带动作描写，自然延展话题。";
      let finalResponseText = "我是小蜜桃呀，很高兴见到你！这会儿正无聊呢，陪我聊会天吧~";

      if (interactionMode === 'public_chat') {
        mockIntent = "在公屏打字聊天，处于未上麦游离状态";
        mockEmotion = "观望 / 试探 / 害羞";
        mockStrategy = "触发引导上麦机制：必须用亲切、撒娇的语气邀请用户上麦，强调‘上面更好玩’或‘打字太累啦’，不再延续现有话题的内容深度。短句，不可严肃。";
        finalResponseText = "小哥哥，在下面打字多累呀？快上麦来和我一起玩嘛，我就在这里等你哦~";
      } else if (userInput.includes('机器人') || userInput.includes('AI') || userInput.includes('ai')) {
         mockIntent = "质疑连线对象的身份，试图确认对方是否为AI";
         mockEmotion = "好奇 / 怀疑 / 试探";
         mockStrategy = "触发防护规则：执行AI身份承认话术，态度坦然，并在句末抛出反问以将核心拉回聊天意图。";
         finalResponseText = "我是ai啊，但是这也不影响我和你聊天嘛{\"intent\": 0}";
      } else if (selectedModule === '1v1-silence' || (!userInput.trim() && selectedModule === 'full-chain')) {
         mockIntent = "长时间无文本或语音输入，处于挂机、离开或静默状态";
         mockEmotion = "游离 / 沉默 / 不活跃";
         mockStrategy = "执行冷场挽回策略：1句话内完成【唤醒注意】+【猜测原因】+【抛出生活化新话题】，严格控制在20字内。";
         finalResponseText = "宝，你怎么不说话啦？是不是在忙呀？这会儿要不要一起听听歌？";
      } else if (selectedModule === '1v1-chat-match-v2') {
         if (userInput.includes('好') || userInput.includes('可以') || userInput.includes('行')) {
           mockIntent = "明确同意邀约建议，接受并希望匹配新用户进入房间";
           mockEmotion = "积极 / 期待 / 兴趣高昂";
           mockStrategy = "判定转化成功（匹配节点）：按系统要求返回空纯本及 intent=1，以便通知业务后端触发匹配流转。";
           finalResponseText = "{\"intent\": 1}";
         } else {
           mockIntent = "在正常聊天流中回复，未触及转化点";
           mockEmotion = "轻快 / 放松";
           mockStrategy = "计算当前聊天上下文满5轮（阈值），触发强制转化话术，向用户询问是否找人一起玩。";
           finalResponseText = "诶，那你想找个人来这个房间一起玩下嘛？{\"intent\": 0}";
         }
      }

      let thinkingText = `<thinking>
[用户解析]
- 用户核心意图：${mockIntent}
- 瞬态情绪感知：${mockEmotion}

[执行链路]
- 当前调用节点：${promptName}
- 回复策略构建：${mockStrategy}
</thinking>`;

      // Step 1: Stream thinking
      let currentThinking = "";
      const thinkingInterval = setInterval(() => {
        if (currentThinking.length < thinkingText.length) {
          currentThinking += thinkingText[currentThinking.length];
          setMessages(prev => prev.map(msg => 
            msg.id === responseId ? { ...msg, thinking: currentThinking } : msg
          ));
        } else {
          clearInterval(thinkingInterval);
          
          // Step 2: Stream actual response
          let currentRes = "";
          const resInterval = setInterval(() => {
            if (currentRes.length < finalResponseText.length) {
              currentRes += finalResponseText[currentRes.length];
              setMessages(prev => prev.map(msg => 
                msg.id === responseId ? { ...msg, content: currentRes } : msg
              ));
            } else {
              clearInterval(resInterval);
              setIsProcessing(false);
              setMessages(prev => prev.map(msg => 
                msg.id === responseId ? { ...msg, isStreaming: false } : msg
              ));
            }
          }, 30);
        }
      }, 20);

    }, 500); // initial latency
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Settings Panel */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-slate-900 font-semibold text-sm">测试与评测环境</h3>
          <p className="text-xs text-slate-500 mt-1">设置测试的提示词模块及 I/O 方式</p>
        </div>
        
        <div className="p-5 space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">测试模块 (Target Module)</label>
            <select 
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full bg-white border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="full-chain">全链路测试 (自动按流程流转)</option>
              <optgroup label="单模块独立测试">
                {modules.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">互动方式 (Interaction Mode)</label>
            <div className="flex bg-slate-100 p-1 border border-slate-200">
              <button 
                onClick={() => setInteractionMode('public_chat')}
                className={`flex-1 text-xs py-1.5 transition-colors ${interactionMode === 'public_chat' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                未上麦公屏打字
              </button>
              <button 
                onClick={() => setInteractionMode('on_mic')}
                className={`flex-1 text-xs py-1.5 transition-colors ${interactionMode === 'on_mic' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                模拟已上麦
              </button>
            </div>
          </div>

          {interactionMode === 'on_mic' && (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">输入方式 (Input Mode)</label>
                <div className="flex bg-slate-100 p-1 border border-slate-200">
                  <button 
                    onClick={() => setInputMode('text')}
                    className={`flex-1 text-xs py-1.5 transition-colors ${inputMode === 'text' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    文字输入 (Text)
                  </button>
                  <button 
                    onClick={() => setInputMode('voice')}
                    className={`flex-1 text-xs py-1.5 transition-colors ${inputMode === 'voice' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    语音输入 (ASR)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">输出方式 (Output Mode)</label>
                <div className="flex bg-slate-100 p-1 border border-slate-200">
                  <button 
                    onClick={() => setOutputMode('text_tts')}
                    className={`flex-1 text-xs py-1.5 transition-colors ${outputMode === 'text_tts' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    文 + 语音 (TTS)
                  </button>
                  <button 
                    onClick={() => setOutputMode('text_only')}
                    className={`flex-1 text-xs py-1.5 transition-colors ${outputMode === 'text_only' ? 'bg-white text-blue-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    纯文字
                  </button>
                </div>
              </div>
            </>
          )}

          <hr className="border-slate-200" />

          <div>
             <button 
               onClick={handleClear}
               className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors"
             >
               <RefreshCw className="w-4 h-4" />
               清空当前会话
             </button>
          </div>
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        <div className="p-4 border-b border-slate-200 shrink-0 flex items-center justify-between bg-white text-sm">
          <div className="font-semibold text-slate-800 flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-600" />
            会话测试区
          </div>
          <div className="text-slate-500 text-xs">
            当前焦点: {selectedModule === 'full-chain' ? '全链路' : modules.find(p => p.id === selectedModule)?.name}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Activity className="w-8 h-8 opacity-50" />
              <p>在底部输入内容开始评测</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-blue-100 text-blue-900 border border-blue-200 px-4 py-3 max-w-[80%]">
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-1.5 mb-1 text-blue-700 text-[10px] font-bold">
                        <Mic className="w-3 h-3" /> ASR 语音输入模拟
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-300 p-4 w-full max-w-[90%] relative">
                    {/* Thinking Process */}
                    {(msg.thinking || msg.isStreaming) && (
                      <div className="mb-3 p-3 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono leading-relaxed">
                        <div className="text-slate-400 mb-1 flex items-center gap-2 uppercase tracking-widest text-[9px] font-bold">
                          <Activity className="w-3 h-3" /> LLM 思考中...
                        </div>
                        <div className="whitespace-pre-wrap">{msg.thinking}
                        {msg.isStreaming && !msg.content && <span className="animate-pulse inline-block w-1.5 h-3 bg-blue-500 ml-1 translate-y-0.5"></span>}
                        </div>
                      </div>
                    )}
                    
                    {/* Character Response */}
                    {(msg.content || !msg.isStreaming) && (
                      <div className="text-slate-800 text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                        {msg.content}
                        {msg.isStreaming && msg.content && <span className="animate-pulse inline-block w-1.5 h-3 bg-blue-500 ml-1 translate-y-0.5"></span>}
                      </div>
                    )}

                    {/* Audio Status */}
                    {msg.type === 'audio' && (
                       <div className="absolute -bottom-3 right-4 bg-white border border-blue-200 shadow-sm px-3 py-1 flex items-center gap-2 text-[10px] text-blue-600 font-bold">
                         {msg.isStreaming ? (
                           <Volume2 className="w-3 h-3 animate-pulse" />
                         ) : (
                           <Volume2 className="w-3 h-3" />
                         )}
                         {msg.isStreaming ? 'TTS 播报中...' : 'TTS 播报完成'}
                       </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
            {interactionMode === 'on_mic' && (
              <button 
                onClick={() => {
                  if(inputMode !== 'voice') setInputMode('voice');
                }}
                className={`w-10 h-10 shrink-0 border flex items-center justify-center transition-colors ${
                  inputMode === 'voice' ? 'bg-blue-50 text-blue-600 border-blue-300' : 'bg-white border-slate-300 text-slate-400 hover:text-blue-600'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={interactionMode === 'public_chat' ? '在公屏输入文字消息...' : (inputMode === 'voice' ? "请说话... (模拟语音转文字输入)" : "输入文字消息进行测试...")}
              className="flex-1 bg-white border border-slate-300 pl-4 pr-16 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isProcessing}
            />
            <button 
              onClick={handleSend}
              disabled={!userInput.trim() || isProcessing}
              className={`absolute right-1 w-14 h-8 flex items-center justify-center transition-colors ${
                !userInput.trim() || isProcessing ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
