import React, { useState } from 'react';
import { XMarkIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Sidebar({
    isOpen,
    onClose,
    onToggle,
    model,
    setModel,
}) {
    return (
        <>
            <div className={`fixed inset-y-0 left-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-zinc-800 z-50 flex flex-col items-center py-8 gap-8 transition-all duration-300 
                ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0 md:w-20 w-0'}`}>

                {/* EXPANDED CONTENT */}
                <div className={`w-full h-full flex flex-col ${!isOpen && 'hidden'}`}>
                    <div className="flex justify-between items-center mb-8 px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
                            >
                                <ChevronDoubleLeftIcon className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-bold text-white tracking-tight">Estúdio</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-12 space-y-8">
                        {/* Model Control */}
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Qualidade</label>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setModel('nano-banana-std')}
                                    className={`p-3 rounded-xl border text-left transition-all ${model === 'nano-banana-std' ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                >
                                    <span className="block text-sm font-bold text-white">Standard</span>
                                </button>
                                <button
                                    onClick={() => setModel('nano-banana-max')}
                                    className={`p-3 rounded-xl border text-left transition-all ${model === 'nano-banana-max' ? 'bg-zinc-800 border-purple-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                >
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="block text-sm font-bold text-white">Pro</span>
                                        <SparklesIcon className="w-3 h-3 text-purple-400" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                            <p className="text-xs text-zinc-500">
                                Versão Open Source.
                                <br />Histórico salvo apenas localmente nesta sessão.
                            </p>
                        </div>

                    </div>
                </div>

                {/* MINI CONTENT (Hidden when open) */}
                <div className={`flex flex-col items-center gap-8 w-full px-2 ${isOpen && 'hidden'}`}>
                    <button
                        onClick={onToggle}
                        className="p-3 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-lg border border-zinc-800"
                    >
                        <ChevronDoubleRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
}
