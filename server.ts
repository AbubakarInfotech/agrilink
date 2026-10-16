import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  SEED_RATES,
  SEED_CROP_LISTINGS,
  SEED_EQUIPMENT_LISTINGS,
  SEED_PRACTICES,
} from './src/data/seedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory server store (seeded with initial data)
let serverRates = [...SEED_RATES];
let serverCropListings = [...SEED_CROP_LISTINGS];
let serverEquipmentListings = [...SEED_EQUIPMENT_LISTINGS];

// Helper: safe Gemini client initialization
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Function Declarations for Gemini
const getRatesDeclaration = {
  name: 'get_rates',
  description: 'Fetches today and yesterday mandi crop rates for a given crop, district, or taluka in Sindh/Pakistan.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      crop: {
        type: Type.STRING,
        description: 'Crop name, such as wheat (gandum), cotton (kapas/phutti), rice (chawal), or sugarcane (gunna)',
      },
      district: {
        type: Type.STRING,
        description: 'District name (e.g. Hyderabad, Matiari, Dadu, Larkana, Sukkur, Badin, Sanghar, Nawabshah, etc.)',
      },
      taluka: {
        type: Type.STRING,
        description: 'Taluka or tehsil name (optional, e.g. Hala, Dokri, Matli, Shahdadpur)',
      },
    },
    required: ['crop'],
  },
};

const searchListingsDeclaration = {
  name: 'search_listings',
  description: 'Searches active crop marketplace listings or tractor/equipment listings available for sale or rent.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: 'Type of listing to search: "crop" or "machinery" (tractor, trolley, harvester, etc.)',
      },
      query: {
        type: Type.STRING,
        description: 'Search keyword (crop name, tractor model, district)',
      },
      district: {
        type: Type.STRING,
        description: 'District filter',
      },
      listingType: {
        type: Type.STRING,
        description: 'For machinery: "sale" or "rent"',
      },
    },
    required: ['type'],
  },
};

const getPracticeDeclaration = {
  name: 'get_practice',
  description: 'Retrieves verified sustainable farming practices, water-saving guides, or non-toxic pest advice for Sindh.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: 'Topic such as "water", "pest", "soil", "rotation", or "storage"',
      },
      crop: {
        type: Type.STRING,
        description: 'Crop name (optional)',
      },
    },
    required: ['topic'],
  },
};

// Tool executor functions
function executeGetRates(args: any) {
  const cropQuery = (args.crop || '').toLowerCase();
  const districtQuery = (args.district || '').toLowerCase();
  const talukaQuery = (args.taluka || '').toLowerCase();

  const matched = serverRates.filter((r) => {
    const matchCrop =
      r.cropId.includes(cropQuery) ||
      (cropQuery.includes('wheat') && r.cropId === 'wheat') ||
      (cropQuery.includes('gand') && r.cropId === 'wheat') ||
      (cropQuery.includes('کنک') && r.cropId === 'wheat') ||
      (cropQuery.includes('ڪڻڪ') && r.cropId === 'wheat') ||
      (cropQuery.includes('cotton') && r.cropId === 'cotton') ||
      (cropQuery.includes('kapas') && r.cropId === 'cotton') ||
      (cropQuery.includes('phutti') && r.cropId === 'cotton') ||
      (cropQuery.includes('ڦٽي') && r.cropId === 'cotton') ||
      (cropQuery.includes('rice') && r.cropId === 'rice') ||
      (cropQuery.includes('chawal') && r.cropId === 'rice') ||
      (cropQuery.includes('ساري') && r.cropId === 'rice') ||
      (cropQuery.includes('sugar') && r.cropId === 'sugarcane') ||
      (cropQuery.includes('gunna') && r.cropId === 'sugarcane') ||
      (cropQuery.includes('کمند') && r.cropId === 'sugarcane') ||
      (cropQuery.includes('ڪمند') && r.cropId === 'sugarcane');

    const matchDistrict =
      !districtQuery ||
      r.districtId.toLowerCase().includes(districtQuery) ||
      districtQuery.includes(r.districtId.toLowerCase());

    const matchTaluka =
      !talukaQuery ||
      r.talukaId.toLowerCase().includes(talukaQuery) ||
      talukaQuery.includes(r.talukaId.toLowerCase());

    return matchCrop && (matchDistrict || matchTaluka);
  });

  if (matched.length > 0) {
    return matched.map((m) => ({
      crop: m.cropId,
      district: m.districtId,
      taluka: m.talukaId,
      rateToday: m.rateToday,
      rateYesterday: m.rateYesterday,
      unit: m.unitUr,
      marketSource: m.sourceUr,
      date: m.lastUpdated,
      isSample: m.isSample,
    }));
  }

  // Fallback to all rates for that crop
  const anyCropRates = serverRates.filter((r) => r.cropId.includes(cropQuery));
  return anyCropRates.slice(0, 3).map((m) => ({
    crop: m.cropId,
    district: m.districtId,
    taluka: m.talukaId,
    rateToday: m.rateToday,
    unit: m.unitUr,
    marketSource: m.sourceUr,
    note: 'Exact taluka not found, showing general rates for Sindh',
  }));
}

function executeSearchListings(args: any) {
  if (args.type === 'crop') {
    return serverCropListings.slice(0, 4).map((c) => ({
      id: c.id,
      title: c.title,
      crop: c.cropId,
      maunds: c.quantityMaunds,
      askingPrice: c.expectedPricePerMaund,
      district: c.districtId,
      seller: c.sellerName,
      phone: c.sellerPhone,
    }));
  } else {
    return serverEquipmentListings.slice(0, 4).map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      listingType: e.listingType,
      price: e.price,
      rentUnit: e.rentUnit,
      horsepower: e.horsepower,
      district: e.districtId,
      owner: e.ownerName,
      phone: e.ownerPhone,
    }));
  }
}

function executeGetPractice(args: any) {
  const topic = (args.topic || '').toLowerCase();
  const match = SEED_PRACTICES.filter(
    (p) =>
      p.topic.includes(topic) ||
      (args.crop && p.cropId === args.crop) ||
      p.titleUr.includes(topic) ||
      p.titleSd.includes(topic)
  );

  return (match.length > 0 ? match : SEED_PRACTICES.slice(0, 2)).map((p) => ({
    titleUr: p.titleUr,
    titleSd: p.titleSd,
    titleEn: p.titleEn,
    pointsUr: p.linesUr,
    pointsSd: p.linesSd,
    expertTipUr: p.expertTipUr,
    expertTipSd: p.expertTipSd,
  }));
}

// ---------------- API ROUTES ----------------

// Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, userLanguage } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured in environment (GEMINI_API_KEY)',
        fallbackReply:
          userLanguage === 'sd'
            ? 'معاف ڪجو، AI سسٽم ڪنيڪٽ ٿيڻ جي ڪوشش ۾ آهي. مهرباني ڪري سيٽنگ چيڪ ڪريو.'
            : userLanguage === 'en'
            ? 'AI service is temporarily configuring. Please verify the Gemini API key.'
            : 'معذرت، AI سروس منسلک ہو رہی ہے۔ براہ کرم بعد میں کوشش کریں۔',
      });
    }

    const systemInstruction = `You are "AgriLink" (Zameendar Saathi - زمیندار ساتھی), a warm, trusted, rural agricultural assistant for farmers and landowners in Sindh and Pakistan.

ABSOLUTE CRITICAL RULES:
1. SCRIPT & LANGUAGE MATCHING:
   - If user asks in Sindhi (سنڌي رسم الخط): Reply completely and naturally in Sindhi (سنڌي).
   - If user asks in Urdu (اردو رسم الخط): Reply completely and naturally in Urdu (اردو).
   - If user asks in Roman Urdu (e.g. "Dadu mein kapas ka rate batao", "chawal kahan bechun"): Reply in Roman Urdu!
   - If user asks in English: Reply in English.
2. SIMPLICITY & TONE:
   - Use very simple, polite village-level words: من (maund/mann), ایکڑ (acre), بوری (bori), ٹرالی (trolley), منڈی (mandi), وڈیرو/رئیس/ہاری/هاري.
   - Keep sentences short and clear. No long-winded essays. A farmer on mobile needs quick, clear answers.
3. PRICE & DATA HONESTY:
   - Call the tool "get_rates" whenever asked for crop prices.
   - NEVER invent or make up prices.
   - If specific rate is not in the system, honestly say: "Please confirm with your local mandi" (پنهنجي علائقي جي منڊي مان پڪ ڪريو / مقامی منڈی سے تصدیق کر لیں).
4. PEST / DISEASE / CHEMICAL SAFETY:
   - For pests (like pink bollworm, whitefly, sundi) and diseases: recommend safe cultural methods (neem oil spray, pheromone traps, yellow sticky cards).
   - ALWAYS remind the farmer: "Before spraying any toxic chemical, please consult with your local Agriculture Extension Officer" (محکمہ زراعت کے توسیعی افسر / زراعت کاتي جي آفيسر).
   - Do NOT give unverified chemical pesticide dosages.
5. PRIVACY:
   - Never ask for bank PINs, passwords, or CNIC.`;

    // Format conversation history for Gemini contents
    const contents: any[] = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Step 1: Initial call with tools
    let response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [
          {
            functionDeclarations: [
              getRatesDeclaration,
              searchListingsDeclaration,
              getPracticeDeclaration,
            ],
          },
        ],
      },
    });

    let toolData: any = null;

    // Check if the model requested function execution
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const functionName = call.name;
      const functionArgs = call.args || {};

      let functionResult: any = null;
      if (functionName === 'get_rates') {
        functionResult = executeGetRates(functionArgs);
        toolData = { type: 'rates', data: functionResult };
      } else if (functionName === 'search_listings') {
        functionResult = executeSearchListings(functionArgs);
        toolData = { type: 'listings', data: functionResult };
      } else if (functionName === 'get_practice') {
        functionResult = executeGetPractice(functionArgs);
        toolData = { type: 'practices', data: functionResult };
      }

      // Step 2: Feed function call result back to Gemini to produce final natural language reply
      const modelContent = response.candidates?.[0]?.content;
      const followUpContents = [
        ...contents,
        modelContent,
        {
          role: 'user',
          parts: [
            {
              text: `Tool Execution Result for ${functionName}: ${JSON.stringify(
                functionResult
              )}. Now summarize this answer for the farmer in simple friendly words in the same language and script they asked.`,
            },
          ],
        },
      ];

      const followUpResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: followUpContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: followUpResponse.text || '',
        toolData,
      });
    }

    return res.json({
      reply: response.text || '',
      toolData,
    });
  } catch (error: any) {
    console.error('Gemini API chat error:', error);
    res.status(500).json({
      error: error.message || 'Internal error processing AI query',
      fallbackReply:
        'سسٹم میں عارضی تاخیر ہے۔ براہ کرم اپنا سوال دوبارہ پوچھیں۔ (System temporary delay)',
    });
  }
});

// Crop Doctor Multimodal Plant Leaf Vision Endpoint
app.post('/api/gemini/crop-doctor', async (req, res) => {
  try {
    const { imageBase64, mimeType, userLanguage } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured',
        fallbackData: {
          cropName: userLanguage === 'sd' ? 'ڪپهه (Cotton)' : userLanguage === 'en' ? 'Cotton' : 'کپاس (Cotton)',
          diseaseName: userLanguage === 'sd' ? 'گلابي سنڊي / وائٽ فلائي' : userLanguage === 'en' ? 'Pink Bollworm / Whitefly' : 'گلابی سنڈی یا سفید مکھی',
          confidencePercent: 88,
          severity: 'Moderate',
          symptoms: [
            userLanguage === 'sd' ? 'پنن تي پيلا داغ' : 'پتوں پر زردی اور مڑاؤ',
            userLanguage === 'sd' ? 'ٻوٽي جي واڌ روڪجڻ' : 'پودے کی بڑھوتری میں کمی',
          ],
          organicTreatment: [
            userLanguage === 'sd' ? 'نِم جي تيل جو اسپرائي ڪريو' : 'نیم کے خالص عرق کا اسپرے کریں',
            userLanguage === 'sd' ? 'پيلا چمڪندڙ ڪارڊ ٻنيءَ ۾ لڳايو' : 'پیلے چپکنے والے کارڈز کھیت میں لگائیں',
          ],
          chemicalPrecautions:
            userLanguage === 'sd'
              ? 'ڪيميائي زهر واپرائڻ کان اڳ زراعت کاتي جي آفيسر سان صلاح ڪريو.'
              : 'کیمیائی اسپرے سے قبل محکمہ زراعت کے توسیعی افسر سے تصدیق لازمی ہے۔',
          expertAdvice:
            userLanguage === 'sd'
              ? 'متاثر پن فوري هٽايو ۽ متوازن پاڻي ڏيو.'
              : 'متاثرہ پتے فوری ہٹائیں اور متوازن پانی دیں۔',
        },
      });
    }

    const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const cleanMime = mimeType || 'image/jpeg';

    const langLabel = userLanguage === 'sd' ? 'Sindhi' : userLanguage === 'en' ? 'English' : 'Urdu';
    const prompt = `You are an expert plant pathologist and agronomist diagnosing crop diseases for farmers in Sindh, Pakistan.
Analyze this crop leaf / plant photo.
Return JSON ONLY with this schema:
{
  "cropName": "Crop name in ${langLabel}",
  "diseaseName": "Disease or pest name in ${langLabel} and English",
  "confidencePercent": 90,
  "severity": "Mild / Moderate / Severe",
  "symptoms": ["List 2-4 symptoms in ${langLabel}"],
  "organicTreatment": ["List 2-3 safe non-toxic cultural / organic treatments in ${langLabel}"],
  "chemicalPrecautions": "Cautionary advice regarding chemical pesticides in ${langLabel}",
  "expertAdvice": "Short friendly practical action for the farmer in ${langLabel}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: base64Data,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { expertAdvice: text };
    }

    return res.json({ success: true, diagnosis: parsed });
  } catch (error: any) {
    console.error('Crop Doctor Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Mock SMS OTP Endpoint
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number required' });
  }
  // In development, return mock OTP 1234
  return res.json({
    success: true,
    mockOtp: '1234',
    message: `OTP sent to ${phone}. For testing, use 1234.`,
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, code, role, name, districtId, talukaId, language } = req.body;
  if (code !== '1234') {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  const user = {
    id: `user-${phone.replace(/\D/g, '')}`,
    name: name || (role === 'farmer' ? 'زمیندار' : 'خریدار'),
    phone,
    role: role || 'farmer',
    districtId: districtId || 'hyderabad',
    talukaId: talukaId || 'latifabad',
    language: language || 'ur',
  };

  return res.json({ success: true, user });
});

// Production static file handling or Vite Dev Middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriLink server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
