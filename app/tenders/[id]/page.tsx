"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ExternalTender, AIQualification } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AIQualificationCard } from "@/components/ai-qualification-card"
import {
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
  Target,
  FileText,
  Download,
  Phone,
  Mail,
  MapPinned,
} from "lucide-react"
import Link from "next/link"

export default function TenderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isQualifying, setIsQualifying] = useState(false)
  const [qualification, setQualification] = useState<AIQualification | null>(null)
  const [tender, setTender] = useState<ExternalTender | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tenders`)
      .then((res) => res.json())
      .then((data: ExternalTender[]) => {
        const foundTender = data.find((t) => t.id.toString() === params.id)
        setTender(foundTender || null)
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Failed to fetch tender:", err)
        setLoading(false)
      })
  }, [params.id])

  const handleQualify = async () => {
    setIsQualifying(true)
    try {
      const response = await fetch(`/api/tenders/${params.id}/qualify`, {
        method: "POST",
      })
      const data = await response.json()
      setQualification(data)
    } catch (error) {
      console.error("Failed to qualify tender:", error)
    } finally {
      setIsQualifying(false)
    }
  }

  const handleCreateOpportunity = () => {
    router.push("/opportunities")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Tender not found</h2>
          <Link href="/tenders">
            <Button className="mt-4 bg-transparent" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tender Inbox
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const isRelevant = tender.ai_label === 1

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/tenders">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tender Inbox
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {tender.tender_No}
                </Badge>
                <Badge>{tender.category}</Badge>
                <Badge variant="secondary">Closes in {getDaysUntilClosing(tender.closing_Date)} days</Badge>
                <Badge className={isRelevant ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {isRelevant ? "AI: Relevant" : "AI: Irrelevant"}
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold text-foreground text-balance">{tender.description}</h1>
            </div>
            {!qualification && (
              <Button size="lg" onClick={handleQualify} disabled={isQualifying}>
                {isQualifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Qualify with AI
                  </>
                )}
              </Button>
            )}
            {qualification && (
              <Button size="lg" onClick={handleCreateOpportunity}>
                <Target className="mr-2 h-5 w-5" />
                Create Opportunity
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* AI Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground">{tender.ai_reasoning}</p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Tender Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground whitespace-pre-wrap">{tender.description}</p>
              </CardContent>
            </Card>

            {/* Supporting Documents */}
            {tender.supportDocument && tender.supportDocument.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tender.supportDocument.map((doc) => (
                      <div
                        key={doc.supportDocumentID}
                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-foreground">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated {new Date(doc.dateModified).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Briefing Session */}
            {tender.briefingSession && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Briefing Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={tender.briefingCompulsory ? "destructive" : "secondary"}>
                        {tender.briefingCompulsory ? "Compulsory" : "Optional"}
                      </Badge>
                    </div>
                    {tender.briefingVenue && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-medium text-foreground">Venue/Meeting Details:</p>
                        <p className="mt-1 text-sm text-muted-foreground">{tender.briefingVenue}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Tender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{tender.department}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Province</p>
                    <p className="text-sm font-medium text-foreground">{tender.province}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Delivery Location</p>
                    <p className="text-sm font-medium text-foreground">{tender.delivery}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Published</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(tender.date_Published).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Closing Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(tender.closing_Date).toLocaleDateString("en-ZA", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(tender.closing_Date).toLocaleTimeString("en-ZA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Contact Person</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">{tender.contactPerson}</p>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${tender.email}`} className="text-sm text-blue-600 hover:underline">
                    {tender.email}
                  </a>
                </div>
                {tender.telephone && tender.telephone !== "N/A" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${tender.telephone}`} className="text-sm text-blue-600 hover:underline">
                        {tender.telephone}
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submission Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={tender.eSubmission ? "default" : "secondary"}>
                    {tender.eSubmission ? "Electronic Submission" : "Physical Submission"}
                  </Badge>
                </div>
                {tender.twoEnvelopeSubmission && (
                  <div className="mt-2">
                    <Badge variant="outline">Two Envelope System</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Qualification Results */}
        {qualification && (
          <div className="mt-6">
            <AIQualificationCard qualification={qualification} />
          </div>
        )}

        {/* Loading State */}
        {isQualifying && (
          <Card className="mt-6 border-primary/50 bg-primary/5">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">AI Analysis in Progress</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Analyzing tender requirements, comparing with company capabilities, and assessing risk factors...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
