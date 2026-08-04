import {
  Brush, Droplets, Palette, Sparkles, Building2, Bath, CookingPot, PanelsTopLeft
} from "lucide-react";

export const services = [
  {
    slug: "grout-cleaning",
    title: "Grout Cleaning",
    short: "Deep cleaning that lifts embedded dirt and restores a cleaner, brighter finish.",
    icon: Brush,
    features: ["Detailed inspection", "Professional deep clean", "Targeted stain treatment", "Care guidance"]
  },
  {
    slug: "grout-recolouring",
    title: "Grout Recolouring & Sealing",
    short: "Refresh tired grout lines with a consistent new colour and protective finish.",
    icon: Palette,
    features: ["Colour consultation", "Surface preparation", "Precision application", "Sealed finish"]
  },
  {
    slug: "biosteam-cleaning",
    title: "BioSteam Deep Cleaning",
    short: "Eco-conscious high-temperature steam cleaning for hard surfaces and detailed areas.",
    icon: Droplets,
    features: ["Reduced chemical reliance", "Detail-focused treatment", "Residential and commercial", "Fresh visible results"]
  },
  {
    slug: "surface-restoration",
    title: "Tile & Surface Restoration",
    short: "Professional care for tiled floors, splashbacks, shower areas and hard surfaces.",
    icon: Sparkles,
    features: ["Condition assessment", "Deep restoration clean", "Surface-safe methods", "Maintenance plan"]
  },
  {
    slug: "bathroom-restoration",
    title: "Bathroom & Shower Restoration",
    short: "Restore grout, tiles and detailed areas without the cost of a full renovation.",
    icon: Bath,
    features: ["Shower enclosures", "Wall and floor tiles", "Grout refresh", "Finishing details"]
  },
  {
    slug: "kitchen-restoration",
    title: "Kitchen Surface Care",
    short: "Refresh tiled kitchens, floors, splashbacks and high-use hard surfaces.",
    icon: CookingPot,
    features: ["Splashbacks", "Tiled floors", "Grout lines", "High-use areas"]
  },
  {
    slug: "floor-maintenance",
    title: "Floor Cleaning & Maintenance",
    short: "Planned cleaning and maintenance for tiled and other suitable hard floors.",
    icon: PanelsTopLeft,
    features: ["One-off cleaning", "Routine maintenance", "Domestic floors", "Commercial spaces"]
  },
  {
    slug: "commercial-cleaning",
    title: "Commercial Surface Cleaning",
    short: "Reliable specialist surface care for businesses, landlords and property managers.",
    icon: Building2,
    features: ["Flexible scheduling", "Repeat maintenance", "Site assessment", "Professional reporting"]
  }
];
