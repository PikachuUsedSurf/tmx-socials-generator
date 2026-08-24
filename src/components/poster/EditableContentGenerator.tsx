"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, X } from "lucide-react";
import type { PosterState, CropName } from "@/lib/types";
import { AVAILABLE_LOCATIONS } from "@/lib/constants/locations";
import { CROPS } from "@/lib/constants/crops";
import { generatePosterContent } from "@/lib/generators/poster-content";

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

export const EditableContentGenerator: React.FC<EditableContentGeneratorProps> = ({
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