// Swahili number words for time formatting
export const SWAHILI_NUMBERS: Record<number, string> = {
    1: "Moja",
    2: "Mbili",
    3: "Tatu",
    4: "Nne",
    5: "Tano",
    6: "Sita",
    7: "Saba",
    8: "Nane",
    9: "Tisa",
    10: "Kumi",
    11: "Kumi na Moja",
    12: "Kumi na Mbili",
}

/**
 * Get the Swahili period of day based on hour
 */
export const getSwahiliPeriod = (hour: number): string => {
    if (hour >= 5 && hour < 12) return "Asubuhi"
    if (hour >= 12 && hour < 16) return "Mchana"
    if (hour >= 16 && hour < 19) return "Jioni"
    return "Usiku"
}

/**
 * Format time in Swahili or English
 * Swahili time is 6 hours behind the 24-hour clock
 * Example: 10:30 → "Saa Nne na nusu Asubuhi"
 */
export const formatTime = (time: string, lang: "sw" | "en"): string => {
    const [hour, minute] = time.split(":").map(Number)

    if (lang === "en") {
        const ampm = hour >= 12 ? "PM" : "AM"
        let h12 = hour % 12
        if (h12 === 0) h12 = 12
        const formattedMinute = minute.toString().padStart(2, "0")
        return `${h12}:${formattedMinute} ${ampm}`
    }

    // Swahili time conversion
    let swahiliHour = hour >= 7 ? hour - 6 : hour + 6
    if (swahiliHour > 12) swahiliHour -= 12
    if (swahiliHour === 0) swahiliHour = 12

    const period = getSwahiliPeriod(hour)
    const swahiliHourWord = SWAHILI_NUMBERS[swahiliHour]

    if (minute === 0) return `Saa ${swahiliHourWord} kamili ${period}`
    if (minute === 15) return `Saa ${swahiliHourWord} na robo ${period}`
    if (minute === 30) return `Saa ${swahiliHourWord} na nusu ${period}`

    const nextSwahiliHour = (swahiliHour % 12) + 1
    const nextSwahiliHourWord = SWAHILI_NUMBERS[nextSwahiliHour]

    if (minute === 45) return `Saa ${nextSwahiliHourWord} kasorobo ${period}`
    if (minute < 30) return `Saa ${swahiliHourWord} na dakika ${minute} ${period}`

    const minutesToNextHour = 60 - minute
    return `Saa ${nextSwahiliHourWord} kasoro dakika ${minutesToNextHour} ${period}`
}
