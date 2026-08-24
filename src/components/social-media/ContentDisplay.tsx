"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

interface ContentDisplayProps {
  label: string;
  content: string;
  onCopy: () => void;
  showCharCount?: boolean;
}

export const ContentDisplay = ({
  label,
  content,
  onCopy,
  showCharCount = false,
}: ContentDisplayProps) => {
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