import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Info,
  Wind,
  Calendar as CalendarIcon,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
export function AIChatSupport() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(
    [
      {
        id: "1",
        sender: "bot",
        text: "Hi Alex. I'm your AI Wellbeing Assistant. I noticed your stress levels have been high lately. How are you feeling right now?",
        type: "text"
      }
    ]
  );
  const quickReplies = [
    "I feel overwhelmed",
    "I am stressed about exams",
    "I can't focus",
    "Show breathing exercise",
    "Book a counselor"
  ];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  const handleSend = (text) => {
    if (!text.trim()) return;
    const newUserMsg = {
      id: Date.now().toString(),
      sender: "user",
      text
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let botResponse;
      const lowerText = text.toLowerCase();
      if (lowerText.includes("overwhelmed") || lowerText.includes("stressed")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I hear you. It's completely normal to feel overwhelmed, especially with midterms coming up. When we're stressed, our breathing often becomes shallow. Would you like to try a quick 1-minute breathing exercise to help reset your nervous system?",
          type: "text"
        };
      } else if (lowerText.includes("breathing") || lowerText.includes("exercise")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Here is a simple Box Breathing exercise. Follow the prompts below:",
          type: "exercise"
        };
      } else if (lowerText.includes("counselor") || lowerText.includes("book")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Booking a session is a great step. Based on your profile, I recommend Dr. Sarah Jenkins who specializes in academic stress.",
          type: "booking"
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Thank you for sharing that with me. Remember to take things one step at a time. Is there a specific area you'd like to focus on right now?",
          type: "text"
        };
      }
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };
  return <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in max-w-4xl mx-auto"><div className="flex items-center justify-between mb-4 shrink-0"><div><button
    onClick={() => navigate("/")}
    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
  ><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500" /> AI Support Bot
          </h1></div></div><div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 mb-4 shrink-0"><Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" /><p className="text-xs leading-relaxed"><strong>Disclaimer:</strong> This chatbot provides emotional support
          guidance and coping strategies only. It does not provide medical
          advice, diagnosis, or treatment. If you are in crisis, please contact
          emergency services.
        </p></div><Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-md">{
    /* Chat Messages Area */
  }<CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">{messages.map(
    (msg) => <div
      key={msg.id}
      className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
    >{
      /* Avatar */
    }<div
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "bot" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-slate-200 text-slate-600"}`}
    >{msg.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}</div>{
      /* Message Content */
    }<div
      className={`space-y-3 ${msg.sender === "user" ? "items-end" : "items-start"}`}
    ><div
      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"}`}
    >{msg.text}</div>{
      /* Special Card Types */
    }{msg.type === "exercise" && <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 w-64 shadow-sm"><div className="flex items-center gap-2 text-teal-700 font-semibold mb-3"><Wind className="w-5 h-5" /> Box Breathing
                    </div><div className="space-y-2 text-sm text-teal-800"><p>1. Inhale for 4 seconds</p><p>2. Hold for 4 seconds</p><p>3. Exhale for 4 seconds</p><p>4. Hold for 4 seconds</p></div><Button
      variant="outline"
      className="w-full mt-4 border-teal-200 text-teal-700 hover:bg-teal-100"
      size="sm"
    >
                  
                      Start Timer
                    </Button></div>}{msg.type === "booking" && <div className="bg-white border border-slate-200 rounded-2xl p-4 w-72 shadow-sm"><div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100"><img
      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80"
      alt="Counselor"
      className="w-10 h-10 rounded-full object-cover"
    /><div><p className="font-bold text-slate-800 text-sm">
                          Dr. Sarah Jenkins
                        </p><p className="text-xs text-indigo-600">
                          Academic Stress Specialist
                        </p></div></div><Button
      variant="gradient"
      fullWidth
      size="sm"
      onClick={() => navigate("/counseling/book/c1")}
      className="gap-2"
    ><CalendarIcon className="w-4 h-4" /> View Availability
                    </Button></div>}</div></div>
  )}{isTyping && <div className="flex gap-3 max-w-[85%]"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div><div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1"><div
    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
    style={{
      animationDelay: "0ms"
    }}
  /><div
    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
    style={{
      animationDelay: "150ms"
    }}
  /><div
    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
    style={{
      animationDelay: "300ms"
    }}
  /></div></div>}<div ref={messagesEndRef} /></CardContent>{
    /* Input Area */
  }<div className="p-4 bg-white border-t border-slate-100">{
    /* Quick Replies */
  }<div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">{quickReplies.map(
    (reply, i) => <button
      key={i}
      onClick={() => handleSend(reply)}
      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-medium whitespace-nowrap hover:bg-indigo-100 transition-colors"
    >{reply}</button>
  )}</div><form
    onSubmit={(e) => {
      e.preventDefault();
      handleSend(input);
    }}
    className="flex gap-2"
  ><input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type your message..."
    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
  /><Button
    type="submit"
    variant="primary"
    disabled={!input.trim() || isTyping}
    className="px-5 rounded-xl"
  ><Send className="w-4 h-4" /></Button></form></div></Card></div>;
}
