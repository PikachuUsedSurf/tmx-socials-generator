import type { CropName } from "@/lib/types"

// Organization mappings per crop
export const ORGANIZATION_MAP: Record<CropName, string[]> = {
    BEAN: ["COPRA", "TCDC", "WRRB"],
    CASHEW: ["CBT", "TCDC", "WRRB"],
    "CHICK PEA": ["COPRA", "TCDC", "WRRB"],
    COCOA: ["COPRA", "TCDC", "WRRB"],
    COFFEE: ["TCB", "TCDC", "WRRB"],
    COTTON: ["COPRA", "TCDC", "WRRB"],
    GEMSTONE: ["MC"],
    GROUNDNUT: ["COPRA", "TCDC", "WRRB"],
    "GREEN GRAM": ["COPRA", "TCDC", "WRRB"],
    "PIGEON PEA": ["COPRA", "TCDC", "WRRB"],
    SESAME: ["COPRA", "TCDC", "WRRB"],
    SOYA: ["COPRA", "TCDC", "WRRB"],
    SUNFLOWER: ["COPRA", "TCDC", "WRRB"],
}

// Logo URL mappings for organizations
export const LOGO_URL_MAP: Record<string, string> = {
    TMX: "images/logos/tmx-logo.png",
    WRRB: "images/logos/wrrb-logo.png",
    COPRA: "images/logos/copra-logo.png",
    TCDC: "images/logos/tcdc-logo.png",
    TCB: "images/logos/tcb-logo.png",
    CBT: "images/logos/cbt-logo.png",
    MC: "images/logos/madini.png",
}
