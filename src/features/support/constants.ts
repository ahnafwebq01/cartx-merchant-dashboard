import type { HelpArticle, FAQItem, SupportTicket } from "./types";

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "art_01",
    slug: "bkash-tokenized-checkout-setup",
    title: "Configuring bKash Tokenized Checkout & Merchant Credentials",
    category: "payments",
    categoryLabel: "Payment Gateways",
    summary: "Step-by-step guide to obtaining bKash PGW App Key, Secret, and Merchant username for 1-click tokenized checkout in Bangladesh.",
    content: `
### Overview
bKash Tokenized Checkout allows customers on your CartX storefront to authorize 1-click payments without entering their wallet PIN every time.

### Prerequisites
1. An active bKash Merchant Account registered with bKash Commercial Sales.
2. Verified Merchant App Key, Secret Key, and API Username issued by bKash PGW.
3. Callback URL registered in your merchant onboarding profile.

### Step-by-Step Configuration
1. Navigate to **Payments & Finance > Payment Methods** in your CartX Dashboard.
2. Select **bKash Tokenized Checkout** and click **Configure**.
3. Set Environment to **Sandbox** for initial checkout testing, or **Live** for real order payments.
4. Input your \`App Key\`, \`Secret Key\`, and \`Merchant Username\`.
5. Save changes. Run a test transaction of ৳10 to ensure instant payment confirmation.
    `.trim(),
    readTimeMinutes: 4,
    tags: ["bKash", "Payments", "Tokenized", "MFS", "Checkout"],
    lastUpdated: "2026-10-28T10:00:00.000Z",
  },
  {
    id: "art_02",
    slug: "steadfast-pathao-courier-automation",
    title: "Automating Courier Consignments with Steadfast & Pathao APIs",
    category: "couriers",
    categoryLabel: "Shipping & Logistics",
    summary: "Integrate Bangladesh's leading parcel delivery couriers to automatically generate tracking codes and schedule warehouse pickups.",
    content: `
### Why Automate Couriers?
Eliminate manual copy-pasting of delivery addresses into courier portals. With CartX, order statuses transition to \`Shipped\` and dispatch consignments automatically.

### Integrating Steadfast Courier
1. Obtain your API Key and Secret Key from the Steadfast Merchant Portal.
2. In CartX Dashboard, go to **Shipping & Logistics > Courier Integrations**.
3. Toggle Steadfast Courier and enter your API Key.
4. Choose default pickup warehouse address (e.g., Banani, Dhaka hub).

### Integrating Pathao Courier
1. Log into your Pathao Merchant panel and generate client credentials under Developer Settings.
2. Enter Client ID, Client Secret, and Store ID into CartX.
3. Once linked, you can book consignments in 1-click from the Order Details screen.
    `.trim(),
    readTimeMinutes: 5,
    tags: ["Steadfast", "Pathao", "Shipping", "Logistics", "Courier"],
    lastUpdated: "2026-10-30T14:00:00.000Z",
  },
  {
    id: "art_03",
    slug: "custom-domain-dns-instructions",
    title: "Connecting Custom Domains & Managing DNS Records in Bangladesh",
    category: "storefront",
    categoryLabel: "Storefront & Domains",
    summary: "Connect your branded \`.com.bd\` or \`.com\` domain to CartX with zero downtime and automatic TLS/SSL certificate issuance.",
    content: `
### Custom Domain Routing
Every CartX store receives a default \`storename.cartx.com.bd\` address. To establish brand trust, connect your custom top-level domain.

### Required DNS Records
Log in to your domain registrar (e.g., BTCL for .com.bd, Namecheap, Cloudflare) and configure:

- **CNAME Record**: Host \`@\` or \`www\` pointing to \`proxy.cartx.com.bd\`
- **A Record** (if CNAME flattening is unsupported): Host \`@\` pointing to \`76.76.21.21\`

### SSL Certificate Issuance
Once DNS records propagate across Bangladesh nameservers (typically 15 minutes to 4 hours), CartX automatically provisions a 2048-bit Let's Encrypt SSL certificate.
    `.trim(),
    readTimeMinutes: 3,
    tags: ["Domain", "DNS", "SSL", "Storefront", "BTCL"],
    lastUpdated: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "art_04",
    slug: "managing-team-rbac-permissions",
    title: "Managing Team Roles & Granular RBAC Permissions",
    category: "team_billing",
    categoryLabel: "Team & Security",
    summary: "Enforce strict least-privilege security by assigning specialized roles to order handlers, inventory managers, and accountants.",
    content: `
### Built-in Role Hierarchy
CartX provides 8 purpose-built merchant roles:
- **Store Owner**: Authoritative access across all operations, billing, and ownership settings.
- **Store Administrator**: Operational manager across catalog, orders, and marketing (excludes billing).
- **Order Manager**: Focus on packing, courier consignments, and customer delivery updates.
- **Inventory Manager**: Adjust warehouse inventory and track restock ledgers.
- **Accountant**: Access financial transactions, payment ledgers, and refund requests.

### Custom Permissions
You can override or supplement any team member's permissions by checking granular permission scopes in the Invite or Edit Member modal.
    `.trim(),
    readTimeMinutes: 4,
    tags: ["Team", "RBAC", "Roles", "Permissions", "Security"],
    lastUpdated: "2026-11-02T08:00:00.000Z",
  },
  {
    id: "art_05",
    slug: "launching-flash-sales-drops",
    title: "Launching Timed Flash Sales Drops with Inventory Quotas",
    category: "marketing",
    categoryLabel: "Marketing & Discounts",
    summary: "Drive promotional urgency during Eid or seasonal campaigns using live countdown tickers and allocated inventory reserves.",
    content: `
### Flash Sales Engine
A Flash Sale drop combines a special promotional price, a strict time-box (e.g. 24 hours), and an allocated stock ceiling.

### Best Practices for Ramadan & Eid Drops
1. Allocate a specific quantity (e.g., 50 units) to prevent overselling.
2. Verify that promotional price is strictly lower than your regular catalog price.
3. CartX displays a real-time claimed percentage bar and countdown clock to shoppers on your storefront.
    `.trim(),
    readTimeMinutes: 3,
    tags: ["Flash Sales", "Promotions", "Eid", "Marketing"],
    lastUpdated: "2026-10-25T11:00:00.000Z",
  },
  {
    id: "art_06",
    slug: "understanding-cod-courier-settlements",
    title: "Understanding COD (Cash on Delivery) Settlements & Courier Deductions",
    category: "payments",
    categoryLabel: "Payment Gateways",
    summary: "Master the financial reconciliation between customer Cash on Delivery payments and courier remittance payouts in Bangladesh.",
    content: `
### COD Logistics in Bangladesh
Over 70% of e-commerce transactions in Bangladesh occur via Cash on Delivery (COD). Courier partners collect cash from the shopper upon delivery.

### Courier Remittance Cycle
1. Courier collects total order value (Product Price + Delivery Charge).
2. Courier deducts standard delivery fee (e.g., ৳60 inside Dhaka, ৳120 outside) plus 1% COD processing fee.
3. Courier deposits net proceeds into your bank or bKash merchant wallet weekly or bi-weekly.
4. CartX tracks transaction statuses from \`Pending Collection\` to \`Settled\`.
    `.trim(),
    readTimeMinutes: 5,
    tags: ["COD", "Cash on Delivery", "Courier", "Settlement", "Finance"],
    lastUpdated: "2026-10-27T16:00:00.000Z",
  },
  {
    id: "art_07",
    slug: "exporting-reports-rfc4180-csv",
    title: "Exporting Order Ledgers & Promotion Reports to RFC-4180 CSV",
    category: "marketing",
    categoryLabel: "Analytics & Reports",
    summary: "Download structured spreadsheets compatible with Microsoft Excel, Google Sheets, and Bengali UTF-8 encoding.",
    content: `
### UTF-8 BOM Compatibility
CartX exports CSV files with a native UTF-8 Byte Order Mark (\`\\uFEFF\`). This ensures that product names, customer addresses, and amounts written in Bengali script render properly without character corruption in Excel.

### Available Ledgers
- Product Sales Ledger under Promotions
- Campaign ROI Summary
- Coupon Redemption Frequency
- Automatic Discounts Ledger
    `.trim(),
    readTimeMinutes: 2,
    tags: ["Reports", "CSV", "Excel", "UTF-8", "Export"],
    lastUpdated: "2026-11-01T15:00:00.000Z",
  },
  {
    id: "art_08",
    slug: "cartx-subscription-tiers-invoicing",
    title: "CartX Subscription Tiers, Usage Limits, and VAT Invoicing",
    category: "team_billing",
    categoryLabel: "Team & Security",
    summary: "Detailed overview of CartX Starter, Growth, and Pro tiers, auto-renewal billing cycles, and NBR tax invoices.",
    content: `
### Subscription Tiers
- **Starter (৳999/mo)**: 50 products, 2 staff accounts, 200 orders/mo.
- **Growth (৳2,499/mo)**: 500 products, 5 staff accounts, 1,000 orders/mo, 1 custom domain.
- **Pro (৳5,999/mo)**: Unlimited products, 15 staff accounts, unlimited orders, 3 custom domains.

### Invoicing & Bangladesh NBR Compliance
All paid subscription fees generate an instant downloadable invoice complete with CartX BD Ltd. BIN and merchant tax details.
    `.trim(),
    readTimeMinutes: 3,
    tags: ["Subscription", "Billing", "Invoices", "Limits", "SaaS"],
    lastUpdated: "2026-11-02T10:00:00.000Z",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq_01",
    question: "How do I upgrade or downgrade my CartX subscription plan?",
    answer: "Go to Subscription & Billing > Plans & Pricing. Select your desired tier (Starter, Growth, or Pro) and choose between Monthly or Annual billing. The plan updates immediately.",
    category: "Billing & Subscriptions",
  },
  {
    id: "faq_02",
    question: "Are there any platform transaction commissions on customer sales?",
    answer: "No. CartX charges 0% platform transaction fees across all plans. You only pay standard gateway processing fees to your payment provider (such as bKash 1.2% or SSLCommerz 2.5%).",
    category: "Billing & Subscriptions",
  },
  {
    id: "faq_03",
    question: "Can I connect multiple courier services simultaneously?",
    answer: "Yes! CartX allows you to connect both Steadfast and Pathao simultaneously. You can choose which courier handles each individual parcel during order fulfillment.",
    category: "Couriers & Delivery",
  },
  {
    id: "faq_04",
    question: "What happens if a customer refuses a Cash on Delivery (COD) order?",
    answer: "When a courier marks a parcel returned/failed, you can transition the CartX order to Returned. The inventory items are automatically restocked into your warehouse.",
    category: "Couriers & Delivery",
  },
  {
    id: "faq_05",
    question: "How can I invite an accountant with view-only finance access?",
    answer: "Go to Team & Access > Team Members. Click Invite Member, enter their email, and select the 'Accountant / Finance' role. They will have access to transactions and refunds without catalog editing rights.",
    category: "General & Account",
  },
  {
    id: "faq_06",
    question: "Does CartX support custom .com.bd domains?",
    answer: "Yes, you can register your .com.bd domain with BTCL and point the DNS CNAME record to proxy.cartx.com.bd. CartX will automatically generate a free SSL certificate.",
    category: "General & Account",
  },
  {
    id: "faq_07",
    question: "How do refunds work with bKash and Nagad payments?",
    answer: "You can initiate a refund from Payments & Finance > Refunds. Once approved, the refund instruction is recorded in your ledger and settled back to the shopper's wallet.",
    category: "Payments & Refunds",
  },
  {
    id: "faq_08",
    question: "How do I contact emergency priority support if my checkout is down?",
    answer: "Pro plan subscribers have access to a 24/7 emergency priority telephone hotline. Growth and Starter merchants can submit an Urgent ticket via Support Center.",
    category: "General & Account",
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "TCK-1048",
    subject: "Steadfast Courier API webhook delay during Eid peak",
    category: "shipping",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-11-01T14:30:00.000Z",
    updatedAt: "2026-11-02T09:15:00.000Z",
    lastReplyBy: "support_agent",
    messages: [
      {
        id: "msg_1048_1",
        ticketId: "TCK-1048",
        sender: "merchant",
        senderName: "Kamrul Hasan (Order Manager)",
        message: "We noticed that approximately 14 consignments dispatched via Steadfast yesterday afternoon took over 3 hours to update to 'In Transit' in the dashboard. Is there an API rate-limit during festival peak traffic?",
        createdAt: "2026-11-01T14:30:00.000Z",
      },
      {
        id: "msg_1048_2",
        ticketId: "TCK-1048",
        sender: "support_agent",
        senderName: "Tanvir Hasan",
        senderRole: "CartX Logistics Support Lead",
        message: "Hello Kamrul, thank you for reaching out. Steadfast's central webhook relay experienced a temporary queuing backlog between 2:00 PM and 5:00 PM yesterday. All webhooks were processed with zero lost parcels. We have increased our webhook consumer buffer.",
        createdAt: "2026-11-01T16:45:00.000Z",
      },
      {
        id: "msg_1048_3",
        ticketId: "TCK-1048",
        sender: "support_agent",
        senderName: "Tanvir Hasan",
        senderRole: "CartX Logistics Support Lead",
        message: "We are keeping this ticket In Progress for the next 24 hours to monitor your consignment sync closely. Please let us know if any parcel tracking status appears delayed today.",
        createdAt: "2026-11-02T09:15:00.000Z",
      },
    ],
  },
  {
    id: "TCK-1045",
    subject: "Custom domain DNS CNAME validation assistance",
    category: "technical",
    priority: "medium",
    status: "resolved",
    createdAt: "2026-10-30T11:00:00.000Z",
    updatedAt: "2026-10-30T17:20:00.000Z",
    lastReplyBy: "merchant",
    messages: [
      {
        id: "msg_1045_1",
        ticketId: "TCK-1045",
        sender: "merchant",
        senderName: "Tariqul Islam (Owner)",
        message: "We added 'greenharvest.com.bd' as our custom domain but BTCL DNS changes seemed to show verification pending for about an hour. Could you check if the CNAME target is correct?",
        createdAt: "2026-10-30T11:00:00.000Z",
      },
      {
        id: "msg_1045_2",
        ticketId: "TCK-1045",
        sender: "support_agent",
        senderName: "Afsana Parveen",
        senderRole: "CartX Infrastructure Engineer",
        message: "Hi Tariqul, BTCL DNS propagation in Bangladesh generally requires between 2 to 4 hours to replicate across local ISPs. We inspected your DNS query and confirmed the CNAME record is now resolving accurately. SSL certificate generation has finished.",
        createdAt: "2026-10-30T14:10:00.000Z",
      },
      {
        id: "msg_1045_3",
        ticketId: "TCK-1045",
        sender: "merchant",
        senderName: "Tariqul Islam (Owner)",
        message: "Confirmed! The storefront is now loading flawlessly on greenharvest.com.bd with active padlock icon. Thank you!",
        createdAt: "2026-10-30T17:20:00.000Z",
      },
    ],
  },
  {
    id: "TCK-1039",
    subject: "bKash Tokenized refund settlement inquiry",
    category: "payments",
    priority: "low",
    status: "closed",
    createdAt: "2026-10-25T10:15:00.000Z",
    updatedAt: "2026-10-26T12:00:00.000Z",
    lastReplyBy: "support_agent",
    messages: [
      {
        id: "msg_1039_1",
        ticketId: "TCK-1039",
        sender: "merchant",
        senderName: "Farhana Yasmin",
        message: "When approving a customer refund of ৳850 for returned organic tea, how long does bKash take to credit the customer's wallet?",
        createdAt: "2026-10-25T10:15:00.000Z",
      },
      {
        id: "msg_1039_2",
        ticketId: "TCK-1039",
        sender: "support_agent",
        senderName: "Tanvir Hasan",
        senderRole: "CartX Payments Specialist",
        message: "bKash Tokenized refunds are processed instantly (typically within 10 to 30 seconds) directly back to the customer's original bKash wallet number. A confirmation SMS is sent by bKash to the customer.",
        createdAt: "2026-10-26T12:00:00.000Z",
      },
    ],
  },
  {
    id: "TCK-1052",
    subject: "Request for automated SMS notification credits",
    category: "feature_request",
    priority: "low",
    status: "open",
    createdAt: "2026-11-02T11:00:00.000Z",
    updatedAt: "2026-11-02T11:00:00.000Z",
    lastReplyBy: "merchant",
    messages: [
      {
        id: "msg_1052_1",
        ticketId: "TCK-1052",
        sender: "merchant",
        senderName: "Shamima Akhter (Admin)",
        message: "We would love an option to top up local Bangladesh SMS credits directly inside the CartX dashboard for branded order confirmation SMS (e.g. via Greenweb or Onnorokom SMS gateway).",
        createdAt: "2026-11-02T11:00:00.000Z",
      },
    ],
  },
];

