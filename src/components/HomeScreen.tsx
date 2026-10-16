import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Tractor,
  BotMessageSquare,
  BookOpen,
  User,
  Volume2,
  VolumeX,
  PhoneCall,
  Sparkles,
  CloudSun,
  Camera,
  Calculator,
  Calendar,
  Layers,
  Users,
  Waves,
  Landmark,
  Truck,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { speakText, stopSpeaking } from '../utils/speech';

interface HomeScreenProps {
  onSelectTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectTab }) => {
  const { language, t } = useTranslation();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'market' | 'farm_tools' | 'help'>('all');

  // 15 Comprehensive Rural Agriculture Cards
  const allCards = [
    // 1. Rates
    {
      id: 'rates',
      category: 'market',
      shortWordUr: 'ریٹ',
      shortWordSd: 'نرخ',
      shortWordEn: 'Rates',
      subtitleKey: 'tiles.ratesDesc',
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900',
      tagTextUr: 'تازہ ترین',
      tagTextSd: 'تازو',
      tagTextEn: 'Daily',
    },
    // 2. Sell Crop
    {
      id: 'sell',
      category: 'market',
      shortWordUr: 'اپنا مال بیچیں',
      shortWordSd: 'پنهنجو مال وڪڻو',
      shortWordEn: 'Sell Crop',
      subtitleKey: 'tiles.sellCropDesc',
      icon: ShoppingBag,
      bgColor: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      tagTextUr: 'براہ راست منڈی',
      tagTextSd: 'سڌي منڊي',
      tagTextEn: 'Direct',
    },
    // 3. Tractor & Trolley
    {
      id: 'machinery',
      category: 'market',
      shortWordUr: 'ٹریکٹر اور ٹرالی',
      shortWordSd: 'ٽريڪٽر ۽ ٽرالي',
      shortWordEn: 'Tractor & Trolley',
      subtitleKey: 'tiles.machineryDesc',
      icon: Tractor,
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      badgeColor: 'bg-blue-100 text-blue-900',
      tagTextUr: 'خرید و کرایہ',
      tagTextSd: 'ڪرايو ۽ وڪرو',
      tagTextEn: 'Rent / Sale',
    },
    // 4. Ask AI
    {
      id: 'ai',
      category: 'farm_tools',
      shortWordUr: 'سوال پوچھیں',
      shortWordSd: 'سوال پڇو',
      shortWordEn: 'Ask AI',
      subtitleKey: 'tiles.askAiDesc',
      icon: BotMessageSquare,
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-700',
      badgeColor: 'bg-purple-100 text-purple-900',
      tagTextUr: 'آواز یا تحریر',
      tagTextSd: 'آواز يا لکي',
      tagTextEn: 'Voice / Chat',
    },
    // 5. Weather
    {
      id: 'weather',
      category: 'farm_tools',
      shortWordUr: 'موسم',
      shortWordSd: 'موسم',
      shortWordEn: 'Weather',
      subtitleKey: 'tiles.weatherDesc',
      icon: CloudSun,
      bgColor: 'bg-gradient-to-br from-cyan-600 to-cyan-700',
      badgeColor: 'bg-cyan-100 text-cyan-900',
      tagTextUr: 'بارش و گرمی',
      tagTextSd: 'مينهن الرٽ',
      tagTextEn: 'Alerts',
    },
    // 6. Crop Doctor (Leaf Camera)
    {
      id: 'crop_doctor',
      category: 'farm_tools',
      shortWordUr: 'فصل کا ڈاکٹر',
      shortWordSd: 'فصل جو ڊاڪٽر',
      shortWordEn: 'Crop Doctor',
      subtitleKey: 'tiles.doctorDesc',
      icon: Camera,
      bgColor: 'bg-gradient-to-br from-rose-600 to-rose-700',
      badgeColor: 'bg-rose-100 text-rose-900',
      tagTextUr: 'پتے کی تصویر',
      tagTextSd: 'پن جو فوٽو',
      tagTextEn: 'Photo AI',
    },
    // 7. Accounts & Profit
    {
      id: 'accounts',
      category: 'farm_tools',
      shortWordUr: 'کھاتہ و منافع',
      shortWordSd: 'کاتو ۽ منافعو',
      shortWordEn: 'Accounts',
      subtitleKey: 'tiles.accountsDesc',
      icon: Calculator,
      bgColor: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
      badgeColor: 'bg-indigo-100 text-indigo-900',
      tagTextUr: 'خرچ و بچت',
      tagTextSd: 'خرچ ۽ بچت',
      tagTextEn: 'Profit/Loss',
    },
    // 8. Crop Calendar
    {
      id: 'calendar',
      category: 'farm_tools',
      shortWordUr: 'فصل کیلنڈر',
      shortWordSd: 'فصل ڪئلينڊر',
      shortWordEn: 'Calendar',
      subtitleKey: 'tiles.calendarDesc',
      icon: Calendar,
      bgColor: 'bg-gradient-to-br from-lime-600 to-lime-700',
      badgeColor: 'bg-lime-100 text-lime-900',
      tagTextUr: 'بوائی و کٹائی',
      tagTextSd: 'پوک ۽ لڻائي',
      tagTextEn: 'Season',
    },
    // 9. Fertilizer & Pesticides
    {
      id: 'fertilizer',
      category: 'farm_tools',
      shortWordUr: 'کھاد و ادویات',
      shortWordSd: 'ڀاڻ ۽ دوائون',
      shortWordEn: 'Fertilizer',
      subtitleKey: 'tiles.fertilizerDesc',
      icon: Layers,
      bgColor: 'bg-gradient-to-br from-amber-700 to-amber-800',
      badgeColor: 'bg-amber-100 text-amber-900',
      tagTextUr: 'ریٹس و ڈیلرز',
      tagTextSd: 'اگھ ۽ ڊيلر',
      tagTextEn: 'Dosage',
    },
    // 10. Farm Labor
    {
      id: 'labor',
      category: 'market',
      shortWordUr: 'مزدور منڈی',
      shortWordSd: 'مزدور منڊي',
      shortWordEn: 'Farm Labor',
      subtitleKey: 'tiles.laborDesc',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-sky-600 to-sky-700',
      badgeColor: 'bg-sky-100 text-sky-900',
      tagTextUr: 'چنائی و کٹائی',
      tagTextSd: 'چونڊ ۽ لڻڻ',
      tagTextEn: 'Workers',
    },
    // 11. Canal Water & Warabandi
    {
      id: 'water_canal',
      category: 'help',
      shortWordUr: 'نہری پانی',
      shortWordSd: 'واهه جو پاڻي',
      shortWordEn: 'Canal Water',
      subtitleKey: 'tiles.waterCanalDesc',
      icon: Waves,
      bgColor: 'bg-gradient-to-br from-teal-600 to-teal-700',
      badgeColor: 'bg-teal-100 text-teal-900',
      tagTextUr: 'وارہ بندی و باری',
      tagTextSd: 'واريابندي',
      tagTextEn: 'Warabandi',
    },
    // 12. Govt Schemes & Loans
    {
      id: 'govt_schemes',
      category: 'help',
      shortWordUr: 'سرکاری اسکیمیں',
      shortWordSd: 'سرڪاري اسڪيمون',
      shortWordEn: 'Govt Schemes',
      subtitleKey: 'tiles.govtSchemesDesc',
      icon: Landmark,
      bgColor: 'bg-gradient-to-br from-emerald-800 to-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      tagTextUr: 'ہاری کارڈ و قرض',
      tagTextSd: 'هاري ڪارڊ',
      tagTextEn: 'Subsidies',
    },
    // 13. Transport & Godowns
    {
      id: 'transport_godown',
      category: 'market',
      shortWordUr: 'ٹرانسپورٹ و گودام',
      shortWordSd: 'ٽرانسپورٽ ۽ گدام',
      shortWordEn: 'Transport',
      subtitleKey: 'tiles.transportGodownDesc',
      icon: Truck,
      bgColor: 'bg-gradient-to-br from-orange-600 to-orange-700',
      badgeColor: 'bg-orange-100 text-orange-900',
      tagTextUr: 'گاڑیاں و اسٹوریج',
      tagTextSd: 'گاڏيون ۽ ذخيرو',
      tagTextEn: 'Storage',
    },
    // 14. Learn
    {
      id: 'learn',
      category: 'help',
      shortWordUr: 'سیکھیں',
      shortWordSd: 'سکو',
      shortWordEn: 'Learn',
      subtitleKey: 'tiles.learnDesc',
      icon: BookOpen,
      bgColor: 'bg-gradient-to-br from-teal-700 to-teal-800',
      badgeColor: 'bg-teal-100 text-teal-900',
      tagTextUr: 'پائیدار زراعت',
      tagTextSd: 'سڌريل کيتي',
      tagTextEn: 'Techniques',
    },
    // 15. My Account
    {
      id: 'account',
      category: 'help',
      shortWordUr: 'میرا اکاؤنٹ',
      shortWordSd: 'منهنجو کاتو',
      shortWordEn: 'My Account',
      subtitleKey: 'tiles.accountDesc',
      icon: User,
      bgColor: 'bg-gradient-to-br from-stone-700 to-stone-800',
      badgeColor: 'bg-stone-200 text-stone-900',
      tagTextUr: 'پروفائل و اشتہار',
      tagTextSd: 'پروفائل ۽ اشتهار',
      tagTextEn: 'Profile',
    },
  ];

  const handleListenHome = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speechContent = '';

    if (language === 'sd') {
      speechContent =
        'ايگري لنڪ زميندار ساٿي ۾ ڀلي ڪري آيا. روزانو منڊي جا اگهه، فصل ۽ ٽريڪٽر جو وڪرو، موسم جو حال، فصل جو ڊاڪٽر فوٽو چڪاس، خرچ ۽ نفعي جو کاتو، ڀاڻ ۽ دوائن جا اگهه، مزدور منڊي، واهن جي واريابندي ۽ بينظير هاري ڪارڊ جون سرڪاري اسڪيمون. پنهنجي پسند جو بٽڻ دٻايو.';
    } else if (language === 'en') {
      speechContent =
        'Welcome to AgriLink Zameendar Saathi. Check daily crop rates, sell crops, rent tractors, view weather forecasts, diagnose leaf diseases with AI, manage farm ledger, check fertilizer prices, find farm labor, view canal warabandi schedule, and apply for government subsidies and loans.';
    } else {
      speechContent =
        'ایگری لنک زمیندار ساتھی میں خوش آمدید۔ روزانہ منڈی ریٹ، فصل اور ٹریکٹر کی خرید و فروخت، موسم الرٹ، پتے کی تصویر سے فصل کا ڈاکٹر، کھاتہ و منافع حساب، کھاد اور ادویات، مزدور منڈی، نہری وارہ بندی، اور بینظیر ہاری کارڈ و سرکاری قرضے۔ اپنی پسند کا بٹن دبائیں۔';
    }

    speakText(speechContent, language, () => {
      setIsPlayingAudio(false);
    });
  };

  const filteredCards = allCards.filter(
    (c) => filterCategory === 'all' || c.category === filterCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Banner with Welcome & Audio Listen Button */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'sd' ? 'سنڌ جو زرعي پورٽل' : language === 'en' ? 'Sindh Farmers Portal' : 'سندھ کا زرعی پورٹل'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'sd'
                ? 'پنهنجي پسند جي خدمت چونڊيو'
                : language === 'en'
                ? 'Choose a service to begin'
                : 'اپنی پسند کی سروس منتخب کریں'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {language === 'sd'
                ? 'نرخ، خريد و وڪرو، موسم، ڊاڪٽر ۽ کاتو'
                : language === 'en'
                ? 'Rates, marketplace, weather, doctor & accounts'
                : 'ریٹ، منڈی، موسم، ڈاکٹر اور کھاتہ بک'}
            </p>
          </div>

          {/* Big Speaker Listen Button */}
          <button
            onClick={handleListenHome}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 ${
              isPlayingAudio
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white text-emerald-900 hover:bg-yellow-300'
            }`}
            aria-label={t('common.listen')}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5 text-white" />
                <span className="hidden sm:inline">{t('common.stop')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-emerald-800" />
                <span>{t('common.listen')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setFilterCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-2xl transition active:scale-95 ${
            filterCategory === 'all'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          تمام خدمات (All)
        </button>
        <button
          onClick={() => setFilterCategory('market')}
          className={`shrink-0 px-4 py-2 rounded-2xl transition active:scale-95 ${
            filterCategory === 'market'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          منڈی و تجارت (Market)
        </button>
        <button
          onClick={() => setFilterCategory('farm_tools')}
          className={`shrink-0 px-4 py-2 rounded-2xl transition active:scale-95 ${
            filterCategory === 'farm_tools'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          فارم ٹولز و ڈاکٹر (Tools & AI)
        </button>
        <button
          onClick={() => setFilterCategory('help')}
          className={`shrink-0 px-4 py-2 rounded-2xl transition active:scale-95 ${
            filterCategory === 'help'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          پانی و سرکاری اسکیمیں (Govt & Water)
        </button>
      </div>

      {/* GRID OF BIG TOUCH TILES (Minimum 64px, very high contrast, vibrant icons) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {filteredCards.map((tile) => {
          const Icon = tile.icon;
          const shortWord =
            language === 'sd'
              ? tile.shortWordSd
              : language === 'en'
              ? tile.shortWordEn
              : tile.shortWordUr;
          const tagText =
            language === 'sd'
              ? tile.tagTextSd
              : language === 'en'
              ? tile.tagTextEn
              : tile.tagTextUr;

          return (
            <button
              key={tile.id}
              onClick={() => onSelectTab(tile.id)}
              className={`${tile.bgColor} text-white p-4 sm:p-5 rounded-3xl shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex flex-col justify-between items-start text-start min-h-[140px] sm:min-h-[155px] relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-yellow-400`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="w-full flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition shadow-inner">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${tile.badgeColor}`}
                >
                  {tagText}
                </span>
              </div>

              {/* Bottom: Big Bold Word */}
              <div className="mt-3 w-full">
                <div className="text-base sm:text-lg font-bold leading-tight drop-shadow-xs">
                  {shortWord}
                </div>
                <div className="text-xs text-white/80 line-clamp-1 mt-0.5">
                  {t(tile.subtitleKey)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 24/7 Sindh Agriculture Helpline Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-3xl p-3.5 flex items-center justify-between text-amber-950">
        <div className="flex items-center gap-2.5">
          <PhoneCall className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <span className="text-xs font-extrabold block">
              {language === 'sd'
                ? 'سنڌ زرعي هيلپ لائين: 0800-12345'
                : language === 'en'
                ? 'Sindh Agriculture Helpline: 0800-12345'
                : 'سندھ زرعی ہیلپ لائن: 0800-12345'}
            </span>
            <span className="text-[11px] text-amber-800">توسیعی افسران اور ماہرین سے مفت رہنمائی حاصل کریں</span>
          </div>
        </div>
        <a
          href="tel:080012345"
          className="text-xs font-bold bg-amber-600 text-white px-3.5 py-2 rounded-xl hover:bg-amber-700 transition shrink-0"
        >
          کال کریں
        </a>
      </div>
    </div>
  );
};
