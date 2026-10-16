import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  Sun,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SEED_GOVT_SCHEMES, GovtScheme } from '../data/moreFeaturesData';
import { speakText, stopSpeaking } from '../utils/speech';

interface GovtSchemesScreenProps {
  onBack: () => void;
}

export const GovtSchemesScreen: React.FC<GovtSchemesScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [schemes] = useState<GovtScheme[]>(SEED_GOVT_SCHEMES);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleListenSchemes = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = 'حکومت سندھ اور بینکوں کی زرعی اسکیمیں اور سبسڈی۔ ';
    schemes.forEach((s) => {
      speech += `${s.titleUr}۔ فائدہ: ${s.amountOrBenefitUr}۔ ہیلپ لائن: ${s.helpline}۔ `;
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
          onClick={handleListenSchemes}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
            isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
        </button>
      </div>

      {/* Schemes Cards */}
      <div className="space-y-4">
        {schemes.map((scheme) => {
          const title = language === 'sd' ? scheme.titleSd : language === 'en' ? scheme.titleEn : scheme.titleUr;
          const benefit = language === 'sd' ? scheme.amountOrBenefitSd : language === 'en' ? scheme.amountOrBenefitEn : scheme.amountOrBenefitUr;
          const elig = language === 'sd' ? scheme.eligibilitySd : language === 'en' ? scheme.eligibilityEn : scheme.eligibilityUr;
          const docs = language === 'sd' ? scheme.requiredDocsSd : language === 'en' ? scheme.requiredDocsEn : scheme.requiredDocsUr;
          const how = language === 'sd' ? scheme.howToApplySd : language === 'en' ? scheme.howToApplyEn : scheme.howToApplyUr;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-3.5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                    {scheme.category === 'card' ? 'کسان کارڈ' : scheme.category === 'solar' ? 'سولر سبسڈی' : 'زرعی قرضہ'}
                  </span>
                  <h3 className="font-extrabold text-lg sm:text-xl text-stone-900 mt-1">{title}</h3>
                </div>
              </div>

              {/* Benefit Highlight Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs sm:text-sm font-extrabold text-emerald-950">
                💰 {benefit}
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase mb-1">
                  {t('govtSchemes.eligibility')}
                </h4>
                <ul className="space-y-1">
                  {elig.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-semibold text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase mb-1">
                  {t('govtSchemes.docsRequired')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {docs.map((doc, i) => (
                    <span key={i} className="text-xs font-medium bg-stone-100 text-stone-800 px-2.5 py-1 rounded-xl">
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* How to Apply */}
              <div className="bg-stone-50 p-3 rounded-2xl text-xs text-stone-800">
                <span className="font-bold block mb-0.5">{t('govtSchemes.applyNow')}:</span>
                <span>{how}</span>
              </div>

              {/* Helpline Call Button */}
              <div className="pt-1 flex items-center justify-between border-t text-xs">
                <span className="text-stone-500 font-semibold">ہیلپ لائن: {scheme.helpline}</span>
                <a
                  href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>کال ہیلپ لائن</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
