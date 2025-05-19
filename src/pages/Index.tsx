import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Search, Stethoscope, Pill, Microscope, ArrowRight } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Common medical specialties for suggestions
  const commonSpecialties = [
    "Cardiology", 
    "Dermatology", 
    "Family Medicine", 
    "Neurology", 
    "Pediatrics", 
    "Psychiatry"
  ];
  
  // Filtered suggestions based on input
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Focus the search input when the page loads
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Update suggestions when search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      const filtered = commonSpecialties.filter(
        specialty => specialty.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 3)); // Limit to 3 suggestions
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, isFocused]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/patient/find-doctor?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      toast({
        title: t("pleaseEnterSearchTerm"),
        description: t("enterDoctorInfo"),
        variant: "destructive",
      });
      
      // Focus back on the input
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault(); // Prevent scrolling
      // Handle arrow navigation (could be implemented in a more complex UI)
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Now also navigate to search results page with this suggestion
    navigate(`/patient/find-doctor?q=${encodeURIComponent(suggestion.trim())}`);
  };

  const medicalImages = [
    {
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      alt: t("doctorWithPatient")
    },
    {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      alt: t("medicalEquipment")
    },
    {
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      alt: t("hospital")
    }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[85vh]">
        <div className="w-full max-w-5xl px-4 text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            {t('findRightDoctor')} <span className="text-primary">{t('instantly')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            {t('searchDoctors')}
          </p>

          {/* Enhanced search bar */}
          <form 
            onSubmit={handleSearch} 
            className="relative mb-12 max-w-4xl mx-auto transition-all duration-300"
            style={{
              transform: isFocused ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div className="relative flex items-center h-20 w-full border-2 border-primary rounded-full overflow-hidden shadow-xl bg-background transition-all duration-300">
              <div className="absolute left-6">
                <Search className={`h-8 w-8 ${isFocused ? 'text-primary' : 'text-primary/70'} transition-colors duration-300`} />
              </div>
              <Input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  if (debouncedSearchTerm && filteredSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                  // Delay hiding suggestions to allow for clicks
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={handleKeyDown}
                className="h-full text-xl pl-16 pr-36 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={t('searchPlaceholder')}
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={showSuggestions}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 h-[80%] rounded-full px-8 text-lg font-medium"
              >
                {t('search')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Search suggestions */}
            {showSuggestions && (
              <div
                id="search-suggestions"
                className="absolute z-10 top-[90%] left-6 right-6 mt-1 bg-background border border-primary/20 rounded-xl shadow-lg overflow-hidden"
              >
                <ul className="py-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-6 py-3 text-left hover:bg-primary/10 cursor-pointer flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="mt-3 text-sm text-muted-foreground">
              {t('noSignUpRequired')} • {t('browseAllDoctors')}
            </p>
          </form>

          {/* Medical imagery section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {medicalImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-48 object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="w-full md:w-auto cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => navigate("/patient/find-doctor")}>
              <CardContent className="flex items-center p-4">
                <div className="mr-3 p-2 bg-primary/10 rounded-full">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{t('browseAllDoctors')}</h3>
                  <p className="text-sm text-muted-foreground">{t('noSignUpRequired')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-auto cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => navigate("/doctor/auth")}>
              <CardContent className="flex items-center p-4">
                <div className="mr-3 p-2 bg-primary/10 rounded-full">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{t('doctorPortal')}</h3>
                  <p className="text-sm text-muted-foreground">{t('doctorSignIn')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Service highlights - simplified and more visually appealing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="border border-primary/10 bg-background/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6 pt-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-2">{t('specializedCare')}</h3>
                <p className="text-muted-foreground text-center">{t('specializedCareDesc')}</p>
              </CardContent>
            </Card>
            
            <Card className="border border-primary/10 bg-background/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6 pt-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Microscope className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-2">{t('expertDiagnosis')}</h3>
                <p className="text-muted-foreground text-center">{t('expertDiagnosisDesc')}</p>
              </CardContent>
            </Card>
            
            <Card className="border border-primary/10 bg-background/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6 pt-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-2">{t('patientComfort')}</h3>
                <p className="text-muted-foreground text-center">{t('patientComfortDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
