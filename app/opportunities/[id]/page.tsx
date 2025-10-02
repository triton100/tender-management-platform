"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AIQualificationCard } from "@/components/ai-qualification-card"
import { MOCK_OPPORTUNITIES, MOCK_TASKS, MOCK_COMPLIANCE } from "@/lib/mock-data"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, this would fetch from the API
  const opportunity = MOCK_OPPORTUNITIES.find((o) => o.id === params.id)
  const tasks = MOCK_TASKS.filter((t) => t.opportunity_id === params.id)
  const compliance = MOCK_COMPLIANCE.filter((c) => c.opportunity_id === params.id)

  if (!opportunity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Opportunity not found</h2>
          <Link href="/opportunities">
            <Button className="mt-4 bg-transparent" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Opportunities
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

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "non-compliant":
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const completedTasks = tasks.filter((t) => t.status === "done").length
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  const compliantItems = compliance.filter((c) => c.status === "compliant").length
  const complianceProgress = compliance.length > 0 ? (compliantItems / compliance.length) * 100 : 0

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/opportunities">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Opportunities
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {opportunity.tender.tender_number}
                </Badge>
                <Badge>Preparing</Badge>
                <Badge variant="secondary">Closes in {getDaysUntilClosing(opportunity.tender.closing_date)} days</Badge>
              </div>
              <h1 className="text-3xl font-semibold text-foreground text-balance">{opportunity.tender.title}</h1>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Tender Value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {opportunity.tender.value_estimate
                  ? formatCurrency(opportunity.tender.value_estimate)
                  : "Not specified"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Win Probability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-foreground">{opportunity.win_probability}%</div>
                <Progress value={opportunity.win_probability} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Tasks Progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-foreground">
                  {completedTasks}/{tasks.length}
                </div>
                <Progress value={taskProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-foreground">
                  {compliantItems}/{compliance.length}
                </div>
                <Progress value={complianceProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="compliance">Compliance ({compliance.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="proposal">Proposal</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {opportunity.ai_qualification && <AIQualificationCard qualification={opportunity.ai_qualification} />}
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
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium text-foreground">{opportunity.tender.issuing_department}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium text-foreground">{opportunity.tender.location}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Closing Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(opportunity.tender.closing_date).toLocaleDateString("en-ZA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-foreground">Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to: Sarah Johnson</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Task Checklist</CardTitle>
                    <CardDescription>
                      {completedTasks} of {tasks.length} tasks completed
                    </CardDescription>
                  </div>
                  <Button>Add Task</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <Checkbox checked={task.status === "done"} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getTaskStatusIcon(task.status)}
                          <h4
                            className={cn(
                              "font-medium text-foreground",
                              task.status === "done" && "line-through text-muted-foreground",
                            )}
                          >
                            {task.title}
                          </h4>
                          {getPriorityBadge(task.priority)}
                        </div>
                        {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          {task.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.due_date).toLocaleDateString("en-ZA")}
                            </span>
                          )}
                          {task.assigned_to && <span>Assigned to: Sarah Johnson</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Compliance Checklist</CardTitle>
                    <CardDescription>
                      {compliantItems} of {compliance.length} requirements met
                    </CardDescription>
                  </div>
                  <Button>Add Requirement</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compliance.map((item) => (
                    <div key={item.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        {getComplianceStatusIcon(item.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.requirement}</h4>
                          {item.notes && <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>}
                          {item.verified_by && item.verified_at && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Verified by Sarah Johnson on {new Date(item.verified_at).toLocaleDateString("en-ZA")}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            item.status === "compliant"
                              ? "default"
                              : item.status === "non-compliant"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Documents</CardTitle>
                    <CardDescription>Tender documents and supporting materials</CardDescription>
                  </div>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No documents yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Upload tender documents and supporting files</p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposal">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Proposal Editor</CardTitle>
                <CardDescription>Draft and edit your tender proposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Executive Summary</label>
                    <Textarea placeholder="Write your executive summary here..." className="mt-2 min-h-[200px]" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Generate with AI</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
