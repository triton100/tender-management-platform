"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, Search, Download, Eye, Trash2, Filter, File, FileSpreadsheet, FileImage } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  opportunity: string
  uploadedBy: string
  uploadedAt: string
  category: string
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc1",
    name: "Technical Specification Document.pdf",
    type: "pdf",
    size: "2.4 MB",
    opportunity: "DPWI-2024-001",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-11-28T10:30:00Z",
    category: "Technical",
  },
  {
    id: "doc2",
    name: "BBBEE Certificate.pdf",
    type: "pdf",
    size: "856 KB",
    opportunity: "DPWI-2024-001",
    uploadedBy: "Michael Chen",
    uploadedAt: "2024-11-27T14:20:00Z",
    category: "Compliance",
  },
  {
    id: "doc3",
    name: "Project Timeline.xlsx",
    type: "xlsx",
    size: "124 KB",
    opportunity: "DPWI-2024-001",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-11-26T09:15:00Z",
    category: "Planning",
  },
  {
    id: "doc4",
    name: "Company Profile.pdf",
    type: "pdf",
    size: "3.2 MB",
    opportunity: "All Opportunities",
    uploadedBy: "Linda Mbeki",
    uploadedAt: "2024-11-25T16:45:00Z",
    category: "Company",
  },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredDocuments = MOCK_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.opportunity.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "jpg":
      case "png":
        return <FileImage className="h-8 w-8 text-blue-500" />
      default:
        return <File className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      Technical: "default",
      Compliance: "secondary",
      Planning: "outline",
      Company: "secondary",
    }
    return <Badge variant={variants[category] || "outline"}>{category}</Badge>
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Documents</h1>
            <p className="mt-2 text-muted-foreground">Manage tender documents and supporting materials</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{MOCK_DOCUMENTS.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Technical Docs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_DOCUMENTS.filter((d) => d.category === "Technical").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Docs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_DOCUMENTS.filter((d) => d.category === "Compliance").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">6.5 MB</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents by name or opportunity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">All Documents</CardTitle>
            <CardDescription>{filteredDocuments.length} documents found</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No documents found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.opportunity}</span>
                          <span>•</span>
                          <span>Uploaded by {doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString("en-ZA")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(doc.category)}
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
