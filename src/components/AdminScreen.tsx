import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Globe,
  Upload,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { CROPS, RateEntry, EquipmentListing } from '../data/seedData';
import { DISTRICTS } from '../data/regions';
import { DataStore, UserProfile } from '../services/store';

interface AdminScreenProps {
  onBack: () => void;
  rates: RateEntry[];
  onRefreshRates: () => void;
  equipmentListings: EquipmentListing[];
  onRefreshEquipment: () => void;
  user: UserProfile | null;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  onBack,
  rates,
  onRefreshRates,
  equipmentListings,
  onRefreshEquipment,
}) => {
  const { language, dir, t } = useTranslation();

  // Active view: 'rates' | 'csv' | 'moderation' | 'api'
  const [adminTab, setAdminTab] = useState<'rates' | 'csv' | 'moderation' | 'api'>('rates');

  // Rate form state
  const [cropId, setCropId] = useState<'wheat' | 'rice' | 'cotton' | 'sugarcane'>('wheat');
  const [districtId, setDistrictId] = useState('hyderabad');
  const [talukaId, setTalukaId] = useState('latifabad');
  const [rateToday, setRateToday] = useState('');
  const [rateYesterday, setRateYesterday] = useState('');
  const [sourceUr, setSourceUr] = useState('حیدرآباد غلہ منڈی');
  const [sourceEn, setSourceEn] = useState('Hyderabad Grain Market');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // CSV paste/import state
  const [csvText, setCsvText] = useState(
    'cropId,districtId,talukaId,rateToday,rateYesterday,source\nwheat,matiari,hala,4120,4080,ہالا غلہ منڈی\ncotton,sanghar,shahdadpur,8950,8900,شہدادپور کاٹن مارکیٹ'
  );
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);

  // Reported listings & workers
  const [workerProfiles, setWorkerProfiles] = useState(() => DataStore.getWorkerProfiles());
  const reportedListings = equipmentListings.filter((e) => e.isReported);
  const reportedWorkers = workerProfiles.filter((w) => w.isReported);

  const selectedDistObj = DISTRICTS.find((d) => d.id === districtId) || DISTRICTS[0];

  // Save Daily Rate
  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const today = parseFloat(rateToday);
    const yest = parseFloat(rateYesterday) || today;
    if (isNaN(today) || today <= 0) return;

    const cropObj = CROPS.find((c) => c.id === cropId);

    const newRateEntry: RateEntry = {
      id: `rate-${cropId}-${districtId}-${Date.now()}`,
      cropId,
      provinceId: 'sindh',
      districtId,
      talukaId,
      rateToday: today,
      rateYesterday: yest,
      unitEn: cropObj?.unitEn || 'Per 40 kg (Maund)',
      unitUr: cropObj?.unitUr || 'فی 40 کلو (من)',
      unitSd: cropObj?.unitSd || 'في 40 ڪلو (مڻ)',
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceEn: sourceEn.trim() || 'Mandi Administration',
      sourceUr: sourceUr.trim() || 'منڈی مارکیٹ کمیٹی',
      sourceSd: sourceUr.trim() || 'منڊي مارڪيٽ ڪميٽي',
      history30Days: [yest - 50, yest - 20, yest, today],
      isSample: false,
    };

    DataStore.saveRate(newRateEntry);
    onRefreshRates();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setRateToday('');
    setRateYesterday('');
  };

  // CSV Import handler
  const handleImportCsv = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return;

      const newEntries: RateEntry[] = [];
      const dataLines = lines.slice(1);

      for (const line of dataLines) {
        const parts = line.split(',');
        if (parts.length >= 4) {
          const [crop, dist, tlk, todayStr, yestStr, src] = parts.map((p) => p.trim());
          const today = parseFloat(todayStr);
          const yest = parseFloat(yestStr) || today;

          if (!isNaN(today)) {
            newEntries.push({
              id: `rate-csv-${Date.now()}-${Math.random()}`,
              cropId: (crop as any) || 'wheat',
              provinceId: 'sindh',
              districtId: dist || 'hyderabad',
              talukaId: tlk || 'latifabad',
              rateToday: today,
              rateYesterday: yest,
              unitEn: 'Per 40 kg',
              unitUr: 'فی 40 کلو (من)',
              unitSd: 'في 40 ڪلو (مڻ)',
              lastUpdated: new Date().toISOString().split('T')[0],
              sourceEn: src || 'CSV Import',
              sourceUr: src || 'سی ایس وی درآمد',
              sourceSd: src || 'سي ايس وي درآمد',
              history30Days: [yest, today],
              isSample: false,
            });
          }
        }
      }

      DataStore.importRatesFromCsv(newEntries);
      onRefreshRates();
      setCsvSuccessMessage(`${newEntries.length} ریٹس کامیابی سے درآمد ہو گئے۔`);
      setTimeout(() => setCsvSuccessMessage(null), 3000);
    } catch (err) {
      alert('CSV فارمیٹ درست نہیں ہے');
    }
  };

  // CSV Export handler
  const handleExportCsv = () => {
    let csv = 'Crop,Province,District,Taluka,RateToday,RateYesterday,Unit,Date,Source\n';
    rates.forEach((r) => {
      csv += `${r.cropId},${r.provinceId},${r.districtId},${r.talukaId},${r.rateToday},${r.rateYesterday},"${r.unitUr}",${r.lastUpdated},"${r.sourceUr}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agrilink-rates-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Moderate listing
  const handleApproveListing = (id: string) => {
    DataStore.updateEquipmentListing(id, { isReported: false, reportReason: undefined });
    onRefreshEquipment();
  };

  const handleRemoveListing = (id: string) => {
    DataStore.deleteEquipmentListing(id);
    onRefreshEquipment();
  };

  const handleApproveWorker = (id: string) => {
    const updated = DataStore.saveWorkerProfile({ id, isReported: false, reportReason: undefined } as any);
    setWorkerProfiles(updated);
  };

  const handleRemoveWorker = (id: string) => {
    const updated = DataStore.removeWorkerProfile(id);
    setWorkerProfiles(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-2 text-stone-800">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <h2 className="font-bold text-base sm:text-lg">{t('admin.title')}</h2>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-stone-200/80 p-1.5 rounded-2xl text-xs sm:text-sm font-bold">
        <button
          onClick={() => setAdminTab('rates')}
          className={`py-2 rounded-xl transition ${
            adminTab === 'rates' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          نیا ریٹ
        </button>
        <button
          onClick={() => setAdminTab('csv')}
          className={`py-2 rounded-xl transition ${
            adminTab === 'csv' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          CSV امپورٹ
        </button>
        <button
          onClick={() => setAdminTab('moderation')}
          className={`py-2 rounded-xl transition relative ${
            adminTab === 'moderation' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          شکایات ({reportedListings.length})
        </button>
        <button
          onClick={() => setAdminTab('api')}
          className={`py-2 rounded-xl transition ${
            adminTab === 'api' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
          }`}
        >
          API ہک
        </button>
      </div>

      {/* TAB 1: ADD / UPDATE RATE */}
      {adminTab === 'rates' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
          <h3 className="font-bold text-base text-stone-900">{t('admin.addNewRate')}</h3>
          <p className="text-xs text-stone-500">
            مارکیٹ کمیٹی یا سرکاری نوٹیفکیشن کے مطابق روزانہ کے ریٹ درج کریں:
          </p>

          <form onSubmit={handleSaveRate} className="space-y-3.5">
            {saveSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t('admin.rateSaved')}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">فصل</label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'sd' ? c.nameSd : language === 'en' ? c.nameEn : c.nameUr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ضلع</label>
                <select
                  value={districtId}
                  onChange={(e) => {
                    setDistrictId(e.target.value);
                    const d = DISTRICTS.find((x) => x.id === e.target.value);
                    if (d && d.talukas.length > 0) setTalukaId(d.talukas[0].id);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تحصیل / تعلقہ</label>
                <select
                  value={talukaId}
                  onChange={(e) => setTalukaId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                >
                  {selectedDistObj.talukas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {language === 'sd' ? t.nameSd : language === 'en' ? t.nameEn : t.nameUr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  آج کا ریٹ (روپے)
                </label>
                <input
                  type="number"
                  required
                  value={rateToday}
                  onChange={(e) => setRateToday(e.target.value)}
                  placeholder="مثال: 4150"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  گزشتہ کل کا ریٹ
                </label>
                <input
                  type="number"
                  value={rateYesterday}
                  onChange={(e) => setRateYesterday(e.target.value)}
                  placeholder="مثال: 4100"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  مارکیٹ کا ذریعہ (منڈی)
                </label>
                <input
                  type="text"
                  value={sourceUr}
                  onChange={(e) => setSourceUr(e.target.value)}
                  placeholder="مثال: حیدرآباد غلہ منڈی"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              {t('admin.saveRate')}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CSV IMPORT & EXPORT */}
      {adminTab === 'csv' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900">{t('admin.csvUpload')}</h3>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('admin.csvExport')}</span>
            </button>
          </div>

          <p className="text-xs text-stone-500">
            آپ ایک ساتھ کئی اضلاع اور منڈیوں کے ریٹس CSV ٹیکسٹ کی صورت میں یہاں پیسٹ کر سکتے ہیں:
          </p>

          {csvSuccessMessage && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{csvSuccessMessage}</span>
            </div>
          )}

          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3 rounded-2xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={handleImportCsv}
            className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>درآمد کریں (Import CSV Rates)</span>
          </button>
        </div>
      )}

      {/* TAB 3: REPORTED LISTINGS & WORKERS MODERATION QUEUE */}
      {adminTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
          <h3 className="font-bold text-base text-stone-900">{t('admin.reportedTitle')}</h3>

          {reportedListings.length === 0 && reportedWorkers.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              کوئی رپورٹ شدہ اشتہار یا مزدور پروفائل زیر التواء نہیں ہے۔ سب ٹھیک ہے۔
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reported Equipment Listings */}
              {reportedListings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-700">رپورٹ شدہ زرعی مشینری / ٹریکٹر:</h4>
                  {reportedListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-red-50/50 border border-red-200 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900">{item.title}</span>
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          شکایت: {item.reportReason}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        مالک: {item.ownerName} | فون: {item.ownerPhone} | قیمت: {item.price} روپے
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleApproveListing(item.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                        >
                          {t('admin.approve')}
                        </button>
                        <button
                          onClick={() => handleRemoveListing(item.id)}
                          className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                        >
                          {t('admin.remove')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reported Workers */}
              {reportedWorkers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-700">رپورٹ شدہ مزدور پروفائلز:</h4>
                  {reportedWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-red-50/50 border border-red-200 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900">{worker.name}</span>
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          شکایت: {worker.reportReason}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        فون: {worker.phone} | ضلع: {worker.districtId} | اجرت: {worker.dailyWage} روپے
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleApproveWorker(worker.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                        >
                          {t('admin.approve')}
                        </button>
                        <button
                          onClick={() => handleRemoveWorker(worker.id)}
                          className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                        >
                          جعلی پروفائل ہٹائیں ({t('admin.remove')})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EXTERNAL SCRAPER / API HOOK ARCHITECTURE */}
      {adminTab === 'api' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-stone-900">
            <Globe className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base">لائیو منڈی API اور اسکریپر کنیکٹر</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            ایگری لنک کوڈ بیس میں سرکاری یا نجی ایگرو منڈی API کو مربوط کرنے کے لیے ماڈیولر ایڈاپٹر موجود ہے۔
            مستقبل میں پنجاب یا سندھ ایگریکلچر مارکیٹنگ ڈائریکٹوریٹ کے لائیو ڈیٹا فیڈ کو منسلک کرنے کے لیے درج ذیل ہک استعمال کیا جا سکتا ہے:
          </p>

          <pre className="p-3 rounded-2xl bg-stone-900 text-emerald-400 text-[11px] font-mono overflow-x-auto">
{`// src/services/mandiApiAdapter.ts
export async function syncLiveMandiRates() {
  const SINDH_MARKET_API_URL = process.env.LIVE_MANDI_API_URL;
  if (!SINDH_MARKET_API_URL) return null;
  const res = await fetch(SINDH_MARKET_API_URL);
  const data = await res.json();
  // Maps API schema to AgriLink RateEntry format
  return DataStore.importRatesFromCsv(data);
}`}
          </pre>

          <div className="p-3 bg-stone-50 rounded-2xl border text-xs text-stone-600">
            سیمپل ڈیٹا ری سیٹ کرنے کا بٹن:
            <button
              onClick={() => {
                if (confirm('کیا آپ تمام سیمپل ڈیٹا پر دوبارہ بحال کرنا چاہتے ہیں؟')) {
                  DataStore.resetToSampleData();
                  onRefreshRates();
                  onRefreshEquipment();
                  alert('سیمپل ڈیٹا بحال ہو گیا!');
                }
              }}
              className="mt-2 block px-4 py-2 bg-stone-200 hover:bg-stone-300 font-bold rounded-xl text-stone-800"
            >
              ری سیٹ ٹو سیمپل ڈیٹا (Reset to Sample)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
