import { BookMarked, MoreVertical, Edit, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DictionaryCardProps {
  title: string
  language: string
  wordCount: number
  lastUpdated: string
  isPublic?: boolean
}

export function DictionaryCard({
  title,
  language,
  wordCount,
  lastUpdated,
  isPublic = false
}: DictionaryCardProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{language}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {wordCount.toLocaleString()} words
            </p>
            <p className="text-xs text-muted-foreground">
              Updated {lastUpdated}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
      
      <div className="border-t px-4 py-2 bg-gray-50 flex justify-end gap-2">
        <Button variant="outline" size="sm">
          View Words
        </Button>
        <Button size="sm">
          Add Words
        </Button>
      </div>
    </div>
  )
}