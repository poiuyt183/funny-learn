"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, RefreshCw, X, Sparkles, StopCircle, VoicemailIcon } from "lucide-react";
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
    const {
        speak: speakTTS, // Function to start speech with provided text and options
        Text, // Component that renders speech text in a <div> and supports standard HTML <div> props
        speechStatus, // String that stores current speech status
        isInQueue, // Indicates whether the speech is currently playing or waiting in the queue
        start, // Function to start the speech or put it in queue
        pause, // Function to pause the speech
        stop, // Function to stop the speech or remove it from queue
    } = useSpeak();
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
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Speech Recognition & TTS
    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-ignore - webkitSpeechRecognition is standard in Chrome/Edge
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = "vi-VN";
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onstart = () => {
                    setIsListening(true);
                    setInterimTranscript("");
                    setError(null);
                };

                recognition.onresult = (event: SpeechRecognitionEvent) => {
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
                        handleSendMessage(final);
                    }

                    // Debounce silence detection (auto-send after 2s silence for kids)
                    if (interim) {
                        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = setTimeout(() => {
                            recognition.stop();
                            if (interim.trim()) {
                                handleSendMessage(interim);
                            }
                        }, 2000);
                    }
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error", event.error);
                    if (event.error === "not-allowed") {
                        setError("Cho mình mượn micro để nói chuyện nhé! 🎤");
                    } else if (event.error === "no-speech") {
                        // Ignore
                    } else {
                        // setError("Có lỗi chút xíu, thử lại nha! 🐛");
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
    }, []);

    // Initial greeting
    useEffect(() => {
        if (mascot.baseGreeting && voices.length > 0) {
            // Basic check to ensure we only say hello once
            const hasGreeted = messages.some(m => m.id === "greeting");
            if (!hasGreeted) {
                const greetingId = "greeting";
                const greeting = {
                    id: greetingId,
                    role: "assistant" as const,
                    content: mascot.baseGreeting,
                    timestamp: new Date(),
                };
                setMessages([greeting]);

                // Small delay to ensure UI is ready
                setTimeout(() => speakTTS(mascot.baseGreeting, {
                    pitch: 1, rate: 1, volume: 1, lang: "en-US", voiceURI: "Samantha", autoPlay: false, highlightText: false, showOnlyHighlightedText: false, highlightMode: "word", enableDirectives: "false"
                }), 500);
            }
        }
    }, [voices, mascot.baseGreeting]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, interimTranscript]);

    const startListening = () => {
        if (isSpeaking) {
            stopSpeaking();
        }
        // Slight delay to ensure TTS stopped
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

    const speak = (text: string) => {
        if (!synthRef.current) return;

        synthRef.current.cancel();

        setTimeout(() => {
            if (!synthRef.current) return;
            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance;

            // Voice selection logic
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
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isProcessing) return;

        stopListening();
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
                speak(result.response);
            } else {
                const errorMsg = result.error || "Có lỗi xíu, thử lại nha!";
                speak(errorMsg);
                if (result.flagged) {
                    toast.warning("Nói chuyện lịch sự nhé!", { icon: "🤐" });
                }
            }
        } catch (err) {
            console.error("Chat error:", err);
            toast.error("Lỗi kết nối rồi!", { icon: "🔌" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-indigo-50 flex flex-col items-center overflow-hidden font-heading">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[20%] w-[80vh] h-[80vh] bg-yellow-300 rounded-full blur-3xl opacity-30"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[20%] w-[80vh] h-[80vh] bg-rose-300 rounded-full blur-3xl opacity-30"
                />
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "110vh", x: Math.random() * 100 + "vw" }}
                        animate={{ y: "-10vh" }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 10
                        }}
                        className="absolute text-4xl opacity-20"
                    >
                        {["✨", "🎵", "⭐", "🎈", "🚀"][i % 5]}
                    </motion.div>
                ))}
            </div>

            {/* Header / Exit */}
            <div className="absolute top-4 right-4 z-50">
                <a
                    href={`/learn/${childId}`}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-clay text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                >
                    <X className="w-8 h-8" strokeWidth={3} />
                </a>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 p-4 pb-48">

                {/* Mascot Stage */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-8"
                >
                    {/* Breathing/Speaking Glow */}
                    <motion.div
                        animate={{
                            scale: isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                            opacity: isSpeaking ? 0.8 : 0.3
                        }}
                        transition={{ repeat: Infinity, duration: isSpeaking ? 0.5 : 3 }}
                        className="absolute inset-0 bg-white rounded-full blur-xl"
                    />

                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-clay overflow-hidden bg-white">
                        <img
                            src={mascot.imageUrl || "/api/placeholder/256/256"}
                            alt={mascot.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mascot Name Badge */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border-2 border-indigo-100">
                        <span className="text-xl font-bold text-indigo-600 truncate max-w-[200px] block">
                            {mascot.name}
                        </span>
                    </div>
                </motion.div>

                {/* Messages Area (Recent bubbles) */}
                <div className="w-full h-full max-h-[40vh] overflow-y-auto px-4 space-y-4 flex flex-col scrollbar-hide">
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-white/60 backdrop-blur px-6 py-4 rounded-3xl mx-auto"
                            >
                                <p className="text-slate-600 text-lg">Chào {childName}! Mình là {mascot.name} 👋</p>
                                <p className="text-slate-500 text-sm">Bấm nút tròn đung đưa để nói chuyện nhé!</p>
                            </motion.div>
                        )}

                        {messages.slice(-3).map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                className={cn(
                                    "flex w-full",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[85%] px-6 py-4 text-lg md:text-xl font-medium shadow-md relative",
                                    msg.role === "user"
                                        ? "bg-yellow-400 text-indigo-900 rounded-[2rem] rounded-tr-none"
                                        : "bg-white text-slate-700 rounded-[2rem] rounded-tl-none border-2 border-indigo-50"
                                )}>
                                    {msg.content}
                                    {/* Bubble Tail */}
                                    <div className={cn(
                                        "absolute top-0 w-6 h-6",
                                        msg.role === "user"
                                            ? "-right-3 bg-[radial-gradient(circle_at_bottom_left,_transparent_15px,_#FACC15_15px)]"
                                            : "-left-3 bg-[radial-gradient(circle_at_bottom_right,_transparent_15px,_white_15px)]"
                                    )} />
                                </div>
                            </motion.div>
                        ))}

                        {interimTranscript && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex w-full justify-end"
                            >
                                <div className="max-w-[85%] px-6 py-4 bg-yellow-100/80 text-indigo-900/60 rounded-[2rem] rounded-tr-none border-2 border-dashed border-yellow-300 italic">
                                    {interimTranscript}...
                                </div>
                            </motion.div>
                        )}

                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex w-full justify-start"
                            >
                                <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-sm flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                    </div>
                                    <span className="text-indigo-400 text-sm font-bold">Đang suy nghĩ...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Bottom Control Deck */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-[3rem] z-30 flex items-center justify-center gap-8 pb-4">

                {/* Refresh Button */}
                <button
                    onClick={() => {
                        speakTTS("Hello from useSpeak!", {
                            rate: 1.2,
                            lang: "en-US",
                            pitch: 1,
                            volume: 0.9,
                            voiceURI: "Google US English",
                        });
                    }}
                    className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 hover:bg-indigo-100 transition-colors btn-bounce"
                    title="Bật trả lời bằng giọng nói"
                >
                    <Volume2 className="w-6 h-6" />
                </button>
                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 hover:bg-indigo-100 transition-colors btn-bounce"
                    title="Làm mới"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>

                {/* BIG Microphone Button */}
                <div className="relative -mt-10">
                    {/* Ring Pulse Animation */}
                    {isListening && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 bg-indigo-400 rounded-full -z-10"
                            />
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                                className="absolute inset-0 bg-indigo-200 rounded-full -z-10"
                            />
                        </>
                    )}

                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={cn(
                            "w-28 h-28 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.4)] transition-all duration-300 border-4 border-white btn-bounce",
                            isListening
                                ? "bg-rose-500 scale-110"
                                : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-105"
                        )}
                    >
                        {isListening ? (
                            <div className="flex items-center gap-1 h-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 30 + Math.random() * 20, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                                        className="w-2 bg-white rounded-full mx-[1px]"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Mic className="w-12 h-12 text-white" strokeWidth={2.5} />
                        )}
                    </button>
                    {!isListening && !isSpeaking && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-md">
                            <Sparkles className="w-5 h-5 text-yellow-800" />
                        </div>
                    )}
                </div>

                {/* Stop TTS Button */}
                {isSpeaking ? (
                    <button
                        onClick={stopSpeaking}
                        className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-200 transition-colors btn-bounce animate-pulse"
                        title="Dừng đọc"
                    >
                        <Volume2 className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="w-14 h-14 pointer-events-none opacity-0" /> // Spacer
                )}

            </div>

            {/* Error Toast styled inline (optional, using sonner mostly) */}
            {error && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-20 bg-rose-500 text-white px-6 py-3 rounded-full shadow-lg z-50 font-bold flex items-center gap-2"
                >
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)} className="opacity-80 hover:opacity-100"><X size={18} /></button>
                </motion.div>
            )}
        </div>
    );
}
