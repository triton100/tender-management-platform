"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MOCK_OPPORTUNITIES, MOCK_TENDERS, MOCK_TASKS } from "@/lib/mock-data"
import { TrendingUp, DollarSign, Target, Clock, CheckCircle2, AlertCircle, Inbox, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate metrics
  const totalOpportunities = MOCK_OPPORTUNITIES.length
  const totalValue = MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + (opp.tender.value_estimate || 0), 0)
  const avgWinProbability =
    MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + opp.win_probability, 0) / MOCK_OPPORTUNITIES.length
  const newTenders = MOCK_TENDERS.filter((t) => t.status === "new").length
  const completedTasks = MOCK_TASKS.filter((t) => t.status === "done").length
  const totalTasks = MOCK_TASKS.length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Chart data
  const opportunityByStatus = [
    { name: "Qualifying", value: 0, fill: "#3B82F6" }, // Bright blue
    { name: "Preparing", value: 1, fill: "#10B981" }, // Bright green
    { name: "Review", value: 0, fill: "#F59E0B" }, // Bright amber
    { name: "Submitted", value: 0, fill: "#8B5CF6" }, // Bright purple
  ]

  const monthlyTenders = [
    { month: "Jul", tenders: 12, qualified: 8 },
    { month: "Aug", tenders: 15, qualified: 10 },
    { month: "Sep", tenders: 18, qualified: 12 },
    { month: "Oct", tenders: 14, qualified: 9 },
    { month: "Nov", tenders: 20, qualified: 14 },
    { month: "Dec", tenders: 5, qualified: 1 },
  ]

  const winRateData = [
    { category: "ICT Infrastructure", winRate: 75, bids: 8 },
    { category: "Software Development", winRate: 60, bids: 5 },
    { category: "Cybersecurity", winRate: 80, bids: 6 },
    { category: "Education Tech", winRate: 45, bids: 4 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Overview of your tender management activities</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Opportunities</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalOpportunities}</div>
              <div className="mt-1 flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+2 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</div>
              <div className="mt-1 flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+15% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Win Probability</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{Math.round(avgWinProbability)}%</div>
              <Progress value={avgWinProbability} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Tenders</CardTitle>
              <Inbox className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{newTenders}</div>
              <Link href="/tenders">
                <Button variant="link" className="mt-1 h-auto p-0 text-xs text-primary">
                  View all tenders
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Tender Activity</CardTitle>
              <CardDescription>Tenders received and qualified over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tenders: {
                    label: "Tenders Received",
                    color: "#3B82F6", // Bright blue instead of black
                  },
                  qualified: {
                    label: "Qualified",
                    color: "#10B981", // Bright green instead of black
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTenders}>
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="tenders" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Tenders Received" />
                    <Bar dataKey="qualified" fill="#10B981" radius={[4, 4, 0, 0]} name="Qualified" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Opportunity Status Distribution</CardTitle>
              <CardDescription>Current status of active opportunities</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer
                config={{
                  value: {
                    label: "Opportunities",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={opportunityByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {opportunityByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Win Rate by Category</CardTitle>
              <CardDescription>Historical win rates across different tender categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  winRate: {
                    label: "Win Rate %",
                    color: "#F59E0B", // Bright amber instead of black
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winRateData} layout="vertical">
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="category" type="category" stroke="#9CA3AF" fontSize={12} width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="winRate" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Win Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Task Completion</CardTitle>
              <CardDescription>Progress on active opportunity tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Overall Progress</span>
                    <span className="text-sm font-medium text-foreground">
                      {completedTasks}/{totalTasks} tasks
                    </span>
                  </div>
                  <Progress value={taskCompletionRate} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">{Math.round(taskCompletionRate)}% complete</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Completed</p>
                        <p className="text-xs text-muted-foreground">Tasks finished</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{completedTasks}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">In Progress</p>
                        <p className="text-xs text-muted-foreground">Currently working on</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      {MOCK_TASKS.filter((t) => t.status === "in-progress").length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">To Do</p>
                        <p className="text-xs text-muted-foreground">Not started yet</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      {MOCK_TASKS.filter((t) => t.status === "todo").length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Opportunities</CardTitle>
            <CardDescription>Your most recent tender opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 bg-card"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {opp.tender.tender_number}
                      </Badge>
                      <Badge className="bg-primary text-primary-foreground">Preparing</Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{opp.tender.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{opp.tender.issuing_department}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {opp.tender.value_estimate ? formatCurrency(opp.tender.value_estimate) : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">Win Prob: {opp.win_probability}%</p>
                    </div>
                    <Link href={`/opportunities/${opp.id}`}>
                      <Button variant="outline">
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
