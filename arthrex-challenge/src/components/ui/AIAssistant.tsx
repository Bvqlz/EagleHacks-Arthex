import { useState, useRef, useEffect, useCallback } from 'react';
import OpenAI from 'openai';
import { useAppStore } from '../../store/appStore';
import { ALL_STRUCTURE_IDS } from '../../data/modelMapping';

// ─── Web Speech API shim (not yet in TS's default lib types) ─────────────────
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

// ─── OpenAI client ────────────────────────────────────────────────────────────
// Lazily guarded — if the key is absent the client stays null and the chat
// surfaces a helpful message instead of crashing the whole app.
const _apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const openai: OpenAI | null = _apiKey
  ? new OpenAI({ apiKey: _apiKey, dangerouslyAllowBrowser: true })
  : null;

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert orthopedic anatomy assistant embedded in a 3D knee visualization tool.
You can answer any anatomy or orthopedic question — including structures not present in the 3D model (e.g. the SCL, LCL variants, bursae, nerves, vasculature, etc.).

Always respond with raw JSON (no markdown fences) in this exact shape:
{"structureId": <id or null>, "description": "<your answer>"}

Rules for structureId:
- Set it to one of these canonical IDs ONLY when the user explicitly wants to SEE, SHOW, FOCUS, or HIGHLIGHT a structure in the 3D model:
  ${ALL_STRUCTURE_IDS.join(', ')}
- Set it to null for general questions, explanations, comparisons, or when the structure is not in the model.

Rules for description:
- For navigation requests ("show me the ACL"): one concise sentence identifying the structure.
- For educational questions ("what does the ACL do?", "what is the SCL?"): give a thorough, accurate 2–4 sentence answer covering anatomy, function, and clinical relevance.
- For structures outside the model: explain what the structure is and why it isn't visualized here.
- Use plain language accessible to both surgeons and patients unless the user specifies otherwise.`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  text: string;
  structureId?: string | null;
}

// ─── Label map ────────────────────────────────────────────────────────────────
const STRUCTURE_LABELS: Record<string, string> = {
  femur: 'Femur',
  tibia: 'Tibia',
  fibula: 'Fibula',
  patella: 'Patella',
  acl: 'ACL',
  pcl: 'PCL',
  mcl: 'MCL',
  lcl: 'LCL',
  medial_meniscus: 'Medial Meniscus',
  lateral_meniscus: 'Lateral Meniscus',
  articular_cartilage: 'Articular Cartilage',
  patellar_tendon: 'Patellar Tendon',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  gastrocnemius: 'Gastrocnemius',
  other_muscles: 'Other Muscles',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [listening, setListening] = useState(false);

  const bottomRef       = useRef<HTMLDivElement>(null);
  const recognitionRef  = useRef<SpeechRecognitionInstance | null>(null);
  const messagesRef     = useRef<Message[]>(messages);

  // Keep ref in sync so the send callback can read current messages without a stale closure
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const { setAiFocusStructure, setSelectedStructure, setStructureVisible } = useAppStore();

  // Whether the browser supports the Web Speech API
  const speechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Core send function (accepts explicit text so voice can bypass state lag) ─
  const sendText = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (!openai) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'No API key configured. Create a .env file at the project root with VITE_OPENAI_API_KEY=sk-..., then restart the dev server.',
            structureId: null,
          },
        ]);
        setLoading(false);
        return;
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messagesRef.current.slice(-6).map((m) => ({
            role: m.role,
            content: m.text,
          })),
          { role: 'user', content: trimmed },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const raw = completion.choices[0]?.message?.content ?? '{}';
      let parsed: { structureId: string | null; description: string } = {
        structureId: null,
        description: raw,
      };

      try {
        parsed = JSON.parse(raw);
      } catch {
        const cleaned = raw.replace(/```json?|```/g, '').trim();
        try { parsed = JSON.parse(cleaned); } catch { /* use fallback */ }
      }

      const { structureId, description } = parsed;

      if (structureId) {
        setStructureVisible(structureId, true);
        setSelectedStructure(structureId);
        setAiFocusStructure(structureId);
      } else {
        setAiFocusStructure(null);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: description, structureId },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${message}`, structureId: null },
      ]);
    } finally {
      setLoading(false);
    }
  }, [setAiFocusStructure, setSelectedStructure, setStructureVisible]);

  const send = () => sendText(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  };

  // ── Voice input ──────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const toggleVoice = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true; // stream partial results into the input
    recognition.continuous = false;    // single utterance per press

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Concatenate all result segments
      let interim = '';
      let finalText = '';
      for (let i = 0; i < event.results.length; i++) {
        const seg = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += seg;
        } else {
          interim += seg;
        }
      }

      // Show live transcription in the input field
      setInput(finalText || interim);

      // Auto-send when the browser signals the utterance is complete
      if (finalText) {
        stopListening();
        sendText(finalText);
      }
    };

    recognition.onend = () => {
      // If the user stopped speaking without a final result, send whatever is in input
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, stopListening, sendText]);

  // Clean up recognition if the component unmounts while listening
  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  // ── Focus helper (badge click) ────────────────────────────────────────────
  const focusStructure = (id: string) => {
    setStructureVisible(id, true);
    setSelectedStructure(id);
    setAiFocusStructure(id);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-medium shadow-lg transition-colors"
        aria-label="Toggle AI anatomy assistant"
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        AI Assistant
      </button>

      {/* Chat panel */}
      {open && (
        <div className="absolute bottom-16 right-4 z-30 w-80 flex flex-col rounded-xl bg-slate-800 border border-slate-600 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-700 border-b border-slate-600">
            <span className="font-semibold text-sm text-white">Anatomy AI</span>
            {/* Listening indicator */}
            {listening && (
              <span className="flex items-center gap-1.5 text-red-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Listening…
              </span>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-72 text-sm">
            {messages.length === 0 && (
              <p className="text-slate-400 text-center py-4">
                Ask about any knee structure — e.g. &quot;Show me the ACL&quot; or tap the mic and say &quot;ACL&quot;.
              </p>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.role === 'assistant' && msg.structureId && (
                    <button
                      onClick={() => focusStructure(msg.structureId!)}
                      className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs px-2 py-0.5 hover:bg-blue-500/30 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      {STRUCTURE_LABELS[msg.structureId] ?? msg.structureId}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-400 rounded-lg px-3 py-2 text-xs animate-pulse">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="flex gap-2 px-3 py-3 border-t border-slate-600">
            {/* Mic button */}
            {speechSupported && (
              <button
                onClick={toggleVoice}
                disabled={loading}
                aria-label={listening ? 'Stop recording' : 'Start voice input'}
                title={listening ? 'Stop recording' : 'Speak to search'}
                className={`flex-shrink-0 rounded-lg px-2.5 py-2 text-sm transition-colors disabled:opacity-40 ${
                  listening
                    ? 'bg-red-500 hover:bg-red-400 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {/* Microphone SVG */}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8"  y1="22" x2="16" y2="22" />
                </svg>
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={listening ? 'Listening…' : 'Ask about a structure…'}
              disabled={loading}
              className="flex-1 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm px-3 py-2 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />

            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-3 py-2 text-sm transition-colors"
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
