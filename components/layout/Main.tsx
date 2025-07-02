import WordCard from "@/components/cards/WordCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {xhosaWords} from "@/constants/index"

interface MainProps {
  lang: string;
  mode: 'native' | 'bilingual';
  searchWord?: string;
  selectedLetter?: string;
}

function Main({ lang, mode, searchWord, selectedLetter }: MainProps) {

  const filteredWords = xhosaWords.filter(word => {
    if (searchWord) {
      return word.word.toLowerCase().includes(searchWord.toLowerCase());
    }
    if (selectedLetter) {
      return word.word.toLowerCase().startsWith(selectedLetter.toLowerCase());
    }
    return true;
  });

  const getResultsTitle = () => {
    if (searchWord) {
      return (
        <p className="text-lg font-medium">
          Search results for: <span className="font-bold text-amber-700">{searchWord}</span>
        </p>
      );
    }
    
    if (selectedLetter) {
      return (
        <p className="text-lg font-medium">
          Words starting with: <span className="font-bold text-amber-700 uppercase">{selectedLetter}</span>
        </p>
      );
    }
    
    return <p className="text-lg font-medium">All words</p>;
  };

  return (
    <main className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
      <div className="mb-8">
        {getResultsTitle()}
        <p className="text-sm text-gray-600 mt-1">
          Showing {filteredWords.length} words
        </p>
      </div>
      
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.map((word) => (
            <WordCard 
              key={word.id} 
              lang={lang} 
              mode={mode}
              wordData={word}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 text-lg mb-4">No words found</p>
            {searchWord && (
              <>
                <p className="text-sm text-gray-400 mb-6">
                  Try searching for a different word or contribute this word to the dictionary
                </p>
                <Button asChild>
                  <Link href={`/contribute?word=${encodeURIComponent(searchWord)}&lang=${lang}`}>
                    Contribute {searchWord}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      {filteredWords.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg">
            Load More Words
          </Button>
        </div>
      )}
    </main>
  );
}

export default Main;