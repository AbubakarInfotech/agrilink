import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Trash2,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Camera,
  X,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { CROPS, CropListing, RateEntry } from '../data/seedData';
import { DISTRICTS, District, Taluka } from '../data/regions';
import { DataStore, UserProfile } from '../services/store';
import { compressImage } from '../utils/imageCompress';
import { speakText, stopSpeaking } from '../utils/speech';

interface SellCropScreenProps {
  onBack: () => void;
  listings: CropListing[];
  onRefreshListings: () => void;
  rates: RateEntry[];
  user: UserProfile | null;
  onRequireLogin: () => void;
}

export const SellCropScreen: React.FC<SellCropScreenProps> = ({
  onBack,
  listings,
  onRefreshListings,
  rates,
  user,
  onRequireLogin,
}) => {
  const { language, dir, t } = useTranslation();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  // Audio Speech state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Saved bookmark listings
  const [savedIds, setSavedIds] = useState<string[]>(() => DataStore.getSavedListings());

  // Post Listing Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [cropType, setCropType] = useState<'wheat' | 'rice' | 'cotton' | 'sugarcane'>('wheat');
  const [quantityMaunds, setQuantityMaunds] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [qualityNote, setQualityNote] = useState('');
  const [districtId, setDistrictId] = useState<string>(user?.districtId || 'hyderabad');
  const [talukaId, setTalukaId] = useState<string>(user?.talukaId || 'latifabad');
  const [readyDate, setReadyDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellerName, setSellerName] = useState(user?.name || '');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '03001234567');
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Available talukas for post form
  const selectedDistrictObj = useMemo(() => {
    return DISTRICTS.find((d) => d.id === districtId) || DISTRICTS[0];
  }, [districtId]);

  // Toggle Save listing
  const handleToggleSave = (id: string) => {
    const updated = DataStore.toggleSaveListing(id);
    setSavedIds(updated);
  };

  // Image Upload with Auto Compression (< 300KB)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsCompressing(true);
    try {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      const compressedList: string[] = [];
      for (const f of files) {
        const compressed = await compressImage(f, 1200, 0.75);
        compressedList.push(compressed);
      }
      setImages((prev) => [...prev, ...compressedList].slice(0, 5));
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit Listing
  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantityMaunds);
    const price = parseFloat(expectedPrice);

    if (isNaN(qty) || qty <= 0) {
      setPostError(language === 'sd' ? 'مهرباني ڪري مقدار صحيح لکو' : 'براہ کرم صحیح مقدار درج کریں');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setPostError(language === 'sd' ? 'گهربل اگھ لکو' : 'مانگی گئی قیمت درج کریں');
      return;
    }
    if (!sellerPhone.trim()) {
      setPostError(language === 'sd' ? 'فون نمبر ضروري آهي' : 'فون نمبر لازمی ہے');
      return;
    }

    const newListing: CropListing = {
      id: `crop-${Date.now()}`,
      sellerId: user?.id || 'guest-seller',
      cropId: cropType,
      title: `${CROPS.find((c) => c.id === cropType)?.nameUr || cropType} (${qty} من)`,
      quantityMaunds: qty,
      expectedPricePerMaund: price,
      qualityNote: qualityNote.trim(),
      provinceId: 'sindh',
      districtId,
      talukaId,
      harvestDate: readyDate,
      sellerName: sellerName.trim() || 'زمیندار',
      sellerPhone: sellerPhone.trim(),
      images:
        images.length > 0
          ? images
          : [
              'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
            ],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      isSample: false,
    };

    DataStore.addCropListing(newListing);
    onRefreshListings();
    setShowPostModal(false);
    // Reset fields
    setQuantityMaunds('');
    setExpectedPrice('');
    setQualityNote('');
    setImages([]);
    setPostError(null);
  };

  // Mark as Sold
  const handleMarkSold = (id: string) => {
    DataStore.updateCropListing(id, { status: 'sold' });
    onRefreshListings();
  };

  // Delete listing
  const handleDelete = (id: string) => {
    if (confirm(language === 'sd' ? 'ڇا توهان هي اشتهار ختم ڪرڻ چاهيو ٿا؟' : 'کیا آپ یہ اشتہار حذف کرنا چاہتے ہیں؟')) {
      DataStore.deleteCropListing(id);
      onRefreshListings();
    }
  };

  // Compare asking price with market rate
  const getMarketComparison = (cropId: string, districtId: string, askingPrice: number) => {
    const mandiRate = rates.find((r) => r.cropId === cropId && r.districtId === districtId) ||
      rates.find((r) => r.cropId === cropId);

    if (!mandiRate) return null;

    const diff = askingPrice - mandiRate.rateToday;
    if (diff > 100) {
      return {
        label: t('sell.aboveMarket'),
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        diff,
      };
    } else if (diff < -100) {
      return {
        label: t('sell.belowMarket'),
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        diff,
      };
    } else {
      return {
        label: t('sell.nearMarket'),
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        diff,
      };
    }
  };

  // Listen to listing aloud
  const handleListenListing = (item: CropListing) => {
    if (playingId === item.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);
    const crop = CROPS.find((c) => c.id === item.cropId);
    const cropName =
      language === 'sd' ? crop?.nameSd : language === 'en' ? crop?.nameEn : crop?.nameUr;
    const dist = DISTRICTS.find((d) => d.id === item.districtId);
    const distName =
      language === 'sd' ? dist?.nameSd : language === 'en' ? dist?.nameEn : dist?.nameUr;

    let text = '';
    if (language === 'sd') {
      text = `${distName} ۾ ${item.sellerName} پاران ${item.quantityMaunds} مڻ ${cropName} وڪري لاءِ موجود آهي. گهربل اگھ ${item.expectedPricePerMaund} روپيا في مڻ. رابطو: ${item.sellerPhone}`;
    } else if (language === 'en') {
      text = `${item.quantityMaunds} maunds of ${cropName} available for sale in ${distName} by ${item.sellerName}. Asking price ${item.expectedPricePerMaund} rupees per 40 kg.`;
    } else {
      text = `${distName} میں ${item.sellerName} کے پاس ${item.quantityMaunds} من ${cropName} فروخت کے لیے دستیاب ہے۔ مانگی گئی قیمت ${item.expectedPricePerMaund} روپے فی من ہے۔ رابطہ نمبر: ${item.sellerPhone}`;
    }

    speakText(text, language, () => {
      setPlayingId(null);
    });
  };

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchCrop = filterCrop === 'all' || item.cropId === filterCrop;
      const matchDistrict = filterDistrict === 'all' || item.districtId === filterDistrict;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.qualityNote.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCrop && matchDistrict && matchSearch;
    });
  }, [listings, filterCrop, filterDistrict, searchQuery]);

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

        {/* Big Post Listing Button */}
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-5 h-5 text-yellow-300" />
          <span>{t('sell.postBtn')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-stone-200 space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('sell.searchPlaceholder')}
            className="w-full h-11 ps-10 pe-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute top-3.5 start-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-3 end-3 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters: Crop & District */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{t('sell.filterCrop')}</option>
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'sd' ? c.nameSd : language === 'en' ? c.nameEn : c.nameUr}
              </option>
            ))}
          </select>

          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{t('sell.filterDistrict')}</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'sd' ? d.nameSd : language === 'en' ? d.nameEn : d.nameUr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTINGS FEED */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-stone-500 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-stone-300" />
          <p className="text-sm font-medium">{t('sell.noListings')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredListings.map((item) => {
            const crop = CROPS.find((c) => c.id === item.cropId);
            const dist = DISTRICTS.find((d) => d.id === item.districtId);
            const taluka = dist?.talukas.find((t) => t.id === item.talukaId);
            const isSaved = savedIds.includes(item.id);
            const isOwner = user?.id === item.sellerId || item.sellerId === 'guest-seller';
            const comparison = getMarketComparison(
              item.cropId,
              item.districtId,
              item.expectedPricePerMaund
            );

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

                  {/* Sample Badge */}
                  {item.isSample && (
                    <span className="absolute top-2 start-2 bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                      {t('rates.sampleBadge')}
                    </span>
                  )}

                  {/* Sold badge */}
                  {item.status === 'sold' && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
                      <span className="bg-red-600 text-white font-extrabold text-sm px-4 py-1.5 rounded-full shadow-lg">
                        {t('sell.markSold')}
                      </span>
                    </div>
                  )}

                  {/* Top Right Save Bookmark & Speaker */}
                  <div className="absolute top-2 end-2 flex items-center gap-1.5">
                    {/* Speaker Listen */}
                    <button
                      onClick={() => handleListenListing(item)}
                      className={`p-2 rounded-full shadow-md backdrop-blur-xs transition ${
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

                    {/* Bookmark Save */}
                    <button
                      onClick={() => handleToggleSave(item.id)}
                      className="p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs transition"
                      title={t('sell.save')}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Crop Type */}
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-bold text-emerald-800">
                        {language === 'sd'
                          ? crop?.nameSd
                          : language === 'en'
                          ? crop?.nameEn
                          : crop?.nameUr}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {language === 'sd'
                            ? dist?.nameSd
                            : language === 'en'
                            ? dist?.nameEn
                            : dist?.nameUr}
                          {taluka ? ` (${language === 'sd' ? taluka.nameSd : taluka.nameUr})` : ''}
                        </span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-stone-900 mt-1 line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Quantity & Asking Price */}
                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-[11px] text-stone-400 block">{t('sell.quantity')}</span>
                        <span className="text-base font-extrabold text-stone-800">
                          {item.quantityMaunds}{' '}
                          <span className="text-xs font-normal text-stone-500">{t('sell.maunds')}</span>
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-[11px] text-stone-400 block">{t('sell.pricePerMaund')}</span>
                        <span className="text-xl font-extrabold text-emerald-900">
                          {item.expectedPricePerMaund}{' '}
                          <span className="text-xs font-normal text-stone-600">PKR</span>
                        </span>
                      </div>
                    </div>

                    {/* Market Comparison Badge */}
                    {comparison && (
                      <div className="mt-2">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${comparison.color}`}
                        >
                          {comparison.label}
                        </span>
                      </div>
                    )}

                    {/* Quality Note */}
                    {item.qualityNote && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 italic bg-stone-50 p-2 rounded-xl">
                        "{item.qualityNote}"
                      </p>
                    )}

                    {/* Seller details */}
                    <div className="text-xs text-stone-500 mt-2 flex items-center justify-between">
                      <span>{item.sellerName}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{item.harvestDate}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions: Green Call & WhatsApp Buttons */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Call Button */}
                      <a
                        href={`tel:${item.sellerPhone}`}
                        className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{t('sell.call')}</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/92${item.sellerPhone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
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

                    {/* Owner edit / delete controls */}
                    {isOwner && (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        {item.status !== 'sold' && (
                          <button
                            onClick={() => handleMarkSold(item.id)}
                            className="text-stone-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('sell.markSold')}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 ms-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t('sell.delete')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK POST LISTING MODAL (< 1 Minute flow) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-stone-900">{t('postModal.title')}</h3>
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

              {/* Crop type picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('postModal.cropType')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CROPS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCropType(c.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                        cropType === c.id
                          ? 'bg-emerald-700 text-white border-emerald-800'
                          : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {language === 'sd' ? c.nameSd : language === 'en' ? c.nameEn : c.nameUr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Expected Price */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('postModal.quantityMaunds')}
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityMaunds}
                    onChange={(e) => setQuantityMaunds(e.target.value)}
                    placeholder="مثال: 200"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('postModal.expectedPrice')}
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder="مثال: 4100"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* District & Taluka */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('postModal.selectDistrict')}
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
                    {t('postModal.selectTaluka')}
                  </label>
                  <select
                    value={talukaId}
                    onChange={(e) => setTalukaId(e.target.value)}
                    className="w-full h-11 px-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold"
                  >
                    {selectedDistrictObj.talukas.map((tk) => (
                      <option key={tk.id} value={tk.id}>
                        {language === 'sd' ? tk.nameSd : language === 'en' ? tk.nameEn : tk.nameUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ready date & Seller Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('postModal.readyDate')}
                  </label>
                  <input
                    type="date"
                    value={readyDate}
                    onChange={(e) => setReadyDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('sell.phone')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Quality Note */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('postModal.quality')}
                </label>
                <input
                  type="text"
                  value={qualityNote}
                  onChange={(e) => setQualityNote(e.target.value)}
                  placeholder="مثال: صاف دانہ، نمی کم، کھیت میں موجود"
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>

              {/* Photos upload (compressed automatically) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('postModal.photos')}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border">
                      <img src={img} alt="Crop" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 end-0 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50">
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
                {isCompressing && (
                  <span className="text-[11px] text-emerald-700 animate-pulse block mt-1">
                    تصویر کمپریس ہو رہی ہے...
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md transition active:scale-95"
                >
                  {t('postModal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
