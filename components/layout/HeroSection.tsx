import AlphabetPagination from "@/components/dictionary/AlphabetPagination";

interface HeroSectionProps {
  currentLang: string;
  currentMode: 'native' | 'bilingual';
  onLetterSelect: (letter: string) => void;
  selectedLetter: string;
}



function HeroSection({
  currentLang,
  currentMode,
  onLetterSelect,
  selectedLetter
}: HeroSectionProps) {
  return (
    <header className="flex flex-col items-center justify-center gap-y-12 mt-26">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-6xl font-bold text-amber-950">
          AfriLex Dictionaries
        </h1>
        <p className="text-lg text-gray-700 font-semibold">
          Never be lost for words. Search the AfriLex Dictionaries and find the word you are looking for.
        </p>
        <div className="text-sm text-gray-600">
          Current: {currentLang.toUpperCase()} - {currentMode} mode
        </div>
      </div>
      <div>
        <AlphabetPagination
          onLetterSelect={onLetterSelect}
          selectedLetter={selectedLetter} // Pass the selected letter
        />
      </div>
    </header>
  );
}

export default HeroSection;