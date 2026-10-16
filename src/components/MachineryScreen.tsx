import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Tractor,
  ShieldAlert,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Camera,
  X,
  MapPin,
  Calendar,
  UserCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { EquipmentListing } from '../data/seedData';
import { DISTRICTS, District, Taluka } from '../data/regions';
import { DataStore, UserProfile } from '../services/store';
import { compressImage } from '../utils/imageCompress';
import { speakText, stopSpeaking } from '../utils/speech';

interface MachineryScreenProps {
  onBack: () => void;
  listings: EquipmentListing[];
  onRefreshListings: () => void;
  user: UserProfile | null;
}

export const MachineryScreen: React.FC<MachineryScreenProps> = ({
  onBack,
  listings,
  onRefreshListings,
  user,
}) => {
  const { language, dir, t } = useTranslation();

  // Active Tab: all | rent | sale
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'sale'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Speech state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Post Machinery Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [itemType, setItemType] = useState<'tractor' | 'trolley' | 'laser_leveler' | 'harvester' | 'thresher' | 'other'>('tractor');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('rent');
  const [title, setTitle] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [year, setYear] = useState('2022');
  const [condition, setCondition] = useState<'new' | 'good' | 'repair_needed'>('good');
  const [horsepower, setHorsepower] = useState('85');
  const [price, setPrice] = useState('');
  const [rentUnit, setRentUnit] = useState<'per_hour' | 'per_day' | 'per_acre'>('per_hour');
  const [driverIncluded, setDriverIncluded] = useState(true);
  const [availableDates, setAvailableDates] = useState('فوری دستیاب');
  const [districtId, setDistrictId] = useState<string>(user?.districtId || 'hyderabad');
  const [talukaId, setTalukaId] = useState<string>(user?.talukaId || 'latifabad');
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '03001234567');
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Report Modal state
  const [reportModalItem, setReportModalItem] = useState<EquipmentListing | null>(null);
  const [reportReason, setReportReason] = useState('غلط معلومات یا جعلی فون نمبر');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Talukas for current district
  const selectedDistrictObj = useMemo(() => {
    return DISTRICTS.find((d) => d.id === districtId) || DISTRICTS[0];
  }, [districtId]);

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsCompressing(true);
    try {
      const files = Array.from(e.target.files).slice(0, 6 - images.length);
      const compressedList: string[] = [];
      for (const f of files) {
        const compressed = await compressImage(f, 1200, 0.75);
        compressedList.push(compressed);
      }
      setImages((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit Machinery Listing
  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) {
      setPostError(language === 'sd' ? 'قيمت يا ڪرايو لکو' : 'قیمت یا کرایہ درج کریں');
      return;
    }
    if (!ownerPhone.trim()) {
      setPostError(language === 'sd' ? 'فون نمبر ضروري آهي' : 'فون نمبر لازمی ہے');
      return;
    }

    const defaultImg =
      itemType === 'tractor'
        ? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'
        : itemType === 'trolley'
        ? 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80';

    const newListing: EquipmentListing = {
      id: `eq-${Date.now()}`,
      ownerId: user?.id || 'guest-owner',
      type: itemType,
      listingType,
      title:
        title.trim() ||
        `${makeModel || itemType} (${listingType === 'rent' ? 'برائے کرایہ' : 'برائے فروخت'})`,
      makeModel: makeModel.trim(),
      year: parseInt(year) || 2022,
      condition,
      horsepower: itemType === 'tractor' ? parseInt(horsepower) || 85 : undefined,
      price: p,
      rentUnit: listingType === 'rent' ? rentUnit : undefined,
      driverIncluded: listingType === 'rent' ? driverIncluded : undefined,
      availableDates: listingType === 'rent' ? availableDates : undefined,
      provinceId: 'sindh',
      districtId,
      talukaId,
      ownerName: ownerName.trim() || 'زمیندار',
      ownerPhone: ownerPhone.trim(),
      images: images.length > 0 ? images : [defaultImg],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      isSample: false,
    };

    DataStore.addEquipmentListing(newListing);
    onRefreshListings();
    setShowPostModal(false);
    // Reset
    setTitle('');
    setMakeModel('');
    setPrice('');
    setImages([]);
    setPostError(null);
  };

  // Submit Report
  const handleConfirmReport = () => {
    if (!reportModalItem) return;
    DataStore.reportEquipmentListing(reportModalItem.id, reportReason);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalItem(null);
      onRefreshListings();
    }, 1500);
  };

  // Mark Rented / Sold
  const handleMarkStatus = (id: string, newStatus: 'rented' | 'sold') => {
    DataStore.updateEquipmentListing(id, { status: newStatus });
    onRefreshListings();
  };

  // Delete listing
  const handleDelete = (id: string) => {
    if (confirm(language === 'sd' ? 'ڇا توهان ختم ڪرڻ چاهيو ٿا؟' : 'کیا آپ یہ اشتہار حذف کرنا چاہتے ہیں؟')) {
      DataStore.deleteEquipmentListing(id);
      onRefreshListings();
    }
  };

  // Listen aloud
  const handleListenMachinery = (item: EquipmentListing) => {
    if (playingId === item.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);
    const dist = DISTRICTS.find((d) => d.id === item.districtId);
    const distName =
      language === 'sd' ? dist?.nameSd : language === 'en' ? dist?.nameEn : dist?.nameUr;

    let text = '';
    if (language === 'sd') {
      text = `${distName} ۾ ${item.title}. اگھ ${item.price} روپيا ${
        item.listingType === 'rent' ? item.rentUnit : ''
      }. رابطو نمبر ${item.ownerPhone}.`;
    } else if (language === 'en') {
      text = `${item.title} available in ${distName}. Price ${item.price} rupees ${
        item.listingType === 'rent' ? item.rentUnit : ''
      }. Contact phone: ${item.ownerPhone}.`;
    } else {
      text = `${distName} میں ${item.title}۔ قیمت یا کرایہ ${item.price} روپے ${
        item.listingType === 'rent' ? item.rentUnit : ''
      }۔ رابطہ نمبر ${item.ownerPhone}۔`;
    }

    speakText(text, language, () => {
      setPlayingId(null);
    });
  };

  // Filtered
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchTab = activeTab === 'all' || item.listingType === activeTab;
      const matchType = filterType === 'all' || item.type === filterType;
      const matchDistrict = filterDistrict === 'all' || item.districtId === filterDistrict;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchType && matchDistrict && matchSearch;
    });
  }, [listings, activeTab, filterType, filterDistrict, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header & Post Button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition active:scale-95"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.back')}</span>
        </button>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-5 h-5 text-yellow-300" />
          <span>{t('machinery.postBtn')}</span>
        </button>
      </div>

      {/* Sale vs Rent Big Pill Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-stone-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'all'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t('machinery.tabAll')}
        </button>
        <button
          onClick={() => setActiveTab('rent')}
          className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'rent'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t('machinery.tabRent')}
        </button>
        <button
          onClick={() => setActiveTab('sale')}
          className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'sale'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t('machinery.tabSale')}
        </button>
      </div>

      {/* Search & Equipment Type Filter */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-stone-200 space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ٹریکٹر ماڈل یا ضلع تلاش کریں..."
            className="w-full h-11 ps-10 pe-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute top-3.5 start-3.5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">تمام قسم کی مشینری</option>
            <option value="tractor">ٹریکٹر (Tractor)</option>
            <option value="trolley">ٹرالی (Trolley)</option>
            <option value="laser_leveler">لیزر لیولر (Laser Leveler)</option>
            <option value="harvester">ہارویسٹر (Harvester)</option>
            <option value="thresher">تھریشر (Thresher)</option>
          </select>

          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">تمام اضلاع</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTINGS FEED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filteredListings.map((item) => {
          const dist = DISTRICTS.find((d) => d.id === item.districtId);
          const isOwner = user?.id === item.ownerId || item.ownerId === 'guest-owner';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200 flex flex-col justify-between transition-all"
            >
              {/* Image & Badges */}
              <div className="relative aspect-video bg-stone-100 overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {/* For Sale vs For Rent badge */}
                <span
                  className={`absolute top-2 start-2 font-bold text-xs px-3 py-1 rounded-full shadow-md text-white ${
                    item.listingType === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}
                >
                  {item.listingType === 'rent'
                    ? t('machinery.tabRent')
                    : t('machinery.tabSale')}
                </span>

                {/* Sample Badge */}
                {item.isSample && (
                  <span className="absolute bottom-2 start-2 bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                    {t('rates.sampleBadge')}
                  </span>
                )}

                {/* Speaker Audio Listen */}
                <button
                  onClick={() => handleListenMachinery(item)}
                  className={`absolute top-2 end-2 p-2 rounded-full shadow-md backdrop-blur-xs transition ${
                    playingId === item.id
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-stone-700 hover:bg-white'
                  }`}
                  title={t('common.listen')}
                >
                  {playingId === item.id ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Location & Model */}
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold text-blue-800 uppercase">
                      {item.type} {item.horsepower ? `(${item.horsepower} HP)` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {language === 'sd'
                          ? dist?.nameSd
                          : language === 'en'
                          ? dist?.nameEn
                          : dist?.nameUr}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-stone-900 mt-1 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Rent / Sale Price */}
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-[11px] text-stone-400 block">
                        {item.listingType === 'rent' ? 'کرایہ' : 'قیمت'}
                      </span>
                      <span className="text-xl font-extrabold text-blue-950">
                        {item.price.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-stone-600">PKR</span>
                      </span>
                    </div>

                    {item.rentUnit && (
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-lg">
                        {item.rentUnit === 'per_hour'
                          ? t('machinery.perHour')
                          : item.rentUnit === 'per_day'
                          ? t('machinery.perDay')
                          : t('machinery.perAcre')}
                      </span>
                    )}
                  </div>

                  {/* Driver inclusion for Rent */}
                  {item.listingType === 'rent' && (
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                          item.driverIncluded
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>
                          {item.driverIncluded
                            ? t('machinery.driverYes')
                            : t('machinery.driverNo')}
                        </span>
                      </span>
                      {item.availableDates && (
                        <span className="text-stone-500 line-clamp-1">
                          {item.availableDates}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Owner info */}
                  <div className="text-xs text-stone-500 mt-2">
                    <span>مالک: {item.ownerName}</span>
                  </div>
                </div>

                {/* Actions: Call, WhatsApp, Report */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${item.ownerPhone}`}
                      className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t('sell.call')}</span>
                    </a>

                    <a
                      href={`https://wa.me/92${item.ownerPhone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                        `السلام علیکم، میں ایگری لنک پر آپ کا ${item.title} دیکھ کر رابطہ کر رہا ہوں۔`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-sm transition active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('sell.whatsapp')}</span>
                    </a>
                  </div>

                  {/* Safety Report & Owner actions */}
                  <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
                    <button
                      onClick={() => setReportModalItem(item)}
                      className="hover:text-red-600 flex items-center gap-1 text-[11px]"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{t('machinery.report')}</span>
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('sell.delete')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POST EQUIPMENT MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-stone-900">{t('machinery.postBtn')}</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitListing} className="space-y-3.5">
              {postError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {postError}
                </div>
              )}

              {/* Listing Type: For Rent vs For Sale */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اشتہار کی قسم
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setListingType('rent')}
                    className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition ${
                      listingType === 'rent'
                        ? 'bg-blue-700 text-white border-blue-800'
                        : 'bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    {t('machinery.tabRent')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('sale')}
                    className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition ${
                      listingType === 'sale'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    {t('machinery.tabSale')}
                  </button>
                </div>
              </div>

              {/* Machinery Type */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    مشینری کی قسم
                  </label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                  >
                    <option value="tractor">ٹریکٹر (Tractor)</option>
                    <option value="trolley">ٹرالی (Trolley)</option>
                    <option value="laser_leveler">لیزر لیولر (Laser)</option>
                    <option value="harvester">ہارویسٹر (Harvester)</option>
                    <option value="thresher">تھریشر (Thresher)</option>
                    <option value="other">دیگر زرعی آلات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ماڈل و نام
                  </label>
                  <input
                    type="text"
                    required
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                    placeholder="مثال: Millat MF-385"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Price & Rent Unit */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {listingType === 'rent' ? 'کرایہ (روپے)' : 'فروخت قیمت (روپے)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 3200"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 font-bold text-sm"
                  />
                </div>

                {listingType === 'rent' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      کرایہ کا حساب
                    </label>
                    <select
                      value={rentUnit}
                      onChange={(e) => setRentUnit(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                    >
                      <option value="per_hour">{t('machinery.perHour')}</option>
                      <option value="per_day">{t('machinery.perDay')}</option>
                      <option value="per_acre">{t('machinery.perAcre')}</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ماڈل سال
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* For Rent: Driver included toggle */}
              {listingType === 'rent' && (
                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    id="driverCheck"
                    checked={driverIncluded}
                    onChange={(e) => setDriverIncluded(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="driverCheck" className="text-xs font-bold text-stone-800 cursor-pointer">
                    {t('machinery.driverYes')}
                  </label>
                </div>
              )}

              {/* District & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ضلع
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                      const d = DISTRICTS.find((x) => x.id === e.target.value);
                      if (d && d.talukas.length > 0) setTalukaId(d.talukas[0].id);
                    }}
                    className="w-full h-11 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('sell.phone')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  تصاویر شامل کریں
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border">
                      <img src={img} alt="Machinery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 end-0 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {images.length < 6 && (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50">
                      <Camera className="w-5 h-5 text-stone-400" />
                      <span className="text-[9px] text-stone-500 font-bold mt-1">+ تصویر</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="w-full h-12 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-base shadow-md transition active:scale-95"
                >
                  {t('postModal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold">{t('machinery.report')}</h3>
            </div>
            <p className="text-xs text-stone-600">
              کیا اس اشتہار میں کوئی فراڈ، غیر مناسب مواد یا غلط فون نمبر ہے؟
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">وجہ منتخب کریں</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                <option value="غلط معلومات یا جعلی فون نمبر">غلط معلومات یا جعلی فون نمبر</option>
                <option value="فراڈ یا مشکوک قیمت">فراڈ یا مشکوک قیمت</option>
                <option value="چوری کا شبہ">چوری کا شبہ</option>
                <option value="غیر مناسب زبان">غیر مناسب زبان</option>
              </select>
            </div>

            {reportSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('machinery.reported')}</span>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setReportModalItem(null)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm"
                >
                  {t('common.close')}
                </button>
                <button
                  onClick={handleConfirmReport}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700"
                >
                  رپورٹ بھیجیں
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
