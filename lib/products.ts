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

export type Category = "timepieces" | "leather-goods" | "automobiles" | "jewelry" | "yachts";

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "timepieces", label: "Timepieces", icon: "⌚" },
  { id: "leather-goods", label: "Leather Goods", icon: "👜" },
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
    image: "https://images.unsplash.com/photo-1575844611898-ac3b5e71e960?auto=format&fit=crop&w=800&q=90",
    images: [
      "https://images.unsplash.com/photo-1575844611898-ac3b5e71e960?auto=format&fit=crop&w=800&q=90",
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
