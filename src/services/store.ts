import {
  RateEntry,
  CropListing,
  EquipmentListing,
  PracticeCard,
  QnAItem,
  SEED_RATES,
  SEED_CROP_LISTINGS,
  SEED_EQUIPMENT_LISTINGS,
  SEED_PRACTICES,
  SEED_QNA,
} from '../data/seedData';
import {
  LaborListing,
  TransportListing,
  GodownListing,
  WorkerProfile,
  ContactLogItem,
  SEED_LABOR,
  SEED_WORKER_PROFILES,
  SEED_TRANSPORTS,
  SEED_GODOWNS,
} from '../data/moreFeaturesData';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'agent' | 'admin';
  districtId: string;
  talukaId: string;
  language: 'ur' | 'sd' | 'en';
}

export interface PriceAlert {
  id: string;
  cropId: string;
  targetPrice: number;
  districtId?: string;
  createdAt: string;
}

export interface AccountEntry {
  id: string;
  type: 'income' | 'expense';
  cropId: 'wheat' | 'cotton' | 'rice' | 'sugarcane' | 'general';
  category: 'seed' | 'fertilizer' | 'labor' | 'fuel' | 'spray' | 'machinery' | 'crop_sale' | 'other';
  amount: number;
  description: string;
  date: string;
}

export interface CanalComplaint {
  id: string;
  canalName: string;
  locationRd: string;
  description: string;
  phone: string;
  status: 'submitted' | 'under_review' | 'resolved';
  date: string;
}

const STORAGE_KEYS = {
  RATES: 'agrilink_rates_v1',
  CROPS: 'agrilink_crops_v1',
  EQUIPMENT: 'agrilink_equipment_v1',
  PRACTICES: 'agrilink_practices_v1',
  QNA: 'agrilink_qna_v1',
  USER: 'agrilink_user_v1',
  SAVED: 'agrilink_saved_v1',
  ALERTS: 'agrilink_alerts_v1',
  ACCOUNTS: 'agrilink_accounts_v1',
  COMPLAINTS: 'agrilink_complaints_v1',
  LABOR: 'agrilink_labor_v1',
  WORKERS: 'agrilink_workers_v1',
  CONTACT_LOGS: 'agrilink_contact_logs_v1',
  TRANSPORTS: 'agrilink_transports_v1',
  GODOWNS: 'agrilink_godowns_v1',
};

// Initial sample account entries
const SEED_ACCOUNT_ENTRIES: AccountEntry[] = [
  {
    id: 'acc-1',
    type: 'income',
    cropId: 'wheat',
    category: 'crop_sale',
    amount: 820000,
    description: '200 من گندم فروخت غلہ منڈی (4100 روپے فی من)',
    date: '2026-10-06',
  },
  {
    id: 'acc-2',
    type: 'expense',
    cropId: 'wheat',
    category: 'fertilizer',
    amount: 145000,
    description: '10 بوری ڈی اے پی + 12 بوری یوریا کھاد',
    date: '2026-10-01',
  },
  {
    id: 'acc-3',
    type: 'expense',
    cropId: 'wheat',
    category: 'seed',
    amount: 48000,
    description: 'گندم تصدیق شدہ بیج (اکبر-19)',
    date: '2026-09-28',
  },
  {
    id: 'acc-4',
    type: 'expense',
    cropId: 'wheat',
    category: 'machinery',
    amount: 65000,
    description: 'لیزر لیولر اور روٹاویٹر ٹریکٹر کرایہ',
    date: '2026-09-25',
  },
  {
    id: 'acc-5',
    type: 'expense',
    cropId: 'wheat',
    category: 'fuel',
    amount: 52000,
    description: 'ٹیوب ویل رونی پانی کے لیے ڈیزل',
    date: '2026-09-20',
  },
  {
    id: 'acc-6',
    type: 'expense',
    cropId: 'wheat',
    category: 'labor',
    amount: 35000,
    description: 'بوائی اور کھاد چھٹہ کرنے والے مزدوروں کی اجرت',
    date: '2026-10-02',
  },
];

// Initial store hydration
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const DataStore = {
  // Rates
  getRates(): RateEntry[] {
    return loadFromStorage<RateEntry[]>(STORAGE_KEYS.RATES, SEED_RATES);
  },

  saveRate(rate: RateEntry): RateEntry[] {
    const current = this.getRates();
    const existingIndex = current.findIndex(
      (r) =>
        r.cropId === rate.cropId &&
        r.districtId === rate.districtId &&
        r.talukaId === rate.talukaId
    );

    let updated: RateEntry[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...rate, isSample: false };
    } else {
      updated = [rate, ...current];
    }

    saveToStorage(STORAGE_KEYS.RATES, updated);
    return updated;
  },

  importRatesFromCsv(rates: RateEntry[]): RateEntry[] {
    const current = this.getRates();
    const merged = [...rates, ...current];
    saveToStorage(STORAGE_KEYS.RATES, merged);
    return merged;
  },

  // Crop Listings
  getCropListings(): CropListing[] {
    return loadFromStorage<CropListing[]>(STORAGE_KEYS.CROPS, SEED_CROP_LISTINGS);
  },

  addCropListing(listing: CropListing): CropListing[] {
    const current = this.getCropListings();
    const updated = [listing, ...current];
    saveToStorage(STORAGE_KEYS.CROPS, updated);
    return updated;
  },

  updateCropListing(id: string, updates: Partial<CropListing>): CropListing[] {
    const current = this.getCropListings();
    const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
    saveToStorage(STORAGE_KEYS.CROPS, updated);
    return updated;
  },

  deleteCropListing(id: string): CropListing[] {
    const current = this.getCropListings();
    const updated = current.filter((item) => item.id !== id);
    saveToStorage(STORAGE_KEYS.CROPS, updated);
    return updated;
  },

  // Machinery & Equipment Listings
  getEquipmentListings(): EquipmentListing[] {
    return loadFromStorage<EquipmentListing[]>(STORAGE_KEYS.EQUIPMENT, SEED_EQUIPMENT_LISTINGS);
  },

  addEquipmentListing(listing: EquipmentListing): EquipmentListing[] {
    const current = this.getEquipmentListings();
    const updated = [listing, ...current];
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updated);
    return updated;
  },

  updateEquipmentListing(id: string, updates: Partial<EquipmentListing>): EquipmentListing[] {
    const current = this.getEquipmentListings();
    const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updated);
    return updated;
  },

  deleteEquipmentListing(id: string): EquipmentListing[] {
    const current = this.getEquipmentListings();
    const updated = current.filter((item) => item.id !== id);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updated);
    return updated;
  },

  reportEquipmentListing(id: string, reason: string): EquipmentListing[] {
    const current = this.getEquipmentListings();
    const updated = current.map((item) =>
      item.id === id ? { ...item, isReported: true, reportReason: reason } : item
    );
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updated);
    return updated;
  },

  // Practices
  getPractices(): PracticeCard[] {
    return loadFromStorage<PracticeCard[]>(STORAGE_KEYS.PRACTICES, SEED_PRACTICES);
  },

  // Community Q&A
  getQnA(): QnAItem[] {
    return loadFromStorage<QnAItem[]>(STORAGE_KEYS.QNA, SEED_QNA);
  },

  addQuestion(question: { farmerName: string; location: string; question: string }): QnAItem[] {
    const current = this.getQnA();
    const newItem: QnAItem = {
      id: `qna-${Date.now()}`,
      farmerName: question.farmerName,
      location: question.location,
      question: question.question,
      date: new Date().toISOString().split('T')[0],
      answers: [],
    };
    const updated = [newItem, ...current];
    saveToStorage(STORAGE_KEYS.QNA, updated);
    return updated;
  },

  addAnswer(questionId: string, answer: { responderName: string; role: string; text: string; isExtensionOfficer: boolean }): QnAItem[] {
    const current = this.getQnA();
    const updated = current.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [
            ...q.answers,
            {
              id: `ans-${Date.now()}`,
              responderName: answer.responderName,
              role: answer.role,
              text: answer.text,
              isExtensionOfficer: answer.isExtensionOfficer,
              helpfulVotes: 0,
            },
          ],
        };
      }
      return q;
    });
    saveToStorage(STORAGE_KEYS.QNA, updated);
    return updated;
  },

  upvoteAnswer(questionId: string, answerId: string): QnAItem[] {
    const current = this.getQnA();
    const updated = current.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map((a) => (a.id === answerId ? { ...a, helpfulVotes: a.helpfulVotes + 1 } : a)),
        };
      }
      return q;
    });
    saveToStorage(STORAGE_KEYS.QNA, updated);
    return updated;
  },

  // Farm Accounts (Expenses & Income)
  getAccounts(): AccountEntry[] {
    return loadFromStorage<AccountEntry[]>(STORAGE_KEYS.ACCOUNTS, SEED_ACCOUNT_ENTRIES);
  },

  addAccountEntry(entry: Omit<AccountEntry, 'id'>): AccountEntry[] {
    const current = this.getAccounts();
    const newEntry: AccountEntry = {
      ...entry,
      id: `acc-${Date.now()}`,
    };
    const updated = [newEntry, ...current];
    saveToStorage(STORAGE_KEYS.ACCOUNTS, updated);
    return updated;
  },

  deleteAccountEntry(id: string): AccountEntry[] {
    const current = this.getAccounts();
    const updated = current.filter((x) => x.id !== id);
    saveToStorage(STORAGE_KEYS.ACCOUNTS, updated);
    return updated;
  },

  // Canal Complaints
  getCanalComplaints(): CanalComplaint[] {
    return loadFromStorage<CanalComplaint[]>(STORAGE_KEYS.COMPLAINTS, []);
  },

  addCanalComplaint(comp: Omit<CanalComplaint, 'id' | 'status' | 'date'>): CanalComplaint[] {
    const current = this.getCanalComplaints();
    const newComp: CanalComplaint = {
      ...comp,
      id: `comp-${Date.now()}`,
      status: 'submitted',
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newComp, ...current];
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);
    return updated;
  },

  // Labor
  getLaborListings(): LaborListing[] {
    return loadFromStorage<LaborListing[]>(STORAGE_KEYS.LABOR, SEED_LABOR);
  },

  addLaborListing(listing: LaborListing): LaborListing[] {
    const current = this.getLaborListings();
    const updated = [listing, ...current];
    saveToStorage(STORAGE_KEYS.LABOR, updated);
    return updated;
  },

  // Worker Profiles (Two-sided Labor Exchange)
  getWorkerProfiles(): WorkerProfile[] {
    return loadFromStorage<WorkerProfile[]>(STORAGE_KEYS.WORKERS, SEED_WORKER_PROFILES);
  },

  saveWorkerProfile(profile: WorkerProfile): WorkerProfile[] {
    const current = this.getWorkerProfiles();
    const existingIndex = current.findIndex((w) => w.id === profile.id || (profile.userId && w.userId === profile.userId));
    let updated: WorkerProfile[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...current[existingIndex], ...profile, isSample: false };
    } else {
      updated = [profile, ...current];
    }
    saveToStorage(STORAGE_KEYS.WORKERS, updated);
    return updated;
  },

  deleteWorkerProfile(id: string): WorkerProfile[] {
    const current = this.getWorkerProfiles();
    const updated = current.filter((w) => w.id !== id);
    saveToStorage(STORAGE_KEYS.WORKERS, updated);
    return updated;
  },

  pauseWorkerProfile(id: string, isPaused: boolean): WorkerProfile[] {
    const current = this.getWorkerProfiles();
    const updated = current.map((w) =>
      w.id === id
        ? {
            ...w,
            isPaused,
            availability: isPaused ? ('busy' as const) : ('available_now' as const),
          }
        : w
    );
    saveToStorage(STORAGE_KEYS.WORKERS, updated);
    return updated;
  },

  reportWorkerProfile(id: string, reason: string): WorkerProfile[] {
    const current = this.getWorkerProfiles();
    const updated = current.map((w) =>
      w.id === id ? { ...w, isReported: true, reportReason: reason } : w
    );
    saveToStorage(STORAGE_KEYS.WORKERS, updated);
    return updated;
  },

  removeWorkerProfile(id: string): WorkerProfile[] {
    return this.deleteWorkerProfile(id);
  },

  // Contact logs for farmers
  getContactLogs(): ContactLogItem[] {
    return loadFromStorage<ContactLogItem[]>(STORAGE_KEYS.CONTACT_LOGS, []);
  },

  addContactLog(item: ContactLogItem): ContactLogItem[] {
    const current = this.getContactLogs();
    const filtered = current.filter((c) => c.workerId !== item.workerId);
    const updated = [item, ...filtered];
    saveToStorage(STORAGE_KEYS.CONTACT_LOGS, updated);
    return updated;
  },

  // Transport
  getTransportListings(): TransportListing[] {
    return loadFromStorage<TransportListing[]>(STORAGE_KEYS.TRANSPORTS, SEED_TRANSPORTS);
  },

  // Godowns
  getGodownListings(): GodownListing[] {
    return loadFromStorage<GodownListing[]>(STORAGE_KEYS.GODOWNS, SEED_GODOWNS);
  },

  // Auth User
  getUser(): UserProfile | null {
    return loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
  },

  setUser(user: UserProfile | null) {
    saveToStorage(STORAGE_KEYS.USER, user);
  },

  // Saved Listings
  getSavedListings(): string[] {
    return loadFromStorage<string[]>(STORAGE_KEYS.SAVED, []);
  },

  toggleSaveListing(id: string): string[] {
    const current = this.getSavedListings();
    const exists = current.includes(id);
    const updated = exists ? current.filter((x) => x !== id) : [...current, id];
    saveToStorage(STORAGE_KEYS.SAVED, updated);
    return updated;
  },

  // Price Alerts
  getPriceAlerts(): PriceAlert[] {
    return loadFromStorage<PriceAlert[]>(STORAGE_KEYS.ALERTS, []);
  },

  addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert[] {
    const current = this.getPriceAlerts();
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAlert, ...current];
    saveToStorage(STORAGE_KEYS.ALERTS, updated);
    return updated;
  },

  // Reset / Clear Data
  resetToSampleData() {
    saveToStorage(STORAGE_KEYS.RATES, SEED_RATES);
    saveToStorage(STORAGE_KEYS.CROPS, SEED_CROP_LISTINGS);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, SEED_EQUIPMENT_LISTINGS);
    saveToStorage(STORAGE_KEYS.PRACTICES, SEED_PRACTICES);
    saveToStorage(STORAGE_KEYS.QNA, SEED_QNA);
    saveToStorage(STORAGE_KEYS.ACCOUNTS, SEED_ACCOUNT_ENTRIES);
    saveToStorage(STORAGE_KEYS.WORKERS, SEED_WORKER_PROFILES);
    saveToStorage(STORAGE_KEYS.CONTACT_LOGS, []);
    saveToStorage(STORAGE_KEYS.SAVED, []);
    saveToStorage(STORAGE_KEYS.ALERTS, []);
  },

  deleteAccountData(userId: string) {
    const crops = this.getCropListings().filter((c) => c.sellerId !== userId);
    saveToStorage(STORAGE_KEYS.CROPS, crops);

    const equipment = this.getEquipmentListings().filter((e) => e.ownerId !== userId);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, equipment);

    this.setUser(null);
    saveToStorage(STORAGE_KEYS.SAVED, []);
    saveToStorage(STORAGE_KEYS.ALERTS, []);
    saveToStorage(STORAGE_KEYS.ACCOUNTS, []);
  },
};
