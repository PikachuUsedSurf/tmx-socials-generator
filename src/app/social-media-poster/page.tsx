"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import html2canvas from "html2canvas"
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
import { Download, Upload, Trash2, Check, Plus, Palette, Type, ImageIcon, Calendar, Sparkles } from "lucide-react"

// Types
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
  downloadPosition?: Position
}

interface DateCircleState {
  position: Position
  downloadPosition?: Position
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

// Constants
type CropName =
  | "COFFEE"
  | "SESAME"
  | "SOYA"
  | "BEAN"
  | "COCOA"
  | "CHICK PEA"
  | "PIGEON PEA"
  | "CASHEW"
  | "COTTON"
  | "SUNFLOWER"
  | "GROUNDNUT"
  | "GEMSTONE"
  | "GREEN GRAM"

const AVAILABLE_LOCATIONS: string[] = [
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
]

const CROPS: CropName[] = [
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
]

const CROP_TRANSLATIONS_SW: Record<CropName, string> = {
  COFFEE: "KAHAWA",
  SESAME: "UFUTA",
  SOYA: "SOYA",
  BEAN: "MAHARAGE",
  COCOA: "KAKAO",
  "CHICK PEA": "DENGU",
  "PIGEON PEA": "MBAAZI",
  CASHEW: "KOROSHO",
  COTTON: "PAMBA",
  SUNFLOWER: "ALIZETI",
  GROUNDNUT: "KARANGA",
  GEMSTONE: "MADINI",
  "GREEN GRAM": "CHOROKO",
}

const CROP_NAMES_EN: Record<CropName, string> = {
  COFFEE: "Coffee",
  SESAME: "Sesame",
  SOYA: "Soya",
  BEAN: "Beans",
  COCOA: "Cocoa",
  "CHICK PEA": "Chick Peas",
  "PIGEON PEA": "Pigeon Peas",
  CASHEW: "Cashews",
  COTTON: "Cotton",
  SUNFLOWER: "Sunflower",
  GROUNDNUT: "Groundnuts",
  GEMSTONE: "Gemstones",
  "GREEN GRAM": "Green Grams",
}

const ORGANIZATION_MAP: Record<CropName, string[]> = {
  COFFEE: ["TCB", "TCDC", "WRRB"],
  CASHEW: ["CBT", "TCDC", "WRRB"],
  GEMSTONE: ["MC"],
  SESAME: ["COPRA", "TCDC", "WRRB"],
  SOYA: ["COPRA", "TCDC", "WRRB"],
  BEAN: ["COPRA", "TCDC", "WRRB"],
  COCOA: ["COPRA", "TCDC", "WRRB"],
  "CHICK PEA": ["COPRA", "TCDC", "WRRB"],
  "PIGEON PEA": ["COPRA", "TCDC", "WRRB"],
  COTTON: ["COPRA", "TCDC", "WRRB"],
  SUNFLOWER: ["COPRA", "TCDC", "WRRB"],
  GROUNDNUT: ["COPRA", "TCDC", "WRRB"],
  "GREEN GRAM": ["COPRA", "TCDC", "WRRB"],
}

// Updated to use local images from public folder
const LOGO_URL_MAP: Record<string, string> = {
  TMX: "/images/logos/tmx-logo.png",
  WRRB: "/images/logos/wrrb-logo.png",
  COPRA: "/images/logos/copra-logo.png",
  TCDC: "/images/logos/tcdc-logo.png",
  TCB: "/images/logos/tcb-logo.png",
  CBT: "/images/logos/cbt-logo.png",
  MC: "/images/logos/mc-logo.png",
}

// Helper functions
const toCamelCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

const formatList = (items: string[], lang: "sw" | "en"): string => {
  const conjunction = lang === "sw" ? "na" : "and"
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`
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

  let topText: string
  let heading: string
  let paragraph: string
  let dateCircleContent: {
    topText: PositionableElement
    mainText: PositionableElement
    bottomText: PositionableElement
  }

  if (lang === "sw") {
    const cropSwahili = CROP_TRANSLATIONS_SW[crop]
    topText = `JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA`
    heading = cropSwahili.toUpperCase()
    paragraph = `TMX, ${formattedOrganizations} na Serikali ya Mikoa ya **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la ${cropSwahili.toLowerCase()} Mikoa ya **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya kielektroniki.\n\nKaribuni wote`
    dateCircleContent = {
      topText: { content: "Tarehe", position: { x: 50, y: 20 } },
      mainText: { content: day, position: { x: 50, y: 50 } },
      bottomText: { content: `${swahiliMonth}\n${year}`, position: { x: 50, y: 80 } },
    }
  } else {
    const cropEnglish = CROP_NAMES_EN[crop]
    const regionText = `Region${locations.length > 1 ? "s" : ""}`

    topText = `THE UNITED REPUBLIC OF TANZANIA\nMINISTRY OF FINANCE\nTANZANIA MERCANTILE EXCHANGE`
    heading = cropEnglish.toUpperCase()
    paragraph = `TMX, ${formattedOrganizations} and the Regional Government of **${formattedLocations}** invite all Buyers and Stakeholders to participate in the ${cropEnglish.toLowerCase()} auction from the **${formattedLocations}** ${regionText}.\n\nThe auction will be held electronically on **${englishWeekday}**, **${fullDateGB}**, starting at **${formattedTime}**.\n\nAll are welcome`
    dateCircleContent = {
      topText: { content: "Date", position: { x: 50, y: 20 } },
      mainText: { content: day, position: { x: 50, y: 50 } },
      bottomText: { content: `${englishMonth}\n${year}`, position: { x: 50, y: 80 } },
    }
  }

  const footerLogos = [LOGO_URL_MAP["TMX"], ...organizations.map((org) => LOGO_URL_MAP[org]).filter(Boolean)].filter(
    (value, index, self) => self.indexOf(value) === index,
  )

  return {
    topText,
    heading: { content: heading, position: { x: 5, y: 55 } },
    paragraph: { content: paragraph, position: { x: 5, y: 68 } },
    dateCircle: {
      ...dateCircleContent,
      position: { x: 15, y: 35 },
    },
    footerLogos,
  }
}

// Content Generator Component
interface ContentGeneratorProps {
  onApplyContent: (content: Partial<PosterState>) => void
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onApplyContent }) => {
  const [locations, setLocations] = useState<string[]>([])
  const [crop, setCrop] = useState<CropName | "">("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("10:30")
  const [language, setLanguage] = useState<"sw" | "en">("sw")
  const [generated, setGenerated] = useState<Partial<PosterState> | null>(null)

  useEffect(() => {
    const today = new Date()
    const offset = today.getTimezoneOffset()
    const localDate = new Date(today.getTime() - offset * 60 * 1000)
    setDate(localDate.toISOString().split("T")[0])
  }, [])

  const toggleLocation = (selectedLocation: string) => {
    setLocations((prev) =>
      prev.includes(selectedLocation) ? prev.filter((loc) => loc !== selectedLocation) : [...prev, selectedLocation],
    )
  }

  const toggleCrop = (selectedCrop: CropName) => {
    setCrop((prev) => (prev === selectedCrop ? "" : selectedCrop))
  }

  const handleGenerate = () => {
    if (locations.length === 0 || !crop || !date || !time) {
      alert("Please select at least one location, a crop, a date, and a time.")
      return
    }
    const content = generatePosterContent(locations, crop, date, time, language)
    setGenerated(content)
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
          Content Generator
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
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
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
          <div className="flex flex-wrap gap-2">
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

        <div className="grid grid-cols-2 gap-4">
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
              <CardTitle className="text-lg text-blue-800">Generated Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-blue-700">Heading</Label>
                <p className="mt-1 p-2 bg-white rounded-md text-sm border">{generated.heading?.content}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-700">Content</Label>
                <p className="mt-1 p-2 bg-white rounded-md text-sm border whitespace-pre-wrap">
                  {generated.paragraph?.content}
                </p>
              </div>
              <Button onClick={handleApply} className="w-full bg-green-600 hover:bg-green-700">
                Apply to Poster
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

// Image Upload Component
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

// Position Slider Component
interface PositionSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const PositionSlider: React.FC<PositionSliderProps> = ({ label, value, onChange, min = 0, max = 100 }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}: {value}%
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

// Poster Canvas Component
const OVERLAY_IMAGE_URL = "/images/overlay-pattern.png" // Updated to use local image

interface PosterCanvasProps extends PosterState {
  id: string
  useDownloadLayout?: boolean
}

const renderRichText = (text: PositionableElement["content"]) => {
  if (typeof text !== "string") {
    return text
  }
  const parts = text.split(/(\*\*.+?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({
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
  useDownloadLayout = false,
}) => {
  const getPos = (element: { position: Position; downloadPosition?: Position }): Position => {
    return useDownloadLayout && element.downloadPosition ? element.downloadPosition : element.position
  }

  const headingPos = getPos(heading)
  const paragraphPos = getPos(paragraph)
  const dateCirclePos = getPos(dateCircle)
  const dateCircleTopTextPos = getPos(dateCircle.topText)
  const dateCircleMainTextPos = getPos(dateCircle.mainText)
  const dateCircleBottomTextPos = getPos(dateCircle.bottomText)

  return (
    <div id={id} className="w-full h-full bg-[#002f2f] relative overflow-hidden shadow-2xl text-white rounded-lg">
      {backgroundImage && (
        <img
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: backgroundStyle.objectFit,
            objectPosition: backgroundStyle.objectPosition,
          }}
          crossOrigin="anonymous"
        />
      )}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${OVERLAY_IMAGE_URL})`,
          mixBlendMode: "normal",
          opacity: 1,
        }}
      />

      <header
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-10 py-4 shadow-lg z-10"
        style={{ backgroundColor: headerFooterBackgroundColor }}
      >
        <div className="w-1/4 flex justify-start">
          {topLeftLogo && (
            <img
              src={topLeftLogo || "/placeholder.svg"}
              alt="Top Left Logo"
              className="max-h-[60px] w-auto"
              crossOrigin="anonymous"
            />
          )}
        </div>
        <div className="w-1/2 text-center font-bold text-black text-lg leading-tight whitespace-pre-wrap">
          {topText}
        </div>
        <div className="w-1/4 flex justify-end">
          {topRightLogo && (
            <img
              src={topRightLogo || "/placeholder.svg"}
              alt="Top Right Logo"
              className="max-h-[60px] w-auto"
              crossOrigin="anonymous"
            />
          )}
        </div>
      </header>

      <main className="absolute top-0 left-0 w-full h-full z-0">
        <div
          className="absolute z-20"
          style={{
            top: `${dateCirclePos.y}%`,
            left: `${dateCirclePos.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="bg-[#009A9A] rounded-full w-[200px] h-[200px] text-center p-4 shadow-lg relative">
            <div
              className="absolute text-lg font-medium w-full"
              style={{
                top: `${dateCircleTopTextPos.y}%`,
                left: `${dateCircleTopTextPos.x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dateCircle.topText.content}
            </div>
            <div
              className="absolute text-7xl font-bold leading-none my-1 w-full"
              style={{
                top: `${dateCircleMainTextPos.y}%`,
                left: `${dateCircleMainTextPos.x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dateCircle.mainText.content}
            </div>
            <div
              className="absolute text-lg font-medium whitespace-pre-wrap w-full"
              style={{
                top: `${dateCircleBottomTextPos.y}%`,
                left: `${dateCircleBottomTextPos.x}%`,
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
            top: `${headingPos.y}%`,
            left: `${headingPos.x}%`,
            width: `calc(95% - ${headingPos.x}%)`,
          }}
        >
          <h1 className="text-8xl font-extrabold tracking-wider">{heading.content}</h1>
        </div>

        <div
          className="absolute"
          style={{
            top: `${paragraphPos.y}%`,
            left: `${paragraphPos.x}%`,
            width: `calc(95% - ${paragraphPos.x}%)`,
          }}
        >
          <p className="text-2xl text-justify max-w-4xl whitespace-pre-wrap leading-relaxed">
            {renderRichText(paragraph.content)}
          </p>
        </div>
      </main>

      <footer
        className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-8 px-10 py-4 shadow-lg z-10"
        style={{ backgroundColor: headerFooterBackgroundColor }}
      >
        {footerLogos.map(
          (logo, index) =>
            logo && (
              <img
                key={index}
                src={logo || "/placeholder.svg"}
                alt={`Footer Logo ${index + 1}`}
                className="max-h-[60px] max-w-[120px] object-contain"
                crossOrigin="anonymous"
              />
            ),
        )}
      </footer>
    </div>
  )
}

// Main App Component
const App: React.FC = () => {
  const [posterState, setPosterState] = useState<PosterState>({
    topText: "JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA",
    heading: {
      content: "DENGU",
      position: { x: 5, y: 55 },
      downloadPosition: { x: 5, y: 55 },
    },
    paragraph: {
      content:
        "TMX, COPRA, WRRB, TCDC na Serikali ya Mikoa ya Singida na Dodoma Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la DENGU Mikoa ya Singida na Dodoma.\n\nMnada utafanyika Jumatano, tarehe 09/07/2025 Kuanzia saa Nne na nusu Asubuhi Kwa njia ya kielektroniki.\n\nKaribuni wote",
      position: { x: 5, y: 68 },
      downloadPosition: { x: 5, y: 68 },
    },
    backgroundImage: "/images/backgrounds/default-background.jpg", // Updated to use local image
    backgroundStyle: {
      objectFit: "cover",
      objectPosition: "center center",
    },
    headerFooterBackgroundColor: "#fefadf",
    dateCircle: {
      position: { x: 15, y: 35 },
      downloadPosition: { x: 15, y: 35 },
      topText: {
        content: "Tarehe",
        position: { x: 50, y: 20 },
        downloadPosition: { x: 50, y: 20 },
      },
      mainText: {
        content: "09",
        position: { x: 50, y: 50 },
        downloadPosition: { x: 50, y: 50 },
      },
      bottomText: {
        content: "Julai\n2025",
        position: { x: 50, y: 80 },
        downloadPosition: { x: 50, y: 80 },
      },
    },
    topLeftLogo: "/images/logos/government-logo.png", // Updated to use local image
    topRightLogo: "/images/logos/tmx-logo.png", // Updated to use local image
    footerLogos: [
      "/images/logos/tmx-logo.png",
      "/images/logos/wrrb-logo.png",
      "/images/logos/copra-logo.png",
      "/images/logos/cbt-logo.png",
    ], // Updated to use local images
  })

  const [isDownloading, setIsDownloading] = useState(false)

  const handleStateChange = useCallback(<K extends keyof PosterState>(key: K, value: PosterState[K]) => {
    setPosterState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
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

  const handleContentUpdate = useCallback((content: Partial<PosterState>) => {
    setPosterState((prevState) => {
      const newState = { ...prevState }
      if (content.topText) newState.topText = content.topText
      if (content.footerLogos) newState.footerLogos = content.footerLogos

      if (content.heading?.content) {
        newState.heading = { ...prevState.heading, content: content.heading.content }
      }
      if (content.paragraph?.content) {
        newState.paragraph = { ...prevState.paragraph, content: content.paragraph.content }
      }
      if (content.dateCircle) {
        const newDateCircle = { ...prevState.dateCircle }
        if (content.dateCircle.topText?.content)
          newDateCircle.topText = { ...prevState.dateCircle.topText, content: content.dateCircle.topText.content }
        if (content.dateCircle.mainText?.content)
          newDateCircle.mainText = { ...prevState.dateCircle.mainText, content: content.dateCircle.mainText.content }
        if (content.dateCircle.bottomText?.content)
          newDateCircle.bottomText = {
            ...prevState.dateCircle.bottomText,
            content: content.dateCircle.bottomText.content,
          }
        newState.dateCircle = newDateCircle
      }
      return newState
    })
  }, [])

  const handleBackgroundStyleChange = useCallback((key: keyof BackgroundStyle, value: string) => {
    setPosterState((prevState) => ({
      ...prevState,
      backgroundStyle: {
        ...prevState.backgroundStyle,
        [key]: value,
      },
    }))
  }, [])

  const handleDownload = useCallback(() => {
    const posterElement = document.getElementById("download-poster")
    if (posterElement) {
      setIsDownloading(true)
      html2canvas(posterElement, {
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        logging: true,
      })
        .then((canvas: HTMLCanvasElement) => {
          const link = document.createElement("a")
          link.download = "poster.png"
          link.href = canvas.toDataURL("image/png")

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch((err: any) => {
          console.error("Failed to download poster:", err)
          alert("An error occurred while downloading the poster. Check the console for details.")
        })
        .finally(() => {
          setIsDownloading(false)
        })
    }
  }, [])

  const handleFooterLogoChange = (index: number, value: string | null) => {
    const newLogos = [...posterState.footerLogos]
    if (value === null) {
      newLogos.splice(index, 1)
    } else {
      newLogos[index] = value
    }
    handleStateChange("footerLogos", newLogos)
  }

  const addFooterLogo = () => {
    handleStateChange("footerLogos", [...posterState.footerLogos, ""])
  }

  const removeFooterLogo = (index: number) => {
    const newLogos = posterState.footerLogos.filter((_, i) => i !== index)
    handleStateChange("footerLogos", newLogos)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden download canvas */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, width: "1000px", height: "1000px" }}>
        <PosterCanvas {...posterState} id="download-poster" useDownloadLayout={true} />
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {/* AI Content Generator */}
                <ContentGenerator onApplyContent={handleContentUpdate} />

                {/* Editing Controls */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content" className="text-xs">
                      <Type className="h-4 w-4 mr-1" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="design" className="text-xs">
                      <Palette className="h-4 w-4 mr-1" />
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="images" className="text-xs">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="date" className="text-xs">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
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
                            onChange={(e) => handleStateChange("headerFooterBackgroundColor", `${e.target.value}4D`)}
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
                          <div className="grid grid-cols-2 gap-4 mt-3">
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
                          <div className="grid grid-cols-2 gap-4 mt-3">
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

                  <TabsContent value="design" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Background</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ImageUpload
                          label="Background Image"
                          onUpload={(url) => handleStateChange("backgroundImage", url)}
                          currentImage={posterState.backgroundImage}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Image Fit</Label>
                            <Select
                              value={posterState.backgroundStyle.objectFit}
                              onValueChange={(value) => handleBackgroundStyleChange("objectFit", value)}
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
                              onValueChange={(value) => handleBackgroundStyleChange("objectPosition", value)}
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

                  <TabsContent value="images" className="space-y-4">
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

                  <TabsContent value="date" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Date Circle</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Circle Position</Label>
                          <div className="grid grid-cols-2 gap-4">
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
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.topText.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "topText", "position", "x"], v)}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.topText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "topText", "position", "y"], v)}
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
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider
                              label="X"
                              value={posterState.dateCircle.mainText.position.x}
                              onChange={(v) => handleNestedChange(["dateCircle", "mainText", "position", "x"], v)}
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.mainText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "mainText", "position", "y"], v)}
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
                            />
                            <PositionSlider
                              label="Y"
                              value={posterState.dateCircle.bottomText.position.y}
                              onChange={(v) => handleNestedChange(["dateCircle", "bottomText", "position", "y"], v)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Download Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {isDownloading ? "Downloading..." : "Download Poster"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Poster Preview */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Poster Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-[800px] mx-auto aspect-square">
                  <PosterCanvas {...posterState} id="visible-poster" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
