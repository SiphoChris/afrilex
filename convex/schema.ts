import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    // Auth fields from Convex
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // Custom fields
    surname: v.string(),
    country: v.string(),
    role: v.union(
      v.literal("super-admin"),
      v.literal("admin"),
      v.literal("public"),
    ),
    language: v.string(),
    privileges: v.optional(
      v.object({
        create: v.boolean(),
        delete: v.boolean(),
        view: v.boolean(),
        edit: v.boolean(),
      }),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("authorize"),
      v.literal("unauthorize"),
    ),
    last_active_at: v.number(),
    created_at: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Dictionaries
  dictionaries: defineTable({
    language_code: v.string(),
    dictionary_name: v.object({
      native: v.string(),
      bilingual: v.string(),
    }),
    word_count: v.number(),
    ui_labels: v.object({
      translation: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      etymology: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      synonym: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      antonym: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      definition: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      usage: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      collocation: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
      cultural_notes: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
    }),
    language_config: v.object({
      grammar: v.object({
        pos: v.object({
          native: v.array(v.string()),
          bilingual: v.array(v.string()),
        }),
        inflection: v.object({
          tense: v.object({
            native: v.array(v.string()),
            bilingual: v.array(v.string()),
          }),
          number: v.object({
            native: v.array(v.string()),
            bilingual: v.array(v.string()),
          }),
        }),
        general: v.object({
          register: v.array(v.string()),
          context: v.array(v.string()),
          relationship: v.object({
            native: v.array(v.string()),
            bilingual: v.array(v.string()),
          }),
        }),
      }),
      morphology: v.object({
        native: v.array(v.string()),
        bilingual: v.array(v.string()),
      }),
      other_properties: v.array(
        v.object({
          title: v.object({
            native: v.string(),
            bilingual: v.string(),
          }),
          options: v.array(v.string()),
        }),
      ),
    }),
    metadata: v.object({
      is_published: v.boolean(),
      created_by: v.id("users"),
      created_at: v.number(),
      updated_at: v.number(),
    }),
  })
    .index("by_language", ["language_code"])
    .index("by_creator", ["metadata.created_by"]),

  // Words
  words: defineTable({
    word: v.string(),
    language_code: v.string(),
    translations: v.object({
      label: v.string(),
      content: v.array(v.string()),
    }),
    lemma: v.object({
      is_lemma: v.boolean(),
      lemma_word: v.optional(v.string()),
    }),
    etymology: v.object({
      label: v.string(),
      content: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
    }),
    morphology: v.array(
      v.object({
        label: v.string(),
        content: v.string(),
      }),
    ),
    phonology: v.object({
      pronunciation_url: v.optional(v.string()),
      syllables: v.array(v.string()),
    }),
    grammar: v.object({
      pos: v.string(),
      inflection: v.object({
        tense: v.string(),
        number: v.string(),
        plural_form: v.optional(
          v.object({
            word: v.string(),
            example_sentences: v.object({
              native: v.array(v.string()),
              bilingual: v.array(v.string()),
            }),
          }),
        ),
      }),
      other_properties: v.optional(v.any()),
    }),
    semantics: v.object({
      definitions: v.object({
        label: v.string(),
        content: v.object({
          native: v.array(v.string()),
          bilingual: v.array(v.string()),
        }),
      }),
      antonyms: v.object({
        label: v.string(),
        content: v.object({
          native: v.array(v.string()),
          bilingual: v.array(v.string()),
        }),
      }),
      synonyms: v.object({
        label: v.string(),
        content: v.object({
          native: v.array(v.string()),
          bilingual: v.array(v.string()),
        }),
      }),
    }),
    usage: v.object({
      label: v.string(),
      content: v.object({
        sentences: v.object({
          native: v.array(
            v.object({
              sentence: v.string(),
              context: v.string(),
              created_by: v.object({
                name: v.string(),
                role: v.string(),
              }),
            }),
          ),
          bilingual: v.array(
            v.object({
              sentence: v.string(),
              context: v.string(),
              created_by: v.object({
                name: v.string(),
                role: v.string(),
              }),
            }),
          ),
        }),
        register: v.string(),
      }),
    }),
    collocations: v.object({
      label: v.string(),
      content: v.object({
        native: v.array(v.string()),
        bilingual: v.array(v.string()),
      }),
    }),
    cultural_notes: v.object({
      label: v.string(),
      content: v.object({
        native: v.string(),
        bilingual: v.string(),
      }),
    }),
    other_properties: v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      }),
    ),
    word_formation: v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      }),
    ),
    metadata: v.object({
      status: v.union(v.literal("complete"), v.literal("incomplete")),
      is_published: v.boolean(),
      created_by: v.id("users"),
      created_at: v.number(),
      updated_at: v.number(),
    }),
  })
    .index("by_word_text", ["word"])
    .index("by_language_word", ["language_code", "word"])
    .index("by_creator", ["metadata.created_by"])
    .index("by_published", ["metadata.is_published"]),

  // Contributions
  contributions: defineTable({
    word_id: v.union(v.id("words"), v.null()),
    word: v.string(),
    language_code: v.string(),
    content: v.string(),
    type: v.union(v.literal("new_word")),
    verified: v.boolean(),
    verified_by: v.optional(v.id("users")),
    verified_at: v.optional(v.number()),
    contributed_by: v.union(v.id("users"), v.string()), // Can be user ID or IP for anonymous
    created_at: v.number(),
  })
    .index("by_word", ["word_id"])
    .index("by_status", ["verified"])
    .index("by_language", ["language_code"]),

  // Audit logs
  audit_logs: defineTable({
    action: v.string(),
    entity_type: v.string(),
    entity_id: v.string(),
    performed_by: v.id("users"),
    performed_at: v.number(),
    previous_value: v.optional(v.any()),
    new_value: v.optional(v.any()),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  })
    .index("by_entity", ["entity_type", "entity_id"])
    .index("by_user", ["performed_by"])
    .index("by_time", ["performed_at"]),
});
