export interface WeatherDay {
  dayNameUr: string;
  dayNameSd: string;
  dayNameEn: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: 'sunny' | 'partly_cloudy' | 'rainy' | 'windy' | 'heatwave';
  rainChance: number; // percentage
  humidity: number;
  windSpeed: number; // km/h
}

export interface DistrictWeather {
  districtId: string;
  todayTemp: number;
  feelsLike: number;
  condition: 'sunny' | 'partly_cloudy' | 'rainy' | 'windy' | 'heatwave';
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  alertsUr?: string;
  alertsSd?: string;
  alertsEn?: string;
  sprayAdvisoryUr: string;
  sprayAdvisorySd: string;
  sprayAdvisoryEn: string;
  irrigationAdvisoryUr: string;
  irrigationAdvisorySd: string;
  irrigationAdvisoryEn: string;
  forecast7Days: WeatherDay[];
}

export interface FertilizerPrice {
  id: string;
  nameUr: string;
  nameSd: string;
  nameEn: string;
  bagWeight: string;
  govRate: number;
  marketRate: number;
  shortDescUr: string;
  shortDescSd: string;
  shortDescEn: string;
  dosageGuideUr: string;
  dosageGuideSd: string;
  dosageGuideEn: string;
}

export interface FertilizerDealer {
  id: string;
  name: string;
  districtId: string;
  talukaId: string;
  phone: string;
  addressUr: string;
  addressSd: string;
  authorizedBrands: string[];
}

export interface LaborListing {
  id: string;
  type: 'workers_available' | 'workers_needed';
  jobType: 'cotton_picking' | 'wheat_harvesting' | 'rice_transplant' | 'tractor_driver' | 'general';
  titleUr: string;
  titleSd: string;
  titleEn: string;
  count: number;
  dailyWage: number;
  wageUnit: string;
  districtId: string;
  talukaId: string;
  contactName: string;
  phone: string;
  availableDate: string;
  isSample: boolean;
}

export type WorkType =
  | 'sowing'
  | 'harvesting'
  | 'cotton_picking'
  | 'spraying'
  | 'tractor_driver'
  | 'irrigation'
  | 'general';

export type WorkerAvailability = 'available_now' | 'busy' | 'from_date';

export interface WorkerProfile {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  districtId: string;
  villageOrTaluka: string;
  workTypes: WorkType[];
  dailyWage: number;
  availability: WorkerAvailability;
  availableDate?: string;
  experienceYears: number;
  photo?: string;
  skillsNote?: string;
  isPaused: boolean;
  isSample: boolean;
  isReported?: boolean;
  reportReason?: string;
  createdAt: string;
}

export interface ContactLogItem {
  id: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workTypes: WorkType[];
  districtId: string;
  contactedAt: string;
  action: 'call' | 'whatsapp';
}

export interface CanalSchedule {
  id: string;
  barrageNameUr: string;
  barrageNameSd: string;
  barrageNameEn: string;
  canalNameUr: string;
  canalNameSd: string;
  canalNameEn: string;
  status: 'running_full' | 'running_rotational' | 'closed';
  dischargeCusecs: number;
  turnStatusUr: string;
  turnStatusSd: string;
  turnStatusEn: string;
  nextRotationDate: string;
  districtsServed: string[];
}

export interface GovtScheme {
  id: string;
  titleUr: string;
  titleSd: string;
  titleEn: string;
  category: 'subsidy' | 'loan' | 'card' | 'solar';
  amountOrBenefitUr: string;
  amountOrBenefitSd: string;
  amountOrBenefitEn: string;
  eligibilityUr: string[];
  eligibilitySd: string[];
  eligibilityEn: string[];
  requiredDocsUr: string[];
  requiredDocsSd: string[];
  requiredDocsEn: string[];
  howToApplyUr: string;
  howToApplySd: string;
  howToApplyEn: string;
  helpline: string;
  officialLink?: string;
}

export interface TransportListing {
  id: string;
  vehicleType: 'mazda' | 'shahzore' | 'heavy_trolley' | 'bedford_truck';
  titleUr: string;
  titleSd: string;
  titleEn: string;
  capacityMaunds: number;
  ratePerKmOrTrip: number;
  rateUnit: string;
  districtId: string;
  talukaId: string;
  ownerName: string;
  phone: string;
  availableRoute: string;
  image: string;
}

export interface GodownListing {
  id: string;
  type: 'grain_storage' | 'cold_storage';
  titleUr: string;
  titleSd: string;
  titleEn: string;
  capacityBags: number;
  ratePerBagMonthly: number;
  districtId: string;
  talukaId: string;
  ownerName: string;
  phone: string;
  securityPestControl: boolean;
  address: string;
}

export interface CropCalendarStage {
  cropId: 'wheat' | 'cotton' | 'rice' | 'sugarcane';
  stageNumber: number;
  titleUr: string;
  titleSd: string;
  titleEn: string;
  timelineUr: string;
  timelineSd: string;
  timelineEn: string;
  tasksUr: string[];
  tasksSd: string[];
  tasksEn: string[];
  waterAdviceUr: string;
  waterAdviceSd: string;
  waterAdviceEn: string;
  fertilizerAdviceUr: string;
  fertilizerAdviceSd: string;
  fertilizerAdviceEn: string;
}

// ---------------- SEED WEATHER DATA ----------------
export const SEED_DISTRICT_WEATHER: Record<string, DistrictWeather> = {
  hyderabad: {
    districtId: 'hyderabad',
    todayTemp: 34,
    feelsLike: 37,
    condition: 'sunny',
    humidity: 48,
    windSpeed: 16,
    rainChance: 5,
    uvIndex: 8,
    sprayAdvisoryUr: 'ہوا کی رفتار مناسب ہے، صبح 8 سے 10 بجے یا شام کو اسپرے کیا جا سکتا ہے۔',
    sprayAdvisorySd: 'هوا جي رفتار صحيح آهي، صبح جو سويل يا شام مهل اسپرائي ڪري سگهجي ٿي.',
    sprayAdvisoryEn: 'Wind speed is normal. Best time for pesticide spraying is 8-10 AM or late afternoon.',
    irrigationAdvisoryUr: 'پانی لگانے کے لیے موزوں موسم، مٹی میں نمی کم ہو رہی ہے۔',
    irrigationAdvisorySd: 'پاڻي ڏيڻ لاءِ موزون موسم آهي، ٻني ۾ وٽ گهٽجي رهي آهي.',
    irrigationAdvisoryEn: 'Good time for scheduled irrigation, soil moisture is dropping.',
    forecast7Days: [
      { dayNameUr: 'آج', dayNameSd: 'اڄ', dayNameEn: 'Today', date: '2026-10-09', maxTemp: 34, minTemp: 22, condition: 'sunny', rainChance: 5, humidity: 48, windSpeed: 16 },
      { dayNameUr: 'ہفتہ', dayNameSd: 'ڇنڇر', dayNameEn: 'Sat', date: '2026-10-10', maxTemp: 35, minTemp: 23, condition: 'sunny', rainChance: 10, humidity: 45, windSpeed: 14 },
      { dayNameUr: 'اتوار', dayNameSd: 'آچر', dayNameEn: 'Sun', date: '2026-10-11', maxTemp: 36, minTemp: 23, condition: 'heatwave', rainChance: 0, humidity: 40, windSpeed: 12 },
      { dayNameUr: 'پیر', dayNameSd: 'سومر', dayNameEn: 'Mon', date: '2026-10-12', maxTemp: 35, minTemp: 22, condition: 'sunny', rainChance: 5, humidity: 42, windSpeed: 15 },
      { dayNameUr: 'منگل', dayNameSd: 'اڱارو', dayNameEn: 'Tue', date: '2026-10-13', maxTemp: 33, minTemp: 21, condition: 'partly_cloudy', rainChance: 20, humidity: 55, windSpeed: 18 },
      { dayNameUr: 'بدھ', dayNameSd: 'اربع', dayNameEn: 'Wed', date: '2026-10-14', maxTemp: 32, minTemp: 20, condition: 'rainy', rainChance: 65, humidity: 70, windSpeed: 22 },
      { dayNameUr: 'جمعرات', dayNameSd: 'خميس', dayNameEn: 'Thu', date: '2026-10-15', maxTemp: 31, minTemp: 20, condition: 'partly_cloudy', rainChance: 30, humidity: 62, windSpeed: 16 },
    ],
  },
  badin: {
    districtId: 'badin',
    todayTemp: 32,
    feelsLike: 36,
    condition: 'partly_cloudy',
    humidity: 65,
    windSpeed: 22,
    rainChance: 25,
    uvIndex: 7,
    alertsUr: 'ساحلی ہوائیں تیز ہیں، اسپرے کرتے وقت تیز ہوا کا دھیان رکھیں۔',
    alertsSd: 'سامونڊي هوائون تيز آهن، اسپرائي مهل احتياط ڪريو.',
    alertsEn: 'Coastal winds are strong. Avoid aerial or high-pressure spray during peak wind.',
    sprayAdvisoryUr: 'ہوا تیز ہے (22 کلومیٹر/گھنٹہ)، فی الحال اسپرے نہ کریں ورنہ دوا اڑ جائے گی۔',
    sprayAdvisorySd: 'هوا تيز آهي، هن وقت اسپرائي نه ڪريو دوا اڏامي ويندي.',
    sprayAdvisoryEn: 'High wind speed (22 km/h). Postpone spraying to prevent chemical drift.',
    irrigationAdvisoryUr: 'دھان (چاول) کے کھیت میں مناسب نمی موجود ہے۔',
    irrigationAdvisorySd: 'سارين جي ٻني ۾ پوري وٽ ۽ پاڻي موجود آهي.',
    irrigationAdvisoryEn: 'Paddy field moisture is adequate.',
    forecast7Days: [
      { dayNameUr: 'آج', dayNameSd: 'اڄ', dayNameEn: 'Today', date: '2026-10-09', maxTemp: 32, minTemp: 24, condition: 'partly_cloudy', rainChance: 25, humidity: 65, windSpeed: 22 },
      { dayNameUr: 'ہفتہ', dayNameSd: 'ڇنڇر', dayNameEn: 'Sat', date: '2026-10-10', maxTemp: 33, minTemp: 24, condition: 'sunny', rainChance: 15, humidity: 62, windSpeed: 20 },
      { dayNameUr: 'اتوار', dayNameSd: 'آچر', dayNameEn: 'Sun', date: '2026-10-11', maxTemp: 33, minTemp: 23, condition: 'sunny', rainChance: 10, humidity: 60, windSpeed: 18 },
      { dayNameUr: 'پیر', dayNameSd: 'سومر', dayNameEn: 'Mon', date: '2026-10-12', maxTemp: 32, minTemp: 23, condition: 'partly_cloudy', rainChance: 20, humidity: 64, windSpeed: 20 },
      { dayNameUr: 'منگل', dayNameSd: 'اڱارو', dayNameEn: 'Tue', date: '2026-10-13', maxTemp: 31, minTemp: 22, condition: 'rainy', rainChance: 55, humidity: 75, windSpeed: 25 },
      { dayNameUr: 'بدھ', dayNameSd: 'اربع', dayNameEn: 'Wed', date: '2026-10-14', maxTemp: 30, minTemp: 22, condition: 'rainy', rainChance: 70, humidity: 80, windSpeed: 26 },
      { dayNameUr: 'جمعرات', dayNameSd: 'خميس', dayNameEn: 'Thu', date: '2026-10-15', maxTemp: 31, minTemp: 23, condition: 'partly_cloudy', rainChance: 35, humidity: 70, windSpeed: 19 },
    ],
  },
  larkana: {
    districtId: 'larkana',
    todayTemp: 36,
    feelsLike: 39,
    condition: 'sunny',
    humidity: 42,
    windSpeed: 12,
    rainChance: 0,
    uvIndex: 9,
    alertsUr: 'دوپہر کے اوقات میں شدید گرمی اور تیز دھوپ کا الرٹ۔',
    alertsSd: 'منجهند جو سخت گرمي ۽ سج جي تپش جو الرٽ.',
    alertsEn: 'Afternoon heat alert. Keep farm animals hydrated under shaded sheds.',
    sprayAdvisoryUr: 'صبح 7 سے 9 بجے کے درمیان اسپرے مکمل کریں، تیز دھوپ میں اسپرے سے پتے جل سکتے ہیں۔',
    sprayAdvisorySd: 'صبح 7 کان 9 وڳي وچ ۾ اسپرائي مڪمل ڪريو، سخت تپش ۾ پن سڙي سگهن ٿا.',
    sprayAdvisoryEn: 'Finish spray before 9 AM; hot sun risks leaf phytotoxicity burn.',
    irrigationAdvisoryUr: 'دھان کی کٹائی سے 10 دن قبل پانی روک دیں۔',
    irrigationAdvisorySd: 'سارين جي لڻائي کان 10 ڏينهن اڳ پاڻي بند ڪريو.',
    irrigationAdvisoryEn: 'Drain paddy standing water 10 days before combine harvest.',
    forecast7Days: [
      { dayNameUr: 'آج', dayNameSd: 'اڄ', dayNameEn: 'Today', date: '2026-10-09', maxTemp: 36, minTemp: 23, condition: 'sunny', rainChance: 0, humidity: 42, windSpeed: 12 },
      { dayNameUr: 'ہفتہ', dayNameSd: 'ڇنڇر', dayNameEn: 'Sat', date: '2026-10-10', maxTemp: 37, minTemp: 24, condition: 'heatwave', rainChance: 0, humidity: 40, windSpeed: 10 },
      { dayNameUr: 'اتوار', dayNameSd: 'آچر', dayNameEn: 'Sun', date: '2026-10-11', maxTemp: 37, minTemp: 24, condition: 'heatwave', rainChance: 0, humidity: 38, windSpeed: 11 },
      { dayNameUr: 'پیر', dayNameSd: 'سومر', dayNameEn: 'Mon', date: '2026-10-12', maxTemp: 36, minTemp: 23, condition: 'sunny', rainChance: 5, humidity: 42, windSpeed: 14 },
      { dayNameUr: 'منگل', dayNameSd: 'اڱارو', dayNameEn: 'Tue', date: '2026-10-13', maxTemp: 35, minTemp: 22, condition: 'sunny', rainChance: 10, humidity: 46, windSpeed: 15 },
      { dayNameUr: 'بدھ', dayNameSd: 'اربع', dayNameEn: 'Wed', date: '2026-10-14', maxTemp: 34, minTemp: 21, condition: 'partly_cloudy', rainChance: 25, humidity: 55, windSpeed: 16 },
      { dayNameUr: 'جمعرات', dayNameSd: 'خميس', dayNameEn: 'Thu', date: '2026-10-15', maxTemp: 33, minTemp: 21, condition: 'partly_cloudy', rainChance: 15, humidity: 50, windSpeed: 14 },
    ],
  },
};

// Fallback weather generator for any district
export function getDistrictWeather(districtId: string): DistrictWeather {
  if (SEED_DISTRICT_WEATHER[districtId]) {
    return SEED_DISTRICT_WEATHER[districtId];
  }
  return {
    ...SEED_DISTRICT_WEATHER.hyderabad,
    districtId,
  };
}

// ---------------- SEED FERTILIZER & PESTICIDE DATA ----------------
export const SEED_FERTILIZERS: FertilizerPrice[] = [
  {
    id: 'fert-urea',
    nameUr: 'یوریا کھاد (سونیا / اینگرو / ایف ایف سی)',
    nameSd: 'يوريا ڀاڻ (سونيا / اينگرو)',
    nameEn: 'Urea (FFC Sona / Engro)',
    bagWeight: '50 kg Bag',
    govRate: 4400,
    marketRate: 4650,
    shortDescUr: 'پودے کے قد اور سبز پتے کے لیے بنیادی نائٹروجن کھاد۔',
    shortDescSd: 'ٻوٽي جي واڌ ۽ ساوڪ لاءِ بنيادي نائيٽروجن ڀاڻ.',
    shortDescEn: 'Primary nitrogen source essential for vegetative tillering and lush greenery.',
    dosageGuideUr: 'گندم: 2 بوری فی ایکڑ (پہلے اور دوسرے پانی پر آدھی آدھی)۔ کپاس: 2.5 بوری۔',
    dosageGuideSd: 'ڪڻڪ: 2 ٻوريون في ايڪڙ (پهرين ۽ ٻئي پاڻي تي). ڪپهه: 2.5 ٻوريون.',
    dosageGuideEn: 'Wheat: 2 bags/acre split across 1st and 2nd irrigations. Cotton: 2.5 bags.',
  },
  {
    id: 'fert-dap',
    nameUr: 'ڈی اے پی (ڈائی امونیم فاسفیٹ)',
    nameSd: 'ڊي اي پي (فاسفيٽ ڀاڻ)',
    nameEn: 'DAP (Diammonium Phosphate)',
    bagWeight: '50 kg Bag',
    govRate: 12500,
    marketRate: 13200,
    shortDescUr: 'جڑوں کو مضبوط کرنے اور سٹے میں دانہ بھرنے کے لیے اہم فاسفورس کھاد۔',
    shortDescSd: 'پاڙن کي مضبوط ڪرڻ ۽ سنگن ۾ داڻو ڀرڻ لاءِ مکيه فاسفورس ڀاڻ.',
    shortDescEn: 'Phosphorus powerhouse for root anchoring, strong stems, and grain plumpness.',
    dosageGuideUr: 'بوائی کے وقت 1 سے 1.5 بوری فی ایکڑ زمین میں ملا کر ہل چلائیں۔',
    dosageGuideSd: 'پوکڻ مهل 1 کان 1.5 ٻوري في ايڪڙ زمين ۾ ملائي هر هلايو.',
    dosageGuideEn: 'Apply 1 to 1.5 bags/acre at sowing/plowing stage before seed drilling.',
  },
  {
    id: 'fert-sop',
    nameUr: 'پوٹاش (ایس او پی - سلفیٹ آف پوٹاش)',
    nameSd: 'پوٽاش (ايس او پي)',
    nameEn: 'SOP (Sulphate of Potash)',
    bagWeight: '50 kg Bag',
    govRate: 14800,
    marketRate: 15500,
    shortDescUr: 'بیماریوں کے خلاف قوت مدافعت، دانہ وزنی اور چمکدار بناتی ہے۔',
    shortDescSd: 'بيمارين خلاف طاقت ۽ داڻي ۾ چمڪ ۽ وزن وڌائي ٿي.',
    shortDescEn: 'Potassium increases stress tolerance, drought resilience, and bold grain weight.',
    dosageGuideUr: 'نصف بوری بوائی پر یا پہلے پانی پر فلڈ کریں۔',
    dosageGuideSd: 'اڌ ٻوري پوک تي يا پهرين پاڻي سان گڏ فلڊ ڪريو.',
    dosageGuideEn: 'Apply 0.5 to 1 bag/acre at sowing or via fertigation during tillering.',
  },
  {
    id: 'fert-nitrophos',
    nameUr: 'نائٹرو فاس (این پی 22:20)',
    nameSd: 'نائيٽرو فاس',
    nameEn: 'NitroPhos (NP 22:20)',
    bagWeight: '50 kg Bag',
    govRate: 8900,
    marketRate: 9400,
    shortDescUr: 'نائٹروجن اور فاسفورس کا فوری گھلنے والا بہترین مرکب۔',
    shortDescSd: 'نائيٽروجن ۽ فاسفورس جو ترت ڳرندڙ سٺو مرڪب.',
    shortDescEn: 'Balanced quick-dissolving nitrogen and phosphorus combination.',
    dosageGuideUr: '1 بوری فی ایکڑ پہلے پانی کے ساتھ۔',
    dosageGuideSd: '1 ٻوري في ايڪڙ پهرين پاڻي سان.',
    dosageGuideEn: '1 bag/acre with first irrigation.',
  },
];

export const SEED_DEALERS: FertilizerDealer[] = [
  {
    id: 'dealer-1',
    name: 'حاجی محمد علی ایگرو سروسز (حیدرآباد)',
    districtId: 'hyderabad',
    talukaId: 'latifabad',
    phone: '03009876543',
    addressUr: 'اسٹیشن روڈ، نزد اناج منڈی، حیدرآباد',
    addressSd: 'اسٽيشن روڊ، اناج منڊي ويجھو، حيدرآباد',
    authorizedBrands: ['FFC', 'Engro', 'Fatima', 'FMC'],
  },
  {
    id: 'dealer-2',
    name: 'مہران ایگری سینٹر (ہالا، مٹیاری)',
    districtId: 'matiari',
    talukaId: 'hala',
    phone: '03017766554',
    addressUr: 'مین قومی شاہراہ (G.T Road)، ہالا بائی پاس',
    addressSd: 'مين قومي شاهراهه، هالا بائي پاس',
    authorizedBrands: ['Engro', 'Sona Urea', 'Syngenta'],
  },
  {
    id: 'dealer-3',
    name: 'سندھ ایگرو کارپوریشن (نوابشاہ)',
    districtId: 'nawabshah',
    talukaId: 'sakrand',
    phone: '03023344112',
    addressUr: 'سکرنڈ موڑ، نوابشاہ روڈ',
    addressSd: 'سڪرنڊ موڙ، نوابشاهه روڊ',
    authorizedBrands: ['FFC', 'Bayer', 'Swat Agro'],
  },
  {
    id: 'dealer-4',
    name: 'لاڑکانہ فرٹیلائزر ایجنسی',
    districtId: 'larkana',
    talukaId: 'dokri',
    phone: '03035544221',
    addressUr: 'رائس ملز بازار، لاڑکانہ',
    addressSd: 'رائس ملز بازار، لاڙڪاڻو',
    authorizedBrands: ['Engro', 'Fatima', 'Ali Akbar Group'],
  },
];

// ---------------- SEED FARM LABOR DATA ----------------
export const SEED_LABOR: LaborListing[] = [
  {
    id: 'labor-1',
    type: 'workers_available',
    jobType: 'cotton_picking',
    titleUr: 'کپاس چنائی کی ماہر لیبر (15 خواتین و مرد گروپ)',
    titleSd: 'ڪپهه چونڊڻ وارا ماهر مزدور (15 عورتون ۽ مرد)',
    titleEn: 'Expert Cotton Picking Group (15 Workers)',
    count: 15,
    dailyWage: 650,
    wageUnit: 'فی 40 کلو من چنائی / Per Maund',
    districtId: 'sanghar',
    talukaId: 'shahdadpur',
    contactName: 'جمعدار بخشل خان',
    phone: '03005544332',
    availableDate: 'فوری دستیاب',
    isSample: true,
  },
  {
    id: 'labor-2',
    type: 'workers_available',
    jobType: 'wheat_harvesting',
    titleUr: 'گندم کٹائی اور بھرائی مزدور (10 افراد)',
    titleSd: 'ڪڻڪ لڻڻ ۽ ڀرڻ وارا مزدور (10 ڄڻا)',
    titleEn: 'Wheat Harvesting & Bagging Team (10 Persons)',
    count: 10,
    dailyWage: 1200,
    wageUnit: 'فی بندہ روزانہ / Per Day',
    districtId: 'hyderabad',
    talukaId: 'hyderabad_rural',
    contactName: 'استاد فدا حسین',
    phone: '03018899776',
    availableDate: 'کل سے دستیاب',
    isSample: true,
  },
  {
    id: 'labor-3',
    type: 'workers_needed',
    jobType: 'rice_transplant',
    titleUr: 'چاول (دھان) کی پنیری لگانے والے مزدور درکار ہیں (50 ایکڑ)',
    titleSd: 'سارين جي پنير پوکڻ لاءِ مزدور گهربل (50 ايڪڙ)',
    titleEn: 'Paddy Transplanters Needed (50 Acres)',
    count: 20,
    dailyWage: 4500,
    wageUnit: 'فی ایکڑ ٹھیکہ / Per Acre Contract',
    districtId: 'badin',
    talukaId: 'golarchi',
    contactName: 'وڈیرو عبدالستار',
    phone: '03021122334',
    availableDate: '3 دن کے اندر رابطہ کریں',
    isSample: true,
  },
  {
    id: 'labor-4',
    type: 'workers_available',
    jobType: 'tractor_driver',
    titleUr: 'ماہر ٹریکٹر ڈرائیور (لیزر لیولر اور روٹاویٹر چلانے کا تجربہ)',
    titleSd: 'ماهر ٽريڪٽر ڊرائيور (ليزر ۽ روٽاوٽر جو تجربو)',
    titleEn: 'Skilled Tractor Driver (Laser & Rotavator Specialist)',
    count: 1,
    dailyWage: 35000,
    wageUnit: 'ماہانہ تنخواہ / Monthly Salary',
    districtId: 'matiari',
    talukaId: 'hala',
    contactName: 'محمد قاسم خاصخیلی',
    phone: '03034455667',
    availableDate: 'فوری دستیاب',
    isSample: true,
  },
];

// ---------------- SEED WORKER PROFILES (TWO-SIDED LABOR EXCHANGE) ----------------
export const SEED_WORKER_PROFILES: WorkerProfile[] = [
  {
    id: 'worker-1',
    name: 'جمعدار بخشل خان نظامانی',
    phone: '03005544332',
    districtId: 'sanghar',
    villageOrTaluka: 'ڳوٺ نظاماڻي، شهدادپور',
    workTypes: ['cotton_picking', 'harvesting'],
    dailyWage: 1200,
    availability: 'available_now',
    experienceYears: 12,
    skillsNote: '15 افراد کی تجربہ کار لیبر ٹیم، کپاس چنائی اور گندم کٹائی کے ماہر',
    isPaused: false,
    isSample: true,
    createdAt: '2026-10-08',
  },
  {
    id: 'worker-2',
    name: 'استاد فدا حسین خاصخیلی',
    phone: '03018899776',
    districtId: 'hyderabad',
    villageOrTaluka: 'حاتری بائی پاس، حیدرآباد رورل',
    workTypes: ['tractor_driver', 'spraying'],
    dailyWage: 2000,
    availability: 'available_now',
    experienceYears: 8,
    skillsNote: 'میسی فرگوسن اور فورڈ ٹریکٹر ڈرائیونگ، لیزر لیولر اور اسپرے مشین چلانے کے ماہر',
    isPaused: false,
    isSample: true,
    createdAt: '2026-10-07',
  },
  {
    id: 'worker-3',
    name: 'میر محمد ملاح',
    phone: '03021122334',
    districtId: 'badin',
    villageOrTaluka: 'ڪڍڻ اسٽاپ، گولاڙچي',
    workTypes: ['sowing', 'irrigation', 'harvesting'],
    dailyWage: 1100,
    availability: 'available_now',
    experienceYears: 6,
    skillsNote: 'سارين (دھان) جي پنيئر پوکڻ ۽ واهن جي واريابندي جو پورو تجربو',
    isPaused: false,
    isSample: true,
    createdAt: '2026-10-06',
  },
  {
    id: 'worker-4',
    name: 'علی نواز مہر',
    phone: '03034455667',
    districtId: 'khairpur',
    villageOrTaluka: 'کوٹ ڈیجی روڈ، خیرپور',
    workTypes: ['spraying', 'general', 'irrigation'],
    dailyWage: 1300,
    availability: 'from_date',
    availableDate: '2026-10-15',
    experienceYears: 5,
    skillsNote: 'باغات اور کپاس میں اسپرے اور کھاد ڈالنے کا مکمل تجربہ',
    isPaused: false,
    isSample: true,
    createdAt: '2026-10-05',
  },
  {
    id: 'worker-5',
    name: 'سکندر علی سولنگی',
    phone: '03049988776',
    districtId: 'matiari',
    villageOrTaluka: 'ڀٽ شاهه شريف، هالا',
    workTypes: ['sowing', 'cotton_picking', 'general'],
    dailyWage: 1000,
    availability: 'busy',
    experienceYears: 10,
    skillsNote: 'زمین کی تیاری، بیج بونا اور عام کھیت مزدوری',
    isPaused: true,
    isSample: true,
    createdAt: '2026-10-04',
  },
  {
    id: 'worker-6',
    name: 'غلام شبیر چانڈیو',
    phone: '03056677889',
    districtId: 'larkana',
    villageOrTaluka: 'رائس کینال، ڈوکری لاڑکانہ',
    workTypes: ['harvesting', 'irrigation', 'general'],
    dailyWage: 1400,
    availability: 'available_now',
    experienceYears: 7,
    skillsNote: 'دھان کی کٹائی، تھریشر پر کام اور نہری پانی باری سنبھالنا',
    isPaused: false,
    isSample: true,
    createdAt: '2026-10-03',
  },
];

// ---------------- SEED CANAL & WATER WARABANDI DATA ----------------
export const SEED_CANALS: CanalSchedule[] = [
  {
    id: 'canal-rohri',
    barrageNameUr: 'سکھر بیراج',
    barrageNameSd: 'سکر بئراج',
    barrageNameEn: 'Sukkur Barrage',
    canalNameUr: 'روہڑی کینال (Rohri Canal)',
    canalNameSd: 'روهڙي ڪئنال',
    canalNameEn: 'Rohri Canal',
    status: 'running_full',
    dischargeCusecs: 14200,
    turnStatusUr: 'نہری وارہ بندی چالو ہے: پہلے حصے (Left Bank) کی باری 12 اکتوبر تک ہے۔',
    turnStatusSd: 'واريابندي چالو: پهرين حصي جي واري 12 آڪٽوبر تائين آهي.',
    turnStatusEn: 'Rotational turn is active: Left Bank command has priority until Oct 12.',
    nextRotationDate: '2026-10-13',
    districtsServed: ['khairpur', 'naushahro_feroze', 'nawabshah', 'matiari', 'hyderabad', 'badin', 'tando_muhammad_khan'],
  },
  {
    id: 'canal-nara',
    barrageNameUr: 'سکھر بیراج',
    barrageNameSd: 'سکر بئراج',
    barrageNameEn: 'Sukkur Barrage',
    canalNameUr: 'نارا کینال (Nara Canal)',
    canalNameSd: 'نارا ڪئنال',
    canalNameEn: 'Nara Canal',
    status: 'running_rotational',
    dischargeCusecs: 11800,
    turnStatusUr: 'روٹیشن شیڈول: جمن شاہ اور کھپرو شاخوں میں پانی چھوڑ دیا گیا ہے۔',
    turnStatusSd: 'روٽيشن شيڊول: کپرو ۽ مٺڙائو واهه ۾ پاڻي ڇڏيل آهي.',
    turnStatusEn: 'Rotation active: Mithrao and Khipro branches flowing on scheduled turn.',
    nextRotationDate: '2026-10-14',
    districtsServed: ['sanghar', 'mirpurkhas', 'umerkot', 'tharparkar'],
  },
  {
    id: 'canal-rice',
    barrageNameUr: 'سکھر بیراج',
    barrageNameSd: 'سکر بئراج',
    barrageNameEn: 'Sukkur Barrage',
    canalNameUr: 'رائس کینال (Rice Canal - رائٹ بینک)',
    canalNameSd: 'رائس ڪئنال (لاڙڪاڻو)',
    canalNameEn: 'Rice Canal',
    status: 'running_rotational',
    dischargeCusecs: 9200,
    turnStatusUr: 'خریف سیزن اختتامی مرحلہ: وارث شاخ میں آخری پانی چل رہا ہے۔',
    turnStatusSd: 'سارين جو آخري مرحلو: پڇڙي وارن واهن ۾ پاڻي پهچايو پيو وڃي.',
    turnStatusEn: 'Kharif tail end: Final tail-water rationing in progress.',
    nextRotationDate: '2026-10-11',
    districtsServed: ['larkana', 'qambar_shahdadkot', 'dadu'],
  },
  {
    id: 'canal-phuleli',
    barrageNameUr: 'کوٹری بیراج (غلام محمد بیراج)',
    barrageNameSd: 'ڪوٽڙي بئراج',
    barrageNameEn: 'Kotri Barrage',
    canalNameUr: 'پھلیلی کینال (Phuleli Canal)',
    canalNameSd: 'ڦليلي ڪئنال',
    canalNameEn: 'Phuleli Canal',
    status: 'running_full',
    dischargeCusecs: 8600,
    turnStatusUr: 'پانی بحال ہے: بدین اور ٹنڈو محمد خان کی شاخوں میں روانی جاری ہے۔',
    turnStatusSd: 'پاڻي چالو: بدين ۽ ٽنڊو محمد خان جي شاخن ۾ وهڪرو جاري.',
    turnStatusEn: 'Flowing normal: Continuous supply to Badin & Tando Muhammad Khan branches.',
    nextRotationDate: '2026-10-16',
    districtsServed: ['hyderabad', 'tando_muhammad_khan', 'badin'],
  },
];

// ---------------- SEED GOVT SCHEMES & LOANS DATA ----------------
export const SEED_GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'scheme-hari-card',
    titleUr: 'بے نظیر ہاری کارڈ (سندھ حکومت)',
    titleSd: 'بينظير هاري ڪارڊ (سنڌ سرڪار)',
    titleEn: 'Benazir Hari Card (Govt of Sindh)',
    category: 'card',
    amountOrBenefitUr: '12,000 تا 25,000 روپے فی ایکڑ براہ راست کیش امداد اور کھاد پر رعایت',
    amountOrBenefitSd: '12,000 کان 25,000 روپيا في ايڪڙ سڌي مدد ۽ ڀاڻ تي رعايت',
    amountOrBenefitEn: 'PKR 12,000 - 25,000/acre direct income support & fertilizer subsidy via mobile wallet.',
    eligibilityUr: [
      'سندھ کا رہائشی کسان یا زمیندار جس کی زمین 1 سے 12.5 ایکڑ تک ہو۔',
      'زمین کا فارم 7 یا ہاری کھاتہ ریونیو ریکارڈ میں درج ہو۔',
    ],
    eligibilitySd: [
      'سنڌ جو رهواسي هاري يا زميندار جنهن وٽ 12.5 ايڪڙن تائين ٻني هجي.',
      'فارم 7 يا هاري کاتو روينيو کاتي وٽ رجسٽرڊ هجي.',
    ],
    eligibilityEn: [
      'Smallholder farmer/landowner in Sindh with landholding up to 12.5 acres.',
      'Registered in District Revenue Form VII or recognized tenant hari roll.',
    ],
    requiredDocsUr: ['اصل شناختی کارڈ (CNIC)', 'فارم-7 کی نقل (ریونیو انتقال)', 'موبائل فون سم اپنے نام پر'],
    requiredDocsSd: ['اصل شناختي ڪارڊ', 'فارم 7 جو نقل (روينيو کاتو)', 'موبائل سم پنھنجي نالي تي'],
    requiredDocsEn: ['Original CNIC', 'Form VII Revenue Land Extract', 'Biometric Verified SIM on farmer name'],
    howToApplyUr: 'قریبی اسسٹنٹ کمشنر یا تحصیل ایگریکلچر ایکسٹینشن آفس میں اندراج کرائیں، یا سندھ ایگریکلچر پورٹل پر لاگ ان کریں۔',
    howToApplySd: 'ويجهي اسسٽنٽ ڪمشنر يا تعلقي جي زراعت آفيس مان فارم ڀري جمع ڪرايو.',
    howToApplyEn: 'Visit your local Assistant Commissioner (AC) or Taluka Agriculture Extension Office with Form VII.',
    helpline: '0800-00018 / 022-9200678',
  },
  {
    id: 'scheme-solar-subsidy',
    titleUr: 'سولر ٹیوب ویل اسکیم (80٪ سرکاری سبسڈی)',
    titleSd: 'سولر ٽيوب ويل اسڪيم (80 سيڪڙو حڪومتي رعايت)',
    titleEn: 'Solar Tubewell Conversion Scheme (80% Subsidy)',
    category: 'solar',
    amountOrBenefitUr: 'سولر سسٹم پر 80 فیصد لاگت سندھ حکومت ادا کرے گی، کسان صرف 20 فیصد حصہ دے گا۔',
    amountOrBenefitSd: '80 سيڪڙو خرچ حڪومت ڏيندي، هاري کي رڳو 20 سيڪڙو ادا ڪرڻو پوندو.',
    amountOrBenefitEn: 'Govt covers 80% capital cost for solar pump conversion; farmer pays only 20%.',
    eligibilityUr: [
      'پہلے سے ڈیزل یا بجلی کے ٹیوب ویل کا مالک ہو۔',
      'زمین میں میٹھا پانی (TDS 1500 سے کم) موجود ہو۔',
    ],
    eligibilitySd: [
      'اڳ ۾ ڊيزل يا بجلي جو ٽيوب ويل لڳل هجي.',
      'زمين ۾ مٺو پاڻي هجي.',
    ],
    eligibilityEn: [
      'Existing diesel or electric tubewell owner in canal command or tubewell zone.',
      'Groundwater sweet test clearance (TDS < 1500 ppm).',
    ],
    requiredDocsUr: ['شناختی کارڈ', 'زمین کی فرد ملکیتی', 'پانی کا لیبارٹری ٹیسٹ رزلٹ'],
    requiredDocsSd: ['شناختي ڪارڊ', 'ٻني جو فرد / مالڪي کاتو', 'پاڻي جو ٽيسٽ رپورٽ'],
    requiredDocsEn: ['CNIC', 'Land Ownership Record', 'Water Quality Test Certificate'],
    howToApplyUr: 'ڈائریکٹوریٹ آف آن فارم واٹر مینجمنٹ (OFWM) سندھ میں درخواست جمع کروائیں۔',
    howToApplySd: 'آن فارم واٽر مئنيجمينٽ کاتي ۾ درخواست ڏيو.',
    howToApplyEn: 'Submit application at Directorate General of On-Farm Water Management (OFWM) Sindh.',
    helpline: '022-9200720',
  },
  {
    id: 'scheme-ztbl-loan',
    titleUr: 'زرعی ترقیاتی بینک (ZTBL) آسان زرعی قرضے',
    titleSd: 'زرعي ترقياتي بينڪ (ZTBL) آسان قرض',
    titleEn: 'ZTBL Easy Agricultural Production Loans',
    category: 'loan',
    amountOrBenefitUr: 'بیج، کھاد، ڈیزل اور ٹریکٹر کی خریداری کے لیے 2 لاکھ سے 20 لاکھ روپے تک آسان اقساط پر قرضہ۔',
    amountOrBenefitSd: 'ٻج، ڀاڻ ۽ ٽريڪٽر وٺڻ لاءِ 2 لک کان 20 لک روپين تائين آسان قسطن وارو قرض.',
    amountOrBenefitEn: 'Subsidized production markup credit up to PKR 2,000,000 for inputs and machinery.',
    eligibilityUr: ['پاکستانی شہری، زمیندار یا کرایہ دار، عمر 21 سے 65 سال، کریڈٹ ہسٹری صاف ہو۔'],
    eligibilitySd: ['پاڪستاني شهري، زميندار، عمر 21 کان 65 سال، بينڪ جو نادہنده نه هجي.'],
    eligibilityEn: ['Pakistani farmer aged 21-65 with clear e-CIB credit rating and valid land rights.'],
    requiredDocsUr: ['2 عدد پاسپورٹ سائز تصاویر', 'شناختی کارڈ', 'زرعی پاس بک یا رجسٹرڈ ایگریمنٹ'],
    requiredDocsSd: ['2 فوٽو', 'شناختي ڪارڊ', 'زرعي پاس بڪ'],
    requiredDocsEn: ['2 Photos', 'CNIC', 'Zari Pass Book / Land Revenue Registration'],
    howToApplyUr: 'کسی بھی قریبی ZTBL برانچ میں زرعی موبائل آفیسر (MCO) سے رابطہ کریں۔',
    howToApplySd: 'ويجهي ZTBL بينڪ برانچ وڃي ايم سي او سان رابطو ڪريو.',
    howToApplyEn: 'Contact Mobile Credit Officer (MCO) at any nearest ZTBL branch.',
    helpline: '051-111-303030',
  },
];

// ---------------- SEED TRANSPORT & GODOWN DATA ----------------
export const SEED_TRANSPORTS: TransportListing[] = [
  {
    id: 'trans-1',
    vehicleType: 'mazda',
    titleUr: 'مازدا ٹائٹان (Mazda Titan) 350 من منڈی ترسیل',
    titleSd: 'مازدا ٽائيٽان 350 مڻ منڊي وڃڻ لاءِ',
    titleEn: 'Mazda Titan (350 Maunds Mandi Haulage)',
    capacityMaunds: 350,
    ratePerKmOrTrip: 45,
    rateUnit: 'روپے فی من یا کلومیٹر / Per Maund-Km',
    districtId: 'hyderabad',
    talukaId: 'latifabad',
    ownerName: 'استاد حاجی گلزار',
    phone: '03002233445',
    availableRoute: 'حیدرآباد، مٹیاری، ٹنڈو اللہ یار، بدین منڈی',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trans-2',
    vehicleType: 'shahzore',
    titleUr: 'شہزور ڈالہ (120 من مال) تیز رفتار ترسیل',
    titleSd: 'شهزور ڊالو 120 مڻ تيز رفتار',
    titleEn: 'Hyundai Shahzore (120 Maunds Express Delivery)',
    capacityMaunds: 120,
    ratePerKmOrTrip: 3500,
    rateUnit: 'فی ٹرپ (لوکل تحصیل) / Per Local Trip',
    districtId: 'matiari',
    talukaId: 'hala',
    ownerName: 'راشد علی میمن',
    phone: '03016677889',
    availableRoute: 'ہالا، سعید آباد، نیو سعید آباد، سکرنڈ',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
  },
];

export const SEED_GODOWNS: GodownListing[] = [
  {
    id: 'godown-1',
    type: 'grain_storage',
    titleUr: 'حیدرآباد ماڈرن غلہ گودام (سیم اور نمی سے محفوظ)',
    titleSd: 'حيدرآباد اناج گدام (سڪل ۽ محفوظ)',
    titleEn: 'Hyderabad Modern Grain Storage Godown',
    capacityBags: 15000,
    ratePerBagMonthly: 45,
    districtId: 'hyderabad',
    talukaId: 'hyderabad_rural',
    ownerName: 'شیخ امین اینڈ برادرز',
    phone: '03004455667',
    securityPestControl: true,
    address: 'نزد غلہ منڈی انڈسٹریل ایریا، حیدرآباد',
  },
  {
    id: 'godown-2',
    type: 'cold_storage',
    titleUr: 'میرپورخاص کولڈ اسٹوریج (آم، مرچ و پیاز)',
    titleSd: 'ميرپورخاص ڪولڊ اسٽوريج (انبن ۽ بصرن لاءِ)',
    titleEn: 'Mirpurkhas Cold Storage (Fruits & Vegetables)',
    capacityBags: 8000,
    ratePerBagMonthly: 180,
    districtId: 'mirpurkhas',
    talukaId: 'mirpurkhas',
    ownerName: 'میر سرفراز تالپور',
    phone: '03028899001',
    securityPestControl: true,
    address: 'حیدرآباد بائی پاس، میرپورخاص',
  },
];

// ---------------- SEED CROP CALENDAR DATA ----------------
export const SEED_CROP_CALENDAR: CropCalendarStage[] = [
  // Wheat (گندم / ربیع سیزن)
  {
    cropId: 'wheat',
    stageNumber: 1,
    titleUr: 'زمین کی تیاری اور بوائی (سندھ کا بہترین وقت)',
    titleSd: 'زمين جي تياري ۽ پوک (سنڌ ۾ بهترين وقت)',
    titleEn: 'Land Preparation & Sowing',
    timelineUr: '1 نومبر تا 25 نومبر',
    timelineSd: '1 نومبر کان 25 نومبر',
    timelineEn: 'Nov 1 - Nov 25',
    tasksUr: [
      'رونی پانی لگانے کے بعد وتر حالت میں 2 سے 3 بار ہل اور سہاگہ چلائیں۔',
      'تصدیق شدہ بیج (اکبر-19، دلکش یا بھکر-سٹار) 50 کلو فی ایکڑ استعمال کریں۔',
      'بیج کو بوائی سے پہلے پھپھوند کش دوا (Fungicide) ضرور لگائیں۔',
    ],
    tasksSd: [
      'روني پاڻي بعد وٽ اچڻ تي 2 کان 3 ڀيرا هر هلائي ليزر ليولر هلايو.',
      'تصديق ٿيل ٻج 50 ڪلو في ايڪڙ واپرائو.',
      'ٻج کي پوکڻ کان اڳ فنگس ڪش دوا ضرور هڻو.',
    ],
    tasksEn: [
      'Plow 2-3 times at wattar moisture level and plank thoroughly.',
      'Use 50 kg/acre certified seed (Akbar-19, Dilkash or Bhakkar-Star).',
      'Treat seed with certified fungicide before drilling.',
    ],
    waterAdviceUr: 'رونی کے بعد وتر حالت میں بوائی کریں۔',
    waterAdviceSd: 'روني واري پاڻي تي وٽ حالت ۾ پوکيو.',
    waterAdviceEn: 'Drill seed at optimum wattar moisture.',
    fertilizerAdviceUr: 'بوائی پر 1.5 بوری ڈی اے پی + 1 بوری ایس او پی زمین میں ملا دیں۔',
    fertilizerAdviceSd: 'پوکڻ مهل 1.5 ٻوري ڊي اي پي + 1 ٻوري پوٽاش زمين ۾ ملايو.',
    fertilizerAdviceEn: 'Apply 1.5 bags DAP + 1 bag SOP at final plowing.',
  },
  {
    cropId: 'wheat',
    stageNumber: 2,
    titleUr: 'پہلا پانی (کور کا پانی) اور شگوفے پھوٹنا',
    titleSd: 'پهريون پاڻي (ڪور پاڻي) ۽ پُٺ لڳڻ',
    titleEn: 'First Irrigation (Crown Root Tillering)',
    timelineUr: 'بوائی کے 20 تا 25 دن بعد (دسمبر)',
    timelineSd: 'پوکڻ جي 20 کان 25 ڏينهن بعد',
    timelineEn: '20-25 days after sowing (Dec)',
    tasksUr: [
      'یہ پانی گندم کے لیے انتہائی اہم ہے، اس سے جڑیں گہری ہوتی ہیں اور نئے شگوفے نکلتے ہیں۔',
      'چوڑی اور نوکیلے پتوں والی جڑی بوٹیوں کے لیے مناسب اسپرے کا وقت۔',
    ],
    tasksSd: [
      'هي پاڻي انتهائي اهم آهي، جنهن سان پاڙون مضبوط ۽ نوان پن ڦٽندا.',
      'گند ڪچري ۽ ٻوڙن جي خاتمي لاءِ اسپرائي جو صحيح وقت.',
    ],
    tasksEn: [
      'Critical irrigation for crown root initiation and tillering vigor.',
      'Scout and spray selective herbicide for broadleaf & narrow-leaf weeds.',
    ],
    waterAdviceUr: 'ہلکا پانی لگائیں، کھیت میں پانی کھڑا نہ ہونے دیں۔',
    waterAdviceSd: 'هلڪو پاڻي ڏيو، پاڻي بيهڻ نه ڏيو.',
    waterAdviceEn: 'Light uniform irrigation; avoid prolonged water ponding.',
    fertilizerAdviceUr: 'پہلے پانی کے ساتھ 1 بوری یوریا چھٹہ کریں۔',
    fertilizerAdviceSd: 'پهرين پاڻي سان 1 ٻوري يوريا ڇٽو ڪريو.',
    fertilizerAdviceEn: 'Broadcast 1 bag Urea with first irrigation water.',
  },
  {
    cropId: 'wheat',
    stageNumber: 3,
    titleUr: 'سٹا نکلنا اور دانہ بھرنا (Gobar to Milking Stage)',
    titleSd: 'سڱ نڪرڻ ۽ کير پيئڻ جو مرحلو',
    titleEn: 'Booting, Heading & Milking Stage',
    timelineUr: 'جنوری کے آخر تا فروری',
    timelineSd: 'جنوري پڇاڙي کان فيبروري',
    timelineEn: 'Late Jan - Feb',
    tasksUr: [
      'دانے کا دودھیا مرحلہ، اس دوران فصل کو سوکا (پیاس) نہیں لگنی چاہیے۔',
      'کنجی یا زنگ (Rust) اور سست تیلے کا معائنہ کریں۔',
    ],
    tasksSd: [
      'داڻي جو کير پيئڻ جو مرحلو، هن مهل فصل کي سڪو نه لڳڻ ڏيو.',
      'ڪنجي يا رتي بيماري چيڪ ڪريو.',
    ],
    tasksEn: [
      'Critical grain filling stage; water stress drastically slashes yield.',
      'Inspect for yellow/brown rust pustules and aphid colonies.',
    ],
    waterAdviceUr: 'تیز ہوا کے دوران پانی نہ لگائیں ورنہ فصل گر جائے گی۔',
    waterAdviceSd: 'تيز هوا ۾ پاڻي نه ڏيو متان فصل ڪري پوي.',
    waterAdviceEn: 'Never irrigate during gusty winds to prevent lodging.',
    fertilizerAdviceUr: 'آدھی بوری یوریا یا امینو ایسڈ / پوٹاش کا اسپرے کریں۔',
    fertilizerAdviceSd: 'اڌ ٻوري يوريا يا پوٽاش جو اسپرائي ڪريو.',
    fertilizerAdviceEn: 'Top-dress 0.5 bag Urea or foliar potassium spray.',
  },
  {
    cropId: 'wheat',
    stageNumber: 4,
    titleUr: 'پکائی اور کٹائی (Harvesting & Threshing)',
    titleSd: 'پچڻ ۽ لڻڻ (لڻائي)',
    titleEn: 'Maturity, Harvesting & Threshing',
    timelineUr: '15 مارچ تا 15 اپریل',
    timelineSd: '15 مارچ کان 15 اپريل',
    timelineEn: 'March 15 - April 15',
    tasksUr: [
      'جب سٹے کا رنگ سنہری ہو جائے اور دانہ دانت سے چبانے پر کڑک کی آواز آئے تو کٹائی کریں۔',
      'ہارویسٹر یا تھریشر سے دانے نکال کر بوریوں میں بھریں۔',
    ],
    tasksSd: [
      'جڏهن سنگ سونهري ٿين ۽ ڏندن سان ٽڙڪ آواز اچي ته لڻائي ڪريو.',
      'ٿريشر مان صاف ڪري ٻورين ۾ ڀريو.',
    ],
    tasksEn: [
      'Harvest when straw turns golden-yellow and moisture drops under 12%.',
      'Combine harvest or thresh on clean tarpaulins.',
    ],
    waterAdviceUr: 'کٹائی سے 15 دن پہلے پانی بند کر دیں۔',
    waterAdviceSd: 'لڻڻ کان 15 ڏينهن اڳ پاڻي بند ڪريو.',
    waterAdviceEn: 'Stop irrigation 15-20 days prior to combine entry.',
    fertilizerAdviceUr: 'اس مرحلے پر کھاد کی ضرورت نہیں۔',
    fertilizerAdviceSd: 'هن مرحلي تي ڀاڻ جي ضرورت ناهي.',
    fertilizerAdviceEn: 'No fertilizer needed.',
  },
];
