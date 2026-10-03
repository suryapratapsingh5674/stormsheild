import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { analyzeWithAI } from "../services/aiService";
import { useAppSelector } from "../store/store";
import { AIMessage } from "../types";

// TanStack mutation for AI — not cached (each question is unique)
export function useAIAnalysis(riskSummary: Record<string, unknown>, criticalAssets: Array<Record<string, unknown>>) {
  const selectedCyclone = useAppSelector((s) => s.cyclone.selectedCyclone);
  const selectedInfra = useAppSelector((s) => s.infrastructure.selectedInfrastructure);
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const mutation = useMutation({
    mutationFn: (question: string) =>
      analyzeWithAI({
        question,
        context: {
          cyclone: selectedCyclone as Record<string, unknown> ?? {},
          riskSummary,
          criticalAssets,
          selectedInfrastructure: selectedInfra as Record<string, unknown> | null,
        },
      }),
    onMutate: (question) => {
      // Add user message immediately (optimistic UI)
      const userMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
    },
    onSuccess: (result) => {
      const aiMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    },
    onError: () => {
      const errMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm unable to connect to the AI service right now. Please check your API key and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    },
  });

  return {
    messages,
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    clearMessages: () => setMessages([]),
  };
}
