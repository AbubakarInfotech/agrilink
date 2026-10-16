import React, { useState } from 'react';
import {
  User,
  Phone,
  Shield,
  KeyRound,
  Trash2,
  LogOut,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  ShoppingBag,
  Tractor,
  MapPin,
} from 'lucide-react';
import { useTranslation, Language } from '../context/LanguageContext';
import { DataStore, UserProfile } from '../services/store';
import { DISTRICTS } from '../data/regions';
import { CropListing, EquipmentListing } from '../data/seedData';

interface AccountScreenProps {
  onBack: () => void;
  user: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  cropListings: CropListing[];
  equipmentListings: EquipmentListing[];
  onRefreshData: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onBack,
  user,
  onUserChange,
  cropListings,
  equipmentListings,
  onRefreshData,
}) => {
  const { language, dir, setLanguage, t } = useTranslation();

  // Login form state
  const [phoneNumber, setPhoneNumber] = useState('03001234567');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer' | 'agent' | 'admin'>('farmer');
  const [districtId, setDistrictId] = useState('hyderabad');
  const [talukaId, setTalukaId] = useState('latifabad');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active view for logged in user: 'profile' | 'my_listings' | 'saved'
  const [profileTab, setProfileTab] = useState<'profile' | 'my_listings' | 'saved'>('profile');

  const selectedDistObj = DISTRICTS.find((d) => d.id === districtId) || DISTRICTS[0];

  // Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setLoginError('براہ کرم درست 11 ہندسوں کا موبائل فون نمبر درج کریں');
      return;
    }
    setLoginError(null);
    setStep('otp');
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234') {
      setLoginError('غلط تصدیقی کوڈ! ٹیسٹنگ کے لیے 1234 درج کریں۔');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${phoneNumber.replace(/\D/g, '')}`,
      name: name.trim() || (role === 'farmer' ? 'حاجی غلام رسول' : 'خریدار تاجر'),
      phone: phoneNumber.trim(),
      role,
      districtId,
      talukaId,
      language,
    };

    DataStore.setUser(newUser);
    onUserChange(newUser);
    setStep('phone');
    setOtpCode('');
  };

  // 1-Tap quick test login
  const handleQuickLogin = () => {
    const testUser: UserProfile = {
      id: 'user-03001234567',
      name: 'وڈیرو غلام رسول (زمیندار)',
      phone: '03001234567',
      role: 'farmer',
      districtId: 'hyderabad',
      talukaId: 'latifabad',
      language,
    };
    DataStore.setUser(testUser);
    onUserChange(testUser);
  };

  // Logout
  const handleLogout = () => {
    DataStore.setUser(null);
    onUserChange(null);
  };

  // Delete Account & Data
  const handleDeleteAccount = () => {
    if (confirm(t('account.deleteConfirm'))) {
      if (user) {
        DataStore.deleteAccountData(user.id);
      }
      onUserChange(null);
      onRefreshData();
      alert('آپ کا اکاؤنٹ اور تمام اشتہارات کامیابی سے ختم کر دیے گئے ہیں۔');
    }
  };

  // User's own listings
  const myListings = cropListings.filter(
    (c) => c.sellerId === user?.id || c.sellerId === 'guest-seller'
  );
  const myEquipment = equipmentListings.filter(
    (e) => e.ownerId === user?.id || e.ownerId === 'guest-owner'
  );

  // Saved listings
  const savedIds = DataStore.getSavedListings();
  const savedCrops = cropListings.filter((c) => savedIds.includes(c.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <h2 className="font-bold text-base sm:text-lg text-stone-900">{t('account.title')}</h2>
      </div>

      {!user ? (
        /* LOGIN / SIGN IN SCREEN */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 max-w-md mx-auto space-y-4">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">{t('account.loginTitle')}</h3>
            <p className="text-xs text-stone-500">{t('account.loginDesc')}</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {loginError}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('account.phone')}
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="03001234567"
                  className="w-full h-12 px-3 rounded-xl border border-stone-300 font-bold text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  آپ کا نام (اختیاری)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حاجی غلام رسول"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('account.role')}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                >
                  <option value="farmer">{t('account.roleFarmer')}</option>
                  <option value="buyer">{t('account.roleBuyer')}</option>
                  <option value="agent">{t('account.roleAgent')}</option>
                  <option value="admin">{t('account.roleAdmin')}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ضلع</label>
                  <select
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                      const d = DISTRICTS.find((x) => x.id === e.target.value);
                      if (d && d.talukas.length > 0) setTalukaId(d.talukas[0].id);
                    }}
                    className="w-full h-11 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تحصیل</label>
                  <select
                    value={talukaId}
                    onChange={(e) => setTalukaId(e.target.value)}
                    className="w-full h-11 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold"
                  >
                    {selectedDistObj.talukas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {language === 'sd' ? t.nameSd : language === 'en' ? t.nameEn : t.nameUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                {t('account.sendOtp')}
              </button>

              {/* 1-Tap Quick Test Sign-in */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="w-full py-2.5 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-950 font-bold text-xs transition border border-yellow-300"
                >
                  ⚡ {t('account.quickLogin')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center text-xs">
                {t('account.testOtpNote')}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('account.enterOtp')}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1234"
                  className="w-full h-14 text-center tracking-widest text-2xl font-mono font-bold rounded-2xl border-2 border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200"
                >
                  {t('common.back')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800"
                >
                  {t('account.verify')}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* LOGGED IN USER PROFILE */
        <div className="space-y-4">
          {/* User Info Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl">
                {user.name.charAt(0) || 'ک'}
              </div>
              <div>
                <h3 className="text-lg font-bold">{user.name}</h3>
                <span className="text-xs text-yellow-300 font-semibold block">{user.phone}</span>
                <span className="inline-block text-[11px] bg-white/20 px-2 py-0.5 rounded-full mt-1">
                  {user.role === 'farmer'
                    ? t('account.roleFarmer')
                    : user.role === 'buyer'
                    ? t('account.roleBuyer')
                    : user.role === 'agent'
                    ? t('account.roleAgent')
                    : t('account.roleAdmin')}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title={t('account.logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Sub tabs */}
          <div className="grid grid-cols-3 gap-2 bg-stone-200/80 p-1 rounded-2xl text-xs sm:text-sm font-bold">
            <button
              onClick={() => setProfileTab('profile')}
              className={`py-2 rounded-xl transition ${
                profileTab === 'profile' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              پروفائل
            </button>
            <button
              onClick={() => setProfileTab('my_listings')}
              className={`py-2 rounded-xl transition ${
                profileTab === 'my_listings' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              میرے اشتہارات ({myListings.length + myEquipment.length})
            </button>
            <button
              onClick={() => setProfileTab('saved')}
              className={`py-2 rounded-xl transition ${
                profileTab === 'saved' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              محفوظ شدہ ({savedCrops.length})
            </button>
          </div>

          {/* Profile details */}
          {profileTab === 'profile' && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
              <h4 className="font-bold text-sm text-stone-800">ذاتی معلومات و ترجیحات</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-stone-500">موبائل فون:</span>
                  <span className="font-bold text-stone-800">{user.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-stone-500">ضلع:</span>
                  <span className="font-bold text-stone-800">{user.districtId}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-stone-500">پسندیدہ زبان:</span>
                  <div className="flex gap-1">
                    {(['ur', 'sd', 'en'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          language === l ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {l === 'ur' ? 'اردو' : l === 'sd' ? 'سنڌي' : 'Eng'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delete account */}
              <div className="pt-4 border-t">
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('account.deleteAccount')}</span>
                </button>
              </div>
            </div>
          )}

          {/* My Listings */}
          {profileTab === 'my_listings' && (
            <div className="space-y-3">
              {myListings.length === 0 && myEquipment.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-stone-400 text-xs">
                  آپ نے ابھی تک کوئی اشتہار شائع نہیں کیا۔
                </div>
              ) : (
                <>
                  {myListings.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">{c.title}</span>
                        <span className="text-xs text-stone-500">
                          {c.quantityMaunds} من | {c.expectedPricePerMaund} روپے فی من
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                        فصل فعال
                      </span>
                    </div>
                  ))}

                  {myEquipment.map((e) => (
                    <div
                      key={e.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">{e.title}</span>
                        <span className="text-xs text-stone-500">
                          {e.price} روپے {e.rentUnit ? `(${e.rentUnit})` : ''}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full">
                        مشینری
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Saved Listings */}
          {profileTab === 'saved' && (
            <div className="space-y-3">
              {savedCrops.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-stone-400 text-xs">
                  کوئی محفوظ شدہ اشتہار موجود نہیں ہے۔
                </div>
              ) : (
                savedCrops.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-stone-900 block">{c.title}</span>
                      <span className="text-xs text-stone-500">
                        {c.quantityMaunds} من | {c.expectedPricePerMaund} روپے
                      </span>
                    </div>
                    <a
                      href={`tel:${c.sellerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      کال کریں
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
