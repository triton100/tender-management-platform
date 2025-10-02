"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
          <p className="mt-2 text-muted-foreground">Generate and download tender management reports</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4 text-foreground">Pipeline Report</CardTitle>
              <CardDescription>Overview of all active opportunities and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4 text-foreground">Win Rate Analysis</CardTitle>
              <CardDescription>Historical win rates by category and department</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4 text-foreground">Compliance Summary</CardTitle>
              <CardDescription>Compliance status across all opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
