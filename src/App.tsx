import React, { useState } from 'react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { RatesScreen } from './components/RatesScreen';
import { SellCropScreen } from './components/SellCropScreen';
import { MachineryScreen } from './components/MachineryScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { LearnScreen } from './components/LearnScreen';
import { AdminScreen } from './components/AdminScreen';
import { AccountScreen } from './components/AccountScreen';
import { WeatherScreen } from './components/WeatherScreen';
import { CropDoctorScreen } from './components/CropDoctorScreen';
import { AccountsScreen } from './components/AccountsScreen';
import { CropCalendarScreen } from './components/CropCalendarScreen';
import { FertilizerScreen } from './components/FertilizerScreen';
import { LaborScreen } from './components/LaborScreen';
import { WaterCanalScreen } from './components/WaterCanalScreen';
import { GovtSchemesScreen } from './components/GovtSchemesScreen';
import { TransportGodownScreen } from './components/TransportGodownScreen';
import { OfflineIndicator } from './components/PWAInstallButton';
import { DataStore, UserProfile } from './services/store';
import { RateEntry, CropListing, EquipmentListing, PracticeCard, QnAItem } from './data/seedData';
import {
  TrendingUp,
  ShoppingBag,
  Tractor,
  BotMessageSquare,
  Home,
  CloudSun,
  Camera,
} from 'lucide-react';

function AgriLinkApp() {
  const { language, dir, t } = useTranslation();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [aiTopicPrompt, setAiTopicPrompt] = useState<string>('');

  // Store data states
  const [rates, setRates] = useState<RateEntry[]>(() => DataStore.getRates());
  const [cropListings, setCropListings] = useState<CropListing[]>(() => DataStore.getCropListings());
  const [equipmentListings, setEquipmentListings] = useState<EquipmentListing[]>(() =>
    DataStore.getEquipmentListings()
  );
  const [practices] = useState<PracticeCard[]>(() => DataStore.getPractices());
  const [qnaItems, setQnaItems] = useState<QnAItem[]>(() => DataStore.getQnA());
  const [user, setUser] = useState<UserProfile | null>(() => DataStore.getUser());

  // Refresh handlers
  const refreshRates = () => setRates(DataStore.getRates());
  const refreshCropListings = () => setCropListings(DataStore.getCropListings());
  const refreshEquipment = () => setEquipmentListings(DataStore.getEquipmentListings());
  const refreshQna = () => setQnaItems(DataStore.getQnA());
  const refreshAll = () => {
    refreshRates();
    refreshCropListings();
    refreshEquipment();
    refreshQna();
  };

  // Pre-fill AI prompt from Learn screen
  const handleAskAiWithPrompt = (prompt: string) => {
    setAiTopicPrompt(prompt);
    setCurrentTab('ai');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans" dir={dir}>
      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* Main App Header */}
      <Header currentTab={currentTab} onNavigate={setCurrentTab} user={user} />

      {/* Main View Area */}
      <main className="flex-1 pb-24 sm:pb-8">
        {currentTab === 'home' && <HomeScreen onSelectTab={setCurrentTab} />}

        {currentTab === 'rates' && (
          <RatesScreen onBack={() => setCurrentTab('home')} rates={rates} onRefreshRates={refreshRates} />
        )}

        {currentTab === 'sell' && (
          <SellCropScreen
            onBack={() => setCurrentTab('home')}
            listings={cropListings}
            onRefreshListings={refreshCropListings}
            rates={rates}
            user={user}
            onRequireLogin={() => setCurrentTab('account')}
          />
        )}

        {currentTab === 'machinery' && (
          <MachineryScreen
            onBack={() => setCurrentTab('home')}
            listings={equipmentListings}
            onRefreshListings={refreshEquipment}
            user={user}
          />
        )}

        {currentTab === 'ai' && (
          <AiAssistantScreen
            onBack={() => setCurrentTab('home')}
            onNavigateTab={setCurrentTab}
            initialTopicPrompt={aiTopicPrompt}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherScreen onBack={() => setCurrentTab('home')} defaultDistrictId={user?.districtId || 'hyderabad'} />
        )}

        {currentTab === 'crop_doctor' && <CropDoctorScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'accounts' && <AccountsScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'calendar' && <CropCalendarScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'fertilizer' && <FertilizerScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'labor' && (
          <LaborScreen
            onBack={() => setCurrentTab('home')}
            user={user}
            onRequireLogin={() => setCurrentTab('account')}
          />
        )}

        {currentTab === 'water_canal' && <WaterCanalScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'govt_schemes' && <GovtSchemesScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'transport_godown' && <TransportGodownScreen onBack={() => setCurrentTab('home')} />}

        {currentTab === 'learn' && (
          <LearnScreen
            onBack={() => setCurrentTab('home')}
            practices={practices}
            qnaItems={qnaItems}
            onRefreshQna={refreshQna}
            onAskAiWithPrompt={handleAskAiWithPrompt}
            user={user}
          />
        )}

        {currentTab === 'admin' && (
          <AdminScreen
            onBack={() => setCurrentTab('home')}
            rates={rates}
            onRefreshRates={refreshRates}
            equipmentListings={equipmentListings}
            onRefreshEquipment={refreshEquipment}
            user={user}
          />
        )}

        {currentTab === 'account' && (
          <AccountScreen
            onBack={() => setCurrentTab('home')}
            user={user}
            onUserChange={setUser}
            cropListings={cropListings}
            equipmentListings={equipmentListings}
            onRefreshData={refreshAll}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation (Fast 1-tap switching) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-2xl">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              currentTab === 'home' ? 'text-emerald-800 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('home')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('rates')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              currentTab === 'rates' ? 'text-amber-700 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('tiles.rates')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('crop_doctor')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              currentTab === 'crop_doctor' ? 'text-rose-700 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">ڈاکٹر</span>
          </button>

          <button
            onClick={() => setCurrentTab('weather')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              currentTab === 'weather' ? 'text-cyan-700 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <CloudSun className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">موسم</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              currentTab === 'ai' ? 'text-purple-800 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BotMessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('tiles.askAi')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AgriLinkApp />
    </LanguageProvider>
  );
}
