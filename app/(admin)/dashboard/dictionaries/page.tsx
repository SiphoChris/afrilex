import { Button } from "@/components/ui/button"
import { DictionaryCard } from "@/components/cards/DictionaryCard"

export default function DictionariesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dictionaries</h1>
          <p className="text-muted-foreground">
            Manage your language dictionaries
          </p>
        </div>
        <Button>Create New</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dictionariesData.map((dict, index) => (
          <DictionaryCard key={index} {...dict} />
        ))}
      </div>
    </div>
  )
}

const dictionariesData = [
  {
    title: "English Vocabulary",
    language: "English",
    wordCount: 12500,
    lastUpdated: "2 days ago",
    isPublic: true
  },
  {
    title: "French Phrases",
    language: "French",
    wordCount: 8400,
    lastUpdated: "1 week ago"
  },
  {
    title: "Technical Terms",
    language: "English",
    wordCount: 3200,
    lastUpdated: "3 days ago",
    isPublic: true
  },
  {
    title: "Spanish Verbs",
    language: "Spanish",
    wordCount: 1500,
    lastUpdated: "1 month ago"
  },
  {
    title: "Medical Dictionary",
    language: "Latin",
    wordCount: 9800,
    lastUpdated: "2 weeks ago"
  },
  {
    title: "Programming Terms",
    language: "English",
    wordCount: 5200,
    lastUpdated: "5 days ago",
    isPublic: true
  }
]