import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Calendar,
  X,
  PieChart,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { DataStore, AccountEntry } from '../services/store';
import { speakText, stopSpeaking } from '../utils/speech';

interface AccountsScreenProps {
  onBack: () => void;
}

export const AccountsScreen: React.FC<AccountsScreenProps> = ({ onBack }) => {
  const { language, dir, t } = useTranslation();

  const [entries, setEntries] = useState<AccountEntry[]>(() => DataStore.getAccounts());
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('expense');
  const [selectedCrop, setSelectedCrop] = useState<'wheat' | 'cotton' | 'rice' | 'sugarcane' | 'general'>('wheat');
  const [category, setCategory] = useState<AccountEntry['category']>('fertilizer');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    if (filterCrop === 'all') return entries;
    return entries.filter((e) => e.cropId === filterCrop);
  }, [entries, filterCrop]);

  // Totals
  const totalIncome = useMemo(() => {
    return filteredEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredEntries]);

  const totalExpense = useMemo(() => {
    return filteredEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredEntries]);

  const netProfit = totalIncome - totalExpense;

  // Add entry submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    const updated = DataStore.addAccountEntry({
      type: entryType,
      cropId: selectedCrop,
      category,
      amount: val,
      description: description.trim() || (entryType === 'income' ? 'آمدن' : 'خرچ'),
      date: entryDate,
    });

    setEntries(updated);
    setShowAddModal(false);
    setAmount('');
    setDescription('');
  };

  // Delete entry
  const handleDelete = (id: string) => {
    if (confirm('کیا آپ یہ اندراج حذف کرنا چاہتے ہیں؟')) {
      const updated = DataStore.deleteAccountEntry(id);
      setEntries(updated);
    }
  };

  // Audio listen
  const handleListenAccounts = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    let speech = '';
    if (language === 'sd') {
      speech = `کُل آمدني ${totalIncome} روپيا، ڪُل خرچ ${totalExpense} روپيا آهي. صاف منافعو ${netProfit} روپيا آهي.`;
    } else if (language === 'en') {
      speech = `Total income is ${totalIncome} rupees. Total expense is ${totalExpense} rupees. Net profit is ${netProfit} rupees.`;
    } else {
      speech = `کل آمدن ${totalIncome} روپے، کل خرچ ${totalExpense} روپے ہے۔ خالص منافع ${netProfit} روپے ہے۔`;
    }

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
          {/* Audio Speaker */}
          <button
            onClick={handleListenAccounts}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
              isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t('common.stop') : t('common.listen')}</span>
          </button>

          {/* Add Entry Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-yellow-300" />
            <span>نیا اندراج</span>
          </button>
        </div>
      </div>

      {/* Summary Cards: Income, Expense, Profit */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Total Income */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold text-emerald-800 block">{t('accounts.totalIncome')}</span>
          <span className="text-base sm:text-xl font-extrabold text-emerald-950 mt-1 block truncate">
            {totalIncome.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600">PKR</span>
        </div>

        {/* Total Expense */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold text-red-800 block">{t('accounts.totalExpense')}</span>
          <span className="text-base sm:text-xl font-extrabold text-red-950 mt-1 block truncate">
            {totalExpense.toLocaleString()}
          </span>
          <span className="text-[10px] text-red-600">PKR</span>
        </div>

        {/* Net Profit */}
        <div
          className={`rounded-2xl p-3 text-center border ${
            netProfit >= 0 ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-red-800 text-white border-red-900'
          }`}
        >
          <span className="text-[11px] font-bold block opacity-90">{t('accounts.netProfit')}</span>
          <span className="text-base sm:text-xl font-extrabold mt-1 block truncate">
            {netProfit.toLocaleString()}
          </span>
          <span className="text-[10px] opacity-80">PKR</span>
        </div>
      </div>

      {/* Filter by Crop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'wheat', 'cotton', 'rice', 'sugarcane'].map((c) => (
          <button
            key={c}
            onClick={() => setFilterCrop(c)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              filterCrop === c
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {c === 'all'
              ? 'تمام فصلیں'
              : c === 'wheat'
              ? 'گندم'
              : c === 'cotton'
              ? 'کپاس'
              : c === 'rice'
              ? 'چاول'
              : 'گنا'}
          </button>
        ))}
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-stone-800">{t('accounts.history')}</h3>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">کوئی اندراج موجود نہیں ہے۔</div>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 hover:bg-stone-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      item.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">{item.description}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-extrabold text-sm sm:text-base ${
                      item.type === 'income' ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}
                    {item.amount.toLocaleString()} PKR
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-stone-900">کھاتہ نیا اندراج</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              {/* Type toggle: Income vs Expense */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryType('expense')}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                    entryType === 'expense'
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  خرچ (Expense)
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('income')}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                    entryType === 'income'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  آمدن (Income)
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رقم (روپے)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="مثال: 45000"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 font-bold text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Crop & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">فصل</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold"
                  >
                    <option value="wheat">گندم (Wheat)</option>
                    <option value="cotton">کپاس (Cotton)</option>
                    <option value="rice">چاول (Rice)</option>
                    <option value="sugarcane">گنا (Sugarcane)</option>
                    <option value="general">دیگر (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">شعبہ / مد</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-semibold"
                  >
                    <option value="fertilizer">کھاد (Fertilizer)</option>
                    <option value="seed">بیج (Seed)</option>
                    <option value="labor">مزدوری (Labor)</option>
                    <option value="fuel">ڈیزل / ٹیوب ویل (Fuel)</option>
                    <option value="spray">اسپرے (Pesticide)</option>
                    <option value="machinery">ٹریکٹر کرایہ (Machinery)</option>
                    <option value="crop_sale">فصل کی فروخت (Sale)</option>
                    <option value="other">دیگر (Other)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تفصیل</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: 5 بوری یوریا کھاد خریدی"
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تاریخ</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  {t('common.close')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
