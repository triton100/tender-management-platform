"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, Download, Eye, Calendar, DollarSign } from "lucide-react"

interface Contract {
  id: string
  contractNumber: string
  title: string
  client: string
  value: number
  startDate: string
  endDate: string
  status: "active" | "pending" | "completed" | "expired"
}

export default function ContractsPage() {
  const contracts: Contract[] = [
    {
      id: "1",
      contractNumber: "CNT-2024-001",
      title: "Network Infrastructure Implementation",
      client: "Department of Public Works",
      value: 8500000,
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      status: "active",
    },
    {
      id: "2",
      contractNumber: "CNT-2023-089",
      title: "Healthcare System Maintenance",
      client: "Department of Health",
      value: 2400000,
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      status: "active",
    },
    {
      id: "3",
      contractNumber: "CNT-2024-045",
      title: "Digital Learning Platform Support",
      client: "Department of Education",
      value: 1200000,
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      status: "active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "expired":
        return "bg-red-100 text-red-700"
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
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-foreground" />
            <h1 className="text-2xl font-semibold text-foreground">Contracts</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Manage active and completed contracts</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Contracts</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {contracts.filter((c) => c.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Contract Value</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Expiring Soon</CardDescription>
              <CardTitle className="text-3xl text-foreground">0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">{contract.contractNumber}</Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground text-balance">{contract.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{contract.client}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{formatCurrency(contract.value)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(contract.startDate).toLocaleDateString()} -{" "}
                              {new Date(contract.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
