"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, Mic, MicOff, Volume2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "garhwali" | "kumaoni">("en");

  const recognitionRef = useRef<any>(null);

  const handleSpeechToText = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang =
        language === "hi" || language === "garhwali" || language === "kumaoni"
          ? "hi-IN"
          : "en-US";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      recognitionRef.current.stop();
      setTimeout(() => recognitionRef.current.start(), 400);
    }
  };

  // 🔊 Text-to-Speech (TTS)
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);

    if (language === "garhwali" || language === "kumaoni" || language === "hi")
      utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";

    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // 🤖 Gemini API — Enforced Language and Written Response
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setLoading(true);

    try {
      // The backend talks to Gemini, so the API key stays on the server.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, input: userInput, language }),
      });
      const data = await res.json();
      if (res.status === 429) {
        // Rate limited: tell the user how long to wait instead of a generic error.
        setMessages((prev) => [...prev, { sender: "bot", text: `⏳ ${data.message}` }]);
        return;
      }
      if (!res.ok) throw new Error(data.message);
      const reply = data.reply;

      const botReply = { sender: "bot", text: reply };
      //@ts-ignore
      setMessages((prev) => [...prev, botReply]);
      speak(botReply.text);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ कुछ त्रुटि हुई। कृपया पुनः प्रयास करें।" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  // 💎 UI
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-16 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Health Chat Assistant</h1>
          </div>

          {/* 🌐 Language Dropdown */}
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "en" | "hi" | "garhwali" | "kumaoni")
              }
              className="border border-emerald-400 rounded-full px-4 py-2 text-sm text-emerald-700 bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
              <option value="garhwali">गढ़वाली</option>
              <option value="kumaoni">कुमाऊँनी</option>
            </select>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1 scrollbar-thin scrollbar-thumb-emerald-200">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-600 animate-pulse">
                Typing...
              </div>
            </div>
          )}

          {listening && (
            <div className="flex justify-start">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-xs font-medium animate-pulse">
                🎤 Listening...
              </div>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex items-center gap-3 mt-2">
          <input
            type="text"
            value={input}
            placeholder="Speak or type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {/* 🎙️ STT */}
          <Button
            onClick={handleSpeechToText}
            type="button"
            variant="outline"
            className={`rounded-full p-3 border-emerald-500 ${
              listening ? "bg-emerald-100 text-emerald-700" : "text-gray-700"
            }`}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* 🚀 Send */}
          <Button
            onClick={handleSend}
            disabled={loading}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-3"
          >
            <Send className="h-5 w-5" />
          </Button>

          {/* 🔊 Manual TTS */}
          <Button
            onClick={() => speak(input || "Hello")}
            variant="outline"
            className="rounded-full p-3 text-gray-700"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
