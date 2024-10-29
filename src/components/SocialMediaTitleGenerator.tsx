"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, Copy, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

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
  | "PEANUT";

const AVAILABLE_LOCATIONS = [
  "SINGIDA",
  "MBEYA",
  "MANYARA",
  "SONGEA",
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
];

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
  "PEANUT",
];

const CROP_TRANSLATIONS: Record<CropName, string> = {
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
  PEANUT: "KARANGA",
};

const FACEBOOK_TAGS = [
  "@urtmof",
  "@Capital Market & Security Authority",
  "@ofisi_ya_msajili_wa_hazina",
  "@boatanzania",
  "@msemajimkuuwaserikali",
  "@Ikulu Mawasiliano",
  "@Wizara ya Kilimo",
  "@Tume Ya Maendeleo Ya Ushirika",
  "@ushirika_tcdc",
  "@Wizara ya Viwanda na Biashara",
  "@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB",
];

const INSTAGRAM_TAGS = [
  "@urtmof",
  "@securities_capital_and_markets",
  "@ofisi_ya_msajili_wa_hazina",
  "@boatanzania",
  "@msemajimkuuwaserikali",
  "@ikulu_mawasiliano",
  "@wizara_ya_kilimo",
  "@ushirika_tcdc",
  "@biasharaviwanda",
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

export default function SocialMediaTitleGenerator() {
  const [locations, setLocations] = useState<string[]>([]);
  const [crop, setCrop] = useState<CropName | "">("");
  const [date, setDate] = useState("");
  const [generatedContent, setGeneratedContent] = useState({
    youtube: "",
    facebook: "",
    instagram: "",
    instagramResult: "",
    facebookResult: "",
  });

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const handleLocationChange = (selectedLocation: string) => {
    setLocations((prev) =>
      prev.includes(selectedLocation)
        ? prev.filter((loc) => loc !== selectedLocation)
        : [...prev, selectedLocation]
    );
  };

  const removeLocation = (locationToRemove: string) => {
    setLocations((prev) => prev.filter((loc) => loc !== locationToRemove));
  };

  const toCamelCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formattedLocations = useMemo(
    () => locations.map(toCamelCase).join(", "),
    [locations]
  );
  const swahiliLocations = useMemo(
    () => locations.map((loc) => toCamelCase(loc)).join(", "),
    [locations]
  );

  const generateContent = () => {
    if (locations.length === 0 || !crop || !date) {
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

    const organization = crop === "CASHEW" ? "CBT" : "COPRA";
    const cropHashtag = `#${crop.toLowerCase().replace(" ", "")}`;

    const youtubeTitle = `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS[crop]} ${swahiliLocations} MBASHARA-TMX OTS | ${formattedDate})`;

    const socialMessage = `
Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na WRRB, TCDC na ${organization}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with WRRB, TCDC and ${organization} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

${FACEBOOK_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
    `.trim();

    const instagramMessage = `
Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na WRRB, TCDC na ${organization}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with WRRB, TCDC and ${organization} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

${INSTAGRAM_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
    `.trim();

    const commodityPriceTitle = `
Taarifa za Bei za Bidhaa leo. Kwa taarifa zaidi tembelea tovuti kupitia kiunga kwenye bio.

Commodity Price Information Today. For more information, visit our website through the links in bio.

${FACEBOOK_TAGS.join("\n")}

#sesame #chickpeas #coffee #soya #kahawa #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #sesameseeds #OnlineTradingPlatform
    `.trim();

    const commodityPriceTitleInstagram = commodityPriceTitle.replace(
      FACEBOOK_TAGS.join("\n"),
      INSTAGRAM_TAGS.join("\n")
    );

    setGeneratedContent({
      youtube: youtubeTitle,
      facebook: socialMessage,
      instagram: instagramMessage,
      instagramResult: commodityPriceTitleInstagram,
      facebookResult: commodityPriceTitle,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard.",
    });
  };

  return (
    <div className="w-auto mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Locations</Label>
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger id="location" className="h-auto">
              <SelectValue placeholder="Select locations" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  <div className="flex items-center">
                    <span className="mr-2">{loc}</span>
                    {locations.includes(loc) && <CheckIcon size={16} />}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {locations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {loc}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-1 h-4 w-4"
                    onClick={() => removeLocation(loc)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="crop">Crop</Label>
          <Select onValueChange={(value) => setCrop(value as CropName)}>
            <SelectTrigger id="crop">
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              />
            </TabsContent>
            <TabsContent value="facebook" className="space-y-8">
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
            <TabsContent value="instagram" className="space-y-8">
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
  );
}

function ContentDisplay({
  label,
  content,
  onCopy,
}: {
  label: string;
  content: string;
  onCopy: () => void;
}) {
  return (
    <div className="relative">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>
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
}
