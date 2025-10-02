"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, Plus, Users, Calendar } from "lucide-react"

interface Project {
  id: string
  name: string
  client: string
  progress: number
  status: "planning" | "in-progress" | "review" | "completed"
  team: string[]
  deadline: string
  budget: number
}

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      id: "1",
      name: "Network Infrastructure Rollout",
      client: "Department of Public Works",
      progress: 65,
      status: "in-progress",
      team: ["John Doe", "Jane Smith", "Mike Johnson"],
      deadline: "2025-01-14",
      budget: 8500000,
    },
    {
      id: "2",
      name: "Healthcare System Integration",
      client: "Department of Health",
      progress: 30,
      status: "in-progress",
      team: ["Sarah Williams", "Tom Brown"],
      deadline: "2024-12-20",
      budget: 12000000,
    },
    {
      id: "3",
      name: "Digital Learning Platform",
      client: "Department of Education",
      progress: 85,
      status: "review",
      team: ["Alice Cooper", "Bob Martin", "Carol White"],
      deadline: "2024-12-10",
      budget: 6500000,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-gray-100 text-gray-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "review":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatCurrency = (amount: number) => {
    return `R ${(amount / 1000000).toFixed(1)}M`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FolderKanban className="h-6 w-6 text-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Track and manage ongoing projects</p>
          </div>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {projects.filter((p) => p.status === "in-progress").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Review</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {projects.filter((p) => p.status === "review").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground text-balance">{project.name}</CardTitle>
                    <CardDescription className="mt-1">{project.client}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                      >
                        {member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(project.budget)}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
