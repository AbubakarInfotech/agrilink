import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Compass,
  Bell,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { PROVINCES, DISTRICTS, getNearestDistrict, District, Taluka } from '../data/regions';
import { CROPS, RateEntry, CropInfo } from '../data/seedData';
import { DataStore, PriceAlert } from '../services/store';
import { speakText, stopSpeaking } from '../utils/speech';

interface RatesScreenProps {
  onBack: () => void;
  rates: RateEntry[];
  onRefreshRates: () => void;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({ onBack, rates }) => {
  const { language, dir, t } = useTranslation();

  // Selection states (Default: Sindh -> Hyderabad -> latifabad -> wheat)
  const [selectedProvinceId, setSelectedProvinceId] = useState<'sindh' | 'punjab' | 'kpk' | 'balochistan'>('sindh');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('hyderabad');
  const [selectedTalukaId, setSelectedTalukaId] = useState<string>('latifabad');
  const [selectedCropId, setSelectedCropId] = useState<'wheat' | 'rice' | 'cotton' | 'sugarcane'>('wheat');

  // GPS loading state
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Audio speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Price alert modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetAlertPrice, setTargetAlertPrice] = useState<string>('');
  const [alertSavedSuccess, setAlertSavedSuccess] = useState(false);

  // Districts for selected province
  const availableDistricts = useMemo(() => {
    return DISTRICTS.filter((d) => d.provinceId === selectedProvinceId);
  }, [selectedProvinceId]);

  // Current district object
  const currentDistrict = useMemo(() => {
    return availableDistricts.find((d) => d.id === selectedDistrictId) || availableDistricts[0];
  }, [availableDistricts, selectedDistrictId]);

  // Current talukas
  const availableTalukas: Taluka[] = currentDistrict ? currentDistrict.talukas : [];

  // Current selected crop info
  const currentCropInfo = useMemo(() => {
    return CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  }, [selectedCropId]);

  // Find matching rate or fallback to district-level rate
  const activeRate = useMemo(() => {
    // 1. Try exact crop + district + taluka
    let found = rates.find(
      (r) =>
        r.cropId === selectedCropId &&
        r.districtId === selectedDistrictId &&
        r.talukaId === selectedTalukaId
    );
    // 2. Try exact crop + district (any taluka)
    if (!found) {
      found = rates.find(
        (r) => r.cropId === selectedCropId && r.districtId === selectedDistrictId
      );
    }
    // 3. Fallback to any entry for this crop
    if (!found) {
      found = rates.find((r) => r.cropId === selectedCropId);
    }
    return found;
  }, [rates, selectedCropId, selectedDistrictId, selectedTalukaId]);

  // Comparison in nearby districts for the same crop
  const nearbyRates = useMemo(() => {
    return rates
      .filter((r) => r.cropId === selectedCropId && r.districtId !== selectedDistrictId)
      .slice(0, 3);
  }, [rates, selectedCropId, selectedDistrictId]);

  // GPS Auto-detect
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice(language === 'sd' ? 'GPS سپورٽ ناهي' : 'GPS سپورٹ دستیاب نہیں');
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const nearest = getNearestDistrict(pos.coords.latitude, pos.coords.longitude);
        setSelectedProvinceId(nearest.provinceId);
        setSelectedDistrictId(nearest.id);
        if (nearest.talukas.length > 0) {
          setSelectedTalukaId(nearest.talukas[0].id);
        }

        const districtName =
          language === 'sd' ? nearest.nameSd : language === 'en' ? nearest.nameEn : nearest.nameUr;
        setLocationNotice(
          language === 'sd'
            ? `توهان جي ويجھو ضلعو: ${districtName}`
            : language === 'en'
            ? `Nearest District: ${districtName}`
            : `آپ کا قریبی ضلع: ${districtName}`
        );
      },
      (err) => {
        setIsLocating(false);
        setLocationNotice(
          language === 'sd'
            ? 'لوڪيشن وٺڻ ۾ ڏکيائي، دستي چونڊيو'
            : 'لوکیشن حاصل کرنے میں دشواری، دستی منتخب کریں'
        );
      },
      { timeout: 8000 }
    );
  };

  // Text-to-speech for rates
  const handleListenRates = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    if (!activeRate) return;

    setIsPlayingAudio(true);
    const cropName =
      language === 'sd'
        ? currentCropInfo.nameSd
        : language === 'en'
        ? currentCropInfo.nameEn
        : currentCropInfo.nameUr;
    const distName =
      language === 'sd'
        ? currentDistrict.nameSd
        : language === 'en'
        ? currentDistrict.nameEn
        : currentDistrict.nameUr;

    let text = '';
    if (language === 'sd') {
      text = `${distName} ۾ ${cropName} جو اڄوڪو نرخ ${activeRate.rateToday} روپيا في مڻ آهي. ڪالهه هي اگھ ${activeRate.rateYesterday} روپيا هو. منڊي: ${activeRate.sourceSd}. ياد رکو هي ريٽ اندازي موجب آهن.`;
    } else if (language === 'en') {
      text = `Today's rate for ${cropName} in ${distName} is ${activeRate.rateToday} Rupees per 40 kg. Yesterday was ${activeRate.rateYesterday} Rupees. Source: ${activeRate.sourceEn}. Rates are approximate.`;
    } else {
      text = `${distName} میں ${cropName} کا آج کا ریٹ ${activeRate.rateToday} روپے فی من ہے۔ کل کا ریٹ ${activeRate.rateYesterday} روپے تھا۔ منڈی کا ذریعہ: ${activeRate.sourceUr}۔ یاد رہے یہ ریٹ تخمینی ہیں۔`;
    }

    speakText(text, language, () => {
      setIsPlayingAudio(false);
    });
  };

  // Handle Save Price Alert
  const handleSaveAlert = () => {
    const p = parseFloat(targetAlertPrice);
    if (isNaN(p) || p <= 0) return;

    DataStore.addPriceAlert({
      cropId: selectedCropId,
      targetPrice: p,
      districtId: selectedDistrictId,
    });

    setAlertSavedSuccess(true);
    setTimeout(() => {
      setAlertSavedSuccess(false);
      setShowAlertModal(false);
      setTargetAlertPrice('');
    }, 1500);
  };

  // 30-Day SVG Line Chart Generator
  const renderTrendChart = (history: number[]) => {
    if (!history || history.length < 2) return null;

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    const width = 320;
    const height = 90;
    const padding = 10;

    const points = history
      .map((val, idx) => {
        const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

    const isRising = history[history.length - 1] >= history[0];
    const lineColor = isRising ? '#16a34a' : '#ea580c';
    const fillColor = isRising ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)';

    const areaPoints = `${padding},${height - padding} ${points} ${
      width - padding
    },${height - padding}`;

    return (
      <div className="w-full bg-stone-50 rounded-2xl p-3 border border-stone-200">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
          <span>{t('rates.trend30Days')}</span>
          <span className="font-bold text-stone-700">
            {min} - {max} PKR
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
          <polygon points={areaPoints} fill={fillColor} />
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {/* Last point marker */}
          {history.length > 0 && (
            <circle
              cx={width - padding}
              cy={
                height -
                padding -
                ((history[history.length - 1] - min) / range) * (height - padding * 2)
              }
              r="4"
              fill={lineColor}
            />
          )}
        </svg>
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>30 دن پہلے</span>
          <span>آج</span>
        </div>
      </div>
    );
  };

  const rateDiff = activeRate ? activeRate.rateToday - activeRate.rateYesterday : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* GPS Auto locate button */}
          <button
            onClick={handleUseLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
            title={t('rates.useGps')}
          >
            <Compass className={`w-4 h-4 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('rates.useGps')}</span>
            <span className="sm:hidden">GPS</span>
          </button>

          {/* Speaker Audio Button */}
          <button
            onClick={handleListenRates}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
              isPlayingAudio
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
            title={t('common.listen')}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
          </button>

          {/* Price alert trigger */}
          <button
            onClick={() => setShowAlertModal(true)}
            className="p-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
            title={t('rates.setAlert')}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {locationNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* 4 CROP SELECTOR TILES (Big Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {CROPS.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          const cropName =
            language === 'sd' ? crop.nameSd : language === 'en' ? crop.nameEn : crop.nameUr;
          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              className={`p-3 sm:p-4 rounded-2xl font-bold text-center transition-all flex flex-col items-center justify-center gap-1 border-2 min-h-[70px] ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-md scale-[1.02]'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <span className="text-base sm:text-lg leading-tight">{cropName}</span>
              <span
                className={`text-[11px] font-normal ${
                  isSelected ? 'text-yellow-300' : 'text-stone-500'
                }`}
              >
                {language === 'sd' ? crop.unitSd : language === 'en' ? crop.unitEn : crop.unitUr}
              </span>
            </button>
          );
        })}
      </div>

      {/* GEOGRAPHY FILTERS: Province -> District -> Taluka */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          {t('rates.province')} / {t('rates.district')} / {t('rates.taluka')}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Province */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              {t('rates.province')}
            </label>
            <select
              value={selectedProvinceId}
              onChange={(e) => {
                const prov = e.target.value as any;
                setSelectedProvinceId(prov);
                const matching = DISTRICTS.filter((d) => d.provinceId === prov);
                if (matching.length > 0) {
                  setSelectedDistrictId(matching[0].id);
                  setSelectedTalukaId(matching[0].talukas[0]?.id || '');
                }
              }}
              className="w-full h-12 px-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {language === 'sd' ? p.nameSd : language === 'en' ? p.nameEn : p.nameUr}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              {t('rates.district')}
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                const distId = e.target.value;
                setSelectedDistrictId(distId);
                const d = availableDistricts.find((x) => x.id === distId);
                if (d && d.talukas.length > 0) {
                  setSelectedTalukaId(d.talukas[0].id);
                }
              }}
              className="w-full h-12 px-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
                </option>
              ))}
            </select>
          </div>

          {/* Taluka / Tehsil */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              {t('rates.taluka')}
            </label>
            <select
              value={selectedTalukaId}
              onChange={(e) => setSelectedTalukaId(e.target.value)}
              className="w-full h-12 px-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableTalukas.map((tk) => (
                <option key={tk.id} value={tk.id}>
                  {language === 'sd' ? tk.nameSd : language === 'en' ? tk.nameEn : tk.nameUr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TODAY'S MAIN RATE CARD */}
      {activeRate ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-600 space-y-4 relative overflow-hidden">
          {/* Sample Data Badge (Data Honesty Requirement) */}
          {activeRate.isSample && (
            <div className="absolute top-0 end-0 bg-amber-500 text-white font-bold text-[10px] sm:text-xs px-3 py-1 rounded-bl-2xl shadow-xs">
              {t('rates.sampleBadge')}
            </div>
          )}

          {/* Crop & Location Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'sd'
                  ? currentDistrict.nameSd
                  : language === 'en'
                  ? currentDistrict.nameEn
                  : currentDistrict.nameUr}{' '}
                -{' '}
                {language === 'sd'
                  ? availableTalukas.find((t) => t.id === selectedTalukaId)?.nameSd
                  : language === 'en'
                  ? availableTalukas.find((t) => t.id === selectedTalukaId)?.nameEn
                  : availableTalukas.find((t) => t.id === selectedTalukaId)?.nameUr}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {language === 'sd'
                ? currentCropInfo.nameSd
                : language === 'en'
                ? currentCropInfo.nameEn
                : currentCropInfo.nameUr}
            </h2>
          </div>

          {/* Price Numbers & Up/Down Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Today Rate */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block">
                {t('rates.todayRate')}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
                  {activeRate.rateToday}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800">
                  روپے / PKR
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-medium">
                {language === 'sd'
                  ? activeRate.unitSd
                  : language === 'en'
                  ? activeRate.unitEn
                  : activeRate.unitUr}
              </span>
            </div>

            {/* Yesterday & Change indicator */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 block">
                  {t('rates.yesterdayRate')}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-stone-800">
                  {activeRate.rateYesterday} روپے
                </span>
              </div>

              {/* Up / Down change */}
              <div className="flex items-center gap-1.5 mt-2">
                {rateDiff > 0 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{rateDiff} ({t('rates.rateChangeUp')})</span>
                  </span>
                ) : rateDiff < 0 ? (
                  <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-100 px-2 py-0.5 rounded-lg text-xs font-bold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{rateDiff} ({t('rates.rateChangeDown')})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-200 px-2 py-0.5 rounded-lg text-xs font-bold">
                    <Minus className="w-3.5 h-3.5" />
                    <span>{t('rates.rateChangeSame')}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 30-Day Trend Chart */}
          {renderTrendChart(activeRate.history30Days)}

          {/* Verification Source & Date */}
          <div className="text-xs text-stone-500 pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {t('rates.lastUpdated')}: <strong>{activeRate.lastUpdated}</strong>
              </span>
            </div>
            <div>
              <span>
                {t('rates.source')}:{' '}
                <strong>
                  {language === 'sd'
                    ? activeRate.sourceSd
                    : language === 'en'
                    ? activeRate.sourceEn
                    : activeRate.sourceUr}
                </strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 text-center text-stone-500">
          ریٹ لوڈ ہو رہے ہیں...
        </div>
      )}

      {/* NEARBY DISTRICTS COMPARISON */}
      {nearbyRates.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-3">
          <h3 className="font-bold text-sm text-stone-800">
            {t('rates.nearbyComparison')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {nearbyRates.map((nr) => {
              const dist = DISTRICTS.find((d) => d.id === nr.districtId);
              const distTitle = dist
                ? language === 'sd'
                  ? dist.nameSd
                  : language === 'en'
                  ? dist.nameEn
                  : dist.nameUr
                : nr.districtId;
              return (
                <div
                  key={nr.id}
                  className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-700 block">
                      {distTitle}
                    </span>
                    <span className="text-[11px] text-stone-400 line-clamp-1">
                      {language === 'sd' ? nr.sourceSd : nr.sourceUr}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-base font-extrabold text-emerald-900 block">
                      {nr.rateToday}
                    </span>
                    <span className="text-[10px] text-stone-500">روپے/من</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MANDATORY DISCLAIMER */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">{t('rates.disclaimer')}</p>
      </div>

      {/* PRICE ALERT MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-stone-900">{t('rates.setAlert')}</h3>
            </div>
            <p className="text-xs text-stone-600">
              جب{' '}
              {language === 'sd'
                ? currentCropInfo.nameSd
                : language === 'en'
                ? currentCropInfo.nameEn
                : currentCropInfo.nameUr}{' '}
              کا ریٹ آپ کی مطلوبہ قیمت پر پہنچے گا تو آپ کو مطلع کیا جائے گا۔
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('rates.targetPrice')}
              </label>
              <input
                type="number"
                value={targetAlertPrice}
                onChange={(e) => setTargetAlertPrice(e.target.value)}
                placeholder="مثال: 4200"
                className="w-full h-12 px-3 rounded-xl border border-stone-300 font-bold text-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {alertSavedSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('rates.alertSuccess')}</span>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200"
                >
                  {t('common.close')}
                </button>
                <button
                  onClick={handleSaveAlert}
                  className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800"
                >
                  {t('sell.save')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
