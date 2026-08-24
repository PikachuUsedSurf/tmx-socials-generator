import { describe, it, expect } from "vitest";
import { generateSocialContent } from "./social-content";
import type { CropName } from "@/lib/types";

describe("generateSocialContent", () => {
  it("returns null when inputs are incomplete", () => {
    expect(generateSocialContent([], "SESAME", "2025-07-23", "10:30")).toBeNull();
    expect(generateSocialContent(["SINGIDA"], "" as CropName, "", "")).toBeNull();
  });

  it("builds a YouTube title with crop, region and date", () => {
    const c = generateSocialContent(["SINGIDA"], "SESAME", "2025-07-23", "10:30")!;
    expect(c.youtube).toContain("[LIVE] SESAME TRADE SESSION SINGIDA");
    expect(c.youtube).toContain("UFUTA");
    expect(c.youtube).toContain("TMX OTS");
    expect(c.youtube).toContain("23/07/2025");
  });

  it("includes Facebook tags in facebook post and Instagram tags in instagram post", () => {
    const c = generateSocialContent(["SINGIDA"], "SESAME", "2025-07-23", "10:30")!;
    expect(c.facebook).toContain("@Samia Suluhu Hassan");
    expect(c.instagram).toContain("@samia_suluhu_hassan");
  });

  it("pluralizes Region(s) for multiple locations", () => {
    const one = generateSocialContent(["SINGIDA"], "SESAME", "2025-07-23", "10:30")!;
    const two = generateSocialContent(["SINGIDA", "DODOMA"], "SESAME", "2025-07-23", "10:30")!;
    expect(one.facebook).toContain("Singida Region.");
    expect(two.facebook).toContain("Singida, Dodoma Regions.");
  });
});
