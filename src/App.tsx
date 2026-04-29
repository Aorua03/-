/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PromptManager } from './components/PromptManager';
import { TestingPanel } from './components/TestingPanel';
import { ModelConfigManager } from './components/ModelConfigManager';
import { ABTestingPanel } from './components/ABTestingPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('prompts');

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} />
        <main className="flex-1 relative overflow-hidden">
          {activeTab === 'prompts' && <PromptManager />}
          {activeTab === 'test' && <TestingPanel />}
          {activeTab === 'compare' && <ABTestingPanel />}
          {activeTab === 'models' && <ModelConfigManager />}
        </main>
      </div>
    </div>
  );
}


