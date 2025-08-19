"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus } from "lucide-react"

const COMMODITIES = [
  "COFFEE",
  "SESAME",
  "SOYA",
  "BEAN",
  "COCOA",
  "CHICK PEA",
  "PIGEON PEA",
  "CASHEW",
  "COTTON",
  "SUNFLOWER",
  "GROUNDNUT",
  "GEMSTONE",
  "GREEN GRAM",
] as const

const REGIONS = [
  "SINGIDA",
  "MBEYA",
  "MANYARA",
  "RUVUMA",
  "MTWARA",
  "DODOMA",
  "LINDI",
  "MOROGORO",
  "PWANI",
  "ARUSHA",
  "DAR ES SALAAM",
  "GEITA",
  "IRINGA",
  "KAGERA",
  "KATAVI",
  "KIGOMA",
  "KILIMANJARO",
  "MARA",
  "MWANZA",
  "NJOMBE",
  "PEMBA",
  "RUKWA",
  "SHINYANGA",
  "SIMIYU",
  "SONGWE",
  "TABORA",
  "TANGA",
  "ZANZIBAR",
] as const

const UNIONS = [
  "TANECU",
  "DODOMA CC",
  "KONDOA",
  "KICU",
  "MTWARA COOP",
  "LINDI UNION",
  "MOROGORO FARMERS",
  "PWANI COOP",
  "ARUSHA UNION",
  "MBEYA FARMERS",
  "SINGIDA COOP",
] as const

const COMMODITY_CODES: Record<string, string> = {
  COFFEE: "CF",
  SESAME: "SS",
  SOYA: "SY",
  BEAN: "BN",
  COCOA: "CC",
  "CHICK PEA": "CP",
  "PIGEON PEA": "PP",
  CASHEW: "CW",
  COTTON: "CT",
  SUNFLOWER: "SF",
  GROUNDNUT: "GN",
  GEMSTONE: "GM",
  "GREEN GRAM": "GG",
}

const REGION_CODES: Record<string, string> = {
  SINGIDA: "SING",
  MBEYA: "MBEY",
  MANYARA: "MANY",
  RUVUMA: "RUVU",
  MTWARA: "MTWR",
  DODOMA: "DDM",
  LINDI: "LIND",
  MOROGORO: "MORO",
  PWANI: "PWAN",
  ARUSHA: "ARUS",
  "DAR ES SALAAM": "DSM",
  GEITA: "GEIT",
  IRINGA: "IRIN",
  KAGERA: "KAGE",
  KATAVI: "KATA",
  KIGOMA: "KIGO",
  KILIMANJARO: "KILI",
  MARA: "MARA",
  MWANZA: "MWAN",
  NJOMBE: "NJOM",
  PEMBA: "PEMB",
  RUKWA: "RUKW",
  SHINYANGA: "SHIN",
  SIMIYU: "SIMI",
  SONGWE: "SONG",
  TABORA: "TABO",
  TANGA: "TANG",
  ZANZIBAR: "ZANZ",
}

interface CommodityRow {
  id: number
  commodity: string
  region: string
  union: string
  highPrice: string
  lowPrice: string
  weight: string
}

export default function CommodityPriceGenerator() {
  const [rows, setRows] = useState<CommodityRow[]>([
    { id: 1, commodity: "COFFEE", region: "SINGIDA", union: "", highPrice: "", lowPrice: "", weight: "" },
  ])

  const addRow = () => {
    if (rows.length < 4) {
      const newId = Math.max(...rows.map((r) => r.id)) + 1
      setRows((prev) => [
        ...prev,
        {
          id: newId,
          commodity: "COFFEE",
          region: "SINGIDA",
          union: "",
          highPrice: "",
          lowPrice: "",
          weight: "",
        },
      ])
    }
  }

  const updateRow = (id: number, field: keyof CommodityRow, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const generateCommodityCode = (commodity: string, region: string, union: string) => {
    if (!commodity || !region) return ""
    const commodityCode = COMMODITY_CODES[commodity] || commodity.slice(0, 2).toUpperCase()
    const regionCode = REGION_CODES[region] || region.slice(0, 4).toUpperCase()
    const commodityName = commodity.charAt(0) + commodity.slice(1).toLowerCase()
    const regionName = region.charAt(0) + region.slice(1).toLowerCase()

    if (union) {
      return `${commodityCode}-${regionCode} (${commodityName} - ${union} - ${regionName})`
    }
    return `${commodityCode}-${regionCode} (${commodityName} - ${regionName})`
  }

  const downloadAsImage = async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 1000
    canvas.height = 1000

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.fillStyle = ctx.createPattern(img, "repeat") || "#f5f5dc"
      ctx.fillRect(0, 0, 1000, 1000)

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
      ctx.fillRect(0, 0, 1000, 1000)

      drawContent()
    }
    img.onerror = () => {
      ctx.fillStyle = "#f5f5dc"
      ctx.fillRect(0, 0, 1000, 1000)
      drawContent()
    }
    img.src = "/placeholder-we4cu.png"

    const drawContent = () => {
      ctx.fillStyle = "#000"
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("THE UNITED REPUBLIC OF TANZANIA", 500, 60)
      ctx.fillText("MINISTRY OF FINANCE", 500, 90)
      ctx.fillText("TANZANIA MERCANTILE EXCHANGE", 500, 120)

      ctx.fillStyle = "#f5f5dc"
      ctx.fillRect(50, 150, 900, 80)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 36px Arial"
      ctx.fillText("Daily Market Price", 500, 185)

      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      ctx.fillText(today, 500, 220)

      ctx.fillStyle = "#000"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "left"

      const headerY = 300
      ctx.fillText("Commodity", 80, headerY)
      ctx.fillText("High Price", 380, headerY)
      ctx.fillText("Low Price", 550, headerY)
      ctx.fillText("Weight", 720, headerY)

      ctx.fillText("(TZS/kg)", 380, headerY + 25)
      ctx.fillText("(TZS/kg)", 550, headerY + 25)
      ctx.fillText("(Kgs)", 720, headerY + 25)

      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(70, headerY + 35)
      ctx.lineTo(930, headerY + 35)
      ctx.stroke()

      ctx.font = "18px Arial"
      const rowHeight = 80
      let currentY = headerY + 70

      rows.forEach((row, index) => {
        if (row.commodity && row.region) {
          const commodityCode = generateCommodityCode(row.commodity, row.region, row.union)

          ctx.font = "bold 24px Arial"
          ctx.fillText(commodityCode.split(" (")[0], 80, currentY)
          ctx.font = "14px Arial"
          ctx.fillText(`(${commodityCode.split(" (")[1]?.replace(")", "") || ""})`, 80, currentY + 20)

          ctx.font = "26px Arial"
          ctx.fillText(row.highPrice || "-", 380, currentY)
          ctx.fillText(row.lowPrice || "-", 550, currentY)
          ctx.fillText(row.weight || "-", 720, currentY)

          if (index === rows.length - 1) {
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(70, currentY + 35)
            ctx.lineTo(930, currentY + 35)
            ctx.stroke()
          } else if (index < rows.length - 1) {
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(70, currentY + 35)
            ctx.lineTo(930, currentY + 35)
            ctx.stroke()
          }

          currentY += rowHeight
        }
      })

      ctx.fillStyle = "#000"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("tmx.tz     |       tmxtz1 |       tmx_tz |       www.tmx.co.tz", 500, 950)

      const link = document.createElement("a")
      link.download = `commodity-prices-${new Date().toISOString().split("T")[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Tanzania Commodity Price Generator</CardTitle>
            <p className="text-green-100">Generate official commodity price tables</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-4 font-bold text-lg">Commodity</th>
                    <th className="text-left p-4 font-bold text-lg">High Price (TZS/kg)</th>
                    <th className="text-left p-4 font-bold text-lg">Low Price (TZS/kg)</th>
                    <th className="text-left p-4 font-bold text-lg">Weight (Kgs)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        index === rows.length - 1 ? "border-b-2 border-gray-400" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <Select
                            value={row.commodity}
                            onValueChange={(value) => updateRow(row.id, "commodity", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select commodity" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMMODITIES.map((commodity) => (
                                <SelectItem key={commodity} value={commodity}>
                                  {commodity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select value={row.region} onValueChange={(value) => updateRow(row.id, "region", value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {REGIONS.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select value={row.union} onValueChange={(value) => updateRow(row.id, "union", value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select union (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No Union">No Union</SelectItem>
                              {UNIONS.map((union) => (
                                <SelectItem key={union} value={union}>
                                  {union}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {row.commodity && row.region && (
                            <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                              {generateCommodityCode(row.commodity, row.region, row.union)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={row.highPrice}
                          onChange={(e) => updateRow(row.id, "highPrice", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={row.lowPrice}
                          onChange={(e) => updateRow(row.id, "lowPrice", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          placeholder="0"
                          value={row.weight}
                          onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                          className="w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-start">
              {rows.length < 4 && (
                <Button
                  onClick={addRow}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row ({rows.length}/4)
                </Button>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={downloadAsImage}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download as Image (1000x1000px)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
