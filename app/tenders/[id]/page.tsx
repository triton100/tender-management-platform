"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AIQualification } from "@/lib/types"
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
  DollarSign,
  ExternalLink,
  Sparkles,
  Loader2,
  Target,
} from "lucide-react"
import Link from "next/link"
import { MOCK_TENDERS } from "@/lib/mock-data"

const fetcher = (url: string) => fetch(url, { method: "POST" }).then((res) => res.json())

export default function TenderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isQualifying, setIsQualifying] = useState(false)
  const [qualification, setQualification] = useState<AIQualification | null>(null)

  // In a real app, this would fetch from the API
  const tender = MOCK_TENDERS.find((t) => t.id === params.id)

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
    // In a real app, this would create an opportunity in the database
    router.push("/opportunities")
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-secondary/30">
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
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {tender.tender_number}
                </Badge>
                <Badge>{tender.category}</Badge>
                <Badge variant="secondary">Closes in {getDaysUntilClosing(tender.closing_date)} days</Badge>
              </div>
              <h1 className="text-3xl font-semibold text-foreground text-balance">{tender.title}</h1>
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

        {/* Tender Details */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Tender Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground">{tender.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Tender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Issuing Department</p>
                    <p className="text-sm font-medium text-foreground">{tender.issuing_department}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{tender.location}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Estimated Value</p>
                    <p className="text-sm font-medium text-foreground">
                      {tender.value_estimate ? formatCurrency(tender.value_estimate) : "Not specified"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Closing Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(tender.closing_date).toLocaleDateString("en-ZA", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {tender.source_url && (
                  <>
                    <Separator />
                    <a
                      href={tender.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on eTenders portal
                    </a>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Qualification Results */}
        {qualification && (
          <div className="mb-6">
            <AIQualificationCard qualification={qualification} />
          </div>
        )}

        {/* Loading State */}
        {isQualifying && (
          <Card className="border-primary/50 bg-primary/5">
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
