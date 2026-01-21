"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, RefreshCw, X, Sparkles, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { chatWithContext } from "@/actions/chat-voice";
import { useSpeak } from "react-text-to-speech";

interface VoiceChatTransport {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface VoiceChatClientProps {
    childId: string;
    mascot: {
        id: string;
        name: string;
        imageUrl: string;
        baseGreeting: string;
        basePersonality: string;
    };
    childName: string;
}

export function VoiceChatClient({ childId, mascot, childName }: VoiceChatClientProps) {
    const { speak: speakTTS } = useSpeak();

    // State
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const [messages, setMessages] = useState<VoiceChatTransport[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Refs
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isProcessing) return;

        // Stop listening logic embedded here to avoid circular dep, but we can call stopListening if we hoist it or use ref
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        }

        setIsProcessing(true);

        const userMsg: VoiceChatTransport = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const result = await chatWithContext({
                childId,
                message: text,
                sessionId,
            });

            if (result.success && result.response) {
                const aiMsg: VoiceChatTransport = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: result.response,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMsg]);
                // We'll trigger speak in the effect or directly here if we can access the speak function
                // Since speak is defined below, we might need to move this logic or use a ref for the speak function.
                // For simplicity in this fix, we will define speak outside or use a ref. 
                // However, to minimize rewrite, let's just define speak before handleSendMessage?
                // No, speak uses state.
                // Let's rely on the fact that we can call speak here if we define it before, or wrap in useCallback.
            } else {
                const errorMsg = result.error || "Có lỗi xíu, thử lại nha!";
                // speak(errorMsg); // Same issue
                if (result.flagged) {
                    toast.warning("Nói chuyện lịch sự nhé!", { icon: "🤐" });
                }
                return errorMsg;
            }
            return result.response;
        } catch (err) {
            console.error("Chat error:", err);
            toast.error("Lỗi kết nối rồi!", { icon: "🔌" });
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, [childId, sessionId, isProcessing, setIsListening, setMessages]);

    const speak = useCallback((text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();

        setTimeout(() => {
            if (!synthRef.current) return;
            const utterance = new SpeechSynthesisUtterance(text);

            // Voice selection: prioritize Vietnamese Google/Microsoft voices
            const availableVoices = voices.length > 0 ? voices : synthRef.current.getVoices();
            let selectedVoice = availableVoices.find(v =>
                (v.name.includes("Google") || v.name.includes("Microsoft")) && v.lang.includes("vi")
            );
            if (!selectedVoice) selectedVoice = availableVoices.find(v => v.lang.includes("vi"));
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.lang = "vi-VN";
            utterance.rate = 1.0;
            utterance.pitch = 1.1;
            utterance.volume = 1;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthRef.current.speak(utterance);
        }, 50);
    }, [voices, setIsSpeaking]);

    // Update handleSendMessage to actually speak
    const processMessage = async (text: string) => {
        const responseText = await handleSendMessage(text);
        if (responseText) {
            speak(responseText);
        }
    };

    // Use refs for callbacks to avoid re-initializing SpeechRecognition on state changes
    const processMessageRef = useRef(processMessage);

    useEffect(() => {
        processMessageRef.current = processMessage;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processMessage]); // Optimization to keep ref current

    // Initialize Speech Recognition & TTS
    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-expect-error - webkitSpeechRecognition is standard in Chrome/Edge
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = "vi-VN";
                // Chrome on Android/Desktop behaves differently with 'continuous'. 
                // We want it to keep listening, but we also want final results.
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onstart = () => {
                    setIsListening(true);
                    setInterimTranscript("");
                    setError(null);
                };

                recognition.onresult = (event: any) => {
                    let interim = "";
                    let final = "";

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            final += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }

                    setInterimTranscript(interim);

                    // If we have final results, process them
                    if (final) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        if (processMessageRef.current) processMessageRef.current(final);
                    }

                    // Debounce silence detection (auto-send after 2s silence for kids)
                    if (interim) {
                        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = setTimeout(() => {
                            recognition.stop();
                            if (interim.trim()) {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                if (processMessageRef.current) processMessageRef.current(interim);
                            }
                        }, 2000);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    if (event.error === "not-allowed") {
                        setError("Cho mình mượn micro để nói chuyện nhé! 🎤");
                    }
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                    setInterimTranscript("");
                };

                recognitionRef.current = recognition;
            } else {
                setError("Trình duyệt này chưa biết nghe, dùng Chrome nhé! 🌐");
            }

            // Initialize TTS
            synthRef.current = window.speechSynthesis;
            const updateVoices = () => {
                const loadedVoices = window.speechSynthesis.getVoices();
                setVoices(loadedVoices);
            };
            updateVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = updateVoices;
            }
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            if (synthRef.current) synthRef.current.cancel();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
        // Dependencies are now stable or refs, so this effect runs only once on mount
    }, []);

    // Initial greeting
    useEffect(() => {
        if (mascot.baseGreeting && voices.length > 0) {
            const hasGreeted = messages.some(m => m.id === "greeting");
            if (!hasGreeted) {
                const greetingId = "greeting";
                const greeting: VoiceChatTransport = {
                    id: greetingId,
                    role: "assistant",
                    content: mascot.baseGreeting,
                    timestamp: new Date(),
                };
                setMessages([greeting]);

                setTimeout(() => speak(mascot.baseGreeting), 800);
            }
        }
    }, [voices, mascot.baseGreeting, messages, speak, setMessages]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, interimTranscript]);

    const startListening = () => {
        if (isSpeaking) {
            stopSpeaking();
        }
        setTimeout(() => {
            try {
                recognitionRef.current?.start();
            } catch (err) {
                console.warn("Recognition start failed", err);
            }
        }, 100);
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#FDF6F8] flex flex-col items-center overflow-hidden font-heading selection:bg-rose-200">
            {/* 🌈 Dynamic Background World */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Mesh */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-100 rounded-full blur-[100px] opacity-60 animate-pulse [animation-delay:2s]" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-200 rounded-full blur-[80px] opacity-40 animate-pulse [animation-delay:4s]" />

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
                        animate={{ y: "-10vh", opacity: [0, 0.4, 0] }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "linear"
                        }}
                        className="absolute text-4xl"
                    >
                        {["☁️", "✨", "🎵", "🦄", "🌈", "⭐"][i % 6]}
                    </motion.div>
                ))}
            </div>

            {/* 🚪 Top Controls (Satellites) */}
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={() => window.location.reload()}
                    className="w-12 h-12 bg-white/80 backdrop-blur rounded-2xl shadow-sm text-indigo-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="absolute top-6 right-6 z-50">
                <a
                    href={`/ learn / ${childId} `}
                    className="w-12 h-12 bg-white/80 backdrop-blur rounded-2xl shadow-sm text-rose-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <X size={24} strokeWidth={2.5} />
                </a>
            </div>

            {/* 🎭 Mascot Stage */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 px-4 pt-10 pb-40">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    {/* Magical Aura */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-200/50 to-transparent rounded-full blur-2xl scale-150 translate-y-4" />

                    {/* Mascot Image Container */}
                    <motion.div
                        animate={{
                            y: isSpeaking ? [0, -5, 0] : [0, -10, 0],
                            scale: isSpeaking ? [1, 1.02, 1] : 1
                        }}
                        transition={{
                            y: { duration: isSpeaking ? 0.3 : 4, repeat: Infinity, ease: "easeInOut" },
                            scale: { duration: 0.2, repeat: Infinity }
                        }}
                        className="relative w-56 h-56 md:w-72 md:h-72"
                    >
                        <div className="absolute inset-0 bg-white rounded-full border-[6px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                            <img
                                src={mascot.imageUrl || "/api/placeholder/256/256"}
                                alt={mascot.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-full">
                            <div className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm border border-indigo-50">
                                <span className="text-lg font-bold text-indigo-900">{mascot.name}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 💬 Conversation Area */}
                <div className="w-full mt-8 flex flex-col items-center justify-end min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {isSpeaking ? (
                            // Mascot Speaking Bubble
                            <motion.div
                                key="assistant-bubble"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative max-w-[90%] md:max-w-2xl bg-white p-6 rounded-[2rem] shadow-xl border-2 border-indigo-100"
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-t-2 border-l-2 border-indigo-100" />
                                <p className="text-xl md:text-2xl text-slate-700 font-medium text-center leading-relaxed">
                                    {messages.filter(m => m.role === "assistant").slice(-1)[0]?.content}
                                </p>
                            </motion.div>
                        ) : interimTranscript ? (
                            // User Live Transcript
                            <motion.div
                                key="transcript"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-yellow-100/90 backdrop-blur px-8 py-4 rounded-3xl border-2 border-yellow-200 border-dashed"
                            >
                                <p className="text-xl text-yellow-800 font-medium">{interimTranscript}...</p>
                            </motion.div>
                        ) : isProcessing ? (
                            // Thinking State
                            <motion.div
                                key="thinking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full"
                            >
                                <div className="flex gap-1.5">
                                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-3 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                                <span className="text-slate-500 font-medium">Đang suy nghĩ...</span>
                            </motion.div>
                        ) : messages.length === 0 ? (
                            // Welcome message if no messages yet
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-white/60 backdrop-blur px-6 py-4 rounded-3xl mx-auto"
                            >
                                <p className="text-slate-600 text-lg">Chào {childName}! Mình là {mascot.name} 👋</p>
                                <p className="text-slate-500 text-sm">Bấm nút tròn giữa để nói chuyện nhé!</p>
                            </motion.div>
                        ) : (
                            // Idle Hint
                            <motion.p
                                key="hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                className="text-slate-400 font-medium text-lg"
                            >
                                Bấm micro để nói chuyện nào! 👇
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 🎛️ Control Deck */}
            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 z-30 flex items-center justify-center">
                {/* Main Microphone Button */}
                <div className="relative -top-6">
                    {/* Ring Animations */}
                    {isListening && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-rose-300 rounded-full -z-10"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
                                className="absolute inset-0 bg-rose-200 rounded-full -z-20"
                            />
                        </>
                    )}

                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={cn(
                            "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] border-[6px] border-white active:scale-95 group",
                            isListening
                                ? "bg-rose-500 scale-105 rotate-3"
                                : "bg-gradient-to-tr from-indigo-500 to-purple-600 hover:scale-105 hover:-translate-y-1"
                        )}
                    >
                        {isListening ? (
                            <div className="flex items-center gap-1 h-12">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 40 + Math.random() * 20, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                        className="w-1.5 md:w-2 bg-white rounded-full mx-[1px]"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Mic className="w-10 h-10 md:w-14 md:h-14 text-white group-hover:drop-shadow-lg" strokeWidth={2.5} />
                        )}
                    </button>

                    {/* Sparkle Hint */}
                    {!isListening && !isSpeaking && (
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg border-2 border-white"
                        >
                            <Sparkles size={20} fill="currentColor" />
                        </motion.div>
                    )}
                </div>

                {/* Side Actions (Floating) */}
                {isSpeaking && (
                    <motion.button
                        initial={{ scale: 0, x: -50 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0, x: -50 }}
                        onClick={stopSpeaking}
                        className="absolute right-[15%] md:right-[25%] -top-4 w-14 h-14 bg-rose-100 hover:bg-rose-200 text-rose-500 rounded-full flex items-center justify-center shadow-sm transition-colors"
                        title="Dừng nói"
                    >
                        <StopCircle size={28} />
                    </motion.button>
                )}
            </div>

            {/* Error Toast */}
            {error && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-rose-500 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-3"
                    >
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="opacity-80 hover:opacity-100"><X size={18} /></button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
