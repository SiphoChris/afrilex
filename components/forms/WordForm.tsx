'use client'

import { useState, KeyboardEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Play, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LANGUAGES, GRAMMAR_CATEGORIES, MORPHOLOGY_PARTS, DEFAULT_UI_LABELS, DEFAULT_OTHER_PROPERTIES } from "@/lib/constants";

// Default dictionary configuration
const DEFAULT_DICTIONARY_CONFIG = {
  language_code: "",
  ui_labels: DEFAULT_UI_LABELS,
  language_config: {
    grammar: {
      pos: {
        native: [...GRAMMAR_CATEGORIES.pos.native],
        bilingual: [...GRAMMAR_CATEGORIES.pos.bilingual]
      },
      inflection: {
        tense: {
          native: [...GRAMMAR_CATEGORIES.inflection.tense.native],
          bilingual: [...GRAMMAR_CATEGORIES.inflection.tense.bilingual]
        },
        number: {
          native: [...GRAMMAR_CATEGORIES.inflection.number.native],
          bilingual: [...GRAMMAR_CATEGORIES.inflection.number.bilingual]
        }
      },
      general: {
        register: [...GRAMMAR_CATEGORIES.general.register],
        context: [...GRAMMAR_CATEGORIES.general.context],
        relationship: {
          native: [...GRAMMAR_CATEGORIES.general.relationship.native],
          bilingual: [...GRAMMAR_CATEGORIES.general.relationship.bilingual]
        }
      }
    },
    morphology: {
      native: [...MORPHOLOGY_PARTS.native],
      bilingual: [...MORPHOLOGY_PARTS.bilingual]
    },
    other_properties: [...DEFAULT_OTHER_PROPERTIES]
  }
};

// Schema for form validation
const wordSchema = z.object({
  word: z.string().min(1, "Word is required"),
  language_code: z.string().min(1, "Language code is required"),
  translations: z.object({
    content: z.array(z.string()).min(1, "At least one translation is required")
  }),
  lemma: z.object({
    is_lemma: z.boolean(),
    lemma_word: z.string().nullable()
  }),
  etymology: z.object({
    content: z.object({
      native: z.string(),
      bilingual: z.string()
    })
  }),
  morphology: z.array(z.object({
    part: z.string(),
    content: z.string()
  })),
  phonology: z.object({
    pronunciation_url: z.string().optional(),
    syllables: z.array(z.string())
  }),
  grammar: z.object({
    pos: z.string(),
    inflection: z.object({
      tense: z.string().optional(),
      number: z.string(),
      plural_form: z.object({
        word: z.string().optional(),
        example_sentences: z.array(z.object({
          pair: z.object({
            native: z.string(),
            bilingual: z.string(),
            context: z.string(),
            created_by: z.object({
              name: z.string(),
              role: z.string()
            })
          })
        })).optional()
      }).optional()
    }),
    other_properties: z.record(z.string()).optional()
  }),
  semantics: z.object({
    definitions: z.object({
      content: z.object({
        native: z.array(z.string()).min(1, "At least one native definition is required"),
        bilingual: z.array(z.string()).min(1, "At least one bilingual definition is required")
      })
    }),
    antonyms: z.object({
      content: z.object({
        native: z.array(z.string()),
        bilingual: z.array(z.string())
      })
    }).optional(),
    synonyms: z.object({
      content: z.object({
        native: z.array(z.string()),
        bilingual: z.array(z.string())
      })
    }).optional()
  }),
  usage: z.object({
    content: z.object({
      sentences: z.array(z.object({
        pair: z.object({
          native: z.string(),
          bilingual: z.string(),
          context: z.string(),
          created_by: z.object({
            name: z.string(),
            role: z.string()
          })
        })
      }))
    })
  }),
  collocations: z.object({
    content: z.object({
      native: z.array(z.string()),
      bilingual: z.array(z.string())
    })
  }).optional(),
  cultural_notes: z.object({
    content: z.object({
      native: z.string(),
      bilingual: z.string()
    })
  }).optional(),
  other_properties: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  metadata: z.object({
    status: z.string(),
    is_published: z.boolean(),
    created_by: z.string(),
    created_at: z.string(),
    updated_at: z.string()
  })
});

type WordFormValues = z.infer<typeof wordSchema>;

interface WordFormProps {
  dictionaryConfig?: {
    language_code: string;
    ui_labels: {
      translation: { native: string; bilingual: string };
      etymology: { native: string; bilingual: string };
      synonym: { native: string; bilingual: string };
      antonym: { native: string; bilingual: string };
      definition: { native: string; bilingual: string };
      usage: { native: string; bilingual: string };
      collocation: { native: string; bilingual: string };
      cultural_notes: { native: string; bilingual: string };
    };
    language_config: {
      grammar: {
        pos: { native: string[]; bilingual: string[] };
        inflection: {
          tense: { native: string[]; bilingual: string[] };
          number: { native: string[]; bilingual: string[] };
        };
        general: {
          register: string[];
          context: string[];
          relationship: { native: string[]; bilingual: string[] };
        };
      };
      morphology: { native: string[]; bilingual: string[] };
      other_properties: Array<{
        title: { native: string; bilingual: string };
        options: string[];
      }>;
    };
  };
  initialData?: Partial<WordFormValues>;
  onSubmit: (data: WordFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function WordForm({ 
  dictionaryConfig = DEFAULT_DICTIONARY_CONFIG, 
  initialData, 
  onSubmit, 
  isLoading = false 
}: WordFormProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentSyllable, setCurrentSyllable] = useState("");

  const defaultValues: WordFormValues = {
    word: "",
    language_code: dictionaryConfig.language_code,
    translations: {
      content: [""]
    },
    lemma: {
      is_lemma: true,
      lemma_word: null
    },
    etymology: {
      content: {
        native: "",
        bilingual: ""
      }
    },
    morphology: dictionaryConfig.language_config.morphology.native.map((part, index) => ({
      part: dictionaryConfig.language_config.morphology.native[index],
      content: ""
    })),
    phonology: {
      pronunciation_url: "",
      syllables: []
    },
    grammar: {
      pos: "",
      inflection: {
        tense: "",
        number: "",
        plural_form: {
          word: "",
          example_sentences: [{
            pair: {
              native: "",
              bilingual: "",
              context: dictionaryConfig.language_config.grammar.general.context[0],
              created_by: { name: "", role: "admin" }
            }
          }]
        }
      },
      other_properties: {}
    },
    semantics: {
      definitions: {
        content: {
          native: [""],
          bilingual: [""]
        }
      },
      antonyms: {
        content: {
          native: [],
          bilingual: []
        }
      },
      synonyms: {
        content: {
          native: [],
          bilingual: []
        }
      }
    },
    usage: {
      content: {
        sentences: [{
          pair: {
            native: "",
            bilingual: "",
            context: dictionaryConfig.language_config.grammar.general.context[0],
            created_by: { name: "", role: "admin" }
          }
        }]
      }
    },
    collocations: {
      content: {
        native: [],
        bilingual: []
      }
    },
    cultural_notes: {
      content: {
        native: "",
        bilingual: ""
      }
    },
    other_properties: dictionaryConfig.language_config.other_properties.map(prop => ({
      label: prop.title.native,
      value: ""
    })),
    metadata: {
      status: "Draft",
      is_published: false,
      created_by: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues
  });

  const { 
    register, 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = form;

  // Field arrays for repeatable sections
  const { fields: translationFields, append: appendTranslation, remove: removeTranslation } = useFieldArray({
    control,
    name: "translations.content"
  });

  const { fields: definitionNativeFields, append: appendDefinitionNative, remove: removeDefinitionNative } = useFieldArray({
    control,
    name: "semantics.definitions.content.native"
  });

  const { fields: definitionBilingualFields, append: appendDefinitionBilingual, remove: removeDefinitionBilingual } = useFieldArray({
    control,
    name: "semantics.definitions.content.bilingual"
  });

  const { fields: synonymNativeFields, append: appendSynonymNative, remove: removeSynonymNative } = useFieldArray({
    control,
    name: "semantics.synonyms.content.native"
  });

  const { fields: synonymBilingualFields, append: appendSynonymBilingual, remove: removeSynonymBilingual } = useFieldArray({
    control,
    name: "semantics.synonyms.content.bilingual"
  });

  const { fields: antonymNativeFields, append: appendAntonymNative, remove: removeAntonymNative } = useFieldArray({
    control,
    name: "semantics.antonyms.content.native"
  });

  const { fields: antonymBilingualFields, append: appendAntonymBilingual, remove: removeAntonymBilingual } = useFieldArray({
    control,
    name: "semantics.antonyms.content.bilingual"
  });

  const { fields: usageFields, append: appendUsage, remove: removeUsage } = useFieldArray({
    control,
    name: "usage.content.sentences"
  });

  const { fields: collocationNativeFields, append: appendCollocationNative, remove: removeCollocationNative } = useFieldArray({
    control,
    name: "collocations.content.native"
  });

  const { fields: collocationBilingualFields, append: appendCollocationBilingual, remove: removeCollocationBilingual } = useFieldArray({
    control,
    name: "collocations.content.bilingual"
  });

  const { fields: pluralExampleFields, append: appendPluralExample, remove: removePluralExample } = useFieldArray({
    control,
    name: "grammar.inflection.plural_form.example_sentences"
  });

  const { fields: syllableFields, append: appendSyllable, remove: removeSyllable } = useFieldArray({
    control,
    name: "phonology.syllables"
  });

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setIsUploading(true);
        try {
          // Simulate upload - replace with actual Convex storage upload
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUrl = URL.createObjectURL(file);
          setValue("phonology.pronunciation_url", mockUrl);
          toast.success("Audio file uploaded successfully");
        } catch (error) {
          toast.error("Failed to upload audio file");
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error("Please upload an audio file");
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSyllable.trim()) {
      e.preventDefault();
      appendSyllable(currentSyllable.trim());
      setCurrentSyllable("");
    }
  };

  const handleFormSubmit = async (data: WordFormValues) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Word updated successfully" : "Word created successfully");
    } catch (error) {
      toast.error("An error occurred while saving the word");
      console.error("Word submission error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit Word Entry" : "Create New Word Entry"}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="publish-status"
              checked={watch("metadata.is_published")}
              onCheckedChange={(val) => setValue("metadata.is_published", val)}
            />
            <Label htmlFor="publish-status">
              {watch("metadata.is_published") ? (
                <Badge variant="default" className="bg-green-500">Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </Label>
          </div>
          <Button
            size="lg"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (initialData ? "Update Word" : "Create Word")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="linguistics">Linguistics</TabsTrigger>
          <TabsTrigger value="semantics">Semantics</TabsTrigger>
          <TabsTrigger value="usage">Usage & Culture</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Word Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="word">
                    Word <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="word"
                    {...register("word")}
                    placeholder="Enter the word in native script"
                  />
                  {errors.word && (
                    <p className="text-red-500 text-sm">{errors.word.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languageCode">
                    Language
                  </Label>
                  <Input
                    id="languageCode"
                    value={dictionaryConfig.language_code}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Lemma Information</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-lemma"
                      checked={watch("lemma.is_lemma")}
                      onCheckedChange={(val) => setValue("lemma.is_lemma", val)}
                    />
                    <Label htmlFor="is-lemma">Is this a lemma (base form)?</Label>
                  </div>
                  {!watch("lemma.is_lemma") && (
                    <div className="flex-1">
                      <Input
                        {...register("lemma.lemma_word")}
                        placeholder="Enter the lemma/base form of this word"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>
                  {dictionaryConfig.ui_labels.translation.native} / {dictionaryConfig.ui_labels.translation.bilingual}
                  <span className="text-red-500">*</span>
                </Label>
                {translationFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      {...register(`translations.content.${index}` as const)}
                      placeholder="Enter translation"
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTranslation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendTranslation("")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translation
                </Button>
                {errors.translations?.content && (
                  <p className="text-red-500 text-sm">{errors.translations.content.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>
                  {dictionaryConfig.ui_labels.etymology.native} / {dictionaryConfig.ui_labels.etymology.bilingual}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Native Etymology</Label>
                    <Textarea
                      {...register("etymology.content.native")}
                      placeholder="Enter etymology in native language"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bilingual Etymology</Label>
                    <Textarea
                      {...register("etymology.content.bilingual")}
                      placeholder="Enter etymology in English"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linguistics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phonology & Pronunciation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Pronunciation Audio</Label>
                  <div className="flex items-center gap-4">
                    {watch("phonology.pronunciation_url") ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Play Pronunciation
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setValue("phonology.pronunciation_url", "")}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="audio-upload"
                          className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-secondary"
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Audio"}
                        </Label>
                        <input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        {audioFile && (
                          <span className="text-sm text-muted-foreground">
                            {audioFile.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Syllables</Label>
                  <div className="flex flex-wrap gap-2">
                    {watch("phonology.syllables")?.map((syllable, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-2">
                        <span>{syllable}</span>
                        <button
                          type="button"
                          onClick={() => removeSyllable(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentSyllable}
                      onChange={(e) => setCurrentSyllable(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type syllable and press Enter"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (currentSyllable.trim()) {
                          appendSyllable(currentSyllable.trim());
                          setCurrentSyllable("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Morphology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {watch("morphology").map((morph, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{morph.part} ({dictionaryConfig.language_config.morphology.bilingual[index]})</Label>
                      <Input
                        {...register(`morphology.${index}.content` as const)}
                        placeholder={`Enter ${morph.part}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grammar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Part of Speech</Label>
                    <Select
                      value={watch("grammar.pos")}
                      onValueChange={(value) => setValue("grammar.pos", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select part of speech" />
                      </SelectTrigger>
                      <SelectContent>
                        {dictionaryConfig.language_config.grammar.pos.native.map((pos, index) => (
                          <SelectItem key={pos} value={pos}>
                            {pos} ({dictionaryConfig.language_config.grammar.pos.bilingual[index]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number</Label>
                    <Select
                      value={watch("grammar.inflection.number")}
                      onValueChange={(value) => setValue("grammar.inflection.number", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        {dictionaryConfig.language_config.grammar.inflection.number.native.map((num, index) => (
                          <SelectItem key={num} value={num}>
                            {num} ({dictionaryConfig.language_config.grammar.inflection.number.bilingual[index]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {dictionaryConfig.language_config.grammar.inflection.tense.native.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tense</Label>
                      <Select
                        value={watch("grammar.inflection.tense")}
                        onValueChange={(value) => setValue("grammar.inflection.tense", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tense" />
                        </SelectTrigger>
                        <SelectContent>
                          {dictionaryConfig.language_config.grammar.inflection.tense.native.map((tense, index) => (
                            <SelectItem key={tense} value={tense}>
                              {tense} ({dictionaryConfig.language_config.grammar.inflection.tense.bilingual[index]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {watch("grammar.inflection.number") === dictionaryConfig.language_config.grammar.inflection.number.native[0] && (
                  <div className="space-y-4 border p-4 rounded-lg">
                    <Label>Plural Form</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Plural Word</Label>
                        <Input
                          {...register("grammar.inflection.plural_form.word")}
                          placeholder="Enter plural form of the word"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Example Sentences</Label>
                        {pluralExampleFields.map((field, index) => (
                          <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Native Example</Label>
                                <Textarea
                                  {...register(`grammar.inflection.plural_form.example_sentences.${index}.pair.native` as const)}
                                  placeholder="Example sentence in native language"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bilingual Example</Label>
                                <Textarea
                                  {...register(`grammar.inflection.plural_form.example_sentences.${index}.pair.bilingual` as const)}
                                  placeholder="Example sentence in English"
                                  rows={2}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Context</Label>
                              <Select
                                value={watch(`grammar.inflection.plural_form.example_sentences.${index}.pair.context`)}
                                onValueChange={(value) => setValue(`grammar.inflection.plural_form.example_sentences.${index}.pair.context`, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select context" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dictionaryConfig.language_config.grammar.general.context.map(context => (
                                    <SelectItem key={context} value={context}>
                                      {context}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePluralExample(index)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Example Pair
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendPluralExample({
                            pair: {
                              native: "",
                              bilingual: "",
                              context: dictionaryConfig.language_config.grammar.general.context[0],
                              created_by: { name: "", role: "admin" }
                            }
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Example Pair
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {dictionaryConfig.language_config.other_properties.length > 0 && (
                  <div className="space-y-4">
                    <Label>Other Properties</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watch("other_properties")?.map((prop, index) => (
                        <div key={index} className="space-y-2">
                          <Label>{prop.label} ({dictionaryConfig.language_config.other_properties[index].title.bilingual})</Label>
                          <Select
                            value={prop.value}
                            onValueChange={(value) => {
                              const newProps = [...watch("other_properties")!];
                              newProps[index].value = value;
                              setValue("other_properties", newProps);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${prop.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {dictionaryConfig.language_config.other_properties[index].options.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="semantics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.definition.native} / {dictionaryConfig.ui_labels.definition.bilingual}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Native Definitions</Label>
                    {definitionNativeFields.map((field, index) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Textarea
                            {...register(`semantics.definitions.content.native.${index}` as const)}
                            placeholder="Enter definition in native language"
                            rows={2}
                            className="flex-1"
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDefinitionNative(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendDefinitionNative("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Native Definition
                    </Button>
                    {errors.semantics?.definitions?.content?.native && (
                      <p className="text-red-500 text-sm">{errors.semantics.definitions.content.native.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Bilingual Definitions</Label>
                    {definitionBilingualFields.map((field, index) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Textarea
                            {...register(`semantics.definitions.content.bilingual.${index}` as const)}
                            placeholder="Enter definition in English"
                            rows={2}
                            className="flex-1"
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDefinitionBilingual(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendDefinitionBilingual("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bilingual Definition
                    </Button>
                    {errors.semantics?.definitions?.content?.bilingual && (
                      <p className="text-red-500 text-sm">{errors.semantics.definitions.content.bilingual.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.synonym.native} / {dictionaryConfig.ui_labels.synonym.bilingual}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Native Synonyms</Label>
                    {synonymNativeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`semantics.synonyms.content.native.${index}` as const)}
                          placeholder="Enter synonym in native language"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSynonymNative(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendSynonymNative("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Native Synonym
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Bilingual Synonyms</Label>
                    {synonymBilingualFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`semantics.synonyms.content.bilingual.${index}` as const)}
                          placeholder="Enter synonym in English"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSynonymBilingual(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendSynonymBilingual("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bilingual Synonym
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.antonym.native} / {dictionaryConfig.ui_labels.antonym.bilingual}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Native Antonyms</Label>
                    {antonymNativeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`semantics.antonyms.content.native.${index}` as const)}
                          placeholder="Enter antonym in native language"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAntonymNative(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendAntonymNative("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Native Antonym
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Bilingual Antonyms</Label>
                    {antonymBilingualFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`semantics.antonyms.content.bilingual.${index}` as const)}
                          placeholder="Enter antonym in English"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAntonymBilingual(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendAntonymBilingual("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bilingual Antonym
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.usage.native} / {dictionaryConfig.ui_labels.usage.bilingual}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Example Sentences</Label>
                  {usageFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Native Example</Label>
                          <Textarea
                            {...register(`usage.content.sentences.${index}.pair.native` as const)}
                            placeholder="Example sentence in native language"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bilingual Example</Label>
                          <Textarea
                            {...register(`usage.content.sentences.${index}.pair.bilingual` as const)}
                            placeholder="Example sentence in English"
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Context</Label>
                        <Select
                          value={watch(`usage.content.sentences.${index}.pair.context`)}
                          onValueChange={(value) => setValue(`usage.content.sentences.${index}.pair.context`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select context" />
                          </SelectTrigger>
                          <SelectContent>
                            {dictionaryConfig.language_config.grammar.general.context.map(context => (
                              <SelectItem key={context} value={context}>
                                {context}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUsage(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Example Pair
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendUsage({
                      pair: {
                        native: "",
                        bilingual: "",
                        context: dictionaryConfig.language_config.grammar.general.context[0],
                        created_by: { name: "", role: "admin" }
                      }
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Example Pair
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.collocation.native} / {dictionaryConfig.ui_labels.collocation.bilingual}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Native Collocations</Label>
                    {collocationNativeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`collocations.content.native.${index}` as const)}
                          placeholder="Enter collocation in native language"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCollocationNative(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendCollocationNative("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Native Collocation
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Bilingual Collocations</Label>
                    {collocationBilingualFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`collocations.content.bilingual.${index}` as const)}
                          placeholder="Enter collocation in English"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCollocationBilingual(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendCollocationBilingual("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bilingual Collocation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionaryConfig.ui_labels.cultural_notes.native} / {dictionaryConfig.ui_labels.cultural_notes.bilingual}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Native Cultural Notes</Label>
                    <Textarea
                      {...register("cultural_notes.content.native")}
                      placeholder="Enter cultural notes in native language"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bilingual Cultural Notes</Label>
                    <Textarea
                      {...register("cultural_notes.content.bilingual")}
                      placeholder="Enter cultural notes in English"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WordForm;