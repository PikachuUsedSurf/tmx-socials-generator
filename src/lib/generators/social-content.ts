// Social media content generation (YouTube / Facebook / Instagram)
//
// Pure module: no React, no toasts. Returns null when inputs are incomplete;
// the caller decides how to surface that (toast, disable button, ...).

import { CROP_TRANSLATIONS_SW } from "@/lib/constants/crops";
import { ORGANIZATION_MAP } from "@/lib/constants/organizations";
import { formatOrganizations, toCamelCase } from "@/lib/utils/formatting";
import type { CropName } from "@/lib/types";

export const FACEBOOK_TAGS = [
  "@Samia Suluhu Hassan ",
  "@Ikulu Mawasiliano",
  "@Wizara ya Fedha",
  "@Wizara ya Viwanda na Biashara",
  "@Ofisi ya Rais - Tamisemi",
  "@Capital Market & Security Authority",
  "@Bank of Tanzania",
  "@Tume Ya Maendeleo Ya Ushirika",
  "@Bodi ya Usimamizi wa Stakabadhi za Ghala-WRRB",
];

export const INSTAGRAM_TAGS = [
  "@samia_suluhu_hassan",
  "@ikulu_mawasiliano",
  "@urtmof",
  "@viwandabiashara",
  "@ortamisemi",
  "@cmsa.go.tz",
  "@bankoftanzania_",
  "@ushirika_tcdc",
  "@wrrbwrs",
];

export const HASHTAGS = [
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

export interface SocialContent {
  youtube: string;
  facebook: string;
  instagram: string;
}

export function generateSocialContent(
  locations: string[],
  crop: CropName,
  date: string,
  time: string,
): SocialContent | null {
  if (locations.length === 0 || !crop || !date || !time) {
    return null;
  }

  const formattedDate = new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/");

  const organizations = ORGANIZATION_MAP[crop];
  const formattedOrganizationsSwahili = formatOrganizations(
    organizations,
    "swahili",
  );
  const formattedOrganizationsEnglish = formatOrganizations(
    organizations,
    "english",
  );
  const cropHashtag = `#${crop.toLowerCase().replace(" ", "")}`;

  const formattedLocations = locations.map(toCamelCase).join(", ");

  const youtubeTitle =
    `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS_SW[crop]} ${formattedLocations} MBASHARA-TMX OTS | ${formattedDate})`.toUpperCase();

  const socialMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${formattedLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${FACEBOOK_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim();

  const instagramMessage = `
Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[
    crop
  ].toLowerCase()} Mkoa wa ${formattedLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.

We welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${
    locations.length > 1 ? "s" : ""
  }.

${INSTAGRAM_TAGS.join("\n")}

${HASHTAGS.join(" ")} ${cropHashtag}
  `.trim();

  return {
    youtube: youtubeTitle,
    facebook: socialMessage,
    instagram: instagramMessage,
  };
}
