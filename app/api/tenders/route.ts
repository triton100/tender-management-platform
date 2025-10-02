import { NextResponse } from "next/server"
import type { Tender } from "@/lib/types"

// South Africa eTenders API endpoint (mock implementation)
// In production, this would call the real API: https://etenders.gov.za/api/tenders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock tender data from South Africa eTenders
  const tenders: Tender[] = [
    {
      id: "t1",
      tender_number: "DPWI-2024-001",
      title: "Supply and Installation of Network Infrastructure for Government Buildings",
      description:
        "The Department of Public Works and Infrastructure requires a comprehensive network infrastructure solution for 15 government buildings across Gauteng province. This includes structured cabling, switches, routers, wireless access points, and network security appliances.",
      issuing_department: "Department of Public Works and Infrastructure",
      closing_date: "2024-12-15T17:00:00Z",
      value_estimate: 8500000,
      category: "ICT Infrastructure",
      location: "Gauteng",
      status: "new",
      source_url: "https://etenders.gov.za/content/supply-and-installation-network-infrastructure",
      fetched_at: new Date().toISOString(),
    },
    {
      id: "t2",
      tender_number: "DOH-2024-089",
      title: "Healthcare Management Information System Implementation",
      description:
        "Implementation of an integrated healthcare management system for 8 district hospitals in KwaZulu-Natal. The system must include patient records, appointment scheduling, pharmacy management, and reporting capabilities.",
      issuing_department: "Department of Health",
      closing_date: "2024-12-20T17:00:00Z",
      value_estimate: 12000000,
      category: "Software Development",
      location: "KwaZulu-Natal",
      status: "new",
      source_url: "https://etenders.gov.za/content/healthcare-management-system",
      fetched_at: new Date().toISOString(),
    },
    {
      id: "t3",
      tender_number: "DOE-2024-045",
      title: "Digital Learning Platform for Rural Schools",
      description:
        "Development and deployment of a digital learning platform with offline capabilities for 200 rural schools. Must include content management, student tracking, and teacher training modules.",
      issuing_department: "Department of Education",
      closing_date: "2024-12-10T17:00:00Z",
      value_estimate: 6500000,
      category: "Education Technology",
      location: "Eastern Cape",
      status: "new",
      source_url: "https://etenders.gov.za/content/digital-learning-platform",
      fetched_at: new Date().toISOString(),
    },
    {
      id: "t4",
      tender_number: "SAPS-2024-112",
      title: "Cybersecurity Infrastructure Upgrade",
      description:
        "Upgrade of cybersecurity infrastructure for 50 police stations including firewalls, intrusion detection systems, and security operations center setup.",
      issuing_department: "South African Police Service",
      closing_date: "2024-12-18T17:00:00Z",
      value_estimate: 15000000,
      category: "Cybersecurity",
      location: "National",
      status: "new",
      source_url: "https://etenders.gov.za/content/cybersecurity-upgrade",
      fetched_at: new Date().toISOString(),
    },
    {
      id: "t5",
      tender_number: "DHA-2024-067",
      title: "Biometric Identity Management System",
      description:
        "Implementation of a biometric identity management system for Home Affairs offices nationwide. Must integrate with existing systems and support fingerprint and facial recognition.",
      issuing_department: "Department of Home Affairs",
      closing_date: "2024-12-22T17:00:00Z",
      value_estimate: 18000000,
      category: "Biometric Systems",
      location: "National",
      status: "new",
      source_url: "https://etenders.gov.za/content/biometric-identity-system",
      fetched_at: new Date().toISOString(),
    },
  ]

  // Filter by category if provided
  let filteredTenders = tenders
  if (category && category !== "all") {
    filteredTenders = filteredTenders.filter((t) => t.category === category)
  }

  // Filter by status if provided
  if (status && status !== "all") {
    filteredTenders = filteredTenders.filter((t) => t.status === status)
  }

  return NextResponse.json(filteredTenders)
}
