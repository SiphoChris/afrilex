'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Nav from "@/components/layout/Nav";
import HeroSection from "@/components/layout/HeroSection";
import Main from "@/components/layout/Main";
import Footer from "@/components/layout/Footer";
import LanguageSelectionModal from "@/components/dictionary/LanguageSelectionModal";
import { toast } from 'sonner';

interface DictionaryParams {
  lang: string;
  mode: 'native' | 'bilingual';
  word?: string;
  letter: string; // Changed to required field
}

export default function DictionaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dictionaryParams, setDictionaryParams] = useState<DictionaryParams | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // LocalStorage hooks for state persistence
  const [savedLang, setSavedLang] = useLocalStorage('afrilex_language', '');
  const [savedMode, setSavedMode] = useLocalStorage<'native' | 'bilingual'>('afrilex_mode', 'native');

  useEffect(() => {
    try {
      // Check if user has no saved preferences (first visit)
      if (!savedLang) {
        setShowLanguageModal(true);
        return;
      }

      // Get URL search params with 'A' as default letter
      const lang = searchParams.get('lang') || savedLang;
      const mode = (searchParams.get('mode') as 'native' | 'bilingual') || savedMode;
      const word = searchParams.get('word') || undefined;
      const letter = searchParams.get('letter') || 'A'; // Default to 'A'

      const params: DictionaryParams = { lang, mode, word, letter };
      setDictionaryParams(params);

      // Update localStorage
      setSavedLang(lang);
      setSavedMode(mode);

      // If no params in URL, update URL with saved preferences
      const newParams = new URLSearchParams(searchParams);
      let shouldUpdate = false;
      
      if (!searchParams.get('lang')) {
        newParams.set('lang', lang);
        shouldUpdate = true;
      }
      if (!searchParams.get('mode')) {
        newParams.set('mode', mode);
        shouldUpdate = true;
      }
      if (!searchParams.get('letter')) {
        newParams.set('letter', letter);
        shouldUpdate = true;
      }
      
      if (shouldUpdate) {
        router.replace(`/dictionary?${newParams.toString()}`);
      }
    } catch (error) {
      console.error('Error initializing dictionary params:', error);
      toast.error('Failed to load dictionary preferences');
    }
  }, [searchParams, router, savedLang, savedMode, setSavedLang, setSavedMode]);

  const handleLanguageSelection = (lang: string, mode: 'native' | 'bilingual') => {
    try {
      setSavedLang(lang);
      setSavedMode(mode);
      setDictionaryParams({ lang, mode, letter: 'A' }); // Include default letter
      setShowLanguageModal(false);
      
      const newParams = new URLSearchParams();
      newParams.set('lang', lang);
      newParams.set('mode', mode);
      newParams.set('letter', 'A'); // Set default letter
      
      router.replace(`/dictionary?${newParams.toString()}`);
      toast.success('Language preferences saved!');
    } catch (error) {
      console.error('Error saving language selection:', error);
      toast.error('Failed to save language preferences');
    }
  };

  // Don't render anything until we have dictionary params or need to show modal
  if (!dictionaryParams && !showLanguageModal) {
    return <div className="size-5 animate-spin rounded-full"></div>;
  }

  // Show modal if no language is selected
  if (showLanguageModal) {
    return (
      <LanguageSelectionModal 
        isOpen={showLanguageModal}
        onLanguageSelect={handleLanguageSelection}
      />
    );
  }

  const updateParams = (updates: Partial<DictionaryParams>) => {
    try {
      const newParams = new URLSearchParams(searchParams);
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      // Ensure letter is always set (default to 'A' if being removed)
      if (!newParams.get('letter')) {
        newParams.set('letter', 'A');
      }

      router.push(`/dictionary?${newParams.toString()}`);
    } catch (error) {
      console.error('Error updating URL params:', error);
      toast.error('Failed to update dictionary view');
    }
  };

  return (
    <>
      <Nav 
        currentLang={dictionaryParams.lang}
        currentMode={dictionaryParams.mode}
        onLanguageChange={(lang) => updateParams({ lang })}
        onModeChange={(mode) => updateParams({ mode })}
        onSearch={(word) => updateParams({ word })}
      />
      <HeroSection 
        currentLang={dictionaryParams.lang}
        currentMode={dictionaryParams.mode}
        onLetterSelect={(letter) => updateParams({ letter, word: undefined })}
        selectedLetter={dictionaryParams.letter} // Pass the current letter
      />
      <Main 
        lang={dictionaryParams.lang}
        mode={dictionaryParams.mode}
        searchWord={dictionaryParams.word}
        selectedLetter={dictionaryParams.letter}
      />
      <Footer />
    </>
  );
}