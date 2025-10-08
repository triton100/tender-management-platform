import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Tender } from "@/lib/types"

export async function getTenders(filters?: {
  category?: string
  minValue?: number
  deadline?: string
  search?: string
}) {
  const supabase = await getSupabaseServerClient()

  let query = supabase.from("tenders").select("*").eq("status", "open").order("closing_date", { ascending: true })

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.minValue) {
    query = query.gte("value", filters.minValue)
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching tenders:", error)
    throw error
  }

  return data as Tender[]
}

export async function getTenderById(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("tenders").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching tender:", error)
    throw error
  }

  return data as Tender
}

export async function createTender(tender: Omit<Tender, "id" | "createdAt" | "updatedAt">) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("tenders")
    .insert([
      {
        reference: tender.reference,
        title: tender.title,
        description: tender.description,
        issuing_department: tender.issuingDepartment,
        category: tender.category,
        value: tender.value,
        location: tender.location,
        published_date: tender.publishedDate,
        closing_date: tender.closingDate,
        priority: tender.priority,
        source_url: tender.sourceUrl,
        status: tender.status || "open",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating tender:", error)
    throw error
  }

  return data
}
