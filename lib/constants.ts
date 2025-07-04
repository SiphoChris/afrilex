export const LANGUAGES = [
  { code: "xh", name: "IsiXhosa" },
  { code: "zu", name: "IsiZulu" },
  { code: "af", name: "Afrikaans" },
  { code: "ts", name: "Xitsonga" },
  { code: "ss", name: "SiSwati" },
  { code: "ve", name: "TshiVenda" },
  { code: "tn", name: "SeTswana" },
  { code: "st", name: "SeSotho" },
  { code: "nso", name: "SePedi" },
  { code: "nr", name: "IsiNdebele" },
  { code: "sn", name: "ChiShona" }
];

export const DEFAULT_UI_LABELS = {
  translation: { native: "Iinguqulelo", bilingual: "Translations" },
  etymology: { native: "Intsusa yegama", bilingual: "Etymology" },
  synonym: { native: "Izithetha-ntonye", bilingual: "Synonyms" },
  antonym: { native: "Izichasi", bilingual: "Antonyms" },
  definition: { native: "Iinkcazelo", bilingual: "Definitions" },
  usage: { native: "Imizekelo yemigca", bilingual: "Example sentences" },
  collocation: { native: "Amagama ahamba onke", bilingual: "Collocations" },
  cultural_notes: { native: "Amanqaku enkcubeko", bilingual: "Cultural notes" }
};

export const GRAMMAR_CATEGORIES = {
  pos: {
    native: ["Isenzi", "Isibizo", "Isimnini", "Isimeli", "Isihlomelo", "Isikhumbuzo", "Isilanduli"],
    bilingual: ["Verb", "Noun", "Adjective", "Pronoun", "Adverb", "Interjection", "Conjunction"]
  },
  inflection: {
    tense: {
      native: ["Ixesha elidlulileyo", "Ixesha elizayo", "Ixesha langoku"],
      bilingual: ["Past tense", "Future tense", "Present tense"]
    },
    number: {
      native: ["Isinye", "Isininzi"],
      bilingual: ["Singular", "Plural"]
    }
  },
  general: {
    register: ["Formal", "Informal", "Slang", "Archaic", "Colloquial"],
    context: ["Lifestyle", "Cultural", "Daily", "Religious", "Scientific", "Technical"],
    relationship: {
      native: ["Izifanokuthi", "Ixesha", "Uhlobo lwesinyanzeliso"],
      bilingual: ["Homonym", "Tense", "Imperative form"]
    }
  }
};

export const MORPHOLOGY_PARTS = {
  native: ["Isimaphambili", "Ingcambu", "Isimamva"],
  bilingual: ["Prefix", "Root", "Suffix"]
};

export const DEFAULT_OTHER_PROPERTIES = [
  {
    title: {
      native: "Ihlelo",
      bilingual: "Noun Class"
    },
    options: ["1a", "2a", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"]
  },
  {
    title: {
      native: "Isixando",
      bilingual: "Verb extension"
    },
    options: ["sokwenzisa", "sokwenzela", "sokwenzana", "sokwenziwa", "sokwenzeka", "sokwenza"]
  }
];
  