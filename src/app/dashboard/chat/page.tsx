"use client"

import * as React from "react"
import { MessageSquare, Send, Loader2, User, Bot, Sparkles, ThermometerSun, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatAdvisor } from "@/ai/flows/chat-advisor-flow"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatAdvisorPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "assistant", content: "Hello Farmer Ahmad! I'm your TUAI Copilot. How can I help you with your crops or farm operations today?" }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const response = await chatAdvisor({ userQuestion: userMsg })
      setMessages(prev => [...prev, { role: "assistant", content: response.advice }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white border">
      {/* Header */}
      <div className="p-6 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold leading-none">TUAI Copilot</h2>
            <p className="text-primary-foreground/70 text-xs mt-1">Grounded in local agriculture data</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
              <ThermometerSun className="h-4 w-4" />
              <span>Selangor: 32°C</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6 bg-accent/5" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border text-primary'}`}>
                  {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex gap-3 max-w-[85%]">
                 <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-white border">
                   <Bot className="h-5 w-5 text-primary" />
                 </div>
                 <div className="p-4 rounded-2xl bg-white border rounded-tl-none shadow-sm flex items-center gap-2">
                   <Loader2 className="h-4 w-4 animate-spin text-primary" />
                   <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick suggestions */}
      <div className="px-6 py-2 bg-accent/5 flex gap-2 overflow-x-auto no-scrollbar pb-4">
        {[
          "What's the weather today?",
          "Subsidy for Padi?",
          "Fertilizer shortage alerts?",
          "Soil health tips"
        ].map((s, i) => (
          <button 
            key={i} 
            onClick={() => setInput(s)}
            className="whitespace-nowrap px-4 py-1.5 bg-white border rounded-full text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t bg-white">
        <div className="flex gap-4">
          <Input 
            placeholder="Type your question here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 h-12 rounded-xl"
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground justify-center uppercase tracking-widest font-bold">
           <Sparkles className="h-3 w-3 text-secondary" />
           Powered by Gemini Flash & Vertex AI Search
        </div>
      </div>
    </div>
  )
}