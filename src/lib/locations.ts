export interface Location {
  slug: string;
  name: string;
  county: string;
  intro: string;
  /** 3-4 common jobs we see in this city — keeps each page unique for SEO. */
  highlights: string[];
  /** Response / drive-time note specific to this city. */
  responseNote: string;
  /** Approx city center — powers LocalBusiness geo schema. */
  geo: { lat: number; lon: number };
  /**
   * Remote-first areas (45+ min out): same-day remote, on-site by
   * appointment instead of the standard next-day promise.
   */
  remoteFirst?: boolean;
}

export const locations: Location[] = [
  {
    slug: "it-support-tampa",
    name: "Tampa",
    county: "Hillsborough",
    intro:
      "From downtown offices to Westshore and Hyde Park businesses, we keep Tampa working — remote help in hours, on-site visits when the hardware demands it. Business IT support, managed IT services, helpdesk, and IT consulting for Tampa companies with 5–500 employees.",
    highlights: [
      "Downtown + Westshore office Wi-Fi and cabling builds",
      "Hyde Park / Seminole Heights boutique-office networks for block-wall buildings",
      "Microsoft 365 migrations for 5–50 person firms",
      "Managed IT services and 24/7 monitoring for Tampa businesses",
      "IT helpdesk and business IT support with same-day remote response",
      "IT consulting and vCIO strategy for growing Tampa companies",
    ],
    responseNote: "Remote issues often fixed same-day. On-site across Tampa typically next business day.",
    geo: { lat: 27.9506, lon: -82.4572 },
  },
  {
    slug: "it-support-st-petersburg",
    name: "St. Petersburg",
    county: "Pinellas",
    intro:
      "St. Pete businesses get the same flat-rate remote and on-site IT support — without the jargon or the runaround.",
    highlights: [
      "Central Ave small-business help desk and 365 management",
      "Historic-building Wi-Fi dead zones (plaster + lathe walls)",
      "Ransomware cleanup and backup verification for creatives",
    ],
    responseNote: "Remote same-day. On-site in St. Pete usually within 1–2 business days.",
    geo: { lat: 27.7676, lon: -82.6403 },
  },
  {
    slug: "it-support-clearwater",
    name: "Clearwater",
    county: "Pinellas",
    intro:
      "Whether you're on the beach or inland, slow Wi-Fi and failing computers shouldn't cost your business a day. We fix them — remotely or in person.",
    highlights: [
      "Beach-area office + rental-management Wi-Fi that survives 20+ devices",
      "Small-office backup and Microsoft 365 setup",
      "Laptop tune-ups and data recovery for hybrid teams",
    ],
    responseNote: "Remote same-day. Beach-area on-site visits scheduled around access/parking.",
    geo: { lat: 27.9659, lon: -82.8001 },
  },
  {
    slug: "it-support-brandon",
    name: "Brandon",
    county: "Hillsborough",
    intro:
      "Growing businesses in Brandon trust us for responsive IT help — most issues resolved the same business day.",
    highlights: [
      "Office workstation setups (printer, VPN, dual monitors)",
      "Retail / medical-office network installs along 60",
      "Guest networks and access controls that actually work",
    ],
    responseNote: "Remote same-day. Brandon on-site typically next business day.",
    geo: { lat: 27.9378, lon: -82.2859 },
  },
  {
    slug: "it-support-riverview",
    name: "Riverview",
    county: "Hillsborough",
    intro:
      "Newer business parks, older networks. We handle office Wi-Fi dead zones, new network builds, and everything in between in Riverview.",
    highlights: [
      "New-build access points + Ethernet drops (Cat6 through the ceiling)",
      "Builder-default router replacements for larger floorplans",
      "Business backup and 365 email on custom domains",
    ],
    responseNote: "Remote same-day. Riverview new-build Wi-Fi surveys booked 1–2 days out.",
    geo: { lat: 27.8661, lon: -82.3265 },
  },
  {
    slug: "it-support-lakeland",
    name: "Lakeland",
    county: "Polk",
    intro:
      "Right on the I-4 corridor, Lakeland businesses count on us for Microsoft 365, backups, networking, and straight answers.",
    highlights: [
      "I-4 corridor warehouse / office network and camera drops",
      "365 + Teams rollouts for distributed crews",
      "Server / NAS health checks and backup test restores",
    ],
    responseNote: "Remote same-day. Lakeland on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 28.0395, lon: -81.9498 },
  },
  {
    slug: "it-support-wesley-chapel",
    name: "Wesley Chapel",
    county: "Pasco",
    intro:
      "One of Florida's fastest-growing business corridors — new spaces with builder-grade Wi-Fi that can't keep up. We fix that weekly.",
    highlights: [
      "New-build access-point installs for larger floorplans",
      "Office setups for hybrid teams along the SR-54 corridor",
      "Small-business 365 and backup setup for growing firms",
    ],
    responseNote: "Remote same-day. Wesley Chapel on-site typically next business day.",
    geo: { lat: 28.2397, lon: -82.3274 },
  },
  {
    slug: "it-support-plant-city",
    name: "Plant City",
    county: "Hillsborough",
    intro:
      "East of Tampa with a mix of farms, warehouses, and growing businesses — all getting the same flat-rate IT help.",
    highlights: [
      "Business Wi-Fi that reaches across larger lots and outbuildings",
      "Small-business networks for shops along the downtown corridor",
      "Storm-season backup checks before hurricane season hits",
    ],
    responseNote: "Remote same-day. Plant City on-site typically next business day.",
    geo: { lat: 28.0186, lon: -82.1251 },
  },
  {
    slug: "it-support-temple-terrace",
    name: "Temple Terrace",
    county: "Hillsborough",
    intro:
      "Tucked by USF with established business parks and professional offices — fast remote fixes plus on-site when hardware demands it.",
    highlights: [
      "Office setups for professional firms near campus",
      "Older-building Wi-Fi upgrades through block and plaster walls",
      "Small-team support for local professional practices",
    ],
    responseNote: "Remote same-day. Temple Terrace on-site typically next business day.",
    geo: { lat: 28.0364, lon: -82.384 },
  },
  {
    slug: "it-support-lutz",
    name: "Lutz",
    county: "Hillsborough",
    intro:
      "Larger properties and growing businesses — Lutz facilities need real network coverage, not a single ISP router.",
    highlights: [
      "Whole-campus Wi-Fi including outbuildings and shop floors",
      "Hybrid-work and office setups for executives",
      "Business networks that stop dropping cameras and access systems",
    ],
    responseNote: "Remote same-day. Lutz on-site typically next business day.",
    geo: { lat: 28.1423, lon: -82.4591 },
  },
  {
    slug: "it-support-valrico",
    name: "Valrico",
    county: "Hillsborough",
    intro:
      "Growing suburbs next to Brandon — responsive IT for shops, clinics, and offices that can't afford downtime.",
    highlights: [
      "Business Wi-Fi tuned for peak hours and heavy workloads",
      "Guest Wi-Fi and access controls that keep clients and data separated",
      "Business email and backup on your custom domain",
    ],
    responseNote: "Remote same-day. Valrico on-site typically next business day.",
    geo: { lat: 27.9408, lon: -82.2414 },
  },
  {
    slug: "it-support-largo",
    name: "Largo",
    county: "Pinellas",
    intro:
      "Central Pinellas small businesses — fast remote support plus local on-site visits.",
    highlights: [
      "Office and multi-suite Wi-Fi in dense commercial buildings",
      "Small-office networks for service businesses",
      "Plain-English help for teams without a full IT staff",
    ],
    responseNote: "Remote same-day. Largo on-site typically next business day.",
    geo: { lat: 27.9095, lon: -82.7878 },
  },
  {
    slug: "it-support-pinellas-park",
    name: "Pinellas Park",
    county: "Pinellas",
    intro:
      "Industrial corridors and hardworking small businesses — IT that keeps shops, warehouses, and offices running.",
    highlights: [
      "Shop and warehouse network drops plus camera coverage",
      "Microsoft 365 for trades and service companies",
      "POS and printer reliability for retail counters",
    ],
    responseNote: "Remote same-day. Pinellas Park on-site typically next business day.",
    geo: { lat: 27.8391, lon: -82.707 },
  },
  {
    slug: "it-support-seminole",
    name: "Seminole",
    county: "Pinellas",
    intro:
      "Medical and professional offices — responsive IT help without the big-city runaround.",
    highlights: [
      "Telehealth-ready and compliance-aware network setups",
      "Small clinic and office IT with compliance awareness",
      "Guided remote support with screen-share walkthroughs",
    ],
    responseNote: "Remote same-day. Seminole on-site typically next business day.",
    geo: { lat: 27.8395, lon: -82.7986 },
  },
  {
    slug: "it-support-apollo-beach",
    name: "Apollo Beach",
    county: "Hillsborough",
    intro:
      "South-shore businesses and professional offices — networks that stay reliable indoors and out.",
    highlights: [
      "Patio-to-parking Wi-Fi reaching docks and outdoor workspaces",
      "Camera, access-control, and IoT stabilization",
      "Home-office and hybrid-work setups for remote professionals",
    ],
    responseNote: "Remote same-day. Apollo Beach on-site typically next business day.",
    geo: { lat: 27.7712, lon: -82.4079 },
  },
  {
    slug: "it-support-land-o-lakes",
    name: "Land O' Lakes",
    county: "Pasco",
    intro:
      "Riding the Wesley Chapel growth wave — new business parks with new-network problems we solve every week.",
    highlights: [
      "New-build Wi-Fi surveys and access-point installs",
      "Growing-team device rollouts: laptops, phones, and cloud apps",
      "Small-business IT for local services and shops",
    ],
    responseNote: "Remote same-day. Land O' Lakes on-site typically next business day.",
    geo: { lat: 28.2311, lon: -82.45 },
  },
  {
    slug: "it-support-dunedin",
    name: "Dunedin",
    county: "Pinellas",
    intro:
      "Scottish charm and a lively Main Street — patient IT help for small businesses that explains everything in plain English.",
    highlights: [
      "Guided remote support with screen-share walkthroughs",
      "Downtown small-business networks and point-of-sale reliability",
      "Hurricane-season backup and continuity checks",
    ],
    responseNote: "Remote same-day. Dunedin on-site typically within 1–2 business days.",
    geo: { lat: 28.0389, lon: -82.7747 },
  },
  {
    slug: "it-support-safety-harbor",
    name: "Safety Harbor",
    county: "Pinellas",
    intro:
      "Small-town feel on the bay with Main Street businesses — responsive IT help, no jargon.",
    highlights: [
      "Office and hybrid-work setups for remote professionals",
      "Main Street shop networks, printers, and cameras",
      "Guest Wi-Fi with access controls that hold",
    ],
    responseNote: "Remote same-day. Safety Harbor on-site typically within 1–2 business days.",
    geo: { lat: 28.0042, lon: -82.6915 },
  },
  {
    slug: "it-support-tarpon-springs",
    name: "Tarpon Springs",
    county: "Pinellas",
    intro:
      "From the Sponge Docks to the business district — IT support for restaurants, retail, and tourist-season businesses.",
    highlights: [
      "Restaurant and retail networks that survive tourist season",
      "Remote monitoring for multi-site and seasonal locations",
      "Small-business 365 and backup basics",
    ],
    responseNote: "Remote same-day. Tarpon Springs on-site typically within 1–2 business days.",
    geo: { lat: 28.1461, lon: -82.7568 },
  },
  {
    slug: "it-support-palm-harbor",
    name: "Palm Harbor",
    county: "Pinellas",
    intro:
      "Growing businesses between Tampa and Tarpon Springs — same-day remote fixes plus scheduled on-site visits.",
    highlights: [
      "Office networks tuned for peak loads and hybrid teams",
      "Workstation builds with VPN and multi-monitor setups",
      "Conference-room and shared-facility AV that just works",
    ],
    responseNote: "Remote same-day. Palm Harbor on-site typically within 1–2 business days.",
    geo: { lat: 28.0781, lon: -82.7637 },
  },
  {
    slug: "it-support-new-port-richey",
    name: "New Port Richey",
    county: "Pasco",
    intro:
      "Revitalized downtown and growing business district — IT help for the small businesses fueling the comeback.",
    highlights: [
      "Downtown shop and restaurant network reliability",
      "Wi-Fi upgrades for older buildings with stubborn walls",
      "Remote support explained patiently, no jargon",
    ],
    responseNote: "Remote same-day. New Port Richey on-site typically within 1–2 business days.",
    geo: { lat: 28.2442, lon: -82.7194 },
  },
  {
    slug: "it-support-trinity",
    name: "Trinity",
    county: "Pasco",
    intro:
      "Master-planned business parks full of growing companies — networks built for video calls that can't drop.",
    highlights: [
      "Multi-suite office networks with dedicated work setups",
      "Camera and access-control stabilization across sites",
      "Medical and professional office builds",
    ],
    responseNote: "Remote same-day. Trinity on-site typically within 1–2 business days.",
    geo: { lat: 28.1814, lon: -82.6717 },
  },
  {
    slug: "it-support-zephyrhills",
    name: "Zephyrhills",
    county: "Pasco",
    intro:
      "East Pasco's growing city — local businesses and operations that need reliable, honest IT.",
    highlights: [
      "Property-wide Wi-Fi reaching shops and outbuildings",
      "Downtown small-business networks and printers",
      "Storm-season surge and backup preparation",
    ],
    responseNote: "Remote same-day. Zephyrhills on-site typically within 1–2 business days.",
    geo: { lat: 28.2336, lon: -82.1812 },
  },
  {
    slug: "it-support-winter-haven",
    name: "Winter Haven",
    county: "Polk",
    intro:
      "Chain of Lakes with a growing business scene — Microsoft 365, backups, and straight answers on the east side.",
    highlights: [
      "Small-business 365 migrations and license cleanup",
      "Lakeside-office networks with outdoor coverage",
      "Backup strategies that survive storm season",
    ],
    responseNote: "Remote same-day. Winter Haven on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 28.0222, lon: -81.7329 },
  },
  {
    slug: "it-support-sun-city-center",
    name: "Sun City Center",
    county: "Hillsborough",
    intro:
      "A hub for small businesses and professional practices — guided remote help plus scheduled on-site visits.",
    highlights: [
      "Patient, plain-English remote support for non-technical teams",
      "Device, phone, and printer setup without the rush",
      "Phishing and fraud-awareness training for your team",
    ],
    responseNote: "Remote same-day. Sun City Center on-site typically within 1–2 business days.",
    geo: { lat: 27.7134, lon: -82.3508 },
  },
  {
    slug: "it-support-ruskin",
    name: "Ruskin",
    county: "Hillsborough",
    intro:
      "South county growth with new business parks and farms side by side — IT help that covers both.",
    highlights: [
      "New-build office networks and access-point installs",
      "Small-business support for local shops and services",
      "Rural-edge connectivity: hotspots and failover planning",
    ],
    responseNote: "Remote same-day. Ruskin on-site typically within 1–2 business days.",
    geo: { lat: 27.7181, lon: -82.4334 },
  },
  {
    slug: "it-support-seffner",
    name: "Seffner",
    county: "Hillsborough",
    intro:
      "Between Tampa and Plant City — local businesses getting big-city response times.",
    highlights: [
      "Office Wi-Fi for peak workloads and hybrid teams",
      "Home-office and hybrid setups for I-4 corridor teams",
      "Small-business basics: email, backup, and printers",
    ],
    responseNote: "Remote same-day. Seffner on-site typically next business day.",
    geo: { lat: 27.9942, lon: -82.2851 },
  },
  {
    slug: "it-support-bradenton",
    name: "Bradenton",
    county: "Manatee",
    intro:
      "South of the bay with growing businesses — served remote-first with the same flat rates and plain-English help.",
    highlights: [
      "Same-day remote support for software, email, and 365",
      "Small-business 365 migrations and license cleanup",
      "On-site available by appointment for hardware and installs",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 27.4989, lon: -82.5748 },
    remoteFirst: true,
  },
  {
    slug: "it-support-sarasota",
    name: "Sarasota",
    county: "Sarasota",
    intro:
      "Arts scene and thriving small businesses — premium remote IT support without the big-city MSP contracts.",
    highlights: [
      "Same-day remote support with patient, jargon-free explanations",
      "Office and downtown-business network troubleshooting",
      "Backup and security checkups for growing businesses",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 27.3364, lon: -82.5307 },
    remoteFirst: true,
  },
  {
    slug: "it-support-spring-hill",
    name: "Spring Hill",
    county: "Hernando",
    intro:
      "North of Tampa Bay with growing small businesses — remote-first support that reaches you the same day.",
    highlights: [
      "Same-day remote fixes for computers, email, and printers",
      "Office Wi-Fi optimization for tricky floorplans",
      "Phishing-awareness and security checkups for your team",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 28.4767, lon: -82.525 },
    remoteFirst: true,
  },
  {
    slug: "it-support-brooksville",
    name: "Brooksville",
    county: "Hernando",
    intro:
      "Historic Hernando county seat with rural edges — remote support same-day, on-site by appointment when hardware demands it.",
    highlights: [
      "Same-day remote support for small businesses",
      "Rural connectivity planning: hotspots and failover options",
      "Storm-season backup preparation",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 28.5556, lon: -82.3879 },
    remoteFirst: true,
  },
  {
    slug: "it-support-dade-city",
    name: "Dade City",
    county: "Pasco",
    intro:
      "Pasco's historic county seat — small-town businesses served remote-first at Tampa Bay flat rates.",
    highlights: [
      "Same-day remote support for shops and offices",
      "Downtown business networks, printers, and cameras",
      "Microsoft 365 setup for small teams",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 28.3647, lon: -82.1958 },
    remoteFirst: true,
  },
  {
    slug: "it-support-bartow",
    name: "Bartow",
    county: "Polk",
    intro:
      "Polk's county seat with government-adjacent businesses — remote-first IT with straight answers and upfront quotes.",
    highlights: [
      "Same-day remote support for offices and remote workers",
      "Small-business email, backup, and security basics",
      "On-site available by appointment for installs and hardware",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 27.8964, lon: -81.8431 },
    remoteFirst: true,
  },
  {
    slug: "it-support-gibsonton",
    name: "Gibsonton",
    county: "Hillsborough",
    intro:
      "Showtown roots with growing businesses along the Alafia — small businesses getting responsive local IT.",
    highlights: [
      "Business networks and access-point installs",
      "Small-shop support for local services and trades",
      "Storm-season backup checks for south-county offices",
    ],
    responseNote: "Remote same-day. Gibsonton on-site typically next business day.",
    geo: { lat: 27.8364, lon: -82.3617 },
  },
  {
    slug: "it-support-wimauma",
    name: "Wimauma",
    county: "Hillsborough",
    intro:
      "Rural edges meeting new business parks — connectivity planning plus everyday IT help for offices and farms.",
    highlights: [
      "Rural-edge internet: hotspots, boosters, and failover options",
      "New-build office networks done right from day one",
      "Small-business basics for local shops and growers",
    ],
    responseNote: "Remote same-day. Wimauma on-site typically within 1–2 business days.",
    geo: { lat: 27.7145, lon: -82.3189 },
  },
  {
    slug: "it-support-carrollwood",
    name: "Carrollwood",
    county: "Hillsborough",
    intro:
      "Established North Tampa business district full of growing firms — networks that keep video calls flawless.",
    highlights: [
      "Office builds with dedicated work networks",
      "Lots with mature landscaping needing coverage across the property",
      "Team device fleets: work, guest, and IoT separated",
    ],
    responseNote: "Remote same-day. Carrollwood on-site typically next business day.",
    geo: { lat: 28.0656, lon: -82.5101 },
  },
  {
    slug: "it-support-town-n-country",
    name: "Town 'n' Country",
    county: "Hillsborough",
    intro:
      "One of Tampa Bay's biggest business corridors — dense commercial areas where same-day remote support shines.",
    highlights: [
      "High-density office Wi-Fi tuned against congestion",
      "Office setups for airport-area professionals",
      "Bilingual-friendly, patient plain-English support",
    ],
    responseNote: "Remote same-day. Town 'n' Country on-site typically next business day.",
    geo: { lat: 28.0064, lon: -82.5736 },
  },
  {
    slug: "it-support-gulfport",
    name: "Gulfport",
    county: "Pinellas",
    intro:
      "Arts-town charm on Boca Ciega Bay — galleries, cafes, and shops with networks that just work.",
    highlights: [
      "Gallery and cafe networks with guest Wi-Fi that markets",
      "Waterfront-business coverage including docks and patios",
      "Patient remote help, no rush, no jargon",
    ],
    responseNote: "Remote same-day. Gulfport on-site typically within 1–2 business days.",
    geo: { lat: 27.7408, lon: -82.7003 },
  },
  {
    slug: "it-support-st-pete-beach",
    name: "St. Pete Beach",
    county: "Pinellas",
    intro:
      "Resorts, hotels, and beach businesses where Wi-Fi makes or breaks reviews — hospitality-grade reliability.",
    highlights: [
      "Guest Wi-Fi visitors won't complain about",
      "Resort and restaurant network reliability",
      "Salt-air hardware reality checks and replacements",
    ],
    responseNote: "Remote same-day. St. Pete Beach on-site typically within 1–2 business days.",
    geo: { lat: 27.7241, lon: -82.7412 },
  },
  {
    slug: "it-support-oldsmar",
    name: "Oldsmar",
    county: "Pinellas",
    intro:
      "Top-of-the-bay corporate corridor and business hub — growing employers who need IT that keeps pace.",
    highlights: [
      "Corporate-park adjacent small-business IT",
      "Small-business networks across the corporate corridor",
      "Home-office and hybrid setups done right",
    ],
    responseNote: "Remote same-day. Oldsmar on-site typically within 1–2 business days.",
    geo: { lat: 28.0389, lon: -82.6696 },
  },
  {
    slug: "it-support-port-richey",
    name: "Port Richey",
    county: "Pasco",
    intro:
      "Waterfront working town on the Pithlachascotee — marine businesses and trades with practical IT needs.",
    highlights: [
      "Waterfront-business Wi-Fi reaching docks and lifts",
      "Marine and trade business networks and printers",
      "Affordable, honest help for small teams and sole traders",
    ],
    responseNote: "Remote same-day. Port Richey on-site typically within 1–2 business days.",
    geo: { lat: 28.2749, lon: -82.7198 },
  },
  {
    slug: "it-support-holiday",
    name: "Holiday",
    county: "Pasco",
    intro:
      "Established Pasco business district — patient support and fair flat rates for small businesses.",
    highlights: [
      "Guided remote sessions that walk your team through it",
      "Office Wi-Fi with priority for critical apps",
      "Phishing and fraud-awareness help for your team",
    ],
    responseNote: "Remote same-day. Holiday on-site typically within 1–2 business days.",
    geo: { lat: 28.1808, lon: -82.742 },
  },
  {
    slug: "it-support-hudson",
    name: "Hudson",
    county: "Pasco",
    intro:
      "Coastal Pasco with canals and growing businesses — remote-first speed with local on-site backup.",
    highlights: [
      "Canal-front business networks covering docks and outdoor areas",
      "Remote monitoring for seasonal and multi-site locations",
      "Small-business basics along the US-19 corridor",
    ],
    responseNote: "Remote same-day. Hudson on-site typically within 1–2 business days.",
    geo: { lat: 28.3622, lon: -82.6931 },
  },
  {
    slug: "it-support-auburndale",
    name: "Auburndale",
    county: "Polk",
    intro:
      "Between Lakeland and Winter Haven — local businesses that deserve big-city response times.",
    highlights: [
      "Office networks for peak workloads and hybrid teams",
      "Downtown shop networks, printers, and cameras",
      "Storm-season backup preparation",
    ],
    responseNote: "Remote same-day. Auburndale on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 28.0656, lon: -81.7903 },
  },
  {
    slug: "it-support-haines-city",
    name: "Haines City",
    county: "Polk",
    intro:
      "Gateway growth between Tampa and Orlando — new business parks, new companies, same-day remote support.",
    highlights: [
      "New-build office networks done right from day one",
      "Hybrid work setups for both metro directions",
      "Small-business 365 and backup foundations",
    ],
    responseNote: "Remote same-day. Haines City on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 28.1147, lon: -81.6178 },
  },
  {
    slug: "it-support-davenport",
    name: "Davenport",
    county: "Polk",
    intro:
      "Hospitality and vacation-rental capital on the I-4 corridor — guest Wi-Fi that earns five stars plus owner networks that stay private.",
    highlights: [
      "Guest Wi-Fi with owner/guest network separation",
      "Multi-property and investor network monitoring",
      "Resort-corridor small-business support",
    ],
    responseNote: "Remote same-day. Davenport on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 28.1606, lon: -81.6014 },
  },
  {
    slug: "it-support-lake-wales",
    name: "Lake Wales",
    county: "Polk",
    intro:
      "Historic Bok Tower town with growing businesses — honest IT help at the edge of the metro.",
    highlights: [
      "Networks for historic and new-build offices alike",
      "Local business email, backup, and printer basics",
      "Citrus-country connectivity planning for rural edges",
    ],
    responseNote: "Remote same-day. Lake Wales on-site grouped mid-week for fastest scheduling.",
    geo: { lat: 27.9014, lon: -81.5859 },
  },
  {
    slug: "it-support-palmetto",
    name: "Palmetto",
    county: "Manatee",
    intro:
      "Across the river from Bradenton — historic downtown plus new growth, served at standard Tampa Bay rates.",
    highlights: [
      "Downtown business networks and point-of-sale reliability",
      "Riverfront-office Wi-Fi with outdoor coverage",
      "Affordable flat-rate help for local shops",
    ],
    responseNote: "Remote same-day. Palmetto on-site typically within 1–2 business days.",
    geo: { lat: 27.5215, lon: -82.5728 },
  },
  {
    slug: "it-support-parrish",
    name: "Parrish",
    county: "Manatee",
    intro:
      "One of Florida's fastest-growing communities — new business parks full of growing companies needing real networks.",
    highlights: [
      "New-construction access-point installs for large floorplans",
      "Hybrid-work builds with dedicated office networks",
      "Builder-default router replacements across new business parks",
    ],
    responseNote: "Remote same-day. Parrish on-site typically within 1–2 business days.",
    geo: { lat: 27.4364, lon: -82.4259 },
  },
  {
    slug: "it-support-lakewood-ranch",
    name: "Lakewood Ranch",
    county: "Manatee",
    intro:
      "Award-winning master plan with thriving businesses — premium networks for premium offices.",
    highlights: [
      "Campus Wi-Fi with outdoor and building-to-building coverage",
      "Executive offices with enterprise-grade reliability",
      "Large device fleets that stay connected",
    ],
    responseNote: "Remote same-day. Lakewood Ranch on-site typically within 1–2 business days.",
    geo: { lat: 27.4753, lon: -82.4382 },
  },
  {
    slug: "it-support-north-port",
    name: "North Port",
    county: "Sarasota",
    intro:
      "Sarasota County's largest city and still growing fast — served remote-first with same-day response.",
    highlights: [
      "Same-day remote support for small businesses",
      "New-build network setup across growing business parks",
      "On-site available by appointment for installs and hardware",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 27.0442, lon: -82.2359 },
    remoteFirst: true,
  },
  {
    slug: "it-support-venice",
    name: "Venice",
    county: "Sarasota",
    intro:
      "Shark-tooth beaches and a thriving small-business scene — patient remote-first support with peak-season awareness.",
    highlights: [
      "Same-day remote help, explained without jargon or rush",
      "Remote monitoring for seasonal and multi-site locations",
      "On-site available by appointment for hardware needs",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment, typically within 2–3 business days.",
    geo: { lat: 27.0998, lon: -82.4543 },
    remoteFirst: true,
  },
  {
    slug: "it-support-the-villages",
    name: "The Villages",
    county: "Sumter",
    intro:
      "America's friendliest hometown — remote-first IT help for the small businesses and practices that serve it.",
    highlights: [
      "Guided remote sessions that walk your team through it",
      "Phishing and fraud-prevention checkups for your team",
      "Device, phone, and printer setup without the runaround",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment for extended projects.",
    geo: { lat: 28.9347, lon: -81.9659 },
    remoteFirst: true,
  },
  {
    slug: "it-support-ocala",
    name: "Ocala",
    county: "Marion",
    intro:
      "Horse capital with a growing business scene — too far for next-day on-site, perfect for same-day remote support.",
    highlights: [
      "Same-day remote support for farms, stables, and offices",
      "Equine-business basics: email, backups, and cameras",
      "On-site available by appointment for larger projects",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment for extended projects.",
    geo: { lat: 29.1872, lon: -82.1401 },
    remoteFirst: true,
  },
  {
    slug: "it-support-port-charlotte",
    name: "Port Charlotte",
    county: "Charlotte",
    intro:
      "Southwest Florida canals and growing businesses — patient remote-first help with hurricane-season awareness built in.",
    highlights: [
      "Same-day remote fixes with jargon-free explanations",
      "Storm-season backup checks for canal-side offices",
      "Phishing and fraud-awareness help for your team",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment for extended projects.",
    geo: { lat: 26.9762, lon: -82.1098 },
    remoteFirst: true,
  },
  {
    slug: "it-support-punta-gorda",
    name: "Punta Gorda",
    county: "Charlotte",
    intro:
      "Harbor-side businesses with historic downtown charm — remote-first IT at Tampa Bay flat rates.",
    highlights: [
      "Same-day remote support for downtown shops and offices",
      "Multi-site tech checkups before peak season",
      "Small-business email and backup foundations",
    ],
    responseNote: "Remote-first area: same-day remote support. On-site visits by appointment for extended projects.",
    geo: { lat: 26.9297, lon: -82.0454 },
    remoteFirst: true,
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
