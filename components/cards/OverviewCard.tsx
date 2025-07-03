import { cn } from "@/lib/utils"

function OverviewCard({
  icon,
  title,
  details,
  className
}: {
  icon: React.ReactNode,
  title: string,
  details: string,
  className?: string
}) {
  return (
    <article className={cn(
      "flex flex-col justify-between gap-y-4 p-6 rounded-xl border bg-card text-card-foreground transition-all hover:shadow-sm",
      className
    )}>
      <div className="text-2xl text-primary">
        {icon}
      </div>
      <div className='space-y-1'>
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <p className="text-2xl font-semibold">
          {details}
        </p>
      </div>
    </article>
  )
}

export default OverviewCard