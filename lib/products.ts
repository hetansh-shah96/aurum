export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  images: string[];
  description: string;
  details: string[];
  rating: number;
  reviews: number;
  inStock: number;
  badge?: string;
  exclusive?: boolean;
}

export type Category = "timepieces" | "leather-goods" | "automobiles" | "jewelry" | "yachts" | "shoes";

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "timepieces", label: "Timepieces", icon: "⌚" },
  { id: "leather-goods", label: "Leather Goods", icon: "👜" },
  { id: "shoes", label: "Shoes", icon: "👟" },
  { id: "automobiles", label: "Automobiles", icon: "🚗" },
  { id: "jewelry", label: "Jewelry", icon: "💎" },
  { id: "yachts", label: "Yachts & Jets", icon: "⛵" },
];

// All prices in INR (1 USD ≈ ₹95)
export const PRODUCTS: Product[] = [
  {
    id: "rolex-submariner",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13_77_500,      // $14,500
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The reference among divers' watches, the Submariner Date has been an icon of refinement and performance since 1953.",
    details: [
      "Oystersteel case, 41mm",
      "Cerachrom bezel in black ceramic",
      "Waterproof to 300 metres",
      "Calibre 3235 movement",
      "5-year international guarantee",
    ],
    rating: 4.9,
    reviews: 2847,
    inStock: 2,
    badge: "Bestseller",
  },
  {
    id: "patek-nautilus",
    name: "Nautilus 5711",
    brand: "Patek Philippe",
    price: 84_55_000,      // $89,000
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=90",
    ],
    description: "An icon of watchmaking, the Nautilus epitomises the union of elegance and sporting character.",
    details: [
      "Stainless steel, 40mm",
      "Blue dial with horizontal embossed motif",
      "Calibre 26-330 S C",
      "Annual calendar complication",
      "Water resistant to 120 metres",
    ],
    rating: 5.0,
    reviews: 1203,
    inStock: 1,
    badge: "Extremely Rare",
    exclusive: true,
  },
  {
    id: "ap-royal-oak",
    name: "Royal Oak Offshore",
    brand: "Audemars Piguet",
    price: 39_90_000,      // $42,000
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=90",
    ],
    description: "Bold, sporty, and instantly recognizable. The Royal Oak Offshore redefines the boundaries of haute horlogerie.",
    details: [
      "Black ceramic case, 44mm",
      "In-house calibre 3126/3840 ST",
      "Chronograph function",
      "Water resistant to 100 metres",
      "Integrated rubber strap",
    ],
    rating: 4.8,
    reviews: 876,
    inStock: 3,
  },
  {
    id: "hermes-birkin",
    name: "Birkin 30",
    brand: "Hermès",
    price: 27_07_500,      // $28,500
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The Birkin bag is the ultimate expression of craftsmanship and exclusivity. Each piece is handcrafted by a single artisan.",
    details: [
      "Togo calfskin leather",
      "Gold-plated hardware",
      "Handcrafted in France",
      "Comes with lock, keys & clochette",
      "Certificate of authenticity",
    ],
    rating: 5.0,
    reviews: 4521,
    inStock: 1,
    badge: "Waitlist: 2 Years",
    exclusive: true,
  },
  {
    id: "chanel-255",
    name: "2.55 Reissue",
    brand: "Chanel",
    price: 9_31_000,       // $9,800
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    ],
    description: "Since 1955, the 2.55 has stood as the most recognizable handbag in the world. Timeless, iconic, forever.",
    details: [
      "Aged calfskin leather",
      "Aged gold-tone metal hardware",
      "Double-chain and leather strap",
      "Size: 25.5cm x 15.5cm x 6.5cm",
      "Made in France",
    ],
    rating: 4.9,
    reviews: 6234,
    inStock: 4,
  },
  {
    id: "lv-keepall",
    name: "Keepall Bandoulière 55",
    brand: "Louis Vuitton",
    price: 3_04_000,       // $3,200
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The quintessential travel companion since 1930. Supple, spacious, and unmistakably Louis Vuitton.",
    details: [
      "Monogram canvas",
      "Cowhide leather trim",
      "Detachable shoulder strap",
      "55cm x 31cm x 26cm",
      "Made in France",
    ],
    rating: 4.7,
    reviews: 8901,
    inStock: 8,
  },
  {
    id: "lamborghini-huracan",
    name: "Huracán EVO",
    brand: "Lamborghini",
    price: 2_72_65_000,    // $287,000
    category: "automobiles",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The Huracán EVO represents the next step in the evolution of the V10-powered supercar. Visceral, precise, beautiful.",
    details: [
      "5.2L V10, 640 CV",
      "0–100 km/h in 2.9 seconds",
      "Top speed: 325 km/h",
      "All-wheel drive",
      "LDVI intelligent drive system",
    ],
    rating: 4.9,
    reviews: 342,
    inStock: 2,
    badge: "Limited Allocation",
  },
  {
    id: "bugatti-chiron",
    name: "Chiron Super Sport",
    brand: "Bugatti",
    price: 37_05_00_000,   // $3,900,000
    category: "automobiles",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=90",
    ],
    description: "Beyond the notion of speed itself. The Chiron Super Sport is the most powerful, fastest and most exclusive production car in history.",
    details: [
      "8.0L W16 quad-turbocharged",
      "1,600 horsepower",
      "Top speed: 440 km/h",
      "0–100 km/h in 2.3 seconds",
      "1 of 60 units worldwide",
    ],
    rating: 5.0,
    reviews: 89,
    inStock: 1,
    badge: "1 of 60",
    exclusive: true,
  },
  {
    id: "ferrari-sf90",
    name: "SF90 Stradale",
    brand: "Ferrari",
    price: 5_93_75_000,    // $625,000
    category: "automobiles",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=90",
    ],
    description: "Ferrari's most powerful road car. A hybrid masterpiece blending tradition with the most advanced technology.",
    details: [
      "3.9L V8 twin-turbo + 3 electric motors",
      "1,000 CV total output",
      "0–100 km/h in 2.5 seconds",
      "Top speed: 340 km/h",
      "eManettino driving modes",
    ],
    rating: 4.9,
    reviews: 217,
    inStock: 3,
  },
  {
    id: "cartier-diamond-necklace",
    name: "Panthère de Cartier",
    brand: "Cartier",
    price: 49_40_000,      // $52,000
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=90",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90",
    ],
    description: "An icon since 1914. The Panthère embodies the free and independent spirit of Cartier in white gold and diamonds.",
    details: [
      "18K white gold",
      "3.2ct diamond pavé",
      "Onyx and tsavorite accent stones",
      "Handcrafted in Geneva",
      "Cartier leather case included",
    ],
    rating: 5.0,
    reviews: 1876,
    inStock: 2,
    badge: "Heirloom Piece",
    exclusive: true,
  },
  {
    id: "tiffany-diamond-ring",
    name: "Tiffany Setting® Ring",
    brand: "Tiffany & Co.",
    price: 36_57_500,      // $38,500
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The most famous engagement ring in the world. Invented by Charles Lewis Tiffany in 1886, still defining elegance today.",
    details: [
      "2.08ct round brilliant diamond",
      "VS1 clarity, G color",
      "Platinum band",
      "GIA certified",
      "Tiffany Blue Box® included",
    ],
    rating: 5.0,
    reviews: 9341,
    inStock: 5,
  },
  {
    id: "sea-ray-yacht",
    name: "L650 Fly",
    brand: "Sea Ray",
    price: 17_57_50_000,   // $1,850,000
    category: "yachts",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The pinnacle of flybridge yachts. The L650 Fly delivers an unmatched blend of luxury, performance, and style.",
    details: [
      "19.8m (65 ft) LOA",
      "Twin Volvo IPS 1350 engines",
      "3 staterooms, 2 heads",
      "Gourmet galley",
      "Premium Bose sound system",
    ],
    rating: 4.9,
    reviews: 54,
    inStock: 2,
    badge: "2025 Model",
  },
  {
    id: "gulfstream-g700",
    name: "G700 Private Jet",
    brand: "Gulfstream",
    price: 712_50_00_000,  // $75,000,000
    category: "yachts",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=90",
    ],
    description: "The world's largest purpose-built business jet. Redefining what it means to fly in ultimate luxury.",
    details: [
      "Range: 7,500 nautical miles",
      "Max speed: Mach 0.925",
      "Ultra-long range capability",
      "Dual-zone cabin, seats 19",
      "Advanced Cabin Management System",
    ],
    rating: 5.0,
    reviews: 12,
    inStock: 1,
    badge: "One Remaining",
    exclusive: true,
  },

  // ── SHOES ──────────────────────────────────────────────────────────────
  {
    id: "christian-louboutin-so-kate",
    name: "So Kate 120 Pumps",
    brand: "Christian Louboutin",
    price: 95_000,            // ~$1,000
    category: "shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=90"],
    description: "The iconic red sole. The So Kate is the most coveted stiletto in the world — razor-thin heel, pointed toe, pure power.",
    details: ["Kid leather upper", "120mm stiletto heel", "Signature red lacquered sole", "Pointed toe", "Made in Italy"],
    rating: 4.9,
    reviews: 11203,
    inStock: 5,
    badge: "Icon",
  },
  {
    id: "gucci-horsebit-loafer",
    name: "Horsebit 1953 Loafer",
    brand: "Gucci",
    price: 76_000,            // ~$800
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90"],
    description: "A Gucci archival design reissued since 1953. The gold horsebit detail is the ultimate casual luxury statement.",
    details: ["Leather upper", "Signature gold horsebit", "Leather sole", "Made in Italy", "Available in 6 colourways"],
    rating: 4.8,
    reviews: 6730,
    inStock: 6,
  },
  {
    id: "balenciaga-triple-s",
    name: "Triple S Sneaker",
    brand: "Balenciaga",
    price: 85_500,            // ~$900
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90"],
    description: "The sneaker that redefined bulky footwear as high fashion. Triple-layered sole, unmistakable silhouette.",
    details: ["Mesh & leather upper", "Triple-layer rubber sole", "Leather lining", "Logo embossed insole", "Made in Italy"],
    rating: 4.7,
    reviews: 9841,
    inStock: 7,
  },
  {
    id: "jimmy-choo-azia",
    name: "Azia 95 Crystal Sandal",
    brand: "Jimmy Choo",
    price: 1_14_000,          // ~$1,200
    category: "shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=90"],
    description: "Dazzling crystal-embellished straps on a sleek stiletto. Worn on red carpets from Cannes to Mumbai.",
    details: ["Crystal mesh upper", "95mm heel", "Leather lining", "Rubber sole", "Made in Italy"],
    rating: 4.9,
    reviews: 3210,
    inStock: 3,
    badge: "Red Carpet",
    exclusive: true,
  },
  {
    id: "tom-ford-jago",
    name: "Jago Embossed Derby",
    brand: "Tom Ford",
    price: 95_000,            // ~$1,000
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90"],
    description: "Quiet luxury perfected. The Jago Derby in crocodile-embossed leather is the shoe for those who know.",
    details: ["Crocodile-embossed calfskin", "Leather sole", "Hand-welted construction", "Made in Italy", "Dust bag included"],
    rating: 4.8,
    reviews: 1540,
    inStock: 4,
  },
  {
    id: "nike-air-jordan-dior",
    name: "Air Jordan 1 × Dior",
    brand: "Dior × Nike",
    price: 3_80_000,          // ~$4,000 resale
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=90"],
    description: "The most coveted sneaker collaboration in history. 8,000 pairs. Sold out in 43 seconds. Yours now — virtually.",
    details: ["Oblique canvas upper", "Nike Air cushioning", "Dior logo throughout", "Certificate of authenticity", "1 of 8,000"],
    rating: 5.0,
    reviews: 47210,
    inStock: 1,
    badge: "Sold Out IRL",
    exclusive: true,
  },

  // ── EXTRA WATCHES ───────────────────────────────────────────────────────
  {
    id: "richard-mille-rm11",
    name: "RM 11-03 Flyback",
    brand: "Richard Mille",
    price: 1_33_00_000,       // ~$1.4M
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=90"],
    description: "The most technically complex wristwatch ever made. Worn by Rafael Nadal on the tennis court. Enough said.",
    details: ["Titanium case, 49mm", "Calibre RMAC3 movement", "Annual calendar + flyback chronograph", "Sapphire crystal case back", "NTPT carbon dial"],
    rating: 5.0,
    reviews: 432,
    inStock: 1,
    badge: "As Seen on Nadal",
    exclusive: true,
  },
  {
    id: "omega-speedmaster",
    name: "Speedmaster Moonwatch",
    brand: "Omega",
    price: 5_89_000,          // ~$6,200
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=90"],
    description: "The watch that went to the Moon in 1969. NASA-certified. Worn by every Apollo astronaut. A legend.",
    details: ["42mm stainless steel case", "Calibre 3861 Co-Axial", "Hesalite crystal", "Tachymetre bezel", "Black dial"],
    rating: 4.9,
    reviews: 14890,
    inStock: 5,
    badge: "Moon-Certified",
  },
  {
    id: "jaeger-lecoultre-reverso",
    name: "Reverso Tribute Duoface",
    brand: "Jaeger-LeCoultre",
    price: 19_00_000,         // ~$20,000
    category: "timepieces",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=90"],
    description: "Art Deco made timeless. The Reverso's swivelling case reveals a second dial — two time zones, one masterpiece.",
    details: ["Manual winding", "Rectangular swivelling case", "Two dials — day & night", "Calibre 854A/2", "Alligator strap"],
    rating: 4.8,
    reviews: 2103,
    inStock: 3,
  },

  // ── EXTRA BAGS ──────────────────────────────────────────────────────────
  {
    id: "bottega-veneta-jodie",
    name: "Jodie Intrecciato Bag",
    brand: "Bottega Veneta",
    price: 3_80_000,          // ~$4,000
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90"],
    description: "The bag that made logoless luxury cool again. Woven lambskin so soft you'll want to sleep with it.",
    details: ["Intrecciato woven lambskin", "Knotted handle", "Suede lining", "One interior slip pocket", "Made in Italy"],
    rating: 4.9,
    reviews: 5670,
    inStock: 4,
  },
  {
    id: "saint-laurent-loulou",
    name: "Loulou Small Chain Bag",
    brand: "Saint Laurent",
    price: 2_47_000,          // ~$2,600
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90"],
    description: "Edgy, Parisian, and endlessly chic. The Loulou is the bag that goes from gallery opening to après-dinner.",
    details: ["Matelassé leather", "YSL logo quilting", "Gold-tone chain strap", "Flap with push-lock closure", "Made in Italy"],
    rating: 4.8,
    reviews: 7234,
    inStock: 6,
  },
  {
    id: "celine-classic-box",
    name: "Classic Box Bag",
    brand: "Céline",
    price: 4_56_000,          // ~$4,800
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90"],
    description: "Understated perfection. The Classic Box has been the insider's choice since Phoebe Philo introduced it in 2010.",
    details: ["Smooth calfskin", "Palladium-finish hardware", "Detachable strap", "Interior zip pocket", "Made in Italy"],
    rating: 4.9,
    reviews: 4102,
    inStock: 2,
    exclusive: true,
  },
  {
    id: "dior-lady-dior",
    name: "Lady Dior Medium",
    brand: "Dior",
    price: 4_75_000,          // ~$5,000
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90"],
    description: "Princess Diana's favourite. The Lady Dior's cannage stitching and charm-adorned handles are instantly recognisable worldwide.",
    details: ["Cannage lambskin", "Gold-tone D.I.O.R. charms", "Two handles + removable strap", "Zip closure", "Made in Italy"],
    rating: 4.9,
    reviews: 8921,
    inStock: 3,
    badge: "Princess Diana's Choice",
  },
  {
    id: "fendi-baguette",
    name: "Baguette Nappa Bag",
    brand: "Fendi",
    price: 2_85_000,          // ~$3,000
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=90"],
    description: "The bag that launched a thousand imitations. Made iconic by Sex and the City. Now in your virtual wardrobe.",
    details: ["Nappa leather", "FF logo baguette clasp", "Single shoulder strap", "Suede lining", "Made in Italy"],
    rating: 4.7,
    reviews: 12540,
    inStock: 5,
  },
  {
    id: "prada-re-edition",
    name: "Re-Edition 2005 Bag",
    brand: "Prada",
    price: 1_62_000,          // ~$1,700
    category: "leather-goods",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=90"],
    description: "The nylon bag that started a fashion revolution — twice. Prada's Re-Edition is the coolest bag on any street.",
    details: ["Re-Nylon fabric", "Saffiano leather trim", "Magnetic snap closure", "Adjustable strap", "Made in Italy"],
    rating: 4.8,
    reviews: 18320,
    inStock: 8,
  },

  // ── EXTRA JEWELRY ───────────────────────────────────────────────────────
  {
    id: "van-cleef-alhambra",
    name: "Vintage Alhambra Necklace",
    brand: "Van Cleef & Arpels",
    price: 11_40_000,         // ~$12,000
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90"],
    description: "The four-leaf clover motif that has graced royalty since 1968. Fortune, health, love, success — all yours.",
    details: ["18K yellow gold", "Malachite clover motif", "Gold bead border", "42cm chain", "VCA certificate of authenticity"],
    rating: 5.0,
    reviews: 6780,
    inStock: 2,
    exclusive: true,
    badge: "Iconic Since 1968",
  },
  {
    id: "bulgari-serpenti",
    name: "Serpenti Viper Bracelet",
    brand: "Bulgari",
    price: 18_05_000,         // ~$19,000
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=90",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=90"],
    description: "The Serpenti is Bulgari's most powerful icon. Coiled in diamond-set white gold, it commands every room.",
    details: ["18K white gold", "Full diamond pavé", "Emerald eyes", "Coiling serpent design", "Bulgari Rome certificate"],
    rating: 5.0,
    reviews: 2341,
    inStock: 1,
    exclusive: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

// All prices stored in INR
export function formatPrice(price: number): string {
  if (price >= 1_00_00_00_000) {
    return `₹${(price / 1_00_00_00_000).toFixed(2)} Cr`;
  }
  if (price >= 1_00_00_000) {
    return `₹${(price / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (price >= 1_00_000) {
    return `₹${(price / 1_00_000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
