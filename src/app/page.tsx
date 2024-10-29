"use client";

import { useState } from "react";
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

// Define the possible crop names as a union type for type safety
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

// Array of available locations
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

// Array of available crops
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

// Object mapping crop names to their Swahili translations
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

export default function SocialMediaTitleGenerator() {
  // State variables
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

  // Function to handle adding or removing a location
  const handleLocationChange = (selectedLocation: string) => {
    setLocations((prev) =>
      prev.includes(selectedLocation)
        ? prev.filter((loc) => loc !== selectedLocation)
        : [...prev, selectedLocation]
    );
  };

  // Function to remove a specific location
  const removeLocation = (locationToRemove: string) => {
    setLocations((prev) => prev.filter((loc) => loc !== locationToRemove));
  };

  // Function to generate content for all platforms
  const generateContent = () => {
    // Check if all required fields are filled
    if (locations.length === 0 || !crop || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Format locations and date
    const formattedLocations = locations.join(", ");
    const swahiliLocations = locations
      .map((loc) => loc.charAt(0) + loc.slice(1).toUpperCase())
      .join(", ");
    const formattedDate = new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");

    // generate Commodity price result for facebook
    const commodityPriceTitleFacebook = `Taarifa za Bei za Bidhaa leo. Kwa taarifa zaidi tembelea tovuti kupitia kiunga kwenye bio.

Commodity Price Information Today. For more information, visit our website through the links in bio.

@urtmof 
@Capital Market & Security Authority 
@ofisi_ya_msajili_wa_hazina 
@boatanzania 
@msemajimkuuwaserikali 
@Ikulu Mawasiliano
@Wizara ya Kilimo
@Tume Ya Maendeleo Ya Ushirika
@ushirika_tcdc
@Wizara ya Viwanda na Biashara
@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB

#sesame #chickpeas #coffee #soya #kahawa #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #sesameseeds #OnlineTradingPlatform`;

    // generate Commodity price result for Instagram
    const commodityPriceTitleInstagram = `Taarifa za Bei za Bidhaa leo. Kwa taarifa zaidi tembelea tovuti kupitia kiunga kwenye bio.

Commodity Price Information Today. For more information, visit our website through the links in bio.

@urtmof 
@securities_capital_and_markets 
@ofisi_ya_msajili_wa_hazina 
@boatanzania
@msemajimkuuwaserikali 
@ikulu_mawasiliano 
@wizara_ya_kilimo 
@ushirika_tcdc 
@biasharaviwanda 
@wrrbwrs 

#sesame #chickpeas #coffee #soya #kahawa #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #sesameseeds #OnlineTradingPlatform`;

    // Generate YouTube title
    const youtubeTitle = `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS[crop]} ${swahiliLocations} MBASHARA-TMX OTS | ${formattedDate})`;

    // Generate social media message (for both Facebook and Instagram)
    const organization = crop === "CASHEW" ? "CBT" : "COPRA";

    const socialMessage = `Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na WRRB, TCDC na ${organization}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with WRRB, TCDC and ${organization} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

@urtmof 
@Capital Market & Security Authority 
@ofisi_ya_msajili_wa_hazina 
@boatanzania 
@msemajimkuuwaserikali 
@Ikulu Mawasiliano
@Wizara ya Kilimo
@Tume Ya Maendeleo Ya Ushirika
@ushirika_tcdc
@Wizara ya Viwanda na Biashara
@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB

#oilseeds #buyers #trading #${crop
      .toLowerCase()
      .replace(
        " ",
        ""
      )} #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #OnlineTradingPlatform #buyer #commoditiesmarket #commodities #buyersmarket #TradingCommodities #trader #SellersMarket #online #agriculturalcommodities #farmer`;

    const instagramMessage = `Karibuni kushiriki kwenye mauzo wa zao la ${CROP_TRANSLATIONS[
      crop
    ].toLowerCase()} mkoa wa ${swahiliLocations} kupitia Mfumo wa Mauzo wa Kieletroniki wa TMX kwa kushirikiana na WRRB, TCDC na ${organization}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with WRRB, TCDC and ${organization} in ${formattedLocations} Region${
      locations.length > 1 ? "s" : ""
    }.

@urtmof 
@securities_capital_and_markets 
@ofisi_ya_msajili_wa_hazina 
@boatanzania
@msemajimkuuwaserikali 
@ikulu_mawasiliano 
@wizara_ya_kilimo 
@ushirika_tcdc 
@biasharaviwanda 
@wrrbwrs

#oilseeds #buyers #trading #${crop
      .toLowerCase()
      .replace(
        " ",
        ""
      )} #commodityexchangemarkets #commoditiesexchange #agriculture #commoditiestrading #seller #commoditytraders #agriculturalcommodityexhange #farmersmarket #onlinetradingsystem #agriculturalcommodityexchange #onlinetrading #commoditytrader #traders #tradingcommodities #OnlineTradingPlatform #buyer #commoditiesmarket #commodities #buyersmarket #TradingCommodities #trader #SellersMarket #online #agriculturalcommodities #farmer`;

    // Update state with generated content
    setGeneratedContent({
      youtube: youtubeTitle,
      facebook: socialMessage,
      instagram: instagramMessage,
      instagramResult: commodityPriceTitleInstagram,
      facebookResult: commodityPriceTitleFacebook,
    });
  };

  // Function to copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        TMX Social Media Content Generator
      </h1>
      <div className="space-y-4">
        {/* Locations selection */}
        <div>
          <Label htmlFor="location">Locations</Label>
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger className="h-auto">
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
          {/* Display selected locations with delete option */}
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
        {/* Crop selection */}
        <div>
          <Label>Crop</Label>
          <Select onValueChange={(value) => setCrop(value as CropName)}>
            <SelectTrigger>
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
        {/* Date input */}
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {/* Generate content button */}
        <Button onClick={generateContent} className="w-full">
          Generate Content
        </Button>
        {/* Display generated content in tabs */}
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
              <div className="relative">
                <Label htmlFor="youtube-title">YouTube Title</Label>
                <Textarea
                  id="youtube-title"
                  value={generatedContent.youtube}
                  readOnly
                  className="h-24 pr-10"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-8"
                  onClick={() => copyToClipboard(generatedContent.youtube)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="facebook" className="space-y-8">
              <div className="relative">
                <Label htmlFor="facebook-message">Facebook Message</Label>
                <Textarea
                  id="facebook-message"
                  value={generatedContent.facebook}
                  readOnly
                  className="h-64 pr-10"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-8"
                  onClick={() => copyToClipboard(generatedContent.facebook)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <label htmlFor="instagram-result-caption">
                  Instagram Results Caption
                </label>
                <Textarea
                  id="instagram-result-caption"
                  value={generatedContent.facebookResult}
                  readOnly
                  className="h-64 pr-10"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-8"
                  onClick={() =>
                    copyToClipboard(generatedContent.facebookResult)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="instagram" className="space-y-8">
              <div className="relative">
                <Label htmlFor="instagram-message">Instagram Message</Label>
                <Textarea
                  id="instagram-message"
                  value={generatedContent.instagram}
                  readOnly
                  className="h-64 pr-10"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-8"
                  onClick={() => copyToClipboard(generatedContent.instagram)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <label htmlFor="instagram-result-caption">
                  Instagram Results Caption
                </label>
                <Textarea
                  id="instagram-result-caption"
                  value={generatedContent.instagramResult}
                  readOnly
                  className="h-64 pr-10"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-8"
                  onClick={() =>
                    copyToClipboard(generatedContent.instagramResult)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
