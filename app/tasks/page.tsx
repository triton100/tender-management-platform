"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Plus, Calendar, User } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in-progress" | "completed"
  assignee: string
  tender: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete technical proposal for DPWI-2024-001",
      description: "Draft technical approach and methodology section",
      dueDate: "2024-12-10",
      priority: "high",
      status: "in-progress",
      assignee: "John Doe",
      tender: "DPWI-2024-001",
    },
    {
      id: "2",
      title: "Review compliance requirements for DOH-2024-089",
      description: "Verify all mandatory compliance documents",
      dueDate: "2024-12-12",
      priority: "high",
      status: "todo",
      assignee: "Jane Smith",
      tender: "DOH-2024-089",
    },
    {
      id: "3",
      title: "Prepare pricing schedule for DOE-2024-045",
      description: "Calculate costs and prepare detailed pricing breakdown",
      dueDate: "2024-12-08",
      priority: "medium",
      status: "todo",
      assignee: "Mike Johnson",
      tender: "DOE-2024-045",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as const,
    assignee: "",
    tender: "",
  })

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: "todo",
    }
    setTasks([...tasks, task])
    setIsDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignee: "",
      tender: "",
    })
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "todo" : ("completed" as const) } : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-amber-100 text-amber-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Manage tender-related tasks and deadlines</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to track tender-related activities</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: "high" | "medium" | "low") => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    placeholder="Enter assignee name"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tender">Related Tender</Label>
                  <Input
                    id="tender"
                    placeholder="Enter tender reference"
                    value={newTask.tender}
                    onChange={(e) => setNewTask({ ...newTask, tender: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.title} className="bg-primary">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* To Do Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                To Do
                <Badge variant="secondary" className="ml-auto">
                  {todoTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todoTasks.map((task) => (
                <Card key={task.id} className="border-l-4 border-l-gray-400">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={false} onCheckedChange={() => toggleTaskStatus(task.id)} className="mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground text-balance">{task.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.tender}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* In Progress Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                In Progress
                <Badge variant="secondary" className="ml-auto">
                  {inProgressTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inProgressTasks.map((task) => (
                <Card key={task.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={false} onCheckedChange={() => toggleTaskStatus(task.id)} className="mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground text-balance">{task.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.tender}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Completed Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Completed
                <Badge variant="secondary" className="ml-auto">
                  {completedTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={true} onCheckedChange={() => toggleTaskStatus(task.id)} className="mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground line-through text-balance">{task.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.tender}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
