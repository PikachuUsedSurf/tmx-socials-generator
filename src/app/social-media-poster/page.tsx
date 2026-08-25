"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Trash2,
  Plus,
  Palette,
  Type,
  ImageIcon,
  Calendar,
  Copy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  CropImageSelector,
  EditableContentGenerator,
  ImageUpload,
  PositionSlider,
  PosterCanvas,
} from "@/components/poster";
import { ContentDisplay } from "@/components/social-media/ContentDisplay";
import type {
  BackgroundStyle,
  PosterState,
  CropName,
} from "@/lib/types";
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types";
import { CROP_NAMES_EN, CROP_TRANSLATIONS_SW, CROP_BACKGROUND_IMAGES } from "@/lib/constants/crops";
import {
  generatePosterContent,
  mergeContentIntoState,
  generateSocialContent,
} from "@/lib/generators";
import { copyToClipboard } from "@/lib/utils/formatting";

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
            <div className="flex flex-col gap-6">
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

                <TabsContent value="content" className="flex flex-col gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Header & Footer</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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
                    <CardContent className="flex flex-col gap-6">
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

                <TabsContent value="design" className="flex flex-col gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Background</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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

                <TabsContent value="images" className="flex flex-col gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Logos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-3">
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

                <TabsContent value="date" className="flex flex-col gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Date Circle</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
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

                <TabsContent value="copy-pasta" className="flex flex-col gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Social Media Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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
                        <div className="text-center py-8 text-muted-foreground">
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
                    className="w-full"
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
}

export default App;

