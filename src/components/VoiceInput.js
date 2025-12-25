"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Activity } from 'lucide-react';

export default function VoiceInput({ onPromptReceived, onEnrichRequested }) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const conversation = useConversation({
        onConnect: () => setIsSpeaking(true),
        onDisconnect: () => setIsSpeaking(false),
        onMessage: (message) => {
            // Optional: Handle incoming messages if needed
        },
        onError: (error) => {
            console.error('ElevenLabs Error:', error);
            setIsSpeaking(false);
            const errorMessage = typeof error === 'string' ? error : (error?.message || String(error));
            console.warn('Erro na conexão de voz: ' + errorMessage);
        },
    });

    const startConversation = useCallback(async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
            if (!agentId) {
                alert('Agent ID não configurado (NEXT_PUBLIC_ELEVENLABS_AGENT_ID)');
                return;
            }

            await conversation.startSession({
                agentId: agentId,
                clientTools: {
                    generateImage: (parameters) => {
                        console.log("Client Tool 'generateImage' called with:", parameters);
                        const { prompt } = parameters;
                        if (prompt && onPromptReceived) {
                            onPromptReceived(prompt);
                        }
                        return "Gerando imagem com o prompt: " + prompt;
                    },
                    enrichPrompt: (parameters) => {
                        console.log("Client Tool 'enrichPrompt' called");
                        if (onEnrichRequested) {
                            onEnrichRequested();
                            return "Enriquecimento iniciado. O prompt está sendo melhorado pela IA.";
                        }
                        return "Função de enriquecimento não disponível.";
                    }
                }
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            alert('Erro ao iniciar conversa. Verifique o microfone.');
        }
    }, [conversation, onPromptReceived, onEnrichRequested]);

    const stopConversation = useCallback(async () => {
        await conversation.endSession();
    }, [conversation]);

    const toggleConversation = () => {
        if (conversation.status === 'connected') {
            stopConversation();
        } else {
            startConversation();
        }
    };

    const isConnected = conversation.status === 'connected';
    const isConnecting = conversation.status === 'connecting';

    return (
        <div className="relative flex items-center justify-center">
            {(isConnected || isConnecting) && (
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping pointer-events-none"></div>
            )}

            <button
                onClick={toggleConversation}
                disabled={isConnecting}
                className={`
                    relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                    transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] border
                    ${isConnecting ? 'bg-gray-800 border-gray-600 cursor-wait' : ''}
                    ${isConnected
                        ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20 shadow-[0_0_30px_rgba(255,0,0,0.3)]'
                        : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                    }
                    ${!isConnected && !isConnecting ? 'hover:scale-105 active:scale-95' : ''}
                `}
                title={isConnected ? "Parar Conversa" : "Falar com IA"}
            >
                {isConnecting ? (
                    <Activity className="w-8 h-8 animate-pulse text-blue-400" />
                ) : isConnected ? (
                    <div className="flex flex-col items-center">
                        <span className="mb-1">
                            <div className="flex gap-1 items-end h-4">
                                <div className="w-1 bg-current animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-1 bg-current animate-[bounce_1.2s_infinite] h-4"></div>
                                <div className="w-1 bg-current animate-[bounce_0.8s_infinite] h-3"></div>
                            </div>
                        </span>
                    </div>
                ) : (
                    <Mic className="w-8 h-8" />
                )}
            </button>
        </div>
    );
}
