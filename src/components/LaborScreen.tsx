import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Plus,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  Eye,
  Clock,
  Sparkles,
  Camera,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit3,
  ShieldAlert,
  Search,
  Filter,
  Mic,
  History,
  Lock,
  Check,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import {
  WorkerProfile,
  WorkType,
  WorkerAvailability,
  ContactLogItem,
  SEED_WORKER_PROFILES,
} from '../data/moreFeaturesData';
import { DISTRICTS } from '../data/regions';
import { DataStore, UserProfile } from '../services/store';
import { speakText, stopSpeaking } from '../utils/speech';
import { compressImage } from '../utils/imageCompress';

interface LaborScreenProps {
  onBack: () => void;
  user: UserProfile | null;
  onRequireLogin?: () => void;
}

export const LaborScreen: React.FC<LaborScreenProps> = ({ onBack, user, onRequireLogin }) => {
  const { language, dir, t } = useTranslation();

  // Active top side: 'farmers' (Find Workers) | 'workers' (My Profile & Registration)
  const [activeSide, setActiveSide] = useState<'farmers' | 'workers'>('farmers');

  // Worker profiles state
  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>(() =>
    DataStore.getWorkerProfiles()
  );

  // Contact history log state
  const [contactLogs, setContactLogs] = useState<ContactLogItem[]>(() =>
    DataStore.getContactLogs()
  );

  // Revealed contacts (anti-spam) map: workerId -> boolean
  const [revealedContacts, setRevealedContacts] = useState<Record<string, boolean>>({});

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVoiceGuiding, setIsVoiceGuiding] = useState(false);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showContactLogsModal, setShowContactLogsModal] = useState(false);
  const [reportingWorker, setReportingWorker] = useState<WorkerProfile | null>(null);
  const [reportReason, setReportReason] = useState('fake_profile');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState(false);

  // Farmer Filter state
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterWorkType, setFilterWorkType] = useState<string>('all');
  const [filterMaxWage, setFilterMaxWage] = useState<number>(5000);
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Worker Registration & Edit Form State
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDistrict, setFormDistrict] = useState('sanghar');
  const [formVillage, setFormVillage] = useState('');
  const [formWorkTypes, setFormWorkTypes] = useState<WorkType[]>(['cotton_picking', 'harvesting']);
  const [formDailyWage, setFormDailyWage] = useState('1200');
  const [formAvailability, setFormAvailability] = useState<WorkerAvailability>('available_now');
  const [formAvailableDate, setFormAvailableDate] = useState('');
  const [formExperience, setFormExperience] = useState('5');
  const [formPhoto, setFormPhoto] = useState<string>('');
  const [formSkillsNote, setFormSkillsNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  // Identify if current logged-in user owns a worker profile
  const myWorkerProfile = useMemo(() => {
    if (!user) return null;
    return workerProfiles.find(
      (w) => (w.userId && w.userId === user.id) || (user.phone && w.phone === user.phone)
    );
  }, [user, workerProfiles]);

  // Work type labels map
  const WORK_TYPE_OPTIONS: { id: WorkType; labelUr: string; labelSd: string; labelEn: string; icon: string }[] = [
    { id: 'cotton_picking', labelUr: 'کپاس چنائی', labelSd: 'ڪپهه چونڊ', labelEn: 'Cotton Picking', icon: '☁️' },
    { id: 'harvesting', labelUr: 'کٹائی و بھرائی', labelSd: 'لڻائي ۽ ڀرائي', labelEn: 'Harvesting', icon: '🌾' },
    { id: 'sowing', labelUr: 'بوائی و پنیری', labelSd: 'پوک ۽ پنيئر', labelEn: 'Sowing / Nursery', icon: '🌱' },
    { id: 'spraying', labelUr: 'اسپرے و کھاد', labelSd: 'اسپرائي ۽ ڀاڻ', labelEn: 'Pesticide Spray', icon: '🚿' },
    { id: 'tractor_driver', labelUr: 'ٹریکٹر ڈرائیور', labelSd: 'ٽريڪٽر ڊرائيور', labelEn: 'Tractor Driver', icon: '🚜' },
    { id: 'irrigation', labelUr: 'آبپاشی و وارہ بندی', labelSd: 'پاڻي ۽ واريابندي', labelEn: 'Irrigation Turn', icon: '💧' },
    { id: 'general', labelUr: 'عام زرعی مزدوری', labelSd: 'عام پورھيو', labelEn: 'General Labor', icon: '🔨' },
  ];

  const getWorkTypeLabel = (type: WorkType) => {
    const opt = WORK_TYPE_OPTIONS.find((o) => o.id === type);
    if (!opt) return type;
    if (language === 'sd') return opt.labelSd;
    if (language === 'en') return opt.labelEn;
    return opt.labelUr;
  };

  // Filtered workers for farmers
  const filteredWorkers = useMemo(() => {
    return workerProfiles.filter((worker) => {
      // Hide reported or deleted profiles
      if (worker.isReported) return false;

      // District filter
      if (filterDistrict !== 'all' && worker.districtId !== filterDistrict) {
        return false;
      }

      // Work type filter
      if (filterWorkType !== 'all' && !worker.workTypes.includes(filterWorkType as WorkType)) {
        return false;
      }

      // Max wage filter
      if (worker.dailyWage > filterMaxWage) {
        return false;
      }

      // Availability filter
      if (filterOnlyAvailable && (worker.isPaused || worker.availability !== 'available_now')) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const dist = DISTRICTS.find((d) => d.id === worker.districtId);
        const matchName = worker.name.toLowerCase().includes(query);
        const matchVillage = worker.villageOrTaluka.toLowerCase().includes(query);
        const matchDist = dist && (dist.nameUr.includes(query) || dist.nameSd.includes(query) || dist.nameEn.toLowerCase().includes(query));
        if (!matchName && !matchVillage && !matchDist) return false;
      }

      return true;
    });
  }, [workerProfiles, filterDistrict, filterWorkType, filterMaxWage, filterOnlyAvailable, searchQuery]);

  // Open Registration Modal with prefilled values
  const handleOpenRegister = (profileToEdit?: WorkerProfile) => {
    if (profileToEdit) {
      setEditingProfileId(profileToEdit.id);
      setFormName(profileToEdit.name);
      setFormPhone(profileToEdit.phone);
      setFormDistrict(profileToEdit.districtId);
      setFormVillage(profileToEdit.villageOrTaluka);
      setFormWorkTypes(profileToEdit.workTypes);
      setFormDailyWage(profileToEdit.dailyWage.toString());
      setFormAvailability(profileToEdit.availability);
      setFormAvailableDate(profileToEdit.availableDate || '');
      setFormExperience(profileToEdit.experienceYears.toString());
      setFormPhoto(profileToEdit.photo || '');
      setFormSkillsNote(profileToEdit.skillsNote || '');
    } else {
      setEditingProfileId(null);
      setFormName(user?.name || '');
      setFormPhone(user?.phone || '');
      setFormDistrict(user?.districtId || 'sanghar');
      setFormVillage('');
      setFormWorkTypes(['cotton_picking', 'harvesting']);
      setFormDailyWage('1200');
      setFormAvailability('available_now');
      setFormAvailableDate('');
      setFormExperience('5');
      setFormPhoto('');
      setFormSkillsNote('');
    }
    setShowRegisterModal(true);
  };

  // Toggle work type selection in form
  const handleToggleWorkType = (type: WorkType) => {
    if (formWorkTypes.includes(type)) {
      if (formWorkTypes.length > 1) {
        setFormWorkTypes(formWorkTypes.filter((t) => t !== type));
      }
    } else {
      setFormWorkTypes([...formWorkTypes, type]);
    }
  };

  // Handle Photo upload with compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.7);
      setFormPhoto(compressed);
    } catch (err) {
      console.error('Image compression error:', err);
    }
  };

  // Submit Worker Profile
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setIsSubmitting(true);

    const profileData: WorkerProfile = {
      id: editingProfileId || `worker-${Date.now()}`,
      userId: user?.id || `user-worker-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone.trim(),
      districtId: formDistrict,
      villageOrTaluka: formVillage.trim() || 'ڳوٺ / تعلقہ',
      workTypes: formWorkTypes,
      dailyWage: parseFloat(formDailyWage) || 1200,
      availability: formAvailability,
      availableDate: formAvailability === 'from_date' ? formAvailableDate : undefined,
      experienceYears: parseInt(formExperience) || 3,
      photo: formPhoto || undefined,
      skillsNote: formSkillsNote.trim() || undefined,
      isPaused: false,
      isSample: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = DataStore.saveWorkerProfile(profileData);
    setWorkerProfiles(updated);
    setIsSubmitting(false);
    setFormSuccessMessage(true);

    setTimeout(() => {
      setFormSuccessMessage(false);
      setShowRegisterModal(false);
    }, 1200);
  };

  // Pause / Resume Profile
  const handleTogglePause = (worker: WorkerProfile) => {
    const newPaused = !worker.isPaused;
    const updated = DataStore.pauseWorkerProfile(worker.id, newPaused);
    setWorkerProfiles(updated);
  };

  // Delete Profile
  const handleDeleteProfile = (workerId: string) => {
    if (window.confirm(t('labor.confirmDelete'))) {
      const updated = DataStore.deleteWorkerProfile(workerId);
      setWorkerProfiles(updated);
    }
  };

  // Reveal Contact (anti-spam privacy) and log contact
  const handleRevealContact = (worker: WorkerProfile, action: 'call' | 'whatsapp' = 'call') => {
    setRevealedContacts((prev) => ({ ...prev, [worker.id]: true }));

    // Log contact request
    const logItem: ContactLogItem = {
      id: `log-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workTypes: worker.workTypes,
      districtId: worker.districtId,
      contactedAt: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
      action,
    };

    const updatedLogs = DataStore.addContactLog(logItem);
    setContactLogs(updatedLogs);
  };

  // Report Worker
  const handleReportWorker = () => {
    if (!reportingWorker) return;
    const reason = `${reportReason}: ${reportNotes}`;
    const updated = DataStore.reportWorkerProfile(reportingWorker.id, reason);
    setWorkerProfiles(updated);
    setReportSuccessMsg(true);
    setTimeout(() => {
      setReportSuccessMsg(false);
      setReportingWorker(null);
      setReportNotes('');
    }, 1500);
  };

  // Audio Read-Aloud for Workers List
  const handleListenList = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = language === 'sd'
      ? `مزدور منڊي ۾ هن وقت ${filteredWorkers.length} ماهر مزدور موجود آهن. `
      : `مزدور منڈی میں اس وقت ${filteredWorkers.length} ماہر مزدور دستیاب ہیں۔ `;

    filteredWorkers.slice(0, 3).forEach((w, idx) => {
      const dist = DISTRICTS.find((d) => d.id === w.districtId);
      const distName = language === 'sd' ? dist?.nameSd : dist?.nameUr;
      const types = w.workTypes.map((t) => getWorkTypeLabel(t)).join('، ');
      speech += `نمبر ${idx + 1}: ${w.name}، ضلع ${distName}۔ کام: ${types}۔ متوقع اجرت: ${w.dailyWage} روپے۔ `;
    });

    speakText(speech, language, () => {
      setIsPlayingAudio(false);
    });
  };

  // Audio Read-Aloud for Single Worker
  const handleListenSingle = (w: WorkerProfile) => {
    const dist = DISTRICTS.find((d) => d.id === w.districtId);
    const distName = language === 'sd' ? dist?.nameSd : dist?.nameUr;
    const types = w.workTypes.map((t) => getWorkTypeLabel(t)).join('، ');
    const text = language === 'sd'
      ? `${w.name}، ضلعو ${distName}، ڳوٺ ${w.villageOrTaluka}. ڪم: ${types}. ڏهاڙي: ${w.dailyWage} روپيا. تجربو: ${w.experienceYears} سال.`
      : `${w.name}، ضلع ${distName}، گاؤں ${w.villageOrTaluka}۔ کام: ${types}۔ روزانہ اجرت: ${w.dailyWage} روپے۔ تجربہ: ${w.experienceYears} سال۔`;

    speakText(text, language);
  };

  // Voice Guided Form: speaks field instructions aloud
  const handleStartVoiceGuidance = () => {
    if (isVoiceGuiding) {
      stopSpeaking();
      setIsVoiceGuiding(false);
      return;
    }

    setIsVoiceGuiding(true);
    const guideText = language === 'sd'
      ? 'مزدور ڀائرن لاءِ رهنمائي: پهريان پنهنجو نالو لکو يا ٻڌايو. ان کان پوءِ پنهنجو موبائل فون نمبر ۽ ضلعو چونڊيو. پوءِ ڪم جي قسم تي نشان لڳايو جهڙوڪ ڪپهه چونڊڻ، لڻائي يا ٽريڪٽر هلائڻ. پنهنجي روزانو گهربل پگهار ۽ تجربو چونڊي سائي رنگ جو بٽڻ دٻايو.'
      : 'مزدور بھائیوں کے لیے صوتی رہنمائی: پہلے اپنا نام درج کریں۔ اس کے بعد اپنا موبائل فون نمبر اور ضلع منتخب کریں۔ پھر اپنے کام کی اقسام پر کلک کریں جیسے کپاس چنائی، کٹائی یا ٹریکٹر ڈرائیونگ۔ اپنی متوقع روزانہ اجرت اور تجربہ لکھ کر نیچے سبز بٹن دبا کر پروفائل محفوظ کریں۔';

    speakText(guideText, language, () => {
      setIsVoiceGuiding(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-900 font-bold text-sm hover:bg-emerald-100 transition active:scale-95 shadow-xs"
        >
          {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio Listen */}
          <button
            onClick={handleListenList}
            className={`flex items-center gap-1.5 min-h-[48px] px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
              isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t('labor.stopListen') : t('labor.listen')}</span>
          </button>

          {/* Contact History Log Button */}
          <button
            onClick={() => setShowContactLogsModal(true)}
            className="flex items-center gap-1.5 min-h-[48px] px-3 sm:px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 relative"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{t('labor.contactHistory')}</span>
            {contactLogs.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-amber-900 rounded-full text-[10px] font-black">
                {contactLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Screen Title & Subtitle Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold text-emerald-100">
              سندھ لیبر مارکیٹ
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[11px] font-black text-stone-900">
              مزدور و زمیندار
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('labor.title')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">{t('labor.subtitle')}</p>
        </div>
        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center backdrop-blur-xs">
          <Users className="w-8 h-8 text-yellow-300" />
        </div>
      </div>

      {/* Two Big Primary Sides Tabs (Minimum 56px height) */}
      <div className="grid grid-cols-2 gap-2 bg-stone-200/90 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSide('farmers')}
          className={`min-h-[56px] rounded-xl flex items-center justify-center gap-2 font-black text-sm sm:text-base transition-all active:scale-98 ${
            activeSide === 'farmers'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-stone-700 hover:bg-stone-300/60'
          }`}
        >
          <Search className="w-5 h-5 text-yellow-300" />
          <span>{t('labor.sideFarmers')}</span>
        </button>

        <button
          onClick={() => setActiveSide('workers')}
          className={`min-h-[56px] rounded-xl flex items-center justify-center gap-2 font-black text-sm sm:text-base transition-all active:scale-98 ${
            activeSide === 'workers'
              ? 'bg-blue-700 text-white shadow-md'
              : 'text-stone-700 hover:bg-stone-300/60'
          }`}
        >
          <UserCheck className="w-5 h-5 text-cyan-300" />
          <span>{t('labor.sideWorkers')}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SIDE 1: FOR FARMERS (FIND WORKERS)                       */}
      {/* ======================================================== */}
      {activeSide === 'farmers' && (
        <div className="space-y-4">
          {/* Anti-spam & Privacy Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold leading-relaxed">{t('labor.syncNotice')}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="font-extrabold text-xs text-stone-800 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span>فلٹرز برائے مزدور تلاش</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {filteredWorkers.length} مزدور دستیاب
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* District Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  {t('labor.filterDistrict')}
                </label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">{t('labor.allDistricts')}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {language === 'sd' ? d.nameSd : d.nameUr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Type Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  {t('labor.filterWorkType')}
                </label>
                <select
                  value={filterWorkType}
                  onChange={(e) => setFilterWorkType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">{t('labor.allWorkTypes')}</option>
                  {WORK_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.icon} {language === 'sd' ? opt.labelSd : language === 'en' ? opt.labelEn : opt.labelUr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wage Slider & Availability Checkbox */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>{t('labor.filterWage')}:</span>
                  <span className="text-emerald-800 font-black">PKR {filterMaxWage} تک</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="5000"
                  step="100"
                  value={filterMaxWage}
                  onChange={(e) => setFilterMaxWage(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  checked={filterOnlyAvailable}
                  onChange={(e) => setFilterOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded accent-emerald-700"
                />
                <span>صرف فوری دستیاب مزدور</span>
              </label>
            </div>
          </div>

          {/* Workers List */}
          {filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-stone-200">
              <Users className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-stone-600 font-bold text-sm">
                اس فلٹر کے مطابق کوئی مزدور نہیں ملا۔
              </p>
              <button
                onClick={() => {
                  setFilterDistrict('all');
                  setFilterWorkType('all');
                  setFilterMaxWage(5000);
                  setFilterOnlyAvailable(false);
                }}
                className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-200"
              >
                تمام فلٹرز ختم کریں
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredWorkers.map((worker) => {
                const dist = DISTRICTS.find((d) => d.id === worker.districtId);
                const isRevealed = revealedContacts[worker.id];
                const isWorkerPaused = worker.isPaused || worker.availability === 'busy';

                return (
                  <div
                    key={worker.id}
                    className={`bg-white rounded-3xl p-5 border transition-all shadow-xs space-y-3.5 ${
                      isWorkerPaused
                        ? 'border-stone-200 opacity-80 bg-stone-50/50'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    {/* Header Row: Photo/Avatar + Name + Status Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Worker Photo or Avatar */}
                        {worker.photo ? (
                          <img
                            src={worker.photo}
                            alt={worker.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
                            {worker.name.charAt(0)}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-base sm:text-lg text-stone-900">
                              {worker.name}
                            </h3>
                            {worker.isSample && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                                نمونہ / Sample
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{language === 'sd' ? dist?.nameSd : dist?.nameUr}</span>
                              <span className="text-stone-300">•</span>
                              <span>{worker.villageOrTaluka}</span>
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                            تجربہ: <span className="font-bold text-stone-800">{worker.experienceYears} سال</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge + Audio Listen */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isWorkerPaused ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{t('labor.statusPaused')}</span>
                          </span>
                        ) : worker.availability === 'from_date' ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{worker.availableDate} سے</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{t('labor.statusActive')}</span>
                          </span>
                        )}

                        {/* Speaker TTS */}
                        <button
                          onClick={() => handleListenSingle(worker)}
                          title="آواز میں سنیں"
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Work Types Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {worker.workTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1"
                        >
                          <span>{getWorkTypeLabel(type)}</span>
                        </span>
                      ))}
                    </div>

                    {/* Skills Note */}
                    {worker.skillsNote && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-medium leading-relaxed">
                        {worker.skillsNote}
                      </p>
                    )}

                    {/* Expected Wage Display */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <div className="text-xs text-stone-600">
                        <span>متوقع روزانہ اجرت:</span>
                        <span className="block sm:inline font-black text-emerald-800 text-base sm:mr-1">
                          PKR {worker.dailyWage.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-stone-500 font-normal"> / روزانہ</span>
                      </div>

                      {/* Report Abuse Button */}
                      <button
                        onClick={() => setReportingWorker(worker)}
                        className="text-[11px] font-bold text-stone-400 hover:text-red-600 transition flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{t('labor.report')}</span>
                      </button>
                    </div>

                    {/* Anti-spam Contact Section */}
                    <div className="pt-2">
                      {!isRevealed ? (
                        <button
                          onClick={() => handleRevealContact(worker)}
                          className="w-full min-h-[52px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-5 h-5 text-yellow-300" />
                          <span>{t('labor.showContact')}</span>
                          <span className="text-emerald-200 text-xs font-normal">
                            (0300-***-***)
                          </span>
                        </button>
                      ) : (
                        <div className="space-y-2 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                            <span>رابطہ نمبر:</span>
                            <span className="font-mono text-sm tracking-wider font-black text-stone-900" dir="ltr">
                              {worker.phone}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Direct Call */}
                            <a
                              href={`tel:${worker.phone}`}
                              onClick={() => handleRevealContact(worker, 'call')}
                              className="min-h-[48px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                            >
                              <Phone className="w-4 h-4 text-yellow-300" />
                              <span>{t('labor.call')}</span>
                            </a>

                            {/* Direct WhatsApp */}
                            <a
                              href={`https://wa.me/92${worker.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleRevealContact(worker, 'whatsapp')}
                              className="min-h-[48px] rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                            >
                              <MessageSquare className="w-4 h-4 text-white" />
                              <span>{t('labor.whatsapp')}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDE 2: FOR WORKERS (REGISTER / EDIT PROFILE)             */}
      {/* ======================================================== */}
      {activeSide === 'workers' && (
        <div className="space-y-4">
          {/* Worker Dashboard Card: If worker already registered */}
          {myWorkerProfile ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600 shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                    {t('labor.myProfile')}
                  </span>
                  <h2 className="text-xl font-black text-stone-900 mt-2">
                    {myWorkerProfile.name}
                  </h2>
                  <p className="text-xs text-stone-500 font-semibold mt-0.5">
                    {myWorkerProfile.phone} • {myWorkerProfile.villageOrTaluka}
                  </p>
                </div>

                {/* Profile Status Badge */}
                <div>
                  {myWorkerProfile.isPaused ? (
                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1">
                      <PauseCircle className="w-4 h-4 text-amber-700" />
                      <span>{t('labor.statusPaused')}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center gap-1">
                      <PlayCircle className="w-4 h-4 text-emerald-700" />
                      <span>{t('labor.statusActive')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Skills & Details Summary */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-600">متوقع یومیہ اجرت:</span>
                  <span className="font-black text-emerald-800 text-sm">
                    PKR {myWorkerProfile.dailyWage.toLocaleString()} / روزانہ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-600">تجربہ:</span>
                  <span className="font-bold text-stone-900">{myWorkerProfile.experienceYears} سال</span>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-600 block mb-1">کام کی مہارتیں:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {myWorkerProfile.workTypes.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-white rounded-lg border text-stone-800 font-bold">
                        {getWorkTypeLabel(t)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Worker Action Buttons (Minimum 56px height) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {/* 1. Edit Profile */}
                <button
                  onClick={() => handleOpenRegister(myWorkerProfile)}
                  className="min-h-[56px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
                >
                  <Edit3 className="w-4 h-4 text-yellow-300" />
                  <span>{t('labor.editProfile')}</span>
                </button>

                {/* 2. Pause / Resume Profile */}
                <button
                  onClick={() => handleTogglePause(myWorkerProfile)}
                  className={`min-h-[56px] rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98 ${
                    myWorkerProfile.isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {myWorkerProfile.isPaused ? (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      <span>{t('labor.resumeProfile')}</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-5 h-5" />
                      <span>{t('labor.pauseProfile')}</span>
                    </>
                  )}
                </button>

                {/* 3. Delete Profile */}
                <button
                  onClick={() => handleDeleteProfile(myWorkerProfile.id)}
                  className="min-h-[56px] rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 font-extrabold text-sm flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>{t('labor.deleteProfile')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* If no profile registered yet */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900">
                {t('labor.myProfile')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {t('labor.noProfileYet')}
              </p>

              {/* Big 56px Register Profile Button */}
              <button
                onClick={() => handleOpenRegister()}
                className="w-full sm:w-auto min-h-[56px] px-8 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm sm:text-base shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5 text-yellow-300" />
                <span>{t('labor.createProfileBtn')}</span>
              </button>
            </div>
          )}

          {/* Voice-guided Registration Option & Literacy Friendly Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-700" />
                <h3 className="font-black text-sm text-purple-900">
                  کم پڑھے لکھے مزدور بھائیوں کے لیے صوتی رہنمائی
                </h3>
              </div>

              {/* Voice button */}
              <button
                onClick={handleStartVoiceGuidance}
                className={`min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isVoiceGuiding
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isVoiceGuiding ? t('labor.stopVoice') : t('labor.voiceGuided')}</span>
              </button>
            </div>

            <p className="text-xs text-purple-900/80 leading-relaxed">
              اگر آپ کو فارم بھرنے میں مشکل پیش آئے تو اوپر دیے گئے صوتی رہنمائی بٹن کو دبائیں۔
              ایپ آپ کو آسان اردو اور سندھی میں بول کر ہر خانے کی تفصیل بتائے گی تاکہ آپ باآسانی رجسٹر ہو سکیں۔
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* WORKER REGISTRATION & EDIT MODAL                         */}
      {/* ======================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {editingProfileId ? t('labor.editProfile') : t('labor.registerWorker')}
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Guidance Button Inside Form */}
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs">
              <span className="font-bold text-purple-900">آواز سن کر فارم بھریں:</span>
              <button
                type="button"
                onClick={handleStartVoiceGuidance}
                className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center gap-1 hover:bg-purple-800"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isVoiceGuiding ? t('labor.stopVoice') : t('labor.voiceGuided')}</span>
              </button>
            </div>

            {formSuccessMessage && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{t('labor.savedSuccess')}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProfile} className="space-y-4">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('labor.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: بخشل خان نظامانی / فدا حسین"
                  className="w-full h-12 px-3.5 rounded-2xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Field 2: Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('labor.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full h-12 px-3.5 rounded-2xl border border-stone-300 font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>

              {/* Field 3: District and Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('labor.district')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-stone-50 border border-stone-300 font-bold text-xs"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'sd' ? d.nameSd : d.nameUr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('labor.village')}
                  </label>
                  <input
                    type="text"
                    value={formVillage}
                    onChange={(e) => setFormVillage(e.target.value)}
                    placeholder="مثال: ڳوٺ نظاماڻي / حاتری"
                    className="w-full h-12 px-3.5 rounded-2xl border border-stone-300 font-bold text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Field 4: Work Types (Multi-select Big Buttons) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t('labor.workType')} (ایک یا زیادہ منتخب کریں):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WORK_TYPE_OPTIONS.map((opt) => {
                    const isSelected = formWorkTypes.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleToggleWorkType(opt.id)}
                        className={`min-h-[46px] p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-base">{opt.icon}</span>
                        <span className="truncate">
                          {language === 'sd' ? opt.labelSd : language === 'en' ? opt.labelEn : opt.labelUr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 5: Wage and Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('labor.dailyWage')}
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="50"
                    value={formDailyWage}
                    onChange={(e) => setFormDailyWage(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-2xl border border-stone-300 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('labor.experience')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-2xl border border-stone-300 font-bold text-sm"
                  />
                </div>
              </div>

              {/* Field 6: Availability Status */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t('labor.availability')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormAvailability('available_now')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                      formAvailability === 'available_now'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('labor.availNow')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormAvailability('busy')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                      formAvailability === 'busy'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('labor.availBusy')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormAvailability('from_date')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                      formAvailability === 'from_date'
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('labor.availDate')}
                  </button>
                </div>

                {formAvailability === 'from_date' && (
                  <div className="mt-2">
                    <input
                      type="date"
                      value={formAvailableDate}
                      onChange={(e) => setFormAvailableDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Field 7: Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('labor.photo')}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 min-h-[48px] rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-stone-600">
                    <Camera className="w-5 h-5 text-emerald-700" />
                    <span>تصویر چنیں (یا کیمرہ کھولیں)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {formPhoto && (
                    <div className="relative">
                      <img
                        src={formPhoto}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setFormPhoto('')}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Field 8: Skills Note */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اضافی تفصیل / مہارت (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={formSkillsNote}
                  onChange={(e) => setFormSkillsNote(e.target.value)}
                  placeholder="مثال: کپاس چنائی میں 10 افراد کی ٹیم موجود ہے، یا فورڈ ٹریکٹر چلانے کا خاص تجربہ۔"
                  className="w-full p-3 rounded-2xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              {/* Submit Button (Minimum 56px height) */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 min-h-[56px] rounded-2xl bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200"
                >
                  {t('common.close')}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 min-h-[56px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-lg transition active:scale-98 disabled:opacity-50"
                >
                  {t('labor.saveProfile')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONTACT HISTORY LOG MODAL                                */}
      {/* ======================================================== */}
      {showContactLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-700" />
                <h3 className="font-black text-base text-stone-900">
                  {t('labor.contactLog')}
                </h3>
              </div>
              <button
                onClick={() => setShowContactLogsModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contactLogs.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs font-semibold">
                {t('labor.noContactLog')}
              </div>
            ) : (
              <div className="space-y-3">
                {contactLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-black text-sm text-stone-900">{log.workerName}</h4>
                      <p className="font-mono text-xs text-stone-600 mt-0.5" dir="ltr">
                        {log.workerPhone}
                      </p>
                      <span className="text-[10px] text-stone-400 mt-0.5 block">
                        وقت رابطہ: {log.contactedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${log.workerPhone}`}
                        className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                        title="دوبارہ کال کریں"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/92${log.workerPhone.replace(/\D/g, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700"
                        title="واٹس ایپ میسج"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowContactLogsModal(false)}
              className="w-full min-h-[48px] rounded-2xl bg-stone-100 text-stone-800 font-bold text-xs"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REPORT WORKER MODAL (ANTI-ABUSE / FAKE PROFILES)         */}
      {/* ======================================================== */}
      {reportingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-black text-base">{t('labor.reportModalTitle')}</h3>
              </div>
              <button
                onClick={() => setReportingWorker(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccessMsg ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center">
                {t('labor.reportedSuccess')}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  آپ <span className="font-bold text-stone-900">{reportingWorker.name}</span> کے پروفائل کو رپورٹ کر رہے ہیں۔
                </p>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('labor.reportReason')}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold"
                  >
                    <option value="fake_profile">جعلی نمبر یا غلط معلومات (Fake Profile)</option>
                    <option value="unreachable">فون بند ہے یا جواب نہیں دیا (Unreachable)</option>
                    <option value="wrong_wage">متفقہ اجرت سے زیادہ مانگنا (Wrong Wage)</option>
                    <option value="abusive_behavior">نامناسب رویہ (Abusive Behavior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    مزید تفصیل (اختیاری)
                  </label>
                  <textarea
                    rows={2}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="شکایت کی وجہ تفصیل سے لکھیں..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setReportingWorker(null)}
                    className="flex-1 min-h-[48px] rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                  >
                    {t('common.close')}
                  </button>
                  <button
                    onClick={handleReportWorker}
                    className="flex-1 min-h-[48px] rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                  >
                    {t('labor.submitReport')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
