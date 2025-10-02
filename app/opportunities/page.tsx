"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MOCK_OPPORTUNITIES } from "@/lib/mock-data"
import { Calendar, DollarSign, Target, TrendingUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OpportunitiesPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "qualifying":
        return { variant: "secondary" as const, label: "Qualifying" }
      case "preparing":
        return { variant: "default" as const, label: "Preparing" }
      case "review":
        return { variant: "outline" as const, label: "In Review" }
      case "submitted":
        return { variant: "secondary" as const, label: "Submitted" }
      case "won":
        return { variant: "default" as const, label: "Won" }
      case "lost":
        return { variant: "destructive" as const, label: "Lost" }
      default:
        return { variant: "outline" as const, label: status }
    }
  }

  const getDaysUntilClosing = (closingDate: string) => {
    const days = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Opportunities</h1>
            <p className="mt-2 text-muted-foreground">Active tender opportunities in your pipeline</p>
          </div>
          <Button>
            <Target className="mr-2 h-4 w-4" />
            New Opportunity
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{MOCK_OPPORTUNITIES.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + (opp.tender.value_estimate || 0), 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Win Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(
                  MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + opp.win_probability, 0) / MOCK_OPPORTUNITIES.length,
                )}
                %
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Closing Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_OPPORTUNITIES.filter((opp) => getDaysUntilClosing(opp.tender.closing_date) <= 7).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {MOCK_OPPORTUNITIES.map((opportunity) => {
            const statusConfig = getStatusConfig(opportunity.status)
            const daysUntilClosing = getDaysUntilClosing(opportunity.tender.closing_date)

            return (
              <Card key={opportunity.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {opportunity.tender.tender_number}
                        </Badge>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        {daysUntilClosing <= 7 && (
                          <Badge variant="destructive">Closes in {daysUntilClosing} days</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-balance text-foreground">{opportunity.tender.title}</CardTitle>
                    </div>
                    <Link href={`/opportunities/${opportunity.id}`}>
                      <Button>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Estimated Value:</span>
                        <span className="font-medium text-foreground">
                          {opportunity.tender.value_estimate
                            ? formatCurrency(opportunity.tender.value_estimate)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Closing Date:</span>
                        <span className="font-medium text-foreground">
                          {new Date(opportunity.tender.closing_date).toLocaleDateString("en-ZA")}
                        </span>
                      </div>
                      {opportunity.ai_qualification && (
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">AI Match Score:</span>
                          <span
                            className={cn(
                              "font-medium",
                              opportunity.ai_qualification.match_score >= 80
                                ? "text-green-600 dark:text-green-400"
                                : opportunity.ai_qualification.match_score >= 60
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {opportunity.ai_qualification.match_score}/100
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          Win Probability
                        </span>
                        <span className="font-medium text-foreground">{opportunity.win_probability}%</span>
                      </div>
                      <Progress value={opportunity.win_probability} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {MOCK_OPPORTUNITIES.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No opportunities yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Start by qualifying tenders from the Tender Inbox</p>
              <Link href="/tenders">
                <Button className="mt-4">Browse Tenders</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
