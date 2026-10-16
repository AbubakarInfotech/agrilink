import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Droplets,
  Layers,
  ShieldAlert,
  RefreshCw,
  Box,
  Volume2,
  VolumeX,
  BotMessageSquare,
  HelpCircle,
  ThumbsUp,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Send,
  Plus,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { PracticeCard, QnAItem } from '../data/seedData';
import { DataStore, UserProfile } from '../services/store';
import { speakText, stopSpeaking } from '../utils/speech';

interface LearnScreenProps {
  onBack: () => void;
  practices: PracticeCard[];
  qnaItems: QnAItem[];
  onRefreshQna: () => void;
  onAskAiWithPrompt: (prompt: string) => void;
  user: UserProfile | null;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  onBack,
  practices,
  qnaItems,
  onRefreshQna,
  onAskAiWithPrompt,
  user,
}) => {
  const { language, dir, t } = useTranslation();

  // Active view: 'practices' | 'qna'
  const [activeTab, setActiveTab] = useState<'practices' | 'qna'>('practices');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // New Question Modal
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [farmerName, setFarmerName] = useState(user?.name || '');
  const [locationName, setLocationName] = useState(user?.districtId || 'ضلع حیدرآباد');

  // New Answer Input per question
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const topics = [
    { id: 'all', label: t('learn.allTopics') },
    { id: 'water', label: t('learn.water') },
    { id: 'pest', label: t('learn.pest') },
    { id: 'soil', label: t('learn.soil') },
    { id: 'rotation', label: t('learn.rotation') },
    { id: 'storage', label: t('learn.storage') },
  ];

  // Filtered practices
  const filteredPractices = useMemo(() => {
    if (selectedTopic === 'all') return practices;
    return practices.filter((p) => p.topic === selectedTopic);
  }, [practices, selectedTopic]);

  // Audio listen
  const handleListenPractice = (card: PracticeCard) => {
    if (playingId === card.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }

    setPlayingId(card.id);
    const title = language === 'sd' ? card.titleSd : language === 'en' ? card.titleEn : card.titleUr;
    const lines = language === 'sd' ? card.linesSd : language === 'en' ? card.linesEn : card.linesUr;
    const tip = language === 'sd' ? card.expertTipSd : language === 'en' ? card.expertTipEn : card.expertTipUr;

    const fullText = `${title}. ${lines.join('. ')}. ${tip}`;
    speakText(fullText, language, () => {
      setPlayingId(null);
    });
  };

  // Submit Community Question
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    DataStore.addQuestion({
      farmerName: farmerName.trim() || 'زمیندار',
      location: locationName.trim(),
      question: newQuestionText.trim(),
    });

    onRefreshQna();
    setNewQuestionText('');
    setShowAskModal(false);
  };

  // Submit Answer
  const handlePostAnswer = (questionId: string) => {
    const text = replyInputs[questionId]?.trim();
    if (!text) return;

    DataStore.addAnswer(questionId, {
      responderName: user?.name || 'کسان ساتھی',
      role: user?.role === 'agent' ? 'Extension Agent' : 'Farmer',
      text,
      isExtensionOfficer: user?.role === 'agent',
    });

    setReplyInputs((prev) => ({ ...prev, [questionId]: '' }));
    onRefreshQna();
  };

  // Upvote Answer
  const handleUpvote = (questionId: string, answerId: string) => {
    DataStore.upvoteAnswer(questionId, answerId);
    onRefreshQna();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        {/* Tab switch between Practice Cards & Community Forum */}
        <div className="flex items-center bg-stone-200/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('practices')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'practices'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {t('learn.title')}
          </button>
          <button
            onClick={() => setActiveTab('qna')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'qna'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {t('learn.communityQna')}
          </button>
        </div>
      </div>

      {activeTab === 'practices' ? (
        <>
          {/* Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {topics.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setSelectedTopic(tp.id)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                  selectedTopic === tp.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>

          {/* Practice Cards List */}
          <div className="space-y-4">
            {filteredPractices.map((card) => {
              const title =
                language === 'sd'
                  ? card.titleSd
                  : language === 'en'
                  ? card.titleEn
                  : card.titleUr;
              const lines =
                language === 'sd'
                  ? card.linesSd
                  : language === 'en'
                  ? card.linesEn
                  : card.linesUr;
              const tip =
                language === 'sd'
                  ? card.expertTipSd
                  : language === 'en'
                  ? card.expertTipEn
                  : card.expertTipUr;
              const region =
                language === 'sd'
                  ? card.regionTagSd
                  : language === 'en'
                  ? card.regionTagEn
                  : card.regionTagUr;

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-3 relative overflow-hidden"
                >
                  {/* Top Bar: Topic Badge, Region, and Speaker */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      {region}
                    </span>

                    <button
                      onClick={() => handleListenPractice(card)}
                      className={`p-2 rounded-full shadow-sm transition ${
                        playingId === card.id
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-stone-100 text-stone-700 hover:bg-teal-50 hover:text-teal-800'
                      }`}
                      title={t('common.listen')}
                    >
                      {playingId === card.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                    {title}
                  </h3>

                  {/* 3-5 Simple Lines */}
                  <ul className="space-y-2 pt-1">
                    {lines.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-900 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expert Advice Tip Box */}
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-900">
                    {tip}
                  </div>

                  {/* Ask AI About this button (pre-fills AI chat) */}
                  <div className="pt-2 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => onAskAiWithPrompt(`مجھے ${title} کے بارے میں مزید تفصیل سے سمجھائیں`)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold text-xs shadow-xs transition active:scale-95"
                    >
                      <BotMessageSquare className="w-4 h-4 text-purple-600" />
                      <span>{t('learn.askAiTopic')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Community Q&A Forum */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-teal-50 p-3 rounded-2xl border border-teal-200">
            <div>
              <h3 className="text-sm font-bold text-teal-900">{t('learn.communityQna')}</h3>
              <p className="text-xs text-teal-700">کسان بھائی سوال پوچھیں، دیگر کسان اور ماہرین جواب دیتے ہیں</p>
            </div>
            <button
              onClick={() => setShowAskModal(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-sm hover:bg-teal-800 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('learn.askCommunity')}</span>
            </button>
          </div>

          {qnaItems.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-3"
            >
              {/* Question header */}
              <div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-bold text-stone-700">{q.farmerName}</span>
                  <span>{q.location}</span>
                </div>
                <h4 className="text-base font-bold text-stone-900 mt-1">
                  ❓ {q.question}
                </h4>
              </div>

              {/* Answers */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                {q.answers.map((ans) => (
                  <div
                    key={ans.id}
                    className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-800">{ans.responderName}</span>
                        {ans.isExtensionOfficer && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                            <Award className="w-3 h-3 text-teal-700" />
                            <span>{t('learn.expertBadge')}</span>
                          </span>
                        )}
                      </div>

                      {/* Helpful upvote button */}
                      <button
                        onClick={() => handleUpvote(q.id, ans.id)}
                        className="flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-700 font-bold bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-2xs"
                      >
                        <ThumbsUp className="w-3 h-3 text-emerald-600" />
                        <span>{ans.helpfulVotes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {ans.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInputs[q.id] || ''}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="اپنا تجربہ یا جواب لکھیں..."
                  className="flex-1 h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={() => handlePostAnswer(q.id)}
                  disabled={!replyInputs[q.id]?.trim()}
                  className="h-10 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs font-bold transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-900">{t('learn.askCommunity')}</h3>
            <form onSubmit={handlePostQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">آپ کا سوال</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="مثال: کپاس میں پانی کب لگانا چاہیے؟"
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نام</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="آپ کا نام"
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">علاقہ / ضلع</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="مثال: حیدرآباد"
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm"
                >
                  {t('common.close')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800"
                >
                  ارسال کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
