export type RunScenario = 'T0' | 'ICEBREAK' | 'FUNNEL' | 'COLD_SCENE' | 'MATCHING' | 'CUSTOM';

export type StageId = 'audio_in' | 'vad' | 'asr' | 'context' | 'llm' | 'intent' | 'state_machine' | 'tts' | 'audio_out';

export type EventType = 
  | 'audio_chunk_received' | 'vad_opened' | 'vad_closed' 
  | 'asr_partial' | 'asr_final' 
  | 'llm_request_sent' | 'llm_first_token' | 'llm_token_stream' | 'llm_final'
  | 'intent_parsed' | 'state_transition_requested' | 'state_transition_applied'
  | 'tts_started' | 'tts_first_audio' | 'tts_completed'
  | 'rtc_playback_started' | 'user_interrupt_detected'
  | 'pipeline_cancelled' | 'timeout' | 'error';

export interface DebugRun {
  runId: string;
  scenario: RunScenario;
  initialState: string;
  inputMode: 'audio' | 'text' | 'batch_audio';
  modules: StageId[];
  createdAt: number;
  tags: string[];
}

export interface StageExecution {
  stageId: StageId;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt?: number;
  firstByteAt?: number;
  endedAt?: number;
  inputPayload: any;
  outputPayload: any;
  configSnapshot: any;
  metrics: Record<string, any>;
}

export interface TraceEvent {
  id: string;
  runId: string;
  timestamp: number;
  type: EventType;
  stageId: StageId;
  payload: any;
}

export interface StateMachineSnapshot {
  currentState: string;
  historicalStates: string[];
  activeTimers: string[];
}
