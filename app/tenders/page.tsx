"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import type { ExternalTender } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Eye, Check, X, FileText, Upload } from "lucide-react"
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
  const [aiFilter, setAiFilter] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    tenderNumber: "",
    title: "",
    department: "",
    closingDate: "",
    description: "",
    value: "",
  })
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const { data: tenders, error, isLoading, mutate } = useSWR<ExternalTender[]>("/api/tenders", fetcher)

  const tendersArray = Array.isArray(tenders) ? tenders : []

  const filteredTenders = tendersArray.filter((tender) => {
    const matchesSearch =
      searchQuery === "" ||
      tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tender_No.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAI =
      aiFilter === "all" ||
      (aiFilter === "relevant" && tender.ai_label === 1) ||
      (aiFilter === "irrelevant" && tender.ai_label === 0)

    return matchesSearch && matchesAI
  })

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const handleUpload = () => {
    console.log("[v0] Uploading tender:", uploadData, "Files:", uploadFiles)
    // In production, this would POST to an API endpoint with FormData
    setIsUploadOpen(false)
    setUploadData({
      tenderNumber: "",
      title: "",
      department: "",
      closingDate: "",
      description: "",
      value: "",
    })
    setUploadFiles([])
    mutate()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files))
    }
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
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredTenders?.length || 0} tender opportunities from eTenders Portal
            </p>
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
                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {uploadFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  )}
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
            <Select value={aiFilter} onValueChange={setAiFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="AI Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenders</SelectItem>
                <SelectItem value="relevant">Relevant Only</SelectItem>
                <SelectItem value="irrelevant">Irrelevant Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Services: Electrical">Services: Electrical</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="IT Consultancy">IT Consultancy</SelectItem>
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

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
            Failed to load tenders. Please try again.
          </div>
        )}

        {filteredTenders && filteredTenders.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tender Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Documents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">AI Relevance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTenders.map((tender) => {
                  const days = getDaysUntilClosing(tender.closing_Date)
                  const isRelevant = tender.ai_label === 1

                  return (
                    <tr key={tender.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {tender.tender_No}
                        </Badge>
                        <div className="mt-1.5">
                          <span className="text-xs text-muted-foreground">etenders.gov.za</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-md">
                          <p className="font-medium text-foreground text-balance line-clamp-2">{tender.description}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{tender.department}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-xs">
                              {tender.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {tender.type}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{tender.province}</p>
                        <p className="text-xs text-muted-foreground">{tender.town}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {tender.supportDocument?.length || 0} document(s)
                          </p>
                          {tender.supportDocument?.slice(0, 2).map((doc) => (
                            <div key={doc.supportDocumentID} className="flex items-center gap-1 text-xs text-blue-600">
                              <FileText className="h-3 w-3" />
                              <span className="truncate max-w-[120px]">{doc.fileName}</span>
                            </div>
                          ))}
                          {tender.supportDocument?.length > 2 && (
                            <button className="text-xs text-muted-foreground hover:text-foreground">
                              +{tender.supportDocument.length - 2} more
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isRelevant ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isRelevant ? "Relevant" : "Irrelevant"}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tender.ai_reasoning}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(tender.closing_Date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className={`text-sm ${days <= 7 ? "text-red-600" : "text-green-600"}`}>• {days} days</p>
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

        {filteredTenders && filteredTenders.length === 0 && !isLoading && (
          <div className="rounded-lg border bg-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No tenders found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}
