import { NextResponse } from "next/server"
import { updateTask, deleteTask } from "@/lib/db/tasks"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const task = await updateTask(params.id, {
      status: body.status,
      title: body.title,
      description: body.description,
      priority: body.priority,
      assignedTo: body.assignedTo,
      dueDate: body.dueDate,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteTask(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
