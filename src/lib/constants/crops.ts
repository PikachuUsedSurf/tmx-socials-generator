import type { CropName, CropImage } from "@/lib/types"

// All available crops
export const CROPS: CropName[] = [
    "BEAN",
    "CASHEW",
    "CHICK PEA",
    "COCOA",
    "COFFEE",
    "COTTON",
    "GEMSTONE",
    "GROUNDNUT",
    "GREEN GRAM",
    "PIGEON PEA",
    "SESAME",
    "SOYA",
    "SUNFLOWER",
]

// Swahili translations for crops
export const CROP_TRANSLATIONS_SW: Record<CropName, string> = {
    BEAN: "MAHARAGE",
    CASHEW: "KOROSHO",
    "CHICK PEA": "DENGU",
    COCOA: "KAKAO",
    COFFEE: "KAHAWA",
    COTTON: "PAMBA",
    GEMSTONE: "MADINI",
    GROUNDNUT: "KARANGA",
    "GREEN GRAM": "CHOROKO",
    "PIGEON PEA": "MBAAZI",
    SESAME: "UFUTA",
    SOYA: "SOYA",
    SUNFLOWER: "ALIZETI",
}

// English display names for crops
export const CROP_NAMES_EN: Record<CropName, string> = {
    BEAN: "Beans",
    CASHEW: "Cashew Nut",
    "CHICK PEA": "Chick Peas",
    COCOA: "Cocoa",
    COFFEE: "Coffee",
    COTTON: "Cotton",
    GEMSTONE: "Gemstones",
    GROUNDNUT: "Groundnuts",
    "GREEN GRAM": "Green Grams",
    "PIGEON PEA": "Pigeon Peas",
    SESAME: "Sesame",
    SOYA: "Soya",
    SUNFLOWER: "Sunflower",
}

// Crop-specific background images
export const CROP_BACKGROUND_IMAGES: Record<CropName, CropImage[]> = {
    BEAN: [
        {
            id: "bean-1",
            url: "/placeholder.svg?height=1080&width=1080&text=Bean+Field",
            title: "Bean Field",
            description: "Healthy bean plants growing",
        },
        {
            id: "bean-2",
            url: "/placeholder.svg?height=1080&width=1080&text=Bean+Harvest",
            title: "Bean Harvest",
            description: "Fresh beans being harvested",
        },
        {
            id: "bean-3",
            url: "/placeholder.svg?height=1080&width=1080&text=Bean+Farm+Landscape",
            title: "Bean Farm",
            description: "Expansive bean farming landscape",
        },
    ],
    CASHEW: [
        {
            id: "cashew-1",
            url: "/images/crop/cashew1.jpg",
            title: "Cashew Orchard",
            description: "Cashew trees in orchard",
        },
        {
            id: "cashew-2",
            url: "/images/crop/cashew2.jpg",
            title: "Cashew Nuts",
            description: "Fresh cashew nuts on trees",
        },
        {
            id: "cashew-3",
            url: "/images/crop/cashew3.jpg",
            title: "Cashew Harvest",
            description: "Harvesting cashew nuts",
        },
    ],
    "CHICK PEA": [
        {
            id: "chickpea-1",
            url: "/images/crop/chickpeas1.png",
            title: "Chickpea Field",
            description: "Chickpea plants in the field",
        },
        {
            id: "chickpea-2",
            url: "/images/crop/chickpeas2.png",
            title: "Chickpea Harvest",
            description: "Harvesting chickpeas",
        },
        {
            id: "chickpea-3",
            url: "/images/crop/chickpeas3.png",
            title: "Chickpea Farm",
            description: "Traditional chickpea farming",
        },
    ],
    COCOA: [
        {
            id: "cocoa-1",
            url: "/images/crop/cocoa1.png",
            title: "Cocoa Plantation",
            description: "Cocoa trees with pods",
        },
        {
            id: "cocoa-2",
            url: "/images/crop/cocoa2.png",
            title: "Cocoa Pods",
            description: "Ripe cocoa pods on trees",
        },
        {
            id: "cocoa-3",
            url: "/images/crop/cocoa3.png",
            title: "Cocoa Harvest",
            description: "Farmers harvesting cocoa pods",
        },
    ],
    COFFEE: [
        {
            id: "coffee-1",
            url: "/images/crop/coffee1.jpg",
            title: "Coffee Plantation",
            description: "Lush coffee plantation with green beans",
        },
        {
            id: "coffee-2",
            url: "/images/crop/coffee2.jpg",
            title: "Coffee Harvest",
            description: "Fresh coffee beans being harvested",
        },
        {
            id: "coffee-3",
            url: "/images/crop/coffee3.jpeg",
            title: "Coffee Farm",
            description: "Rolling hills of coffee farms",
        },
        {
            id: "coffee-4",
            url: "/images/crop/coffee3.jpeg",
            title: "Coffee Processing",
            description: "Coffee beans drying in the sun",
        },
    ],
    COTTON: [
        {
            id: "cotton-1",
            url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Field",
            title: "Cotton Field",
            description: "White cotton ready for harvest",
        },
        {
            id: "cotton-2",
            url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Harvest",
            title: "Cotton Harvest",
            description: "Cotton being harvested",
        },
        {
            id: "cotton-3",
            url: "/placeholder.svg?height=1080&width=1080&text=Cotton+Farm+Landscape",
            title: "Cotton Farm",
            description: "Expansive cotton farming area",
        },
    ],
    GEMSTONE: [
        {
            id: "gemstone-1",
            url: "/placeholder.svg?height=1080&width=1080&text=Mining+Site",
            title: "Mining Site",
            description: "Gemstone mining operations",
        },
        {
            id: "gemstone-2",
            url: "/placeholder.svg?height=1080&width=1080&text=Gemstone+Collection",
            title: "Gemstone Collection",
            description: "Various gemstones display",
        },
        {
            id: "gemstone-3",
            url: "/placeholder.svg?height=1080&width=1080&text=Mining+Landscape",
            title: "Mining Landscape",
            description: "Gemstone mining landscape",
        },
    ],
    GROUNDNUT: [
        {
            id: "groundnut-1",
            url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Field",
            title: "Groundnut Field",
            description: "Groundnut plants in field",
        },
        {
            id: "groundnut-2",
            url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Harvest",
            title: "Groundnut Harvest",
            description: "Harvesting groundnuts",
        },
        {
            id: "groundnut-3",
            url: "/placeholder.svg?height=1080&width=1080&text=Groundnut+Farm",
            title: "Groundnut Farm",
            description: "Traditional groundnut farming",
        },
    ],
    "GREEN GRAM": [
        {
            id: "greengram-1",
            url: "/images/crop/greengrams1.png",
            title: "Green Gram Field",
            description: "Green gram plants growing",
        },
        {
            id: "greengram-2",
            url: "/images/crop/greengrams2.png",
            title: "Green Gram Harvest",
            description: "Harvesting green gram",
        },
        {
            id: "greengram-3",
            url: "/images/crop/greengrams3.png",
            title: "Green Gram Farm",
            description: "Green gram farming area",
        },
    ],
    "PIGEON PEA": [
        {
            id: "pigeonpea-1",
            url: "/images/crop/pigeonpeas1.png",
            title: "Pigeon Pea Field",
            description: "Pigeon pea plants growing",
        },
        {
            id: "pigeonpea-2",
            url: "/images/crop/pigeonpeas2.png",
            title: "Pigeon Pea Harvest",
            description: "Harvesting pigeon peas",
        },
        {
            id: "pigeonpea-3",
            url: "/images/crop/pigeonpeas3.png",
            title: "Pigeon Pea Farm",
            description: "Pigeon pea farming landscape",
        },
    ],
    SESAME: [
        {
            id: "sesame-1",
            url: "/images/crop/sesame1.png",
            title: "Sesame Field",
            description: "Golden sesame plants in the field",
        },
        {
            id: "sesame-2",
            url: "/images/crop/sesame2.png",
            title: "Sesame Harvest",
            description: "Sesame seeds ready for harvest",
        },
        {
            id: "sesame-3",
            url: "/images/crop/sesame1.png",
            title: "Sesame Farming",
            description: "Farmers working in sesame fields",
        },
    ],
    SOYA: [
        {
            id: "soya-1",
            url: "/images/crop/soya1.png",
            title: "Soybean Field",
            description: "Green soybean plants in rows",
        },
        {
            id: "soya-2",
            url: "/images/crop/soya2.png",
            title: "Soybean Harvest",
            description: "Mature soybeans ready for harvest",
        },
        {
            id: "soya-3",
            url: "/images/crop/soya3.png",
            title: "Soybean Processing",
            description: "Soybeans being processed",
        },
    ],
    SUNFLOWER: [
        {
            id: "sunflower-1",
            url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Field",
            title: "Sunflower Field",
            description: "Bright sunflower field",
        },
        {
            id: "sunflower-2",
            url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Harvest",
            title: "Sunflower Harvest",
            description: "Harvesting sunflower seeds",
        },
        {
            id: "sunflower-3",
            url: "/placeholder.svg?height=1080&width=1080&text=Sunflower+Farm",
            title: "Sunflower Farm",
            description: "Golden sunflower farming landscape",
        },
    ],
}
