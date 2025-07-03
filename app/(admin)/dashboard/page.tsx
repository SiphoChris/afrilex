import OverviewCard from "@/components/cards/OverviewCard"
import { ALargeSmall, BookMarked, Users, FileText, Library, Languages } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewData.map((item, index) => (
          <OverviewCard
            key={index}
            icon={<item.icon className="w-6 h-6" />}
            title={item.title}
            details={item.details}
          />
        ))}
      </div>
    </div>
  )
}

const overviewData = [
  {
    icon: BookMarked,
    title: "Dictionaries",
    details: "12 Dictionaries"
  },
  {
    icon: ALargeSmall,
    title: "Words",
    details: "120 million"
  },
  {
    icon: Users,
    title: "Users",
    details: "1,024 Active"
  },
  {
    icon: FileText,
    title: "Documents",
    details: "256 Processed"
  },
  {
    icon: Library,
    title: "Collections",
    details: "8 Categories"
  },
  {
    icon: Languages,
    title: "Languages",
    details: "12 Supported"
  }
] as const