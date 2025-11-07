"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Upload,
  Trash2,
  Check,
  Plus,
  Palette,
  Type,
  ImageIcon,
  Calendar,
  Sparkles,
  Edit3,
  Save,
  X,
  Copy,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// --- TYPES ---
type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down"

interface BackgroundStyle {
  objectFit: ObjectFit
  objectPosition: string
}

interface Position {
  x: number
  y: number
}

interface PositionableElement {
  content: string
  position: Position
}

interface DateCircleState {
  position: Position
  topText: PositionableElement
  mainText: PositionableElement
  bottomText: PositionableElement
}

interface PosterState {
  topText: string
  heading: PositionableElement
  paragraph: PositionableElement
  backgroundImage: string | null
  backgroundStyle: BackgroundStyle
  headerFooterBackgroundColor: string
  dateCircle: DateCircleState
  topLeftLogo: string | null
  topRightLogo: string | null
  footerLogos: string[]
}

interface CropImage {
  id: string
  url: string
  title: string
  description: string
}

// --- CONSTANTS ---
const POSTER_WIDTH = 1080
const POSTER_HEIGHT = 1080

type CropName =
  | "BEAN"
  | "CASHEW"
  | "CHICK PEA"
  | "COCOA"
  | "COFFEE"
  | "COTTON"
  | "GEMSTONE"
  | "GROUNDNUT"
  | "GREEN GRAM"
  | "PIGEON PEA"
  | "SESAME"
  | "SOYA"
  | "SUNFLOWER"

const AVAILABLE_LOCATIONS: string[] = [
  "ARUSHA",
  "DAR ES SALAAM",
  "DODOMA",
  "GEITA",
  "IRINGA",
  "KAGERA",
  "KATAVI",
  "KIGOMA",
  "KILIMANJARO",
  "LINDI",
  "MANYARA",
  "MARA",
  "MBEYA",
  "MOROGORO",
  "MTWARA",
  "MWANZA",
  "NJOMBE",
  "PEMBA",
  "PWANI",
  "RUKWA",
  "RUVUMA",
  "SHINYANGA",
  "SIMIYU",
  "SINGIDA",
  "SONGWE",
  "TABORA",
  "TANGA",
  "ZANZIBAR",
]

const CROPS: CropName[] = [
  "BEAN",
  "CASHEW",
  "CHICK PEA",
  "COCOA",
  "COFFEE",
  "COTTON",
  "GEMSTONE",
  "GROUNDNUT",
  "GREEN GRAM",
  "PIGEON PEA",
  "SESAME",
  "SOYA",
  "SUNFLOWER",
]

const CROP_TRANSLATIONS_SW: Record<CropName, string> = {
  BEAN: "MAHARAGE",
  CASHEW: "KOROSHO",
  "CHICK PEA": "DENGU",
  COCOA: "KAKAO",
  COFFEE: "KAHAWA",
  COTTON: "PAMBA",
  GEMSTONE: "MADINI",
  GROUNDNUT: "KARANGA",
  "GREEN GRAM": "CHOROKO",
  "PIGEON PEA": "MBAAZI",
  SESAME: "UFUTA",
  SOYA: "SOYA",
  SUNFLOWER: "ALIZETI",
}

const CROP_NAMES_EN: Record<CropName, string> = {
  BEAN: "Beans",
  CASHEW: "Cashew Nut",
  "CHICK PEA": "Chick Peas",
  COCOA: "Cocoa",
  COFFEE: "Coffee",
  COTTON: "Cotton",
  GEMSTONE: "Gemstones",
  GROUNDNUT: "Groundnuts",
  "GREEN GRAM": "Green Grams",
  "PIGEON PEA": "Pigeon Peas",
  SESAME: "Sesame",
  SOYA: "Soya",
  SUNFLOWER: "Sunflower",
}

// Crop-specific background images
const CROP_BACKGROUND_IMAGES: Record<CropName, CropImage[]> = {
  BEAN: [
    {
      id: "bean-1",
      url: "/placeholder.svg?height=1080&width=1080&text=Bean+Field",
      title: "Bean Field",
      description: "Healthy bean plants growing",
    },
    {
      id: "bean-2",
      url: "/placeholder.svg?height=1080&width=1080&text=Bean+Harvest",
      title: "Bean Harvest",
      description: "Fresh beans being harvested",
    },
    {
      id: "bean-3",
      url: "/placeholder.svg?height=1080&width=1080&text=Bean+Farm+Landscape",
      title: "Bean Farm",
      description: "Expansive bean farming landscape",
    },
  ],
  CASHEW: [
    {
      id: "cashew-1",
      url: "/images/crop/cashew1.jpg",
      title: "Cashew Orchard",
      description: "Cashew trees in orchard",
    },
    {
      id: "cashew-2",
      url: "/images/crop/cashew2.jpg",
      title: "Cashew Nuts",
      description: "Fresh cashew nuts on trees",
    },
    {
      id: "cashew-3",
      url: "/images/crop/cashew3.jpg",
      title: "Cashew Harvest",
      description: "Harvesting cashew nuts",
    },
  ],
  "CHICK PEA": [
    {
      id: "chickpea-1",
      url: "/images/crop/chickpeas1.png",
      title: "Chickpea Field",
      description: "Chickpea plants in the field",
    },
    {
      id: "chickpea-2",
      url: "/images/crop/chickpeas2.png",
      title: "Chickpea Harvest",
      description: "Harvesting chickpeas",
    },
    {
      id: "chickpea-3",
      url: "/images/crop/chickpeas3.png",
      title: "Chickpea Farm",
      description: "Traditional chickpea farming",
    },
  ],
  COCOA: [
    {
      id: "cocoa-1",
      url: "/images/crop/cocoa1.png",
      title: "Cocoa Plantation",
      description: "Cocoa trees with pods",
    },
    {
      id: "cocoa-2",
      url: "/images/crop/cocoa2.png",
      title: "Cocoa Pods",
      description: "Ripe cocoa pods on trees",
    },
    {
      id: "cocoa-3",
      url: "/images/crop/cocoa3.png",
      title: "Cocoa Harvest",
      description: "Farmers harvesting cocoa pods",
    },
  ],
  COFFEE: [
    {
      id: "coffee-1",
      url: "/images/crop/coffee1.jpg",
      title: "Coffee Plantation",
      description: "Lush coffee plantation with green beans",
    },
    {
      id: "coffee-2",
      url: "/images/crop/coffee2.jpg",
      title: "Coffee Harvest",
      description: "Fresh coffee beans being harvested",
    },
    {
      id: "coffee-3",
      url: "/images/crop/coffee3.jpeg",
      title: "Coffee Farm",
      description: "Rolling hills of coffee farms",
    },
    {
      id: "coffee-4",
      url: "/images/crop/coffee3.jpeg",
      title: "Coffee Processing",
      description: "Coffee beans drying in the sun",
    },
  ],
  COTTON: [
    {
      id: "cotton-1",
      url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Field",
      title: "Cotton Field",
      description: "White cotton ready for harvest",
    },
    {
      id: "cotton-2",
      url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Harvest",
      title: "Cotton Harvest",
      description: "Cotton being harvested",
    },
    {
      id: "cotton-3",
      url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Farm+Landscape",
      title: "Cotton Farm",
      description: "Expansive cotton farming area",
    },
  ],
  GEMSTONE: [
    {
      id: "gemstone-1",
      url: "/placeholder.svg?height=1080&width=1080&text=Mining+Site",
      title: "Mining Site",
      description: "Gemstone mining operations",
    },
    {
      id: "gemstone-2",
      url: "/placeholder.svg?height=1080&width=1080&text=Gemstone+Collection",
      title: "Gemstone Collection",
      description: "Various gemstones display",
    },
    {
      id: "gemstone-3",
      url: "/placeholder.svg?height=1080&width=1080&text=Mining+Landscape",
      title: "Mining Landscape",
      description: "Gemstone mining landscape",
    },
  ],
  GROUNDNUT: [
    {
      id: "groundnut-1",
      url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Field",
      title: "Groundnut Field",
      description: "Groundnut plants in field",
    },
    {
      id: "groundnut-2",
      url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Harvest",
      title: "Groundnut Harvest",
      description: "Harvesting groundnuts",
    },
    {
      id: "groundnut-3",
      url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Farm",
      title: "Groundnut Farm",
      description: "Traditional groundnut farming",
    },
  ],
  "GREEN GRAM": [
    {
      id: "greengram-1",
      url: "/images/crop/greengrams1.png",
      title: "Green Gram Field",
      description: "Green gram plants growing",
    },
    {
      id: "greengram-2",
      url: "/images/crop/greengrams2.png",
      title: "Green Gram Harvest",
      description: "Harvesting green gram",
    },
    {
      id: "greengram-3",
      url: "/images/crop/greengrams3.png",
      title: "Green Gram Farm",
      description: "Green gram farming area",
    },
  ],
  "PIGEON PEA": [
    {
      id: "pigeonpea-1",
      url: "/images/crop/pigeonpeas1.png",
      title: "Pigeon Pea Field",
      description: "Pigeon pea plants growing",
    },
    {
      id: "pigeonpea-2",
      url: "/images/crop/pigeonpeas2.png",
      title: "Pigeon Pea Harvest",
      description: "Harvesting pigeon peas",
    },
    {
      id: "pigeonpea-3",
      url: "/images/crop/pigeonpeas3.png",
      title: "Pigeon Pea Farm",
      description: "Pigeon pea farming landscape",
    },
  ],
  SESAME: [
    {
      id: "sesame-1",
      url: "/images/crop/sesame1.png",
      title: "Sesame Field",
      description: "Golden sesame plants in the field",
    },
    {
      id: "sesame-2",
      url: "/images/crop/sesame2.png",
      title: "Sesame Harvest",
      description: "Sesame seeds ready for harvest",
    },
    {
      id: "sesame-3",
      url: "/images/crop/sesame1.png",
      title: "Sesame Farming",
      description: "Farmers working in sesame fields",
    },
  ],
  SOYA: [
    {
      id: "soya-1",
      url: "/images/crop/soya1.png",
      title: "Soybean Field",
      description: "Green soybean plants in rows",
    },
    {
      id: "soya-2",
      url: "/images/crop/soya2.png",
      title: "Soybean Harvest",
      description: "Mature soybeans ready for harvest",
    },
    {
      id: "soya-3",
      url: "/images/crop/soya3.png",
      title: "Soybean Processing",
      description: "Soybeans being processed",
    },
  ],
  SUNFLOWER: [
    {
      id: "sunflower-1",
      url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Field",
      title: "Sunflower Field",
      description: "Bright sunflower field",
    },
    {
      id: "sunflower-2",
      url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Harvest",
      title: "Sunflower Harvest",
      description: "Harvesting sunflower seeds",
    },
    {
      id: "sunflower-3",
      url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Farm",
      title: "Sunflower Farm",
      description: "Golden sunflower farming landscape",
    },
  ],
}

const ORGANIZATION_MAP: Record<CropName, string[]> = {
  BEAN: ["COPRA", "TCDC", "WRRB"],
  CASHEW: ["CBT", "TCDC", "WRRB"],
  "CHICK PEA": ["COPRA", "TCDC", "WRRB"],
  COCOA: ["COPRA", "TCDC", "WRRB"],
  COFFEE: ["TCB", "TCDC", "WRRB"],
  COTTON: ["COPRA", "TCDC", "WRRB"],
  GEMSTONE: ["MC"],
  GROUNDNUT: ["COPRA", "TCDC", "WRRB"],
  "GREEN GRAM": ["COPRA", "TCDC", "WRRB"],
  "PIGEON PEA": ["COPRA", "TCDC", "WRRB"],
  SESAME: ["COPRA", "TCDC", "WRRB"],
  SOYA: ["COPRA", "TCDC", "WRRB"],
  SUNFLOWER: ["COPRA", "TCDC", "WRRB"],
}

const LOGO_URL_MAP: Record<string, string> = {
  TMX: "images/logos/tmx-logo.png",
  WRRB: "images/logos/wrrb-logo.png",
  COPRA: "images/logos/copra-logo.png",
  TCDC: "images/logos/tcdc-logo.png",
  TCB: "images/logos/tcb-logo.png",
  CBT: "images/logos/cbt-logo.png",
  MC: "images/logos/mc-logo.png",
}

const FACEBOOK_TAGS = [
  "@Samia Suluhu Hassan ", "@Ikulu Mawasiliano", "@Wizara ya Fedha",
  "@Wizara ya Viwanda na Biashara", "@Ofisi ya Rais - Tamisemi", "@Capital Market & Security Authority", "@Bank of Tanzania",
  "@Tume Ya Maendeleo Ya Ushirika", "@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB",
]

const INSTAGRAM_TAGS = [
  "@samia_suluhu_hassan", "@ikulu_mawasiliano", "@urtmof", "@viwandabiashara", "@ortamisemi", "@cmsa.go.tz",
  "@bankoftanzania_","@ushirika_tcdc", "@wrrbwrs",
]

const HASHTAGS = [
  "#oilseeds", "#buyers", "#trading", "#commodityexchangemarkets", "#commoditiesexchange",
  "#agriculture", "#commoditiestrading", "#seller", "#commoditytraders", "#agriculturalcommodityexhange",
  "#farmersmarket", "#onlinetradingsystem", "#agriculturalcommodityexchange", "#onlinetrading",
  "#commoditytrader", "#traders", "#tradingcommodities", "#OnlineTradingPlatform", "#buyer",
  "#commoditiesmarket", "#commodities", "#buyersmarket", "#TradingCommodities", "#trader",
  "#SellersMarket", "#online", "#agriculturalcommodities", "#farmer",
]

// --- HELPER FUNCTIONS ---
const toCamelCase = (str: string): string =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

const formatList = (items: string[], lang: "sw" | "en"): string => {
  const conjunction = lang === "sw" ? "na" : "and"
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`
}

const formatOrganizations = (orgs: string[], language: 'swahili' | 'english') => {
  if (orgs.length === 0) return ""
  if (orgs.length === 1) return orgs[0]
  if (orgs.length === 2) {
    return language === 'swahili' ? `${orgs[0]} na ${orgs[1]}` : `${orgs[0]} and ${orgs[1]}`
  }
  return language === 'swahili'
    ? `${orgs.slice(0, -1).join(", ")}, na ${orgs[orgs.length - 1]}`
    : `${orgs.slice(0, -1).join(", ")}, and ${orgs[orgs.length - 1]}`
}

const generateSocialContent = (locations: string[], crop: CropName, date: string, time: string) => {
  if (locations.length === 0 || !crop || !date || !time) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive",
    })
    return
  }

  const formattedDate = new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/")

  const organizations = ORGANIZATION_MAP[crop]
  const formattedOrganizationsSwahili = formatOrganizations(organizations, 'swahili')
  const formattedOrganizationsEnglish = formatOrganizations(organizations, 'english')
  const cropHashtag = `#${crop.toLowerCase().replace(" ", "")}`

  const formattedLocations = locations.map(toCamelCase).join(", ")
  const swahiliLocations = locations.map(toCamelCase).join(", ")

  const youtubeTitle = `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS_SW[crop]} ${swahiliLocations} MBASHARA-TMX OTS | ${formattedDate})`.toUpperCase()

  const socialMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${FACEBOOK_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim()

  const instagramMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${INSTAGRAM_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim()

  return {
    youtube: youtubeTitle,
    facebook: socialMessage,
    instagram: instagramMessage,
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast({
    title: "Copied to clipboard",
    description: "The generated content has been copied to your clipboard.",
  })
}

const ContentDisplay = ({
  label,
  content,
  onCopy,
  showCharCount = false,
}: {
  label: string
  content: string
  onCopy: () => void
  showCharCount?: boolean
}) => {
  const charCount = content.length

  return (
    <div className="relative flex-1">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="flex justify-between items-center">
        <span>{label}</span>
        {showCharCount && (
          <span className={`text-sm ${charCount < 100 ? 'text-green-500' : 'text-red-500'}`}>
            {charCount} characters
          </span>
        )}
      </Label>
      <Textarea
        id={label.toLowerCase().replace(/\s+/g, "-")}
        value={content}
        readOnly
        className="h-64 pr-10"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-8"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}

const SWAHILI_NUMBERS: Record<number, string> = {
  1: "Moja",
  2: "Mbili",
  3: "Tatu",
  4: "Nne",
  5: "Tano",
  6: "Sita",
  7: "Saba",
  8: "Nane",
  9: "Tisa",
  10: "Kumi",
  11: "Kumi na Moja",
  12: "Kumi na Mbili",
}

const getSwahiliPeriod = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Asubuhi"
  if (hour >= 12 && hour < 16) return "Mchana"
  if (hour >= 16 && hour < 19) return "Jioni"
  return "Usiku"
}

const formatTime = (time: string, lang: "sw" | "en"): string => {
  const [hour, minute] = time.split(":").map(Number)
  if (lang === "en") {
    const ampm = hour >= 12 ? "PM" : "AM"
    let h12 = hour % 12
    if (h12 === 0) h12 = 12
    const formattedMinute = minute.toString().padStart(2, "0")
    return `${h12}:${formattedMinute} ${ampm}`
  }
  let swahiliHour = hour >= 7 ? hour - 6 : hour + 6
  if (swahiliHour > 12) swahiliHour -= 12
  if (swahiliHour === 0) swahiliHour = 12
  const period = getSwahiliPeriod(hour)
  const swahiliHourWord = SWAHILI_NUMBERS[swahiliHour]
  if (minute === 0) return `Saa ${swahiliHourWord} kamili ${period}`
  if (minute === 15) return `Saa ${swahiliHourWord} na robo ${period}`
  if (minute === 30) return `Saa ${swahiliHourWord} na nusu ${period}`
  const nextSwahiliHour = (swahiliHour % 12) + 1
  const nextSwahiliHourWord = SWAHILI_NUMBERS[nextSwahiliHour]
  if (minute === 45) return `Saa ${nextSwahiliHourWord} kasorobo ${period}`
  if (minute < 30) return `Saa ${swahiliHourWord} na dakika ${minute} ${period}`
  const minutesToNextHour = 60 - minute
  return `Saa ${nextSwahiliHourWord} kasoro dakika ${minutesToNextHour} ${period}`
}

interface CropImageSelectorProps {
  selectedCrop: CropName | ""
  onImageSelect: (imageUrl: string) => void
  currentImage: string | null
}

const CropImageSelector: React.FC<CropImageSelectorProps> = ({ selectedCrop, onImageSelect, currentImage }) => {
  if (!selectedCrop) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Select a crop to see relevant background images</p>
      </div>
    )
  }

  const cropImages = CROP_BACKGROUND_IMAGES[selectedCrop] || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {CROP_NAMES_EN[selectedCrop]} Background Images ({cropImages.length} available)
        </Label>
        <Badge variant="outline" className="text-xs">
          {selectedCrop}
        </Badge>
      </div>

      <ScrollArea className="h-64 w-full border rounded-md p-2">
        <div className="grid grid-cols-2 gap-2">
          {cropImages.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer border rounded-md overflow-hidden transition-colors ${
                currentImage === image.url ? "border-blue-500 ring-2 ring-blue-200" : "hover:border-blue-500"
              }`}
              onClick={() => onImageSelect(image.url)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-24 object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {currentImage === image.url ? "Selected" : "Select"}
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                <div className="truncate font-medium" title={image.title}>
                  {image.title}
                </div>
                <div className="text-gray-300 text-xs truncate" title={image.description}>
                  {image.description}
                </div>
              </div>
              {currentImage === image.url && (
                <div className="absolute top-1 right-1">
                  <Check className="h-4 w-4 text-blue-500 bg-white rounded-full p-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p>
          💡 <strong>Tip:</strong> These images are specifically curated for {CROP_NAMES_EN[selectedCrop]} auctions. You
          can also upload your own custom image using the upload button above.
        </p>
      </div>
    </div>
  )
}

interface EditableContentGeneratorProps {
  locations: string[]
  setLocations: (locations: string[]) => void
  crop: CropName | ""
  setCrop: (crop: CropName | "") => void
  date: string
  setDate: (date: string) => void
  time: string
  setTime: (time: string) => void
  onApplyContent: (content: Partial<PosterState>) => void
}

const EditableContentGenerator: React.FC<EditableContentGeneratorProps> = ({
  locations,
  setLocations,
  crop,
  setCrop,
  date,
  setDate,
  time,
  setTime,
  onApplyContent,
}) => {
  const [language, setLanguage] = useState<"sw" | "en">("sw")
  const [generated, setGenerated] = useState<Partial<PosterState> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState({
    topText: "",
    heading: "",
    paragraph: "",
    dateCircleTop: "",
    dateCircleMain: "",
    dateCircleBottom: "",
  })

  const toggleLocation = (selectedLocation: string) =>
    setLocations(
      locations.includes(selectedLocation)
        ? locations.filter((loc) => loc !== selectedLocation)
        : [...locations, selectedLocation],
    )
  const toggleCrop = (selectedCrop: CropName) => setCrop(crop === selectedCrop ? "" : selectedCrop)

  const handleGenerate = () => {
    if (locations.length === 0 || !crop || !date || !time) {
      alert("Please select at least one location, a crop, a date, and a time.")
      return
    }
    const content = generatePosterContent(locations, crop, date, time, language)
    setGenerated(content)

    // Set editable content
    setEditableContent({
      topText: content.topText || "",
      heading: content.heading?.content || "",
      paragraph: content.paragraph?.content || "",
      dateCircleTop: content.dateCircle?.topText.content || "",
      dateCircleMain: content.dateCircle?.mainText.content || "",
      dateCircleBottom: content.dateCircle?.bottomText.content || "",
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (generated) {
      const updatedContent = {
        ...generated,
        topText: editableContent.topText,
        heading: { ...generated.heading!, content: editableContent.heading },
        paragraph: { ...generated.paragraph!, content: editableContent.paragraph },
        dateCircle: {
          ...generated.dateCircle!,
          topText: { ...generated.dateCircle!.topText, content: editableContent.dateCircleTop },
          mainText: { ...generated.dateCircle!.mainText, content: editableContent.dateCircleMain },
          bottomText: { ...generated.dateCircle!.bottomText, content: editableContent.dateCircleBottom },
        },
      }
      setGenerated(updatedContent)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset to original generated content
    if (generated) {
      setEditableContent({
        topText: generated.topText || "",
        heading: generated.heading?.content || "",
        paragraph: generated.paragraph?.content || "",
        dateCircleTop: generated.dateCircle?.topText.content || "",
        dateCircleMain: generated.dateCircle?.mainText.content || "",
        dateCircleBottom: generated.dateCircle?.bottomText.content || "",
      })
    }
  }

  const handleApply = () => {
    if (generated) {
      onApplyContent(generated)
      alert("Content applied to poster!")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Tmx Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Language</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={language === "sw" ? "default" : "outline"}
              onClick={() => setLanguage("sw")}
              className="w-full"
            >
              Swahili
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
              className="w-full"
            >
              English
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Locations</Label>
          <div className="flex flex-wrap gap-1 sm:gap-2 max-h-48 sm:max-h-64 overflow-y-auto">
            {AVAILABLE_LOCATIONS.map((location) => {
              const isSelected = locations.includes(location)
              return (
                <Badge
                  key={location}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                  {isSelected && <Check className="ml-1 h-3 w-3" />}
                </Badge>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Crop</Label>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {CROPS.map((cropName) => {
              const isSelected = crop === cropName
              return (
                <Badge
                  key={cropName}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => toggleCrop(cropName)}
                >
                  {cropName}
                  {isSelected && <Check className="ml-1 h-3 w-3" />}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Content
        </Button>

        {generated && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-blue-800">Generated Content</CardTitle>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={handleEdit} size="sm" variant="outline">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveEdit} size="sm" variant="default">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Top Text</Label>
                    <p className="mt-1 p-2 bg-white rounded-md text-sm border whitespace-pre-wrap">
                      {editableContent.topText}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Heading</Label>
                    <p className="mt-1 p-2 bg-white rounded-md text-sm border">{editableContent.heading}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Content</Label>
                    <p className="mt-1 p-2 bg-white rounded-md text-sm border whitespace-pre-wrap">
                      {editableContent.paragraph}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Top</Label>
                      <p className="mt-1 p-2 bg-white rounded-md text-xs border">{editableContent.dateCircleTop}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Main</Label>
                      <p className="mt-1 p-2 bg-white rounded-md text-xs border">{editableContent.dateCircleMain}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Bottom</Label>
                      <p className="mt-1 p-2 bg-white rounded-md text-xs border whitespace-pre-wrap">
                        {editableContent.dateCircleBottom}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Top Text</Label>
                    <Textarea
                      value={editableContent.topText}
                      onChange={(e) => setEditableContent((prev) => ({ ...prev, topText: e.target.value }))}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Heading</Label>
                    <Input
                      value={editableContent.heading}
                      onChange={(e) => setEditableContent((prev) => ({ ...prev, heading: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Content</Label>
                    <Textarea
                      value={editableContent.paragraph}
                      onChange={(e) => setEditableContent((prev) => ({ ...prev, paragraph: e.target.value }))}
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Top</Label>
                      <Input
                        value={editableContent.dateCircleTop}
                        onChange={(e) => setEditableContent((prev) => ({ ...prev, dateCircleTop: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Main</Label>
                      <Input
                        value={editableContent.dateCircleMain}
                        onChange={(e) => setEditableContent((prev) => ({ ...prev, dateCircleMain: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Date Bottom</Label>
                      <Textarea
                        value={editableContent.dateCircleBottom}
                        onChange={(e) => setEditableContent((prev) => ({ ...prev, dateCircleBottom: e.target.value }))}
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              )}

              {!isEditing && (
                <Button onClick={handleApply} className="w-full bg-green-600 hover:bg-green-700">
                  Apply to Poster
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

interface ImageUploadProps {
  label: string
  onUpload: (url: string | null) => void
  currentImage: string | null
  isCompact?: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onUpload, currentImage, isCompact = false }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpload(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileSelect = () => inputRef.current?.click()

  return (
    <div className={`space-y-2 ${isCompact ? "flex items-center gap-2" : ""}`}>
      {!isCompact && <Label className="text-sm font-medium">{label}</Label>}
      <div className={`flex items-center gap-2 ${isCompact ? "flex-1" : ""}`}>
        <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" />
        <Button
          onClick={triggerFileSelect}
          variant="outline"
          className={`${isCompact ? "flex-1" : "w-full"} justify-center`}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isCompact ? "Change" : "Upload Image"}
        </Button>
        {currentImage && (
          <div className="flex items-center gap-2">
            <img
              src={currentImage || "/placeholder.svg"}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md border"
            />
            <Button onClick={() => onUpload(null)} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface PositionSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const PositionSlider: React.FC<PositionSliderProps> = ({ label, value, onChange, min = 0, max = POSTER_WIDTH }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}: {value}px
    </Label>
    <Slider
      value={[value]}
      onValueChange={(values) => onChange(values[0])}
      min={min}
      max={max}
      step={1}
      className="w-full"
    />
  </div>
)

// --- POSTER CANVAS ---
const OVERLAY_IMAGE_URL = "/images/backgrounds/overlay.png"

const renderRichText = (text: PositionableElement["content"]) => {
  if (typeof text !== "string") return text
  return text
    .split(/(\*\*.+?\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )
}

interface PosterCanvasProps extends PosterState {
  id: string
}

// PosterCanvas component renders the poster with all elements positioned correctly
const PosterCanvas: React.FC<PosterCanvasProps> = (props) => {
  const {
    id,
    topText,
    heading,
    paragraph,
    backgroundImage,
    backgroundStyle,
    headerFooterBackgroundColor,
    dateCircle,
    topLeftLogo,
    topRightLogo,
    footerLogos,
  } = props

  return (
    <div
      id={id}
      className="bg-[#002f2f] relative overflow-hidden text-white"
      style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
    >
      {backgroundImage && (
        <img
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: backgroundStyle.objectFit, objectPosition: backgroundStyle.objectPosition }}
          crossOrigin="anonymous"
        />
      )}

      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundImage: `url(${OVERLAY_IMAGE_URL})`, mixBlendMode: "normal", opacity: 1 }}
      />

      <header
        className="absolute top-0 left-0 right-0 flex justify-between items-center z-10"
        style={{ backgroundColor: headerFooterBackgroundColor, padding: "16px 40px" }}
      >
        <div className="w-1/4 flex justify-start">
          {topLeftLogo && (
            <img
              src={topLeftLogo || "/placeholder.svg"}
              alt="Top Left Logo"
              className="max-h-[80px] w-auto"
              crossOrigin="anonymous"
            />
          )}
        </div>
        <div className="w-1/2 text-center font-bold text-black text-2xl leading-tight whitespace-pre-wrap">
          {topText}
        </div>
        <div className="w-1/4 flex justify-end">
          {topRightLogo && (
            <img
              src={topRightLogo || "/placeholder.svg"}
              alt="Top Right Logo"
              className="max-h-[80px] w-auto"
              crossOrigin="anonymous"
            />
          )}
        </div>
      </header>

      <main className="absolute top-0 left-0 w-full h-full z-0">
        <div
          className="absolute z-20"
          style={{ top: dateCircle.position.y, left: dateCircle.position.x, transform: "translate(-50%, -50%)" }}
        >
          <div
            className="bg-[#009A9A] rounded-full text-center shadow-lg relative"
            style={{ width: 200, height: 200, padding: 16 }}
          >
            <div
              className="absolute text-xl font-medium w-full"
              style={{
                top: dateCircle.topText.position.y,
                left: dateCircle.topText.position.x,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dateCircle.topText.content}
            </div>
            <div
              className="absolute text-8xl font-bold leading-none my-1 w-full"
              style={{
                top: dateCircle.mainText.position.y,
                left: dateCircle.mainText.position.x,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dateCircle.mainText.content}
            </div>
            <div
              className="absolute text-xl font-medium whitespace-pre-wrap w-full"
              style={{
                top: dateCircle.bottomText.position.y,
                left: dateCircle.bottomText.position.x,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dateCircle.bottomText.content}
            </div>
          </div>
        </div>

        <div
          className="absolute"
          style={{
            top: heading.position.y,
            left: heading.position.x,
            width: `calc(100% - ${heading.position.x}px - 54px)`,
          }}
        >
          <h1 className="text-8xl font-extrabold tracking-wider">{heading.content}</h1>
        </div>

        <div
          className="absolute"
          style={{
            top: paragraph.position.y,
            left: paragraph.position.x,
            width: `calc(100% - ${paragraph.position.x}px - 54px)`,
          }}
        >
          <p className="text-[27px]/6 text-justify tracking-tight max-w-5xl whitespace-pre-wrap leading-relaxed">
            {renderRichText(paragraph.content)}
          </p>
        </div>
      </main>

      <footer
        className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-14 z-10"
        style={{ backgroundColor: headerFooterBackgroundColor, padding: "16px 40px" }}
      >
        {footerLogos.map(
          (logo, index) =>
            logo && (
              <img
                key={index}
                src={logo || "/placeholder.svg"}
                alt={`Footer Logo ${index + 1}`}
                className="max-h-[80px] max-w-[150px] object-contain"
                crossOrigin="anonymous"
              />
            ),
        )}
      </footer>
    </div>
  )
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // State for generator inputs
  const [locations, setLocations] = useState<string[]>(["SINGIDA", "DODOMA"])
  const [crop, setCrop] = useState<CropName | "">("CHICK PEA")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("10:30")

  // State for poster visual elements
  const [posterState, setPosterState] = useState<PosterState>({
    topText: "JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA",
    heading: { content: "DENGU", position: { x: 54, y: 465 } },
    paragraph: {
      content:
        "TMX, COPRA, TCDC, WRRB na Serikali ya Mikoa ya **Singida, na Dodoma** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la dengu Mikoa ya **Singida, na Dodoma**.\n\nMnada utafanyika **Jumatano**, tarehe **23/07/2025** Kuanzia **Saa Nne na nusu Asubuhi** Kwa njia ya Kidijitali.\n\nKaribuni wote",
      position: { x: 54, y: 560 },
    },
    backgroundImage: "/images/logos/tmx-logo.png",
    backgroundStyle: { objectFit: "cover", objectPosition: "center center" },
    headerFooterBackgroundColor: "#fefadf",
    dateCircle: {
      position: { x: 162, y: 300 },
      topText: { content: "Tarehe", position: { x: 100, y: 40 } },
      mainText: { content: "23", position: { x: 100, y: 90 } },
      bottomText: { content: "Julai\n2025", position: { x: 100, y: 160 } },
    },
    topLeftLogo: "/images/logos/government-logo.png",
    topRightLogo: "/images/logos/tmx-logo.png",
    footerLogos: [
      "/images/logos/tmx-logo.png",
      "/images/logos/wrrb-logo.png",
      "/images/logos/copra-logo.png",
      "/images/logos/tcdc-logo.png",
    ],
  })

  const [downloadPosterState, setDownloadPosterState] = useState<PosterState | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(1)

  // State for social media content generation
  const [generatedSocialContent, setGeneratedSocialContent] = useState({
    youtube: "",
    facebook: "",
    instagram: "",
  })

  // Auto-generate social content when inputs change
  useEffect(() => {
    if (locations.length > 0 && crop && date && time) {
      const content = generateSocialContent(locations, crop, date, time)
      if (content) {
        setGeneratedSocialContent(content)
      }
    } else {
      setGeneratedSocialContent({
        youtube: "",
        facebook: "",
        instagram: "",
      })
    }
  }, [locations, crop, date, time])

  useEffect(() => {
    const today = new Date()
    const offset = today.getTimezoneOffset()
    const localDate = new Date(today.getTime() - offset * 60 * 1000)
    setDate(localDate.toISOString().split("T")[0])
  }, [])

  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      const { width } = previewContainerRef.current.getBoundingClientRect()
      setPreviewScale(width / POSTER_WIDTH)
    }
  }, [])

  useEffect(() => {
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [updateScale])

  const handleStateChange = useCallback(<K extends keyof PosterState>(key: K, value: PosterState[K]) => {
    setPosterState((prevState) => ({ ...prevState, [key]: value }))
  }, [])

  const handleNestedChange = useCallback((path: (string | number)[], value: any) => {
    setPosterState((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState))
      let current = newState
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newState
    })
  }, [])

  const mergeContentIntoState = (prevState: PosterState, content: Partial<PosterState>): PosterState => {
    const newState = JSON.parse(JSON.stringify(prevState)) // Deep copy for safety
    if (content.topText) newState.topText = content.topText
    if (content.footerLogos) newState.footerLogos = content.footerLogos
    if (content.heading?.content) newState.heading.content = content.heading.content
    if (content.paragraph?.content) newState.paragraph.content = content.paragraph.content
    if (content.dateCircle) {
      if (content.dateCircle.topText?.content) newState.dateCircle.topText.content = content.dateCircle.topText.content
      if (content.dateCircle.mainText?.content)
        newState.dateCircle.mainText.content = content.dateCircle.mainText.content
      if (content.dateCircle.bottomText?.content)
        newState.dateCircle.bottomText.content = content.dateCircle.bottomText.content
    }
    return newState
  }

  const handleContentUpdate = useCallback((content: Partial<PosterState>) => {
    setPosterState((prevState) => mergeContentIntoState(prevState, content))
  }, [])

  const handleBackgroundStyleChange = useCallback(
    (key: keyof BackgroundStyle, value: string) => {
      handleStateChange("backgroundStyle", { ...posterState.backgroundStyle, [key]: value })
    },
    [posterState.backgroundStyle, handleStateChange],
  )

  const captureCanvas = async (elementId: string): Promise<string> => {
    const posterElement = document.getElementById(elementId)
    if (!posterElement) throw new Error(`Element with id ${elementId} not found.`)

    return toPng(posterElement, {
      width: POSTER_WIDTH,
      height: POSTER_HEIGHT,
      canvasWidth: POSTER_WIDTH,
      canvasHeight: POSTER_HEIGHT,
      pixelRatio: 1,
      skipAutoScale: true,
      cacheBust: true,
      style: {
        width: `${POSTER_WIDTH}px`,
        height: `${POSTER_HEIGHT}px`,
      },
    })
  }

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = async () => {
    if (!crop) {
      alert("Please select a crop before downloading.")
      return
    }
    setIsDownloading(true)
    try {
      // Generate and capture English version
      const enContent = generatePosterContent(locations, crop, date, time, "en")
      setDownloadPosterState(mergeContentIntoState(posterState, enContent))
      await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for DOM update
      const enDataUrl = await captureCanvas("download-poster")
      triggerDownload(enDataUrl, `poster_${CROP_NAMES_EN[crop].toLowerCase().replace(" ", "_")}_en.png`)

      // Generate and capture Swahili version
      const swContent = generatePosterContent(locations, crop, date, time, "sw")
      setDownloadPosterState(mergeContentIntoState(posterState, swContent))
      await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for DOM update
      const swDataUrl = await captureCanvas("download-poster")
      triggerDownload(swDataUrl, `poster_${CROP_TRANSLATIONS_SW[crop].toLowerCase().replace(" ", "_")}_sw.png`)
    } catch (err) {
      console.error("Failed to download poster:", err)
      alert("An error occurred while downloading the poster. Check the console for details.")
    } finally {
      setIsDownloading(false)
      setDownloadPosterState(null)
    }
  }

  const handleFooterLogoChange = (index: number, value: string | null) => {
    const newLogos = [...posterState.footerLogos]
    if (value === null) {
      newLogos.splice(index, 1)
    } else {
      newLogos[index] = value
    }
    handleStateChange("footerLogos", newLogos)
  }

  const addFooterLogo = () => handleStateChange("footerLogos", [...posterState.footerLogos, ""])
  const removeFooterLogo = (index: number) =>
    handleStateChange(
      "footerLogos",
      posterState.footerLogos.filter((_, i) => i !== index),
    )

  return (
    <div className="min-h-screen">
      {/* Hidden canvas for high-resolution downloads */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {downloadPosterState && <PosterCanvas {...downloadPosterState} id="download-poster" />}
      </div>

      <div className="max-w-screen mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            
              <div className="space-y-6">
                <EditableContentGenerator
                  onApplyContent={handleContentUpdate}
                  {...{ locations, setLocations, crop, setCrop, date, setDate, time, setTime }}
                />

                <Tabs defaultValue="content" className="w-full ">
                   <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
                     <TabsTrigger value="content" className="text-xs sm:text-sm">
                       <Type className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                       <span className="hidden sm:inline">Content</span>
                       <span className="sm:hidden">Cont</span>
                     </TabsTrigger>
                     <TabsTrigger value="design" className="text-xs sm:text-sm">
                       <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                       <span className="hidden sm:inline">Design</span>
                       <span className="sm:hidden">Des</span>
                     </TabsTrigger>
                     <TabsTrigger value="images" className="text-xs sm:text-sm">
                       <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                       <span className="hidden sm:inline">Images</span>
                       <span className="sm:hidden">Img</span>
                     </TabsTrigger>
                     <TabsTrigger value="date" className="text-xs sm:text-sm">
                       <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                       <span className="hidden sm:inline">Date</span>
                       <span className="sm:hidden">Date</span>
                     </TabsTrigger>
                     <TabsTrigger value="copy-pasta" className="text-xs sm:text-sm">
                       <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                       <span className="hidden sm:inline">Copy Pasta</span>
                       <span className="sm:hidden">Copy</span>
                     </TabsTrigger>
                   </TabsList>

                  <TabsContent value="content" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Header & Footer</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="topText">Top Center Text</Label>
                          <Textarea
                            id="topText"
                            value={posterState.topText}
                            onChange={(e) => handleStateChange("topText", e.target.value)}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="headerColor">Header/Footer Background</Label>
                          <Input
                            id="headerColor"
                            type="color"
                            value={posterState.headerFooterBackgroundColor.slice(0, 7)}
                            onChange={(e) => handleStateChange("headerFooterBackgroundColor", e.target.value)}
                            className="mt-1 h-10"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Main Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="heading">Main Heading</Label>
                          <Input
                            id="heading"
                            value={posterState.heading.content}
                            onChange={(e) => handleNestedChange(["heading", "content"], e.target.value)}
                            className="mt-1"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <PositionSlider
                              label="X Position"
                              value={posterState.heading.position.x}
                              onChange={(v) => handleNestedChange(["heading", "position", "x"], v)}
                            />
                            <PositionSlider
                              label="Y Position"
                              value={posterState.heading.position.y}
                              onChange={(v) => handleNestedChange(["heading", "position", "y"], v)}
                            />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label htmlFor="paragraph">Main Paragraph</Label>
                          <Textarea
                            id="paragraph"
                            value={posterState.paragraph.content}
                            onChange={(e) => handleNestedChange(["paragraph", "content"], e.target.value)}
                            rows={8}
                            className="mt-1"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <PositionSlider
                              label="X Position"
                              value={posterState.paragraph.position.x}
                              onChange={(v) => handleNestedChange(["paragraph", "position", "x"], v)}
                            />
                            <PositionSlider
                              label="Y Position"
                              value={posterState.paragraph.position.y}
                              onChange={(v) => handleNestedChange(["paragraph", "position", "y"], v)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Background</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ImageUpload
                          label="Upload Custom Background"
                          onUpload={(url) => handleStateChange("backgroundImage", url)}
                          currentImage={posterState.backgroundImage}
                        />

                        <Separator />

                        <div>
                          <Label className="text-sm font-medium mb-3 block">Crop-Specific Backgrounds</Label>
                          <CropImageSelector
                            selectedCrop={crop}
                            onImageSelect={(imageUrl) => handleStateChange("backgroundImage", imageUrl)}
                            currentImage={posterState.backgroundImage}
                          />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Image Fit</Label>
                            <Select
                              value={posterState.backgroundStyle.objectFit}
                              onValueChange={(v) => handleBackgroundStyleChange("objectFit", v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cover">Cover</SelectItem>
                                <SelectItem value="contain">Contain</SelectItem>
                                <SelectItem value="fill">Fill</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="scale-down">Scale Down</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Image Position</Label>
                            <Select
                              value={posterState.backgroundStyle.objectPosition}
                              onValueChange={(v) => handleBackgroundStyleChange("objectPosition", v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="bottom">Bottom</SelectItem>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Logos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ImageUpload
                          label="Top Left Logo"
                          onUpload={(url) => handleStateChange("topLeftLogo", url)}
                          currentImage={posterState.topLeftLogo}
                        />
                        <ImageUpload
                          label="Top Right Logo"
                          onUpload={(url) => handleStateChange("topRightLogo", url)}
                          currentImage={posterState.topRightLogo}
                        />
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Footer Logos</Label>
                          <div className="space-y-3">
                            {posterState.footerLogos.map((logo, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <ImageUpload
                                  label={`Footer Logo ${index + 1}`}
                                  onUpload={(url) => handleFooterLogoChange(index, url)}
                                  currentImage={logo}
                                  isCompact={true}
                                />
                                <Button onClick={() => removeFooterLogo(index)} variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button onClick={addFooterLogo} variant="outline" className="w-full bg-transparent">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Footer Logo
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="date" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Date Circle</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Circle Position</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "position", "x"], v)}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "position", "y"], v)}
                            />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Top Text</Label>
                          <Input
                            value={posterState.dateCircle.topText.content}
                            onChange={(e) => handleNestedChange(["dateCircle", "topText", "content"], e.target.value)}
                            className="mb-3"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.topText.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "topText", "position", "x"], v)}
                              max={200}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.topText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "topText", "position", "y"], v)}
                              max={200}
                            />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Main Text</Label>
                          <Input
                            value={posterState.dateCircle.mainText.content}
                            onChange={(e) => handleNestedChange(["dateCircle", "mainText", "content"], e.target.value)}
                            className="mb-3"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.mainText.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "mainText", "position", "x"], v)}
                              max={200}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.mainText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "mainText", "position", "y"], v)}
                              max={200}
                            />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Bottom Text</Label>
                          <Textarea
                            value={posterState.dateCircle.bottomText.content}
                            onChange={(e) =>
                              handleNestedChange(["dateCircle", "bottomText", "content"], e.target.value)
                            }
                            rows={2}
                            className="mb-3"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.bottomText.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "bottomText", "position", "x"], v)}
                              max={200}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.bottomText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "bottomText", "position", "y"], v)}
                              max={200}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="copy-pasta" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Social Media Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {generatedSocialContent.youtube ? (
                          <Tabs defaultValue="youtube" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="youtube">YouTube</TabsTrigger>
                              <TabsTrigger value="facebook">Facebook</TabsTrigger>
                              <TabsTrigger value="instagram">Instagram</TabsTrigger>
                            </TabsList>
                            <TabsContent value="youtube">
                              <ContentDisplay
                                label="YouTube Title"
                                content={generatedSocialContent.youtube}
                                onCopy={() => copyToClipboard(generatedSocialContent.youtube)}
                                showCharCount
                              />
                            </TabsContent>
                            <TabsContent value="facebook">
                              <ContentDisplay
                                label="Facebook Post"
                                content={generatedSocialContent.facebook}
                                onCopy={() => copyToClipboard(generatedSocialContent.facebook)}
                              />
                            </TabsContent>
                            <TabsContent value="instagram">
                              <ContentDisplay
                                label="Instagram Caption"
                                content={generatedSocialContent.instagram}
                                onCopy={() => copyToClipboard(generatedSocialContent.instagram)}
                              />
                            </TabsContent>
                          </Tabs>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Copy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Select locations, crop, date, and time to generate social media content</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Card>
                  <CardContent className="pt-6">
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {isDownloading ? "Downloading..." : "Download Posters (EN & SW)"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            
          </div>

          {/* Poster Preview */}
          <div className="lg:col-span-2 sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Poster Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={previewContainerRef} className="w-full mx-auto" style={{ aspectRatio: "1 / 1" }}>
                  <div className="w-full h-full flex justify-center items-center overflow-hidden">
                    <div style={{ transform: `scale(${previewScale})`, transformOrigin: "center center" }}>
                      <PosterCanvas {...posterState} id="visible-poster" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- CONTENT GENERATION ---
const generatePosterContent = (
  locations: string[],
  crop: CropName,
  date: string,
  time: string,
  lang: "sw" | "en",
): Partial<PosterState> => {
  const formattedLocations = formatList(locations.map(toCamelCase), lang)
  const organizations = ORGANIZATION_MAP[crop] || []
  const formattedOrganizations = formatList(organizations, lang)
  const formattedTime = formatTime(time, lang)
  const dateObj = new Date(date + "T12:00:00Z")
  const day = dateObj.toLocaleDateString("en-GB", { day: "2-digit" })
  const swahiliMonth = dateObj.toLocaleDateString("sw-TZ", { month: "long" })
  const englishMonth = dateObj.toLocaleDateString("en-US", { month: "long" })
  const year = dateObj.getFullYear()
  const swahiliWeekday = dateObj.toLocaleDateString("sw-TZ", { weekday: "long" })
  const englishWeekday = dateObj.toLocaleDateString("en-US", { weekday: "long" })
  const fullDateGB = dateObj.toLocaleDateString("en-GB")

  let topText: string, heading: string, paragraph: string
  let dateCircleContent: {
    topText: PositionableElement
    mainText: PositionableElement
    bottomText: PositionableElement
  }

  if (lang === "sw") {
    const cropSwahili = CROP_TRANSLATIONS_SW[crop]
    topText = `JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA`
    heading = cropSwahili.toUpperCase()
    if (locations.length < 2) {
      paragraph = `**${formattedOrganizations}** na Serikali ya Mkoa wa **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mkoa wa **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`
    } else {
      paragraph = `TMX, ${formattedOrganizations} na Serikali ya Mikoa ya **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mikoa ya **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`
    }
    dateCircleContent = {
      topText: { content: "Tarehe", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: { content: `${swahiliMonth}\n${year}`, position: { x: 100, y: 160 } },
    }
  } else {
    const cropEnglish = CROP_NAMES_EN[crop]
    const regionText = `Region${locations.length > 1 ? "s" : ""}`
    topText = `THE UNITED REPUBLIC OF TANZANIA\nMINISTRY OF FINANCE\nTANZANIA MERCANTILE EXCHANGE`
    heading = cropEnglish.toUpperCase()
    if (locations.length < 2 ){
      paragraph = `TMX, ${formattedOrganizations} the Regional and District Government Authority of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`
    } else {
      paragraph = `TMX, ${formattedOrganizations} the Regional and District Government Authorities of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`
    }
    dateCircleContent = {
      topText: { content: "Date", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: { content: `${englishMonth}\n${year}`, position: { x: 100, y: 160 } },
    }
  }

  const footerLogos = [LOGO_URL_MAP["TMX"], ...organizations.map((org) => LOGO_URL_MAP[org]).filter(Boolean)].filter(
    (v, i, a) => a.indexOf(v) === i,
  )

  return {
    topText,
    heading: { content: heading, position: { x: 54, y: 465 } },
    paragraph: { content: paragraph, position: { x: 54, y: 560 } },
    dateCircle: { ...dateCircleContent, position: { x: 162, y: 300 } },
    footerLogos,
  }
}

export default App