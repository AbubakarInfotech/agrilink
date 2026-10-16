import React from 'react';
import { Sprout, User, ShieldCheck } from 'lucide-react';
import { useTranslation, Language } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfile } from '../services/store';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, user }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md">
      {/* Top Bar with Language Selector */}
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between border-b border-emerald-700/60">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group text-start focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-inner group-hover:bg-emerald-500 transition">
            <Sprout className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg sm:text-xl tracking-tight leading-tight">
                {t('appName')}
              </span>
              <span className="text-[10px] bg-yellow-400 text-emerald-950 font-bold px-1.5 py-0.5 rounded-full">
                سندھ
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 leading-none">
              {t('appSubtitle')}
            </p>
          </div>
        </button>

        {/* Right side controls: Big Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <PWAInstallButton />

          {/* Big 3-Language Switcher */}
          <div className="flex items-center bg-emerald-900/80 rounded-xl p-0.5 border border-emerald-700">
            {(['ur', 'sd', 'en'] as Language[]).map((lang) => {
              const isActive = language === lang;
              const label = lang === 'ur' ? 'اردو' : lang === 'sd' ? 'سنڌي' : 'Eng';
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-emerald-950 shadow-sm scale-105'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                  }`}
                  aria-label={`Switch to ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Admin shortcut button */}
          <button
            onClick={() => onNavigate('admin')}
            className={`p-2 rounded-xl transition ${
              currentTab === 'admin'
                ? 'bg-yellow-400 text-emerald-950'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100'
            }`}
            title="Admin & Rates Entry"
            aria-label="Admin"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* User profile button */}
          <button
            onClick={() => onNavigate('account')}
            className={`p-2 rounded-xl transition flex items-center gap-1 ${
              currentTab === 'account'
                ? 'bg-yellow-400 text-emerald-950'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100'
            }`}
            title={t('tiles.account')}
            aria-label="Account"
          >
            <User className="w-4 h-4" />
            {user && (
              <span className="hidden sm:inline text-xs font-semibold max-w-[70px] truncate">
                {user.name}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
