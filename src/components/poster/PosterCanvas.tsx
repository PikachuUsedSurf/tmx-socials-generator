"use client"

import React from "react"
import type { PosterState } from "@/lib/types"
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types"
import { renderRichText } from "@/lib/utils/formatting"

const OVERLAY_IMAGE_URL = "/images/backgrounds/overlay.png"

interface PosterCanvasProps extends PosterState {
    id: string
}

export function PosterCanvas(props: PosterCanvasProps) {
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
    } = props

    return (
        <div
            id={id}
            className="bg-[#002f2f] relative overflow-hidden text-white"
            style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
        >
            {/* Background Image */}
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

            {/* Overlay */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${OVERLAY_IMAGE_URL})`,
                    mixBlendMode: "normal",
                    opacity: 1,
                }}
            />

            {/* Header */}
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

            {/* Main Content */}
            <main className="absolute top-0 left-0 w-full h-full z-0">
                {/* Date Circle */}
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

                {/* Heading */}
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

                {/* Paragraph */}
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

            {/* Footer */}
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
                        )
                )}
            </footer>
        </div>
    )
}
