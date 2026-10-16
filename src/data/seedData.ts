export interface CropInfo {
  id: 'wheat' | 'rice' | 'cotton' | 'sugarcane';
  nameEn: string;
  nameUr: string;
  nameSd: string;
  unitEn: string;
  unitUr: string;
  unitSd: string;
  color: string;
  iconName: string;
  govBenchPrice?: number; // Government announced support price if applicable
}

export const CROPS: CropInfo[] = [
  {
    id: 'wheat',
    nameEn: 'Wheat (Gandum)',
    nameUr: 'گندم (کنک)',
    nameSd: 'ڪڻڪ',
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    color: '#eab308',
    iconName: 'Wheat',
    govBenchPrice: 3900,
  },
  {
    id: 'cotton',
    nameEn: 'Cotton (Phutti / Kapas)',
    nameUr: 'کپاس (پھٹی)',
    nameSd: 'ڦٽيون / ڪپهه',
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    color: '#06b6d4',
    iconName: 'Cloud',
    govBenchPrice: 8500,
  },
  {
    id: 'rice',
    nameEn: 'Rice (Chawal / Shali)',
    nameUr: 'چاول / دھان',
    nameSd: 'چانور / ساريون',
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    color: '#10b981',
    iconName: 'Sprout',
    govBenchPrice: 4200,
  },
  {
    id: 'sugarcane',
    nameEn: 'Sugarcane (Gunna / Kamand)',
    nameUr: 'گنا (کماد)',
    nameSd: 'ڪمند',
    unitEn: 'Per 40 kg (Mill Gate)',
    unitUr: 'فی 40 کلو (مل گیٹ)',
    unitSd: 'في 40 ڪلو (مل گيٽ)',
    color: '#84cc16',
    iconName: 'Trees',
    govBenchPrice: 450,
  },
];

export interface RateEntry {
  id: string;
  cropId: 'wheat' | 'rice' | 'cotton' | 'sugarcane';
  provinceId: 'sindh' | 'punjab' | 'kpk' | 'balochistan';
  districtId: string;
  talukaId: string;
  rateToday: number;
  rateYesterday: number;
  unitEn: string;
  unitUr: string;
  unitSd: string;
  lastUpdated: string;
  sourceEn: string;
  sourceUr: string;
  sourceSd: string;
  history30Days: number[]; // 30 historical numbers for the chart
  isSample: boolean;
}

export interface CropListing {
  id: string;
  sellerId: string;
  cropId: 'wheat' | 'rice' | 'cotton' | 'sugarcane';
  title: string;
  quantityMaunds: number;
  expectedPricePerMaund: number;
  qualityNote: string;
  provinceId: 'sindh' | 'punjab' | 'kpk' | 'balochistan';
  districtId: string;
  talukaId: string;
  harvestDate: string;
  sellerName: string;
  sellerPhone: string;
  images: string[];
  createdAt: string;
  status: 'active' | 'sold';
  isSample: boolean;
}

export interface EquipmentListing {
  id: string;
  ownerId: string;
  type: 'tractor' | 'trolley' | 'laser_leveler' | 'harvester' | 'thresher' | 'other';
  listingType: 'sale' | 'rent';
  title: string;
  makeModel: string;
  year: number;
  condition: 'new' | 'good' | 'repair_needed';
  horsepower?: number;
  price: number;
  rentUnit?: 'per_hour' | 'per_day' | 'per_acre';
  driverIncluded?: boolean;
  availableDates?: string;
  provinceId: 'sindh' | 'punjab' | 'kpk' | 'balochistan';
  districtId: string;
  talukaId: string;
  ownerName: string;
  ownerPhone: string;
  images: string[];
  createdAt: string;
  status: 'active' | 'rented' | 'sold';
  isReported?: boolean;
  reportReason?: string;
  isSample: boolean;
}

export interface PracticeCard {
  id: string;
  cropId?: 'wheat' | 'rice' | 'cotton' | 'sugarcane';
  topic: 'water' | 'soil' | 'pest' | 'rotation' | 'harvest' | 'storage';
  titleUr: string;
  titleSd: string;
  titleEn: string;
  regionTagEn: string;
  regionTagUr: string;
  regionTagSd: string;
  linesUr: string[];
  linesSd: string[];
  linesEn: string[];
  expertTipUr: string;
  expertTipSd: string;
  expertTipEn: string;
  iconName: string;
  isSample: boolean;
}

export interface QnAItem {
  id: string;
  farmerName: string;
  location: string;
  question: string;
  answers: {
    id: string;
    responderName: string;
    role: string;
    text: string;
    isExtensionOfficer: boolean;
    helpfulVotes: number;
  }[];
  date: string;
}

// Helper to generate a realistic 30-day baseline curve ending at today's rate
function generateCurve(base: number, end: number): number[] {
  const arr: number[] = [];
  const step = (end - base) / 29;
  for (let i = 0; i < 30; i++) {
    const jitter = Math.round((Math.sin(i * 0.7) * (base * 0.02)));
    arr.push(Math.round(base + (step * i) + jitter));
  }
  arr[29] = end;
  return arr;
}

// 15+ Seed Mandi Rates across Sindh
export const SEED_RATES: RateEntry[] = [
  // 1. Wheat in Hyderabad (Latifabad / Grain Market)
  {
    id: 'rate-wheat-hyd',
    cropId: 'wheat',
    provinceId: 'sindh',
    districtId: 'hyderabad',
    talukaId: 'latifabad',
    rateToday: 4100,
    rateYesterday: 4050,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Hyderabad Main Grain Market (Ghalla Mandi)',
    sourceUr: 'حیدرآباد غلہ منڈی مارکیٹ',
    sourceSd: 'حيدرآباد اناج منڊي',
    history30Days: generateCurve(3950, 4100),
    isSample: true,
  },
  // 2. Wheat in Matiari (Hala)
  {
    id: 'rate-wheat-hala',
    cropId: 'wheat',
    provinceId: 'sindh',
    districtId: 'matiari',
    talukaId: 'hala',
    rateToday: 4080,
    rateYesterday: 4080,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Hala Tehsil Grain Dealers Association',
    sourceUr: 'ہالا تحصیل غلہ ڈیلرز',
    sourceSd: 'هالا تحصيل اناج ڊيلرس',
    history30Days: generateCurve(3980, 4080),
    isSample: true,
  },
  // 3. Wheat in Dadu
  {
    id: 'rate-wheat-dadu',
    cropId: 'wheat',
    provinceId: 'sindh',
    districtId: 'dadu',
    talukaId: 'dadu',
    rateToday: 4120,
    rateYesterday: 4160,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Dadu Station Mandi',
    sourceUr: 'دادو اسٹیشن منڈی',
    sourceSd: 'دادو اسٽيشن منڊي',
    history30Days: generateCurve(4000, 4120),
    isSample: true,
  },
  // 4. Cotton (Phutti) in Sanghar (Shahdadpur)
  {
    id: 'rate-cotton-sanghar',
    cropId: 'cotton',
    provinceId: 'sindh',
    districtId: 'sanghar',
    talukaId: 'shahdadpur',
    rateToday: 8900,
    rateYesterday: 8800,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Shahdadpur Cotton Ginners Mandi',
    sourceUr: 'شہدادپور کاٹن جننگ منڈی',
    sourceSd: 'شهدادپور ڪپهه جننگ منڊي',
    history30Days: generateCurve(8400, 8900),
    isSample: true,
  },
  // 5. Cotton in Shaheed Benazirabad (Nawabshah)
  {
    id: 'rate-cotton-nawabshah',
    cropId: 'cotton',
    provinceId: 'sindh',
    districtId: 'nawabshah',
    talukaId: 'sakrand',
    rateToday: 8850,
    rateYesterday: 8900,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Sakrand Ginning Press Committee',
    sourceUr: 'سکرنڈ جننگ پریس کمیٹی',
    sourceSd: 'سڪرنڊ جننگ پريس ڪميٽي',
    history30Days: generateCurve(8500, 8850),
    isSample: true,
  },
  // 6. Cotton in Mirpurkhas
  {
    id: 'rate-cotton-mirpurkhas',
    cropId: 'cotton',
    provinceId: 'sindh',
    districtId: 'mirpurkhas',
    talukaId: 'digri',
    rateToday: 8750,
    rateYesterday: 8700,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Digri Cotton Market',
    sourceUr: 'ڈگری کاٹن مارکیٹ',
    sourceSd: 'ڊگھڙي ڪپهه مارڪيٽ',
    history30Days: generateCurve(8300, 8750),
    isSample: true,
  },
  // 7. Rice (Shali/Paddy) in Larkana (Dokri)
  {
    id: 'rate-rice-larkana',
    cropId: 'rice',
    provinceId: 'sindh',
    districtId: 'larkana',
    talukaId: 'dokri',
    rateToday: 4350,
    rateYesterday: 4300,
    unitEn: 'Per 40 kg (IRRI-6 / Paddy)',
    unitUr: 'فی 40 کلو (اری-6 دھان)',
    unitSd: 'في 40 ڪلو (اِري-6 ساريون)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Larkana Rice Millers Association',
    sourceUr: 'لاڑکانہ رائس ملرز ایسوسی ایشن',
    sourceSd: 'لاڙڪاڻو چانور ملرز ايسوسيئيشن',
    history30Days: generateCurve(4100, 4350),
    isSample: true,
  },
  // 8. Rice in Badin (Golarchi)
  {
    id: 'rate-rice-badin',
    cropId: 'rice',
    provinceId: 'sindh',
    districtId: 'badin',
    talukaId: 'golarchi',
    rateToday: 4400,
    rateYesterday: 4420,
    unitEn: 'Per 40 kg (Super / Kernal Paddy)',
    unitUr: 'فی 40 کلو (کرنل دھان)',
    unitSd: 'في 40 ڪلو (ڪرنل ساريون)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Golarchi Rice Mandi',
    sourceUr: 'گولارچی رائس منڈی',
    sourceSd: 'گولاڙچي چانور منڊي',
    history30Days: generateCurve(4200, 4400),
    isSample: true,
  },
  // 9. Rice in Qambar-Shahdadkot
  {
    id: 'rate-rice-qambar',
    cropId: 'rice',
    provinceId: 'sindh',
    districtId: 'qambar_shahdadkot',
    talukaId: 'shahdadkot',
    rateToday: 4320,
    rateYesterday: 4300,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Shahdadkot Shali Yard',
    sourceUr: 'شہدادکوٹ دھان یارڈ',
    sourceSd: 'شهدادڪوٽ سارين جو يارڊ',
    history30Days: generateCurve(4150, 4320),
    isSample: true,
  },
  // 10. Sugarcane in Badin (Matli)
  {
    id: 'rate-sugar-badin',
    cropId: 'sugarcane',
    provinceId: 'sindh',
    districtId: 'badin',
    talukaId: 'matli',
    rateToday: 460,
    rateYesterday: 450,
    unitEn: 'Per 40 kg (Mill Gate)',
    unitUr: 'فی 40 کلو (مل گیٹ)',
    unitSd: 'في 40 ڪلو (مل گيٽ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Matli Sugar Mill Gate / Sindh Sugar Board',
    sourceUr: 'ماتلی شوگر مل گیٹ / سندھ شوگر بورڈ',
    sourceSd: 'ماتلي شگر مل گيٽ / سنڌ شگر بورڊ',
    history30Days: generateCurve(435, 460),
    isSample: true,
  },
  // 11. Sugarcane in Tando Allahyar
  {
    id: 'rate-sugar-tandoallahyar',
    cropId: 'sugarcane',
    provinceId: 'sindh',
    districtId: 'tando_allahyar',
    talukaId: 'tando_allahyar',
    rateToday: 465,
    rateYesterday: 460,
    unitEn: 'Per 40 kg (Mill Gate)',
    unitUr: 'فی 40 کلو (مل گیٹ)',
    unitSd: 'في 40 ڪلو (مل گيٽ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Al-Noor / Mehran Sugar Mills Center',
    sourceUr: 'النور شوگر ملز سنٹر',
    sourceSd: 'النور شگر ملز سينٽر',
    history30Days: generateCurve(440, 465),
    isSample: true,
  },
  // 12. Sugarcane in Khairpur
  {
    id: 'rate-sugar-khairpur',
    cropId: 'sugarcane',
    provinceId: 'sindh',
    districtId: 'khairpur',
    talukaId: 'gambat',
    rateToday: 455,
    rateYesterday: 455,
    unitEn: 'Per 40 kg (Mill Gate)',
    unitUr: 'فی 40 کلو (مل گیٹ)',
    unitSd: 'في 40 ڪلو (مل گيٽ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Ranipur Sugar Mill Weighbridge',
    sourceUr: 'رانی پور شوگر مل کانٹا',
    sourceSd: 'راڻي پور شگر مل ڪانٽو',
    history30Days: generateCurve(430, 455),
    isSample: true,
  },
  // 13. Wheat in Sukkur (Rohri)
  {
    id: 'rate-wheat-sukkur',
    cropId: 'wheat',
    provinceId: 'sindh',
    districtId: 'sukkur',
    talukaId: 'rohri',
    rateToday: 4150,
    rateYesterday: 4100,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Rohri Bunder Grain Terminal',
    sourceUr: 'روہڑی بندر غلہ ٹرمینل',
    sourceSd: 'روهڙي بندر اناج ٽرمينل',
    history30Days: generateCurve(3950, 4150),
    isSample: true,
  },
  // 14. Cotton in Ghotki (Mirpur Mathelo)
  {
    id: 'rate-cotton-ghotki',
    cropId: 'cotton',
    provinceId: 'sindh',
    districtId: 'ghotki',
    talukaId: 'mirpur_mathelo',
    rateToday: 8950,
    rateYesterday: 8900,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Mirpur Mathelo Agro Mandi',
    sourceUr: 'میرپور ماتھیلو ایگرو منڈی',
    sourceSd: 'ميرپور ماٿيلو زرعي منڊي',
    history30Days: generateCurve(8600, 8950),
    isSample: true,
  },
  // 15. Wheat in Jamshoro (Kotri)
  {
    id: 'rate-wheat-jamshoro',
    cropId: 'wheat',
    provinceId: 'sindh',
    districtId: 'jamshoro',
    talukaId: 'kotri',
    rateToday: 4090,
    rateYesterday: 4090,
    unitEn: 'Per 40 kg (Maund)',
    unitUr: 'فی 40 کلو (من)',
    unitSd: 'في 40 ڪلو (مڻ)',
    lastUpdated: '2026-10-09',
    sourceEn: 'Kotri Industrial Area Flour Mills',
    sourceUr: 'کوٹری فلور ملز یونین',
    sourceSd: 'ڪوٽڙي فلور ملز يونين',
    history30Days: generateCurve(3980, 4090),
    isSample: true,
  },
];

// 6 Seed Crop Listings
export const SEED_CROP_LISTINGS: CropListing[] = [
  {
    id: 'crop-1',
    sellerId: 'user-wadera-1',
    cropId: 'wheat',
    title: 'خالص تصدیق شدہ گندم (اکبر-19)',
    quantityMaunds: 350,
    expectedPricePerMaund: 4150,
    qualityNote: 'صاف ستھری، چھانی لگی ہوئی، نمی 11 فیصد سے کم۔',
    provinceId: 'sindh',
    districtId: 'hyderabad',
    talukaId: 'latifabad',
    harvestDate: '2026-10-15',
    sellerName: 'حاجی غلام رسول چانڈیو',
    sellerPhone: '03001234567',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-08',
    status: 'active',
    isSample: true,
  },
  {
    id: 'crop-2',
    sellerId: 'user-wadera-2',
    cropId: 'rice',
    title: 'سپر باسمتی چاول کچا دھان (ساریون)',
    quantityMaunds: 600,
    expectedPricePerMaund: 4400,
    qualityNote: 'خوشبودار لمبا دانہ، براہ راست کھیت سے، تازہ کٹائی۔',
    provinceId: 'sindh',
    districtId: 'badin',
    talukaId: 'golarchi',
    harvestDate: '2026-10-07',
    sellerName: 'وڈیرو عبدالستار ملاح',
    sellerPhone: '03019876543',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-07',
    status: 'active',
    isSample: true,
  },
  {
    id: 'crop-3',
    sellerId: 'user-wadera-3',
    cropId: 'cotton',
    title: 'پہلی چنائی کی کپاس (پھٹی - فرسٹ پکنگ)',
    quantityMaunds: 200,
    expectedPricePerMaund: 8900,
    qualityNote: 'سفید چمکدار ریشہ، کچرے اور پتے سے پاک، اعلیٰ جننگ گریڈ۔',
    provinceId: 'sindh',
    districtId: 'sanghar',
    talukaId: 'shahdadpur',
    harvestDate: '2026-10-09',
    sellerName: 'میر محمد علی رند',
    sellerPhone: '03025551234',
    images: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-09',
    status: 'active',
    isSample: true,
  },
  {
    id: 'crop-4',
    sellerId: 'user-wadera-4',
    cropId: 'sugarcane',
    title: 'موٹا رسیلا کماد (گنا - CPF-246)',
    quantityMaunds: 2500,
    expectedPricePerMaund: 460,
    qualityNote: 'میٹھا اور وزنی گنا، شوگر مل ترسیل کے لیے تیار۔',
    provinceId: 'sindh',
    districtId: 'matiari',
    talukaId: 'hala',
    harvestDate: '2026-10-20',
    sellerName: 'سید مظفر شاہ',
    sellerPhone: '03038889900',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-06',
    status: 'active',
    isSample: true,
  },
  {
    id: 'crop-5',
    sellerId: 'user-wadera-5',
    cropId: 'rice',
    title: 'IRRI-6 دھان (ساریون)',
    quantityMaunds: 900,
    expectedPricePerMaund: 4320,
    qualityNote: 'پکی ہوئی فصل، ملرز کے لیے بہترین ریٹ۔',
    provinceId: 'sindh',
    districtId: 'larkana',
    talukaId: 'dokri',
    harvestDate: '2026-10-08',
    sellerName: 'ارباب جان محمد',
    sellerPhone: '03047774433',
    images: [
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-08',
    status: 'active',
    isSample: true,
  },
  {
    id: 'crop-6',
    sellerId: 'user-wadera-6',
    cropId: 'wheat',
    title: 'گندم دیسی سرخ دانہ 120 من',
    quantityMaunds: 120,
    expectedPricePerMaund: 4200,
    qualityNote: 'گھریلو استعمال اور آٹے کے لیے بہترین دیسی گندم۔',
    provinceId: 'sindh',
    districtId: 'dadu',
    talukaId: 'mehar',
    harvestDate: '2026-10-05',
    sellerName: 'فقیر نور احمد بروہی',
    sellerPhone: '03051112233',
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-05',
    status: 'active',
    isSample: true,
  },
];

// 6 Seed Equipment / Tractor / Trolley Listings
export const SEED_EQUIPMENT_LISTINGS: EquipmentListing[] = [
  {
    id: 'eq-1',
    ownerId: 'user-eq-1',
    type: 'tractor',
    listingType: 'rent',
    title: 'Millat Massey Ferguson 385 (85 HP) مع ڈرائیور برائے کرایہ',
    makeModel: 'Millat MF-385 4WD',
    year: 2023,
    condition: 'good',
    horsepower: 85,
    price: 3200,
    rentUnit: 'per_hour',
    driverIncluded: true,
    availableDates: 'فوری دستیاب (آج سے شروع)',
    provinceId: 'sindh',
    districtId: 'hyderabad',
    talukaId: 'hyderabad_rural',
    ownerName: 'جام نواز علی چانڈیو',
    ownerPhone: '03009988776',
    images: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-08',
    status: 'active',
    isSample: true,
  },
  {
    id: 'eq-2',
    ownerId: 'user-eq-2',
    type: 'trolley',
    listingType: 'sale',
    title: '16 وہیلر ہائیڈرولک ٹرالی برائے فروخت (لوکل ساخت حیدرآباد)',
    makeModel: 'حیدرآباد میڈ ہیوی ڈیوٹی ٹرالی',
    year: 2022,
    condition: 'good',
    price: 780000,
    provinceId: 'sindh',
    districtId: 'tando_allahyar',
    talukaId: 'tando_allahyar',
    ownerName: 'استاد بشیر لوہار و زمیندار',
    ownerPhone: '03013344556',
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-07',
    status: 'active',
    isSample: true,
  },
  {
    id: 'eq-3',
    ownerId: 'user-eq-3',
    type: 'laser_leveler',
    listingType: 'rent',
    title: 'لیزر لینڈ لیولر (زمین ہموار کرنے والا سسٹم) فی ایکڑ کرایہ',
    makeModel: 'Spectra Precision Laser + Scraper',
    year: 2024,
    condition: 'new',
    price: 3500,
    rentUnit: 'per_acre',
    driverIncluded: true,
    availableDates: 'پوری تحصیل میں سروس دستیاب',
    provinceId: 'sindh',
    districtId: 'matiari',
    talukaId: 'hala',
    ownerName: 'رئیس گلزار علی میمن',
    ownerPhone: '03024455667',
    images: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-09',
    status: 'active',
    isSample: true,
  },
  {
    id: 'eq-4',
    ownerId: 'user-eq-4',
    type: 'tractor',
    listingType: 'sale',
    title: 'New Holland Fiat 480 (55 HP) سمارٹ کنڈیشن برائے فروخت',
    makeModel: 'Fiat NH 480 Special',
    year: 2018,
    condition: 'good',
    horsepower: 55,
    price: 1850000,
    provinceId: 'sindh',
    districtId: 'dadu',
    talukaId: 'dadu',
    ownerName: 'سکندر علی سولنگی',
    ownerPhone: '03036677889',
    images: [
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-05',
    status: 'active',
    isSample: true,
  },
  {
    id: 'eq-5',
    ownerId: 'user-eq-5',
    type: 'harvester',
    listingType: 'rent',
    title: 'کمبائن ہارویسٹر (دھان اور گندم کی کٹائی) فی ایکڑ',
    makeModel: 'Kubota DC-70 Plus',
    year: 2023,
    condition: 'new',
    price: 7500,
    rentUnit: 'per_acre',
    driverIncluded: true,
    availableDates: 'کٹائی سیزن کے لیے ایڈوانس بکنگ جاری',
    provinceId: 'sindh',
    districtId: 'badin',
    talukaId: 'matli',
    ownerName: 'خان صاحب ممتاز سومرو',
    ownerPhone: '03049900112',
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-08',
    status: 'active',
    isSample: true,
  },
  {
    id: 'eq-6',
    ownerId: 'user-eq-6',
    type: 'thresher',
    listingType: 'rent',
    title: 'ہائی اسپیڈ گندم تھریشر (ٹوکہ سسٹم)',
    makeModel: 'غازی تھریشر پنجاب ماڈل',
    year: 2021,
    condition: 'good',
    price: 2200,
    rentUnit: 'per_hour',
    driverIncluded: false,
    availableDates: 'فارم پر موجود، ٹریکٹر ساتھ لائیں',
    provinceId: 'sindh',
    districtId: 'sanghar',
    talukaId: 'tando_adam',
    ownerName: 'محمد قاسم خاصخیلی',
    ownerPhone: '03058882211',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-06',
    status: 'active',
    isSample: true,
  },
];

// 10 Sustainable Farming Practice Cards
export const SEED_PRACTICES: PracticeCard[] = [
  {
    id: 'practice-1',
    topic: 'water',
    cropId: 'wheat',
    iconName: 'Droplets',
    titleUr: 'لیزر لیولنگ سے پانی کی 30٪ بچت',
    titleSd: 'ليزر ليولنگ سان پاڻي جي 30 سيڪڙو بچت',
    titleEn: 'Laser Land Leveling for 30% Water Savings',
    regionTagEn: 'Sindh Canal Command & Tubewell Areas',
    regionTagUr: 'سندھ کینال کمانڈ اور ٹیوب ویل علاقے',
    regionTagSd: 'سنڌ ڪئنال ڪمانڊ ۽ ٽيوب ويل علائقا',
    linesUr: [
      'لیزر سے زمین ہموار کرنے سے کھیت میں پانی تیزی اور برابری سے پھیلتا ہے۔',
      'کھاد ضائع نہیں ہوتی اور ہر پودے کو یکساں خوراک ملتی ہے۔',
      'ڈیزل اور ٹیوب ویل کے بل میں 25 سے 35 فیصد تک کمی واقع ہوتی ہے۔',
    ],
    linesSd: [
      'ليزر سان زمين سنئين ڪرڻ سان پاڻي هڪجهڙو سڄي ٻنيءَ ۾ ڦهلجي ٿو.',
      'ڀاڻ زيان نٿو ٿئي ۽ هر ٻوٽي کي پوري خوراڪ ملي ٿي.',
      'ڊيزل ۽ ٽيوب ويل جي خرچ ۾ 25 کان 35 سيڪڙو گهٽتائي ٿئي ٿي.',
    ],
    linesEn: [
      'Precision laser leveling ensures uniform water spread across the entire acre.',
      'Nutrients are absorbed evenly without ponding or dry patches.',
      'Saves 25-35% in irrigation water and tubewell fuel costs.',
    ],
    expertTipUr: 'مشورہ: ہر 3 سال بعد فصل کی بوائی سے قبل ایک بار لیزر لیولر ضرور لگوائیں۔',
    expertTipSd: 'صلاح: هر 3 سال بعد فصل پوکڻ کان اڳ ليزر ليولر ضرور هلايو.',
    expertTipEn: 'Tip: Re-level fields with laser scraper once every 3 years before kharif or rabi seeding.',
    isSample: true,
  },
  {
    id: 'practice-2',
    topic: 'pest',
    cropId: 'cotton',
    iconName: 'ShieldAlert',
    titleUr: 'کپاس میں گلابی سنڈی کا بغیر زہر تدارک',
    titleSd: 'ڪپهه ۾ گلابي سنڊي جو بنا زهر حل',
    titleEn: 'Pink Bollworm Management in Cotton with PB Ropes',
    regionTagEn: 'Lower & Central Sindh Cotton Belt',
    regionTagUr: 'لوئر اور سنٹرل سندھ کاٹن بیلٹ',
    regionTagSd: 'لوئر ۽ مرڪزي سنڌ ڪپهه بيلٽ',
    linesUr: [
      'مہنگے اسپرے کے بجائے جنسی پھندے (Pheromone Traps) اور PB رسیاں استعمال کریں۔',
      'نیم کا خالص تیل (Neem Oil) کا اسپرے ابتدائی حملے کو روکتا ہے۔',
      'دوست کیڑے (لیڈی برڈ اور کرائسوپا) محفوظ رہتے ہیں جو نقصان دہ کیڑوں کو کھاتے ہیں۔',
    ],
    linesSd: [
      'مهانگن اسپرين جي بدران جنسي ڦندا ۽ پي بي رسا ٻني ۾ ٻڌو.',
      'نِم جو تيل شروعاتي حملي کي محفوظ طريقي سان روڪي ٿو.',
      'دوست جيت محفوظ رهن ٿا جيڪي نقصانڪار ڪيڙن کي کائي ختم ڪن ٿا.',
    ],
    linesEn: [
      'Use pheromone lure traps and PB ropes instead of repeated harsh chemical sprays.',
      'Spray pure neem extract at early vegetative stage to deter moth egg-laying.',
      'Preserves beneficial predator insects like Chrysoperla and ladybird beetles.',
    ],
    expertTipUr: 'ضروری: کیمیائی اسپرے کرنے سے پہلے محکمہ زراعت کے توسیعی افسر سے مشورہ کریں۔',
    expertTipSd: 'ضروري: ڪيميائي اسپرائي ڪرڻ کان اڳ زراعت کاتي جي آفيسر سان رابطو ڪريو.',
    expertTipEn: 'Vital: Check with your local Agriculture Extension Officer before mixing any chemical pesticides.',
    isSample: true,
  },
  {
    id: 'practice-3',
    topic: 'water',
    cropId: 'rice',
    iconName: 'Waves',
    titleUr: 'دھان میں وقفے وقفے سے پانی دینا (AWD طریقہ)',
    titleSd: 'سارين ۾ وقفي وقفي سان پاڻي ڏيڻ (AWD طريقو)',
    titleEn: 'Alternate Wetting & Drying (AWD) in Rice',
    regionTagEn: 'Larkana, Qambar & Badin Rice Zones',
    regionTagUr: 'لاڑکانہ، قمبر اور بدین رائس زون',
    regionTagSd: 'لاڙڪاڻو، قنبر ۽ بدين چانورن وارا علائقا',
    linesUr: [
      'کھڑے پانی کو لگاتار رکھنے کے بجائے جب کھیت سوکھنے لگے تب دوبارہ پانی دیں۔',
      'جڑوں کو آکسیجن ملتی ہے جس سے پودے کا قد مضبوط ہوتا ہے اور گرتا نہیں۔',
      'میتھین گیس کا اخراج کم ہوتا ہے اور پانی کی 30 فیصد بچت ہوتی ہے۔',
    ],
    linesSd: [
      'مسلسل پاڻي بيهارڻ بجاءِ جڏهن وٽ اچي تڏهن ٻيهر پاڻي ڏيو.',
      'پاڙن کي هوا ملي ٿي جنهن سان ٻوٽو سگهارو ٿئي ٿو ۽ ڪرندو ناهي.',
      'پاڻي جي 30 سيڪڙو بچت ٿئي ٿي ۽ مٿان بيمارين جو خطرو گهٽجي ٿو.',
    ],
    linesEn: [
      'Allow field water to naturally recede a few inches below surface before re-flooding.',
      'Improves root oxygenation and plant tillering without reducing paddy yield.',
      'Cuts water usage by 30% and reduces root rot risks.',
    ],
    expertTipUr: 'مشورہ: کھیت میں 1 فٹ کا پی وی سی پائپ لگا کر پانی کی سطح کا اندازہ لگائیں۔',
    expertTipSd: 'صلاح: ٻنيءَ ۾ 1 فٽ پي وي سي پائپ رکي پاڻي جي ليول چيڪ ڪريو.',
    expertTipEn: 'Tip: Use a perforated PVC field tube to monitor sub-surface water depth.',
    isSample: true,
  },
  {
    id: 'practice-4',
    topic: 'soil',
    iconName: 'Layers',
    titleUr: 'جنتر (سبز کھاد) سے کلراٹھی زمین کا علاج',
    titleSd: 'جنتر (ساوا ڀاڻ) سان ڪلراٺي زمين جو سڌارو',
    titleEn: 'Green Manuring with Jantar (Sesbania) for Saline Soils',
    regionTagEn: 'All Sindh Saline & Sodic Belts',
    regionTagUr: 'سندھ کی تمام کلراٹھی زمینیں',
    regionTagSd: 'سنڌ جون سموريون ڪلر واريون زمينون',
    linesUr: [
      'مئی جون میں جنتر (دھینچہ) کاشت کریں اور 45 دن بعد ہل چلا کر زمین میں دبا دیں۔',
      'زمین میں نامیاتی مادہ (Organic Matter) اور نائٹروجن شامل ہوتا ہے۔',
      'کلر اور سیم کی شدت کم ہوتی ہے اور زمین نرم اور زرخیز ہو جاتی ہے۔',
    ],
    linesSd: [
      'مئي يا جون ۾ جنتر پوکي 45 ڏينهن کان پوءِ هر هلائي زمين ۾ دٻايو.',
      'زمين ۾ نامياتي مادو ۽ قدرتي نائٽروجن گڏ ٿئي ٿو.',
      'ڪلر جو زور ٽٽي پوي ٿو ۽ زمين نرم، ڀلي ۽ زرخيز ٿئي ٿي.',
    ],
    linesEn: [
      'Sow Sesbania (Jantar) in early summer and rotavate into soil at 45 days.',
      'Fixes atmospheric nitrogen and pumps fresh organic matter into the soil profile.',
      'Reclaims saline patches and loosens compacted clay layers.',
    ],
    expertTipUr: 'مشورہ: جنتر دبانے کے بعد 2 بار پانی دیں تاکہ وہ جلدی گل سڑ کر کھاد بن جائے۔',
    expertTipSd: 'صلاح: جنتر دٻائڻ کان پوءِ ٻه ڀيرا پاڻي ڏيو ته جيئن جلدي ڀاڻ بڻجي وڃي.',
    expertTipEn: 'Tip: Irrigate twice after plowing under to accelerate microbial decomposition.',
    isSample: true,
  },
  {
    id: 'practice-5',
    topic: 'storage',
    cropId: 'wheat',
    iconName: 'Box',
    titleUr: 'گندم کو گھن (کیڑے) سے محفوظ رکھنے کا دیسی طریقہ',
    titleSd: 'ڪڻڪ کي سُسري (گھڻ) کان بچائڻ جو طريقو',
    titleEn: 'Safe Post-Harvest Wheat Storage against Weevils (Ghun)',
    regionTagEn: 'Dry Storage in Sindh Farmsteads',
    regionTagUr: 'سندھ کے دیہی گودام اور گھر',
    regionTagSd: 'سنڌ جا ڳوٺاڻا ڪوٺيون ۽ گدام',
    linesUr: [
      'گندم ذخیرہ کرنے سے پہلے نمی 10٪ سے کم ہونی چاہیے (دانہ دانت سے کڑک ٹوٹے)۔',
      'بوریوں میں نیم کے خشک پتے یا ماچس کی ڈبیاں اور ریتلی مٹی ملائیں۔',
      'بوریوں کو فرش سے 6 انچ اونچے لکڑی کے تختوں پر رکھیں تاکہ نیچے سے نمی نہ آئے۔',
    ],
    linesSd: [
      'ڪڻڪ رکڻ کان اڳ چڱي طرح سڪل هجي (ڏندن سان ڀڃڻ تي ٽڙڪ آواز اچي).',
      'ٻورين ۾ نِم جا سڪل پن وجهو يا هرميٽڪ هوا بند ٻوريون واپرائو.',
      'ٻوريون سڌيون زمين تي نه رکو پر ڪاٺ جي تختن تي 6 انچ مٿي رکو.',
    ],
    linesEn: [
      'Ensure grain moisture is below 10% before bagging (grain snaps crisply when bitten).',
      'Mix dried neem leaves or store in hermetic airtight poly-lined bags.',
      'Stack grain bags on wooden pallets at least 6 inches off floor to block soil moisture.',
    ],
    expertTipUr: 'کبھی بھی گندم میں خطرناک زہریلی گولیاں کھلے عام نہ رکھیں، یہ جان لیوا ہو سکتی ہیں۔',
    expertTipSd: 'خبردار: ڪڻڪ ۾ کليل زهر واريون گوريون هرگز نه رکو، هي زندگيءَ لاءِ هاڃيڪار آهن.',
    expertTipEn: 'Warning: Never keep toxic phosphine tablets loose near domestic living quarters.',
    isSample: true,
  },
  {
    id: 'practice-6',
    topic: 'pest',
    iconName: 'AlertTriangle',
    titleUr: 'زرعی ادویات اسپرے کرتے وقت حفاظتی تدابیر',
    titleSd: 'زرعي دوائون اسپرائي ڪندي حفاظت جا اپاءَ',
    titleEn: 'Safe Pesticide Spraying & Personal Protective Equipment',
    regionTagEn: 'All Crop Spraying Zones',
    regionTagUr: 'تمام زرعی علاقے',
    regionTagSd: 'سمورا زرعي پوک جا علائقا',
    linesUr: [
      'اسپرے کے دوران منہ پر کپڑا یا ماسک باندھیں اور ہوا کے رخ کے مخالف کبھی نہ چلیں۔',
      'اسپرے کے فورا بعد صابن سے اچھی طرح نہائیں اور کپڑے الگ دھوئیں۔',
      'خالی زہریلے ڈبے اور بوتلیں زمین میں گہرا دبا دیں، انہیں گھر میں استعمال نہ کریں۔',
    ],
    linesSd: [
      'اسپرائي مهل منهن تي ماسڪ يا اجرڪ ٻڌو ۽ هوا جي ابتي رخ ۾ نه هلو.',
      'اسپرائي کان پوءِ صابڻ سان ڌوئي وٺو ۽ ڪپڙا الڳ ڌوئو.',
      'زهر جا خالي دٻا ۽ بوتلون ٻنيءَ ۾ اونها پوري ڇڏيو، گهر ۾ نه رکو.',
    ],
    linesEn: [
      'Always wear a mask, gloves, and boots; never spray against prevailing wind direction.',
      'Wash thoroughly with soap immediately after spraying; wash spray clothes separately.',
      'Puncture and bury empty chemical containers; never repurpose them for domestic water.',
    ],
    expertTipUr: 'اگر چکر یا الٹی آئے تو فوری طور پر قریبی بنیادی مرکز صحت (BHU) پہنچیں۔',
    expertTipSd: 'جيڪڏهن چڪر يا الٽي اچي ته يڪدم ويجهي صحت مرڪز وڃو.',
    expertTipEn: 'In case of dizziness or nausea, seek immediate medical care at the nearest BHU.',
    isSample: true,
  },
  {
    id: 'practice-7',
    topic: 'water',
    iconName: 'Sun',
    titleUr: 'سولر ٹیوب ویل اور پانی کا صحیح استعمال',
    titleSd: 'سولر ٽيوب ويل ۽ پاڻي جو سچو استعمال',
    titleEn: 'Solar Tubewell Water Budgeting & Salt Management',
    regionTagEn: 'Tubewell Irrigated Lands',
    regionTagUr: 'ٹیوب ویل سے سیراب ہونے والی زمینیں',
    regionTagSd: 'ٽيوب ويل ذريعي آباد زمينون',
    linesUr: [
      'مفت بجلی کی وجہ سے ضرورت سے زیادہ پانی لگانے سے زمین کلراٹھی ہو سکتی ہے۔',
      'ٹیوب ویل کے پانی کا لیبارٹری سے نمکیات (TDS) کا ٹیسٹ کروائیں۔',
      'کھالوں کو پکا کریں یا نالیوں میں پلاسٹک پائپ استعمال کریں تاکہ پانی رس نہ سکے۔',
    ],
    linesSd: [
      'مفت سج واري بجليءَ ڪري وڌيڪ پاڻي ڏيڻ سان ٻنيءَ ۾ لوڻ چڙهي سگهي ٿو.',
      'ٽيوب ويل جي پاڻيءَ جو ٽيسٽ ڪرائي معلوم ڪريو ته ڪلري ته ناهي.',
      'ٻنن جي بدران پائپ يا پڪا کالا واپرائو ته جيئن پاڻي زيان نه ٿئي.',
    ],
    linesEn: [
      'Avoid over-irrigation from solar pumps as high water tables draw toxic salts upward.',
      'Get tubewell water tested for Electrical Conductivity (EC) and Sodium Adsorption.',
      'Use piped delivery or lined watercourses to eliminate seepage loss.',
    ],
    expertTipUr: 'مشورہ: ہر 3 نہری پانیوں کے بعد ایک ٹیوب ویل پانی لگائیں۔',
    expertTipSd: 'صلاح: ٽن واهن جي پاڻين کان پوءِ هڪ ٽيوب ويل پاڻي ڏيو.',
    expertTipEn: 'Tip: Conjunctively blend sweet canal water with brackish groundwater.',
    isSample: true,
  },
  {
    id: 'practice-8',
    topic: 'rotation',
    iconName: 'RefreshCw',
    titleUr: 'فصلوں کی ادل بدل (چاول کے بعد دالیں یا سرسوں)',
    titleSd: 'فصلن جي ڦير ڦار (چانورن بعد داليون يا سَرهن)',
    titleEn: 'Crop Rotation: Pulses or Canola following Rice',
    regionTagEn: 'Rice-Wheat System',
    regionTagUr: 'رائس کینال بیلٹ',
    regionTagSd: 'چانورن وارو بيلٽ',
    linesUr: [
      'ایک ہی زمین پر بار بار ایک جیسی فصل لگانے سے مٹی کی طاقت ختم ہو جاتی ہے۔',
      'چاول کی کٹائی کے بعد ماش، مونگ یا رایا سرسوں کاشت کرنے سے مٹی تروتازہ ہوتی ہے۔',
      'بیماریوں اور نقصان دہ جڑی بوٹیوں کا خاتمہ قدرتی طور پر ہوتا ہے۔',
    ],
    linesSd: [
      'هڪ ئي ٻنيءَ ۾ ساڳيو فصل ٻيهر ٻيهر پوکڻ سان زمين ڪمزور ٿي وڃي ٿي.',
      'سارين کان پوءِ ماھ، مڱ يا سرهن پوکڻ سان زمين سگھاري ٿئي ٿي.',
      'بيمارين ۽ ٻوڙن (جڙي ٻوٽين) جو قدرتي خاتمو ٿئي ٿو.',
    ],
    linesEn: [
      'Monoculture depletes trace soil minerals and invites recurring soil pests.',
      'Planting short-duration pulses or mustard after rice enriches residual soil fertility.',
      'Breaks weed reproduction cycles naturally without herbicides.',
    ],
    expertTipUr: 'فائدہ: دالیں خود بخود ہوا سے نائٹروجن جذب کر کے زمین کو دیتی ہیں۔',
    expertTipSd: 'فائدو: داليون هوا مان قدرتي نائٽروجن کڻي ٻنيءَ کي مضبوط ڪن ٿيون.',
    expertTipEn: 'Benefit: Legumes fix atmospheric nitrogen, slashing subsequent urea fertilizer demand.',
    isSample: true,
  },
  {
    id: 'practice-9',
    topic: 'soil',
    iconName: 'Sprout',
    titleUr: 'گوبر اور فصلوں کے باقیات سے قدرتی کمپوسٹ کھاد',
    titleSd: 'ڇيڻي ۽ سڪل ڪک پن مان قدرتي ڪمپوسٽ ڀاڻ',
    titleEn: 'Farmyard Manure & Crop Residue Composting',
    regionTagEn: 'Rural Sindh Livestock & Mixed Farms',
    regionTagUr: 'سندھ کے دیہات اور مال مویشی فارم',
    regionTagSd: 'سنڌ جا ڳوٺ ۽ مالوند زراعت',
    linesUr: [
      'کھیت میں مڈھوں اور پرالی کو آگ نہ لگائیں، آگ سے زمین کے فائدے مند جراثیم مر جاتے ہیں۔',
      'گوبر، راکھ اور گھاس کو ایک گڑھے میں 60 دن کے لیے دبا کر کالی کمپوسٹ کھاد بنائیں۔',
      'یہ کھاد ڈی اے پی اور یوریا کا خرچ 40 فیصد تک کم کر دیتی ہے۔',
    ],
    linesSd: [
      'ٻنيءَ ۾ لٽ ۽ پراليءَ کي باهه نه ڏيو، باهه سان زمين جا جراثيم سڙي مرن ٿا.',
      'ڇيڻو، رک ۽ سڪل ڪک کڏ ۾ رکي 60 ڏينهن بعد ڪارو سون ڀاڻ تيار ڪريو.',
      'هن سان ڊي اي پي ۽ يوريا جو خرچ 40 سيڪڙو تائين بچي سگهي ٿو.',
    ],
    linesEn: [
      'Never burn crop stubble; burning incinerates beneficial earthworms and soil bacteria.',
      'Collect manure, ash, and foliage in an aerobic pit for 60 days to produce humus.',
      'Reduces chemical fertilizer costs while restoring moisture retention.',
    ],
    expertTipUr: 'کھیت میں مٹی نرم ہوگی اور ہل چلانا آسان ہو جائے گا۔',
    expertTipSd: 'زمين نرم ٿيندي ۽ هر هلائڻ ۾ ٽريڪٽر جو تيل گهٽ لڳندو.',
    expertTipEn: 'Improves soil tilth, reducing tractor plowing drag and fuel burn.',
    isSample: true,
  },
  {
    id: 'practice-10',
    topic: 'water',
    iconName: 'Droplet',
    titleUr: 'تھر اور بارانی علاقوں میں ڈرپ ایریگیشن (قطرہ قطرہ پانی)',
    titleSd: 'ٿر ۽ برساتي علائقن ۾ ڊرپ ايريگيشن (قطرو قطرو پاڻي)',
    titleEn: 'Drip Irrigation in Tharparkar & Arid Sandy Soils',
    regionTagEn: 'Tharparkar, Umerkot & Kohistan',
    regionTagUr: 'تھرپارکر، عمرکوٹ اور کوہستان',
    regionTagSd: 'ٿرپارڪر، عمرڪوٽ ۽ ڪوهستان',
    linesUr: [
      'ریتلی زمین میں پانی جلدی نیچے جذب ہو جاتا ہے، اس لیے ڈرپ سسٹم بہترین ہے۔',
      'پانی اور مائع کھاد براہ راست پودے کی جڑ تک پہنچتی ہے۔',
      'مرچ، پیاز، بیر، لیموں اور امرود کی پیداوار دوگنی ہو جاتی ہے۔',
    ],
    linesSd: [
      'والياسي زمين ۾ پاڻي تڪڙو هيٺ هليو وڃي ٿو، ان لاءِ ڊرپ سسٽم بهترين آهي.',
      'پاڻي ۽ ڀاڻ سڌو سنئون ٻوٽي جي پاڙ ۾ پوي ٿو.',
      'مرچن، بصرن، ٻيرن، ليمن ۽ زيتون مان ٻيڻي پيداوار ملي ٿي.',
    ],
    linesEn: [
      'In porous sandy soils, flood irrigation leaches past root depth within hours.',
      'Drip emitters deliver calibrated water and fertigation straight to the root zone.',
      'Enables high-value chillies, onions, jujube (ber), citrus, and guavas in arid lands.',
    ],
    expertTipUr: 'سندھ حکومت کے زراعت واٹر مینجمنٹ پروگرام سے سبسڈی کی معلومات حاصل کریں۔',
    expertTipSd: 'سنڌ سرڪار جي واٽر مئنيجمينٽ پروگرام مان رعايت بابت ڄاڻ وٺو.',
    expertTipEn: 'Ask the Sindh On-Farm Water Management directorate for subsidy programs.',
    isSample: true,
  },
];

// Sample Community Q&A items
export const SEED_QNA: QnAItem[] = [
  {
    id: 'qna-1',
    farmerName: 'وڈیرو سرفراز جونیجو',
    location: 'ضلع سانگھڑ، تحصیل سنجھورو',
    question: 'کپاس میں چست تیلا (Whitefly) بہت زیادہ ہو گیا ہے، کیا کروں؟',
    date: '2026-10-08',
    answers: [
      {
        id: 'ans-1',
        responderName: 'ڈاکٹر طارق شاہ (محکمہ زراعت توسیعی افسر)',
        role: 'Extension Agent',
        isExtensionOfficer: true,
        text: 'پہلے پیلے چپکنے والے کارڈز لگائیں۔ اگر حملہ شدید ہو تو شام کے وقت نیم کے تیل کا اسپرے کریں یا توسیعی دفتر سے تصدیق کر کے مناسب زہر کا اسپرے کریں۔ تیز دھوپ میں اسپرے نہ کریں۔',
        helpfulVotes: 24,
      },
      {
        id: 'ans-2',
        responderName: 'علی نواز لغاری',
        role: 'Farmer',
        isExtensionOfficer: false,
        text: 'میں نے پیلے کارڈ اور صابن کا ہلکا پانی ڈالا تھا، 2 دن میں بہت فرق پڑا۔ کیمیکل ڈالنے کی ضرورت نہیں پڑی۔',
        helpfulVotes: 11,
      },
    ],
  },
  {
    id: 'qna-2',
    farmerName: 'ارباب قادر بخش',
    location: 'ضلع بدین، تحصیل ماتلی',
    question: 'شوگر مل کماد کا ریٹ سرکاری ریٹ سے کم دے رہی ہے، کیا طریقہ ہے؟',
    date: '2026-10-07',
    answers: [
      {
        id: 'ans-3',
        responderName: 'رئیس غلام حیدر میمن',
        role: 'Farmer / Mandi Agent',
        isExtensionOfficer: false,
        text: 'سندھ کین کمشنر اور شوگر بورڈ کی ہیلپ لائن پر وزن کا کانٹا رسیپٹ کے ساتھ شکایت درج کروائیں۔ مل انتظامیہ باؤنڈ ہے کہ سرکاری ریٹ پر ہی ادائیگی کرے۔',
        helpfulVotes: 19,
      },
    ],
  },
];
