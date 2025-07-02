import { Button } from "@/components/ui/button";
import { ALPHABET_LETTERS } from "@/constants/index";
import { cn } from "@/lib/utils";

interface AlphabetPaginationProps {
  onLetterSelect: (letter: string) => void;
  selectedLetter: string;
}

function AlphabetPagination({ 
  onLetterSelect, 
  selectedLetter 
}: AlphabetPaginationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {ALPHABET_LETTERS.map((letter) => (
        <Button
          key={letter}
          variant={selectedLetter === letter ? "default" : "outline"}
          size="sm"
          onClick={() => onLetterSelect(letter)}
          className={cn(
            "w-10 h-10 transition-colors duration-200",
            selectedLetter === letter
              ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              : "hover:bg-amber-100 text-gray-800 border-gray-200"
          )}
          aria-current={selectedLetter === letter ? "page" : undefined}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
}

export default AlphabetPagination;