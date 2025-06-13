"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

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

const AVAILABLE_LOCATIONS = [
  "SINGIDA", "MBEYA", "MANYARA", "SONGEA", "RUVUMA", "MTWARA", "DODOMA", "LINDI", "MOROGORO", "PWANI",
  "ARUSHA", "DAR ES SALAAM", "GEITA", "IRINGA", "KAGERA", "KATAVI", "KIGOMA", "KILIMANJARO", "MARA",
  "MWANZA", "NJOMBE", "PEMBA", "RUKWA", "SHINYANGA", "SIMIYU", "SONGWE", "TABORA", "TANGA", "ZANZIBAR",
]

const CROPS: CropName[] = [
  "COFFEE", "SESAME", "SOYA", "BEAN", "COCOA", "CHICK PEA", "PIGEON PEA",
  "CASHEW", "COTTON", "SUNFLOWER", "GROUNDNUT", "GEMSTONE", "GREEN GRAM"
]

const CROP_TRANSLATIONS: Record<CropName, string> = {
  COFFEE: "KAHAWA", SESAME: "UFUTA", SOYA: "SOYA", BEAN: "MAHARAGE", COCOA: "KAKAO",
  "CHICK PEA": "DENGU", "PIGEON PEA": "MBAAZI", CASHEW: "KOROSHO", COTTON: "PAMBA",
  SUNFLOWER: "ALIZETI", GROUNDNUT: "KARANGA", GEMSTONE: "MADINI", "GREEN GRAM": "CHOROKO",
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
// "@wizara_ya_kilimo"

const HASHTAGS = [
  "#oilseeds", "#buyers", "#trading", "#commodityexchangemarkets", "#commoditiesexchange",
  "#agriculture", "#commoditiestrading", "#seller", "#commoditytraders", "#agriculturalcommodityexhange",
  "#farmersmarket", "#onlinetradingsystem", "#agriculturalcommodityexchange", "#onlinetrading",
  "#commoditytrader", "#traders", "#tradingcommodities", "#OnlineTradingPlatform", "#buyer",
  "#commoditiesmarket", "#commodities", "#buyersmarket", "#TradingCommodities", "#trader",
  "#SellersMarket", "#online", "#agriculturalcommodities", "#farmer",
]

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function SocialMediaTitleGenerator() {
  const [locations, setLocations] = useState<string[]>([])
  const [crop, setCrop] = useState<CropName | "">("")
  const [date, setDate] = useState("")
  const [generatedContent, setGeneratedContent] = useState({
    youtube: "",
    facebook: "",
    instagram: "",
    instagramResult: "",
    facebookResult: "",
  })

  useEffect(() => {
    const today = new Date()
    setDate(today.toISOString().split("T")[0])
  }, [])

  const toggleLocation = (selectedLocation: string) => {
    setLocations((prev) =>
      prev.includes(selectedLocation)
        ? prev.filter((loc) => loc !== selectedLocation)
        : [...prev, selectedLocation]
    )
  }

  const toggleCrop = (selectedCrop: CropName) => {
    setCrop((prev) => (prev === selectedCrop ? "" : selectedCrop))
  }

  const toCamelCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const formattedLocations = useMemo(
    () => locations.map(toCamelCase).join(", "),
    [locations]
  )
  const swahiliLocations = useMemo(
    () => locations.map(toCamelCase).join(", "),
    [locations]
  )

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

  const generateContent = () => {
    if (locations.length === 0 || !crop || !date) {
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

    // Map crops to their respective organizations
    const ORGANIZATION_MAP: Record<CropName, string[]> = {
      COFFEE: ["TCB", "TCDC", "WRRB"],
      CASHEW: ["CBT", "TCDC", "WRRB"],
      GEMSTONE: ["MC", "RMO"],
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

    const organizations = ORGANIZATION_MAP[crop]
    const formattedOrganizationsSwahili = formatOrganizations(organizations, 'swahili')
    const formattedOrganizationsEnglish = formatOrganizations(organizations, 'english')
    const cropHashtag = `#${crop.toLowerCase().replace(" ", "")}`

    const youtubeTitle = `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS[crop]} ${swahiliLocations} MBASHARA-TMX OTS | ${formattedDate})`.toUpperCase()

    const socialMessage = `
Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} Mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

${FACEBOOK_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
    `.trim()

    const instagramMessage = `
Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} Mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

${INSTAGRAM_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
    `.trim()

    const commodityPriceTitle = `
Taarifa za Bei za Bidhaa leo. Kwa taarifa zaidi tembelea tovuti kupitia kiunga kwenye bio.

Commodity Price Information Today. For more information, visit our website through the links in bio.

${FACEBOOK_TAGS.join("\n")}

#sesame #chickpeas #coffee #soya #kahawa #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #sesameseeds #OnlineTradingPlatform
    `.trim()

    const commodityPriceTitleInstagram = commodityPriceTitle.replace(
      FACEBOOK_TAGS.join("\n"),
      INSTAGRAM_TAGS.join("\n")
    )

    setGeneratedContent({
      youtube: youtubeTitle,
      facebook: socialMessage,
      instagram: instagramMessage,
      instagramResult: commodityPriceTitleInstagram,
      facebookResult: commodityPriceTitle,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard.",
    })
  }

  return (
    <div className="w-auto mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Locations</Label>
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            layout
            transition={transitionProps}
          >
            {AVAILABLE_LOCATIONS.map((location) => {
              const isSelected = locations.includes(location)
              return (
                <motion.button
                  key={location}
                  onClick={() => toggleLocation(location)}
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: isSelected ? "black" : "white",
                    color: isSelected ? "white" : "black",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{
                    ...transitionProps,
                    backgroundColor: { duration: 0.1 },
                  }}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    border border-black
                  `}
                >
                  <motion.div 
                    className="relative flex items-center"
                    animate={{ 
                      paddingRight: isSelected ? "1.5rem" : "0",
                    }}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.275],
                      duration: 0.3,
                    }}
                  >
                    <span>{location}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={transitionProps}
                          className="absolute right-0"
                        >
                          <Check className="w-4 h-4 ml-1" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        <div>
          <Label>Crop</Label>
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            layout
            transition={transitionProps}
          >
            {CROPS.map((cropName) => {
              const isSelected = crop === cropName
              return (
                <motion.button
                  key={cropName}
                  onClick={() => toggleCrop(cropName)}
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: isSelected ? "black" : "white",
                    color: isSelected ? "white" : "black",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{
                    ...transitionProps,
                    backgroundColor: { duration: 0.1 },
                  }}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    border border-black
                  `}
                >
                  <motion.div 
                    className="relative flex items-center"
                    animate={{ 
                      paddingRight: isSelected ? "1.5rem" : "0",
                    }}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.275],
                      duration: 0.3,
                    }}
                  >
                    <span>{cropName}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={transitionProps}
                          className="absolute right-0"
                        >
                          <Check className="w-4 h-4 ml-1" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button onClick={generateContent} className="w-full">
          Generate Content
        </Button>
        {(generatedContent.youtube ||
          generatedContent.facebook ||
          generatedContent.instagram) && (
          <Tabs defaultValue="youtube" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>
            <TabsContent value="youtube">
              <ContentDisplay
                label="YouTube Title"
                content={generatedContent.youtube}
                onCopy={() => copyToClipboard(generatedContent.youtube)}
                showCharCount
              />
            </TabsContent>
            <TabsContent value="facebook" className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
              <ContentDisplay
                label="Facebook Message"
                content={generatedContent.facebook}
                onCopy={() => copyToClipboard(generatedContent.facebook)}
              />
              <ContentDisplay
                label="Facebook Results Caption"
                content={generatedContent.facebookResult}
                onCopy={() => copyToClipboard(generatedContent.facebookResult)}
              />
            </TabsContent>
            <TabsContent value="instagram" className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
              <ContentDisplay
                label="Instagram Message"
                content={generatedContent.instagram}
                onCopy={() => copyToClipboard(generatedContent.instagram)}
              />
              <ContentDisplay
                label="Instagram Results Caption"
                content={generatedContent.instagramResult}
                onCopy={() => copyToClipboard(generatedContent.instagramResult)}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

function ContentDisplay({
  label,
  content,
  onCopy,
  showCharCount = false,
}: {
  label: string
  content: string
  onCopy: () => void
  showCharCount?: boolean
}) {
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