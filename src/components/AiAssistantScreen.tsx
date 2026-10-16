import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  PhoneCall,
  TrendingUp,
  ShoppingBag,
  Tractor,
  BookOpen,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speech';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolData?: any;
  timestamp: string;
}

interface AiAssistantScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  initialTopicPrompt?: string;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  onBack,
  onNavigateTab,
  initialTopicPrompt,
}) => {
  const { language, dir, t } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'sd'
          ? 'السلام عليڪم! مان ايگري لنڪ جو زميندار ساٿي آهيان. توهان سنڌي، اردو يا انگريزيءَ ۾ اگهه، فصل وڪري يا زرعي بيمارين بابت پڇي سگهو ٿا. مائيڪ جو بٽڻ دٻائي ڳالهايو يا هتي لکو.'
          : language === 'en'
          ? 'Assalam-o-Alaikum! I am AgriLink Zameendar Saathi. Ask me about mandi crop rates, selling produce, tractor rental, or safe pest solutions in Urdu, Sindhi, Roman Urdu, or English.'
          : 'السلام علیکم! میں ایگری لنک کا زمیندار ساتھی ہوں۔ آپ مجھ سے اردو، سندھی یا رومن اردو میں منڈی کے ریٹس، فصل بیچنے، ٹریکٹر کرایہ یا کیڑوں کے علاج کے بارے میں پوچھ سکتے ہیں۔ مائیک کا بٹن دبا کر بولیں یا لکھیں۔',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(initialTopicPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Speech-to-Text via Web Speech Recognition API
  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'sd'
          ? 'توهان جي برائوزر ۾ مائيڪ ذريعي لکڻ سپورٽ ناهي'
          : 'آپ کے براؤزر میں مائیک سے لکھنا سپورٹ نہیں ہے'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Urdu PK, Sindhi, or English
      recognition.lang = language === 'sd' ? 'ur-PK' : language === 'en' ? 'en-US' : 'ur-PK';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Handle Text-to-Speech (TTS) for a message
  const handleListenMessage = (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msg.id);
    speakText(msg.text, language, () => {
      setPlayingMessageId(null);
    });
  };

  // Send message to server Gemini endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI reply');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || data.fallbackReply || 'معذرت، جواب حاصل نہ ہو سکا۔',
        toolData: data.toolData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Fallback offline / network error message
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'sd'
            ? 'انٽرنيٽ ڪنيڪشن يا اي آءِ سروس ۾ دير آهي. مهرباني ڪري ڪجهه دير بعد ڪوشش ڪريو.'
            : 'انٹرنیٹ یا سروس میں تاخیر ہے۔ براہ کرم کچھ دیر بعد کوشش کریں۔',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick suggestion chips
  const suggestions = [
    { text: t('ai.sug1') },
    { text: t('ai.sug2') },
    { text: t('ai.sug3') },
    { text: t('ai.sug4') },
    { text: t('ai.sug5') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col h-[calc(100vh-80px)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-stone-900 leading-tight">
              {t('ai.title')}
            </h2>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              آن لائن (Urdu / Sindhi / Roman)
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pe-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[80%] ${
                isUser ? 'ms-auto' : 'me-auto'
              }`}
            >
              <div
                className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm relative ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-br-xs'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                }`}
              >
                {/* Message Text */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Render Structured Tool Card if returned by Gemini */}
                {msg.toolData && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60">
                    {msg.toolData.type === 'rates' && Array.isArray(msg.toolData.data) && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          منڈی ریٹ ریکارڈ:
                        </span>
                        {msg.toolData.data.map((r: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-emerald-50 p-2.5 rounded-xl text-xs flex items-center justify-between font-semibold"
                          >
                            <span>
                              {r.district} ({r.crop})
                            </span>
                            <span className="font-bold text-emerald-950">
                              {r.rateToday} PKR / {r.unit || 'من'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Row: Timestamp + Audio Speaker Button */}
                <div className="flex items-center justify-between gap-3 mt-2 pt-1 text-[11px] opacity-80">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleListenMessage(msg)}
                      className={`p-1.5 rounded-full transition ${
                        playingMessageId === msg.id
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'hover:bg-stone-100 text-stone-600'
                      }`}
                      title={t('common.listen')}
                    >
                      {playingMessageId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Safety notice and Talk to Expert button on pesticide advice */}
              {!isUser && (msg.text.includes('اسپرے') || msg.text.includes('سنڈی') || msg.text.includes('دوائ') || msg.text.includes('ڪيڙ')) && (
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="tel:080012345"
                    className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-200 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('ai.askExpert')} (0800-12345)</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-stone-200 w-fit text-xs text-stone-500">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            <span>سوچ رہا ہے... (AI Thinking)</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s.text)}
            className="shrink-0 text-xs font-semibold bg-stone-200/80 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-full transition active:scale-95"
          >
            {s.text}
          </button>
        ))}
      </div>

      {/* Safe Advice Disclaimer */}
      <div className="text-[10px] text-stone-500 text-center py-1 truncate">
        {t('ai.disclaimer')}
      </div>

      {/* Input Box with Big Microphone & Send Buttons */}
      <div className="pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white rounded-3xl p-1.5 border-2 border-stone-300 focus-within:border-emerald-600 shadow-md"
        >
          {/* Big Microphone Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800'
            }`}
            title={isListening ? t('ai.listening') : t('ai.speakNow')}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t('ai.listening') : t('ai.inputPlaceholder')}
            className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-stone-900"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
