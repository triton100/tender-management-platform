import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Opportunity } from "@/lib/types"

export async function getOpportunities(userId?: string) {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("opportunities")
    .select(`
      *,
      tender:tenders(*),
      qualification:ai_qualifications(*),
      assigned_user:users(*)
    `)
    .order("created_at", { ascending: false })

  if (userId) {
    query = query.eq("assigned_to", userId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching opportunities:", error)
    throw error
  }

  return data as any[]
}

export async function getOpportunityById(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      *,
      tender:tenders(*),
      qualification:ai_qualifications(*),
      assigned_user:users(*),
      tasks(*),
      compliance_items(*),
      documents(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching opportunity:", error)
    throw error
  }

  return data
}

export async function createOpportunity(opportunity: {
  tenderId: string
  qualificationId?: string
  assignedTo?: string
  status?: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("opportunities")
    .insert([
      {
        tender_id: opportunity.tenderId,
        qualification_id: opportunity.qualificationId,
        assigned_to: opportunity.assignedTo,
        status: opportunity.status || "qualifying",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating opportunity:", error)
    throw error
  }

  return data
}

export async function updateOpportunity(id: string, updates: Partial<Opportunity>) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("opportunities")
    .update({
      status: updates.status,
      progress: updates.progress,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating opportunity:", error)
    throw error
  }

  return data
}
