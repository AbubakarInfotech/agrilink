import React, { useState } from 'react';
import {
  Truck,
  Warehouse,
  Phone,
  MessageSquare,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SEED_TRANSPORTS, SEED_GODOWNS, TransportListing, GodownListing } from '../data/moreFeaturesData';
import { DISTRICTS } from '../data/regions';
import { speakText, stopSpeaking } from '../utils/speech';

interface TransportGodownScreenProps {
  onBack: () => void;
}

export const TransportGodownScreen: React.FC<TransportGodownScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'transport' | 'godown'>('transport');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleListenTransport = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = 'منڈی ٹرانسپورٹ اور اناج گودام۔ ';
    if (activeTab === 'transport') {
      SEED_TRANSPORTS.forEach((t) => {
        speech += `${t.titleUr}۔ گنجائش: ${t.capacityMaunds} من۔ رابطہ: ${t.phone}۔ `;
      });
    } else {
      SEED_GODOWNS.forEach((g) => {
        speech += `${g.titleUr}۔ گنجائش: ${g.capacityBags} بوریاں۔ رابطہ: ${g.phone}۔ `;
      });
    }

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
          onClick={handleListenTransport}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
            isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-stone-200/80 p-1.5 rounded-2xl text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('transport')}
          className={`py-2.5 rounded-xl transition ${
            activeTab === 'transport' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          {t('transportGodown.transportTab')}
        </button>
        <button
          onClick={() => setActiveTab('godown')}
          className={`py-2.5 rounded-xl transition ${
            activeTab === 'godown' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          {t('transportGodown.godownTab')}
        </button>
      </div>

      {/* TAB 1: MANDI TRANSPORTS */}
      {activeTab === 'transport' && (
        <div className="space-y-3">
          {SEED_TRANSPORTS.map((item) => {
            const dist = DISTRICTS.find((d) => d.id === item.districtId);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between"
              >
                <div className="sm:w-48 aspect-video sm:aspect-auto bg-stone-100 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.titleUr} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-bold text-emerald-800 uppercase">
                        گنجائش: {item.capacityMaunds} من
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dist?.nameUr || item.districtId}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 mt-1">
                      {language === 'sd' ? item.titleSd : item.titleUr}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1">
                      روٹس: <strong>{item.availableRoute}</strong>
                    </p>

                    <div className="text-xs font-bold text-emerald-900 mt-2">
                      کرایہ ریٹ: {item.ratePerKmOrTrip} ({item.rateUnit})
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-xs text-stone-500">{item.ownerName}</span>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>کال</span>
                      </a>
                      <a
                        href={`https://wa.me/92${item.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>واٹس ایپ</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: GODOWNS & COLD STORAGES */}
      {activeTab === 'godown' && (
        <div className="space-y-3">
          {SEED_GODOWNS.map((item) => {
            const dist = DISTRICTS.find((d) => d.id === item.districtId);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                      {item.type === 'cold_storage' ? 'کولڈ اسٹوریج' : 'اناج گودام'}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mt-1">
                      {language === 'sd' ? item.titleSd : item.titleUr}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{item.address}</p>
                  </div>

                  <div className="text-end">
                    <span className="text-xs text-stone-400 block">{t('transportGodown.capacity')}</span>
                    <span className="text-base font-black text-stone-900">
                      {item.capacityBags.toLocaleString()} <span className="text-xs font-normal">بوریاں</span>
                    </span>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border text-xs flex items-center justify-between">
                  <div>
                    کرایہ: <strong>{item.ratePerBagMonthly} روپے</strong> فی بوری (ماہانہ)
                  </div>
                  {item.securityPestControl && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      کیڑوں سے محفوظ
                    </span>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-stone-500">مالک: {item.ownerName}</span>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>کال</span>
                    </a>
                    <a
                      href={`https://wa.me/92${item.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>واٹس ایپ</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
