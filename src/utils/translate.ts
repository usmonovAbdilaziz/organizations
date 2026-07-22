import translate from "google-translate-api-x";

// Map common language codes to ISO 639-1 codes
const langMap: Record<string, string> = {
  eng: "en",
  uz: "uz",
  ru: "ru",
  en: "en",
};

export const translateText = async (text: string, targetLang: string) => {
  const isoLang = langMap[targetLang] || targetLang;
  const result = await translate(text, { to: isoLang });
  return result.text;
};
