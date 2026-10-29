import type {
  Product,
  ProductCategory,
  ProductFilterParams,
  PaginatedResult,
} from "../types";
import type {
  InventoryItem,
  InventoryMovement,
  InventoryOverviewStats,
  StockAdjustment,
} from "../../inventory/types";

const PRODUCTS_STORAGE_KEY = "cartx_demo_products_v1";
const CATEGORIES_STORAGE_KEY = "cartx_demo_categories_v1";
const MOVEMENTS_STORAGE_KEY = "cartx_demo_inventory_movements_v1";

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-1",
    name: "Women's Fashion",
    slug: "womens-fashion",
    description: "Traditional and modern sarees, kurtis, salwar kameez & accessories",
    productCount: 3,
    sortOrder: 1,
  },
  {
    id: "cat-2",
    name: "Men's Fashion",
    slug: "mens-fashion",
    description: "Panjabis, fotuas, shirts, trousers and traditional wear",
    productCount: 2,
    sortOrder: 2,
  },
  {
    id: "cat-3",
    name: "Groceries & Organic",
    slug: "groceries-organic",
    description: "Pure honey, mustard oil, premium tea, organic spices from Bangladesh",
    productCount: 3,
    sortOrder: 3,
  },
  {
    id: "cat-4",
    name: "Leather Goods",
    slug: "leather-goods",
    description: "Handcrafted genuine leather wallets, belts, bags and accessories",
    productCount: 2,
    sortOrder: 4,
  },
  {
    id: "cat-5",
    name: "Home & Living",
    slug: "home-living",
    description: "Handcrafted terracotta, jute rugs, bedsheets and home decor",
    productCount: 1,
    sortOrder: 5,
  },
  {
    id: "cat-6",
    name: "Eco & Jute Crafts",
    slug: "eco-jute-crafts",
    description: "Biodegradable jute bags, storage baskets and eco-friendly products",
    productCount: 1,
    sortOrder: 6,
  },
  {
    id: "cat-7",
    name: "Consumer Electronics",
    slug: "consumer-electronics",
    description: "Smart accessories, powerbanks, audio gear and phone gadgets",
    productCount: 1,
    sortOrder: 7,
  },
  {
    id: "cat-8",
    name: "Footwear",
    slug: "footwear",
    description: "Formal leather shoes, casual sandals and loafers",
    productCount: 1,
    sortOrder: 8,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    title: "Premium Silk Jamdani Saree (Navy & Gold)",
    slug: "premium-silk-jamdani-saree-navy-gold",
    sku: "JMD-SLK-001",
    barcode: "894110023401",
    shortDescription: "Authentic handwoven Dhakai Jamdani with intricate golden zari motif.",
    description:
      "Crafted by master weavers in Rupganj, Narayanganj. Features 100% fine mulberry silk with pure metallic thread work. Perfect for weddings, corporate galas, and festive Eid celebrations.",
    category: "Women's Fashion",
    brand: "Aarong Style",
    price: 14500,
    salePrice: 12500,
    costPrice: 9200,
    taxRate: 5,
    stock: 12,
    lowStockThreshold: 4,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        alt: "Navy Blue and Gold Silk Jamdani Saree",
        isMain: true,
      },
    ],
    weight: 0.65,
    seoTitle: "Authentic Dhakai Jamdani Silk Saree Online | CartX Store",
    seoDescription: "Buy authentic handloom Jamdani saree with fine silk and gold zari work. Fast delivery across Bangladesh.",
    createdAt: "2026-10-15T09:30:00.000Z",
    updatedAt: "2026-10-27T14:15:00.000Z",
  },
  {
    id: "prod-002",
    title: "Handcrafted Tangail Cotton Saree (Red & White)",
    slug: "handcrafted-tangail-cotton-saree-red-white",
    sku: "TNG-CTN-002",
    barcode: "894110023402",
    shortDescription: "Traditional breathable Taant saree for Pohela Boishakh and daily elegance.",
    description:
      "Originating from Bajitpur, Tangail. High-thread-count 100% combed cotton ensuring cooling comfort in humid weather with a rich traditional jacquard border.",
    category: "Women's Fashion",
    brand: "Tangail Weaves",
    price: 4200,
    salePrice: 3800,
    costPrice: 2400,
    taxRate: 0,
    stock: 3, // Low stock indicator
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
        alt: "Tangail Cotton Saree Red and White",
        isMain: true,
      },
    ],
    weight: 0.5,
    seoTitle: "Pure Tangail Taant Cotton Saree | CartX",
    seoDescription: "Traditional red-white Tangail cotton saree for cultural events.",
    createdAt: "2026-10-18T11:00:00.000Z",
    updatedAt: "2026-10-26T16:20:00.000Z",
  },
  {
    id: "prod-003",
    title: "Embroidered Semi-fitted Men's Panjabi (Royal Blue)",
    slug: "embroidered-semi-fitted-mens-panjabi-royal-blue",
    sku: "PNJ-EMB-003",
    barcode: "894110023403",
    shortDescription: "Mandarin collar semi-fitted viscose-cotton blend festive panjabi.",
    description:
      "Detailed tonal resham embroidery along placket and cuffs. Tailored cut with side pockets and premium engraved shell buttons.",
    category: "Men's Fashion",
    brand: "Lubnan Heritage",
    price: 3650,
    salePrice: 3250,
    costPrice: 1950,
    taxRate: 5,
    stock: 28,
    lowStockThreshold: 6,
    trackInventory: true,
    allowBackorders: true,
    status: "active",
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
        alt: "Royal Blue Embroidered Panjabi",
        isMain: true,
      },
    ],
    variants: [
      { id: "v-38", name: "Size 38 (Small)", sku: "PNJ-EMB-003-38", price: 3250, stock: 8, attributes: { size: "38" } },
      { id: "v-40", name: "Size 40 (Medium)", sku: "PNJ-EMB-003-40", price: 3250, stock: 12, attributes: { size: "40" } },
      { id: "v-42", name: "Size 42 (Large)", sku: "PNJ-EMB-003-42", price: 3250, stock: 8, attributes: { size: "42" } },
    ],
    weight: 0.4,
    createdAt: "2026-10-10T08:15:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
  },
  {
    id: "prod-004",
    title: "Organic Sylhet First-Flush Black Tea (250g)",
    slug: "organic-sylhet-first-flush-black-tea-250g",
    sku: "TEA-SYL-004",
    barcode: "894110023404",
    shortDescription: "Aromatic orthodox single-estate loose leaf tea from Sreemangal gardens.",
    description:
      "Picked in early spring from the pristine hills of Maulvibazar. Offers a golden liquor with brisk floral notes and mild astringency. Packed in an airtight tin.",
    category: "Groceries & Organic",
    brand: "Kazi & Kazi Organics",
    price: 750,
    salePrice: 650,
    costPrice: 410,
    taxRate: 0,
    stock: 85,
    lowStockThreshold: 15,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
        alt: "Sylhet Organic Black Tea Tin",
        isMain: true,
      },
    ],
    weight: 0.35,
    createdAt: "2026-10-05T14:00:00.000Z",
    updatedAt: "2026-10-24T18:00:00.000Z",
  },
  {
    id: "prod-005",
    title: "Handmade Genuine Leather Bifold Wallet (Hazaribagh)",
    slug: "handmade-genuine-leather-bifold-wallet-hazaribagh",
    sku: "WLT-LTH-005",
    barcode: "894110023405",
    shortDescription: "Top-grain cowhide leather wallet with 8 card slots and currency divider.",
    description:
      "Tanned and handcrafted in Dhaka using full-grain export-grade leather. Features RFID shielding, hand-stitched waxed nylon thread, and burnished edges that age into a vintage patina.",
    category: "Leather Goods",
    brand: "Apex Pride",
    price: 2100,
    salePrice: 1850,
    costPrice: 1100,
    taxRate: 5,
    stock: 0, // Out of stock indicator
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        alt: "Handmade Brown Leather Bifold Wallet",
        isMain: true,
      },
    ],
    weight: 0.15,
    createdAt: "2026-10-02T12:00:00.000Z",
    updatedAt: "2026-10-28T09:40:00.000Z",
  },
  {
    id: "prod-006",
    title: "Sunderbans Pure Wildflower Raw Honey (500g)",
    slug: "sunderbans-pure-wildflower-raw-honey-500g",
    sku: "HNY-SND-006",
    barcode: "894110023406",
    shortDescription: "Unfiltered, unpasteurized natural Khalisa flower mangrove honey.",
    description:
      "Ethically gathered by indigenous Mouwals in the mangrove forests of the Sundarbans. Rich in natural bee pollen, enzymes, and antioxidants with a distinct earthy sweetness.",
    category: "Groceries & Organic",
    brand: "Khaas Food",
    price: 1100,
    salePrice: 950,
    costPrice: 620,
    taxRate: 0,
    stock: 18,
    lowStockThreshold: 8,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
        alt: "Pure Raw Wildflower Honey Jar",
        isMain: true,
      },
    ],
    weight: 0.75,
    createdAt: "2026-10-12T10:00:00.000Z",
    updatedAt: "2026-10-27T11:20:00.000Z",
  },
  {
    id: "prod-007",
    title: "Traditional Clay Terracotta Dinnerware Set (12 pcs)",
    slug: "traditional-clay-terracotta-dinnerware-set-12-pcs",
    sku: "TER-SET-007",
    barcode: "894110023407",
    shortDescription: "Natural earthen clay plates, bowls and glasses baked in rural kilns.",
    description:
      "Handmade by village artisans in Kumarkhali, Kushtia. Completely non-toxic and lead-free. Brings an authentic rustic dining ambiance to your dining table.",
    category: "Home & Living",
    brand: "Kumarkhali Pottery",
    price: 4950,
    salePrice: 4500,
    costPrice: 2800,
    taxRate: 0,
    stock: 6,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-7",
        url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
        alt: "Terracotta Clay Dinnerware Set",
        isMain: true,
      },
    ],
    weight: 3.5,
    createdAt: "2026-10-08T15:20:00.000Z",
    updatedAt: "2026-10-25T13:45:00.000Z",
  },
  {
    id: "prod-008",
    title: "Fast Charging Powerbank 20000mAh (22.5W PD)",
    slug: "fast-charging-powerbank-20000mah-22-5w-pd",
    sku: "PWR-20K-008",
    barcode: "894110023408",
    shortDescription: "Dual USB-C and USB-A digital display fast charging portable battery.",
    description:
      "Aircraft-safe lithium polymer cell with smart temperature control. Supports QC 3.0 and USB Power Delivery, charging your smartphone from 0 to 50% in under 30 minutes.",
    category: "Consumer Electronics",
    brand: "Remax BD",
    price: 3100,
    salePrice: 2700,
    costPrice: 1900,
    taxRate: 7.5,
    stock: 34,
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorders: true,
    status: "active",
    images: [
      {
        id: "img-8",
        url: "https://images.unsplash.com/photo-1609592424368-80685e13589b?auto=format&fit=crop&w=600&q=80",
        alt: "High Capacity Fast Power Bank",
        isMain: true,
      },
    ],
    weight: 0.45,
    createdAt: "2026-10-14T16:00:00.000Z",
    updatedAt: "2026-10-28T12:00:00.000Z",
  },
  {
    id: "prod-009",
    title: "Artisan Jute Tote Bag (Natural Khaki)",
    slug: "artisan-jute-tote-bag-natural-khaki",
    sku: "JUT-BAG-009",
    barcode: "894110023409",
    shortDescription: "100% natural golden fiber jute grocery and shopping tote with cotton handle.",
    description:
      "Eco-conscious shopping bag made from premium Bangladesh golden fiber jute. Laminated interior for moisture resistance and reinforced stitching capable of holding up to 15kg.",
    category: "Eco & Jute Crafts",
    brand: "Golden Fiber BD",
    price: 950,
    salePrice: 850,
    costPrice: 480,
    taxRate: 0,
    stock: 2, // Low stock indicator
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-9",
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        alt: "Artisan Natural Jute Tote Bag",
        isMain: true,
      },
    ],
    weight: 0.3,
    createdAt: "2026-10-19T09:10:00.000Z",
    updatedAt: "2026-10-27T10:15:00.000Z",
  },
  {
    id: "prod-010",
    title: "Pure Cold-Pressed Mustard Oil - Ghani Chhapa (1 Liter)",
    slug: "pure-cold-pressed-mustard-oil-ghani-chhapa-1-liter",
    sku: "OIL-GHN-010",
    barcode: "894110023410",
    shortDescription: "Traditional wood-pressed pungent yellow mustard seed oil.",
    description:
      "Extracted at low temperatures using traditional wooden Kohlu/Ghani in Pabna. Retains natural pungent aroma (Jhaal), essential fatty acids, and authentic deshi flavor.",
    category: "Groceries & Organic",
    brand: "Radhuni Organics",
    price: 420,
    salePrice: 380,
    costPrice: 270,
    taxRate: 0,
    stock: 45,
    lowStockThreshold: 12,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-10",
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
        alt: "Pure Mustard Oil Glass Bottle",
        isMain: true,
      },
    ],
    weight: 1.1,
    createdAt: "2026-10-11T13:40:00.000Z",
    updatedAt: "2026-10-26T17:30:00.000Z",
  },
  {
    id: "prod-011",
    title: "Men's Genuine Leather Formal Oxford Shoes",
    slug: "mens-genuine-leather-formal-oxford-shoes",
    sku: "OXF-LTH-011",
    barcode: "894110023411",
    shortDescription: "Hand-burnished classic closed-lacing dress shoes with cushioned insole.",
    description:
      "Crafted from premium full-grain crust leather. Features Goodyear welt construction, anti-slip rubber-injected leather soles, and memory foam padding for all-day office comfort.",
    category: "Footwear",
    brand: "Bay Emporium",
    price: 5900,
    salePrice: 5400,
    costPrice: 3500,
    taxRate: 5,
    stock: 15,
    lowStockThreshold: 4,
    trackInventory: true,
    allowBackorders: false,
    status: "active",
    images: [
      {
        id: "img-11",
        url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
        alt: "Men Formal Leather Oxford Shoes",
        isMain: true,
      },
    ],
    variants: [
      { id: "v-41", name: "Size 41 (EU)", sku: "OXF-LTH-011-41", price: 5400, stock: 5, attributes: { size: "41" } },
      { id: "v-42", name: "Size 42 (EU)", sku: "OXF-LTH-011-42", price: 5400, stock: 6, attributes: { size: "42" } },
      { id: "v-43", name: "Size 43 (EU)", sku: "OXF-LTH-011-43", price: 5400, stock: 4, attributes: { size: "43" } },
    ],
    weight: 1.2,
    createdAt: "2026-10-16T10:15:00.000Z",
    updatedAt: "2026-10-28T11:00:00.000Z",
  },
  {
    id: "prod-012",
    title: "Handloom Cotton Casual Kurti (Mustard Yellow)",
    slug: "handloom-cotton-casual-kurti-mustard-yellow",
    sku: "KRT-CTN-012",
    barcode: "894110023412",
    shortDescription: "A-line comfortable daily summer wear kurti with hand-block print.",
    description:
      "Handloom Khadi cotton tunic embellished with traditional wooden block print motifs and wooden button accents. Machine washable, colorfast, and soft against the skin.",
    category: "Women's Fashion",
    brand: "Deshi Dosh",
    price: 2200,
    salePrice: 1950,
    costPrice: 1150,
    taxRate: 0,
    stock: 22,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    status: "draft", // Draft indicator
    images: [
      {
        id: "img-12",
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
        alt: "Mustard Yellow Cotton Casual Kurti",
        isMain: true,
      },
    ],
    weight: 0.35,
    createdAt: "2026-10-21T11:30:00.000Z",
    updatedAt: "2026-10-28T08:30:00.000Z",
  },
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: "mov-001",
    productId: "prod-001",
    productName: "Premium Silk Jamdani Saree (Navy & Gold)",
    sku: "JMD-SLK-001",
    type: "restock",
    quantityChange: 10,
    beforeQuantity: 2,
    afterQuantity: 12,
    reason: "Supplier batch delivery from Narayanganj workshop",
    referenceId: "PO-2026-089",
    actor: "Store Owner (Demo)",
    timestamp: "2026-10-27T14:15:00.000Z",
  },
  {
    id: "mov-002",
    productId: "prod-005",
    productName: "Handmade Genuine Leather Bifold Wallet (Hazaribagh)",
    sku: "WLT-LTH-005",
    type: "manual_correction",
    quantityChange: -3,
    beforeQuantity: 3,
    afterQuantity: 0,
    reason: "Inventory audit: 3 units reserved for verified corporate orders",
    referenceId: "AUDIT-OCT-05",
    actor: "Store Owner (Demo)",
    timestamp: "2026-10-28T09:40:00.000Z",
  },
  {
    id: "mov-003",
    productId: "prod-002",
    productName: "Handcrafted Tangail Cotton Saree (Red & White)",
    sku: "TNG-CTN-002",
    type: "damaged",
    quantityChange: -1,
    beforeQuantity: 4,
    afterQuantity: 3,
    reason: "Water stain during transit from warehouse",
    actor: "Inventory Staff",
    timestamp: "2026-10-26T16:20:00.000Z",
  },
  {
    id: "mov-004",
    productId: "prod-004",
    productName: "Organic Sylhet First-Flush Black Tea (250g)",
    sku: "TEA-SYL-004",
    type: "restock",
    quantityChange: 50,
    beforeQuantity: 35,
    afterQuantity: 85,
    reason: "Fresh seasonal harvest shipment received from Sreemangal",
    referenceId: "TEA-HARVEST-26",
    actor: "Store Admin",
    timestamp: "2026-10-24T18:00:00.000Z",
  },
];

class MockProductService {
  private memoryProducts: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  private memoryCategories: ProductCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
  private memoryMovements: InventoryMovement[] = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));

  private getStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  }

  // --- Products CRUD ---

  public getProducts(params?: ProductFilterParams): PaginatedResult<Product> {
    const allProducts = this.loadAllProducts();
    let filtered = [...allProducts];

    // Filter by search query (title, SKU, category, brand)
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (params?.category && params.category !== "all") {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    // Filter by status
    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    // Filter by stock status
    if (params?.stockStatus && params.stockStatus !== "all") {
      if (params.stockStatus === "in_stock") {
        filtered = filtered.filter((p) => p.stock > p.lowStockThreshold);
      } else if (params.stockStatus === "low_stock") {
        filtered = filtered.filter(
          (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
        );
      } else if (params.stockStatus === "out_of_stock") {
        filtered = filtered.filter((p) => p.stock === 0);
      }
    }

    // Sorting
    const sortBy = params?.sortBy || "createdAt-desc";
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "createdAt-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-asc":
          return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case "price-desc":
          return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        case "createdAt-desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Pagination
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 10);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public getProductById(id: string): Product | null {
    const products = this.loadAllProducts();
    return products.find((p) => p.id === id) || null;
  }

  public createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const products = this.loadAllProducts();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(newProduct);
    this.saveAllProducts(products);

    // If initial stock was given, log initial inventory movement
    if (newProduct.stock > 0) {
      this.recordMovement({
        id: `mov-${Date.now().toString(36)}`,
        productId: newProduct.id,
        productName: newProduct.title,
        sku: newProduct.sku,
        type: "restock",
        quantityChange: newProduct.stock,
        beforeQuantity: 0,
        afterQuantity: newProduct.stock,
        reason: "Initial inventory setup on product creation",
        actor: "Store Owner (Demo)",
        timestamp: now,
      });
    }

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const products = this.loadAllProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID "${id}" not found.`);
    }

    const current = products[index];
    const now = new Date().toISOString();
    const updatedProduct: Product = {
      ...current,
      ...updates,
      updatedAt: now,
    };

    // If stock changed directly via product edit, log movement
    if (updates.stock !== undefined && updates.stock !== current.stock) {
      const diff = updates.stock - current.stock;
      this.recordMovement({
        id: `mov-${Date.now().toString(36)}`,
        productId: current.id,
        productName: current.title,
        sku: current.sku,
        type: diff > 0 ? "restock" : "manual_correction",
        quantityChange: diff,
        beforeQuantity: current.stock,
        afterQuantity: updates.stock,
        reason: "Stock adjustment via product edit page",
        actor: "Store Owner (Demo)",
        timestamp: now,
      });
    }

    products[index] = updatedProduct;
    this.saveAllProducts(products);
    return updatedProduct;
  }

  public deleteProduct(id: string): void {
    const products = this.loadAllProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.saveAllProducts(filtered);
  }

  public archiveProduct(id: string): Product {
    return this.updateProduct(id, { status: "archived" });
  }

  public duplicateProduct(id: string): Product {
    const original = this.getProductById(id);
    if (!original) throw new Error("Product not found");

    const copyData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      ...original,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString(36)}`,
      sku: `${original.sku}-CPY`,
      status: "draft",
    };

    return this.createProduct(copyData);
  }

  public bulkArchive(ids: string[]): number {
    const products = this.loadAllProducts();
    let updatedCount = 0;
    const now = new Date().toISOString();

    const updated = products.map((p) => {
      if (ids.includes(p.id)) {
        updatedCount++;
        return { ...p, status: "archived" as const, updatedAt: now };
      }
      return p;
    });

    this.saveAllProducts(updated);
    return updatedCount;
  }

  public bulkDelete(ids: string[]): number {
    const products = this.loadAllProducts();
    const remaining = products.filter((p) => !ids.includes(p.id));
    const deletedCount = products.length - remaining.length;
    this.saveAllProducts(remaining);
    return deletedCount;
  }

  // --- Categories CRUD ---

  public getCategories(): ProductCategory[] {
    const storage = this.getStorage();
    if (!storage) {
      if (!this.memoryCategories) {
        this.memoryCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      }
      return this.memoryCategories;
    }

    try {
      const raw = storage.getItem(CATEGORIES_STORAGE_KEY);
      if (!raw) {
        storage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      }
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    }
  }

  public createCategory(data: Omit<ProductCategory, "id" | "productCount">): ProductCategory {
    const categories = this.getCategories();
    const newCategory: ProductCategory = {
      ...data,
      id: `cat-${Date.now().toString(36)}`,
      productCount: 0,
    };
    categories.push(newCategory);
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } else {
      this.memoryCategories = categories;
    }
    return newCategory;
  }

  // --- Inventory & Stock Adjustments ---

  public getInventoryStats(): InventoryOverviewStats {
    const products = this.loadAllProducts().filter((p) => p.status !== "archived");
    const movements = this.getInventoryMovements();

    let totalUnitsAvailable = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      if (p.trackInventory) {
        totalUnitsAvailable += p.stock;
        if (p.stock === 0) {
          outOfStockCount++;
        } else if (p.stock <= p.lowStockThreshold) {
          lowStockCount++;
        }
      }
    }

    return {
      totalTrackedProducts: products.filter((p) => p.trackInventory).length,
      totalUnitsAvailable,
      lowStockCount,
      outOfStockCount,
      recentAdjustmentCount: movements.length,
    };
  }

  public getInventoryItems(): InventoryItem[] {
    const products = this.loadAllProducts().filter((p) => p.status !== "archived");

    return products.map((p) => {
      let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
      if (p.stock === 0) {
        status = "out_of_stock";
      } else if (p.stock <= p.lowStockThreshold) {
        status = "low_stock";
      }

      return {
        id: p.id,
        title: p.title,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        trackInventory: p.trackInventory,
        status,
        lastAdjustedAt: p.updatedAt,
        imageUrl: p.images[0]?.url,
      };
    });
  }

  public adjustStock(adjustment: StockAdjustment): InventoryMovement {
    const product = this.getProductById(adjustment.productId);
    if (!product) {
      throw new Error(`Product not found with ID ${adjustment.productId}`);
    }

    const beforeQuantity = product.stock;
    let afterQuantity = beforeQuantity;

    switch (adjustment.type) {
      case "restock":
      case "return_restock":
        afterQuantity = beforeQuantity + Math.abs(adjustment.quantityChange);
        break;
      case "damaged":
      case "lost":
        afterQuantity = Math.max(0, beforeQuantity - Math.abs(adjustment.quantityChange));
        break;
      case "manual_correction":
        afterQuantity = Math.max(0, adjustment.quantityChange);
        break;
    }

    const actualChange = afterQuantity - beforeQuantity;
    const now = new Date().toISOString();

    // Update product stock
    this.updateProduct(product.id, {
      stock: afterQuantity,
    });

    const movement: InventoryMovement = {
      id: `mov-${Date.now().toString(36)}`,
      productId: product.id,
      productName: product.title,
      sku: product.sku,
      type: adjustment.type,
      quantityChange: actualChange,
      beforeQuantity,
      afterQuantity,
      reason: adjustment.reason,
      referenceId: adjustment.referenceId,
      note: adjustment.note,
      actor: "Store Owner (Demo)",
      timestamp: now,
    };

    this.recordMovement(movement);
    return movement;
  }

  public getInventoryMovements(): InventoryMovement[] {
    const storage = this.getStorage();
    if (!storage) {
      if (!this.memoryMovements) {
        this.memoryMovements = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
      }
      return this.memoryMovements;
    }

    try {
      const raw = storage.getItem(MOVEMENTS_STORAGE_KEY);
      if (!raw) {
        storage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_MOVEMENTS));
        return JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
      }
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
    }
  }

  private recordMovement(movement: InventoryMovement): void {
    const movements = this.getInventoryMovements();
    movements.unshift(movement);
    const storage = this.getStorage();
    if (storage) {
      // Keep most recent 100 movements
      storage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(movements.slice(0, 100)));
    } else {
      this.memoryMovements = movements.slice(0, 100);
    }
  }

  // --- Reset Demo Data ---

  public resetDemoData(): void {
    this.memoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.memoryCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.memoryMovements = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));

    const storage = this.getStorage();
    if (!storage) return;

    storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    storage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    storage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_MOVEMENTS));
  }

  // --- CSV Import / Export Utilities ---

  public exportProductsCSV(): string {
    const products = this.loadAllProducts();
    const headers = [
      "SKU",
      "Title",
      "Category",
      "Regular Price (BDT)",
      "Sale Price (BDT)",
      "Stock",
      "Low Stock Threshold",
      "Status",
      "Brand",
    ];

    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      p.salePrice ?? "",
      p.stock,
      p.lowStockThreshold,
      p.status,
      `"${p.brand ?? ""}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  public importProductsCSV(csvContent: string): { imported: number; errors: string[] } {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return { imported: 0, errors: ["CSV file is empty or missing data rows."] };
    }

    const errors: string[] = [];
    let imported = 0;
    const existing = this.loadAllProducts();
    const existingSkus = new Set(existing.map((p) => p.sku.toUpperCase()));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV splitter respecting quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) =>
        p.replace(/^"|"$/g, "").trim()
      );

      if (parts.length < 6) {
        errors.push(`Row ${i + 1}: Insufficient columns (expected at least SKU, Title, Category, Price, Stock).`);
        continue;
      }

      const [sku, title, category, priceStr, salePriceStr, stockStr] = parts;
      if (!sku || !title || !category) {
        errors.push(`Row ${i + 1}: SKU, Title, and Category are mandatory.`);
        continue;
      }

      if (existingSkus.has(sku.toUpperCase())) {
        errors.push(`Row ${i + 1}: Duplicate SKU "${sku}" already exists.`);
        continue;
      }

      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr, 10);

      if (isNaN(price) || price <= 0) {
        errors.push(`Row ${i + 1}: Invalid price "${priceStr}". Must be positive number.`);
        continue;
      }

      if (isNaN(stock) || stock < 0) {
        errors.push(`Row ${i + 1}: Invalid stock "${stockStr}". Must be non-negative integer.`);
        continue;
      }

      const salePrice = salePriceStr && !isNaN(parseFloat(salePriceStr)) ? parseFloat(salePriceStr) : undefined;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      this.createProduct({
        title,
        slug: `${slug}-${Date.now().toString(36)}`,
        sku,
        category,
        price,
        salePrice,
        stock,
        lowStockThreshold: 5,
        trackInventory: true,
        allowBackorders: false,
        status: "active",
        images: [],
      });

      existingSkus.add(sku.toUpperCase());
      imported++;
    }

    return { imported, errors };
  }

  // --- Internal Storage Helpers ---

  private loadAllProducts(): Product[] {
    const storage = this.getStorage();
    if (!storage) {
      if (!this.memoryProducts) {
        this.memoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      }
      return this.memoryProducts;
    }

    try {
      const raw = storage.getItem(PRODUCTS_STORAGE_KEY);
      if (!raw) {
        storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      }
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    }
  }

  private saveAllProducts(products: Product[]): void {
    const storage = this.getStorage();
    if (!storage) {
      this.memoryProducts = products;
      return;
    }
    storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }
}

export const mockProductService = new MockProductService();
