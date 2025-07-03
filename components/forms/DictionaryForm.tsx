'use client'


import { useState } from "react";
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
import { Plus, Trash2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LANGUAGES,
  DEFAULT_UI_LABELS,
  GRAMMAR_CATEGORIES,
  MORPHOLOGY_PARTS,
  DEFAULT_OTHER_PROPERTIES
} from "@/lib/constants";
import { toast } from "sonner";

const dictionarySchema = z.object({
  language_code: z.string().min(1, "Language is required"),
  dictionary_name: z.object({
    native: z.string().min(1, "Native name is required"),
    bilingual: z.string().min(1, "Bilingual name is required")
  }),
  description: z.string().optional(),
  ui_labels: z.object({
    translation: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    etymology: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    synonym: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    antonym: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    definition: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    usage: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    collocation: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    }),
    cultural_notes: z.object({
      native: z.string().min(1),
      bilingual: z.string().min(1)
    })
  }),
  language_config: z.object({
    grammar: z.object({
      pos: z.object({
        native: z.array(z.string()),
        bilingual: z.array(z.string())
      }),
      inflection: z.object({
        tense: z.object({
          native: z.array(z.string()),
          bilingual: z.array(z.string())
        }),
        number: z.object({
          native: z.array(z.string()),
          bilingual: z.array(z.string())
        })
      }),
      general: z.object({
        register: z.array(z.string()),
        context: z.array(z.string()),
        relationship: z.object({
          native: z.array(z.string()),
          bilingual: z.array(z.string())
        })
      })
    }),
    morphology: z.object({
      native: z.array(z.string()),
      bilingual: z.array(z.string())
    }),
    other_properties: z.array(z.object({
      title: z.object({
        native: z.string(),
        bilingual: z.string()
      }),
      options: z.array(z.string())
    }))
  }),
  metadata: z.object({
    is_published: z.boolean(),
    allow_contributions: z.boolean(),
    enable_discussions: z.boolean(),
    show_etymology: z.boolean()
  })
});

type DictionaryFormValues = z.infer<typeof dictionarySchema>;

interface DictionaryFormProps {
  initialData?: Partial<DictionaryFormValues>;
  onSubmit: (data: DictionaryFormValues) => Promise<void>;
  isLoading?: boolean;
}

function DictionaryForm({ initialData, onSubmit, isLoading = false }: DictionaryFormProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");

  // State with explicit types
  const [newPos, setNewPos] = useState<{ native: string; bilingual: string }>({ 
    native: "", 
    bilingual: "" 
  });
  const [newTense, setNewTense] = useState<{ native: string; bilingual: string }>({ 
    native: "", 
    bilingual: "" 
  });
  const [newNumber, setNewNumber] = useState<{ native: string; bilingual: string }>({ 
    native: "", 
    bilingual: "" 
  });
  const [newMorphology, setNewMorphology] = useState<{ native: string; bilingual: string }>({ 
    native: "", 
    bilingual: "" 
  });
  const [newRegister, setNewRegister] = useState<string>("");
  const [newContext, setNewContext] = useState<string>("");
  const [newRelationship, setNewRelationship] = useState<{ native: string; bilingual: string }>({ 
    native: "", 
    bilingual: "" 
  });
  const [newOtherProperty, setNewOtherProperty] = useState<{
    title: { native: string; bilingual: string };
    options: string;
  }>({
    title: { native: "", bilingual: "" },
    options: ""
  });

  const defaultValues: DictionaryFormValues = {
    language_code: "",
    dictionary_name: {
      native: "",
      bilingual: ""
    },
    description: "",
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
    },
    metadata: {
      is_published: false,
      allow_contributions: false,
      enable_discussions: false,
      show_etymology: true
    }
  };

  const form = useForm<DictionaryFormValues>({
    resolver: zodResolver(dictionarySchema),
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

  // Field arrays with proper typing
  const { fields: posNativeFields, append: appendPosNative, remove: removePosNative } = useFieldArray({
    control,
    name: "language_config.grammar.pos.native" as const
  });

  const { fields: posBilingualFields, append: appendPosBilingual, remove: removePosBilingual } = useFieldArray({
    control,
    name: "language_config.grammar.pos.bilingual" as const
  });

  const { fields: tenseNativeFields, append: appendTenseNative, remove: removeTenseNative } = useFieldArray({
    control,
    name: "language_config.grammar.inflection.tense.native" as const
  });

  const { fields: tenseBilingualFields, append: appendTenseBilingual, remove: removeTenseBilingual } = useFieldArray({
    control,
    name: "language_config.grammar.inflection.tense.bilingual" as const
  });

  const { fields: numberNativeFields, append: appendNumberNative, remove: removeNumberNative } = useFieldArray({
    control,
    name: "language_config.grammar.inflection.number.native" as const
  });

  const { fields: numberBilingualFields, append: appendNumberBilingual, remove: removeNumberBilingual } = useFieldArray({
    control,
    name: "language_config.grammar.inflection.number.bilingual" as const
  });

  const { fields: morphologyNativeFields, append: appendMorphologyNative, remove: removeMorphologyNative } = useFieldArray({
    control,
    name: "language_config.morphology.native" as const
  });

  const { fields: morphologyBilingualFields, append: appendMorphologyBilingual, remove: removeMorphologyBilingual } = useFieldArray({
    control,
    name: "language_config.morphology.bilingual" as const
  });

  const { fields: registerFields, append: appendRegister, remove: removeRegister } = useFieldArray({
    control,
    name: "language_config.grammar.general.register" as const
  });

  const { fields: contextFields, append: appendContext, remove: removeContext } = useFieldArray({
    control,
    name: "language_config.grammar.general.context" as const
  });

  const { fields: relationshipNativeFields, append: appendRelationshipNative, remove: removeRelationshipNative } = useFieldArray({
    control,
    name: "language_config.grammar.general.relationship.native" as const
  });

  const { fields: relationshipBilingualFields, append: appendRelationshipBilingual, remove: removeRelationshipBilingual } = useFieldArray({
    control,
    name: "language_config.grammar.general.relationship.bilingual" as const
  });

  const { fields: otherPropertiesFields, append: appendOtherProperty, remove: removeOtherProperty } = useFieldArray({
    control,
    name: "language_config.other_properties" as const
  });

  // Helper functions with explicit return types
  const addPosOption = (): void => {
    if (newPos.native.trim() && newPos.bilingual.trim()) {
      appendPosNative(newPos.native.trim());
      appendPosBilingual(newPos.bilingual.trim());
      setNewPos({ native: "", bilingual: "" });
      toast.success("Part of speech added successfully");
    } else {
      toast.error("Please fill in both native and bilingual labels");
    }
  };

  const addTenseOption = (): void => {
    if (newTense.native.trim() && newTense.bilingual.trim()) {
      appendTenseNative(newTense.native.trim());
      appendTenseBilingual(newTense.bilingual.trim());
      setNewTense({ native: "", bilingual: "" });
      toast.success("Tense added successfully");
    } else {
      toast.error("Please fill in both native and bilingual labels");
    }
  };

  const addNumberOption = (): void => {
    if (newNumber.native.trim() && newNumber.bilingual.trim()) {
      appendNumberNative(newNumber.native.trim());
      appendNumberBilingual(newNumber.bilingual.trim());
      setNewNumber({ native: "", bilingual: "" });
      toast.success("Number option added successfully");
    } else {
      toast.error("Please fill in both native and bilingual labels");
    }
  };

  const addMorphologyOption = (): void => {
    if (newMorphology.native.trim() && newMorphology.bilingual.trim()) {
      appendMorphologyNative(newMorphology.native.trim());
      appendMorphologyBilingual(newMorphology.bilingual.trim());
      setNewMorphology({ native: "", bilingual: "" });
      toast.success("Morphology part added successfully");
    } else {
      toast.error("Please fill in both native and bilingual labels");
    }
  };

  const addRegisterOption = (): void => {
    if (newRegister.trim()) {
      appendRegister(newRegister.trim());
      setNewRegister("");
      toast.success("Register option added successfully");
    } else {
      toast.error("Please enter a register option");
    }
  };

  const addContextOption = (): void => {
    if (newContext.trim()) {
      appendContext(newContext.trim());
      setNewContext("");
      toast.success("Context option added successfully");
    } else {
      toast.error("Please enter a context option");
    }
  };

  const addRelationshipOption = (): void => {
    if (newRelationship.native.trim() && newRelationship.bilingual.trim()) {
      appendRelationshipNative(newRelationship.native.trim());
      appendRelationshipBilingual(newRelationship.bilingual.trim());
      setNewRelationship({ native: "", bilingual: "" });
      toast.success("Relationship option added successfully");
    } else {
      toast.error("Please fill in both native and bilingual labels");
    }
  };

  const addOtherProperty = (): void => {
    if (newOtherProperty.title.native.trim() &&
        newOtherProperty.title.bilingual.trim() &&
        newOtherProperty.options.trim()) {
      const options = newOtherProperty.options.split(',').map(opt => opt.trim()).filter(Boolean);
      appendOtherProperty({
        title: {
          native: newOtherProperty.title.native.trim(),
          bilingual: newOtherProperty.title.bilingual.trim()
        },
        options
      });
      setNewOtherProperty({
        title: { native: "", bilingual: "" },
        options: ""
      });
      toast.success("Other property added successfully");
    } else {
      toast.error("Please fill in all fields for the other property");
    }
  };

  // Remove functions with explicit types
  const removePosOption = (index: number): void => {
    removePosNative(index);
    removePosBilingual(index);
  };

  const removeTenseOption = (index: number): void => {
    removeTenseNative(index);
    removeTenseBilingual(index);
  };

  const removeNumberOption = (index: number): void => {
    removeNumberNative(index);
    removeNumberBilingual(index);
  };

  const removeMorphologyOption = (index: number): void => {
    removeMorphologyNative(index);
    removeMorphologyBilingual(index);
  };

  const removeRelationshipOption = (index: number): void => {
    removeRelationshipNative(index);
    removeRelationshipBilingual(index);
  };

  const handleFormSubmit = async (data: DictionaryFormValues): Promise<void> => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Dictionary updated successfully" : "Dictionary created successfully");
    } catch (error) {
      toast.error("An error occurred while saving the dictionary");
      console.error("Dictionary submission error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit Dictionary" : "Create New Dictionary"}
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
            {isLoading ? "Saving..." : (initialData ? "Update Dictionary" : "Create Dictionary")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="labels">UI Labels</TabsTrigger>
          <TabsTrigger value="grammar">Grammar Config</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Dictionary Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="languageCode">
                    Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("language_code")}
                    onValueChange={(value) => setValue("language_code", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language_code && (
                    <p className="text-red-500 text-sm">{errors.language_code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nativeName">
                    Native Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nativeName"
                    {...register("dictionary_name.native")}
                    placeholder="Name in the dictionary's language"
                  />
                  {errors.dictionary_name?.native && (
                    <p className="text-red-500 text-sm">{errors.dictionary_name.native.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bilingualName">
                    Bilingual Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bilingualName"
                    {...register("dictionary_name.bilingual")}
                    placeholder="Name in English"
                  />
                  {errors.dictionary_name?.bilingual && (
                    <p className="text-red-500 text-sm">{errors.dictionary_name.bilingual.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Brief description of this dictionary"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labels">
          <Card>
            <CardHeader>
              <CardTitle>Customize UI Labels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(DEFAULT_UI_LABELS).map(([section, labels]) => (
                  <div key={section} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium capitalize">
                      {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor={`${section}-native`}>
                        Native Label
                      </Label>
                      <Input
                        id={`${section}-native`}
                        {...register(`ui_labels.${section}.native` as const)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${section}-bilingual`}>
                        Bilingual Label
                      </Label>
                      <Input
                        id={`${section}-bilingual`}
                        {...register(`ui_labels.${section}.bilingual` as const)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grammar">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parts of Speech</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Parts of Speech</Label>
                  <div className="flex flex-wrap gap-2">
                    {posNativeFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.pos.native.${index}`)}</span>
                        <span className="text-muted-foreground">
                          ({watch(`language_config.grammar.pos.bilingual.${index}`)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removePosOption(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Native Label</Label>
                    <Input
                      value={newPos.native}
                      onChange={(e) => setNewPos({ ...newPos, native: e.target.value })}
                      placeholder="Native label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Add Bilingual Label</Label>
                    <Input
                      value={newPos.bilingual}
                      onChange={(e) => setNewPos({ ...newPos, bilingual: e.target.value })}
                      placeholder="English label"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPosOption}
                  disabled={!newPos.native.trim() || !newPos.bilingual.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part of Speech
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Tenses</Label>
                  <div className="flex flex-wrap gap-2">
                    {tenseNativeFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.inflection.tense.native.${index}`)}</span>
                        <span className="text-muted-foreground">
                          ({watch(`language_config.grammar.inflection.tense.bilingual.${index}`)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTenseOption(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Native Label</Label>
                    <Input
                      value={newTense.native}
                      onChange={(e) => setNewTense({ ...newTense, native: e.target.value })}
                      placeholder="Native label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Add Bilingual Label</Label>
                    <Input
                      value={newTense.bilingual}
                      onChange={(e) => setNewTense({ ...newTense, bilingual: e.target.value })}
                      placeholder="English label"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTenseOption}
                  disabled={!newTense.native.trim() || !newTense.bilingual.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tense
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Number Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Number Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {numberNativeFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.inflection.number.native.${index}`)}</span>
                        <span className="text-muted-foreground">
                          ({watch(`language_config.grammar.inflection.number.bilingual.${index}`)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNumberOption(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Native Label</Label>
                    <Input
                      value={newNumber.native}
                      onChange={(e) => setNewNumber({ ...newNumber, native: e.target.value })}
                      placeholder="Native label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Add Bilingual Label</Label>
                    <Input
                      value={newNumber.bilingual}
                      onChange={(e) => setNewNumber({ ...newNumber, bilingual: e.target.value })}
                      placeholder="English label"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNumberOption}
                  disabled={!newNumber.native.trim() || !newNumber.bilingual.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Number Option
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Morphology Parts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Morphology Parts</Label>
                  <div className="flex flex-wrap gap-2">
                    {morphologyNativeFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.morphology.native.${index}`)}</span>
                        <span className="text-muted-foreground">
                          ({watch(`language_config.morphology.bilingual.${index}`)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMorphologyOption(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Native Label</Label>
                    <Input
                      value={newMorphology.native}
                      onChange={(e) => setNewMorphology({ ...newMorphology, native: e.target.value })}
                      placeholder="Native label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Add Bilingual Label</Label>
                    <Input
                      value={newMorphology.bilingual}
                      onChange={(e) => setNewMorphology({ ...newMorphology, bilingual: e.target.value })}
                      placeholder="English label"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMorphologyOption}
                  disabled={!newMorphology.native.trim() || !newMorphology.bilingual.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Morphology Part
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Register Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {registerFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.general.register.${index}`)}</span>
                        <button
                          type="button"
                          onClick={() => removeRegister(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Add Register Option</Label>
                    <Input
                      value={newRegister}
                      onChange={(e) => setNewRegister(e.target.value)}
                      placeholder="Enter register option"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRegisterOption}
                  disabled={!newRegister.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Register Option
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Context Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Context Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {contextFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.general.context.${index}`)}</span>
                        <button
                          type="button"
                          onClick={() => removeContext(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Add Context Option</Label>
                    <Input
                      value={newContext}
                      onChange={(e) => setNewContext(e.target.value)}
                      placeholder="Enter context option"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addContextOption}
                  disabled={!newContext.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Context Option
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationship Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Relationship Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {relationshipNativeFields.map((field, index) => (
                      <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                        <span>{watch(`language_config.grammar.general.relationship.native.${index}`)}</span>
                        <span className="text-muted-foreground">
                          ({watch(`language_config.grammar.general.relationship.bilingual.${index}`)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRelationshipOption(index)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Native Label</Label>
                    <Input
                      value={newRelationship.native}
                      onChange={(e) => setNewRelationship({ ...newRelationship, native: e.target.value })}
                      placeholder="Native label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Add Bilingual Label</Label>
                    <Input
                      value={newRelationship.bilingual}
                      onChange={(e) => setNewRelationship({ ...newRelationship, bilingual: e.target.value })}
                      placeholder="English label"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRelationshipOption}
                  disabled={!newRelationship.native.trim() || !newRelationship.bilingual.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Relationship Option
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {otherPropertiesFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {watch(`language_config.other_properties.${index}.title.native`)} (
                        {watch(`language_config.other_properties.${index}.title.bilingual`)})
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOtherProperty(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="flex flex-wrap gap-2">
                        {watch(`language_config.other_properties.${index}.options`).map((option, optIndex) => (
                          <Badge key={optIndex} variant="secondary">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-4 border p-4 rounded-lg">
                  <h3 className="font-medium">Add New Property</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Native Title</Label>
                      <Input
                        value={newOtherProperty.title.native}
                        onChange={(e) => setNewOtherProperty({
                          ...newOtherProperty,
                          title: {
                            ...newOtherProperty.title,
                            native: e.target.value
                          }
                        })}
                        placeholder="Native title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bilingual Title</Label>
                      <Input
                        value={newOtherProperty.title.bilingual}
                        onChange={(e) => setNewOtherProperty({
                          ...newOtherProperty,
                          title: {
                            ...newOtherProperty.title,
                            bilingual: e.target.value
                          }
                        })}
                        placeholder="English title"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Options (comma separated)</Label>
                    <Textarea
                      value={newOtherProperty.options}
                      onChange={(e) => setNewOtherProperty({
                        ...newOtherProperty,
                        options: e.target.value
                      })}
                      placeholder="Enter options separated by commas"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOtherProperty}
                    disabled={
                      !newOtherProperty.title.native.trim() ||
                      !newOtherProperty.title.bilingual.trim() ||
                      !newOtherProperty.options.trim()
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dictionary Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow User Contributions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable public users to submit word contributions
                    </p>
                  </div>
                  <Switch
                    id="allow-contributions"
                    checked={watch("metadata.allow_contributions")}
                    onCheckedChange={(val) => setValue("metadata.allow_contributions", val)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Discussions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to discuss word entries
                    </p>
                  </div>
                  <Switch
                    id="enable-discussions"
                    checked={watch("metadata.enable_discussions")}
                    onCheckedChange={(val) => setValue("metadata.enable_discussions", val)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Etymology Section</Label>
                    <p className="text-sm text-muted-foreground">
                      Display etymology information for words
                    </p>
                  </div>
                  <Switch
                    id="show-etymology"
                    checked={watch("metadata.show_etymology")}
                    onCheckedChange={(val) => setValue("metadata.show_etymology", val)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DictionaryForm