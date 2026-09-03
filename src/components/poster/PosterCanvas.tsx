"use client";

import React from "react";
import type { PosterState } from "@/lib/types";
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types";
import { renderRichText } from "@/lib/utils/formatting";

const OVERLAY_IMAGE_URL = "/images/backgrounds/overlay.png";

export type PosterZone =
  | "header"
  | "heading"
  | "paragraph"
  | "dateCircle"
  | "footer"
  | "photo";

interface PosterCanvasProps extends PosterState {
  id: string;
  selectedZone?: PosterZone | null;
  onSelectZone?: (zone: PosterZone) => void;
}

// Renders the poster with all elements positioned correctly.
// Pure renderer: takes PosterState fields as props, draws them. No logic.
// selectedZone/onSelectZone are editor-only affordances (click-to-select);
// left undefined for the hidden download copy so the exported PNG never
// carries selection styling.
export const PosterCanvas: React.FC<PosterCanvasProps> = (props) => {
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
    selectedZone,
    onSelectZone,
  } = props;

  const zoneProps = (zone: PosterZone) =>
    onSelectZone
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelectZone(zone);
          },
          className:
            "cursor-pointer transition-shadow " +
            (selectedZone === zone
              ? "ring-2 ring-white ring-offset-4 ring-offset-transparent"
              : "hover:ring-1 hover:ring-white/50 hover:ring-offset-4 hover:ring-offset-transparent"),
        }
      : {};

  return (
    <div
      id={id}
      className="bg-[#002f2f] relative overflow-hidden text-white"
      style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
      onClick={onSelectZone ? () => onSelectZone("photo") : undefined}
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
        className={`absolute top-0 left-0 right-0 flex justify-between items-center z-10 ${zoneProps("header").className || ""}`}
        style={{
          backgroundColor: headerFooterBackgroundColor,
          padding: "16px 40px",
        }}
        onClick={zoneProps("header").onClick}
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
          className={`absolute z-20 rounded-full ${zoneProps("dateCircle").className || ""}`}
          style={{
            top: dateCircle.position.y,
            left: dateCircle.position.x,
            transform: "translate(-50%, -50%)",
          }}
          onClick={zoneProps("dateCircle").onClick}
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
          className={`absolute ${zoneProps("heading").className || ""}`}
          style={{
            top: heading.position.y,
            left: heading.position.x,
            width: `calc(100% - ${heading.position.x}px - 54px)`,
          }}
          onClick={zoneProps("heading").onClick}
        >
          <h1 className="text-8xl font-extrabold tracking-wider">
            {heading.content}
          </h1>
        </div>

        <div
          className={`absolute ${zoneProps("paragraph").className || ""}`}
          style={{
            top: paragraph.position.y,
            left: paragraph.position.x,
            width: `calc(100% - ${paragraph.position.x}px - 54px)`,
          }}
          onClick={zoneProps("paragraph").onClick}
        >
          <p className="text-[27px]/6 text-justify tracking-tight max-w-5xl whitespace-pre-wrap leading-relaxed">
            {renderRichText(paragraph.content)}
          </p>
        </div>
      </main>

      <footer
        className={`absolute bottom-0 left-0 right-0 flex justify-center items-center gap-14 z-10 ${zoneProps("footer").className || ""}`}
        style={{
          backgroundColor: headerFooterBackgroundColor,
          padding: "16px 40px",
        }}
        onClick={zoneProps("footer").onClick}
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