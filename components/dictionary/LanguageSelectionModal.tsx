import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { languages } from "@/constants/languages";
import { Globe, BookOpen } from "lucide-react";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onLanguageSelect: (lang: string, mode: 'native' | 'bilingual') => void;
}

function LanguageSelectionModal({ isOpen, onLanguageSelect }: LanguageSelectionModalProps) {
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'native' | 'bilingual'>('native');

  const handleConfirm = () => {
    if (selectedLang) {
      onLanguageSelect(selectedLang, selectedMode);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-amber-950">
            Welcome to AfriLex
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto text-amber-600 mb-3" />
            <p className="text-gray-600">
              Choose your preferred language and mode to get started with the dictionary.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Language
              </label>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a language..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem value={language.code} key={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Dictionary Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedMode === 'native' 
                      ? 'ring-2 ring-amber-500 bg-amber-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMode('native')}
                >
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                    <h3 className="font-medium">Native</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Indigenous language interface
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedMode === 'bilingual' 
                      ? 'ring-2 ring-amber-500 bg-amber-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMode('bilingual')}
                >
                  <CardContent className="p-4 text-center">
                    <Globe className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                    <h3 className="font-medium">Bilingual</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      English + indigenous language
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleConfirm} 
            disabled={!selectedLang}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Start Exploring
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            You can change these preferences anytime from the navigation bar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LanguageSelectionModal;