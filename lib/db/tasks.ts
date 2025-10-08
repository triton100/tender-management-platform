import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getTasks(opportunityId?: string) {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("tasks")
    .select(`
      *,
      opportunity:opportunities(
        *,
        tender:tenders(*)
      ),
      assigned_user:users(*)
    `)
    .order("created_at", { ascending: false })

  if (opportunityId) {
    query = query.eq("opportunity_id", opportunityId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching tasks:", error)
    throw error
  }

  return data
}

export async function createTask(task: {
  opportunityId?: string
  title: string
  description?: string
  priority: string
  status?: string
  assignedTo?: string
  dueDate?: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        opportunity_id: task.opportunityId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status || "todo",
        assigned_to: task.assignedTo,
        due_date: task.dueDate,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating task:", error)
    throw error
  }

  return data
}

export async function updateTask(
  id: string,
  updates: {
    status?: string
    title?: string
    description?: string
    priority?: string
    assignedTo?: string
    dueDate?: string
  },
) {
  const supabase = await getSupabaseServerClient()

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (updates.status) updateData.status = updates.status
  if (updates.title) updateData.title = updates.title
  if (updates.description) updateData.description = updates.description
  if (updates.priority) updateData.priority = updates.priority
  if (updates.assignedTo) updateData.assigned_to = updates.assignedTo
  if (updates.dueDate) updateData.due_date = updates.dueDate

  if (updates.status === "completed") {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("tasks").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating task:", error)
    throw error
  }

  return data
}

export async function deleteTask(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting task:", error)
    throw error
  }
}
