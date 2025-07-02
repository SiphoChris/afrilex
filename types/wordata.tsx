export interface wordData {
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