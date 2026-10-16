import React, { useState } from 'react';
import {
  Layers,
  Calculator,
  Store,
  Phone,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SEED_FERTILIZERS, SEED_DEALERS, FertilizerPrice, FertilizerDealer } from '../data/moreFeaturesData';
import { CROPS } from '../data/seedData';
import { speakText, stopSpeaking } from '../utils/speech';

interface FertilizerScreenProps {
  onBack: () => void;
}

export const FertilizerScreen: React.FC<FertilizerScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'rates' | 'calc' | 'dealers'>('rates');
  const [acresInput, setAcresInput] = useState('5');
  const [selectedCrop, setSelectedCrop] = useState<'wheat' | 'cotton' | 'rice' | 'sugarcane'>('wheat');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const parsedAcres = Math.max(1, parseFloat(acresInput) || 1);

  // Dosage per acre calculation
  const calculatedDoses = {
    ureaBags: selectedCrop === 'sugarcane' ? parsedAcres * 4 : selectedCrop === 'cotton' ? parsedAcres * 2.5 : parsedAcres * 2,
    dapBags: selectedCrop === 'sugarcane' ? parsedAcres * 2 : parsedAcres * 1.5,
    sopBags: parsedAcres * 1,
  };

  const handleListenFertilizer = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = 'کھاد کے ریٹس اور رہنمائی۔ ';
    SEED_FERTILIZERS.forEach((f) => {
      speech += `${f.nameUr}، سرکاری ریٹ ${f.govRate}، مارکیٹ ریٹ ${f.marketRate} روپے۔ `;
    });

    speakText(speech, language, () => {
      setIsPlayingAudio(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <button
          onClick={handleListenFertilizer}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
            isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
        </button>
      </div>

      {/* Pill Tabs: Rates | Calculator | Dealers */}
      <div className="grid grid-cols-3 gap-1.5 bg-stone-200/80 p-1.5 rounded-2xl text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('rates')}
          className={`py-2.5 rounded-xl transition ${
            activeTab === 'rates' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          {t('fertilizer.ratesTab')}
        </button>
        <button
          onClick={() => setActiveTab('calc')}
          className={`py-2.5 rounded-xl transition ${
            activeTab === 'calc' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          {t('fertilizer.calcTab')}
        </button>
        <button
          onClick={() => setActiveTab('dealers')}
          className={`py-2.5 rounded-xl transition ${
            activeTab === 'dealers' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          {t('fertilizer.dealersTab')}
        </button>
      </div>

      {/* TAB 1: RATES & DOSAGE GUIDE */}
      {activeTab === 'rates' && (
        <div className="space-y-3">
          {SEED_FERTILIZERS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900">
                    {language === 'sd' ? item.nameSd : language === 'en' ? item.nameEn : item.nameUr}
                  </h3>
                  <span className="text-xs text-stone-400 font-medium">{item.bagWeight}</span>
                </div>
              </div>

              {/* Price comparison: Gov vs Market */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    {t('fertilizer.govPrice')}
                  </span>
                  <span className="text-xl font-black text-emerald-950">
                    {item.govRate.toLocaleString()} <span className="text-xs font-normal">PKR</span>
                  </span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500 block">
                    {t('fertilizer.marketPrice')}
                  </span>
                  <span className="text-xl font-bold text-stone-800">
                    {item.marketRate.toLocaleString()} <span className="text-xs font-normal">PKR</span>
                  </span>
                </div>
              </div>

              {/* Dosage guidance note */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 font-semibold">
                📌 <strong>خوراک کا طریقہ:</strong>{' '}
                {language === 'sd' ? item.dosageGuideSd : language === 'en' ? item.dosageGuideEn : item.dosageGuideUr}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DOSAGE CALCULATOR */}
      {activeTab === 'calc' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <Calculator className="w-6 h-6" />
            <h3 className="text-base font-bold">{t('fertilizer.calcTab')}</h3>
          </div>

          <p className="text-xs text-stone-600">
            اپنی زمین کے ایکڑ درج کریں اور جانیں کہ آپ کی فصل کے لیے کل کتنی کھاد درکار ہوگی:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ایکڑ کی تعداد</label>
              <input
                type="number"
                min="1"
                value={acresInput}
                onChange={(e) => setAcresInput(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-stone-300 font-extrabold text-lg text-emerald-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">فصل منتخب کریں</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as any)}
                className="w-full h-12 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
              >
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'sd' ? c.nameSd : language === 'en' ? c.nameEn : c.nameUr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results: Required Bags */}
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-xs font-bold text-stone-500 uppercase">مطلوبہ کھاد کے بیگز ({parsedAcres} ایکڑ کے لیے)</h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-emerald-800 block">یوریا (Urea)</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">
                  {calculatedDoses.ureaBags}
                </span>
                <span className="text-[10px] text-stone-500">بوریاں (Bags)</span>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-cyan-800 block">ڈی اے پی (DAP)</span>
                <span className="text-2xl font-black text-cyan-950 mt-1 block">
                  {calculatedDoses.dapBags}
                </span>
                <span className="text-[10px] text-stone-500">بوریاں (Bags)</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-amber-800 block">پوٹاش (SOP)</span>
                <span className="text-2xl font-black text-amber-950 mt-1 block">
                  {calculatedDoses.sopBags}
                </span>
                <span className="text-[10px] text-stone-500">بوریاں (Bags)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED DEALERS */}
      {activeTab === 'dealers' && (
        <div className="space-y-3">
          {SEED_DEALERS.map((dealer) => (
            <div
              key={dealer.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">{dealer.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {language === 'sd' ? dealer.addressSd : dealer.addressUr}
                </p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {dealer.authorizedBrands.map((b, i) => (
                    <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call & WhatsApp actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <a
                  href={`tel:${dealer.phone}`}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs"
                  title="کال کریں"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/92${dealer.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xs"
                  title="واٹس ایپ"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
