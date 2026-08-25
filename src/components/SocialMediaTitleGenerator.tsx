"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { AVAILABLE_LOCATIONS } from "@/lib/constants/locations";
import type { CropName } from "@/lib/types";
import { CROPS } from "@/lib/constants/crops";
import {
  generateTitleGeneratorContent,
  type TitleGeneratorContent,
} from "@/lib/generators/title-generator";

const transitionProps = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export default function SocialMediaTitleGenerator() {
  const [locations, setLocations] = useState<string[]>([]);
  const [crop, setCrop] = useState<CropName | "">("");
  const [date, setDate] = useState("");
  const [generatedContent, setGeneratedContent] =
    useState<TitleGeneratorContent | null>(null);

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const toggleLocation = (selectedLocation: string) => {
    setLocations((prev) =>
      prev.includes(selectedLocation)
        ? prev.filter((loc) => loc !== selectedLocation)
        : [...prev, selectedLocation],
    );
  };

  const toggleCrop = (selectedCrop: CropName) => {
    setCrop((prev) => (prev === selectedCrop ? "" : selectedCrop));
  };

  const generateContent = () => {
    if (locations.length === 0 || !crop || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const content = generateTitleGeneratorContent(locations, crop, date);
    if (content) setGeneratedContent(content);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard.",
    });
  };

  return (
    <div className="w-auto mx-auto mt-10 p-6 bg-card rounded-lg border">
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="location">Locations</Label>
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            layout
            transition={transitionProps}
          >
            {AVAILABLE_LOCATIONS.map((location) => (
              <SelectablePill
                key={location}
                label={location}
                isSelected={locations.includes(location)}
                onClick={() => toggleLocation(location)}
              />
            ))}
          </motion.div>
        </div>

        <div>
          <Label>Crop</Label>
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            layout
            transition={transitionProps}
          >
            {CROPS.map((cropName) => (
              <SelectablePill
                key={cropName}
                label={cropName}
                isSelected={crop === cropName}
                onClick={() => toggleCrop(cropName)}
              />
            ))}
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
        {generatedContent && (
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
            <TabsContent
              value="facebook"
              className="flex flex-col gap-8 md:flex-row"
            >
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
            <TabsContent
              value="instagram"
              className="flex flex-col gap-8 md:flex-row"
            >
              <ContentDisplay
                label="Instagram Message"
                content={generatedContent.instagram}
                onCopy={() => copyToClipboard(generatedContent.instagram)}
              />
              <ContentDisplay
                label="Instagram Results Caption"
                content={generatedContent.instagramResult}
                onCopy={() =>
                  copyToClipboard(generatedContent.instagramResult)
                }
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function SelectablePill({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={false}
      animate={{
        backgroundColor: isSelected
          ? "var(--primary)"
          : "var(--background)",
        color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
      }}
      whileHover={{
        backgroundColor: isSelected
          ? "color-mix(in srgb, var(--primary) 80%, transparent)"
          : "var(--accent)",
      }}
      whileTap={{
        backgroundColor: isSelected
          ? "color-mix(in srgb, var(--primary) 65%, transparent)"
          : "var(--accent)",
      }}
      transition={{ ...transitionProps, backgroundColor: { duration: 0.1 } }}
      className="px-3 py-1 rounded-full text-sm font-medium border"
    >
      <motion.div
        className="relative flex items-center"
        animate={{ paddingRight: isSelected ? "1.5rem" : "0" }}
        transition={{ ease: [0.175, 0.885, 0.32, 1.275], duration: 0.3 }}
      >
        <span>{label}</span>
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
  );
}

function ContentDisplay({
  label,
  content,
  onCopy,
  showCharCount = false,
}: {
  label: string;
  content: string;
  onCopy: () => void;
  showCharCount?: boolean;
}) {
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
}
