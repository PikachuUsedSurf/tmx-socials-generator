import { describe, it, expect } from "vitest";
import { generateTitleGeneratorContent } from "./title-generator";
import type { CropName } from "@/lib/types";

describe("generateTitleGeneratorContent", () => {
  it("returns null when inputs are incomplete", () => {
    expect(generateTitleGeneratorContent([], "SESAME", "2025-07-23")).toBeNull();
    expect(generateTitleGeneratorContent(["SINGIDA"], "" as CropName, "")).toBeNull();
  });

  it("builds a YouTube title with crop, region, Swahili name and date", () => {
    const c = generateTitleGeneratorContent(["SINGIDA"], "SESAME", "2025-07-23")!;
    expect(c.youtube).toBe(
      "[LIVE] SESAME TRADE SESSION SINGIDA (MNADA WA UFUTA SINGIDA MBASHARA-TMX OTS | 23/07/2025)",
    );
  });

  it("includes trade body with organizations in both languages", () => {
    const c = generateTitleGeneratorContent(["SINGIDA"], "SESAME", "2025-07-23")!;
    expect(c.facebook).toContain("kupitia Mfumo wa Mauzo wa Kidijitali wa TMX");
    expect(c.facebook).toContain(
      "through TMX Online Trading System in collaboration with",
    );
  });

  it("uses canonical social-tags lists (facebookResult has price hashtags)", () => {
    const c = generateTitleGeneratorContent(["SINGIDA"], "SESAME", "2025-07-23")!;
    // commodity-price captions carry the price hashtag list
    expect(c.facebookResult).toContain("#sesameseeds");
    expect(c.facebookResult).toContain("Taarifa za Bei za Bidhaa leo");
    expect(c.instagramResult).toContain("@copra_tz");
  });

  it("pluralizes Region(s) for multiple locations", () => {
    const one = generateTitleGeneratorContent(["SINGIDA"], "SESAME", "2025-07-23")!;
    const two = generateTitleGeneratorContent(
      ["SINGIDA", "DODOMA"],
      "SESAME",
      "2025-07-23",
    )!;
    expect(one.facebook).toContain("Singida Region.");
    expect(two.facebook).toContain("Singida, Dodoma Regions.");
  });
});
