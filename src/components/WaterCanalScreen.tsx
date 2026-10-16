import React, { useState } from 'react';
import {
  Waves,
  AlertTriangle,
  PhoneCall,
  Clock,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Plus,
  X,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SEED_CANALS, CanalSchedule } from '../data/moreFeaturesData';
import { DataStore } from '../services/store';
import { speakText, stopSpeaking } from '../utils/speech';

interface WaterCanalScreenProps {
  onBack: () => void;
}

export const WaterCanalScreen: React.FC<WaterCanalScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [canals] = useState<CanalSchedule[]>(SEED_CANALS);
  const [complaints, setComplaints] = useState(() => DataStore.getCanalComplaints());
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Complaint form state
  const [canalName, setCanalName] = useState('روہڑی کینال (Rohri Canal)');
  const [locationRd, setLocationRd] = useState('RD 142 / نزد مورو');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('03001234567');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const updated = DataStore.addCanalComplaint({
      canalName,
      locationRd,
      description: desc.trim(),
      phone: phone.trim(),
    });

    setComplaints(updated);
    setComplaintSuccess(true);
    setTimeout(() => {
      setComplaintSuccess(false);
      setShowComplaintModal(false);
      setDesc('');
    }, 1800);
  };

  const handleListenWater = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = 'سنڌ جي ڪئنالن ۽ واهن جي واريابندي. ';
    canals.forEach((c) => {
      speech += `${c.canalNameUr}، اخراج: ${c.dischargeCusecs} ڪيوسڪ. حالت: ${c.turnStatusUr}۔ `;
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleListenWater}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
              isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
          </button>

          <button
            onClick={() => setShowComplaintModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>شکایت درج کریں</span>
          </button>
        </div>
      </div>

      {/* Official Helpline Notice */}
      <div className="bg-cyan-50 border border-cyan-300 rounded-3xl p-4 flex items-center justify-between text-cyan-950">
        <div className="flex items-center gap-2.5">
          <Waves className="w-5 h-5 text-cyan-700 shrink-0" />
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm">{t('waterCanal.helpline')}</h4>
            <p className="text-[11px] text-cyan-800">سندھ ایریگیشن واٹر ہیلپ لائن برائے ہنگامی اطلاع و پانی چوری</p>
          </div>
        </div>
        <a
          href="tel:1129"
          className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shrink-0 flex items-center gap-1"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>کال 1129</span>
        </a>
      </div>

      {/* Canals List */}
      <div className="space-y-3">
        {canals.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                  {language === 'sd' ? item.barrageNameSd : item.barrageNameUr}
                </span>
                <h3 className="font-extrabold text-lg text-stone-900 mt-1">
                  {language === 'sd' ? item.canalNameSd : item.canalNameUr}
                </h3>
              </div>

              <div className="text-end">
                <span className="text-xs text-stone-400 block">{t('waterCanal.discharge')}</span>
                <span className="text-lg font-black text-cyan-900">
                  {item.dischargeCusecs.toLocaleString()} <span className="text-xs font-normal">cusecs</span>
                </span>
              </div>
            </div>

            {/* Turn Status */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-800 font-semibold space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('waterCanal.turnStatus')}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'sd' ? item.turnStatusSd : item.turnStatusUr}
              </p>
            </div>

            {/* Rotation date */}
            <div className="text-xs text-stone-500 flex items-center justify-between pt-1">
              <span>اگلی باری کی تاریخ: <strong>{item.nextRotationDate}</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                پانی جاری ہے
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lodged Complaints history */}
      {complaints.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-stone-500 uppercase">آپ کی درج شدہ شکایات</h4>
          <div className="space-y-2">
            {complaints.map((comp) => (
              <div key={comp.id} className="p-3 bg-stone-50 rounded-2xl border text-xs space-y-1">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>{comp.canalName} ({comp.locationRd})</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">
                    زیر غور (Under Review)
                  </span>
                </div>
                <p className="text-stone-600">{comp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-stone-900">{t('waterCanal.lodgeComplaint')}</h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {complaintSuccess ? (
              <div className="p-4 bg-emerald-100 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>شکایت محکمہ آبپاشی کے کنٹرول روم کو ارسال کر دی گئی ہے۔</span>
              </div>
            ) : (
              <form onSubmit={handleLodgeComplaint} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نہر / شاخ کا نام</label>
                  <select
                    value={canalName}
                    onChange={(e) => setCanalName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold"
                  >
                    <option value="روہڑی کینال (Rohri Canal)">روہڑی کینال (Rohri Canal)</option>
                    <option value="نارا کینال (Nara Canal)">نارا کینال (Nara Canal)</option>
                    <option value="رائس کینال (Rice Canal)">رائس کینال (Rice Canal)</option>
                    <option value="پھلیلی کینال (Phuleli Canal)">پھلیلی کینال (Phuleli Canal)</option>
                    <option value="دیگر شاخ یا واٹر کورس">دیگر شاخ یا واٹر کورس</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">مقام (RD یا میل)</label>
                  <input
                    type="text"
                    value={locationRd}
                    onChange={(e) => setLocationRd(e.target.value)}
                    placeholder="مثال: RD 110 نزد ہالا"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">شکایت کی نوعیت</label>
                  <textarea
                    required
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="مثال: ٹیل پر پانی نہیں پہنچ رہا یا غیر قانونی موگا لگا ہوا ہے۔"
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رابطہ فون نمبر</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowComplaintModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                  >
                    {t('common.close')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                  >
                    شکایت جمع کریں
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
