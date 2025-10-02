"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, Download, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ETender {
  id: string
  tenderNumber: string
  title: string
  department: string
  closingDate: string
  publishDate: string
  category: string
  province: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tenders, setTenders] = useState<ETender[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [province, setProvince] = useState("all")
  const [category, setCategory] = useState("all")

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      // Fetch from SA Gov eTenders API
      const response = await fetch(
        `/api/etenders/search?query=${searchQuery}&province=${province}&category=${category}`,
      )
      const data = await response.json()
      setTenders(data)
    } catch (error) {
      console.error("[v0] Error fetching tenders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-foreground" />
            <h1 className="text-2xl font-semibold text-foreground">SA Government Tender Search</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Search live tenders from{" "}
            <a
              href="https://www.etenders.gov.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              etenders.gov.za
            </a>
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
            <CardDescription>Find relevant government tenders across South Africa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by keywords, tender number, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className="bg-primary">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Search</span>
                </Button>
              </div>

              <div className="flex gap-3">
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="gauteng">Gauteng</SelectItem>
                    <SelectItem value="western-cape">Western Cape</SelectItem>
                    <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                    <SelectItem value="free-state">Free State</SelectItem>
                    <SelectItem value="limpopo">Limpopo</SelectItem>
                    <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="northern-cape">Northern Cape</SelectItem>
                    <SelectItem value="north-west">North West</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ict">ICT & Technology</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="consulting">Consulting Services</SelectItem>
                    <SelectItem value="supplies">Supplies & Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {tenders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{tenders.length} tenders found</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </div>

            <div className="space-y-3">
              {tenders.map((tender) => {
                const days = getDaysUntilClosing(tender.closingDate)
                return (
                  <Card key={tender.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="mt-1">
                              {tender.tenderNumber}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-balance">{tender.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{tender.department}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {tender.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {tender.province}
                                </Badge>
                                {days <= 7 && (
                                  <Badge variant="destructive" className="text-xs">
                                    Closing Soon
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            Closes: {new Date(tender.closingDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{days} days remaining</p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={`https://www.etenders.gov.za/content/${tender.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View on eTenders
                              </a>
                            </Button>
                            <Button size="sm" className="bg-primary">
                              Import to Inbox
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {!isLoading && tenders.length === 0 && searchQuery && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No tenders found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
