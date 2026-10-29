import type { SiteConfig } from "@core/web/types"

export const config: SiteConfig = {
  business: {
    googlePlaceId: "web-aa4d58e3-43ce-42c7-8db9-3fbbf505aa84",
    name: "Melotto Group",
    tagline: "Refined spaces. Elevated living.",
    phone: "(215) 821-8810",
    phoneHref: "tel:+12158218810",
    email: "h.melotto@melottogroup.com",
    address: "Philadelphia, PA",
    city: "Philadelphia",
    serviceAreas: ["Philadelphia"],
    license: "",
    since: "day one",
    google_rating: "",
    review_count: "",
    emergency: false,
    theme: "clean",
    niche: "Contractors",
  },

  services: [
    { icon: "home", title: "Kitchen Remodeling", desc: "Modernize your culinary space with custom layouts and refined finishes.", urgent: false },
    { icon: "droplets", title: "Bathroom Renovation", desc: "Upgrade your daily routine with elegant, functional bathroom transformations.", urgent: false },
    { icon: "hammer", title: "Basement Finishing", desc: "Maximize your square footage by converting lower levels into usable living areas.", urgent: false },
    { icon: "briefcase", title: "Home Addition Construction", desc: "Expand your footprint with seamlessly integrated structural additions.", urgent: false },
    { icon: "star", title: "Rooftop Deck Construction", desc: "Create sophisticated outdoor entertaining spaces above the city skyline.", urgent: false },
    { icon: "shield-check", title: "Historic Rowhouse Renovation", desc: "Update classic architecture while preserving original structural charm.", urgent: false }
  ],

  testimonials: [
    { name: "Sarah Jenkins", location: "Philadelphia", stars: 5, text: "The Melotto Group completely transformed our outdated kitchen into a modern, functional space. The attention to detail was incredible, and they kept the workspace spotless throughout the entire project. We finally have the culinary oasis we always dreamed of." },
    { name: "David Chen", location: "Philadelphia", stars: 5, text: "Renovating our historic Philadelphia rowhouse felt daunting until we hired Melotto Group. They preserved the original charm while updating the layout for our growing family. The communication was clear, and the final result exceeded every single expectation we had." },
    { name: "Emily Roberts", location: "Philadelphia", stars: 5, text: "Adding a rooftop deck to our home was a major investment, and the team handled it with absolute professionalism. They navigated the city requirements seamlessly and delivered a stunning outdoor living area that has completely changed how we entertain." }
  ],

  trustBadges: [
    "Licensed & Insured",
    "Philadelphia Based",
    "Clear Communication",
    "Upfront Estimates"
  ],

  stats: [
    { value: 1, label: "Service Area", suffix: "", decimals: 0 },
    { value: 6, label: "Core Services", suffix: "", decimals: 0 },
    { value: 1, label: "City Served", suffix: "", decimals: 0 }
  ],

  reasons: [
    { icon: "hammer", title: "Expert Craftsmanship", desc: "We deliver precise, high-quality construction tailored to your exact specifications." },
    { icon: "clock", title: "Clear Timelines", desc: "We establish realistic schedules and keep you informed at every project phase." },
    { icon: "dollar-sign", title: "Transparent Estimates", desc: "We discuss all costs upfront before any construction begins." },
    { icon: "shield-check", title: "Respectful Teams", desc: "Our crews maintain clean, organized workspaces in your home." },
    { icon: "briefcase", title: "Project Management", desc: "We handle the logistics, from material sourcing to final walkthroughs." },
    { icon: "star", title: "Refined Results", desc: "We focus on the finishing touches that elevate your living space." }
  ],

  about: {
    heading: "Elevating Philadelphia homes with precision.",
    body: "Melotto Group provides professional contracting services throughout Philadelphia, specializing in everything from historic rowhouse renovations to modern kitchen remodels. We focus on clear communication and detailed planning to ensure your project aligns with your vision.",
    highlights: [{ icon: "home", text: "Locally operated in Philadelphia" }]
  },

  process: [
    { title: "Discuss your vision", desc: "We review your goals and assess the space." },
    { title: "Develop the plan", desc: "We outline the scope, materials, and timeline." },
    { title: "Execute the build", desc: "We manage the construction with careful attention to detail." }
  ],

  faq: [
    { q: "Do you handle historic rowhouse renovations?", a: "Yes, we specialize in updating historic Philadelphia rowhouses while respecting their original architectural character." },
    { q: "How do we start the remodeling process?", a: "Contact us to schedule an initial consultation where we will discuss your goals and evaluate your current space." },
    { q: "Are estimates provided before work begins?", a: "Absolutely. We provide a detailed scope of work and discuss all estimated costs before any construction starts." },
    { q: "What areas do you serve?", a: "We proudly provide our contracting and renovation services throughout Philadelphia." }
  ],

  formServiceOptions: [
    "Kitchen Remodeling",
    "Bathroom Renovation",
    "Basement Finishing",
    "Home Addition Construction",
    "Rooftop Deck Construction",
    "Historic Rowhouse Renovation"
  ]
}

export const BUSINESS = config.business
export const SERVICES = config.services!
export const TESTIMONIALS = config.testimonials!
export const TRUST_BADGES = config.trustBadges!