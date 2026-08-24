// Title generator content (YouTube titles, trade posts, commodity-price captions)
//
// Pure module backing SocialMediaTitleGenerator. Uses the canonical tag
// lists from lib/constants/social-tags. Note: these tag lists differ from
// the ones embedded in the poster page's social-content generator — that
// divergence is intentional legacy behaviour, do not "unify" silently.

import {
  COMMODITY_PRICE_HASHTAGS,
  FACEBOOK_TAGS,
  HASHTAGS,
  INSTAGRAM_TAGS,
} from "@/lib/constants/social-tags";
import { CROP_TRANSLATIONS_SW } from "@/lib/constants/crops";
import { ORGANIZATION_MAP } from "@/lib/constants/organizations";
import { formatOrganizations, toCamelCase } from "@/lib/utils/formatting";
import type { CropName } from "@/lib/types";

export interface TitleGeneratorContent {
  youtube: string;
  facebook: string;
  instagram: string;
  /** Commodity-price caption for Facebook */
  facebookResult: string;
  /** Commodity-price caption for Instagram */
  instagramResult: string;
}

export function generateTitleGeneratorContent(
  locations: string[],
  crop: CropName,
  date: string,
): TitleGeneratorContent | null {
  if (locations.length === 0 || !crop || !date) {
    return null;
  }

  const formattedLocations = locations.map(toCamelCase).join(", ");

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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

  const youtubeTitle =
    `[LIVE] ${crop} TRADE SESSION ${formattedLocations} (MNADA WA ${CROP_TRANSLATIONS_SW[crop]} ${formattedLocations} MBASHARA-TMX OTS | ${formattedDate})`.toUpperCase();

  const tradeBody = `Karibuni kushiriki kwenye mauzo ya zao la ${CROP_TRANSLATIONS_SW[crop].toLowerCase()} Mkoa wa ${formattedLocations} kupitia Mfumo wa Mauzo wa Kidijitali wa TMX kwa kushirikiana na ${formattedOrganizationsSwahili}.\n\nWe welcome you all to participate in ${crop.toLowerCase()} trading through TMX Online Trading System in collaboration with ${formattedOrganizationsEnglish} in ${formattedLocations} Region${locations.length > 1 ? "s" : ""}.`;

  const socialMessage = `${tradeBody}\n\n${FACEBOOK_TAGS.join("\n")}\n\n${HASHTAGS.join(" ")} ${cropHashtag}`;
  const instagramMessage = `${tradeBody}\n\n${INSTAGRAM_TAGS.join("\n")}\n\n${HASHTAGS.join(" ")} ${cropHashtag}`;

  const commodityPriceBody = `Taarifa za Bei za Bidhaa leo. Kwa taarifa zaidi tembelea tovuti kupitia kiunga kwenye bio.\n\nCommodity Price Information Today. For more information, visit our website through the links in bio.\n\n`;
  const commodityPriceTitle = `${commodityPriceBody}${FACEBOOK_TAGS.join("\n")}\n\n${COMMODITY_PRICE_HASHTAGS.join(" ")}`;
  const commodityPriceTitleInstagram = `${commodityPriceBody}${INSTAGRAM_TAGS.join("\n")}\n\n${COMMODITY_PRICE_HASHTAGS.join(" ")}`;

  return {
    youtube: youtubeTitle,
    facebook: socialMessage,
    instagram: instagramMessage,
    facebookResult: commodityPriceTitle,
    instagramResult: commodityPriceTitleInstagram,
  };
}
