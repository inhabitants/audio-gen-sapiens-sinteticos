import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, SparklesIcon, StopIcon, RectangleStackIcon } from '@heroicons/react/24/solid';

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

    // Mock cost/credits for display since we removed auth
    const credits = 9999;
    const cost = model === 'nano-banana-max' ? 5 : 2;

    return (
        <div className="relative mx-auto w-[95%] max-w-4xl z-30">
            <div className="bg-[#111]/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-3 shadow-2xl flex flex-col md:flex-row items-center gap-2 relative focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">

                {/* Text Input */}
                <div className="w-full md:flex-1 relative min-w-0 order-1 md:order-2">
                    <textarea
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            e.target.style.height = 'auto';
                            const newHeight = Math.min(e.target.scrollHeight, 200);
                            e.target.style.height = `${Math.max(newHeight, 56)}px`;
                        }}
                        ref={(ref) => {
                            if (ref) {
                                ref.style.height = 'auto';
                                const newHeight = Math.min(ref.scrollHeight, 200);
                                ref.style.height = `${Math.max(newHeight, 80)}px`;
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onGenerate();
                            }
                        }}
                        placeholder="Descreva seu sonho..."
                        className="w-full bg-transparent text-white placeholder-zinc-500 text-base resize-none outline-none py-3 px-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent leading-relaxed min-h-[80px]"
                        style={{ height: '80px' }}
                    />
                </div>

                {/* Toolbar Row */}
                <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap items-center justify-between md:contents order-2 md:order-1 gap-2">

                    <div className="flex items-center gap-2 md:order-1">
                        <button
                            onClick={onOpenSidebar}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0 border border-zinc-800 md:border-transparent"
                            title="Opções Avançadas"
                        >
                            <AdjustmentsHorizontalIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Aspect Ratio Trigger */}
                        <div className="relative">
                            <button
                                onClick={() => setAspectRatioPopoverOpen(!isAspectRatioPopoverOpen)}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0 border border-zinc-800 md:border-transparent"
                                title="Proporção"
                            >
                                {aspectRatio === '1:1' && <StopIcon className="w-5 h-5 md:w-6 md:h-6 border-2 border-current rounded-sm p-0.5" />}
                                {aspectRatio === '9:16' && <div className="w-3 h-5 md:w-4 md:h-6 border-2 border-current rounded-sm bg-transparent"></div>}
                                {aspectRatio === '16:9' && <div className="w-5 h-3 md:w-6 md:h-4 border-2 border-current rounded-sm bg-transparent"></div>}
                            </button>

                            {isAspectRatioPopoverOpen && (
                                <div className="absolute bottom-full left-0 mb-4 bg-white text-black p-6 rounded-3xl shadow-2xl w-80 animate-in slide-in-from-bottom-5 z-50">
                                    <h3 className="text-xs font-bold tracking-widest text-zinc-500 mb-4 uppercase">Proporção</h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        <button onClick={() => { setAspectRatio('1:1'); setAspectRatioPopoverOpen(false); }} className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                            <div className="w-8 h-8 border-2 border-black bg-zinc-200 rounded-md"></div>
                                            <span className="text-[10px] font-bold text-zinc-500">1:1</span>
                                        </button>
                                        <button onClick={() => { setAspectRatio('9:16'); setAspectRatioPopoverOpen(false); }} className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                            <div className="w-5 h-8 border-2 border-black bg-zinc-200 rounded-md"></div>
                                            <span className="text-[10px] font-bold text-zinc-500">9:16</span>
                                        </button>
                                        <button onClick={() => { setAspectRatio('16:9'); setAspectRatioPopoverOpen(false); }} className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                            <div className="w-8 h-5 border-2 border-black bg-zinc-200 rounded-md"></div>
                                            <span className="text-[10px] font-bold text-zinc-500">16:9</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:order-3 flex-1 justify-end w-full md:w-auto">
                        <div className="flex items-center gap-2 ml-auto md:ml-0">
                            {/* Dice / Randomizer */}
                            <button
                                onClick={onRandomPrompt}
                                className="flex w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center transition-all group md:hover:bg-zinc-800 border border-zinc-800 md:border-transparent"
                                title="Sorte"
                            >
                                <span className="text-xl">🎲</span>
                            </button>

                            {/* Ai Enrich */}
                            <button
                                onClick={onAiEnrich}
                                disabled={isPromptLoading}
                                className={`h-10 px-3 rounded-full flex items-center justify-center gap-2 transition-all border ${isPromptLoading ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-zinc-500 border-zinc-800 md:border-transparent hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20'}`}
                                title="Enriquecer com IA"
                            >
                                <SparklesIcon className={`w-5 h-5 ${isPromptLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="hidden md:block w-px h-8 bg-zinc-800 mx-1"></div>

                        <div className="flex flex-col gap-2 items-center ml-auto md:ml-0 w-full md:w-auto mt-2 md:mt-0">
                            <button
                                onClick={onGenerate}
                                disabled={activeGenerations >= 4}
                                className="h-10 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all active:scale-95 w-full md:w-32"
                            >
                                {activeGenerations > 0 ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span>GERAR</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
