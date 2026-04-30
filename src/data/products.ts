import { Product } from '../types';

export const products: Product[] = [
    // 1. Clothing
    { 
      id: 1, 
      name: "Custom T-Shirt", 
      category: "Clothing", 
      price: 45, 
      description: "Ready made and customized t-shirts for corporate and industrial use.",
      specifications: {
        "Material": "100% Cotton / Polycotton",
        "Weight": "160 - 220 GSM",
        "Colors": "Over 20 options",
        "Customization": "DTF, Embroidery, Screen"
      }
    },
    { id: 2, name: "Industrial Cargo Pants", category: "Clothing", price: 85, description: "Durable cargo pants for workforce uniforms." },
    { 
      id: 3, 
      name: "Cotton Coverall", 
      category: "Clothing", 
      price: 120, 
      description: "100% Cotton industrial coverall for standard protection.",
      specifications: {
        "Material": "100% Twill Cotton",
        "Pockets": "6 functional pockets",
        "Stitching": "Double needle reinforced",
        "Sizes": "S - 5XL"
      }
    },
    { id: 4, name: "Twill Cotton 2pc Uniform", category: "Clothing", price: 150, description: "Shirt and pants set made from high-quality twill cotton." },
    { id: 5, name: "High Visibility Reflective Vest", category: "Clothing", price: 15, description: "Standard safety vests with high intensity reflective strips." },
    { id: 6, name: "Disposable Coverall", category: "Clothing", price: 25, description: "Lightweight breathable disposable coveralls." },
    { 
      id: 7, 
      name: "Fire Retardant Coverall", 
      category: "Clothing", 
      price: 450, 
      description: "Certified FR coveralls for hazardous environments.",
      specifications: {
        "Standard": "EN ISO 11612 / NFPA 2112",
        "Material": "FR Treated Cotton",
        "Weight": "260 GSM",
        "Safety": "Anti-static"
      }
    },
    { id: 8, name: "Lab Coat", category: "Clothing", price: 95, description: "Professional lab coats for medical and laboratory staff." },

    // 2. Safety Footwear
    { 
      id: 9, 
      name: "Non-Metal Safety Shoes", 
      category: "Safety Footwear", 
      price: 220, 
      description: "Lightweight safety shoes with composite protection. 100% Metal-free construction.",
      specifications: {
        "Toe Cap": "Composite (200J Impact)",
        "Standards": "EN ISO 20345:2011 S3 SRC",
        "Midsole": "Kevlar Anti-penetration",
        "Outsole": "Dual Density PU"
      }
    },
    { id: 10, name: "Metal Safety Shoes", category: "Safety Footwear", price: 180, description: "Traditional steel-toe safety footwear for heavy construction.", 
      specifications: {
        "Standards": "EN ISO 20345 S1P",
        "Toe Cap": "Steel Toe",
        "Midsole": "Steel Plate"
      }
    },
    { id: 11, name: "Welder Boot", category: "Safety Footwear", price: 260, description: "High-heat resistant boots with quick-release velcro for welding.", 
      specifications: {
        "Protection": "Heat Resistant HRO",
        "Standards": "EN ISO 20345 S3",
        "Fastening": "Heavy Duty Velcro"
      }
    },
    { id: 12, name: "Gumboot", category: "Safety Footwear", price: 65, description: "Waterproof PVC boots with safety toe." },
    { 
      id: 13, 
      name: "Executive Safety Shoes", 
      category: "Safety Footwear", 
      price: 245, 
      description: "Formal safety shoes for site-to-office use.",
      specifications: {
        "Upper": "Full Grain Leather",
        "Sole": "Dual Density PU",
        "Style": "Oxford / Slip-on",
        "Protection": "Steel Toe & Midsole"
      }
    },

    // 3. Hand Protection
    { id: 14, name: "Dotted Gloves", category: "Hand Protection", price: 5, description: "Grip-enhanced cotton gloves for general handling." },
    { id: 15, name: "Nitrile Gloves", category: "Hand Protection", price: 35, description: "Heavy-duty nitrile assessment and industrial gloves.", 
      specifications: {
        "Material": "100% Nitrile",
        "Standards": "EN 374-1:2016",
        "Length": "240mm / 300mm",
        "Thickness": "5.0 mil"
      }
    },
    { id: 16, name: "Chemical Resistant Gloves", category: "Hand Protection", price: 45, description: "Latex or PVC gloves for safe chemical handling.", 
      specifications: {
        "Standards": "EN 388 / EN 374",
        "Protection": "Acid & Alkali Resistant"
      }
    },
    { id: 22, name: "N95 Mask", category: "Respiratory Protection", price: 12, description: "High-filtration particulate respirator masks.", 
      specifications: {
        "Standard": "NIOSH N95 / EN 149 FFP2",
        "Efficiency": ">= 95% Filtration",
        "Valve": "Exhalation Valve Available"
      }
    },
    { id: 23, name: "Full Face Mask", category: "Respiratory Protection", price: 380, description: "Complete respiratory protection with full vision." },
    { id: 24, name: "Half Face Mask", category: "Respiratory Protection", price: 150, description: "Twin filter half-face respirator." },

    // 5. Eye & Ear Protection
    { id: 25, name: "Face Shield", category: "Eye & Ear Protection", price: 45, description: "Full-face splash and impact protection." },
    { id: 26, name: "Safety Goggles", category: "Eye & Ear Protection", price: 25, description: "Sealed goggles for chemical and dust protection." },
    { id: 27, name: "Safety Spectacles", category: "Eye & Ear Protection", price: 15, description: "Clear and tinted safety glasses." },
    { id: 28, name: "Ear Muff", category: "Eye & Ear Protection", price: 75, description: "High-attenuation ear muffs for loud environments." },
    { id: 29, name: "Ear Plug", category: "Eye & Ear Protection", price: 2, description: "Soft foam disposable ear plugs." },

    // 6. Head Protection
    { id: 30, name: "Metal Helmet", category: "Head Protection", price: 180, description: "Specialized metal safety helmets." },
    { id: 31, name: "Fiber Helmet", category: "Head Protection", price: 140, description: "Lightweight fiber-reinforced hard hats." },
    { id: 32, name: "Helmet with Ratchet & Chin Strap", category: "Head Protection", price: 55, description: "Adjustable safety helmet with secure chin strap." },

    // 7. Fall Protection
    { id: 33, name: "Full Body Harness", category: "Fall Protection", price: 290, description: "Ergonomic harness for high-altitude work." },
    { id: 34, name: "Lanyard", category: "Fall Protection", price: 120, description: "Shock-absorbing lanyards for fall arrest." },
    { id: 35, name: "Retractable Fall Arrester", category: "Fall Protection", price: 950, description: "Automatic self-retracting lifeline." },
    { id: 36, name: "Cargo Lashing Belt", category: "Fall Protection", price: 85, description: "Heavy-duty ratchet straps for cargo security." },

    // 8. Building Materials & Hardware
    { id: 37, name: "Industrial Pipe Fittings", category: "Building Materials & Hardware", price: 45, description: "Range of fittings and plumbing materials." },

    // 9. Printing Services
    { id: 38, name: "DTF Printing", category: "Printing Services", price: 25, description: "Direct-to-film high resolution printing." },
    { id: 39, name: "Embroidery Service", category: "Printing Services", price: 15, description: "Professional machine embroidery for logos." },
    { id: 40, name: "Sublimation Printing", category: "Printing Services", price: 30, description: "All-over print sublimation services." },
    { id: 41, name: "Screen Printing", category: "Printing Services", price: 20, description: "Bulk screen printing for uniforms." },
    { id: 42, name: "Offset Printing", category: "Printing Services", price: 10, description: "High-volume paper and stationery printing." },

    // 10, 11
    { id: 43, name: "Custom Shield & Trophy", category: "Shields and Trophies", price: 150, description: "Recognition awards and corporate trophies." },
    { id: 44, name: "Industrial Signage", category: "Signages", price: 120, description: "Safety and directional signs for industrial use." },

    // 12. Bird & Cat Food
    { id: 45, name: "Premium Cat Food", category: "Bird & Cat Food", price: 55, description: "Nutritional food for cats and kittens." },
    { id: 46, name: "Bird Feed & Accessories", category: "Bird & Cat Food", price: 35, description: "Variety of bird seeds and cage accessories." },

    // 13. Order Suppliers
    { id: 47, name: "Specialized Order Sourcing", category: "Order Suppliers", price: 0, description: "Custom procurement services for niche industrial items." },

    // 14, 15
    { id: 48, name: "Marine Anti-Fouling Paint", category: "Marine Paints", price: 1200, description: "Specialized paints for marine hulls and protection." },
    { id: 49, name: "Kiswire Steel Wire Rope", category: "Steel Wire Ropes", price: 2500, description: "High-tensile Kiswire brand steel wire ropes." },

    // 16, 17
    { id: 50, name: "Customized Stationery Set", category: "Stationeries", price: 50, description: "Corporate notebooks, pens, and paper sets." },
    
    // Miscellaneous
    { id: 51, name: "Oil Spill Kit", category: "Miscellaneous Products", price: 1500, description: "Complete chemical and oil spill response kit." },
    { id: 52, name: "Industrial Traffic Cone", category: "Miscellaneous Products", price: 45, description: "High-visibility reflective road cones." },
    { id: 53, name: "Warning Tape", category: "Miscellaneous Products", price: 10, description: "Barrier tape for marking hazardous areas." },
    { id: 54, name: "Safety Barrier", category: "Miscellaneous Products", price: 350, description: "Expandable and fixed safety barriers." },
    { id: 55, name: "High-Power Flashlight", category: "Miscellaneous Products", price: 85, description: "Rechargeable industrial-grade torches." },
    { id: 56, name: "PVC Bucket / Plastic Drum", category: "Miscellaneous Products", price: 120, description: "Durable storage and material handling buckets." },
    { id: 57, name: "PVC Apron", category: "Miscellaneous Products", price: 35, description: "Chemical resistant work apron." },
    { id: 58, name: "Bio-degradable Garbage Bags", category: "Miscellaneous Products", price: 25, description: "Environmentally friendly waste management bags." },
    { id: 59, name: "Trolley Bag", category: "Miscellaneous Products", price: 280, description: "Heavy-duty bags for tools and equipment." },
    { id: 60, name: "Industrial Tool Box", category: "Miscellaneous Products", price: 140, description: "Secure storage for professional tools." },
    { id: 61, name: "Aluminum Ladder", category: "Miscellaneous Products", price: 450, description: "Multi-step foldable aluminum ladders." },
    { id: 62, name: "Insulated Water Cooler", category: "Miscellaneous Products", price: 180, description: "High-capacity water storage for site workers." },
    { id: 63, name: "First Aid Box", category: "Miscellaneous Products", price: 110, description: "HSE compliant medical first aid kits." },
    { id: 64, name: "Disposable Shoe Covers", category: "Miscellaneous Products", price: 45, description: "Box of 100 anti-slip shoe covers." },
    { id: 65, name: "Hairnet Bulk Pack", category: "Miscellaneous Products", price: 35, description: "Disposable hairnets for food and medical use." },
    { id: 66, name: "Fire Resistant Cabinet", category: "Miscellaneous Products", price: 3500, description: "Safety cabinets for hazardous material storage." },
    { id: 67, name: "Nylon Rope", category: "Miscellaneous Products", price: 120, description: "High-strength nylon ropes for rigging." },
    { id: 68, name: "Food Grade Silicone", category: "Miscellaneous Products", price: 55, description: "Safe sealants for food processing environments." },
    { id: 69, name: "Cleaning Accessories", category: "Miscellaneous Products", price: 95, description: "Industrial janitorial supplies and tools." },
    { id: 70, name: "Hygiene Products", category: "Miscellaneous Products", price: 25, description: "Sanitizers, soaps, and hygiene essentials." },
    { id: 71, name: "Industrial Stretch Film", category: "Miscellaneous Products", price: 45, description: "Durable pallet wrapping film." },
    { id: 72, name: "Blower Fan with Duct", category: "Miscellaneous Products", price: 1200, description: "Portable ventilation fans for confined spaces." },
    { id: 73, name: "Winter Jacket", category: "Miscellaneous Products", price: 280, description: "Insulated jackets for cold environment work." },
    { id: 74, name: "ANZA Refills & Handles", category: "Miscellaneous Products", price: 35, description: "Professional painting tool refills and handles." }
];
