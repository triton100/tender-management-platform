import { NextResponse } from "next/server"
import { getTasks, createTask } from "@/lib/db/tasks"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const opportunityId = searchParams.get("opportunityId") || undefined

    const tasks = await getTasks(opportunityId)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[v0] Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const task = await createTask({
      opportunityId: body.opportunityId,
      title: body.title,
      description: body.description,
      priority: body.priority,
      status: body.status,
      assignedTo: body.assignedTo,
      dueDate: body.dueDate,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[v0] Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
