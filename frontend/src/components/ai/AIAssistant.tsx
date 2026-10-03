import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { closeAIPanel } from "../../store/slices/mapSlice";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";

const SUGGESTED_QUESTIONS = [
  "Which infrastructure should emergency teams prioritize?",
  "Summarize the current cyclone situation",
  "Which hospitals are at critical risk?",
  "What areas have the highest flood exposure?",
  "What actions should be taken in the next 6 hours?",
];

interface Props {
  riskSummary: Record<string, unknown>;
  criticalAssets: Array<Record<string, unknown>>;
}

export default function AIAssistant({ riskSummary, criticalAssets }: Props) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.map.isAIPanelOpen);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading, clearMessages } = useAIAnalysis(riskSummary, criticalAssets);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleSuggestion = (q: string) => {
    sendMessage(q);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] z-[2000] flex flex-col slide-in-right shadow-2xl">
      <div className="glass-dark h-full flex flex-col overflow-hidden border-l border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-white text-sm">StormShield AI</div>
            <div className="text-xs text-slate-400">Powered by Gemini · Context-aware analysis</div>
          </div>
          <button
            onClick={() => dispatch(closeAIPanel())}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Bot size={28} className="text-blue-400" />
                </div>
                <p className="text-slate-300 font-medium text-sm">Ask me anything about</p>
                <p className="text-slate-400 text-xs mt-1">the current cyclone situation & risk assessment</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Suggested Questions</div>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    disabled={isLoading}
                    className="text-left text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg px-3 py-2.5 transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-violet-600 to-blue-600"
              }`}>
                {msg.role === "user" ? <User size={13} /> : <Bot size={13} />}
              </div>
              <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                <div className={`text-xs rounded-xl px-3 py-2.5 leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 ml-auto inline-block"
                    : "bg-slate-800/60 border border-slate-700/40 text-slate-200"
                }`}>
                  {msg.content}
                </div>
                <div className="text-xs text-slate-600 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot size={13} />
              </div>
              <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-blue-400" />
                  <span className="text-xs text-slate-400">Analyzing situation...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800/60">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-slate-500 hover:text-slate-300 mb-3 transition-colors"
            >
              Clear conversation
            </button>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about risk, priorities, actions..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-all"
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
          <div className="text-xs text-slate-600 text-center mt-2">
            Responses based on live risk data context
          </div>
        </div>
      </div>
    </div>
  );
}
