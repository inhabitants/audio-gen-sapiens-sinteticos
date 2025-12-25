import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function PreviewCanvas({ history, onImageClick }) {
    const bottomRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(10);
    const prevHistoryLengthRef = useRef(0);

    // Auto-scroll logic
    useEffect(() => {
        if (history && history.length > prevHistoryLengthRef.current) {
            const timer = setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
            return () => clearTimeout(timer);
        }
        prevHistoryLengthRef.current = history ? history.length : 0;
    }, [history]);

    const handleDownload = async (item) => {
        try {
            // Direct download since we don't have metadata injector or proxy
            const a = document.createElement('a');
            a.href = item.url; // Assuming Base64 or accessible URL
            a.download = `sapiens-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    if (!history || history.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center p-12 pb-32">
                <div className="text-center opacity-20 select-none">
                    <SparklesIcon className="w-32 h-32 mx-auto mb-6 text-white" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">OPEN</h1>
                    <p className="text-xl font-light text-zinc-400 tracking-[0.2em]">BETA 2</p>
                </div>
            </div>
        );
    }

    const visibleHistory = history.slice(-visibleCount);

    return (
        <div className="w-full h-full overflow-y-auto p-4 md:p-12 pb-12 scrollbar-hide">
            <div className="min-h-full flex flex-col justify-end gap-8">
                <div className="h-4 shrink-0"></div>

                {visibleHistory.map((item) => (
                    <div key={item.id} className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 shrink-0">
                        {item.status === 'loading' ? (
                            <div className="w-full aspect-square md:aspect-[3/2] bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                                <div className="text-center font-mono text-blue-400 animate-pulse">GENERATING...</div>
                            </div>
                        ) : (
                            <div className="group relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 transition-all hover:border-white/20">
                                <img
                                    src={item.url}
                                    className="w-auto h-auto max-w-[70%] max-h-[70vh] mx-auto object-contain bg-[#0a0a0a]"
                                    alt="Generated"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                                        className="bg-white/10 text-white p-3 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                                        title="Download"
                                    >
                                        <ArrowDownTrayIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} className="h-8 shrink-0"></div>
            </div>
        </div>
    );
}
