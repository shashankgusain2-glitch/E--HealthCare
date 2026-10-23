"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Mic, MicOff, Bot, User, Volume2 } from "lucide-react"

interface HealthcareChatbotProps {
  onClose: () => void
}

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  language?: "en" | "kumaoni"
}

// Mock Kumaoni translations and responses
const kumaoniResponses = {
  greeting: "नमस्कार! म तुमार स्वास्थ्य सहायक छु। म तुमार कैसे मदद कर सकूं?",
  appointment: "अपॉइंटमेंट बुक करण के लिए, कृपया अपना नाम और पसंदीदा समय बताओ।",
  symptoms: "तुमार कै लक्षण छन्? म तुमार सही सलाह दे सकूं।",
  emergency: "यदि यो एक आपातकाल छ, तो कृपया तुरंत 102 पर कॉल करो।",
  thanks: "धन्यवाद! और कुछ मदद चाहिए?",
}

export function HealthcareChatbot({ onClose }: HealthcareChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your healthcare assistant. I can help you in English or Kumaoni. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "kumaoni">("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (currentLanguage === "kumaoni") {
      if (lowerMessage.includes("नमस्कार") || lowerMessage.includes("hello")) {
        return kumaoniResponses.greeting
      } else if (lowerMessage.includes("अपॉइंटमेंट") || lowerMessage.includes("appointment")) {
        return kumaoniResponses.appointment
      } else if (lowerMessage.includes("लक्षण") || lowerMessage.includes("symptoms")) {
        return kumaoniResponses.symptoms
      } else if (lowerMessage.includes("आपातकाल") || lowerMessage.includes("emergency")) {
        return kumaoniResponses.emergency
      } else {
        return "म तुमार समझ गयो। और जानकारी के लिए, कृपया अपना सवाल स्पष्ट रूप से पूछो।"
      }
    } else {
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        return "Hello! I'm here to help with your healthcare needs. You can ask me about appointments, symptoms, or switch to Kumaoni language."
      } else if (lowerMessage.includes("appointment")) {
        return "I can help you book an appointment. Please provide your preferred date and time, and I'll check availability with our doctors."
      } else if (lowerMessage.includes("symptoms") || lowerMessage.includes("pain") || lowerMessage.includes("fever")) {
        return "I understand you're experiencing symptoms. While I can provide general guidance, please consult with our doctors for proper diagnosis. Would you like to book an appointment?"
      } else if (lowerMessage.includes("emergency")) {
        return "If this is a medical emergency, please call 102 immediately or visit the nearest emergency room. For non-urgent matters, I'm here to help."
      } else if (lowerMessage.includes("kumaoni") || lowerMessage.includes("कुमाऊनी")) {
        setCurrentLanguage("kumaoni")
        return kumaoniResponses.greeting
      } else if (lowerMessage.includes("english")) {
        setCurrentLanguage("en")
        return "Switched to English. How can I help you today?"
      } else {
        return "I'm here to help with healthcare-related questions. You can ask about appointments, symptoms, or general health information. I also support Kumaoni language - just say 'Kumaoni' to switch."
      }
    }
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: "bot",
        timestamp: new Date(),
        language: currentLanguage,
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInputText("")
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser.")
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = currentLanguage === "kumaoni" ? "hi-IN" : "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = currentLanguage === "kumaoni" ? "hi-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Healthcare Assistant</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={currentLanguage === "en" ? "default" : "outline"} className="text-xs">
                    English
                  </Badge>
                  <Badge variant={currentLanguage === "kumaoni" ? "default" : "outline"} className="text-xs">
                    कुमाऊनी
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="p-2 bg-primary/10 rounded-full h-fit">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.sender === "bot" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.text)}
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {message.sender === "user" && (
                  <div className="p-2 bg-secondary rounded-full h-fit">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={currentLanguage === "kumaoni" ? "अपना संदेश लिखो..." : "Type your message..."}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="rounded-full pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={handleSendMessage} size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentLanguage("en")}
                className={`text-xs ${currentLanguage === "en" ? "bg-primary/10" : ""}`}
              >
                English
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentLanguage("kumaoni")}
                className={`text-xs ${currentLanguage === "kumaoni" ? "bg-primary/10" : ""}`}
              >
                कुमाऊनी
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
