
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

function encode(bytes: Uint8Array) {
 let binary = '';
 const len = bytes.byteLength;
 for (let i = 0; i < len; i++) {
 binary += String.fromCharCode(bytes[i]);
 }
 return btoa(binary);
}

function decode(base64: string) {
 const binaryString = atob(base64);
 const len = binaryString.length;
 const bytes = new Uint8Array(len);
 for (let i = 0; i < len; i++) {
 bytes[i] = binaryString.charCodeAt(i);
 }
 return bytes;
}

async function decodeAudioData(
 data: Uint8Array,
 ctx: AudioContext,
 sampleRate: number,
 numChannels: number,
): Promise<AudioBuffer> {
 const dataInt16 = new Int16Array(data.buffer);
 const frameCount = dataInt16.length / numChannels;
 const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

 for (let channel = 0; channel < numChannels; channel++) {
 const channelData = buffer.getChannelData(channel);
 for (let i = 0; i < frameCount; i++) {
 channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
 }
 }
 return buffer;
}

const LiveAssistant: React.FC = () => {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const [isConnecting, setIsConnecting] = useState(false);
 const [isActive, setIsActive] = useState(false);
 const [showSettings, setShowSettings] = useState(false);
 const [autoAssistEnabled, setAutoAssistEnabled] = useState(localStorage.getItem('autoAssistEnabled') !== 'false');
 const [transcription, setTranscription] = useState<string[]>([]);
 
 const sessionRef = useRef<any>(null);
 const audioContextRef = useRef<AudioContext | null>(null);
 const nextStartTimeRef = useRef(0);
 const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

 const toggleAutoAssist = () => {
 const newValue = !autoAssistEnabled;
 setAutoAssistEnabled(newValue);
 localStorage.setItem('autoAssistEnabled', newValue.toString());
 };

 const startSession = async () => {
 if (isConnecting || isActive) return;
 setIsConnecting(true);
 const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
 
 const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
 const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
 audioContextRef.current = outputAudioContext;

 try {
 const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 
 const sessionPromise = ai.live.connect({
 model: 'gemini-2.5-flash-native-audio-preview-12-2025',
 callbacks: {
 onopen: () => {
 setIsConnecting(false);
 setIsActive(true);
 
 const source = inputAudioContext.createMediaStreamSource(stream);
 const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
 scriptProcessor.onaudioprocess = (e) => {
 const inputData = e.inputBuffer.getChannelData(0);
 const pcmData = new Int16Array(inputData.length);
 for (let i = 0; i < inputData.length; i++) {
 pcmData[i] = inputData[i] * 32768;
 }
 const base64Data = encode(new Uint8Array(pcmData.buffer));
 sessionPromise.then(session => {
 session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' } });
 });
 };
 source.connect(scriptProcessor);
 scriptProcessor.connect(inputAudioContext.destination);
 },
 onmessage: async (msg: LiveServerMessage) => {
 if (msg.serverContent?.outputTranscription) {
 setTranscription(prev => [...prev, msg.serverContent!.outputTranscription!.text]);
 }

 const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
 if (audioData) {
 const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
 const source = outputAudioContext.createBufferSource();
 source.buffer = audioBuffer;
 source.connect(outputAudioContext.destination);
 source.start(nextStartTimeRef.current);
 nextStartTimeRef.current += audioBuffer.duration;
 sourcesRef.current.add(source);
 source.onended = () => sourcesRef.current.delete(source);
 }
 },
 onerror: (e) => console.error("Live API Error:", e),
 onclose: () => setIsActive(false),
 },
 config: {
 responseModalities: [Modality.AUDIO],
 outputAudioTranscription: {},
 systemInstruction: "Eres Cuida. Has sido activado porque el usuario lleva tiempo sin interactuar. Saluda amablemente, pregunta si necesitan ayuda con la pantalla actual. Sé breve, usa frases claras y voz cálida."
 }
 });
 
 sessionRef.current = await sessionPromise;
 } catch (err) {
 console.error(err);
 setIsConnecting(false);
 }
 };

 useEffect(() => {
 if (searchParams.get('auto') === 'true' && autoAssistEnabled) {
 startSession();
 }
 }, [searchParams]);

 const stopSession = () => {
 sessionRef.current?.close();
 setIsActive(false);
 };

 return (
 <div className="h-screen flex flex-col bg-white text-primary font-plus p-6 relative overflow-hidden pb-[160px]">
 {/* Background Decor Light Theme */}
 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

 <header className="flex items-center justify-between mb-12 relative z-10">
 <button onClick={() => { stopSession(); navigate(-1); }} className="size-14 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all border border-slate-100 shadow-sm">
 <span className="material-symbols-outlined text-primary text-3xl">close</span>
 </button>
 <div className="flex flex-col items-center">
 <h2 className="text-xl font-black tracking-[0.2em] text-primary italic font-bold">Cuida</h2>
 <div className="flex items-center gap-2">
 <div className={`size-3 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' : 'bg-slate-200'}`}></div>
 <span className="text-[10px] font-black opacity-60 text-slate-400">{isActive ? 'Escuchando' : 'Inactivo'}</span>
 </div>
 </div>
 <button onClick={() => setShowSettings(!showSettings)} className="size-14 rounded-full bg-slate-50 flex items-center justify-center active:rotate-45 transition-all border border-slate-100 shadow-sm">
 <span className="material-symbols-outlined text-primary text-3xl">settings</span>
 </button>
 </header>

 {/* Settings Modal Overlay Light Theme */}
 {showSettings && (
 <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 p-8 flex flex-col animate-in fade-in zoom-in duration-300">
 <div className="flex justify-between items-center mb-12">
 <h3 className="text-2xl font-black text-primary italic font-bold">Ajustes de Voz</h3>
 <button onClick={() => setShowSettings(false)} className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
 <span className="material-symbols-outlined text-primary">close</span>
 </button>
 </div>
 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
 <div className="flex flex-col gap-1">
 <p className="font-bold text-lg text-primary">Asistencia Automática</p>
 <p className="text-xs text-slate-500 leading-tight pr-4">Cuida aparecerá si detecta que necesitas ayuda.</p>
 </div>
 <label className="ios-switch">
 <input type="checkbox" checked={autoAssistEnabled} onChange={toggleAutoAssist} />
 <span className="slider"></span>
 </label>
 </div>
 <p className="mt-auto text-center text-[10px] font-bold text-slate-300 tracking-[0.3em]">Cuidapp+ v2.0</p>
 </div>
 )}

 <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10">
 <div className={`relative transition-all duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`}>
 <div className={`absolute inset-0 bg-primary/10 rounded-full blur-[100px] animate-pulse transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
 <div className={`size-80 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-primary shadow-[0_0_80px_rgba(91,91,230,0.15)] bg-primary/5' : 'border-slate-50 bg-slate-50/50'}`}>
 <span className={`material-symbols-outlined text-[12rem] transition-all duration-700 ${isActive ? 'text-primary fill-1 scale-110' : 'text-slate-100'}`}>
 {isActive ? 'graphic_eq' : 'keyboard_voice'}
 </span>
 </div>
 </div>

 <div className="max-w-xs text-center space-y-6">
 <h3 className="text-3xl font-black font-plus tracking-tight text-primary italic font-bold">
 {isActive ? 'Te escucho...' : 'Asistente de Voz'}
 </h3>
 <div className="h-28 overflow-y-auto text-sm text-slate-500 font-medium tracking-wide leading-relaxed px-4">
 {transcription.length > 0 ? (
 <div className="space-y-3">
 {transcription.slice(-2).map((t, i) => (
 <p key={i} className={`p-3 rounded-2xl ${i % 2 === 0 ? 'bg-slate-50' : 'text-primary font-black'}`}>{t}</p>
 ))}
 </div>
 ) : <p className="opacity-40">Pulsa el botón de abajo para comenzar...</p>}
 </div>
 </div>
 </div>

 <footer className="pb-16 flex justify-center px-6 relative z-10">
 {!isActive ? (
 <button 
 onClick={startSession}
 disabled={isConnecting}
 className="w-full h-24 bg-primary text-white rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-5 shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white italic font-bold"
 >
 {isConnecting ? (
 <span className="animate-spin material-symbols-outlined text-5xl">sync</span>
 ) : (
 <>
 <span className="material-symbols-outlined text-4xl">mic</span>
 <span className="tracking-wider ">Activar</span>
 </>
 )}
 </button>
 ) : (
 <button 
 onClick={stopSession}
 className="w-28 h-28 bg-sos-red text-white rounded-full shadow-2xl shadow-sos-red/20 flex items-center justify-center border-4 border-white active:scale-95 transition-all animate-pulse italic font-bold"
 >
 <span className="material-symbols-outlined text-6xl fill-1">stop_circle</span>
 </button>
 )}
 </footer>
 </div>
 );
};

export default LiveAssistant;
