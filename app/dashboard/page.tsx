"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserMenu } from "@/components/auth/user-menu"
import { SiteCard } from "@/components/dashboard/site-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Globe, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { storage } from "@/lib/storage"

export default function DashboardPage() {
  const { user, sites, setSites } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState<string>("all")

  useEffect(() => {
    const loadSites = async () => {
      if (user) {
        try {
          const userSites = await storage.getSites(user.id)
          setSites(userSites)
        } catch (error) {
          console.error("Failed to load sites:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadSites()
  }, [user, setSites])

  // Filter sites based on search and industry
  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === "all" || site.industry === industryFilter
    return matchesSearch && matchesIndustry
  })

  // Get unique industries for filter
  const industries = Array.from(new Set(sites.map((site) => site.industry)))

  const handleDeleteSite = async (siteId: string) => {
    try {
      await storage.deleteSite(siteId)
      const updatedSites = sites.filter((site) => site.id !== siteId)
      setSites(updatedSites)
    } catch (error) {
      console.error("Failed to delete site:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                Developlogy
              </Link>
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your websites...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              Developlogy
            </Link>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Websites</h1>
              <p className="text-muted-foreground">
                {sites.length === 0
                  ? "Create your first website"
                  : `Manage your ${sites.length} website${sites.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <Button asChild size="lg" className="shrink-0">
              <Link href="/onboarding">
                <Plus className="w-4 h-4 mr-2" />
                Create Website
              </Link>
            </Button>
          </div>

          {/* Search and Filters */}
          {sites.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sites Grid */}
          {sites.length === 0 ? (
            <EmptyState />
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No websites found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setIndustryFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Site Card */}
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <Link href="/onboarding">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[280px] group-hover:bg-muted/30 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Create New Website</h3>
                    <p className="text-sm text-muted-foreground">Start building your professional website in minutes</p>
                  </CardContent>
                </Link>
              </Card>

              {/* Existing Sites */}
              {filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} onDelete={handleDeleteSite} />
              ))}
            </div>
          )}

          {/* Stats Section */}
          {sites.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{sites.length}</div>
                      <div className="text-sm text-muted-foreground">Total Websites</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Filter className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{industries.length}</div>
                      <div className="text-sm text-muted-foreground">Industries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {
                          sites.filter((site) => {
                            const daysSinceCreated = Math.floor(
                              (Date.now() - new Date(site.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                            )
                            return daysSinceCreated <= 7
                          }).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Created This Week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
