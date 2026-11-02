import type {
  StoreTheme,
  ThemeCustomizationSettings,
  StorePage,
  DnsRecordInstruction,
} from "./types";

export const PRESET_BRAND_COLORS = [
  { name: "CartX Blue (Default)", hex: "#2563EB" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Royal Purple", hex: "#8B5CF6" },
  { name: "Ruby Rose", hex: "#F43F5E" },
  { name: "Amber Gold", hex: "#F59E0B" },
  { name: "Slate Dark", hex: "#0F172A" },
  { name: "Deep Indigo", hex: "#4F46E5" },
  { name: "Crimson Red", hex: "#DC2626" },
];

export const HEADING_FONTS = [
  { id: "Inter", label: "Inter (Clean & Modern)" },
  { id: "Noto Sans Bengali", label: "Noto Sans Bengali (বাংলা উপযোগী)" },
  { id: "Poppins", label: "Poppins (Geometric & Friendly)" },
  { id: "Hind Siliguri", label: "Hind Siliguri (বাংলা প্রিমিয়াম)" },
];

export const BODY_FONTS = [
  { id: "Inter", label: "Inter (Default Sans)" },
  { id: "Noto Sans Bengali", label: "Noto Sans Bengali (বাংলা ফন্ট)" },
  { id: "Roboto", label: "Roboto (Neutral)" },
  { id: "Open Sans", label: "Open Sans (Legible)" },
];

export const DEFAULT_THEME_SETTINGS: ThemeCustomizationSettings = {
  colors: {
    primary: "#2563EB",
    secondary: "#1E40AF",
    accent: "#F59E0B",
    background: "#FFFFFF",
    text: "#0F172A",
    headerBg: "#FFFFFF",
    footerBg: "#0F172A",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Noto Sans Bengali",
    baseFontSize: "md",
  },
  header: {
    logoText: "Green Harvest Organic",
    sticky: true,
    showSearch: true,
    showCart: true,
    announcementEnabled: true,
    announcementText: "সারাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারি! ফ্রি শিপিং ৳২,০০০+ অর্ডারে।",
    announcementBg: "#2563EB",
  },
  hero: {
    enabled: true,
    headline: "Pure & Organic Groceries from Bangladesh",
    headlineBn: "খাঁটি ও প্রাকৃতিক গ্রোসারি পণ্য আপনার দ্বারে",
    subheading: "Handcrafted, farmer-direct honey, mustard oil, and seasonal fruits delivered across 64 districts.",
    subheadingBn: "সরাসরি কৃষক থেকে সংগৃহীত খাঁটি মধু, সরিষার তেল এবং মৌসুমী ফল ঘরে বসেই কিনুন।",
    buttonText: "Shop Catalog / এখনই কিনুন",
    buttonLink: "/dashboard/products",
    bannerStyle: "split",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=900",
  },
  categories: {
    enabled: true,
    title: "Popular Categories",
    titleBn: "জনপ্রিয় ক্যাটাগরি সমূহ",
    layout: "grid",
  },
  products: {
    enabled: true,
    title: "Best Selling Products",
    titleBn: "সেরা বিক্রিত পণ্যসমূহ",
    productCount: 8,
  },
  promo: {
    enabled: true,
    headline: "Special Seasonal Offer — Up to 20% Off!",
    couponCode: "EID2026",
    discountText: "Use coupon at checkout for instant discount",
  },
  trustBadges: {
    enabled: true,
    items: [
      {
        id: "tb-1",
        title: "Fast Delivery",
        titleBn: "দ্রুততম ডেলিভারি",
        description: "Inside Dhaka 24-48 hrs, Outside Dhaka 48-72 hrs",
        icon: "truck",
      },
      {
        id: "tb-2",
        title: "100% Authentic",
        titleBn: "শতভাগ খাঁটি পণ্য",
        description: "Direct source from registered farms",
        icon: "shield-check",
      },
      {
        id: "tb-3",
        title: "Easy 7-Day Returns",
        titleBn: "৭ দিনের সহজ রিটার্ন",
        description: "Hassle-free return policy on damaged items",
        icon: "rotate-ccw",
      },
      {
        id: "tb-4",
        title: "Cash on Delivery & MFS",
        titleBn: "ক্যাশ অন ডেলিভারি ও বিকাশ",
        description: "Pay with bKash, Nagad, or Cash on Delivery",
        icon: "credit-card",
      },
    ],
  },
  footer: {
    copyrightText: "© 2026 Green Harvest Organic. Powered by CartX.",
    showNewsletter: true,
    showSocialLinks: true,
    showPaymentMethods: true,
  },
};

export const INITIAL_THEMES: StoreTheme[] = [
  {
    id: "modern_clean",
    name: "Modern Commerce",
    nameBn: "মডার্ন কমার্স",
    description: "Clean, spacious grid layout designed for high-conversion retail and supermarkets.",
    tag: "Recommended",
    thumbnail: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=600",
    version: "2.4.0",
    author: "CartX Design Core",
    features: ["Mega Menu", "Sticky Cart", "Product QuickView", "Live Filters"],
    isActive: true,
    defaultSettings: DEFAULT_THEME_SETTINGS,
    currentSettings: DEFAULT_THEME_SETTINGS,
    lastEditedAt: "2026-10-31T12:00:00.000Z",
  },
  {
    id: "minimal_boutique",
    name: "Minimal Boutique",
    nameBn: "মিনিমাল বুটিক",
    description: "Editorial typography and generous whitespace designed for fashion, lifestyle, and apparel.",
    tag: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
    version: "2.1.2",
    author: "CartX Studio",
    features: ["Lookbook Gallery", "Editorial Stories", "Minimalist Cart", "Mobile Bottom Bar"],
    isActive: false,
    defaultSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#0F172A",
        secondary: "#334155",
        accent: "#E2E8F0",
        footerBg: "#18181B",
      },
      typography: {
        headingFont: "Poppins",
        bodyFont: "Inter",
        baseFontSize: "md",
      },
      hero: {
        ...DEFAULT_THEME_SETTINGS.hero,
        headline: "Contemporary Fashion & Lifestyle Essentials",
        headlineBn: "আধুনিক ফ্যাশন ও লাইফস্টাইল কালেকশন",
        subheading: "Curated fabrics and artisanal craft for everyday elegance.",
        bannerStyle: "full",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900",
      },
    },
    currentSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#0F172A",
        secondary: "#334155",
        accent: "#E2E8F0",
        footerBg: "#18181B",
      },
      typography: {
        headingFont: "Poppins",
        bodyFont: "Inter",
        baseFontSize: "md",
      },
    },
  },
  {
    id: "bold_express",
    name: "Express Superstore",
    nameBn: "এক্সপ্রেস সুপারস্টোর",
    description: "High-density product catalog layout optimized for electronics, gadgets, and wholesale.",
    tag: "Catalog",
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600",
    version: "1.9.0",
    author: "CartX Core",
    features: ["Dense Grid", "Flash Sale Counters", "Brand Directory", "Multi-Warehouse Tags"],
    isActive: false,
    defaultSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#DC2626",
        secondary: "#991B1B",
        accent: "#FBBF24",
        headerBg: "#FFFFFF",
        footerBg: "#111827",
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Roboto",
        baseFontSize: "sm",
      },
      hero: {
        ...DEFAULT_THEME_SETTINGS.hero,
        headline: "Direct Electronics & Gadgets Wholesale Deals",
        headlineBn: "পাইকারি মূল্যে সেরা ইলেকট্রনিক্স গ্যাজেট",
        subheading: "Same day dispatch inside Dhaka. Official brand warranty on all items.",
        bannerStyle: "split",
        imageUrl: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=900",
      },
    },
    currentSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#DC2626",
        secondary: "#991B1B",
        accent: "#FBBF24",
        footerBg: "#111827",
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Roboto",
        baseFontSize: "sm",
      },
    },
  },
  {
    id: "artisan_craft",
    name: "Artisan Craft",
    nameBn: "কারিগরী ক্রাফট",
    description: "Warm earth tones and story cards designed for traditional handicrafts, jute, and pottery.",
    tag: "Artisan",
    thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    version: "1.5.0",
    author: "CartX Heritage",
    features: ["Artisan Bio Badges", "Custom Jute Textures", "Storytelling Sections", "Presale Support"],
    isActive: false,
    defaultSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#92400E",
        secondary: "#78350F",
        accent: "#D97706",
        background: "#FFFBEB",
        text: "#451A03",
        headerBg: "#FEF3C7",
        footerBg: "#292524",
      },
      typography: {
        headingFont: "Hind Siliguri",
        bodyFont: "Noto Sans Bengali",
        baseFontSize: "md",
      },
      hero: {
        ...DEFAULT_THEME_SETTINGS.hero,
        headline: "Traditional Bangladeshi Handicrafts & Natural Living",
        headlineBn: "ঐতিহ্যবাহী বাংলাদেশি হস্তশিল্প ও প্রাকৃতিক জীবনযাপন",
        subheading: "Authentic nakshi kantha, clay pottery, and brass decor from rural artisans.",
        bannerStyle: "centered",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=900",
      },
    },
    currentSettings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#92400E",
        secondary: "#78350F",
        accent: "#D97706",
        background: "#FFFBEB",
        text: "#451A03",
        headerBg: "#FEF3C7",
        footerBg: "#292524",
      },
      typography: {
        headingFont: "Hind Siliguri",
        bodyFont: "Noto Sans Bengali",
        baseFontSize: "md",
      },
    },
  },
];

export const DEFAULT_DNS_INSTRUCTIONS: DnsRecordInstruction[] = [
  {
    type: "CNAME",
    name: "shop (or @)",
    target: "cname.cartx.com.bd",
    ttl: "3600 (Automatic)",
    description: "Points your custom subdomain to CartX edge storefront reverse proxy.",
  },
  {
    type: "A",
    name: "@ (Apex Domain)",
    target: "104.21.45.120",
    ttl: "3600",
    description: "Required only when connecting root domain without subdomain prefix.",
  },
];

export const LEGAL_DISCLAIMER_NOTICE = `> ⚠️ **আইনি বিজ্ঞপ্তি / Legal Disclaimer:**
> এই খসড়া টেমপ্লেটটি শুধুমাত্র একটি নমুনা নির্দেশিকা এবং এটি কোনো আনুষ্ঠানিক আইনি পরামর্শ (Legal Advice) নয়। আপনার ব্যবসায়ের নির্দিষ্ট কার্যপরিধি, গ্রাহক প্রতিশ্রুতি এবং বাংলাদেশের প্রচলিত আইন ও ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর নীতিমালা অনুযায়ী এটি সংশোধন করুন।`;

export const LEGAL_TEMPLATES: Record<
  "privacy" | "terms" | "refund" | "shipping",
  {
    title: string;
    titleBn: string;
    slug: string;
    content: string;
  }
> = {
  privacy: {
    title: "Privacy Policy",
    titleBn: "গোপনীয়তা নীতি",
    slug: "privacy-policy",
    content: `${LEGAL_DISCLAIMER_NOTICE}

# Privacy Policy — Green Harvest Organic
**Last Updated:** October 31, 2026

At **Green Harvest Organic** (operating on the CartX e-commerce SaaS platform in Bangladesh), we respect your personal privacy and are committed to safeguarding the personal information you share with us.

### 1. Information We Collect
When you browse our storefront, register an account, or place an order, we may collect:
- **Contact Details:** Full Name, Bangladeshi mobile phone number (+880), delivery address, and email address.
- **Order Information:** Items ordered, order value in BDT (৳), and delivery instructions.
- **Payment Information:** Payment method selected (bKash, Nagad, SSLCommerz, or Cash on Delivery). *Note: We never store your payment PINs, passwords, or CVV codes.*

### 2. How We Use Your Data
- To process, pack, and deliver your orders through our authorized courier partners (Steadfast, Pathao, RedX).
- To send SMS delivery tracking updates and order confirmations.
- To detect and prevent fraudulent transactions.

### 3. Sharing with Authorized Third Parties
We only share necessary shipping data with courier partners for order fulfillment. We do not sell, rent, or trade your personal information to third parties for marketing purposes.

### 4. Contact Us
For any privacy-related inquiries, contact us at:
- **Email:** support@greenharvest.com.bd
- **Phone:** +880 1711-002233
- **Location:** Uttara, Dhaka-1230, Bangladesh`,
  },
  terms: {
    title: "Terms & Conditions",
    titleBn: "ব্যবহারের শর্তাবলী",
    slug: "terms-and-conditions",
    content: `${LEGAL_DISCLAIMER_NOTICE}

# Terms & Conditions — Green Harvest Organic
**Last Updated:** October 31, 2026

Welcome to **Green Harvest Organic**. By accessing or making purchases on this website, you agree to comply with and be bound by the following terms.

### 1. General Ordering & Pricing
- All prices displayed on our storefront are in **Bangladeshi Taka (BDT ৳)** and include applicable local taxes unless stated otherwise.
- We reserve the right to correct pricing errors and cancel orders placed under incorrect price listings before dispatch.

### 2. Order Confirmation & Fulfillment
- An order is deemed confirmed upon successful digital payment or phone verification for Cash on Delivery (COD) orders.
- Estimated delivery timelines: Inside Dhaka (24–48 hours), Outside Dhaka (3–5 business days). Unforeseen weather disruptions or courier strikes may affect transit times.

### 3. Payment Terms
- We accept Cash on Delivery (COD), bKash Tokenized Checkout, Nagad Direct, and SSLCommerz gateway debit/credit cards.
- For high-value COD orders above ৳5,000, we may request an advance courier fee verification.

### 4. Jurisdiction & Governing Law
These terms are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising out of these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka.`,
  },
  refund: {
    title: "Refund & Return Policy",
    titleBn: "ফেরত ও রিফান্ড নীতি",
    slug: "refund-and-return-policy",
    content: `${LEGAL_DISCLAIMER_NOTICE}

# Refund & Return Policy — Green Harvest Organic
**Last Updated:** October 31, 2026

We take pride in providing 100% authentic and fresh organic goods. If you are not satisfied with your purchase, please review our return guidelines.

### 1. Return Eligibility (৭ দিনের রিটার্ন)
Customers may request a return within **7 days** of parcel delivery under the following conditions:
- Product is damaged, defective, or leaked during courier transit.
- Incorrect item or size received compared to invoice CTX order.
- Seal or packaging is intact (for non-perishable packaged items).
- *Perishable items (fresh fruits/dairy) must be reported within 24 hours of delivery with photo evidence.*

### 2. Return Process
1. Contact customer support via WhatsApp or hotline (+880 1711-002233) with your order ID and photos of the affected product.
2. Our team will schedule courier pickup or provide drop-off instructions.
3. Upon warehouse receipt and verification, replacement or refund will be initiated.

### 3. Refund Timelines
- **bKash / Nagad Payments:** Refund processed directly to the original MFS number within **3 to 5 business days**.
- **Credit / Debit Cards:** Refund reflected in your bank statement within **7 to 10 working days** depending on the issuing bank.
- **Cash on Delivery (COD):** Refund issued via bKash or Nagad wallet transfer upon verified parcel return.`,
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    titleBn: "শিপিং ও ডেলিভারি নীতি",
    slug: "shipping-policy",
    content: `${LEGAL_DISCLAIMER_NOTICE}

# Shipping & Delivery Policy — Green Harvest Organic
**Last Updated:** October 31, 2026

We deliver across all 64 districts in Bangladesh using premier nationwide logistics networks.

### 1. Delivery Rates & Free Shipping
- **Inside Dhaka:** Flat delivery charge of **৳60**.
- **Outside Dhaka (Sub-districts & Nationwide):** Flat delivery charge of **৳120**.
- **Free Shipping Threshold:** Orders totaling **৳2,000 or more** qualify for free doorstep delivery nationwide!

### 2. Delivery Timelines
| Destination | Estimated Transit Time | Partner Couriers |
|---|---|---|
| Dhaka Metro | 24 to 48 Hours | Pathao, Steadfast, In-house |
| Greater Dhaka & Divisional Cities | 48 to 72 Hours | Steadfast, RedX |
| Remote Upazilas & Thanas | 3 to 5 Working Days | Steadfast Courier, RedX |

### 3. Real-Time Tracking
Every dispatched shipment receives a unique Consignment Tracking ID. You can check the live transit status through our storefront tracking link or the courier SMS sent to your mobile.`,
  },
};

export const INITIAL_PAGES: StorePage[] = [
  {
    id: "page-1",
    title: LEGAL_TEMPLATES.privacy.title,
    titleBn: LEGAL_TEMPLATES.privacy.titleBn,
    slug: LEGAL_TEMPLATES.privacy.slug,
    content: LEGAL_TEMPLATES.privacy.content,
    pageType: "legal_policy",
    policyType: "privacy",
    status: "published",
    metaTitle: "Privacy Policy | Green Harvest Organic",
    metaDescription: "Read the official privacy policy and data security practices of Green Harvest Organic.",
    viewsCount: 342,
    isTemplate: true,
    publishedAt: "2026-10-25T10:00:00.000Z",
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-31T09:30:00.000Z",
  },
  {
    id: "page-2",
    title: LEGAL_TEMPLATES.terms.title,
    titleBn: LEGAL_TEMPLATES.terms.titleBn,
    slug: LEGAL_TEMPLATES.terms.slug,
    content: LEGAL_TEMPLATES.terms.content,
    pageType: "legal_policy",
    policyType: "terms",
    status: "published",
    metaTitle: "Terms & Conditions | Green Harvest Organic",
    metaDescription: "Terms of service, pricing rules, and ordering guidelines for Green Harvest Organic.",
    viewsCount: 289,
    isTemplate: true,
    publishedAt: "2026-10-25T10:00:00.000Z",
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-31T09:30:00.000Z",
  },
  {
    id: "page-3",
    title: LEGAL_TEMPLATES.refund.title,
    titleBn: LEGAL_TEMPLATES.refund.titleBn,
    slug: LEGAL_TEMPLATES.refund.slug,
    content: LEGAL_TEMPLATES.refund.content,
    pageType: "legal_policy",
    policyType: "refund",
    status: "published",
    metaTitle: "Refund & Return Policy | Green Harvest Organic",
    metaDescription: "7-day return guidelines, courier return procedures, and MFS refund turnaround.",
    viewsCount: 412,
    isTemplate: true,
    publishedAt: "2026-10-25T10:00:00.000Z",
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-31T09:30:00.000Z",
  },
  {
    id: "page-4",
    title: LEGAL_TEMPLATES.shipping.title,
    titleBn: LEGAL_TEMPLATES.shipping.titleBn,
    slug: LEGAL_TEMPLATES.shipping.slug,
    content: LEGAL_TEMPLATES.shipping.content,
    pageType: "legal_policy",
    policyType: "shipping",
    status: "published",
    metaTitle: "Shipping & Delivery Policy | Green Harvest Organic",
    metaDescription: "Delivery rates for Dhaka (৳60) and Outside Dhaka (৳120), delivery timelines and couriers.",
    viewsCount: 518,
    isTemplate: true,
    publishedAt: "2026-10-25T10:00:00.000Z",
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-31T09:30:00.000Z",
  },
  {
    id: "page-5",
    title: "About Our Story & Farmers",
    titleBn: "আমাদের গল্প ও কৃষক পরিচিতি",
    slug: "about-us",
    content: `# About Green Harvest Organic
Founded in 2024 in Dhaka, Bangladesh, **Green Harvest Organic** bridges rural farmers with conscious urban households.

### Our Mission
We provide 100% adulteration-free, organic groceries including cold-pressed mustard oil, Sundarban wild honey, and seasonal organic fruits directly to doorsteps across Bangladesh.

### Sustainable Partnership
Over 150 smallholder farming families in Dinajpur, Rajshahi, and Satkhira partner with Green Harvest under fair trade price commitments.`,
    pageType: "standard_cms",
    status: "published",
    metaTitle: "About Us | Green Harvest Organic Bangladesh",
    metaDescription: "Learn how Green Harvest supports rural farmers and delivers 100% adulteration-free groceries.",
    viewsCount: 684,
    publishedAt: "2026-10-26T12:00:00.000Z",
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-31T11:00:00.000Z",
  },
  {
    id: "page-6",
    title: "Seasonal Harvest Schedule 2026",
    titleBn: "মৌসুমী ফসল ক্যালেন্ডার ২০২৬",
    slug: "seasonal-harvest-calendar",
    content: `# Seasonal Harvest Calendar
Upcoming seasonal arrivals at Green Harvest Organic:
- **Winter (Nov–Jan):** Cold-pressed Kachi Ghani Mustard Oil, Khejur Gur (Date Palm Jaggery).
- **Spring (Feb–Apr):** Pure Sundarban Blossom Honey, Organic Chia Seeds.
- **Summer (May–Jul):** Rajshahi & Chapainawabganj Himsagar and Amrapali Mangoes.`,
    pageType: "standard_cms",
    status: "draft",
    metaTitle: "Seasonal Harvest Calendar 2026",
    metaDescription: "Upcoming seasonal organic produce availability schedule.",
    viewsCount: 45,
    createdAt: "2026-10-30T14:00:00.000Z",
    updatedAt: "2026-10-31T14:00:00.000Z",
  },
];

export const INITIAL_DOMAINS = [
  {
    id: "dom-default-1",
    domain: "green-harvest.cartx.com.bd",
    isDefaultSubdomain: true,
    isPrimary: true,
    status: "active" as const,
    verificationMethod: "cname" as const,
    targetValue: "cname.cartx.com.bd",
    sslStatus: "active" as const,
    sslIssuer: "Cloudflare Managed Edge SSL (Platform Default)",
    dnsRecords: DEFAULT_DNS_INSTRUCTIONS,
    lastCheckedAt: "2026-10-31T10:00:00.000Z",
    createdAt: "2026-10-20T08:00:00.000Z",
    verifiedAt: "2026-10-20T08:00:00.000Z",
  },
  {
    id: "dom-custom-1",
    domain: "shop.greenharvest.com.bd",
    isDefaultSubdomain: false,
    isPrimary: false,
    status: "demo_pending_verification" as const,
    verificationMethod: "cname" as const,
    targetValue: "cname.cartx.com.bd",
    sslStatus: "demo_not_active" as const,
    dnsRecords: DEFAULT_DNS_INSTRUCTIONS,
    lastCheckedAt: "2026-10-31T11:30:00.000Z",
    createdAt: "2026-10-28T09:00:00.000Z",
  },
];

export const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    action: "theme_updated" as const,
    description: "Modified primary brand color and typography on Modern Commerce theme.",
    actor: "Store Owner",
    timestamp: "2026-10-31T12:00:00.000Z",
  },
  {
    id: "act-2",
    action: "page_published" as const,
    description: "Published updated Refund & Return Policy with 7-day return terms.",
    actor: "Store Owner",
    timestamp: "2026-10-31T09:30:00.000Z",
  },
  {
    id: "act-3",
    action: "domain_added" as const,
    description: "Added custom domain shop.greenharvest.com.bd (Demo Mode Pending).",
    actor: "Store Admin",
    timestamp: "2026-10-28T09:00:00.000Z",
  },
  {
    id: "act-4",
    action: "status_changed" as const,
    description: "Activated public storefront access.",
    actor: "Store Owner",
    timestamp: "2026-10-25T10:00:00.000Z",
  },
];

