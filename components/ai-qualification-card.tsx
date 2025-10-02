"use client"

import type { AIQualification } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, AlertTriangle, CheckCircle2, XCircle, Clock, Target, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIQualificationCardProps {
  qualification: AIQualification
}

export function AIQualificationCard({ qualification }: AIQualificationCardProps) {
  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case "pursue":
        return {
          icon: CheckCircle2,
          label: "Strongly Recommended",
          variant: "default" as const,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/30",
        }
      case "consider":
        return {
          icon: AlertTriangle,
          label: "Consider Carefully",
          variant: "secondary" as const,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
        }
      case "skip":
        return {
          icon: XCircle,
          label: "Not Recommended",
          variant: "destructive" as const,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/30",
        }
      default:
        return {
          icon: Target,
          label: "Under Review",
          variant: "outline" as const,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        }
    }
  }

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case "low":
        return { color: "text-green-600 dark:text-green-400", label: "Low Risk" }
      case "medium":
        return { color: "text-yellow-600 dark:text-yellow-400", label: "Medium Risk" }
      case "high":
        return { color: "text-red-600 dark:text-red-400", label: "High Risk" }
      default:
        return { color: "text-muted-foreground", label: "Unknown Risk" }
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const recommendationConfig = getRecommendationConfig(qualification.recommendation)
  const riskConfig = getRiskConfig(qualification.risk_level)
  const RecommendationIcon = recommendationConfig.icon

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className={cn("border-2", recommendationConfig.bgColor)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">AI Qualification Analysis</CardTitle>
                <CardDescription>Powered by machine learning and historical bid data</CardDescription>
              </div>
            </div>
            <Badge variant={recommendationConfig.variant} className="flex items-center gap-1">
              <RecommendationIcon className="h-3 w-3" />
              {recommendationConfig.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Match Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("text-3xl font-bold", getMatchScoreColor(qualification.match_score))}>
                  {qualification.match_score}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <Progress value={qualification.match_score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {qualification.match_score >= 80
                  ? "Excellent alignment"
                  : qualification.match_score >= 60
                    ? "Good potential"
                    : "Limited fit"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={cn("text-2xl font-semibold", riskConfig.color)}>{riskConfig.label}</div>
              <p className="text-xs text-muted-foreground">{qualification.confidence}% confidence in this assessment</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimated Effort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-foreground">{qualification.estimated_effort_days} days</div>
              <p className="text-xs text-muted-foreground">
                Approximately {Math.round(qualification.estimated_effort_days / 20)} months
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">AI Analysis & Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className={recommendationConfig.bgColor}>
            <RecommendationIcon className={cn("h-4 w-4", recommendationConfig.color)} />
            <AlertDescription className="text-sm leading-relaxed text-foreground">
              {qualification.reasoning}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Key Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Key Requirements Identified</CardTitle>
          <CardDescription>Critical requirements extracted from tender documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {qualification.key_requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>
                <span className="text-sm text-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
