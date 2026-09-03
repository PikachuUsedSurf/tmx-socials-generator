"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Check, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  CropImageSelector,
  DateCircleEditor,
  ImageUpload,
  LogoManager,
  PositionSlider,
  PosterCanvas,
} from "@/components/poster";
import type { PosterZone } from "@/components/poster/PosterCanvas";
import { ContentDisplay } from "@/components/social-media/ContentDisplay";
import type { BackgroundStyle, PosterState, CropName } from "@/lib/types";
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types";
import {
  CROP_NAMES_EN,
  CROP_TRANSLATIONS_SW,
  CROP_BACKGROUND_IMAGES,
  CROPS,
} from "@/lib/constants/crops";
import { AVAILABLE_LOCATIONS } from "@/lib/constants/locations";
import {
  generatePosterContent,
  mergeContentIntoState,
  generateSocialContent,
} from "@/lib/generators";
import { copyToClipboard } from "@/lib/utils/formatting";

type PanelZone = PosterZone | "captions";

const TOOLBAR_ZONES: { zone: PanelZone; label: string }[] = [
  { zone: "header", label: "Header" },
  { zone: "heading", label: "Heading" },
  { zone: "paragraph", label: "Paragraph" },
  { zone: "dateCircle", label: "Date badge" },
  { zone: "photo", label: "Photo" },
  { zone: "footer", label: "Logos" },
  { zone: "captions", label: "Captions" },
];

const App: React.FC = () => {
  // State for generator inputs
  const [locations, setLocations] = useState<string[]>(["SINGIDA", "DODOMA"]);
  const [crop, setCrop] = useState<CropName | "">("CHICK PEA");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");
  const [language, setLanguage] = useState<"sw" | "en">("sw");

  // Which part of the poster the right-hand panel is currently editing
  const [selectedZone, setSelectedZone] = useState<PanelZone | null>(null);

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

  // Auto-generate and apply poster wording whenever locations/crop/date/time/language change
  useEffect(() => {
    if (locations.length === 0 || !crop || !date || !time) return;
    const content = generatePosterContent(locations, crop, date, time, language);
    setPosterState((prev) => mergeContentIntoState(prev, content));
  }, [locations, crop, date, time, language]);

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

  const handleBackgroundStyleChange = useCallback(
    (key: keyof BackgroundStyle, value: string) => {
      handleStateChange("backgroundStyle", {
        ...posterState.backgroundStyle,
        [key]: value,
      });
    },
    [posterState.backgroundStyle, handleStateChange],
  );

  const toggleLocation = (location: string) =>
    setLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location],
    );
  const toggleCrop = (selectedCrop: CropName) =>
    setCrop((prev) => (prev === selectedCrop ? "" : selectedCrop));

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

      toast({
        title: "Posters downloaded",
        description: "The English and Swahili posters have been saved to your downloads.",
      });
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

  const posterTitle =
    crop && locations.length > 0
      ? `${CROP_NAMES_EN[crop]} — ${locations.join(" & ")}`
      : "New poster";

  return (
    <div className="min-h-screen">
      {/* Hidden canvas for high-resolution downloads */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {downloadPosterState && (
          <PosterCanvas {...downloadPosterState} id="download-poster" />
        )}
      </div>

      <div className="max-w-screen mx-auto flex flex-col gap-4 sm:gap-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 sm:px-6 py-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{posterTitle}</div>
            <div className="text-xs text-muted-foreground">
              {date ? `${date} · ${time}` : "Auction poster"}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border">
              <button
                type="button"
                onClick={() => setLanguage("sw")}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  language === "sw"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SW
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>
            <Button onClick={handleDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download EN & SW"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-4 sm:gap-6 items-start">
          {/* Details panel: locations & crop, always shown — every option visible, nothing to scroll */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audience &amp; crop</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Locations</Label>
                  <span className="text-sm text-muted-foreground">
                    {locations.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 rounded-md border p-2.5">
                  {AVAILABLE_LOCATIONS.map((location) => {
                    const isSelected = locations.includes(location);
                    return (
                      <Badge
                        key={location}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer select-none transition-colors"
                        onClick={() => toggleLocation(location)}
                      >
                        {isSelected && <Check className="mr-1 h-3 w-3" />}
                        {location}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Crop</Label>
                <div className="flex flex-wrap gap-1.5 rounded-md border p-2.5">
                  {CROPS.map((cropName) => {
                    const isSelected = crop === cropName;
                    return (
                      <Badge
                        key={cropName}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer select-none transition-colors"
                        onClick={() => toggleCrop(cropName)}
                      >
                        {isSelected && <Check className="mr-1 h-3 w-3" />}
                        {CROP_NAMES_EN[cropName]}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Auction date &amp; time
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas stage: halftone ground, floating toolbar, click-to-edit poster */}
          <div className="relative overflow-auto rounded-lg flex flex-col items-center py-8 px-4 min-h-[560px]">
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 1.4px, transparent 1.6px)",
                backgroundSize: "13px 13px",
                backgroundColor: "#1c1c1a",
              }}
            />

            <div className="relative z-10 flex flex-wrap justify-center gap-1 rounded-xl bg-[#232323] p-1.5 mb-6 shadow-lg">
              {TOOLBAR_ZONES.map(({ zone, label }) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedZone === zone
                      ? "bg-white text-[#171716]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              ref={previewContainerRef}
              className="relative z-10 w-full max-w-[560px] mx-auto"
              style={{ aspectRatio: "1 / 1" }}
            >
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "center center",
                  }}
                  className="shadow-2xl"
                >
                  <PosterCanvas
                    {...posterState}
                    id="visible-poster"
                    selectedZone={
                      selectedZone === "captions" ? null : selectedZone
                    }
                    onSelectZone={(zone) => setSelectedZone(zone)}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-white/40 mt-6 text-center max-w-md">
              Click any part of the poster to edit it right there, or use the
              toolbar above.
            </div>
          </div>

          {/* Properties panel: bound to whatever is selected */}
          <Card>
            <CardContent className="pt-6">
              {selectedZone === null && (
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Nothing selected yet. Click any element on the poster, or
                  pick a section from the toolbar above the canvas, to edit
                  it here.
                </div>
              )}

              {selectedZone === "header" && (
                <div className="flex flex-col gap-5">
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
                  <Separator />
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
                </div>
              )}

              {selectedZone === "heading" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="heading">Content</Label>
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
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <PositionSlider
                      label="X"
                      value={posterState.heading.position.x}
                      onChange={(v) =>
                        handleNestedChange(["heading", "position", "x"], v)
                      }
                    />
                    <PositionSlider
                      label="Y"
                      value={posterState.heading.position.y}
                      onChange={(v) =>
                        handleNestedChange(["heading", "position", "y"], v)
                      }
                    />
                  </div>
                </div>
              )}

              {selectedZone === "paragraph" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="paragraph">Content</Label>
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
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <PositionSlider
                      label="X"
                      value={posterState.paragraph.position.x}
                      onChange={(v) =>
                        handleNestedChange(["paragraph", "position", "x"], v)
                      }
                    />
                    <PositionSlider
                      label="Y"
                      value={posterState.paragraph.position.y}
                      onChange={(v) =>
                        handleNestedChange(["paragraph", "position", "y"], v)
                      }
                    />
                  </div>
                </div>
              )}

              {selectedZone === "dateCircle" && (
                <DateCircleEditor
                  dateCircle={posterState.dateCircle}
                  onChange={(v) => handleStateChange("dateCircle", v)}
                />
              )}

              {selectedZone === "photo" && (
                <div className="flex flex-col gap-4">
                  <ImageUpload
                    label="Upload Custom Background"
                    onUpload={(url) =>
                      handleStateChange("backgroundImage", url)
                    }
                    currentImage={posterState.backgroundImage}
                  />
                  <Separator />
                  <CropImageSelector
                    selectedCrop={crop}
                    onImageSelect={(imageUrl) =>
                      handleStateChange("backgroundImage", imageUrl)
                    }
                    currentImage={posterState.backgroundImage}
                  />
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Fit</Label>
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
                      <Label>Position</Label>
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
                </div>
              )}

              {selectedZone === "footer" && (
                <LogoManager
                  footerLogos={posterState.footerLogos}
                  onLogoChange={handleFooterLogoChange}
                  onAddLogo={addFooterLogo}
                  onRemoveLogo={removeFooterLogo}
                />
              )}

              {selectedZone === "captions" && (
                <div className="flex flex-col gap-4">
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
                            copyToClipboard(
                              generatedSocialContent.youtube,
                              toast,
                            )
                          }
                          showCharCount
                        />
                      </TabsContent>
                      <TabsContent value="facebook">
                        <ContentDisplay
                          label="Facebook Post"
                          content={generatedSocialContent.facebook}
                          onCopy={() =>
                            copyToClipboard(
                              generatedSocialContent.facebook,
                              toast,
                            )
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
                              toast,
                            )
                          }
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Copy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>
                        Select locations, crop, date, and time to generate
                        social media content
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
