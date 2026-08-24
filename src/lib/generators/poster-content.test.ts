import { describe, it, expect } from "vitest";
import { generatePosterContent, mergeContentIntoState } from "./poster-content";
import type { PosterState } from "@/lib/types";

const baseState: PosterState = {
  topText: "ORIGINAL TOP",
  heading: { content: "DENGU", position: { x: 54, y: 465 } },
  paragraph: {
    content: "original paragraph",
    position: { x: 54, y: 560 },
  },
  backgroundImage: "/images/bg.png",
  backgroundStyle: { objectFit: "cover", objectPosition: "center center" },
  headerFooterBackgroundColor: "#fefadf",
  dateCircle: {
    position: { x: 162, y: 300 },
    topText: { content: "Tarehe", position: { x: 100, y: 40 } },
    mainText: { content: "23", position: { x: 100, y: 100 } },
    bottomText: { content: "Julai\n2025", position: { x: 100, y: 160 } },
  },
  topLeftLogo: "/a.png",
  topRightLogo: "/b.png",
  footerLogos: ["/tmx.png"],
};

describe("generatePosterContent", () => {
  it("generates Swahili content for a single region", () => {
    const c = generatePosterContent(
      ["SINGIDA"],
      "SESAME",
      "2025-07-23",
      "10:30",
      "sw",
    );
    expect(c.heading?.content).toBe("UFUTA");
    expect(c.topText).toContain("JAMHURI YA MUUNGANO WA TANZANIA");
    expect(c.paragraph?.content).toContain("Mkoa wa **Singida**");
    expect(c.dateCircle?.topText.content).toBe("Tarehe");
    expect(c.dateCircle?.bottomText.content).toContain("Julai");
  });

  it("generates English content with plural regions", () => {
    const c = generatePosterContent(
      ["SINGIDA", "DODOMA"],
      "SESAME",
      "2025-07-23",
      "10:30",
      "en",
    );
    expect(c.heading?.content).toBe("SESAME");
    expect(c.paragraph?.content).toContain("Regions");
    expect(c.paragraph?.content).toContain("Singida and Dodoma");
    expect(c.dateCircle?.topText.content).toBe("Date");
  });

  it("uses special coffee layout positions", () => {
    const coffee = generatePosterContent(
      ["SINGIDA"],
      "COFFEE",
      "2025-07-23",
      "10:30",
      "en",
    );
    expect(coffee.heading?.position.y).toBe(590);
    expect(coffee.dateCircle?.position.y).toBe(467);
    expect(coffee.paragraph?.content).toContain("Tanzania Coffee Board");

    const other = generatePosterContent(
      ["SINGIDA"],
      "SESAME",
      "2025-07-23",
      "10:30",
      "en",
    );
    expect(other.heading?.position.y).toBe(465);
    expect(other.dateCircle?.position.y).toBe(300);
  });

  it("derives footer logos from crop organizations without duplicates", () => {
    const c = generatePosterContent(
      ["SINGIDA"],
      "SESAME",
      "2025-07-23",
      "10:30",
      "sw",
    );
    const logos = c.footerLogos ?? [];
    expect(logos.length).toBe(new Set(logos).size);
    expect(logos[0]).toBeTruthy();
  });

  it("is deterministic for identical inputs (locale-pinned dates)", () => {
    const a = generatePosterContent(
      ["SINGIDA"],
      "SESAME",
      "2025-01-05",
      "08:00",
      "en",
    );
    const b = generatePosterContent(
      ["SINGIDA"],
      "SESAME",
      "2025-01-05",
      "08:00",
      "en",
    );
    expect(a).toEqual(b);
  });
});

describe("mergeContentIntoState", () => {
  it("overrides text content but keeps untouched fields", () => {
    const merged = mergeContentIntoState(baseState, {
      topText: "NEW TOP",
      heading: { content: "NEW HEADING", position: { x: 1, y: 2 } },
    });
    expect(merged.topText).toBe("NEW TOP");
    expect(merged.heading.content).toBe("NEW HEADING");
    // background untouched
    expect(merged.backgroundImage).toBe("/images/bg.png");
    // other logos untouched
    expect(merged.topLeftLogo).toBe("/a.png");
  });

  it("does not mutate the previous state", () => {
    const snapshot = JSON.stringify(baseState);
    mergeContentIntoState(baseState, {
      topText: "CHANGED",
      paragraph: { content: "changed para", position: { x: 0, y: 0 } },
    });
    expect(JSON.stringify(baseState)).toBe(snapshot);
  });

  it("merges partial date circle updates field-by-field", () => {
    const merged = mergeContentIntoState(baseState, {
      dateCircle: {
        position: { x: 500, y: 500 },
        topText: { content: "Date", position: undefined as never },
      } as PosterState["dateCircle"],
    });
    expect(merged.dateCircle.position).toEqual({ x: 500, y: 500 });
    expect(merged.dateCircle.topText.content).toBe("Date");
    // sub-element without new content keeps old value
    expect(merged.dateCircle.mainText.content).toBe("23");
    expect(merged.dateCircle.bottomText.content).toBe("Julai\n2025");
  });
});
