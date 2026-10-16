import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Square,
  Clock,
  Droplets,
  Layers,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { CROPS } from '../data/seedData';
import { SEED_CROP_CALENDAR, CropCalendarStage } from '../data/moreFeaturesData';
import { speakText, stopSpeaking } from '../utils/speech';

interface CropCalendarScreenProps {
  onBack: () => void;
}

export const CropCalendarScreen: React.FC<CropCalendarScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [selectedCrop, setSelectedCrop] = useState<'wheat' | 'cotton' | 'rice' | 'sugarcane'>('wheat');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reminderSavedNotice, setReminderSavedNotice] = useState<string | null>(null);

  const stages = SEED_CROP_CALENDAR.filter((s) => s.cropId === selectedCrop);
  const cropObj = CROPS.find((c) => c.id === selectedCrop);
  const cropName =
    language === 'sd' ? cropObj?.nameSd : language === 'en' ? cropObj?.nameEn : cropObj?.nameUr;

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  const handleSetReminder = (stageTitle: string) => {
    setReminderSavedNotice(`یاد دہانی الرٹ محفوظ: ${stageTitle}`);
    setTimeout(() => setReminderSavedNotice(null), 3000);
  };

  const handleListenCalendar = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = `${cropName} کا سیزن کیلنڈر۔ `;
    stages.forEach((st) => {
      const title = language === 'sd' ? st.titleSd : language === 'en' ? st.titleEn : st.titleUr;
      const timeline = language === 'sd' ? st.timelineSd : language === 'en' ? st.timelineEn : st.timelineUr;
      speech += `${title}، وقت: ${timeline}۔ `;
    });

    speakText(speech, language, () => {
      setIsPlayingAudio(false);
    });
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

        <button
          onClick={handleListenCalendar}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
            isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
        </button>
      </div>

      {reminderSavedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{reminderSavedNotice}</span>
        </div>
      )}

      {/* Crop Selector Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {CROPS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c.id)}
            className={`py-3 px-2 rounded-2xl font-bold text-xs sm:text-sm text-center transition border ${
              selectedCrop === c.id
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-102'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {language === 'sd' ? c.nameSd : language === 'en' ? c.nameEn : c.nameUr}
          </button>
        ))}
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const title = language === 'sd' ? stage.titleSd : language === 'en' ? stage.titleEn : stage.titleUr;
          const timeline = language === 'sd' ? stage.timelineSd : language === 'en' ? stage.timelineEn : stage.timelineUr;
          const tasks = language === 'sd' ? stage.tasksSd : language === 'en' ? stage.tasksEn : stage.tasksUr;
          const water = language === 'sd' ? stage.waterAdviceSd : language === 'en' ? stage.waterAdviceEn : stage.waterAdviceUr;
          const fert = language === 'sd' ? stage.fertilizerAdviceSd : language === 'en' ? stage.fertilizerAdviceEn : stage.fertilizerAdviceUr;

          return (
            <div
              key={stage.stageNumber}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3 relative overflow-hidden"
            >
              {/* Header: Stage Badge, Title, Timeline, Reminder button */}
              <div className="flex items-start justify-between gap-2 border-b pb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {stage.stageNumber}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">{title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeline}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSetReminder(title)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition"
                  title="الرٹ لگائیں"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks Checklist */}
              <div>
                <span className="text-xs font-bold text-stone-500 block mb-1.5">{t('calendar.tasks')}</span>
                <div className="space-y-2">
                  {tasks.map((task, idx) => {
                    const taskKey = `${stage.cropId}-${stage.stageNumber}-${idx}`;
                    const isDone = completedTasks[taskKey];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(taskKey)}
                        className={`w-full text-start p-2.5 rounded-xl border flex items-start gap-2.5 transition text-xs sm:text-sm ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200 text-stone-400 line-through'
                            : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100/60'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        )}
                        <span>{task}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Water & Fertilizer Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="bg-cyan-50/80 p-2.5 rounded-2xl border border-cyan-200 text-xs text-cyan-950 flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{t('calendar.waterAdvice')}</span>
                    <span>{water}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                  <Layers className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{t('calendar.fertAdvice')}</span>
                    <span>{fert}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
