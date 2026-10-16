export interface Taluka {
  id: string;
  nameEn: string;
  nameUr: string;
  nameSd: string;
}

export interface District {
  id: string;
  nameEn: string;
  nameUr: string;
  nameSd: string;
  provinceId: 'sindh' | 'punjab' | 'kpk' | 'balochistan';
  lat: number;
  lng: number;
  talukas: Taluka[];
}

export interface Province {
  id: 'sindh' | 'punjab' | 'kpk' | 'balochistan';
  nameEn: string;
  nameUr: string;
  nameSd: string;
}

export const PROVINCES: Province[] = [
  { id: 'sindh', nameEn: 'Sindh', nameUr: 'سندھ', nameSd: 'سنڌ' },
  { id: 'punjab', nameEn: 'Punjab', nameUr: 'پنجاب', nameSd: 'پنجاب' },
  { id: 'kpk', nameEn: 'KPK', nameUr: 'خیبر پختونخوا', nameSd: 'خيبر پختونخواهه' },
  { id: 'balochistan', nameEn: 'Balochistan', nameUr: 'بلوچستان', nameSd: 'بلوچستان' },
];

export const DISTRICTS: District[] = [
  // Sindh Districts
  {
    id: 'hyderabad',
    nameEn: 'Hyderabad',
    nameUr: 'حیدرآباد',
    nameSd: 'حيدرآباد',
    provinceId: 'sindh',
    lat: 25.396,
    lng: 68.3578,
    talukas: [
      { id: 'hyderabad_city', nameEn: 'Hyderabad City', nameUr: 'حیدرآباد سٹی', nameSd: 'حيدرآباد سٽي' },
      { id: 'hyderabad_rural', nameEn: 'Hyderabad Rural', nameUr: 'حیدرآباد دیہی', nameSd: 'حيدرآباد ٻهراڙي' },
      { id: 'latifabad', nameEn: 'Latifabad', nameUr: 'لطیف آباد', nameSd: 'لطيف آباد' },
      { id: 'qasimabad', nameEn: 'Qasimabad', nameUr: 'قاسم آباد', nameSd: 'قاسم آباد' },
    ],
  },
  {
    id: 'matiari',
    nameEn: 'Matiari',
    nameUr: 'مٹیاری',
    nameSd: 'مٽياري',
    provinceId: 'sindh',
    lat: 25.5971,
    lng: 68.4467,
    talukas: [
      { id: 'matiari', nameEn: 'Matiari', nameUr: 'مٹیاری', nameSd: 'مٽياري' },
      { id: 'hala', nameEn: 'Hala', nameUr: 'ہالا', nameSd: 'هالا' },
      { id: 'saeedabad', nameEn: 'Saeedabad', nameUr: 'سعید آباد', nameSd: 'سعید آباد' },
    ],
  },
  {
    id: 'jamshoro',
    nameEn: 'Jamshoro',
    nameUr: 'جامشورو',
    nameSd: 'ڄامشورو',
    provinceId: 'sindh',
    lat: 25.4304,
    lng: 68.2809,
    talukas: [
      { id: 'kotri', nameEn: 'Kotri', nameUr: 'کوٹری', nameSd: 'ڪوٽڙي' },
      { id: 'sehwan', nameEn: 'Sehwan', nameUr: 'سیہون', nameSd: 'سيوهڻ' },
      { id: 'manjhand', nameEn: 'Manjhand', nameUr: 'مانجھند', nameSd: 'مانجهند' },
      { id: 'thano_bula_khan', nameEn: 'Thano Bula Khan', nameUr: 'تھانو بولا خان', nameSd: 'ٿاڻو بولا خان' },
    ],
  },
  {
    id: 'dadu',
    nameEn: 'Dadu',
    nameUr: 'دادو',
    nameSd: 'دادو',
    provinceId: 'sindh',
    lat: 26.7341,
    lng: 67.7795,
    talukas: [
      { id: 'dadu', nameEn: 'Dadu', nameUr: 'دادو', nameSd: 'دادو' },
      { id: 'mehar', nameEn: 'Mehar', nameUr: 'میہڑ', nameSd: 'ميهڙ' },
      { id: 'khairpur_nathan_shah', nameEn: 'Khairpur Nathan Shah', nameUr: 'خیرپور ناتھن شاہ', nameSd: 'خيرپور ناٿن شاهه' },
      { id: 'johi', nameEn: 'Johi', nameUr: 'جوہی', nameSd: 'جوهي' },
    ],
  },
  {
    id: 'larkana',
    nameEn: 'Larkana',
    nameUr: 'لاڑکانہ',
    nameSd: 'لاڙڪاڻو',
    provinceId: 'sindh',
    lat: 27.5589,
    lng: 68.212,
    talukas: [
      { id: 'larkana', nameEn: 'Larkana', nameUr: 'لاڑکانہ', nameSd: 'لاڙڪاڻو' },
      { id: 'ratodero', nameEn: 'Ratodero', nameUr: 'رتوڈیرو', nameSd: 'رتوديرو' },
      { id: 'bakrani', nameEn: 'Bakrani', nameUr: 'بقرانی', nameSd: 'باڪراڻي' },
      { id: 'dokri', nameEn: 'Dokri', nameUr: 'ڈوکری', nameSd: 'ڏوڪري' },
    ],
  },
  {
    id: 'sukkur',
    nameEn: 'Sukkur',
    nameUr: 'سکھر',
    nameSd: 'سکر',
    provinceId: 'sindh',
    lat: 27.7052,
    lng: 68.8574,
    talukas: [
      { id: 'sukkur_city', nameEn: 'Sukkur City', nameUr: 'سکھر سٹی', nameSd: 'سکر سٽي' },
      { id: 'rohri', nameEn: 'Rohri', nameUr: 'روہڑی', nameSd: 'روهڙي' },
      { id: 'pano_aqil', nameEn: 'Pano Aqil', nameUr: 'پنو عاقل', nameSd: 'پنوعاقل' },
      { id: 'salehpat', nameEn: 'Salehpat', nameUr: 'صالح پٹ', nameSd: 'صالح پٽ' },
    ],
  },
  {
    id: 'khairpur',
    nameEn: 'Khairpur',
    nameUr: 'خیرپور',
    nameSd: 'خيرپور ميرس',
    provinceId: 'sindh',
    lat: 27.5295,
    lng: 68.7592,
    talukas: [
      { id: 'khairpur', nameEn: 'Khairpur', nameUr: 'خیرپور', nameSd: 'خيرپور' },
      { id: 'kingri', nameEn: 'Kingri', nameUr: 'کنگری', nameSd: 'ڪنگري' },
      { id: 'gambat', nameEn: 'Gambat', nameUr: 'گمبٹ', nameSd: 'گمبٽ' },
      { id: 'kot_diji', nameEn: 'Kot Diji', nameUr: 'کوٹ ڈیجی', nameSd: 'ڪوٽ ڏيجي' },
      { id: 'sobhodero', nameEn: 'Sobhodero', nameUr: 'سوبھوڈیرو', nameSd: 'سوبهوڊيرو' },
      { id: 'thari_mirwah', nameEn: 'Thari Mirwah', nameUr: 'ٹھری میرواہ', nameSd: 'ٺري ميرواهه' },
      { id: 'faiz_ganj', nameEn: 'Faiz Ganj', nameUr: 'فیض گنج', nameSd: 'فيض گنج' },
      { id: 'nara', nameEn: 'Nara', nameUr: 'نارا', nameSd: 'نارا' },
    ],
  },
  {
    id: 'nawabshah',
    nameEn: 'Shaheed Benazirabad (Nawabshah)',
    nameUr: 'شہید بینظیر آباد (نوابشاہ)',
    nameSd: 'شهيد بينظير آباد (نوابشاهه)',
    provinceId: 'sindh',
    lat: 26.2483,
    lng: 68.4096,
    talukas: [
      { id: 'nawabshah', nameEn: 'Nawabshah', nameUr: 'نوابشاہ', nameSd: 'نوابشاهه' },
      { id: 'qazi_ahmed', nameEn: 'Qazi Ahmed', nameUr: 'قاضی احمد', nameSd: 'قاضي احمد' },
      { id: 'sakrand', nameEn: 'Sakrand', nameUr: 'سکرنڈ', nameSd: 'سڪرنڊ' },
      { id: 'daur', nameEn: 'Daur', nameUr: 'دوڑ', nameSd: 'دؤڙ' },
    ],
  },
  {
    id: 'mirpurkhas',
    nameEn: 'Mirpurkhas',
    nameUr: 'میرپورخاص',
    nameSd: 'ميرپورخاص',
    provinceId: 'sindh',
    lat: 25.5276,
    lng: 69.0125,
    talukas: [
      { id: 'mirpurkhas', nameEn: 'Mirpurkhas', nameUr: 'میرپورخاص', nameSd: 'ميرپورخاص' },
      { id: 'digri', nameEn: 'Digri', nameUr: 'ڈگری', nameSd: 'ڊگھڙي' },
      { id: 'kot_ghulam_muhammad', nameEn: 'Kot Ghulam Muhammad', nameUr: 'کوٹ غلام محمد', nameSd: 'ڪوٽ غلام محمد' },
      { id: 'jhudo', nameEn: 'Jhudo', nameUr: 'جھڈو', nameSd: 'جھڏو' },
      { id: 'shujabad', nameEn: 'Shujabad', nameUr: 'شجاع آباد', nameSd: 'شجاع آباد' },
    ],
  },
  {
    id: 'badin',
    nameEn: 'Badin',
    nameUr: 'بدین',
    nameSd: 'بدين',
    provinceId: 'sindh',
    lat: 24.656,
    lng: 68.837,
    talukas: [
      { id: 'badin', nameEn: 'Badin', nameUr: 'بدین', nameSd: 'بدين' },
      { id: 'matli', nameEn: 'Matli', nameUr: 'ماتلی', nameSd: 'ماتلي' },
      { id: 'tando_bago', nameEn: 'Tando Bago', nameUr: 'ٹنڈو باگو', nameSd: 'ٽنڊو باگو' },
      { id: 'golarchi', nameEn: 'Golarchi (Shaheed Fazil Rahu)', nameUr: 'گولارچی', nameSd: 'گولاڙچي' },
      { id: 'talhar', nameEn: 'Talhar', nameUr: 'تلہار', nameSd: 'تلهار' },
    ],
  },
  {
    id: 'thatta',
    nameEn: 'Thatta',
    nameUr: 'ٹھٹہ',
    nameSd: 'ٺٽو',
    provinceId: 'sindh',
    lat: 24.7474,
    lng: 67.9235,
    talukas: [
      { id: 'thatta', nameEn: 'Thatta', nameUr: 'ٹھٹہ', nameSd: 'ٺٽو' },
      { id: 'mirpur_sakro', nameEn: 'Mirpur Sakro', nameUr: 'میرپور ساکرو', nameSd: 'ميرپور ساڪرو' },
      { id: 'ghorabari', nameEn: 'Ghorabari', nameUr: 'گھوڑا باری', nameSd: 'گھوڙا ٻاري' },
      { id: 'keti_bandar', nameEn: 'Keti Bandar', nameUr: 'کیٹی بندر', nameSd: 'ڪيٽي بندر' },
    ],
  },
  {
    id: 'sujawal',
    nameEn: 'Sujawal',
    nameUr: 'سجاول',
    nameSd: 'سجاول',
    provinceId: 'sindh',
    lat: 24.606,
    lng: 68.077,
    talukas: [
      { id: 'sujawal', nameEn: 'Sujawal', nameUr: 'سجاول', nameSd: 'سجاول' },
      { id: 'jaro', nameEn: 'Jati', nameUr: 'جاتی', nameSd: 'جاتي' },
      { id: 'shah_bandar', nameEn: 'Shah Bandar', nameUr: 'شاہ بندر', nameSd: 'شاهه بندر' },
    ],
  },
  {
    id: 'sanghar',
    nameEn: 'Sanghar',
    nameUr: 'سانگھڑ',
    nameSd: 'سانگهڙ',
    provinceId: 'sindh',
    lat: 26.0464,
    lng: 68.9481,
    talukas: [
      { id: 'sanghar', nameEn: 'Sanghar', nameUr: 'سانگھڑ', nameSd: 'سانگهڙ' },
      { id: 'shahdadpur', nameEn: 'Shahdadpur', nameUr: 'شہدادپور', nameSd: 'شهدادپور' },
      { id: 'sinjhoro', nameEn: 'Sinjhoro', nameUr: 'سنجھورو', nameSd: 'سنجهورو' },
      { id: 'tando_adam', nameEn: 'Tando Adam', nameUr: 'ٹنڈو آدم', nameSd: 'ٽنڊو آدم' },
      { id: 'jam_nawaz_ali', nameEn: 'Jam Nawaz Ali', nameUr: 'جام نواز علی', nameSd: 'ڄام نواز علي' },
      { id: 'khipro', nameEn: 'Khipro', nameUr: 'کھپرو', nameSd: 'کپرو' },
    ],
  },
  {
    id: 'ghotki',
    nameEn: 'Ghotki',
    nameUr: 'گھوٹکی',
    nameSd: 'گهوٽڪي',
    provinceId: 'sindh',
    lat: 28.006,
    lng: 69.316,
    talukas: [
      { id: 'ghotki', nameEn: 'Ghotki', nameUr: 'گھوٹکی', nameSd: 'گهوٽڪي' },
      { id: 'mirpur_mathelo', nameEn: 'Mirpur Mathelo', nameUr: 'میرپور ماتھیلو', nameSd: 'ميرپور ماٿيلو' },
      { id: 'daharki', nameEn: 'Daharki', nameUr: 'ڈھرکی', nameSd: 'ڏهرڪي' },
      { id: 'ubauro', nameEn: 'Ubauro', nameUr: 'اوباوڑو', nameSd: 'اوباوڙو' },
      { id: 'khangarh', nameEn: 'Khangarh', nameUr: 'خانگڑھ', nameSd: 'خانڳڙھ' },
    ],
  },
  {
    id: 'qambar_shahdadkot',
    nameEn: 'Qambar-Shahdadkot',
    nameUr: 'قمبر-شہدادکوٹ',
    nameSd: 'قنبر-شهدادڪوٽ',
    provinceId: 'sindh',
    lat: 27.587,
    lng: 67.994,
    talukas: [
      { id: 'qambar', nameEn: 'Qambar', nameUr: 'قمبر', nameSd: 'قنبر' },
      { id: 'shahdadkot', nameEn: 'Shahdadkot', nameUr: 'شہدادکوٹ', nameSd: 'شهدادڪوٽ' },
      { id: 'warah', nameEn: 'Warah', nameUr: 'وارہ', nameSd: 'وارهه' },
      { id: 'mirokhan', nameEn: 'Mirokhan', nameUr: 'میروخان', nameSd: 'ميروخان' },
      { id: 'naseerabad', nameEn: 'Nasirabad', nameUr: 'نصیر آباد', nameSd: 'نصيرآباد' },
    ],
  },
  {
    id: 'umerkot',
    nameEn: 'Umerkot',
    nameUr: 'عمرکوٹ',
    nameSd: 'عمرڪوٽ',
    provinceId: 'sindh',
    lat: 25.3614,
    lng: 69.7368,
    talukas: [
      { id: 'umerkot', nameEn: 'Umerkot', nameUr: 'عمرکوٹ', nameSd: 'عمرڪوٽ' },
      { id: 'pithoro', nameEn: 'Pithoro', nameUr: 'پتھورو', nameSd: 'پٿورو' },
      { id: 'samaro', nameEn: 'Samaro', nameUr: 'سامارو', nameSd: 'سامارو' },
      { id: 'kunri', nameEn: 'Kunri (Chilli Capital)', nameUr: 'کنری', nameSd: 'ڪنري' },
    ],
  },
  {
    id: 'tharparkar',
    nameEn: 'Tharparkar (Mithi)',
    nameUr: 'تھرپارکر (مٹھی)',
    nameSd: 'ٿرپارڪر (مٺي)',
    provinceId: 'sindh',
    lat: 24.7438,
    lng: 69.8024,
    talukas: [
      { id: 'mithi', nameEn: 'Mithi', nameUr: 'مٹھی', nameSd: 'مٺي' },
      { id: 'islamkot', nameEn: 'Islamkot', nameUr: 'اسلام کوٹ', nameSd: 'اسلام ڪوٽ' },
      { id: 'nagarparkar', nameEn: 'Nagarparkar', nameUr: 'نگر پارکر', nameSd: 'نگرپارڪر' },
      { id: 'chachro', nameEn: 'Chachro', nameUr: 'چھاچھرو', nameSd: 'ڇاڇرو' },
      { id: 'diplo', nameEn: 'Diplo', nameUr: 'ڈپلو', nameSd: 'ڏيپلو' },
    ],
  },
  {
    id: 'tando_allahyar',
    nameEn: 'Tando Allahyar',
    nameUr: 'ٹنڈو اللہ یار',
    nameSd: 'ٽنڊو الله يار',
    provinceId: 'sindh',
    lat: 25.4605,
    lng: 68.7176,
    talukas: [
      { id: 'tando_allahyar', nameEn: 'Tando Allahyar', nameUr: 'ٹنڈو اللہ یار', nameSd: 'ٽنڊو الله يار' },
      { id: 'chamber', nameEn: 'Chamber', nameUr: 'چمبڑ', nameSd: 'چمبڙ' },
      { id: 'jhando_mari', nameEn: 'Jhando Mari', nameUr: 'جھنڈو مری', nameSd: 'جهنڊو مري' },
    ],
  },
  {
    id: 'tando_muhammad_khan',
    nameEn: 'Tando Muhammad Khan',
    nameUr: 'ٹنڈو محمد خان',
    nameSd: 'ٽنڊو محمد خان',
    provinceId: 'sindh',
    lat: 25.1278,
    lng: 68.5369,
    talukas: [
      { id: 'tando_muhammad_khan', nameEn: 'Tando Muhammad Khan', nameUr: 'ٹنڈو محمد خان', nameSd: 'ٽنڊو محمد خان' },
      { id: 'bulri_shah_karim', nameEn: 'Bulri Shah Karim', nameUr: 'بلڑی شاہ کریم', nameSd: 'بلڙي شاهه ڪريم' },
      { id: 'tando_ghulam_hyder', nameEn: 'Tando Ghulam Hyder', nameUr: 'ٹنڈو غلام حیدر', nameSd: 'ٽنڊو غلام حيدر' },
    ],
  },
  {
    id: 'naushahro_feroze',
    nameEn: 'Naushahro Feroze',
    nameUr: 'نوشہرو فیروز',
    nameSd: 'نوشهرو فيروز',
    provinceId: 'sindh',
    lat: 26.8463,
    lng: 68.1215,
    talukas: [
      { id: 'naushahro_feroze', nameEn: 'Naushahro Feroze', nameUr: 'نوشہرو فیروز', nameSd: 'نوشهرو فيروز' },
      { id: 'moro', nameEn: 'Moro', nameUr: 'مورو', nameSd: 'مورو' },
      { id: 'kandiaro', nameEn: 'Kandiaro', nameUr: 'کنڈیارو', nameSd: 'ڪنڊيارو' },
      { id: 'bhiria', nameEn: 'Bhiria', nameUr: 'بھریا', nameSd: 'ڀريا' },
      { id: 'mehrabpur', nameEn: 'Mehrabpur', nameUr: 'محراب پور', nameSd: 'محراب پور' },
    ],
  },
  // Key neighboring Punjab Districts
  {
    id: 'rahim_yar_khan',
    nameEn: 'Rahim Yar Khan',
    nameUr: 'رحیم یار خان',
    nameSd: 'رحيم يار خان',
    provinceId: 'punjab',
    lat: 28.4195,
    lng: 70.3024,
    talukas: [
      { id: 'rahim_yar_khan', nameEn: 'Rahim Yar Khan', nameUr: 'رحیم یار خان', nameSd: 'رحيم يار خان' },
      { id: 'sadiqabad', nameEn: 'Sadiqabad', nameUr: 'صادق آباد', nameSd: 'صادق آباد' },
      { id: 'liaquatpur', nameEn: 'Liaquatpur', nameUr: 'لیاقت پور', nameSd: 'لياقت پور' },
    ],
  },
  {
    id: 'multan',
    nameEn: 'Multan',
    nameUr: 'ملتان',
    nameSd: 'ملتان',
    provinceId: 'punjab',
    lat: 30.1575,
    lng: 71.5249,
    talukas: [
      { id: 'multan_city', nameEn: 'Multan City', nameUr: 'ملتان سٹی', nameSd: 'ملتان سٽي' },
      { id: 'shujabad', nameEn: 'Shujabad', nameUr: 'شجاع آباد', nameSd: 'شجاع آباد' },
      { id: 'jalalpur_pirwala', nameEn: 'Jalalpur Pirwala', nameUr: 'جلال پور پیروالا', nameSd: 'جلال پور پيروالا' },
    ],
  },
  // Key neighboring Balochistan District
  {
    id: 'jaffarabad',
    nameEn: 'Jaffarabad (Dera Allah Yar)',
    nameUr: 'جعفر آباد',
    nameSd: 'جعفر آباد',
    provinceId: 'balochistan',
    lat: 28.3756,
    lng: 68.3516,
    talukas: [
      { id: 'dera_allah_yar', nameEn: 'Dera Allah Yar', nameUr: 'ڈیرہ اللہ یار', nameSd: 'ڊيرا الله يار' },
      { id: 'usta_muhammad', nameEn: 'Usta Muhammad', nameUr: 'اوستہ محمد', nameSd: 'استه محمد' },
    ],
  },
];

// Helper to calculate nearest district based on GPS coordinates
export function getNearestDistrict(userLat: number, userLng: number): District {
  let minDistance = Infinity;
  let nearest = DISTRICTS[0];

  for (const d of DISTRICTS) {
    const dist = Math.hypot(d.lat - userLat, d.lng - userLng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = d;
    }
  }

  return nearest;
}
