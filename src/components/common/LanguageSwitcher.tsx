
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages, Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    
    // Only set RTL for Arabic, LTR for English
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full"
    >
      <Globe className="h-4 w-4" />
      {i18n.language === 'ar' ? 'English' : 'عربي'}
    </Button>
  );
}
