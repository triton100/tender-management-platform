import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getDocuments(opportunityId?: string) {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("documents")
    .select(`
      *,
      opportunity:opportunities(
        *,
        tender:tenders(*)
      ),
      uploader:users(*)
    `)
    .order("created_at", { ascending: false })

  if (opportunityId) {
    query = query.eq("opportunity_id", opportunityId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching documents:", error)
    throw error
  }

  return data
}

export async function createDocument(document: {
  opportunityId: string
  name: string
  fileType: string
  fileSize: number
  fileUrl: string
  category: string
  uploadedBy: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        opportunity_id: document.opportunityId,
        name: document.name,
        file_type: document.fileType,
        file_size: document.fileSize,
        file_url: document.fileUrl,
        category: document.category,
        uploaded_by: document.uploadedBy,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating document:", error)
    throw error
  }

  return data
}

export async function deleteDocument(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("documents").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting document:", error)
    throw error
  }
}
