import SideBar from "@/components/dashboard/layout/SideBar"
import Footer from "@/components/shared/Footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}