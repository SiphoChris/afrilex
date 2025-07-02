import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, Volume2 } from "lucide-react";
import Link from "next/link";

interface WordData {
  id: string;
  word: string;
  language_code: string;
  translations?: {
    content: string[];
  };
  grammar?: {
    pos: string;
  };
  phonology?: {
    pronunciation_url?: string;
    syllables?: string[];
  };
  semantics?: {
    definitions?: {
      content: {
        definitions: {
          native: string[];
          bilingual: string[];
        };
        examples: {
          native: string[];
          bilingual: string[];
        };
      };
    };
    synonyms?: {
      content: {
        native: string[];
        bilingual: string[];
      };
    };
  };
}

interface WordCardProps {
  lang: string;
  mode: 'native' | 'bilingual';
  wordData: WordData;
}

function WordCard({ mode, wordData }: WordCardProps) {
  const handlePlayAudio = () => {
    if (wordData.phonology?.pronunciation_url) {
      const audio = new Audio(wordData.phonology.pronunciation_url);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const syllableDisplay = wordData.phonology?.syllables?.join('·') || wordData.word;

  return (
    <article className="relative p-4 border-2 border-gray-100 rounded-lg max-w-[600px] hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between border-b-2 border-gray-100 pb-4 mb-4">
          <div>
            <div className="flex gap-x-3 items-center">
              <span className="font-bold text-lg">
                {wordData.word}
              </span>
              {wordData.grammar?.pos && (
                <Badge variant="outline">
                  {wordData.grammar.pos}
                </Badge>
              )}
            </div>
            <p className="text-sm italic text-gray-600">
              {syllableDisplay}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {wordData.phonology?.pronunciation_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                className="flex items-center gap-1"
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-sm text-gray-600">Audio</span>
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <WordCardModeSwitcher 
            wordData={wordData}
            currentMode={mode}
          />
        </div>
      </div>
    </article>
  );
}

interface WordCardModeSwitcherProps {
  wordData: WordData;
  currentMode: 'native' | 'bilingual';
}

function WordCardModeSwitcher({ wordData, currentMode }: WordCardModeSwitcherProps) {
  const nativeDefinitions = wordData.semantics?.definitions?.content?.definitions?.native || [];
  const bilingualDefinitions = wordData.semantics?.definitions?.content?.definitions?.bilingual || [];
  const nativeExamples = wordData.semantics?.definitions?.content?.examples?.native || [];
  const bilingualExamples = wordData.semantics?.definitions?.content?.examples?.bilingual || [];
  const nativeSynonyms = wordData.semantics?.synonyms?.content?.native || [];
  const bilingualSynonyms = wordData.semantics?.synonyms?.content?.bilingual || [];

  return (
    <div>
      <Tabs defaultValue={currentMode} className="max-w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="native">Native</TabsTrigger>
            <TabsTrigger value="bilingual">Bilingual</TabsTrigger>
          </TabsList>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dictionary/${wordData.id}`} className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              View
            </Link>
          </Button>
        </div>
        
        <TabsContent value="native" className="space-y-4">
          {nativeDefinitions.length > 0 && (
            <div>
              <p className="font-semibold text-md mb-2">Iinkcazelo</p>
              <ul className="text-sm space-y-1">
                {nativeDefinitions.map((definition, index) => (
                  <li key={index} className="list-none list-outside">
                    {definition}
                    {nativeExamples.length > 0 && (
                      <ul className="indent-3 border-l-2 border-gray-300 mt-1">
                        {nativeExamples.map((example, exIndex) => (
                          <li key={exIndex} className="text-gray-600">
                            {example}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {nativeSynonyms.length > 0 && (
            <div>
              <p className="font-semibold text-md mb-2">Izithetha-ntonye</p>
              <div className="flex flex-wrap gap-2">
                {nativeSynonyms.map((synonym, index) => (
                  <span key={index} className="py-1 px-3 rounded-md border border-gray-300 text-sm">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bilingual" className="space-y-4">
          {bilingualDefinitions.length > 0 && (
            <div>
              <p className="font-semibold text-md mb-2">Definitions</p>
              <ul className="text-sm space-y-1">
                {bilingualDefinitions.map((definition, index) => (
                  <li key={index} className="list-none list-outside">
                    {definition}
                    {bilingualExamples.length > 0 && (
                      <ul className="indent-3 border-l-2 border-gray-300 mt-1">
                        {bilingualExamples.map((example, exIndex) => (
                          <li key={exIndex} className="text-gray-600">
                            {example}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {bilingualSynonyms.length > 0 && (
            <div>
              <p className="font-semibold text-md mb-2">Synonyms</p>
              <div className="flex flex-wrap gap-2">
                {bilingualSynonyms.map((synonym, index) => (
                  <span key={index} className="py-1 px-3 rounded-md border border-gray-300 text-sm">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WordCard;