import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, SparklesIcon, StopIcon } from '@heroicons/react/24/solid';

export default function FloatingInput({
    prompt,
    setPrompt,
    onGenerate,
    onRandomPrompt,
    onAiEnrich,
    onOpenSidebar,
    isPromptLoading,
    activeGenerations,
    model,
    setModel,
    aspectRatio,
    setAspectRatio,
    resolution,
    setResolution
}) {
    const [isAspectRatioPopoverOpen, setAspectRatioPopoverOpen] = useState(false);

    // Mock cost logic
    const cost = model === 'nano-banana-max' ? 10 : 2;

    return (
        <div className="relative mx-auto w-[95%] max-w-[900px] z-30 mb-8 font-sans">
            <div className="bg-[#121212]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] p-2 pl-4 shadow-2xl flex flex-col md:flex-row items-end md:items-center gap-4 relative transition-all group hover:border-white/20 ring-1 ring-white/5">

                {/* Left Controls (Settings & Aspect) */}
                <div className="flex items-center gap-3 self-center md:self-auto py-1">
                    <button
                        onClick={onOpenSidebar}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                        title="Configurações"
                    >
                        <AdjustmentsHorizontalIcon className="w-6 h-6" />
                    </button>

                    {/* Aspect Ratio */}
                    <div className="relative">
                        <button
                            onClick={() => setAspectRatioPopoverOpen(!isAspectRatioPopoverOpen)}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                            title="Proporção"
                        >
                            {aspectRatio === '1:1' && <StopIcon className="w-6 h-6" />}
                            {aspectRatio === '9:16' && <div className="w-3.5 h-6 border-[2px] border-current rounded-[3px]"></div>}
                            {aspectRatio === '16:9' && <div className="w-6 h-3.5 border-[2px] border-current rounded-[3px]"></div>}
                        </button>

                        {isAspectRatioPopoverOpen && (
                            <div className="absolute bottom-full left-0 mb-4 bg-[#18181b] border border-white/10 p-5 rounded-3xl shadow-2xl w-72 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                                <h3 className="text-xs font-bold tracking-widest text-zinc-500 mb-3 uppercase px-1">Proporção da Imagem</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {['1:1', '9:16', '16:9'].map((ratio) => (
                                        <button
                                            key={ratio}
                                            onClick={() => { setAspectRatio(ratio); setAspectRatioPopoverOpen(false); }}
                                            className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${aspectRatio === ratio ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-800'}`}
                                        >
                                            <div className={`border-[2px] border-current rounded-sm ${ratio === '1:1' ? 'w-6 h-6' : ratio === '9:16' ? 'w-4 h-6' : 'w-6 h-4'}`}></div>
                                            <span className="text-[11px] font-bold">{ratio}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10"></div>

                {/* Main Input */}
                <div className="flex-1 w-full min-w-0 relative py-1">
                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            e.target.style.height = 'auto';
                            const newHeight = Math.min(e.target.scrollHeight, 150);
                            e.target.style.height = `${Math.max(newHeight, 52)}px`;
                        }}
                        placeholder="Descreva seu sonho..."
                        className="w-full bg-transparent text-gray-100 placeholder-zinc-500 text-[16px] resize-none outline-none py-3.5 px-2 scrollbar-hide leading-relaxed min-h-[52px] font-medium tracking-wide selection:bg-indigo-500/30"
                        style={{ height: '52px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onGenerate();
                            }
                        }}
                    />
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-4 pr-2 pb-2 md:pb-0 w-full md:w-auto justify-end">

                    {/* Random & Enrich */}
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                        <button
                            onClick={onRandomPrompt}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95"
                            title="Sorte"
                        >
                            <span className="text-xl filter drop-shadow-lg">🎲</span>
                        </button>
                        <button
                            onClick={onAiEnrich}
                            disabled={isPromptLoading}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPromptLoading ? 'text-purple-400 animate-spin bg-purple-500/10' : 'text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 active:scale-95'}`}
                            title="Enriquecer"
                        >
                            <SparklesIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Model Toggle & Button Container */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={onGenerate}
                            disabled={activeGenerations >= 4}
                            className="h-12 px-7 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[20px] font-bold text-sm tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                            {activeGenerations > 0 ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>GERAR</span>
                                    <span className="bg-black/20 border border-white/10 text-white/90 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1.5">{cost * 10}</span>
                                </>
                            )}
                        </button>

                        {/* Tiny Model Toggle embedded below */}
                        <div className="flex bg-[#000] p-[3px] rounded-lg border border-white/10 relative shadow-sm">
                            <button
                                onClick={() => setModel('nano-banana-std')}
                                className={`px-2.5 py-0.5 rounded-[5px] text-[9px] font-bold tracking-wider transition-all ${model === 'nano-banana-std' ? 'bg-zinc-800 text-white shadow-sm border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                            >
                                STD
                            </button>
                            <button
                                onClick={() => setModel('nano-banana-max')}
                                className={`px-2.5 py-0.5 rounded-[5px] text-[9px] font-bold tracking-wider transition-all ${model === 'nano-banana-max' ? 'bg-indigo-600 text-white shadow-sm border border-white/10' : 'text-zinc-600 hover:text-zinc-400'}`}
                            >
                                PRO
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
