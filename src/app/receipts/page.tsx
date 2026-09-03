"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Banknote, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AVAILABLE_LOCATIONS } from "@/lib/constants/locations";

// Common Tanzanian names used as a placeholder for the "OFFICE DRIVER" tag
// until a real driver-name field is confirmed.
const PLACEHOLDER_DRIVER_NAMES = [
  "Juma Mwakalindile",
  "Amina Hassan",
  "Baraka Mushi",
  "Fatuma Kessy",
  "Hamisi Ndosi",
  "Zainab Chuma",
  "Rashidi Mbwana",
  "Mariam Kileo",
  "Salum Kagoma",
  "Neema Shirima",
  "Idrisa Mnyamani",
  "Halima Mtui",
  "Peter Machumu",
  "Grace Nyerere",
  "Emmanuel Sanga",
  "Elizabeth Mrema",
  "Yohana Kimaro",
  "Anna Massawe",
  "Daudi Chacha",
  "Rehema Lyimo",
];

const randomDriverName = (exclude?: string): string => {
  const options = PLACEHOLDER_DRIVER_NAMES.filter((n) => n !== exclude);
  return options[Math.floor(Math.random() * options.length)];
};

const generateInvoiceNumber = (): string => {
  const part1 = Math.floor(10_000_000_000 + Math.random() * 89_999_999_999);
  const part2 = Math.floor(1000 + Math.random() * 8999);
  const part3 = Math.floor(100 + Math.random() * 899);
  return `${part1}-TZ${part2}-${part3}`;
};

const formatWithCommas = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatPlain = (value: number): string => value.toFixed(2);

const RECEIPT_WIDTH = 794;
const RECEIPT_HEIGHT = 1123;

// Additional Funds is a small handling fee carved out of the entered total,
// with Travel Fund taking the rest — the two always sum back to the total.
const ADDITIONAL_FUNDS_PERCENT = 0.025;

interface ReceiptProps {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  startLocation: string;
  total: number;
  invoiceNo: string;
  driverTag: string;
}

// Pure renderer: takes receipt fields as props, draws them. No logic.
// Defined at module scope (not inside the page component) so React keeps
// the same component identity across re-renders — a component redefined
// on every render gets unmounted/remounted on state changes, which can tear
// down its DOM mid-capture while html-to-image is still reading it.
const Receipt: React.FC<ReceiptProps> = ({
  id,
  name,
  location,
  date,
  time,
  startLocation,
  total,
  invoiceNo,
  driverTag,
}) => {
  const additionalFunds = total * ADDITIONAL_FUNDS_PERCENT;
  const travelFund = total - additionalFunds;

  return (
  <div
    id={id}
    className="bg-white text-black"
    style={{
      width: RECEIPT_WIDTH,
      height: RECEIPT_HEIGHT,
      padding: "48px 42px",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "10.5pt",
      boxSizing: "border-box",
    }}
  >
    {/* Header: logo + invoice meta */}
    <div className="flex justify-between items-start">
      <img
        src="/images/logos/receipt-logo.png"
        alt="TMX PLC"
        width={190}
        height={68}
        className="object-contain"
        crossOrigin="anonymous"
      />
      <div className="text-right">
        <div style={{ fontSize: "13.5pt" }} className="font-bold">
          Invoice no. {invoiceNo}
        </div>
        <div className="mt-2.5">Date: {date || "____-__-__"}</div>
      </div>
    </div>

    {/* Recipient block */}
    <div className="mt-7">
      <div>Recipient:</div>
      <div className="flex justify-between mt-1">
        <span className="font-bold">{name || " "}</span>
        <span>{driverTag}</span>
      </div>
      <div className="flex justify-between">
        <span>&nbsp;</span>
        <span>{location || " "}</span>
      </div>
    </div>

    <div className="mt-5">
      Start: {startLocation || "____"} ({date || "____-__-__"} {time || "__:__"})
    </div>

    {/* Line-item table (flex rows, fixed-width cells) */}
    <div className="mt-4 border-t border-l border-black">
      <div className="flex">
        <div className="flex-1 border-r border-b border-black p-1.5 text-center font-bold">Title</div>
        <div className="w-[130px] border-r border-b border-black p-1.5 text-left font-bold">Sum (TZS)</div>
        <div className="w-[110px] border-r border-b border-black p-1.5 text-center font-bold">VAT 0%</div>
        <div className="w-[150px] border-r border-b border-black p-1.5 text-left font-bold">Total sum (TZS)</div>
      </div>
      <div className="flex">
        <div className="flex-1 border-r border-b border-black p-1.5 text-left">Trip Fee</div>
        <div className="w-[130px] border-r border-b border-black p-1.5 text-right">{formatWithCommas(travelFund)}</div>
        <div className="w-[110px] border-r border-b border-black p-1.5 text-right">0.00</div>
        <div className="w-[150px] border-r border-b border-black p-1.5 text-right">{formatWithCommas(travelFund)}</div>
      </div>
      <div className="flex">
        <div className="flex-1 border-r border-b border-black p-1.5 text-left">Booking Fee</div>
        <div className="w-[130px] border-r border-b border-black p-1.5 text-right">{formatWithCommas(additionalFunds)}</div>
        <div className="w-[110px] border-r border-b border-black p-1.5 text-right">0.00</div>
        <div className="w-[150px] border-r border-b border-black p-1.5 text-right">{formatWithCommas(additionalFunds)}</div>
      </div>
    </div>

    {/* Totals summary */}
    <div className="mt-2">
      <div className="flex justify-end gap-8">
        <span>Total (TZS):</span>
        <span className="w-[120px] text-right">{formatPlain(total)}</span>
      </div>
      <div className="flex justify-end gap-8">
        <span>VAT 0%:</span>
        <span className="w-[120px] text-right">0.00</span>
      </div>
      <div className="flex justify-end gap-8 font-bold">
        <span>Total including VAT (TZS):</span>
        <span className="w-[120px] text-right">{formatPlain(total)}</span>
      </div>
      <div className="flex justify-end items-center gap-8 font-bold mt-3.5">
        <span className="flex items-center gap-1.5">
          Charged
          <Banknote size={18} className="inline-block text-[#2fb56e]" />
          Cash:
        </span>
        <span className="w-[120px] text-right">{formatPlain(total)}</span>
      </div>
    </div>
  </div>
  );
};

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [driverTag, setDriverTag] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    setDate(localDate.toISOString().split("T")[0]);
    setTime(localDate.toISOString().split("T")[1].slice(0, 5));
    setInvoiceNo(generateInvoiceNumber());
    setDriverTag(randomDriverName());
  }, []);

  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      const { width } = previewContainerRef.current.getBoundingClientRect();
      setPreviewScale(width / RECEIPT_WIDTH);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  const total = parseFloat(totalAmount) || 0;

  const handleDownload = async () => {
    if (!name || !location || !date || !startLocation || !totalAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in name, location, date, start location, and total amount before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const receiptElement = document.getElementById("receipt-canvas");
      if (!receiptElement) throw new Error("Receipt element not found.");

      const dataUrl = await toPng(receiptElement, {
        width: RECEIPT_WIDTH,
        height: RECEIPT_HEIGHT,
        canvasWidth: RECEIPT_WIDTH,
        canvasHeight: RECEIPT_HEIGHT,
        pixelRatio: 2,
        skipAutoScale: true,
        cacheBust: true,
        style: {
          width: `${RECEIPT_WIDTH}px`,
          height: `${RECEIPT_HEIGHT}px`,
        },
      });

      const link = document.createElement("a");
      link.download = `receipt_${name.toLowerCase().replace(/\s+/g, "_")}_${date}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Receipt downloaded",
        description: "The receipt has been saved to your downloads.",
      });
    } catch (err) {
      console.error("Failed to download receipt:", err);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the receipt.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const receiptProps = {
    name,
    location,
    date,
    time,
    startLocation,
    total,
    invoiceNo,
    driverTag,
  };

  return (
    <div className="min-h-screen">
      {/* Hidden full-size canvas used for downloads, kept outside the scaled preview wrapper */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <Receipt id="receipt-canvas" {...receiptProps} />
      </div>

      <div className="max-w-screen mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receipt Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nanayaw"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kariakoo"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="startLocation">Start Location</Label>
                    <Input
                      id="startLocation"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      placeholder="e.g. Kwa Msuguri, Dar es Salaam"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalAmount">Total Amount (TZS)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Office Driver (placeholder)</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setDriverTag((prev) => randomDriverName(prev))}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {driverTag} — randomly generated for now until confirmed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="xl:col-span-2 xl:sticky xl:top-6 xl:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={previewContainerRef}
                  className="w-full mx-auto border"
                  style={{ aspectRatio: `${RECEIPT_WIDTH} / ${RECEIPT_HEIGHT}` }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <div
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <Receipt id="visible-receipt" {...receiptProps} />
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

export default App;
