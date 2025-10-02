import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const province = searchParams.get("province") || "all"
  const category = searchParams.get("category") || "all"

  try {
    // In a real implementation, this would scrape or call the eTenders API
    // For now, we'll return mock data that simulates the eTenders structure

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockTenders = [
      {
        id: "tender-001",
        tenderNumber: "DPWI/2024/ICT/001",
        title: "Supply and Installation of Network Infrastructure for Government Buildings",
        department: "Department of Public Works and Infrastructure",
        closingDate: "2024-12-15T17:00:00Z",
        publishDate: "2024-11-01T09:00:00Z",
        category: "ICT & Technology",
        province: "Gauteng",
      },
      {
        id: "tender-002",
        tenderNumber: "DOH/2024/SOFT/089",
        title: "Healthcare Management Information System Implementation",
        department: "Department of Health - KwaZulu-Natal",
        closingDate: "2024-12-20T17:00:00Z",
        publishDate: "2024-11-05T09:00:00Z",
        category: "ICT & Technology",
        province: "KwaZulu-Natal",
      },
      {
        id: "tender-003",
        tenderNumber: "DOE/2024/EDU/045",
        title: "Digital Learning Platform for Rural Schools",
        department: "Department of Education - Eastern Cape",
        closingDate: "2024-12-10T17:00:00Z",
        publishDate: "2024-10-28T09:00:00Z",
        category: "ICT & Technology",
        province: "Eastern Cape",
      },
      {
        id: "tender-004",
        tenderNumber: "SAPS/2024/SEC/112",
        title: "Cybersecurity Infrastructure Upgrade for Police Stations",
        department: "South African Police Service",
        closingDate: "2024-12-18T17:00:00Z",
        publishDate: "2024-11-08T09:00:00Z",
        category: "ICT & Technology",
        province: "National",
      },
      {
        id: "tender-005",
        tenderNumber: "DHA/2024/BIO/067",
        title: "Biometric Identity Management System Implementation",
        department: "Department of Home Affairs",
        closingDate: "2024-12-22T17:00:00Z",
        publishDate: "2024-11-10T09:00:00Z",
        category: "ICT & Technology",
        province: "National",
      },
      {
        id: "tender-006",
        tenderNumber: "COGTA/2024/CONS/034",
        title: "Municipal Infrastructure Development Consulting Services",
        department: "Department of Cooperative Governance",
        closingDate: "2024-12-25T17:00:00Z",
        publishDate: "2024-11-12T09:00:00Z",
        category: "Consulting Services",
        province: "Western Cape",
      },
    ]

    // Filter by search query
    let filteredTenders = mockTenders.filter((tender) => {
      if (!query) return true
      const searchLower = query.toLowerCase()
      return (
        tender.title.toLowerCase().includes(searchLower) ||
        tender.tenderNumber.toLowerCase().includes(searchLower) ||
        tender.department.toLowerCase().includes(searchLower)
      )
    })

    // Filter by province
    if (province !== "all") {
      filteredTenders = filteredTenders.filter(
        (tender) => tender.province.toLowerCase() === province.toLowerCase().replace("-", " "),
      )
    }

    // Filter by category
    if (category !== "all") {
      filteredTenders = filteredTenders.filter((tender) => tender.category.toLowerCase().includes(category))
    }

    return NextResponse.json(filteredTenders)
  } catch (error) {
    console.error("[v0] Error fetching eTenders:", error)
    return NextResponse.json({ error: "Failed to fetch tenders" }, { status: 500 })
  }
}
