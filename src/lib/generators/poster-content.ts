// Poster content generation (bilingual Swahili/English auction announcements)
//
// Pure module: inputs (locations, crop, date, time, language) in,
// Partial<PosterState> out. All date formatting is pinned to explicit
// locales so output does not depend on the machine's timezone/locale.
// This is the module's test surface: snapshot tests lock the wording.

import { CROP_NAMES_EN, CROP_TRANSLATIONS_SW } from "@/lib/constants/crops";
import { LOGO_URL_MAP, ORGANIZATION_MAP } from "@/lib/constants/organizations";
import { formatList, toCamelCase } from "@/lib/utils/formatting";
import { formatTime } from "@/lib/utils/time";
import type { CropName, PositionableElement, PosterState } from "@/lib/types";

export function generatePosterContent(
  locations: string[],
  crop: CropName,
  date: string,
  time: string,
  lang: "sw" | "en",
): Partial<PosterState> {
  const formattedLocations = formatList(locations.map(toCamelCase), lang);
  const organizations = ORGANIZATION_MAP[crop] || [];
  const formattedOrganizations = formatList(organizations, lang);
  const formattedTime = formatTime(time, lang);
  const dateObj = new Date(date + "T12:00:00Z");
  const day = dateObj.toLocaleDateString("en-GB", { day: "2-digit" });
  const swahiliMonth = dateObj.toLocaleDateString("sw-TZ", { month: "long" });
  const englishMonth = dateObj.toLocaleDateString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  const swahiliWeekday = dateObj.toLocaleDateString("sw-TZ", {
    weekday: "long",
  });
  const englishWeekday = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const fullDateGB = dateObj.toLocaleDateString("en-GB");

  let topText: string;
  let heading: string;
  let paragraph: string;
  let dateCircleContent: {
    topText: PositionableElement;
    mainText: PositionableElement;
    bottomText: PositionableElement;
  };

  if (lang === "sw") {
    const cropSwahili = CROP_TRANSLATIONS_SW[crop];
    topText = `JAMHURI YA MUUNGANO WA TANZANIA\nWIZARA YA FEDHA\nSOKO LA BIDHAA TANZANIA`;
    heading = cropSwahili.toUpperCase();
    if (crop === "COFFEE") {
      paragraph = `Soko la Bidhaa Tanzania (TMX) kwa kushirikiana na Bodi ya Kahawa Tanzania (TCB) inakukaribisha kushiriki mnada wa Kahawa unaotarajia kufanyika Mkoa wa **${formattedLocations}**, siku ya **${swahiliWeekday}** **${fullDateGB}** kuanzia **saa 5:00 Asubuhi** Kwa njia ya kielektroniki.\n\nWote Mnakaribishwa`;
    } else if (locations.length < 2) {
      paragraph = `**TMX, ${formattedOrganizations}** na Serikali ya Mkoa wa **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mkoa wa **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`;
    } else {
      paragraph = `**TMX, ${formattedOrganizations}** na Serikali ya Mikoa ya **${formattedLocations}** Zinawataarifu Wanunuzi na Wadau wote kushiriki mnada wa zao la **${cropSwahili.toUpperCase()}** Mikoa ya **${formattedLocations}**.\n\nMnada utafanyika **${swahiliWeekday}**, tarehe **${fullDateGB}** Kuanzia **${formattedTime}** Kwa njia ya Kidijitali.\n\nKaribuni wote`;
    }
    dateCircleContent = {
      topText: { content: "Tarehe", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 100 } },
      bottomText: {
        content: `${swahiliMonth}\n${year}`,
        position: { x: 100, y: 160 },
      },
    };
  } else {
    const cropEnglish = CROP_NAMES_EN[crop];
    const regionText = `Region${locations.length > 1 ? "s" : ""}`;
    topText = `THE UNITED REPUBLIC OF TANZANIA\nMINISTRY OF FINANCE\nTANZANIA MERCANTILE EXCHANGE`;
    heading = cropEnglish.toUpperCase();
    if (crop === "COFFEE") {
      paragraph = `Tanzania Mercantile Exchange (TMX) in collaboration with Tanzania Coffee Board (TCB) invites you to participate in the Online Auction in **${formattedLocations}** ${regionText} on **${englishWeekday}**, **${fullDateGB}** from **11:00 AM**.\n\nYou are all welcome`;
    } else if (locations.length < 2) {
      paragraph = `**TMX, ${formattedOrganizations}** the Regional and District Government Authority of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`;
    } else {
      paragraph = `**TMX, ${formattedOrganizations}** the Regional and District Government Authorities of **${formattedLocations}** hereby invites you to participate in the **${cropEnglish.toUpperCase()}** auction in **${formattedLocations}** ${regionText}.\n\nThe auction will take place on **${englishWeekday}**, **${fullDateGB}**, from **${formattedTime}** through TMX Online Trading System.\n\nAll are welcome`;
    }
    dateCircleContent = {
      topText: { content: "Date", position: { x: 100, y: 40 } },
      mainText: { content: day, position: { x: 100, y: 91 } },
      bottomText: {
        content: `${englishMonth}\n${year}`,
        position: { x: 100, y: 160 },
      },
    };
  }

  const footerLogos = [
    LOGO_URL_MAP["TMX"],
    ...organizations.map((org) => LOGO_URL_MAP[org]).filter(Boolean),
  ].filter((v, i, a): v is string => a.indexOf(v) === i);

  const isCoffee = crop === "COFFEE";

  return {
    topText,
    heading: { content: heading, position: { x: 54, y: isCoffee ? 590 : 465 } },
    paragraph: {
      content: paragraph,
      position: { x: isCoffee ? 59 : 54, y: isCoffee ? 705 : 560 },
    },
    dateCircle: {
      position: { x: 162, y: isCoffee ? 467 : 300 },
      topText: {
        content: dateCircleContent.topText.content,
        position: {
          x: 100,
          y: isCoffee ? 36 : dateCircleContent.topText.position.y,
        },
      },
      mainText: {
        content: dateCircleContent.mainText.content,
        position: {
          x: 100,
          y: isCoffee ? 91 : dateCircleContent.mainText.position.y,
        },
      },
      bottomText: {
        content: dateCircleContent.bottomText.content,
        position: {
          x: 100,
          y: isCoffee ? 158 : dateCircleContent.bottomText.position.y,
        },
      },
    },
    footerLogos,
  };
}

/**
 * Merge generated content into existing poster state without clobbering
 * user customisations (positions are only taken when present in content).
 */
export function mergeContentIntoState(
  prevState: PosterState,
  content: Partial<PosterState>,
): PosterState {
  const newState = structuredClone(prevState);
  if (content.topText) newState.topText = content.topText;
  if (content.footerLogos) newState.footerLogos = content.footerLogos;
  if (content.heading?.content)
    newState.heading.content = content.heading.content;
  if (content.heading?.position)
    newState.heading.position = content.heading.position;
  if (content.paragraph?.content)
    newState.paragraph.content = content.paragraph.content;
  if (content.paragraph?.position)
    newState.paragraph.position = content.paragraph.position;
  if (content.dateCircle) {
    if (content.dateCircle.position)
      newState.dateCircle.position = content.dateCircle.position;
    if (content.dateCircle.topText?.content)
      newState.dateCircle.topText.content =
        content.dateCircle.topText.content;
    if (content.dateCircle.topText?.position)
      newState.dateCircle.topText.position =
        content.dateCircle.topText.position;
    if (content.dateCircle.mainText?.content)
      newState.dateCircle.mainText.content =
        content.dateCircle.mainText.content;
    if (content.dateCircle.mainText?.position)
      newState.dateCircle.mainText.position =
        content.dateCircle.mainText.position;
    if (content.dateCircle.bottomText?.content)
      newState.dateCircle.bottomText.content =
        content.dateCircle.bottomText.content;
    if (content.dateCircle.bottomText?.position)
      newState.dateCircle.bottomText.position =
        content.dateCircle.bottomText.position;
  }
  return newState;
}
