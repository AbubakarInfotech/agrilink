import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { DISTRICTS } from '../data/regions';
import { getDistrictWeather } from '../data/moreFeaturesData';
import { speakText, stopSpeaking } from '../utils/speech';

interface WeatherScreenProps {
  onBack: () => void;
  defaultDistrictId?: string;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack, defaultDistrictId = 'hyderabad' }) => {
  const { language, dir, t } = useTranslation();
  const [districtId, setDistrictId] = useState<string>(defaultDistrictId);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const weather = getDistrictWeather(districtId);
  const currentDist = DISTRICTS.find((d) => d.id === districtId) || DISTRICTS[0];
  const distName =
    language === 'sd' ? currentDist.nameSd : language === 'en' ? currentDist.nameEn : currentDist.nameUr;

  const handleListenWeather = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = '';
    if (language === 'sd') {
      speech = `${distName} ۾ اڄوڪي گرمي پد ${weather.todayTemp} سينٽي گريڊ آهي. مينهن جو امڪان ${weather.rainChance} سيڪڙو آهي. اسپرائي بابت صلاح: ${weather.sprayAdvisorySd}. آبپاشي صلاح: ${weather.irrigationAdvisorySd}.`;
    } else if (language === 'en') {
      speech = `Today's temperature in ${distName} is ${weather.todayTemp} degrees Celsius. Rain probability is ${weather.rainChance} percent. Spray advice: ${weather.sprayAdvisoryEn}. Irrigation advice: ${weather.irrigationAdvisoryEn}.`;
    } else {
      speech = `${distName} میں آج کا درجہ حرارت ${weather.todayTemp} ڈگری سینٹی گریڈ ہے۔ بارش کا امکان ${weather.rainChance} فیصد ہے۔ اسپرے کے لیے مشورہ: ${weather.sprayAdvisoryUr}۔ آبپاشی کا مشورہ: ${weather.irrigationAdvisoryUr}۔`;
    }

    speakText(speech, language, () => {
      setIsPlayingAudio(false);
    });
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'heatwave':
      case 'sunny':
        return <Sun className="w-6 h-6 text-amber-500" />;
      default:
        return <CloudSun className="w-6 h-6 text-emerald-600" />;
    }
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

        <div className="flex items-center gap-2">
          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
              </option>
            ))}
          </select>

          {/* Speaker Button */}
          <button
            onClick={handleListenWeather}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
              isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
          </button>
        </div>
      </div>

      {/* Main Today Weather Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-300" />
            <span className="text-lg sm:text-xl font-extrabold">{distName}</span>
          </div>
          <span className="text-xs bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full font-semibold">
            {t('weather.today')}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-2">
          <div>
            <div className="text-5xl sm:text-6xl font-black tracking-tight">{weather.todayTemp}°C</div>
            <p className="text-xs text-teal-200 mt-1">
              {t('weather.feelsLike')} {weather.feelsLike}°C
            </p>
          </div>
          <div className="text-end">
            <Sun className="w-16 h-16 text-yellow-300 drop-shadow-md ms-auto" />
            <span className="text-sm font-bold block mt-1">
              {weather.condition === 'heatwave' ? 'شدید دھوپ' : 'مطلع صاف'}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
          <div className="bg-white/10 rounded-2xl p-2.5">
            <Droplets className="w-4 h-4 mx-auto text-cyan-300 mb-1" />
            <span className="text-[10px] text-white/80 block">{t('weather.humidity')}</span>
            <span className="text-sm font-bold">{weather.humidity}%</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <Wind className="w-4 h-4 mx-auto text-teal-300 mb-1" />
            <span className="text-[10px] text-white/80 block">{t('weather.wind')}</span>
            <span className="text-sm font-bold">{weather.windSpeed} km/h</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <CloudRain className="w-4 h-4 mx-auto text-blue-300 mb-1" />
            <span className="text-[10px] text-white/80 block">{t('weather.rainChance')}</span>
            <span className="text-sm font-bold">{weather.rainChance}%</span>
          </div>
        </div>
      </div>

      {/* Extreme Weather / Rain Alert if any */}
      {(weather.alertsUr || weather.alertsSd) && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-4 flex items-start gap-3 text-amber-900 shadow-xs">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h4 className="font-extrabold text-sm text-amber-950">انتباہ / الرٹ (Alert)</h4>
            <p className="text-xs font-semibold mt-0.5 leading-relaxed">
              {language === 'sd' ? weather.alertsSd : language === 'en' ? weather.alertsEn : weather.alertsUr}
            </p>
          </div>
        </div>
      )}

      {/* Agricultural Advisories: Spray & Irrigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Spray Advisory */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t('weather.sprayAdvisory')}</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed font-medium bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            {language === 'sd' ? weather.sprayAdvisorySd : language === 'en' ? weather.sprayAdvisoryEn : weather.sprayAdvisoryUr}
          </p>
        </div>

        {/* Irrigation Advisory */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>{t('weather.irrigationAdvisory')}</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed font-medium bg-cyan-50/70 p-3 rounded-2xl border border-cyan-100">
            {language === 'sd' ? weather.irrigationAdvisorySd : language === 'en' ? weather.irrigationAdvisoryEn : weather.irrigationAdvisoryUr}
          </p>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-stone-800">{t('weather.forecast7')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {weather.forecast7Days.map((day, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-200/80 flex flex-col justify-between items-center"
            >
              <span className="text-xs font-bold text-stone-700">
                {language === 'sd' ? day.dayNameSd : language === 'en' ? day.dayNameEn : day.dayNameUr}
              </span>
              <div className="my-2">{getConditionIcon(day.condition)}</div>
              <div>
                <span className="text-sm font-extrabold text-stone-900 block">{day.maxTemp}°</span>
                <span className="text-[11px] text-stone-400">{day.minTemp}°</span>
              </div>
              {day.rainChance > 20 && (
                <span className="mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                  ☔ {day.rainChance}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
