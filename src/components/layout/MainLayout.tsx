import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Hammer, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  // Check if we're in development mode
  const isDev = import.meta.env.MODE === 'development';
  
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary mr-4">{t('Doctory')}</h2>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-sm hover:text-primary hover:underline">{t('home')}</Link>
            <Link to="/patient/find-doctor" className="text-sm hover:text-primary hover:underline">{t('findDoctor')}</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          {isDev && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dev" className="flex items-center space-x-1">
                <Wrench className="h-4 w-4" />
                <span className="hidden md:inline">Dev Tools</span>
              </Link>
            </Button>
          )}
          <LanguageSwitcher />
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
        {t('copyright')} © {new Date().getFullYear()} Doctory
        {isDev && (
          <div className="mt-1 text-xs flex items-center justify-center">
            <Wrench className="h-3 w-3 mr-1 inline-block" />
            <Link to="/dev" className="hover:underline">Dev Tools</Link>
          </div>
        )}
      </footer>
    </div>
  );
}
