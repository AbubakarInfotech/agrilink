export function speakText(text: string, lang: 'ur' | 'sd' | 'en', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported on this device');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Match voice or lang
  const targetLang = lang === 'ur' ? 'ur-PK' : lang === 'sd' ? 'ur-PK' : 'en-US';
  utterance.lang = targetLang;
  utterance.rate = 0.9; // Slightly slower for clear rural understanding
  utterance.pitch = 1.0;

  // Try to find Urdu or Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith(targetLang.toLowerCase().slice(0, 2)) ||
      (lang !== 'en' && v.lang.toLowerCase().includes('ar'))
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
