"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CropImageSelector } from "@/components/poster";
import type {
  ObjectFit,
  BackgroundStyle,
  Position,
  PositionableElement,
  DateCircleState,
  PosterState,
  CropImage,
  CropName,
} from "@/lib/types";
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types";
import { AVAILABLE_LOCATIONS } from "@/lib/constants/locations";
import { ORGANIZATION_MAP, LOGO_URL_MAP } from "@/lib/constants/organizations";
import {
  CROPS,
  CROP_TRANSLATIONS_SW,
  CROP_NAMES_EN,
  CROP_BACKGROUND_IMAGES,
} from "@/lib/constants/crops";
import {
  toCamelCase,
  formatList,
  formatOrganizations,
} from "@/lib/utils/formatting";
import {
  SWAHILI_NUMBERS,
  getSwahiliPeriod,
  formatTime,
} from "@/lib/utils/time";

const FACEBOOK_TAGS = [
  "@Samia Suluhu Hassan ",
  "@Ikulu Mawasiliano",
  "@Wizara ya Fedha",
  "@Wizara ya Viwanda na Biashara",
  "@Ofisi ya Rais - Tamisemi",
  "@Capital Market & Security Authority",
  "@Bank of Tanzania",
  "@Tume Ya Maendeleo Ya Ushirika",
  "@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB",
];

const INSTAGRAM_TAGS = [
  "@samia_suluhu_hassan",
  "@ikulu_mawasiliano",
  "@urtmof",
  "@viwandabiashara",
  "@ortamisemi",
  "@cmsa.go.tz",
  "@bankoftanzania_",
  "@ushirika_tcdc",
  "@wrrbwrs",
];

const HASHTAGS = [
  "#oilseeds",
  "#buyers",
  "#trading",
  "#commodityexchangemarkets",
  "#commoditiesexchange",
  "#agriculture",
  "#commoditiestrading",
  "#seller",
  "#commoditytraders",
  "#agriculturalcommodityexhange",
  "#farmersmarket",
  "#onlinetradingsystem",
  "#agriculturalcommodityexchange",
  "#onlinetrading",
  "#commoditytrader",
  "#traders",
  "#tradingcommodities",
  "#OnlineTradingPlatform",
  "#buyer",
  "#commoditiesmarket",
  "#commodities",
  "#buyersmarket",
  "#TradingCommodities",
  "#trader",
  "#SellersMarket",
  "#online",
  "#agriculturalcommodities",
  "#farmer",
];

const generateSocialContent = (
  locations: string[],
  crop: CropName,
  date: string,
  time: string,
) => {
  if (locations.length === 0 || !crop || !date || !time) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  const formattedDate = new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/");

  const organizations = ORGANIZATION_MAP[crop];
  const formattedOrganizationsSwahili = formatOrganizations(
    organizations,
    "swahili",
  );
  const formattedOrganizationsEnglish = formatOrganizations(
    organizations,
    "english",
  );
  const cropHashtag = `#${crop.toLowerCase().replace(" ", "")}`;

  const formattedLocations = locations.map(toCamelCase).join(", ");

  const youtubeTitle =
    `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS_SW[crop]} ${formattedLocations} MBASHARA-TMX OTS | ${formattedDate})`.toUpperCase();

  const socialMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${formattedLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${FACEBOOK_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim();

  const instagramMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${formattedLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${INSTAGRAM_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim();

  return {
    youtube: youtubeTitle,
    facebook: socialMessage,
    instagram: instagramMessage,
  };
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied to clipboard",
    description: "The generated content has been copied to your clipboard.",
  });
};

const ContentDisplay = ({
  label,
  content,
  onCopy,
  showCharCount = false,
}: {
  label: string;
  content: string;
  onCopy: () => void;
  showCharCount?: boolean;
}) => {
  const charCount = content.length;

  return (
    <div className="relative flex-1">
      <Label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="flex justify-between items-center"
      >
        <span>{label}</span>
        {showCharCount && (
          <span
            className={`text-sm ${charCount < 100 ? "text-green-500" : "text-red-500"}`}
          >
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
  );
};

// CropImageSelector is now imported from @/components/poster

interface EditableContentGeneratorProps {
  locations: string[];
  setLocations: (locations: string[]) => void;
  crop: CropName | "";
  setCrop: (crop: CropName | "") => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  onApplyContent: (content: Partial<PosterState>) => void;
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
  const [language, setLanguage] = useState<"sw" | "en">("sw");
  const [editableContent, setEditableContent] = useState({
    topText: "",
    heading: "",
    paragraph: "",
    dateCircleTop: "",
    dateCircleMain: "",
    dateCircleBottom: "",
  });

  // Stable ref so effects don't need onApplyContent as a dependency
  const onApplyContentRef = useRef(onApplyContent);
  useEffect(() => {
    onApplyContentRef.current = onApplyContent;
  }, [onApplyContent]);

  // Holds the last auto-generated structural data (positions, footerLogos)
  const generatedRef = useRef<Partial<PosterState> | null>(null);

  // Auto-generate and apply whenever any input changes
  useEffect(() => {
    if (locations.length === 0 || !crop || !date || !time) return;
    const content = generatePosterContent(
      locations,
      crop,
      date,
      time,
      language,
    );
    generatedRef.current = content;
    setEditableContent({
      topText: content.topText || "",
      heading: content.heading?.content || "",
      paragraph: content.paragraph?.content || "",
      dateCircleTop: content.dateCircle?.topText.content || "",
      dateCircleMain: content.dateCircle?.mainText.content || "",
      dateCircleBottom: content.dateCircle?.bottomText.content || "",
    });
    onApplyContentRef.current(content);
  }, [locations, crop, date, time, language]);

  const toggleLocation = (selectedLocation: string) =>
    setLocations(
      locations.includes(selectedLocation)
        ? locations.filter((loc) => loc !== selectedLocation)
        : [...locations, selectedLocation],
    );
  const toggleCrop = (selectedCrop: CropName) =>
    setCrop(crop === selectedCrop ? "" : selectedCrop);

  // Apply a single field change immediately to the poster
  const updateField = (field: keyof typeof editableContent, value: string) => {
    const updated = { ...editableContent, [field]: value };
    setEditableContent(updated);
    const base = generatedRef.current;
    if (!base) return;
    onApplyContentRef.current({
      topText: updated.topText,
      heading: base.heading
        ? { ...base.heading, content: updated.heading }
        : undefined,
      paragraph: base.paragraph
        ? { ...base.paragraph, content: updated.paragraph }
        : undefined,
      dateCircle: base.dateCircle
        ? {
            ...base.dateCircle,
            topText: {
              ...base.dateCircle.topText,
              content: updated.dateCircleTop,
            },
            mainText: {
              ...base.dateCircle.mainText,
              content: updated.dateCircleMain,
            },
            bottomText: {
              ...base.dateCircle.bottomText,
              content: updated.dateCircleBottom,
            },
          }
        : undefined,
    });
  };

  // Reset back to auto-generated content from current inputs
  const handleReset = () => {
    if (locations.length === 0 || !crop || !date || !time) return;
    const content = generatePosterContent(
      locations,
      crop,
      date,
      time,
      language,
    );
    generatedRef.current = content;
    setEditableContent({
      topText: content.topText || "",
      heading: content.heading?.content || "",
      paragraph: content.paragraph?.content || "",
      dateCircleTop: content.dateCircle?.topText.content || "",
      dateCircleMain: content.dateCircle?.mainText.content || "",
      dateCircleBottom: content.dateCircle?.bottomText.content || "",
    });
    onApplyContentRef.current(content);
  };

  const hasContent = !!editableContent.heading;

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
              const isSelected = locations.includes(location);
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
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Crop</Label>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {CROPS.map((cropName) => {
              const isSelected = crop === cropName;
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
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {hasContent && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-blue-800">
                  Poster Content
                </CardTitle>
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-blue-700">
                  Top Text
                </Label>
                <Textarea
                  value={editableContent.topText}
                  onChange={(e) => updateField("topText", e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-700">
                  Heading
                </Label>
                <Input
                  value={editableContent.heading}
                  onChange={(e) => updateField("heading", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-700">
                  Content
                </Label>
                <Textarea
                  value={editableContent.paragraph}
                  onChange={(e) => updateField("paragraph", e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-sm font-medium text-blue-700">
                    Date Top
                  </Label>
                  <Input
                    value={editableContent.dateCircleTop}
                    onChange={(e) =>
                      updateField("dateCircleTop", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-blue-700">
                    Date Main
                  </Label>
                  <Input
                    value={editableContent.dateCircleMain}
                    onChange={(e) =>
                      updateField("dateCircleMain", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-blue-700">
                    Date Bottom
                  </Label>
                  <Textarea
                    value={editableContent.dateCircleBottom}
                    onChange={(e) =>
                      updateField("dateCircleBottom", e.target.value)
                    }
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

interface ImageUploadProps {
  label: string;
  onUpload: (url: string | null) => void;
  currentImage: string | null;
  isCompact?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onUpload,
  currentImage,
  isCompact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => inputRef.current?.click();

  return (
    <div className={`space-y-2 ${isCompact ? "flex items-center gap-2" : ""}`}>
      {!isCompact && <Label className="text-sm font-medium">{label}</Label>}
      <div className={`flex items-center gap-2 ${isCompact ? "flex-1" : ""}`}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
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
            <Button
              onClick={() => onUpload(null)}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface PositionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PositionSlider: React.FC<PositionSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = POSTER_WIDTH,
}) => (
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
);

// --- POSTER CANVAS ---
const OVERLAY_IMAGE_URL = "/images/backgrounds/overlay.png";

const renderRichText = (text: PositionableElement["content"]) => {
  if (typeof text !== "string") return text;
  return text
    .split(/(\*\*.+?\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );
};

interface PosterCanvasProps extends PosterState {
  id: string;
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
  } = props;

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
        className="absolute top-0 left-0 right-0 flex justify-between items-center z-10"
        style={{
          backgroundColor: headerFooterBackgroundColor,
          padding: "16px 40px",
        }}
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
          style={{
            top: dateCircle.position.y,
            left: dateCircle.position.x,
            transform: "translate(-50%, -50%)",
          }}
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
          <h1 className="text-8xl font-extrabold tracking-wider">
            {heading.content}
          </h1>
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
        style={{
          backgroundColor: headerFooterBackgroundColor,
          padding: "16px 40px",
        }}
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
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // State for generator inputs
  const [locations, setLocations] = useState<string[]>(["SINGIDA", "DODOMA"]);
  const [crop, setCrop] = useState<CropName | "">("CHICK PEA");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");

  // State for poster visual elements
  const [posterState, setPosterState] = useState<PosterState>({
    topText:
      "JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA",
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
  });

  const [downloadPosterState, setDownloadPosterState] =
    useState<PosterState | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // State for social media content generation
  const [generatedSocialContent, setGeneratedSocialContent] = useState({
    youtube: "",
    facebook: "",
    instagram: "",
  });

  // Auto-generate social content when inputs change
  useEffect(() => {
    if (locations.length > 0 && crop && date && time) {
      const content = generateSocialContent(locations, crop, date, time);
      if (content) {
        setGeneratedSocialContent(content);
      }
    } else {
      setGeneratedSocialContent({
        youtube: "",
        facebook: "",
        instagram: "",
      });
    }
  }, [locations, crop, date, time]);

  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    setDate(localDate.toISOString().split("T")[0]);
  }, []);

  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      const { width } = previewContainerRef.current.getBoundingClientRect();
      setPreviewScale(width / POSTER_WIDTH);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  const handleStateChange = useCallback(
    <K extends keyof PosterState>(key: K, value: PosterState[K]) => {
      setPosterState((prevState) => ({ ...prevState, [key]: value }));
    },
    [],
  );

  // Auto-apply first local background image when crop changes
  useEffect(() => {
    if (!crop) return;
    const images = CROP_BACKGROUND_IMAGES[crop as CropName];
    if (images && images.length > 0) {
      handleStateChange("backgroundImage", images[0].url);
    }
  }, [crop, handleStateChange]);

  const handleNestedChange = useCallback(
    (path: (string | number)[], value: any) => {
      setPosterState((prevState) => {
        const newState = structuredClone(prevState) as any;
        let current: any = newState;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        return newState;
      });
    },
    [],
  );

  const mergeContentIntoState = (
    prevState: PosterState,
    content: Partial<PosterState>,
  ): PosterState => {
    const newState = structuredClone(prevState);
    if (content.topText) newState.topText = content.topText;
    if (content.footerLogos) newState.footerLogos = content.footerLogos;
    if (content.heading?.content)
      newState.heading.content = content.heading.content;
    if (content.heading?.position)
      newState.heading.position = content.heading.position;
    if (content.paragraph?.content)
      newState.paragraph.content = content.paragraph.content;
    if (content.paragraph?.position)
      newState.paragraph.position = content.paragraph.position;
    if (content.dateCircle) {
      if (content.dateCircle.position)
        newState.dateCircle.position = content.dateCircle.position;
      if (content.dateCircle.topText?.content)
        newState.dateCircle.topText.content = content.dateCircle.topText.content;
      if (content.dateCircle.topText?.position)
        newState.dateCircle.topText.position = content.dateCircle.topText.position;
      if (content.dateCircle.mainText?.content)
        newState.dateCircle.mainText.content = content.dateCircle.mainText.content;
      if (content.dateCircle.mainText?.position)
        newState.dateCircle.mainText.position = content.dateCircle.mainText.position;
      if (content.dateCircle.bottomText?.content)
        newState.dateCircle.bottomText.content = content.dateCircle.bottomText.content;
      if (content.dateCircle.bottomText?.position)
        newState.dateCircle.bottomText.position = content.dateCircle.bottomText.position;
    }
    return newState;
  };

  const handleContentUpdate = useCallback((content: Partial<PosterState>) => {
    setPosterState((prevState) => mergeContentIntoState(prevState, content));
  }, []);

  const handleBackgroundStyleChange = useCallback(
    (key: keyof BackgroundStyle, value: string) => {
      handleStateChange("backgroundStyle", {
        ...posterState.backgroundStyle,
        [key]: value,
      });
    },
    [posterState.backgroundStyle, handleStateChange],
  );

  const captureCanvas = async (elementId: string): Promise<string> => {
    const posterElement = document.getElementById(elementId);
    if (!posterElement)
      throw new Error(`Element with id ${elementId} not found.`);

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
    });
  };

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (!crop) {
      toast({
        title: "No crop selected",
        description: "Please select a crop before downloading.",
        variant: "destructive",
      });
      return;
    }
    setIsDownloading(true);
    try {
      // Generate and capture English version
      // Exclude auto-generated footerLogos so user's manual edits are preserved
      const { footerLogos: _en, ...enContent } = generatePosterContent(
        locations,
        crop,
        date,
        time,
        "en",
      );
      setDownloadPosterState(mergeContentIntoState(posterState, enContent));
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for DOM update
      const enDataUrl = await captureCanvas("download-poster");
      triggerDownload(
        enDataUrl,
        `poster_${CROP_NAMES_EN[crop].toLowerCase().replace(" ", "_")}_en.png`,
      );

      // Generate and capture Swahili version
      const { footerLogos: _sw, ...swContent } = generatePosterContent(
        locations,
        crop,
        date,
        time,
        "sw",
      );
      setDownloadPosterState(mergeContentIntoState(posterState, swContent));
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for DOM update
      const swDataUrl = await captureCanvas("download-poster");
      triggerDownload(
        swDataUrl,
        `poster_${CROP_TRANSLATIONS_SW[crop].toLowerCase().replace(" ", "_")}_sw.png`,
      );
    } catch (err) {
      console.error("Failed to download poster:", err);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the poster.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadPosterState(null);
    }
  };

  const handleFooterLogoChange = (index: number, value: string | null) => {
    const newLogos = [...posterState.footerLogos];
    if (value === null) {
      newLogos.splice(index, 1);
    } else {
      newLogos[index] = value;
    }
    handleStateChange("footerLogos", newLogos);
  };

  const addFooterLogo = () =>
    handleStateChange("footerLogos", [...posterState.footerLogos, ""]);
  const removeFooterLogo = (index: number) =>
    handleStateChange(
      "footerLogos",
      posterState.footerLogos.filter((_, i) => i !== index),
    );

  return (
    <div className="min-h-screen">
      {/* Hidden canvas for high-resolution downloads */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {downloadPosterState && (
          <PosterCanvas {...downloadPosterState} id="download-poster" />
        )}
      </div>

      <div className="max-w-screen mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              <EditableContentGenerator
                onApplyContent={handleContentUpdate}
                {...{
                  locations,
                  setLocations,
                  crop,
                  setCrop,
                  date,
                  setDate,
                  time,
                  setTime,
                }}
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
                  <TabsTrigger
                    value="copy-pasta"
                    className="text-xs sm:text-sm"
                  >
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
                          onChange={(e) =>
                            handleStateChange("topText", e.target.value)
                          }
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="headerColor">
                          Header/Footer Background
                        </Label>
                        <Input
                          id="headerColor"
                          type="color"
                          value={posterState.headerFooterBackgroundColor.slice(
                            0,
                            7,
                          )}
                          onChange={(e) =>
                            handleStateChange(
                              "headerFooterBackgroundColor",
                              e.target.value,
                            )
                          }
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
                          onChange={(e) =>
                            handleNestedChange(
                              ["heading", "content"],
                              e.target.value,
                            )
                          }
                          className="mt-1"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <PositionSlider
                            label="X Position"
                            value={posterState.heading.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["heading", "position", "x"],
                                v,
                              )
                            }
                          />
                          <PositionSlider
                            label="Y Position"
                            value={posterState.heading.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["heading", "position", "y"],
                                v,
                              )
                            }
                          />
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label htmlFor="paragraph">Main Paragraph</Label>
                        <Textarea
                          id="paragraph"
                          value={posterState.paragraph.content}
                          onChange={(e) =>
                            handleNestedChange(
                              ["paragraph", "content"],
                              e.target.value,
                            )
                          }
                          rows={8}
                          className="mt-1"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <PositionSlider
                            label="X Position"
                            value={posterState.paragraph.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["paragraph", "position", "x"],
                                v,
                              )
                            }
                          />
                          <PositionSlider
                            label="Y Position"
                            value={posterState.paragraph.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["paragraph", "position", "y"],
                                v,
                              )
                            }
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
                        onUpload={(url) =>
                          handleStateChange("backgroundImage", url)
                        }
                        currentImage={posterState.backgroundImage}
                      />

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Crop-Specific Backgrounds
                        </Label>
                        <CropImageSelector
                          selectedCrop={crop}
                          onImageSelect={(imageUrl) =>
                            handleStateChange("backgroundImage", imageUrl)
                          }
                          currentImage={posterState.backgroundImage}
                        />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Image Fit</Label>
                          <Select
                            value={posterState.backgroundStyle.objectFit}
                            onValueChange={(v) =>
                              handleBackgroundStyleChange("objectFit", v)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cover">Cover</SelectItem>
                              <SelectItem value="contain">Contain</SelectItem>
                              <SelectItem value="fill">Fill</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="scale-down">
                                Scale Down
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Image Position</Label>
                          <Select
                            value={posterState.backgroundStyle.objectPosition}
                            onValueChange={(v) =>
                              handleBackgroundStyleChange("objectPosition", v)
                            }
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
                        onUpload={(url) =>
                          handleStateChange("topLeftLogo", url)
                        }
                        currentImage={posterState.topLeftLogo}
                      />
                      <ImageUpload
                        label="Top Right Logo"
                        onUpload={(url) =>
                          handleStateChange("topRightLogo", url)
                        }
                        currentImage={posterState.topRightLogo}
                      />
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Footer Logos
                        </Label>
                        <div className="space-y-3">
                          {posterState.footerLogos.map((logo, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <ImageUpload
                                label={`Footer Logo ${index + 1}`}
                                onUpload={(url) =>
                                  handleFooterLogoChange(index, url)
                                }
                                currentImage={logo}
                                isCompact={true}
                              />
                              <Button
                                onClick={() => removeFooterLogo(index)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={addFooterLogo}
                            variant="outline"
                            className="w-full bg-transparent"
                          >
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
                        <Label className="text-sm font-medium mb-3 block">
                          Circle Position
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <PositionSlider
                            label="X"
                            value={posterState.dateCircle.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "position", "x"],
                                v,
                              )
                            }
                          />
                          <PositionSlider
                            label="Y"
                            value={posterState.dateCircle.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "position", "y"],
                                v,
                              )
                            }
                          />
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Top Text
                        </Label>
                        <Input
                          value={posterState.dateCircle.topText.content}
                          onChange={(e) =>
                            handleNestedChange(
                              ["dateCircle", "topText", "content"],
                              e.target.value,
                            )
                          }
                          className="mb-3"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <PositionSlider
                            label="X"
                            value={posterState.dateCircle.topText.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "topText", "position", "x"],
                                v,
                              )
                            }
                            max={200}
                          />
                          <PositionSlider
                            label="Y"
                            value={posterState.dateCircle.topText.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "topText", "position", "y"],
                                v,
                              )
                            }
                            max={200}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Main Text
                        </Label>
                        <Input
                          value={posterState.dateCircle.mainText.content}
                          onChange={(e) =>
                            handleNestedChange(
                              ["dateCircle", "mainText", "content"],
                              e.target.value,
                            )
                          }
                          className="mb-3"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <PositionSlider
                            label="X"
                            value={posterState.dateCircle.mainText.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "mainText", "position", "x"],
                                v,
                              )
                            }
                            max={200}
                          />
                          <PositionSlider
                            label="Y"
                            value={posterState.dateCircle.mainText.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "mainText", "position", "y"],
                                v,
                              )
                            }
                            max={200}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Bottom Text
                        </Label>
                        <Textarea
                          value={posterState.dateCircle.bottomText.content}
                          onChange={(e) =>
                            handleNestedChange(
                              ["dateCircle", "bottomText", "content"],
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="mb-3"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <PositionSlider
                            label="X"
                            value={posterState.dateCircle.bottomText.position.x}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "bottomText", "position", "x"],
                                v,
                              )
                            }
                            max={200}
                          />
                          <PositionSlider
                            label="Y"
                            value={posterState.dateCircle.bottomText.position.y}
                            onChange={(v) =>
                              handleNestedChange(
                                ["dateCircle", "bottomText", "position", "y"],
                                v,
                              )
                            }
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
                      <CardTitle className="text-lg">
                        Social Media Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedSocialContent.youtube ? (
                        <Tabs defaultValue="youtube" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="youtube">YouTube</TabsTrigger>
                            <TabsTrigger value="facebook">Facebook</TabsTrigger>
                            <TabsTrigger value="instagram">
                              Instagram
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="youtube">
                            <ContentDisplay
                              label="YouTube Title"
                              content={generatedSocialContent.youtube}
                              onCopy={() =>
                                copyToClipboard(generatedSocialContent.youtube)
                              }
                              showCharCount
                            />
                          </TabsContent>
                          <TabsContent value="facebook">
                            <ContentDisplay
                              label="Facebook Post"
                              content={generatedSocialContent.facebook}
                              onCopy={() =>
                                copyToClipboard(generatedSocialContent.facebook)
                              }
                            />
                          </TabsContent>
                          <TabsContent value="instagram">
                            <ContentDisplay
                              label="Instagram Caption"
                              content={generatedSocialContent.instagram}
                              onCopy={() =>
                                copyToClipboard(
                                  generatedSocialContent.instagram,
                                )
                              }
                            />
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Copy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>
                            Select locations, crop, date, and time to generate
                            social media content
                          </p>
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
                    {isDownloading
                      ? "Downloading..."
                      : "Download Posters (EN & SW)"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Poster Preview */}
          <div className="xl:col-span-2 xl:sticky xl:top-6 xl:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Poster Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={previewContainerRef}
                  className="w-full mx-auto"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <div className="w-full h-full flex justify-center items-center overflow-hidden">
                    <div
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: "center center",
                      }}
                    >
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
  );
};

// --- CONTENT GENERATION ---
const generatePosterContent = (
  locations: string[],
  crop: CropName,
  date: string,
  time: string,
  lang: "sw" | "en",
): Partial<PosterState> => {
  const formattedLocations = formatList(locations.map(toCamelCase), lang);
  const organizations = ORGANIZATION_MAP[crop] || [];
  const formattedOrganizations = formatList(organizations, lang);
  const formattedTime = formatTime(time, lang);
  const dateObj = new Date(date + "T12:00:00Z");
  const day = dateObj.toLocaleDateString("en-GB", { day: "2-digit" });
  const swahiliMonth = dateObj.toLocaleDateString("sw-TZ", { month: "long" });
  const englishMonth = dateObj.toLocaleDateString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  const swahiliWeekday = dateObj.toLocaleDateString("sw-TZ", {
    weekday: "long",
  });
  const englishWeekday = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const fullDateGB = dateObj.toLocaleDateString("en-GB");

  let topText: string, heading: string, paragraph: string;
  let dateCircleContent: {
    topText: PositionableElement;
    mainText: PositionableElement;
    bottomText: PositionableElement;
  };

  if (lang === "sw") {
    const cropSwahili = CROP_TRANSLATIONS_SW[crop];
    topText = `JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA`;
    heading = cropSwahili.toUpperCase();
    if (crop === "COFFEE") {
      paragraph = `Soko la Bidhaa Tanzania (TMX) kwa kushirikiana na Bodi ya Kahawa Tanzania (TCB) inakukaribisha kushiriki mnada wa Kahawa unaotarajia kufanyika Mkoa wa **${formattedLocations}**, siku ya **${swahiliWeekday}** **${fullDateGB}** kuanzia **saa 5:00 Asubuhi** Kwa njia ya kielektroniki.\n\nWote Mnakaribishwa`;
    } else if (locations.length < 2) {
      paragraph = `**TMX, ${formattedOrganizations}** na Serikali ya Mkoa wa **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mkoa wa **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`;
    } else {
      paragraph = `**TMX, ${formattedOrganizations}** na Serikali ya Mikoa ya **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mikoa ya **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`;
    }
    dateCircleContent = {
      topText: { content: "Tarehe", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: {
        content: `${swahiliMonth}\n${year}`,
        position: { x: 100, y: 160 },
      },
    };
  } else {
    const cropEnglish = CROP_NAMES_EN[crop];
    const regionText = `Region${locations.length > 1 ? "s" : ""}`;
    topText = `THE UNITED REPUBLIC OF TANZANIA\nMINISTRY OF FINANCE\nTANZANIA MERCANTILE EXCHANGE`;
    heading = cropEnglish.toUpperCase();
    if (crop === "COFFEE") {
      paragraph = `Tanzania Mercantile Exchange (TMX) in collaboration with Tanzania Coffee Board (TCB) invites you to participate in the Online Auction in **${formattedLocations}** ${regionText} on **${englishWeekday}**, **${fullDateGB}** from **11:00 AM**.\n\nYou are all welcome`;
    } else if (locations.length < 2) {
      paragraph = `**TMX, ${formattedOrganizations}** the Regional and District Government Authority of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`;
    } else {
      paragraph = `**TMX, ${formattedOrganizations}** the Regional and District Government Authorities of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`;
    }
    dateCircleContent = {
      topText: { content: "Date", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: {
        content: `${englishMonth}\n${year}`,
        position: { x: 100, y: 160 },
      },
    };
  }

  const footerLogos = [
    LOGO_URL_MAP["TMX"],
    ...organizations.map((org) => LOGO_URL_MAP[org]).filter(Boolean),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const isCoffee = crop === "COFFEE";

  return {
    topText,
    heading: { content: heading, position: { x: 54, y: isCoffee ? 590 : 465 } },
    paragraph: {
      content: paragraph,
      position: { x: isCoffee ? 59 : 54, y: isCoffee ? 705 : 560 },
    },
    dateCircle: {
      position: { x: 162, y: isCoffee ? 467 : 300 },
      topText: {
        content: dateCircleContent.topText.content,
        position: {
          x: 100,
          y: isCoffee ? 36 : dateCircleContent.topText.position.y,
        },
      },
      mainText: {
        content: dateCircleContent.mainText.content,
        position: {
          x: 100,
          y: isCoffee ? 91 : dateCircleContent.mainText.position.y,
        },
      },
      bottomText: {
        content: dateCircleContent.bottomText.content,
        position: {
          x: 100,
          y: isCoffee ? 158 : dateCircleContent.bottomText.position.y,
        },
      },
    },
    footerLogos,
  };
};

export default App;
