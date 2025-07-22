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
import { Download, Upload, Trash2, Check, Plus, Palette, Type, ImageIcon, Calendar, Sparkles } from "lucide-react"

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

// --- CONSTANTS ---
const POSTER_WIDTH = 1080
const POSTER_HEIGHT = 1080

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
  "SINGIDA", "MBEYA", "MANYARA", "RUVUMA", "MTWARA", "DODOMA", "LINDI", "MOROGORO", "PWANI", "ARUSHA",
  "DAR ES SALAAM", "GEITA", "IRINGA", "KAGERA", "KATAVI", "KIGOMA", "KILIMANJARO", "MARA", "MWANZA",
  "NJOMBE", "PEMBA", "RUKWA", "SHINYANGA", "SIMIYU", "SONGWE", "TABORA", "TANGA", "ZANZIBAR",
]

const CROPS: CropName[] = [
  "COFFEE", "SESAME", "SOYA", "BEAN", "COCOA", "CHICK PEA", "PIGEON PEA", "CASHEW",
  "COTTON", "SUNFLOWER", "GROUNDNUT", "GEMSTONE", "GREEN GRAM",
]

const CROP_TRANSLATIONS_SW: Record<CropName, string> = {
  COFFEE: "KAHAWA", SESAME: "UFUTA", SOYA: "SOYA", BEAN: "MAHARAGE", COCOA: "KAKAO",
  "CHICK PEA": "DENGU", "PIGEON PEA": "MBAAZI", CASHEW: "KOROSHO", COTTON: "PAMBA",
  SUNFLOWER: "ALIZETI", GROUNDNUT: "KARANGA", GEMSTONE: "MADINI", "GREEN GRAM": "CHOROKO",
}

const CROP_NAMES_EN: Record<CropName, string> = {
  COFFEE: "Coffee", SESAME: "Sesame", SOYA: "Soya", BEAN: "Beans", COCOA: "Cocoa",
  "CHICK PEA": "Chick Peas", "PIGEON PEA": "Pigeon Peas", CASHEW: "Cashews", COTTON: "Cotton",
  SUNFLOWER: "Sunflower", GROUNDNUT: "Groundnuts", GEMSTONE: "Gemstones", "GREEN GRAM": "Green Grams",
}

const ORGANIZATION_MAP: Record<CropName, string[]> = {
  COFFEE: ["TCB", "TCDC", "WRRB"], CASHEW: ["CBT", "TCDC", "WRRB"], GEMSTONE: ["MC"],
  SESAME: ["COPRA", "TCDC", "WRRB"], SOYA: ["COPRA", "TCDC", "WRRB"], BEAN: ["COPRA", "TCDC", "WRRB"],
  COCOA: ["COPRA", "TCDC", "WRRB"], "CHICK PEA": ["COPRA", "TCDC", "WRRB"], "PIGEON PEA": ["COPRA", "TCDC", "WRRB"],
  COTTON: ["COPRA", "TCDC", "WRRB"], SUNFLOWER: ["COPRA", "TCDC", "WRRB"], GROUNDNUT: ["COPRA", "TCDC", "WRRB"],
  "GREEN GRAM": ["COPRA", "TCDC", "WRRB"],
}

const LOGO_URL_MAP: Record<string, string> = {
  TMX: "images/logos/tmx-logo.png", WRRB: "images/logos/wrrb-logo.png", COPRA: "images/logos/copra-logo.png",
  TCDC: "images/logos/tcdc-logo.png", TCB: "images/logos/tcb-logo.png", CBT: "images/logos/cbt-logo.png",
  MC: "images/logos/mc-logo.png",
}

// --- HELPER FUNCTIONS ---
const toCamelCase = (str: string): string => str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
const formatList = (items: string[], lang: "sw" | "en"): string => {
  const conjunction = lang === "sw" ? "na" : "and"
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`
}

const SWAHILI_NUMBERS: Record<number, string> = { 1: "Moja", 2: "Mbili", 3: "Tatu", 4: "Nne", 5: "Tano", 6: "Sita", 7: "Saba", 8: "Nane", 9: "Tisa", 10: "Kumi", 11: "Kumi na Moja", 12: "Kumi na Mbili" }
const getSwahiliPeriod = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Asubuhi"; if (hour >= 12 && hour < 16) return "Mchana"; if (hour >= 16 && hour < 19) return "Jioni"; return "Usiku"
}
const formatTime = (time: string, lang: "sw" | "en"): string => {
  const [hour, minute] = time.split(":").map(Number)
  if (lang === "en") {
    const ampm = hour >= 12 ? "PM" : "AM"; let h12 = hour % 12; if (h12 === 0) h12 = 12; const formattedMinute = minute.toString().padStart(2, "0"); return `${h12}:${formattedMinute} ${ampm}`
  }
  let swahiliHour = hour >= 7 ? hour - 6 : hour + 6; if (swahiliHour > 12) swahiliHour -= 12; if (swahiliHour === 0) swahiliHour = 12
  const period = getSwahiliPeriod(hour); const swahiliHourWord = SWAHILI_NUMBERS[swahiliHour]
  if (minute === 0) return `Saa ${swahiliHourWord} kamili ${period}`; if (minute === 15) return `Saa ${swahiliHourWord} na robo ${period}`; if (minute === 30) return `Saa ${swahiliHourWord} na nusu ${period}`
  const nextSwahiliHour = (swahiliHour % 12) + 1; const nextSwahiliHourWord = SWAHILI_NUMBERS[nextSwahiliHour]
  if (minute === 45) return `Saa ${nextSwahiliHourWord} kasorobo ${period}`; if (minute < 30) return `Saa ${swahiliHourWord} na dakika ${minute} ${period}`
  const minutesToNextHour = 60 - minute; return `Saa ${nextSwahiliHourWord} kasoro dakika ${minutesToNextHour} ${period}`
}

const generatePosterContent = (locations: string[], crop: CropName, date: string, time: string, lang: "sw" | "en"): Partial<PosterState> => {
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
  let dateCircleContent: { topText: PositionableElement; mainText: PositionableElement; bottomText: PositionableElement }

  if (lang === "sw") {
    const cropSwahili = CROP_TRANSLATIONS_SW[crop]
    topText = `JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA`
    heading = cropSwahili.toUpperCase()
    paragraph = `TMX, ${formattedOrganizations} na Serikali ya Mikoa ya **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la ${cropSwahili.toLowerCase()} Mikoa ya **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya kielektroniki.\n\nKaribuni wote`
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
    paragraph = `TMX, ${formattedOrganizations} and the Regional Government of **${formattedLocations}** invite all Buyers and Stakeholders to participate in the ${cropEnglish.toLowerCase()} auction from the **${formattedLocations}** ${regionText}.\n\nThe auction will be held electronically on **${englishWeekday}**, **${fullDateGB}**, starting at **${formattedTime}**.\n\nAll are welcome`
    dateCircleContent = {
      topText: { content: "Date", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: { content: `${englishMonth}\n${year}`, position: { x: 100, y: 160 } },
    }
  }

  const footerLogos = [LOGO_URL_MAP["TMX"], ...organizations.map(org => LOGO_URL_MAP[org]).filter(Boolean)].filter((v, i, a) => a.indexOf(v) === i)

  return {
    topText,
    heading: { content: heading, position: { x: 54, y: 594 } },
    paragraph: { content: paragraph, position: { x: 54, y: 734 } },
    dateCircle: { ...dateCircleContent, position: { x: 162, y: 378 } },
    footerLogos,
  }
}

// --- UI COMPONENTS ---

interface ContentGeneratorProps {
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

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ locations, setLocations, crop, setCrop, date, setDate, time, setTime, onApplyContent }) => {
  const [language, setLanguage] = useState<"sw" | "en">("sw")
  const [generated, setGenerated] = useState<Partial<PosterState> | null>(null)

  const toggleLocation = (selectedLocation: string) => setLocations(locations.includes(selectedLocation) ? locations.filter(loc => loc !== selectedLocation) : [...locations, selectedLocation])
  const toggleCrop = (selectedCrop: CropName) => setCrop(crop === selectedCrop ? "" : selectedCrop)

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
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-600" />Content Generator</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Language</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={language === "sw" ? "default" : "outline"} onClick={() => setLanguage("sw")} className="w-full">Swahili</Button>
            <Button variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")} className="w-full">English</Button>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium mb-3 block">Locations</Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">{AVAILABLE_LOCATIONS.map(location => {
            const isSelected = locations.includes(location)
            return <Badge key={location} variant={isSelected ? "default" : "outline"} className="cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => toggleLocation(location)}>{location}{isSelected && <Check className="ml-1 h-3 w-3" />}</Badge>
          })}</div>
        </div>
        <div>
          <Label className="text-sm font-medium mb-3 block">Crop</Label>
          <div className="flex flex-wrap gap-2">{CROPS.map(cropName => {
            const isSelected = crop === cropName
            return <Badge key={cropName} variant={isSelected ? "default" : "outline"} className="cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => toggleCrop(cropName)}>{cropName}{isSelected && <Check className="ml-1 h-3 w-3" />}</Badge>
          })}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label htmlFor="date" className="text-sm font-medium">Date</Label><Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" /></div>
          <div><Label htmlFor="time" className="text-sm font-medium">Time</Label><Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1" /></div>
        </div>
        <Button onClick={handleGenerate} className="w-full"><Sparkles className="mr-2 h-4 w-4" />Generate Content</Button>
        {generated && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader><CardTitle className="text-lg text-blue-800">Generated Preview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label className="text-sm font-medium text-blue-700">Heading</Label><p className="mt-1 p-2 bg-white rounded-md text-sm border">{generated.heading?.content}</p></div>
              <div><Label className="text-sm font-medium text-blue-700">Content</Label><p className="mt-1 p-2 bg-white rounded-md text-sm border whitespace-pre-wrap">{generated.paragraph?.content}</p></div>
              <Button onClick={handleApply} className="w-full bg-green-600 hover:bg-green-700">Apply to Poster</Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

interface ImageUploadProps { label: string; onUpload: (url: string | null) => void; currentImage: string | null; isCompact?: boolean }
const ImageUpload: React.FC<ImageUploadProps> = ({ label, onUpload, currentImage, isCompact = false }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { onUpload(reader.result as string) }; reader.readAsDataURL(file) }
  }
  const triggerFileSelect = () => inputRef.current?.click()
  return (
    <div className={`space-y-2 ${isCompact ? "flex items-center gap-2" : ""}`}>
      {!isCompact && <Label className="text-sm font-medium">{label}</Label>}
      <div className={`flex items-center gap-2 ${isCompact ? "flex-1" : ""}`}>
        <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" />
        <Button onClick={triggerFileSelect} variant="outline" className={`${isCompact ? "flex-1" : "w-full"} justify-center`}><Upload className="mr-2 h-4 w-4" />{isCompact ? "Change" : "Upload Image"}</Button>
        {currentImage && <div className="flex items-center gap-2"><img src={currentImage} alt="Preview" className="w-10 h-10 object-cover rounded-md border" /><Button onClick={() => onUpload(null)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></div>}
      </div>
    </div>
  )
}

interface PositionSliderProps { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }
const PositionSlider: React.FC<PositionSliderProps> = ({ label, value, onChange, min = 0, max = POSTER_WIDTH }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}: {value}px</Label>
    <Slider value={[value]} onValueChange={values => onChange(values[0])} min={min} max={max} step={1} className="w-full" />
  </div>
)

// --- POSTER CANVAS ---
const OVERLAY_IMAGE_URL = "/images/backgrounds/overlay.png"
const renderRichText = (text: PositionableElement["content"]) => {
  if (typeof text !== "string") return text
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>)
}

interface PosterCanvasProps extends PosterState { id: string }
const PosterCanvas: React.FC<PosterCanvasProps> = (props) => {
  const { id, topText, heading, paragraph, backgroundImage, backgroundStyle, headerFooterBackgroundColor, dateCircle, topLeftLogo, topRightLogo, footerLogos } = props

  return (
    <div id={id} className="bg-[#002f2f] relative overflow-hidden text-white" style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}>
      {backgroundImage && <img src={backgroundImage} alt="Background" className="absolute inset-0 w-full h-full" style={{ objectFit: backgroundStyle.objectFit, objectPosition: backgroundStyle.objectPosition }} crossOrigin="anonymous" />}
      <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: `url(${OVERLAY_IMAGE_URL})`, mixBlendMode: "normal", opacity: 1 }} />

      <header className="absolute top-0 left-0 right-0 flex justify-between items-center z-10" style={{ backgroundColor: headerFooterBackgroundColor, padding: '16px 40px' }}>
        <div className="w-1/4 flex justify-start">{topLeftLogo && <img src={topLeftLogo} alt="Top Left Logo" className="max-h-[80px] w-auto" crossOrigin="anonymous" />}</div>
        <div className="w-1/2 text-center font-bold text-black text-xl leading-tight whitespace-pre-wrap">{topText}</div>
        <div className="w-1/4 flex justify-end">{topRightLogo && <img src={topRightLogo} alt="Top Right Logo" className="max-h-[80px] w-auto" crossOrigin="anonymous" />}</div>
      </header>

      <main className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute z-20" style={{ top: dateCircle.position.y, left: dateCircle.position.x, transform: "translate(-50%, -50%)" }}>
          <div className="bg-[#009A9A] rounded-full text-center shadow-lg relative" style={{ width: 200, height: 200, padding: 16 }}>
            <div className="absolute text-xl font-medium w-full" style={{ top: dateCircle.topText.position.y, left: dateCircle.topText.position.x, transform: "translate(-50%, -50%)" }}>{dateCircle.topText.content}</div>
            <div className="absolute text-8xl font-bold leading-none my-1 w-full" style={{ top: dateCircle.mainText.position.y, left: dateCircle.mainText.position.x, transform: "translate(-50%, -50%)" }}>{dateCircle.mainText.content}</div>
            <div className="absolute text-xl font-medium whitespace-pre-wrap w-full" style={{ top: dateCircle.bottomText.position.y, left: dateCircle.bottomText.position.x, transform: "translate(-50%, -50%)" }}>{dateCircle.bottomText.content}</div>
          </div>
        </div>
        <div className="absolute" style={{ top: heading.position.y, left: heading.position.x, width: `calc(100% - ${heading.position.x}px - 54px)` }}>
          <h1 className="text-9xl font-extrabold tracking-wider">{heading.content}</h1>
        </div>
        <div className="absolute" style={{ top: paragraph.position.y, left: paragraph.position.x, width: `calc(100% - ${paragraph.position.x}px - 54px)` }}>
          <p className="text-3xl text-justify max-w-5xl whitespace-pre-wrap leading-relaxed">{renderRichText(paragraph.content)}</p>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-14 z-10" style={{ backgroundColor: headerFooterBackgroundColor, padding: '16px 40px' }}>
        {footerLogos.map((logo, index) => logo && <img key={index} src={logo} alt={`Footer Logo ${index + 1}`} className="max-h-[80px] max-w-[150px] object-contain" crossOrigin="anonymous" />)}
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
    heading: { content: "DENGU", position: { x: 54, y: 594 } },
    paragraph: { content: "TMX, COPRA, TCDC, WRRB na Serikali ya Mikoa ya **Singida, na Dodoma** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la dengu Mikoa ya **Singida, na Dodoma**.\n\nMnada utafanyika **Jumatano**, tarehe **23/07/2025** Kuanzia **Saa Nne na nusu Asubuhi** Kwa njia ya kielektroniki.\n\nKaribuni wote", position: { x: 54, y: 734 } },
    backgroundImage: "images/backgrounds/default-background.jpg",
    backgroundStyle: { objectFit: "cover", objectPosition: "center center" },
    headerFooterBackgroundColor: "#fefadf",
    dateCircle: {
      position: { x: 162, y: 378 },
      topText: { content: "Tarehe", position: { x: 100, y: 40 } },
      mainText: { content: "23", position: { x: 100, y: 100 } },
      bottomText: { content: "Julai\n2025", position: { x: 100, y: 160 } },
    },
    topLeftLogo: "/images/logos/government-logo.png",
    topRightLogo: "/images/logos/tmx-logo.png",
    footerLogos: ["images/logos/tmx-logo.png", "images/logos/wrrb-logo.png", "images/logos/copra-logo.png", "images/logos/cbt-logo.png"],
  })

  const [downloadPosterState, setDownloadPosterState] = useState<PosterState | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    const today = new Date(); const offset = today.getTimezoneOffset(); const localDate = new Date(today.getTime() - offset * 60 * 1000); setDate(localDate.toISOString().split("T")[0])
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
    setPosterState(prevState => ({ ...prevState, [key]: value }))
  }, [])

  const handleNestedChange = useCallback((path: (string | number)[], value: any) => {
    setPosterState(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState)); let current = newState
      for (let i = 0; i < path.length - 1; i++) { current = current[path[i]] }
      current[path[path.length - 1]] = value; return newState
    })
  }, [])

  const handleContentUpdate = useCallback((content: Partial<PosterState>) => {
    setPosterState(prevState => {
      const newState = { ...prevState }
      if (content.topText) newState.topText = content.topText
      if (content.footerLogos) newState.footerLogos = content.footerLogos
      if (content.heading?.content) newState.heading = { ...prevState.heading, content: content.heading.content }
      if (content.paragraph?.content) newState.paragraph = { ...prevState.paragraph, content: content.paragraph.content }
      if (content.dateCircle) {
        const newDateCircle = { ...prevState.dateCircle }
        if (content.dateCircle.topText?.content) newDateCircle.topText = { ...prevState.dateCircle.topText, content: content.dateCircle.topText.content }
        if (content.dateCircle.mainText?.content) newDateCircle.mainText = { ...prevState.dateCircle.mainText, content: content.dateCircle.mainText.content }
        if (content.dateCircle.bottomText?.content) newDateCircle.bottomText = { ...prevState.dateCircle.bottomText, content: content.dateCircle.bottomText.content }
        newState.dateCircle = newDateCircle
      }
      return newState
    })
  }, [])

  const handleBackgroundStyleChange = useCallback((key: keyof BackgroundStyle, value: string) => {
    handleStateChange("backgroundStyle", { ...posterState.backgroundStyle, [key]: value })
  }, [posterState.backgroundStyle, handleStateChange])

  const captureCanvas = async (elementId: string): Promise<string> => {
    const posterElement = document.getElementById(elementId)
    if (!posterElement) throw new Error(`Element with id ${elementId} not found.`)

    // The new implementation using html-to-image
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
      setDownloadPosterState({ ...posterState, ...enContent })
      await new Promise(resolve => setTimeout(resolve, 500)) // Wait for DOM update
      const enDataUrl = await captureCanvas("download-poster")
      triggerDownload(enDataUrl, `poster_${CROP_NAMES_EN[crop].toLowerCase().replace(" ", "_")}_en.png`)

      // Generate and capture Swahili version
      const swContent = generatePosterContent(locations, crop, date, time, "sw")
      setDownloadPosterState({ ...posterState, ...swContent })
      await new Promise(resolve => setTimeout(resolve, 500)) // Wait for DOM update
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
    const newLogos = [...posterState.footerLogos]; if (value === null) { newLogos.splice(index, 1) } else { newLogos[index] = value }; handleStateChange("footerLogos", newLogos)
  }
  const addFooterLogo = () => handleStateChange("footerLogos", [...posterState.footerLogos, ""])
  const removeFooterLogo = (index: number) => handleStateChange("footerLogos", posterState.footerLogos.filter((_, i) => i !== index))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden canvas for high-resolution downloads */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {downloadPosterState && <PosterCanvas {...downloadPosterState} id="download-poster" />}
      </div>

      <div className="max-w-8xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6">
                <ContentGenerator onApplyContent={handleContentUpdate} {...{ locations, setLocations, crop, setCrop, date, setDate, time, setTime }} />
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content"><Type className="h-4 w-4 mr-1" />Content</TabsTrigger>
                    <TabsTrigger value="design"><Palette className="h-4 w-4 mr-1" />Design</TabsTrigger>
                    <TabsTrigger value="images"><ImageIcon className="h-4 w-4 mr-1" />Images</TabsTrigger>
                    <TabsTrigger value="date"><Calendar className="h-4 w-4 mr-1" />Date</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Header & Footer</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div><Label htmlFor="topText">Top Center Text</Label><Textarea id="topText" value={posterState.topText} onChange={e => handleStateChange("topText", e.target.value)} rows={3} className="mt-1" /></div>
                        <div><Label htmlFor="headerColor">Header/Footer Background</Label><Input id="headerColor" type="color" value={posterState.headerFooterBackgroundColor.slice(0, 7)} onChange={e => handleStateChange("headerFooterBackgroundColor", e.target.value)} className="mt-1 h-10" /></div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Main Content</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="heading">Main Heading</Label><Input id="heading" value={posterState.heading.content} onChange={e => handleNestedChange(["heading", "content"], e.target.value)} className="mt-1" />
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <PositionSlider label="X Position" value={posterState.heading.position.x} onChange={v => handleNestedChange(["heading", "position", "x"], v)} />
                            <PositionSlider label="Y Position" value={posterState.heading.position.y} onChange={v => handleNestedChange(["heading", "position", "y"], v)} />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label htmlFor="paragraph">Main Paragraph</Label><Textarea id="paragraph" value={posterState.paragraph.content} onChange={e => handleNestedChange(["paragraph", "content"], e.target.value)} rows={8} className="mt-1" />
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <PositionSlider label="X Position" value={posterState.paragraph.position.x} onChange={v => handleNestedChange(["paragraph", "position", "x"], v)} />
                            <PositionSlider label="Y Position" value={posterState.paragraph.position.y} onChange={v => handleNestedChange(["paragraph", "position", "y"], v)} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="design" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Background</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <ImageUpload label="Background Image" onUpload={url => handleStateChange("backgroundImage", url)} currentImage={posterState.backgroundImage} />
                        <div className="grid grid-cols-2 gap-4">
                          <div><Label>Image Fit</Label><Select value={posterState.backgroundStyle.objectFit} onValueChange={v => handleBackgroundStyleChange("objectFit", v)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cover">Cover</SelectItem><SelectItem value="contain">Contain</SelectItem><SelectItem value="fill">Fill</SelectItem><SelectItem value="none">None</SelectItem><SelectItem value="scale-down">Scale Down</SelectItem></SelectContent></Select></div>
                          <div><Label>Image Position</Label><Select value={posterState.backgroundStyle.objectPosition} onValueChange={v => handleBackgroundStyleChange("objectPosition", v)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="center">Center</SelectItem><SelectItem value="top">Top</SelectItem><SelectItem value="bottom">Bottom</SelectItem><SelectItem value="left">Left</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent></Select></div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="images" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Logos</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <ImageUpload label="Top Left Logo" onUpload={url => handleStateChange("topLeftLogo", url)} currentImage={posterState.topLeftLogo} />
                        <ImageUpload label="Top Right Logo" onUpload={url => handleStateChange("topRightLogo", url)} currentImage={posterState.topRightLogo} />
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Footer Logos</Label>
                          <div className="space-y-3">{posterState.footerLogos.map((logo, index) => (<div key={index} className="flex items-center gap-2"><ImageUpload label={`Footer Logo ${index + 1}`} onUpload={url => handleFooterLogoChange(index, url)} currentImage={logo} isCompact={true} /><Button onClick={() => removeFooterLogo(index)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></div>))}
                            <Button onClick={addFooterLogo} variant="outline" className="w-full bg-transparent"><Plus className="mr-2 h-4 w-4" />Add Footer Logo</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="date" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Date Circle</CardTitle></CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Circle Position</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider label="X" value={posterState.dateCircle.position.x} onChange={v => handleNestedChange(["dateCircle", "position", "x"], v)} />
                            <PositionSlider label="Y" value={posterState.dateCircle.position.y} onChange={v => handleNestedChange(["dateCircle", "position", "y"], v)} />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Top Text</Label><Input value={posterState.dateCircle.topText.content} onChange={e => handleNestedChange(["dateCircle", "topText", "content"], e.target.value)} className="mb-3" />
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider label="X" value={posterState.dateCircle.topText.position.x} onChange={v => handleNestedChange(["dateCircle", "topText", "position", "x"], v)} max={200} />
                            <PositionSlider label="Y" value={posterState.dateCircle.topText.position.y} onChange={v => handleNestedChange(["dateCircle", "topText", "position", "y"], v)} max={200} />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Main Text</Label><Input value={posterState.dateCircle.mainText.content} onChange={e => handleNestedChange(["dateCircle", "mainText", "content"], e.target.value)} className="mb-3" />
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider label="X" value={posterState.dateCircle.mainText.position.x} onChange={v => handleNestedChange(["dateCircle", "mainText", "position", "x"], v)} max={200} />
                            <PositionSlider label="Y" value={posterState.dateCircle.mainText.position.y} onChange={v => handleNestedChange(["dateCircle", "mainText", "position", "y"], v)} max={200} />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Bottom Text</Label><Textarea value={posterState.dateCircle.bottomText.content} onChange={e => handleNestedChange(["dateCircle", "bottomText", "content"], e.target.value)} rows={2} className="mb-3" />
                          <div className="grid grid-cols-2 gap-4">
                            <PositionSlider label="X" value={posterState.dateCircle.bottomText.position.x} onChange={v => handleNestedChange(["dateCircle", "bottomText", "position", "x"], v)} max={200} />
                            <PositionSlider label="Y" value={posterState.dateCircle.bottomText.position.y} onChange={v => handleNestedChange(["dateCircle", "bottomText", "position", "y"], v)} max={200} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                <Card>
                  <CardContent className="pt-6">
                    <Button onClick={handleDownload} disabled={isDownloading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Download className="mr-2 h-5 w-5" />
                      {isDownloading ? "Downloading..." : "Download Posters (EN & SW)"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Poster Preview */}
          <div className="lg:col-span-2 sticky top-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Poster Preview</CardTitle></CardHeader>
              <CardContent>
                <div ref={previewContainerRef} className="w-full mx-auto" style={{ aspectRatio: '1 / 1' }}>
                  <div className="w-full h-full flex justify-center items-center overflow-hidden">
                    <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center' }}>
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

export default App

