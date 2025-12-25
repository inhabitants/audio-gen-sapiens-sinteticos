'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import FloatingInput from '@/components/FloatingInput';
import PreviewCanvas from '@/components/PreviewCanvas';
import Sidebar from '@/components/Sidebar';
import VoiceInput from '@/components/VoiceInput';
import { LUCKY_PROMPTS } from '@/data/luckyPromptsData';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('nano-banana-max');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState('1K');
  const [imageHistory, setImageHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPromptLoading, setIsPromptLoading] = useState(false); // For AI enrich

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * LUCKY_PROMPTS.length);
    setPrompt(LUCKY_PROMPTS[randomIndex]);
  };

  const handleAiPrompt = async () => {
    // Mock enrich for now or implement if API available
    alert("Enrich functionality coming soon in open source version!");
  };

  const handleVoicePrompt = (voicePrompt) => {
    setPrompt(voicePrompt);
    handleGenerate(voicePrompt);
  };

  const handleGenerate = async (overridePrompt = null) => {
    const p = overridePrompt || prompt;
    if (!p) return alert("Digite um prompt!");

    const tempId = Date.now().toString();

    // Optimistic UI
    const optimisticItem = {
      id: tempId,
      url: null,
      prompt: p,
      status: 'loading',
    };
    setImageHistory(prev => [...prev, optimisticItem]);

    try {
      const formData = new FormData();
      formData.append('prompt', p);
      formData.append('model', model);
      formData.append('aspectRatio', aspectRatio);
      formData.append('resolution', resolution);

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setImageHistory(prev => prev.map(item =>
        item.id === tempId ? {
          ...item,
          status: 'success',
          url: data.imageUrl
        } : item
      ));

    } catch (e) {
      console.error(e);
      setImageHistory(prev => prev.map(item =>
        item.id === tempId ? {
          ...item,
          status: 'error',
          errorMessage: e.message
        } : item
      ));
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        model={model}
        setModel={setModel}
      />

      <main className="w-full h-screen flex flex-col items-center justify-center relative z-10 bg-[#050505]/50">
        <div className="flex-1 w-full h-full overflow-hidden relative">
          <PreviewCanvas
            history={imageHistory}
            onImageClick={(item) => console.log("Clicked", item)}
          />
        </div>

        <div className="w-full shrink-0 p-4 pb-8 z-30 bg-gradient-to-t from-black via-[#050505] to-transparent flex flex-col items-center gap-4">
          <VoiceInput onPromptReceived={handleVoicePrompt} />
          <FloatingInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={() => handleGenerate()}
            onRandomPrompt={handleRandomPrompt}
            onAiEnrich={handleAiPrompt}
            onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            model={model}
            setModel={setModel}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            resolution={resolution}
            setResolution={setResolution}
            activeGenerations={imageHistory.filter(x => x.status === 'loading').length}
          />
        </div>
      </main>
    </div>
  );
}
