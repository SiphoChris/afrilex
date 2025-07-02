import WordCard from "@/components/cards/WordCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MainProps {
  lang: string;
  mode: 'native' | 'bilingual';
  searchWord?: string;
  selectedLetter?: string;
}

function Main({ lang, mode, searchWord, selectedLetter }: MainProps) {
  const xhosaWords = [
    {
      id: "word-xh-1",
      word: "hamba",
      language_code: "xh",
      grammar: {
        pos: "Isenzi"
      },
      phonology: {
        syllables: ["ha", "mba"],
        pronunciation_url: "/audio/hamba.mp3"
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Ukusuka endaweni uye kwenye"],
              bilingual: ["To go; to move from one place to another"]
            },
            examples: {
              native: [
                "Hamba uye esikolweni.",
                "Sihambe ngomso eKapa."
              ],
              bilingual: [
                "Go to school.",
                "We're going to Cape Town tomorrow."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["yiya", "qhubeka"],
            bilingual: ["proceed", "move"]
          }
        }
      }
    },
    {
      id: "word-xh-2",
      word: "indoda",
      language_code: "xh",
      grammar: {
        pos: "Isibizo"
      },
      phonology: {
        syllables: ["in", "do", "da"]
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Isidalwa esilume"],
              bilingual: ["A male human being; man"]
            },
            examples: {
              native: [
                "Le ndoda yinkosana yaseMpuma.",
                "Indoda ifuna ukusebenza."
              ],
              bilingual: [
                "This man is a chief from the Eastern Cape.",
                "The man wants to work."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["umlisa", "isilisa"],
            bilingual: ["male", "gentleman"]
          }
        }
      }
    },
    {
      id: "word-xh-3",
      word: "intombi",
      language_code: "xh",
      grammar: {
        pos: "Isibizo"
      },
      phonology: {
        syllables: ["in", "to", "mbi"],
        pronunciation_url: "/audio/intombi.mp3"
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Isidalwa esisikazi esingakatshati"],
              bilingual: ["A young unmarried woman; girl"]
            },
            examples: {
              native: [
                "Intombi ikwazi ukuzimela.",
                "Intombi ifunda eYunivesithi."
              ],
              bilingual: [
                "The girl can be independent.",
                "The girl is studying at University."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["inkazana", "inkwenkwezi"],
            bilingual: ["maiden", "lass"]
          }
        }
      }
    },
    {
      id: "word-xh-4",
      word: "funda",
      language_code: "xh",
      grammar: {
        pos: "Isenzi"
      },
      phonology: {
        syllables: ["fu", "nda"]
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Ukufumana ulwazi ngokufunda okanye ukufundiswa"],
              bilingual: ["To acquire knowledge through reading or being taught"]
            },
            examples: {
              native: [
                "Ndiyafunda isiNgesi.",
                "Abantwana bafunda esikolweni."
              ],
              bilingual: [
                "I'm learning English.",
                "Children learn at school."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["qeqesha", "phucula"],
            bilingual: ["study", "learn"]
          }
        }
      }
    },
    {
      id: "word-xh-5",
      word: "ihobe",
      language_code: "xh",
      grammar: {
        pos: "Isibizo"
      },
      phonology: {
        syllables: ["i", "ho", "be"],
        pronunciation_url: "/audio/ihobe.mp3"
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Intaka enomculo omhle"],
              bilingual: ["A bird known for its beautiful song; dove"]
            },
            examples: {
              native: [
                "Ihobe libika ukusa.",
                "Ndiyakuvuyela ukuba ndivile ihobe licula."
              ],
              bilingual: [
                "The dove announces the dawn.",
                "I'm happy to hear the dove singing."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["ijuba"],
            bilingual: ["pigeon"]
          }
        }
      }
    },
    {
      id: "word-xh-6",
      word: "thanda",
      language_code: "xh",
      grammar: {
        pos: "Isenzi"
      },
      phonology: {
        syllables: ["tha", "nda"]
      },
      semantics: {
        definitions: {
          content: {
            definitions: {
              native: ["Ukuba nomnqweno omhle kumntu okanye into"],
              bilingual: ["To have a strong affection for someone or something"]
            },
            examples: {
              native: [
                "Ndiyakuthanda umama wam.",
                "Uthanda ukudlala ibhola."
              ],
              bilingual: [
                "I love my mother.",
                "He loves playing soccer."
              ]
            }
          }
        },
        synonyms: {
          content: {
            native: ["khawulela", "bathabatha"],
            bilingual: ["love", "cherish"]
          }
        }
      }
    }
  ];

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
          Showing {filteredWords.length} words in {mode} mode
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