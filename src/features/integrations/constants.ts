import type {
  Integration,
  WebhookEndpoint,
  WebhookDeliveryAttempt,
  WebhookEvent,
} from "./types";

export const WEBHOOK_EVENT_OPTIONS: { value: WebhookEvent; label: string; description: string }[] = [
  {
    value: "order.created",
    label: "order.created",
    description: "Triggered whenever a customer successfully places a new order",
  },
  {
    value: "order.updated",
    label: "order.updated",
    description: "Triggered on fulfillment state transitions (e.g. processing, in_transit, delivered)",
  },
  {
    value: "order.cancelled",
    label: "order.cancelled",
    description: "Triggered when an order is cancelled or refunded",
  },
  {
    value: "inventory.low_stock",
    label: "inventory.low_stock",
    description: "Triggered when product inventory falls below safety reorder threshold",
  },
  {
    value: "customer.created",
    label: "customer.created",
    description: "Triggered when a new customer registers an account or checks out",
  },
  {
    value: "coupon.redeemed",
    label: "coupon.redeemed",
    description: "Triggered when a discount voucher code is successfully applied at checkout",
  },
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  // Payments
  {
    id: "int_bkash",
    name: "bKash Tokenized Checkout",
    description: "Direct tokenized payment gateway with instant OTP verification and zero manual TrxID entry",
    category: "payments",
    status: "demo_connected",
    iconEmoji: "💳",
    isEnabled: true,
    configuredAt: "2026-10-15T10:00:00.000Z",
    lastActivityAt: "2026-10-29T14:30:00.000Z",
    configFields: [
      { key: "merchant_id", label: "Merchant Mobile Number", type: "text", value: "01711000000", placeholder: "01XXXXXXXXX" },
      { key: "environment", label: "Mode", type: "select", value: "sandbox", options: [{ label: "Sandbox (Test)", value: "sandbox" }, { label: "Live Production", value: "live" }] },
    ],
    demoMode: true,
  },
  {
    id: "int_nagad",
    name: "Nagad Direct Checkout",
    description: "Accept mobile wallet payments via Bangladesh Post Office Nagad digital payment gateway",
    category: "payments",
    status: "demo_connected",
    iconEmoji: "📱",
    isEnabled: true,
    configuredAt: "2026-10-16T11:00:00.000Z",
    lastActivityAt: "2026-10-28T16:00:00.000Z",
    configFields: [
      { key: "merchant_id", label: "Nagad Merchant ID", type: "text", value: "6829104", placeholder: "Merchant Account ID" },
      { key: "environment", label: "Mode", type: "select", value: "sandbox", options: [{ label: "Sandbox (Test)", value: "sandbox" }, { label: "Live Production", value: "live" }] },
    ],
    demoMode: true,
  },
  {
    id: "int_sslcommerz",
    name: "SSLCommerz Payment Gateway",
    description: "Aggregate gateway accepting Visa, Mastercard, AMEX, and Bangladeshi internet banking",
    category: "payments",
    status: "demo_connected",
    iconEmoji: "🏦",
    isEnabled: true,
    configuredAt: "2026-10-17T12:00:00.000Z",
    lastActivityAt: "2026-10-28T11:00:00.000Z",
    configFields: [
      { key: "store_id", label: "SSL Store ID", type: "text", value: "cartx_test_store", placeholder: "Store ID" },
      { key: "environment", label: "Mode", type: "select", value: "sandbox", options: [{ label: "Sandbox (Test)", value: "sandbox" }, { label: "Live Production", value: "live" }] },
    ],
    demoMode: true,
  },
  {
    id: "int_cod",
    name: "Cash on Delivery (COD)",
    description: "Nationwide COD fulfillment engine with automated courier consignment booking",
    category: "payments",
    status: "demo_connected",
    iconEmoji: "💵",
    isEnabled: true,
    configuredAt: "2026-10-15T09:00:00.000Z",
    lastActivityAt: "2026-10-29T15:00:00.000Z",
    configFields: [],
    demoMode: true,
  },

  // Shipping
  {
    id: "int_steadfast",
    name: "Steadfast Courier Network",
    description: "Doorstep parcel delivery and next-day COD remittance across all 64 Bangladesh districts",
    category: "shipping",
    status: "demo_connected",
    iconEmoji: "🚚",
    isEnabled: true,
    configuredAt: "2026-10-18T10:00:00.000Z",
    lastActivityAt: "2026-10-29T12:00:00.000Z",
    configFields: [
      { key: "client_code", label: "Steadfast Client Code", type: "text", value: "ST-88902", placeholder: "Client Code" },
      { key: "pickup_hub", label: "Default Warehouse Hub", type: "select", value: "dhaka_central", options: [{ label: "Dhaka Central Hub", value: "dhaka_central" }, { label: "Chattogram Hub", value: "chattogram_hub" }] },
    ],
    demoMode: true,
  },
  {
    id: "int_pathao",
    name: "Pathao Courier Merchant API",
    description: "Fast on-demand intra-city deliveries in Dhaka and express nationwide parcel shipping",
    category: "shipping",
    status: "demo_connected",
    iconEmoji: "🏍️",
    isEnabled: true,
    configuredAt: "2026-10-18T14:00:00.000Z",
    lastActivityAt: "2026-10-29T10:00:00.000Z",
    configFields: [
      { key: "store_code", label: "Pathao Store Code", type: "text", value: "PTH-9102", placeholder: "Store ID" },
    ],
    demoMode: true,
  },
  {
    id: "int_redx",
    name: "RedX Delivery Logistics",
    description: "Doorstep delivery, parcel returns tracking, and integrated cash reconciliation",
    category: "shipping",
    status: "demo_connected",
    iconEmoji: "📦",
    isEnabled: true,
    configuredAt: "2026-10-19T09:00:00.000Z",
    lastActivityAt: "2026-10-27T17:00:00.000Z",
    configFields: [
      { key: "client_id", label: "RedX Client ID", type: "text", value: "RDX-4421", placeholder: "Client Identifier" },
    ],
    demoMode: true,
  },

  // Marketing & Analytics
  {
    id: "int_ga4",
    name: "Google Analytics 4 (GA4)",
    description: "E-commerce event telemetry, traffic attribution, and conversion funnel tracking",
    category: "analytics",
    status: "disconnected",
    iconEmoji: "📊",
    isEnabled: false,
    configFields: [
      { key: "measurement_id", label: "Measurement ID", type: "text", placeholder: "G-XXXXXXXXXX", required: true },
      { key: "api_secret", label: "API Secret Key Placeholder", type: "text", placeholder: "whsec_••••••••••••••••••••••••" },
    ],
    demoMode: true,
  },
  {
    id: "int_meta_pixel",
    name: "Meta Pixel (Facebook)",
    description: "Track Add to Cart, Initiate Checkout, and Purchase events for Facebook dynamic ads",
    category: "marketing",
    status: "disconnected",
    iconEmoji: "🎯",
    isEnabled: false,
    configFields: [
      { key: "pixel_id", label: "Meta Dataset / Pixel ID", type: "text", placeholder: "e.g. 123456789012345", required: true },
    ],
    demoMode: true,
  },
  {
    id: "int_gtm",
    name: "Google Tag Manager",
    description: "Inject client container tags and custom third-party marketing script pixels",
    category: "analytics",
    status: "disconnected",
    iconEmoji: "🏷️",
    isEnabled: false,
    configFields: [
      { key: "container_id", label: "GTM Container ID", type: "text", placeholder: "GTM-XXXXXXX", required: true },
    ],
    demoMode: true,
  },

  // Notifications
  {
    id: "int_email_smtp",
    name: "Transactional Email Relay",
    description: "Connect custom SMTP relays or SendGrid/SES for branded invoice and order receipts",
    category: "notifications",
    status: "disconnected",
    iconEmoji: "✉️",
    isEnabled: false,
    configFields: [
      { key: "smtp_host", label: "SMTP Server Host", type: "text", placeholder: "smtp.sendgrid.net" },
      { key: "from_email", label: "From Sender Address", type: "text", placeholder: "orders@yourstore.com.bd" },
    ],
    demoMode: true,
  },
  {
    id: "int_sms_bangladesh",
    name: "Bulk SMS Bangladesh Gateway",
    description: "Send automated Bengali SMS delivery notifications and OTP verification via local telcos",
    category: "notifications",
    status: "disconnected",
    iconEmoji: "💬",
    isEnabled: false,
    configFields: [
      { key: "sender_id", label: "Approved Masking Sender ID", type: "text", placeholder: "CARTX_BD" },
      { key: "api_key", label: "API Key Placeholder", type: "text", placeholder: "••••••••••••••••" },
    ],
    demoMode: true,
  },

  // Storefront
  {
    id: "int_custom_webhook",
    name: "Custom ERP / Webhook Bridge",
    description: "Dispatch real-time JSON payloads to your private inventory ERP or accounting system",
    category: "storefront",
    status: "disconnected",
    iconEmoji: "🔌",
    isEnabled: false,
    configFields: [
      { key: "endpoint_url", label: "Destination Server URL", type: "text", placeholder: "https://erp.yourstore.com/api/orders" },
    ],
    demoMode: true,
  },
];

export const INITIAL_WEBHOOK_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: "wh_001",
    url: "https://api.greenharvest.com.bd/webhooks/orders",
    description: "Primary warehouse fulfillment listener for incoming confirmed sales",
    events: ["order.created", "order.updated"],
    isActive: true,
    secretPlaceholder: "whsec_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
    createdAt: "2026-10-15T10:00:00.000Z",
    updatedAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "wh_002",
    url: "https://inventory-sync.cartx.internal/hooks/stock",
    description: "Automated warehouse reorder trigger on stock threshold breach",
    events: ["inventory.low_stock"],
    isActive: false,
    secretPlaceholder: "whsec_1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c",
    createdAt: "2026-10-18T12:00:00.000Z",
    updatedAt: "2026-10-25T09:00:00.000Z",
  },
];

export const INITIAL_WEBHOOK_DELIVERIES: WebhookDeliveryAttempt[] = [
  {
    id: "del_101",
    webhookId: "wh_001",
    webhookUrl: "https://api.greenharvest.com.bd/webhooks/orders",
    event: "order.created",
    status: "simulated_success",
    statusCode: 200,
    responseTime: 142,
    payload: {
      event: "order.created",
      orderNumber: "CTX-1001",
      customer: "Tanvir Ahmed",
      grandTotal: 12560,
      currency: "BDT",
    },
    attemptedAt: "2026-10-29T14:30:15.000Z",
    retryCount: 0,
  },
  {
    id: "del_102",
    webhookId: "wh_001",
    webhookUrl: "https://api.greenharvest.com.bd/webhooks/orders",
    event: "order.updated",
    status: "simulated_success",
    statusCode: 200,
    responseTime: 188,
    payload: {
      event: "order.updated",
      orderNumber: "CTX-1002",
      fulfillmentStatus: "in_transit",
      courier: "Steadfast",
    },
    attemptedAt: "2026-10-29T11:15:30.000Z",
    retryCount: 0,
  },
  {
    id: "del_103",
    webhookId: "wh_001",
    webhookUrl: "https://api.greenharvest.com.bd/webhooks/orders",
    event: "order.cancelled",
    status: "simulated_failure",
    statusCode: 504,
    responseTime: 5000,
    payload: {
      event: "order.cancelled",
      orderNumber: "CTX-1006",
      reason: "Customer changed mind prior to dispatch",
    },
    attemptedAt: "2026-10-28T16:00:00.000Z",
    retryCount: 2,
  },
  {
    id: "del_104",
    webhookId: "wh_002",
    webhookUrl: "https://inventory-sync.cartx.internal/hooks/stock",
    event: "inventory.low_stock",
    status: "simulated_success",
    statusCode: 201,
    responseTime: 95,
    payload: {
      event: "inventory.low_stock",
      sku: "JMD-SLK-001",
      currentStock: 3,
      threshold: 5,
    },
    attemptedAt: "2026-10-28T10:00:00.000Z",
    retryCount: 0,
  },
];

export const SAMPLE_WEBHOOK_PAYLOADS: Record<WebhookEvent, Record<string, unknown>> = {
  "order.created": {
    event: "order.created",
    timestamp: "2026-11-03T10:00:00.000Z",
    storeId: "store_green_harvest_01",
    data: {
      id: "ord-1001",
      orderNumber: "CTX-1001",
      customer: {
        id: "cust-001",
        name: "Tanvir Ahmed",
        phone: "+8801711223344",
        city: "Dhaka",
      },
      items: [
        {
          sku: "JMD-SLK-001",
          title: "Premium Silk Jamdani Saree",
          quantity: 1,
          price: 12500,
        },
      ],
      pricing: {
        subtotal: 12500,
        shippingFee: 60,
        discount: 0,
        grandTotal: 12560,
        currency: "BDT",
      },
      payment: {
        method: "cod",
        status: "unpaid",
      },
    },
  },
  "order.updated": {
    event: "order.updated",
    timestamp: "2026-11-03T10:15:00.000Z",
    data: {
      orderNumber: "CTX-1001",
      orderStatus: "processing",
      fulfillmentStatus: "ready_to_ship",
      consignmentTracking: "ST-88902-1001",
    },
  },
  "order.cancelled": {
    event: "order.cancelled",
    timestamp: "2026-11-03T10:30:00.000Z",
    data: {
      orderNumber: "CTX-1006",
      cancellationReason: "Customer requested cancellation prior to pickup",
      inventoryRestocked: true,
    },
  },
  "inventory.low_stock": {
    event: "inventory.low_stock",
    timestamp: "2026-11-03T10:45:00.000Z",
    data: {
      productId: "prod-001",
      sku: "JMD-SLK-001",
      productTitle: "Premium Silk Jamdani Saree",
      inventoryQuantity: 3,
      lowStockThreshold: 5,
    },
  },
  "customer.created": {
    event: "customer.created",
    timestamp: "2026-11-03T11:00:00.000Z",
    data: {
      customerId: "cust-009",
      name: "Sabrina Hossain",
      phone: "+8801719998877",
      city: "Dhaka",
      segment: "new",
    },
  },
  "coupon.redeemed": {
    event: "coupon.redeemed",
    timestamp: "2026-11-03T11:15:00.000Z",
    data: {
      couponCode: "EID2026",
      discountAmount: 200,
      orderNumber: "CTX-1008",
    },
  },
};

