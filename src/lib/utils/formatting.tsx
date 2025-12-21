import React from "react"

/**
 * Convert a string to CamelCase (capitalize first letter of each word)
 */
export const toCamelCase = (str: string): string =>
    str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")

/**
 * Format a list of items with proper conjunction (Swahili or English)
 */
export const formatList = (items: string[], lang: "sw" | "en"): string => {
    const conjunction = lang === "sw" ? "na" : "and"
    if (items.length === 0) return ""
    if (items.length === 1) return items[0]
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
    return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`
}

/**
 * Format organizations with proper conjunction
 */
export const formatOrganizations = (
    orgs: string[],
    language: "swahili" | "english"
): string => {
    if (orgs.length === 0) return ""
    if (orgs.length === 1) return orgs[0]
    if (orgs.length === 2) {
        return language === "swahili"
            ? `${orgs[0]} na ${orgs[1]}`
            : `${orgs[0]} and ${orgs[1]}`
    }
    return language === "swahili"
        ? `${orgs.slice(0, -1).join(", ")}, na ${orgs[orgs.length - 1]}`
        : `${orgs.slice(0, -1).join(", ")}, and ${orgs[orgs.length - 1]}`
}

/**
 * Render rich text with **bold** markdown syntax
 */
export const renderRichText = (text: string): React.ReactNode => {
    if (typeof text !== "string") return text
    return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    )
}

/**
 * Copy text to clipboard with toast notification
 */
export const copyToClipboard = async (
    text: string,
    showToast?: (options: { title: string; description: string }) => void
): Promise<void> => {
    await navigator.clipboard.writeText(text)
    showToast?.({
        title: "Copied to clipboard",
        description: "The generated content has been copied to your clipboard.",
    })
}
