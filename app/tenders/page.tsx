"use client"

import { useState } from "react"
import useSWR from "swr"
import type { Tender } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Eye, Check, X, Download, FileText, Upload } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    tenderNumber: "",
    title: "",
    department: "",
    closingDate: "",
    description: "",
    value: "",
  })

  const { data: tenders, error, isLoading, mutate } = useSWR<Tender[]>("/api/tenders", fetcher)

  const filteredTenders = tenders?.filter((tender) => {
    const matchesSearch =
      searchQuery === "" ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tender_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.issuing_department.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return `R ${(amount / 1000000).toFixed(1)}M`
  }

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const handleUpload = () => {
    console.log("[v0] Uploading tender:", uploadData)
    // In production, this would POST to an API endpoint
    setIsUploadOpen(false)
    setUploadData({
      tenderNumber: "",
      title: "",
      department: "",
      closingDate: "",
      description: "",
      value: "",
    })
    // Refresh the tender list
    mutate()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">Tender Inbox</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">New tender opportunities awaiting qualification</p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="mr-2 h-4 w-4" />
                Upload Tender
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload New Tender</DialogTitle>
                <DialogDescription>Add a tender opportunity manually to the inbox</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenderNumber">Tender Number</Label>
                    <Input
                      id="tenderNumber"
                      placeholder="e.g., DPWI-2024-001"
                      value={uploadData.tenderNumber}
                      onChange={(e) => setUploadData({ ...uploadData, tenderNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Estimated Value (R)</Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder="e.g., 8500000"
                      value={uploadData.value}
                      onChange={(e) => setUploadData({ ...uploadData, value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Tender Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter tender title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Issuing Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Department of Public Works"
                    value={uploadData.department}
                    onChange={(e) => setUploadData({ ...uploadData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={uploadData.closingDate}
                    onChange={(e) => setUploadData({ ...uploadData, closingDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter tender description"
                    rows={4}
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!uploadData.title || !uploadData.tenderNumber}
                  className="bg-primary"
                >
                  Upload Tender
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <span>Filters</span>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="IT Consultancy">IT Consultancy</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Min Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence Levels</SelectItem>
                <SelectItem value="high">High (8+)</SelectItem>
                <SelectItem value="medium">Medium (5-7)</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deadlines</SelectItem>
                <SelectItem value="urgent">Urgent (7 days)</SelectItem>
                <SelectItem value="soon">Soon (30 days)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => mutate()} disabled={isLoading} className="md:w-auto">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {filteredTenders && filteredTenders.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tender Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Value & Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Documents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Match Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTenders.map((tender) => {
                  const days = getDaysUntilClosing(tender.closing_date)
                  const matchScore = Math.floor(Math.random() * 3) + 8 // Mock score 8-10

                  return (
                    <tr key={tender.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {tender.tender_number}
                        </Badge>
                        <div className="mt-1.5">
                          <a
                            href={tender.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            etenders.gov.za-representative
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-md">
                          <p className="font-medium text-foreground text-balance">{tender.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{tender.issuing_department}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-xs">
                              {tender.category || "Technology"}
                            </Badge>
                            <Badge variant="destructive" className="text-xs">
                              High Priority
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">
                          {tender.value_estimate ? formatCurrency(tender.value_estimate) : "R 25,000,000"}
                        </p>
                        <p className="text-sm text-muted-foreground">{tender.location}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">3 document(s)</p>
                          <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Download className="h-3 w-3" />
                            Technical Spec...
                          </a>
                          <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Download className="h-3 w-3" />
                            Bid Document.do...
                          </a>
                          <button className="text-xs text-muted-foreground hover:text-foreground">+1 more</button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-green-500" style={{ width: `${(matchScore / 10) * 100}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{matchScore}/10</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(tender.closing_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-green-600">• {days} days</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/tenders/${tender.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
