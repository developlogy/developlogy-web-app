import { ThemeSelector } from "@/components/ui/theme-selector"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="font-bold">Dashboard</h1>
        <ThemeSelector />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
