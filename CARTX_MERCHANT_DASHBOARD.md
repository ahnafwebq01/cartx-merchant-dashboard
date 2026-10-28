# CARTX MERCHANT DASHBOARD

## Complete Product Requirements, Dashboard Structure, UI/UX, Functional Specification & Developer Handoff

**Document Version:** 1.0
**Status:** Proposed Development Baseline
**Product:** CartX — E-commerce SaaS Platform
**Module:** Merchant Dashboard
**Target Market:** Bangladesh
**Primary Currency:** BDT (৳)
**Primary Language:** বাংলা ও English
**Frontend Repository:** `cartx-merchant-dashboard`
**Backend:** Shared CartX API
**Platform Type:** Multi-Tenant SaaS
**Document Audience:** Product Designer, Frontend Developer, Backend Developer, QA Engineer, Google Antigravity AI Agent

*Prepared by WebQ — Where problems get solved. | 01410767729 | www.webq.com.bd | info@webq.com.bd | Suite 2A, Building No 8, Road No 8, Block B, Section 13, Mirpur, Dhaka - 1216*

---

## 1. Project Overview

### 1.1 What Is the CartX Merchant Dashboard?

CartX Merchant Dashboard হলো একটি centralized business management panel, যেখানে একজন merchant তার online store তৈরি, customize এবং পরিচালনা করতে পারবে।

Merchant-কে আলাদা আলাদা software ব্যবহার না করে একই dashboard থেকে তার e-commerce business-এর গুরুত্বপূর্ণ কাজগুলো সম্পন্ন করতে হবে।

Dashboard থেকে merchant পারবে:

- Online store create ও configure করতে।
- Product, category, variant, SKU ও inventory manage করতে।
- Customer order receive, process, cancel ও fulfill করতে।
- Customer information এবং order history দেখতে।
- Payment, refund এবং transaction track করতে।
- Courier delivery ও shipment manage করতে।
- Discount, coupon এবং promotional campaign চালাতে।
- Sales, revenue, product performance এবং customer analytics দেখতে।
- Team member তৈরি ও permission control করতে।
- Store theme, domain, SEO এবং website content configure করতে।
- CartX subscription, billing এবং usage limits manage করতে।
- প্রয়োজনে White-label mobile app service configure বা request করতে।

### 1.2 Product Objective

Merchant Dashboard-এর মূল লক্ষ্য হবে:

1. Technical knowledge ছাড়াই online store পরিচালনা করা।
2. Product থেকে order delivery পর্যন্ত workflow সহজ করা।
3. Sales, inventory এবং payment-এর তথ্য একটি জায়গায় রাখা।
4. Bangladesh-এর local payment ও courier workflow support করা।
5. ছোট ব্যবসা থেকে growing e-commerce brand পর্যন্ত scale করা।
6. Merchant-এর প্রয়োজন অনুযায়ী subscription-based feature access দেওয়া।
7. Desktop, tablet ও mobile browser-এ ব্যবহারযোগ্য interface তৈরি করা।

### 1.3 Product Boundary

CartX-এর বিভিন্ন application-এর দায়িত্ব পরিষ্কারভাবে আলাদা রাখতে হবে।

| Application | Primary Responsibility |
|---|---|
| CartX Public Website | Product information, pricing, marketing, demo ও lead generation |
| CartX Merchant Dashboard | Store owner-এর business management |
| CartX Online Storefront | Merchant-এর public-facing shopping website |
| CartX Super Admin | CartX platform, tenants, subscriptions ও platform-level control |
| CartX Backend API | Business logic, authentication, authorization, data processing |
| CartX Merchant Mobile App | Merchant-এর mobile-based business operations |
| CartX Customer Mobile App | Customer shopping experience, যদি আলাদা app product হিসেবে চালু করা হয় |

> **Important:** Merchant Dashboard-এ Super Admin-এর platform-wide control থাকবে না। Merchant নিজের store পরিচালনা করবে, CartX-এর অন্য merchant বা tenant-এর private data নয়।

---

## 2. Technology Stack & Architecture

### 2.1 Recommended Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js + TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide |
| Forms | React Hook Form + Zod |
| Server State | TanStack Query অথবা সমমানের API-state solution |
| Charts | Recharts অথবা সমমানের chart library |
| Backend | Shared Express.js + TypeScript API |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache & Queues | Redis + BullMQ |
| File Storage | S3-compatible object storage বা Cloudinary |
| Authentication | Secure session বা short-lived access token + refresh strategy |
| Notifications | In-app notifications; email/SMS provider integration as configured |
| Testing | Vitest/Jest, React Testing Library, Playwright |
| Deployment | Docker, Nginx, VPS, Cloudflare/CDN |

Technology versions development শুরু করার সময় compatible এবং actively supported version অনুযায়ী নির্ধারণ করতে হবে।

### 2.2 Architecture Principles

- Merchant Dashboard হবে একটি পৃথক frontend application।
- Backend API হবে shared service; আলাদা duplicate business backend তৈরি করা যাবে না।
- Business logic frontend-এ implement করে security-এর বিকল্প হিসেবে ব্যবহার করা যাবে না।
- Database query, order calculation, discount calculation এবং stock validation backend-এ authoritative হবে।
- Frontend-এ reusable UI components এবং feature-based module structure রাখতে হবে।
- Initial architecture হবে modular monolith; শুরুতেই unnecessary microservices তৈরি করা যাবে না।
- Long-running tasks যেমন bulk product import, export ও notification processing background jobs-এ চালানো উচিত।
- Merchant-specific data সবসময় authenticated tenant/store context অনুযায়ী filter করতে হবে।

### 2.3 Environment Configuration

Development, staging এবং production environment আলাদা রাখতে হবে।

Environment variables-এর উদাহরণ:

```env
NEXT_PUBLIC_APP_NAME=CartX
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=
```

Secret API keys, database credentials, private payment credentials বা server-side secrets কখনো `NEXT_PUBLIC_` variable-এ রাখা যাবে না।

Production URL, cookie domain, CORS, storage configuration এবং payment callback URLs deployment অনুযায়ী নির্ধারণ করতে হবে।

---

## 3. Merchant Roles & Permission System

CartX Merchant Dashboard-এ একই store-এর একাধিক team member থাকতে পারবে। প্রত্যেকের permission role অনুযায়ী নিয়ন্ত্রিত হবে।

### 3.1 Default Roles

#### A. Store Owner

Store-এর সর্বোচ্চ merchant-level authority।

Permissions:

- Store settings ও profile management।
- Products, orders, customers এবং inventory management।
- Team member invite ও permissions management।
- Subscription, billing এবং plan changes।
- Payment এবং courier integrations।
- Domain, theme এবং storefront settings।
- Reports ও analytics।
- Store transfer বা account closure-এর মতো sensitive actions, policy অনুযায়ী।

#### B. Store Admin

Owner-এর অনুমোদিত business operations পরিচালনা করবে।

- Product, category ও inventory management।
- Order processing।
- Customer management।
- Marketing management।
- Reports access, granted permission অনুযায়ী।
- Owner-only billing বা ownership actions default-ভাবে restricted।

#### C. Order Manager

- Order list ও details দেখা।
- Order status update করা।
- Invoice ও packing slip তৈরি করা।
- Shipment তৈরি এবং tracking update করা।
- Return/cancellation workflow পরিচালনা করা, assigned permissions অনুযায়ী।

#### D. Product Manager

- Product create, edit ও archive।
- Category, variant, SKU ও product images management।
- Inventory adjustment request বা update, permission অনুযায়ী।
- Bulk import/export।

#### E. Inventory Manager

- Stock levels দেখা।
- Stock adjustment ও stock movement records।
- Low-stock monitoring।
- Inventory report।
- Inventory valuation access, granted permission অনুযায়ী।

#### F. Marketing Manager

- Coupon ও discount management।
- Campaign setup।
- Marketing pixels এবং tracking configuration, অনুমোদিত scope অনুযায়ী।
- Campaign analytics।

#### G. Accountant

- Orders-এর financial summary।
- Payment transaction ও refund records।
- Settlement/payout records, integration অনুযায়ী।
- Sales, tax এবং financial reports।
- Permission ছাড়া order items বা customer private information export করতে পারবে না।

#### H. Support Staff

- Customer information-এর প্রয়োজনীয় সীমিত অংশ।
- Order details ও support-related notes।
- অনুমোদিত order update।
- Sensitive payment credentials, billing settings বা full financial reports access নয়।

### 3.2 Custom Roles & Permissions

Future-ready permission model-এ individual permissions configure করা যাবে।

Permission examples:

- `products.view`
- `products.create`
- `products.update`
- `products.archive`
- `inventory.view`
- `inventory.adjust`
- `orders.view`
- `orders.update_status`
- `orders.cancel`
- `refunds.request`
- `refunds.approve`
- `customers.view`
- `customers.export`
- `discounts.manage`
- `reports.view`
- `storefront.manage`
- `integrations.manage`
- `team.manage`
- `billing.manage`

Backend প্রতিটি protected action-এর permission যাচাই করবে। শুধু sidebar item hide করে access control নিশ্চিত হয়েছে—এমন ধরা যাবে না।

---

## 4. Complete Merchant Dashboard Sitemap

নিচের menu structure হলো proposed baseline। Plan অনুযায়ী কোনো feature unavailable হলে সেটিকে disabled/upgrade-required অবস্থায় দেখানো যেতে পারে; তবে সব menu item বাস্তবে functional বা clearly labelled হতে হবে।

### 4.1 Primary Sidebar Navigation

#### 01. Overview

- Dashboard Home
- Sales Overview
- Recent Activity

#### 02. Sales & Orders

- All Orders
- New / Unfulfilled Orders
- Order Processing
- Completed Orders
- Cancelled Orders
- Returns & Refunds
- Abandoned Checkouts, যদি checkout tracking implement করা হয়
- Draft Orders, যদি manual order feature চালু থাকে

#### 03. Products

- All Products
- Add New Product
- Categories
- Collections
- Product Variants
- Brands
- Product Reviews
- Bulk Import
- Bulk Export

#### 04. Stocks & Inventory

- Inventory Overview
- Stock by Product
- Stock by Location, যদি multi-location inventory support থাকে
- Stock Adjustments
- Stock Movement History
- Low Stock
- Out of Stock
- Purchase Orders, যদি supplier purchasing module implement করা হয়
- Suppliers, যদি supplier management চালু থাকে

#### 05. Customers

- All Customers
- Customer Details
- Customer Groups
- Customer Tags
- Customer Notes
- Customer Import / Export
- Customer Segments, যদি supported হয়

#### 06. Payments & Finance

- Payment Transactions
- Payment Methods
- Refund Requests
- Payouts / Settlements, provider support অনুযায়ী
- Financial Summary
- Tax Settings
- Payment Reconciliation, যদি প্রয়োজনীয় transaction data available থাকে

#### 07. Shipping & Delivery

- Shipping Dashboard
- Shipping Zones & Rates
- Courier Integrations
- Create Shipment
- Shipment Tracking
- Delivery Status
- Delivery Exceptions
- Shipping Labels
- Delivery Reports

#### 08. Marketing & Promotions

- Coupons
- Automatic Discounts
- Campaigns
- Flash Sales
- Free Shipping Offers
- Gift Cards, যদি implement করা হয়
- Referral Program, যদি implement করা হয়
- Marketing Pixels
- SEO & Social Sharing
- Marketing Analytics

#### 09. Online Store

- Store Overview
- Theme & Customization
- Theme Library
- Navigation & Menus
- Pages
- Homepage Sections
- Blog, যদি supported হয়
- Domain Management
- SSL Status
- SEO Settings
- Store Preferences
- Password / Maintenance Mode, policy অনুযায়ী

#### 10. Analytics & Reports

- Sales Analytics
- Orders Report
- Products Report
- Inventory Report
- Customer Report
- Marketing Report
- Payment Report
- Shipping Report
- Date-wise Reports
- Export Reports

#### 11. Apps & Integrations

- App Marketplace
- Installed Apps
- Payment Integrations
- Courier Integrations
- Analytics Integrations
- Social Commerce Integrations, যদি available হয়
- Webhooks / API Access, plan এবং permission অনুযায়ী

#### 12. Mobile App

- Mobile App Overview
- App Branding
- App Configuration
- App Build / Publishing Status
- App Update Status
- Push Notifications
- App Service Requests
- App Subscription / Additional Charges, যদি service চালু থাকে

#### 13. Team & Access

- Team Members
- Invite Member
- Roles & Permissions
- Login Activity
- Security Settings

#### 14. Subscription & Billing

- Current Plan
- Plan Comparison
- Upgrade / Downgrade
- Billing History
- Invoices
- Payment Methods
- Usage & Limits
- Renewal Status
- Cancel Subscription

#### 15. Support & Resources

- Help Center
- Getting Started Guide
- Tutorials
- Support Tickets
- Contact Support
- System Status
- Feature Requests

#### 16. Settings

- Store Profile
- Business Information
- Store Contact Details
- Store Location
- Currency & Locale
- Language
- Time Zone
- Order Settings
- Checkout Settings
- Customer Account Settings
- Notification Preferences
- Legal & Policy Pages
- Data Export
- Account Security
- Store Deactivation / Closure

**Sidebar rules:**

- Role-based visibility থাকতে হবে।
- Current page active state পরিষ্কার হতে হবে।
- Collapsible groups এবং nested navigation থাকতে হবে।
- Small screens-এ drawer navigation ব্যবহার করতে হবে।
- Searchable navigation future enhancement হিসেবে রাখা যেতে পারে।
- Feature unavailable হলে plan-aware upgrade state দেখাতে হবে।
- Store context switcher শুধু user একাধিক authorized store-এ access পেলে দেখাতে হবে।

---

## 5. Global Dashboard Layout & UI/UX

### 5.1 Main Layout

Dashboard layout-এ নিচের elements থাকবে:

1. Left sidebar।
2. Top header।
3. Breadcrumb navigation।
4. Current store selector, applicable হলে।
5. Global search, supported entities-এর জন্য।
6. Notification center।
7. Help/support shortcut।
8. Profile menu।
9. Main page content।
10. Contextual actions, যেমন Add Product বা Create Order।

### 5.2 Recommended Color System

| Purpose | Color |
|---|---|
| Primary | `#2563EB` |
| Primary Hover | `#1D4ED8` |
| Accent / Sky | `#38BDF8` |
| Main Text | `#0F172A` |
| Secondary Text | `#64748B` |
| Page Background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |
| Info | `#0284C7` |

Color ব্যবহার করার পাশাপাশি status label, icon এবং accessible contrast ব্যবহার করতে হবে। শুধু red/green color দিয়ে critical state বোঝানো যাবে না।

### 5.3 Typography

- Recommended font: Inter।
- Bangla content-এর জন্য Noto Sans Bengali অথবা সমমানের readable font।
- Page title, section title এবং body text-এর hierarchy consistent রাখতে হবে।
- BDT amount ও tabular financial values সহজে scan করা যায় এমনভাবে render করতে হবে।

### 5.4 Reusable Components

সকল page-এ reusable components তৈরি করতে হবে:

- `DashboardLayout`
- `Sidebar`
- `Topbar`
- `Breadcrumbs`
- `PageHeader`
- `StatCard`
- `DataTable`
- `FilterBar`
- `SearchInput`
- `DateRangePicker`
- `StatusBadge`
- `ConfirmDialog`
- `FormDialog`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `Pagination`
- `BulkActionToolbar`
- `FileUploader`
- `ImageUploader`
- `CurrencyDisplay`
- `PermissionGuard`
- `UpgradePrompt`
- `NotificationCenter`

একই ধরনের component বিভিন্ন module-এ duplicate করা যাবে না; প্রয়োজন অনুযায়ী shared component extend করতে হবে।

---

## 6. Dashboard Home — Overview Page

**Route:** `/dashboard`

এটি login করার পর merchant-এর প্রধান landing page হবে।

### 6.1 Welcome Header

Show:

- "Welcome back" message।
- Store name।
- Current date।
- Store status: Active, Setup Incomplete, Suspended বা অন্য valid state।
- Primary action: View Store।
- Secondary action: Add Product।
- Date range selector।

### 6.2 KPI Cards

Recommended cards:

1. Total Sales
2. Total Orders
3. Average Order Value
4. Total Customers
5. Pending Orders
6. Low Stock Products
7. Successful Payments, যদি reliable payment status data থাকে
8. Store Conversion Rate, শুধু প্রয়োজনীয় analytics data থাকলে

প্রতিটি KPI card-এ থাকবে:

- Metric value।
- Selected date range।
- Previous period comparison, যেখানে valid।
- Tooltip বা explanation।
- Optional mini trend chart।

**Calculation rules:**

- Total Sales-এর definition পরিষ্কার হতে হবে—gross sales, net sales, refunds ও cancellations কীভাবে ধরা হবে।
- Order count এবং paid order count এক জিনিস নয়।
- Cancelled order-কে active sales হিসেবে গণনা করা যাবে না।
- Conversion rate গণনার জন্য reliable sessions ও conversion event data থাকতে হবে; না থাকলে metric hide করতে হবে।
- Refund ও tax treatment financial reporting policy অনুযায়ী নির্ধারণ করতে হবে।

### 6.3 Sales Chart

Show:

- Date-wise sales trend।
- Orders trend।
- Daily/weekly/monthly view।
- Tooltip-এ date, sales value ও order count।
- Empty period হলে zero data এবং no-data state।

### 6.4 Recent Orders

Columns:

- Order ID
- Customer
- Order Date
- Payment Status
- Fulfillment Status
- Total Amount
- Action

Quick actions permission অনুযায়ী:

- View Order
- Process Order
- Create Shipment

### 6.5 Best-Selling Products

Show:

- Product thumbnail।
- Product name।
- Units sold।
- Sales amount।
- Stock remaining।
- Product details shortcut।

### 6.6 Inventory Alerts

Show:

- Low stock items।
- Out of stock items।
- Stock alert threshold।
- Update stock action।

### 6.7 Setup Checklist

New merchant-এর জন্য onboarding checklist:

- Store profile complete।
- First product added।
- Product image uploaded।
- Payment method configured।
- Shipping method configured।
- Store theme selected।
- Storefront preview checked।
- Store published।

প্রতিটি checklist item real system state থেকে derive হবে; শুধু button click করলেই completed দেখানো যাবে না।

### 6.8 Activity Feed

Examples:

- Product added।
- Order received।
- Order fulfilled।
- Payment received।
- Inventory adjusted।
- Team member invited।
- Subscription renewed।

Activity records actor, action, timestamp এবং relevant entity reference সহ সংরক্ষণ করতে হবে।

---

## 7. Store Onboarding & Setup Wizard

**Routes:** `/onboarding`, `/onboarding/store`, `/onboarding/products`, `/onboarding/payments`, `/onboarding/shipping`

### 7.1 Onboarding Flow

#### Step 1 — Account & Store Identity

- Store name
- Store slug
- Business type
- Owner name
- Contact email
- Phone number

#### Step 2 — Business Information

- Business address
- District
- City / area
- Postal code, applicable হলে
- Business category
- Business identification fields, প্রয়োজন ও policy অনুযায়ী

#### Step 3 — Storefront Setup

- Theme selection
- Logo upload
- Brand color
- Store description
- Homepage preview

#### Step 4 — Add Products

- Product name
- Product price
- Initial stock
- Product image
- Category

#### Step 5 — Payment Setup

- Cash on Delivery configuration
- Supported online payment provider connection
- Provider credentials-এর secure setup, applicable হলে
- Test/live status indication

#### Step 6 — Delivery Setup

- Shipping zones
- Shipping charges
- Free shipping threshold, optional
- Courier connection, optional

#### Step 7 — Preview & Publish

- Store preview
- Required setup validation
- Publish confirmation
- Storefront URL

### 7.2 Onboarding Requirements

- Progress save হতে হবে।
- Merchant পরে এসে onboarding continue করতে পারবে।
- Required steps complete না হলে relevant reason দেখাতে হবে।
- Optional integrations না করলেও basic store creation সম্ভব হবে।
- Payment/courier connection ব্যর্থ হলে error এবং retry option থাকবে।
- Merchant-এর অনুমতি ছাড়া store public করে দেওয়া যাবে না, যদি product policy explicit opt-in require করে।
- Onboarding completion status backend-এ persist করতে হবে।

---

## 8. Order Management

**Base Route:** `/dashboard/orders`

Order management হবে dashboard-এর অন্যতম প্রধান module।

### 8.1 Order List Page

#### Table Columns

- Checkbox
- Order Number
- Order Date
- Customer
- Item Count
- Payment Method
- Payment Status
- Fulfillment Status
- Total Amount
- Assigned Staff, optional
- Actions

#### Filters

- Date range
- Order status
- Payment status
- Fulfillment status
- Courier
- Payment method
- Customer
- Amount range

#### Search

Search by:

- Order ID
- Customer name
- Phone number
- Tracking number
- Product name, প্রয়োজন অনুযায়ী

#### Bulk Actions

- Mark as processing
- Export orders
- Print invoices
- Assign staff
- Cancel selected orders, confirmation ও validation সহ

Bulk action-এর প্রতিটি order-এর জন্য backend permission ও status validation করতে হবে। Invalid orders skip করলে কোনগুলো skip হয়েছে এবং কেন—তা জানাতে হবে।

### 8.2 Order Status Model

Order lifecycle-এ নিচের status ব্যবহার করা যেতে পারে:

- `pending`
- `confirmed`
- `processing`
- `ready_to_ship`
- `shipped`
- `delivered`
- `cancelled`
- `returned`
- `partially_returned`, যদি partial return support থাকে

এগুলোকে payment status-এর সঙ্গে গুলিয়ে ফেলা যাবে না।

#### Payment Status

- `unpaid`
- `pending`
- `paid`
- `partially_refunded`, applicable হলে
- `refunded`
- `failed`
- `partially_paid`, applicable হলে

#### Fulfillment Status

- `unfulfilled`
- `partially_fulfilled`
- `fulfilled`

প্রতিটি status transition backend state machine বা equivalent business validation দিয়ে নিয়ন্ত্রিত হবে।

### 8.3 Order Details Page

**Route:** `/dashboard/orders/[orderId]`

#### Section A — Header

- Order number
- Order creation date
- Current status
- Payment status
- Print invoice
- More actions

#### Section B — Customer Information

- Customer name
- Phone number
- Email, provided হলে
- Billing address
- Shipping address
- Customer order history shortcut

Customer private data শুধুমাত্র authorized users দেখতে পারবে।

#### Section C — Ordered Products

- Product image
- Product name
- SKU
- Selected variant
- Quantity
- Unit price
- Discount
- Line total

#### Section D — Price Breakdown

- Subtotal
- Product discount
- Coupon discount
- Shipping charge
- Tax, applicable হলে
- Other explicitly defined fees
- Grand total
- Amount paid
- Amount due
- Refund amount

Frontend এবং backend-এর calculation একই business rules অনুসরণ করবে; backend response হবে authoritative।

#### Section E — Payment Information

- Payment method
- Transaction reference
- Payment status
- Paid amount
- Provider response reference, safe fields only
- Refund history

Full card credentials, secret tokens বা sensitive provider credentials কখনো প্রদর্শন করা যাবে না।

#### Section F — Delivery

- Courier name
- Tracking ID
- Shipping label
- Pickup request status
- Shipment tracking history
- Delivery fee
- Delivery exception

#### Section G — Internal Notes & Timeline

- Order events
- Status changes
- Payment updates
- Shipment events
- Staff notes
- Actor ও timestamp

Internal notes customer-facing notification-এ পাঠানো যাবে না।

### 8.4 Order Processing Workflow

1. Customer storefront থেকে order place করে।
2. Backend order এবং line items persist করে।
3. Stock reservation/deduction policy অনুযায়ী inventory update হয়।
4. Merchant notification পায়।
5. Merchant order details review করে।
6. প্রয়োজন হলে customer confirmation নেয়।
7. Order processing শুরু করে।
8. Packing সম্পন্ন হলে shipment তৈরি করে।
9. Courier integration থাকলে shipment request পাঠায়।
10. Courier accepted response এবং tracking ID save হয়।
11. Delivery status webhook বা authorized manual update দিয়ে sync হয়।
12. Delivered status হলে order timeline update হয়।
13. Return/refund হলে আলাদা workflow চালু হয়।

প্রতিটি ধাপে idempotency, retry এবং failure recovery plan থাকতে হবে। Courier request duplicate হলে duplicate shipment তৈরি হওয়া আটকাতে হবে।

### 8.5 Cancellation, Returns & Refunds

- Cancellation reason required হতে পারে।
- Refund eligibility order/payment state অনুযায়ী validate করতে হবে।
- Refund request, approved refund এবং provider-confirmed refund আলাদা state হবে।
- Stock restock policy স্পষ্টভাবে নির্ধারণ করতে হবে।
- Partial refund বা partial return শুধু implement করা থাকলে দেখাতে হবে।
- Refund provider support না করলে unsupported action দেখানো যাবে না।
- Financial adjustment-এর audit trail রাখতে হবে।

---

## 9. Product Management

**Base Route:** `/dashboard/products`

### 9.1 Product List

Columns:

- Image
- Product Name
- SKU
- Category
- Price
- Stock
- Status
- Updated Date
- Actions

Filters:

- Category
- Product status
- Stock status
- Price range
- Product type
- Creation date

Actions:

- View
- Edit
- Duplicate
- Archive
- Delete, only when safe and allowed
- Publish / Unpublish

যেসব product existing order-এ reference হিসেবে ব্যবহৃত হয়েছে, সেগুলো hard-delete না করে archive করা উচিত।

### 9.2 Add / Edit Product

**Routes:** `/dashboard/products/new`, `/dashboard/products/[productId]/edit`

#### Section A — Basic Information

- Product title
- URL slug
- Short description
- Full description
- Product type
- Brand
- Category
- Collections
- Tags

#### Section B — Media

- Main image
- Additional images
- Image reorder
- Alt text
- Upload progress
- Image validation

Image uploads storage provider-এর মাধ্যমে হবে; database-এ file URL/key এবং metadata রাখতে হবে। Upload permissions ও file type/size validation প্রয়োজন।

#### Section C — Pricing

- Regular price
- Sale price
- Cost per item, permission অনুযায়ী
- Tax category, applicable হলে
- Discount scheduling, যদি supported হয়

Prices floating-point arithmetic দিয়ে হিসাব করা যাবে না। Database এবং backend-এ suitable decimal/money representation ব্যবহার করতে হবে।

#### Section D — Inventory

- SKU
- Barcode, optional
- Track inventory toggle
- Available quantity
- Low-stock threshold
- Allow backorders, policy অনুযায়ী
- Stock location, multi-location support থাকলে

#### Section E — Variants

Examples:

- Size
- Color
- Material

Each variant may have:

- Variant name
- SKU
- Price
- Image
- Stock quantity
- Barcode
- Availability status

Variant combination, duplicate SKU policy এবং stock management backend-এ validate করতে হবে।

#### Section F — Shipping

- Physical product indicator
- Weight
- Dimensions, applicable হলে
- Shipping class, if supported

#### Section G — SEO

- SEO title
- Meta description
- URL slug
- Social preview image
- Search engine visibility

#### Section H — Publishing

- Draft
- Active
- Archived
- Schedule publication, যদি supported হয়

### 9.3 Product Categories

Features:

- Create category
- Edit category
- Category image
- Category description
- Parent category, যদি hierarchy supported হয়
- SEO metadata
- Product count
- Sort order

Circular parent-category relationships আটকাতে হবে। Category delete করলে associated products-এর handling আগে নির্ধারণ করতে হবে।

### 9.4 Collections

Collections product group করার জন্য ব্যবহার হবে।

Examples:

- New Arrivals
- Best Sellers
- Eid Collection
- Summer Collection

Manual collections first release-এ যথেষ্ট হতে পারে। Automated collections future phase-এ রাখা যেতে পারে, যদি rules-based filtering implement করার প্রয়োজন হয়।

### 9.5 Product Import / Export

Import formats:

- CSV
- Supported spreadsheet format, যদি প্রয়োজন হয়

Requirements:

- Downloadable sample template
- Column mapping
- Validation preview
- Duplicate SKU detection
- Invalid rows-এর error report
- Import progress
- Retry strategy
- Import job history

Large imports synchronous HTTP request-এ process না করে background queue ব্যবহার করতে হবে।

---

## 10. Stocks & Inventory Management

**Base Route:** `/dashboard/inventory`

### 10.1 Inventory Overview

Cards:

- Total Tracked Products
- Total Units Available
- Low Stock Products
- Out of Stock Products
- Recent Adjustments

Inventory value দেখানো হলে cost data completeness এবং valuation method পরিষ্কার করতে হবে।

### 10.2 Stock Table

Columns:

- Product
- Variant
- SKU
- Available
- Reserved
- Incoming, if supported
- Reorder Threshold
- Stock Status
- Last Updated

Available stock এবং reserved stock আলাদা রাখতে হবে।

Suggested model:

```
Available to Sell = On-hand Stock - Reserved Stock
```

এই formula তখনই প্রয়োগ হবে যখন reservation model implemented এবং operational policy নির্ধারিত থাকবে।

### 10.3 Stock Adjustment

Fields:

- Product/variant
- Adjustment type
- Quantity change
- Reason
- Reference ID, optional
- Internal note

Adjustment types:

- Restock
- Damaged
- Lost
- Manual correction
- Return restock

প্রতিটি adjustment-এর জন্য actor, before quantity, after quantity, reason এবং timestamp রাখতে হবে। সাধারণ user-এর direct database editing বা unlogged quantity update গ্রহণযোগ্য নয়।

### 10.4 Inventory History

- Date
- Product
- SKU
- Change type
- Quantity before/after
- Actor
- Reason
- Related order/reference

### 10.5 Inventory Concurrency

একই product-এর শেষ unit একাধিক customer কিনতে চাইলে backend transaction, locking বা equivalent concurrency-safe strategy দিয়ে overselling control করতে হবে।

CartX-এর order creation, cancellation এবং return workflow inventory rules-এর সঙ্গে consistent হতে হবে।

---

## 11. Customer Management

**Base Route:** `/dashboard/customers`

### 11.1 Customer List

Columns:

- Customer Name
- Phone
- Email
- Total Orders
- Total Spend
- Last Order
- Customer Tags
- Created Date

Filters:

- Order count
- Spend range
- Last order date
- Tags
- Customer group

### 11.2 Customer Details

Sections:

- Profile
- Contact information
- Addresses
- Order history
- Total spending
- Refund/return history, permitted হলে
- Internal notes
- Customer tags
- Marketing consent status

Sensitive information role-based access এবং applicable privacy rules অনুযায়ী নিয়ন্ত্রিত হবে।

### 11.3 Customer Groups & Segments

Possible groups:

- New Customers
- Repeat Customers
- High-Value Customers
- Inactive Customers

Automated segments implement করা হলে rules এবং refresh behavior documentation-এ উল্লেখ করতে হবে।

### 11.4 Customer Communication

Future-ready architecture-এ customer notifications এবং campaign tools থাকতে পারে।

Requirements:

- Consent-aware messaging।
- Opt-out preferences।
- Delivery status।
- Provider failure handling।
- SMS/email cost tracking, applicable হলে।

Bulk marketing communication-এর জন্য valid consent এবং applicable law/policy অনুসরণ করতে হবে।

---

## 12. Payments & Finance

**Base Route:** `/dashboard/payments`

### 12.1 Payment Methods

Possible Bangladesh payment options:

- Cash on Delivery (COD)
- bKash
- Nagad
- Rocket
- SSLCommerz
- Other approved gateways

Provider support, account eligibility, API credentials, commercial approval এবং testing অনুযায়ী integration চালু হবে। শুধু UI-তে provider-এর নাম থাকলেই integration complete বলা যাবে না।

### 12.2 Payment Integration Setup

প্রতিটি provider-এর জন্য:

- Connect / Configure
- Provider account status
- Sandbox / Live environment
- Credential validation
- Test transaction, provider support থাকলে
- Callback/webhook status
- Last synchronization
- Disconnect / reconnect workflow

Secret credentials encrypted server-side storage-এ রাখতে হবে। Secret credential client-side response, logs বা browser storage-এ প্রকাশ করা যাবে না।

### 12.3 Transaction List

Columns:

- Transaction ID
- Order ID
- Customer
- Provider
- Amount
- Status
- Created Date
- Reference ID

Status:

- Pending
- Successful
- Failed
- Refunded
- Partially Refunded, applicable হলে

### 12.4 Financial Summary

Show:

- Gross sales
- Discounts
- Refunds
- Shipping charges
- Taxes, applicable হলে
- Net sales
- Payment fees, provider data available থাকলে
- Settlement amount, provider support অনুযায়ী

সব financial metric-এর definition documented হতে হবে। Revenue, order value, cash collected এবং gateway settlement একই metric নয়।

### 12.5 Refunds

- Refund eligibility check
- Refund amount
- Reason
- Approval, if required
- Provider request
- Provider confirmation
- Refund timeline

Refund API request-এ idempotency এবং retry protection থাকতে হবে।

---

## 13. Shipping & Courier Management

**Base Route:** `/dashboard/shipping`

### 13.1 Shipping Configuration

- Shipping zones
- District/area-based rules
- Inside-city rate
- Outside-city rate
- Weight-based charges, if supported
- Free shipping threshold
- Flat-rate shipping
- Product-specific shipping, if supported

একাধিক shipping rule overlap করলে কোন rule apply হবে তা deterministic হতে হবে।

### 13.2 Courier Integrations

Possible providers:

- Pathao
- Steadfast
- RedX
- eCourier

Integration availability ও exact feature support provider API access এবং CartX implementation-এর উপর নির্ভর করবে।

### 13.3 Courier Connection Page

Show:

- Provider name
- Connection status
- Credential configuration
- Test connection
- Default pickup address
- Service availability, API support অনুযায়ী
- COD collection settings, provider support অনুযায়ী
- Last sync status

### 13.4 Shipment Creation

Required fields:

- Order reference
- Recipient name
- Phone
- Delivery address
- Area/district
- Parcel description
- Weight, if required
- COD amount, applicable হলে
- Pickup location

Before creating shipment, validate order state, customer details এবং courier-required fields।

### 13.5 Shipment Tracking

- Tracking number
- Courier
- Current status
- Status history
- Delivery attempts, if available
- Exception reason
- Last sync time

Webhook signature validation, duplicate event handling এবং provider retry behavior implement করতে হবে।

---

## 14. Marketing & Promotions

**Base Route:** `/dashboard/marketing`

### 14.1 Coupons

Fields:

- Coupon code
- Discount type: fixed amount / percentage
- Discount value
- Minimum order amount
- Maximum discount, percentage coupon-এর জন্য
- Start date
- Expiry date
- Usage limit
- Per-customer usage limit
- Applicable products/categories
- Customer eligibility
- Active / inactive status

Backend-এ coupon validation করতে হবে। Frontend price display-এর উপর নির্ভর করে order total নির্ধারণ করা যাবে না।

### 14.2 Automatic Discounts

যদি implemented হয়:

- Minimum spend
- Product-specific discount
- Category-specific discount
- Buy X Get Y
- Free shipping

Multiple discounts একসঙ্গে apply হবে কি না, priority এবং stacking rules স্পষ্টভাবে define করতে হবে।

### 14.3 Campaigns

- Campaign name
- Start/end dates
- Products included
- Discount configuration
- Campaign status
- Performance summary

### 14.4 Analytics & Tracking

Possible integrations:

- Google Analytics
- Google Tag Manager
- Meta Pixel

Tracking configuration-এ consent, duplicate events, event validation এবং provider-specific limitations বিবেচনা করতে হবে।

Merchant একাধিকবার script inject করে duplicate purchase events তৈরি করতে পারবে না। Tracking scripts safe, controlled integration mechanism দিয়ে manage করতে হবে।

---

## 15. Online Store & Storefront Customization

**Base Route:** `/dashboard/store`

Merchant Dashboard storefront management করবে; actual customer-facing website আলাদা Storefront application বা theme rendering system থেকে পরিচালিত হতে পারে।

### 15.1 Store Overview

Show:

- Store name
- Store URL
- Store status
- Theme name
- Published state
- Domain status
- View Store
- Customize Store

### 15.2 Theme Library

Features:

- Theme gallery
- Theme preview
- Select theme
- Apply theme
- Customize theme
- Publish changes

Theme apply করার আগে preview এবং confirmation থাকা উচিত। Previous configuration restore করার ব্যবস্থা future enhancement হিসেবে রাখা যেতে পারে।

### 15.3 Theme Customization

Merchant configurable fields:

- Logo
- Favicon
- Brand colors
- Typography options
- Homepage sections
- Banner images
- Featured categories
- Featured products
- Footer links
- Social media links
- Contact details

Theme configuration schema-based হতে হবে। Merchant-এর arbitrary code injection বা unsafe HTML execution default-ভাবে allow করা যাবে না।

### 15.4 Pages & Navigation

- About Us
- Contact Us
- Privacy Policy
- Terms & Conditions
- Return / Refund Policy
- Shipping Policy
- Custom pages, if supported

Features:

- Create/edit page
- Slug
- Publish/unpublish
- Navigation menu management
- SEO metadata

### 15.5 Domain Management

- Default CartX subdomain
- Custom domain entry
- DNS instructions
- Verification status
- SSL status
- Primary domain selection
- Connection error details

Custom domain provisioning backend infrastructure-এর মাধ্যমে validate করতে হবে। DNS/SSL status verified না হলে Connected বা Secure দেখানো যাবে না।

### 15.6 Store Publishing

- Preview changes
- Publish
- Unpublish, permission/policy অনুযায়ী
- Current publishing state
- Publication error

Draft configuration ও live configuration আলাদা রাখা যেতে পারে, যাতে incomplete edits সরাসরি live store-এ না যায়।

---

## 16. Analytics & Reports

**Base Route:** `/dashboard/analytics`

### 16.1 Common Filters

- Date range
- Compare previous period
- Product
- Category
- Payment method
- Order status
- Sales channel, if supported

### 16.2 Sales Analytics

Metrics:

- Gross sales
- Net sales
- Discounts
- Refunds
- Order count
- Average order value

### 16.3 Product Analytics

- Best-selling products
- Low-performing products
- Units sold
- Sales by product/category
- Product return rate, if reliable data exists

### 16.4 Customer Analytics

- New customers
- Repeat customers
- Customer order frequency
- Average customer spend
- Returning customer share

### 16.5 Inventory Reports

- Stock on hand
- Low stock
- Out of stock
- Stock adjustments
- Inventory movement history

### 16.6 Marketing Reports

- Coupon usage
- Campaign sales
- Campaign conversion, if event data is available
- Marketing source attribution, if reliably implemented

### 16.7 Report Export

- CSV export
- Excel export, if supported
- PDF reports, if needed

Large exports background job হিসেবে process করতে হবে। Export link authenticated, time-limited এবং tenant-scoped হতে হবে।

---

## 17. Apps & Integrations

**Base Route:** `/dashboard/apps`

### 17.1 Integration Marketplace

প্রতিটি integration card-এ:

- Name
- Logo
- Description
- Category
- Availability status
- Plan requirements
- Connect / Configure button
- Documentation link

### 17.2 Integration Categories

- Payments
- Shipping & Courier
- Analytics
- Marketing
- Communication
- Accounting
- Store extensions

### 17.3 Integration Lifecycle

1. Merchant integration নির্বাচন করে।
2. Requirements এবং permissions দেখে।
3. Configuration complete করে।
4. Backend connection verify করে।
5. Integration status Active হয়।
6. Errors ও sync history monitor করে।
7. প্রয়োজনে disconnect করে।

Integration secret এবং provider-specific configuration securely store করতে হবে। Disconnect করলে related tokens revoke/delete করার policy define করতে হবে।

---

## 18. White-Label Mobile App Management

**Base Route:** `/dashboard/mobile-app`

CartX যদি merchant-দের নিজস্ব branding-সহ mobile application service দেয়, তাহলে এই module ব্যবহার হবে।

### 18.1 App Overview

- App service status
- App name
- Android/iOS support status
- Branding status
- Build status
- Publishing status
- Latest release
- Pending merchant actions

### 18.2 Branding Configuration

- App name
- Logo
- App icon
- Splash screen
- Brand colors
- Store URL / tenant configuration
- Contact information
- Push notification preferences

### 18.3 Build & Publishing Workflow

Possible states:

- Not Requested
- Configuration Incomplete
- Requested
- In Review
- Building
- Build Failed
- Ready for Merchant Review
- Submitted
- Published
- Update Required

প্রতিটি state actual service workflow থেকে আসতে হবে। CartX integration বা publishing access না থাকলে status manually fake করা যাবে না।

### 18.4 Important Publishing Requirements

- Merchant-এর app store developer account ownership policy স্পষ্ট করতে হবে।
- Apple/Google review approval guarantee করা যাবে না।
- App publishing, maintenance, renewal ও additional charges থাকলে আগে থেকেই জানাতে হবে।
- App update request এবং build version history রাখতে হবে।
- Push notifications-এর consent এবং permission requirements অনুসরণ করতে হবে।

---

## 19. Team & Access Management

**Base Route:** `/dashboard/team`

### 19.1 Team Members

Columns:

- Name
- Email
- Role
- Invitation Status
- Last Active
- Actions

### 19.2 Invite Team Member

Fields:

- Name, optional
- Email
- Role
- Custom permissions, applicable হলে
- Invitation expiry

Workflow:

1. Owner/Admin invite পাঠায়।
2. Backend secure invitation token তৈরি করে।
3. Member invitation গ্রহণ করে।
4. Account verify করে।
5. Role ও permissions কার্যকর হয়।

### 19.3 Security

- Remove member
- Revoke invitations
- Change role
- Revoke active sessions, if supported
- Audit sensitive changes

শেষ owner-কে remove করা বা store-কে ownerless করে দেওয়ার মতো invalid operation আটকাতে হবে।

---

## 20. Subscription & Billing

**Base Route:** `/dashboard/billing`

### 20.1 Subscription Overview

Show:

- Current plan
- Subscription status
- Start date
- Renewal date
- Plan limits
- Usage
- Upgrade / downgrade options

### 20.2 Plan Limits

Examples:

- Product limit
- Staff account limit
- Order limit, if applicable
- Storage limit
- Theme access
- Integration access
- Custom domain availability
- Mobile app availability

Plan limits backend-এ enforce করতে হবে। Frontend warning দেখানো alone যথেষ্ট নয়।

### 20.3 Billing History

Columns:

- Invoice number
- Billing date
- Plan
- Amount
- Payment status
- Download invoice

### 20.4 Subscription Lifecycle

- Trial
- Active
- Payment Pending
- Past Due
- Suspended
- Cancelled
- Expired

Exact lifecycle এবং access policy CartX billing rules অনুযায়ী define করতে হবে।

### 20.5 Billing Actions

- Change plan
- Update payment method
- View invoice
- Retry failed payment
- Cancel subscription
- Request support

Plan downgrade হলে existing data limit অতিক্রম করলে কী হবে—read-only, upgrade required, বা other policy—তা আগে define করতে হবে। User data নীরবে delete করা যাবে না।

---

## 21. Support & Resources

**Base Route:** `/dashboard/support`

Features:

- Help Center
- Setup guides
- Video tutorials
- Frequently asked questions
- Support tickets
- Ticket details
- Ticket status
- Attachments, validated file types সহ
- Support conversation history
- Feature request submission

Ticket statuses:

- Open
- In Progress
- Waiting for Merchant
- Resolved
- Closed

Support ticket-এ অন্য tenant-এর information expose হওয়া যাবে না। Support staff-এর access shared backend-এর separate authorization policy দ্বারা নিয়ন্ত্রিত হবে।

---

## 22. Settings

**Base Route:** `/dashboard/settings`

### 22.1 Store Profile

- Store name
- Store slug
- Logo
- Description
- Contact email
- Phone
- Business address
- Business category

### 22.2 Locale & Currency

- Display language
- Currency
- Time zone
- Date format
- Number format

Bangladesh-first default:

- Currency: BDT
- Currency symbol: ৳
- Time zone: Asia/Dhaka

Currency support এবং multi-currency calculations আলাদা feature হিসেবে define করতে হবে। Display currency বদলালে stored transaction value পরিবর্তন করা যাবে না।

### 22.3 Order Settings

- Order numbering format
- Order confirmation rules
- Inventory reservation policy
- Cancellation policy
- Invoice preferences
- Default fulfillment behavior

### 22.4 Notifications

- New order alerts
- Payment updates
- Low-stock alerts
- Delivery updates
- Subscription alerts
- Email notification preferences
- In-app notification preferences

### 22.5 Legal & Policies

- Terms & Conditions
- Privacy Policy
- Return & Refund Policy
- Shipping Policy

Merchant-created policies store-specific হতে পারে; CartX platform-level legal policies আলাদা থাকবে।

### 22.6 Account Security

- Change password
- Active sessions, if supported
- Two-factor authentication, if implemented
- Login history
- Connected accounts
- Account recovery options

### 22.7 Data Export & Store Closure

- Export products
- Export orders
- Export customers, permission ও privacy rules অনুযায়ী
- Request store closure
- Confirm closure
- Data retention information

Destructive actions-এর আগে clear warning, confirmation এবং policy-based retention handling থাকতে হবে।

---

## 23. Notifications System

Merchant Dashboard-এ centralized notification center থাকবে।

### 23.1 Notification Types

- New order
- Payment status changed
- Low stock
- Out of stock
- Shipment status changed
- Refund update
- Subscription renewal
- Failed integration
- Team invitation
- Platform maintenance notice

### 23.2 Notification Features

- Read/unread status
- Mark as read
- Mark all as read
- Related entity link
- Timestamp
- Notification preferences
- Pagination বা lazy loading

Notifications store-scoped এবং user-scoped হতে হবে। Sensitive information notification preview-তে অপ্রয়োজনীয়ভাবে দেখানো যাবে না।

Real-time notifications প্রয়োজন হলে WebSocket/SSE ব্যবহার করা যেতে পারে; initial release-এ polling গ্রহণযোগ্য হতে পারে, provided performance requirements meet করে।

---

## 24. Global Search

Topbar-এ global search থাকবে, যা permission অনুযায়ী খুঁজবে:

- Products
- Orders
- Customers
- SKUs
- Tracking numbers

Requirements:

- Debounced input
- Search suggestions
- Keyboard navigation
- Loading state
- No-results state
- Search result links
- Tenant-scoped backend search

যে entity-তে user-এর permission নেই, সেটি search result-এ প্রকাশ করা যাবে না।

---

## 25. Backend API Requirements

Merchant Dashboard shared CartX backend API consume করবে। Endpoint naming final API standards অনুযায়ী adjust করা যাবে।

Recommended base prefix:

```
/api/v1/merchant
```

### 25.1 Dashboard

- `GET /dashboard/overview`
- `GET /dashboard/sales-summary`
- `GET /dashboard/recent-orders`
- `GET /dashboard/low-stock`

### 25.2 Products

- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PATCH /products/:id`
- `POST /products/:id/archive`
- `POST /products/:id/duplicate`
- `GET /categories`
- `POST /categories`
- `PATCH /categories/:id`
- `POST /products/import`
- `GET /products/export`

### 25.3 Inventory

- `GET /inventory`
- `GET /inventory/movements`
- `POST /inventory/adjustments`
- `GET /inventory/low-stock`

### 25.4 Orders

- `GET /orders`
- `GET /orders/:id`
- `POST /orders/:id/confirm`
- `POST /orders/:id/cancel`
- `POST /orders/:id/fulfill`
- `POST /orders/:id/notes`
- `GET /orders/:id/timeline`

### 25.5 Customers

- `GET /customers`
- `GET /customers/:id`
- `PATCH /customers/:id`
- `GET /customers/:id/orders`
- `POST /customers/:id/notes`

### 25.6 Payments

- `GET /payments/transactions`
- `GET /payments/transactions/:id`
- `GET /payments/refunds`
- `POST /payments/refunds`
- `GET /payments/settlements`

Refund and settlement endpoints must be implemented only with valid provider capabilities and explicit business rules.

### 25.7 Shipping

- `GET /shipping/providers`
- `GET /shipping/settings`
- `PATCH /shipping/settings`
- `POST /shipping/shipments`
- `GET /shipping/shipments/:id`
- `GET /shipping/shipments/:id/tracking`

### 25.8 Storefront

- `GET /store`
- `PATCH /store`
- `GET /store/themes`
- `POST /store/themes/:id/preview`
- `POST /store/publish`
- `GET /store/domains`
- `POST /store/domains`
- `POST /store/domains/:id/verify`

### 25.9 Team & Billing

- `GET /team/members`
- `POST /team/invitations`
- `PATCH /team/members/:id/role`
- `DELETE /team/members/:id`
- `GET /billing/subscription`
- `GET /billing/invoices`
- `POST /billing/change-plan`

এই তালিকা API design baseline; সব endpoint প্রথম release-এ তৈরি করতে হবে এমন নয়। প্রতিটি endpoint-এর request schema, response schema, permission, error codes এবং side effects API contract-এ documented থাকতে হবে।

---

## 26. Multi-Tenant Data Isolation & Security

এটি CartX-এর সবচেয়ে গুরুত্বপূর্ণ backend requirement।

### 26.1 Tenant Isolation

প্রতিটি store-এর জন্য unique tenant/store context থাকতে হবে।

প্রতিটি protected request-এ:

1. User authenticate করতে হবে।
2. User-এর store membership validate করতে হবে।
3. Required permission যাচাই করতে হবে।
4. Requested resource authorized store-এর কিনা validate করতে হবে।
5. Tenant-scoped database query execute করতে হবে।

Frontend থেকে পাঠানো `storeId` বা `tenantId` নিজে নিজে trusted authorization proof নয়।

### 26.2 Security Requirements

- Secure session/token handling।
- Password hashing using an appropriate modern algorithm।
- CSRF protection, applicable session architecture অনুযায়ী।
- Rate limiting।
- Input validation।
- Output encoding।
- SQL injection protection through safe query practices।
- XSS protection।
- Secure file upload validation।
- Server-side permission checks।
- Sensitive action audit logs।
- Secret credential encryption।
- Secure webhook signature verification।
- Brute-force protection।
- Appropriate CORS configuration।
- Production-only HTTPS।
- Secure cookies যেখানে applicable।
- Dependency vulnerability monitoring।

### 26.3 Audit Logs

Sensitive actions log করতে হবে:

- Product price changes
- Stock adjustments
- Order cancellations
- Refund requests and approvals
- Team role changes
- Payment integration changes
- Domain changes
- Subscription changes
- Store publishing actions

Audit logs সাধারণ merchant user-এর edit/delete access-এর বাইরে থাকতে হবে, subject to retention policy।

---

## 27. Database Entity Requirements

PostgreSQL + Prisma schema design-এ নিচের entities প্রয়োজন হতে পারে।

### 27.1 Core Entities

- `User`
- `Store`
- `StoreMembership`
- `Role`
- `Permission`
- `RolePermission`
- `Subscription`
- `Plan`
- `Invoice`

### 27.2 Commerce Entities

- `Product`
- `ProductVariant`
- `ProductImage`
- `Category`
- `Collection`
- `InventoryItem`
- `InventoryMovement`
- `InventoryReservation`
- `Customer`
- `CustomerAddress`
- `Order`
- `OrderItem`
- `OrderEvent`
- `OrderNote`

### 27.3 Payment & Shipping Entities

- `PaymentTransaction`
- `Refund`
- `PaymentProviderConnection`
- `Shipment`
- `ShipmentEvent`
- `ShippingZone`
- `ShippingRate`

### 27.4 Marketing & Storefront Entities

- `Discount`
- `Coupon`
- `Campaign`
- `StoreTheme`
- `StorePage`
- `StoreDomain`
- `StoreNavigation`
- `IntegrationConnection`

### 27.5 Operational Entities

- `Notification`
- `AuditLog`
- `ImportJob`
- `ExportJob`
- `SupportTicket`
- `SupportMessage`
- `WebhookEvent`

এগুলো proposed logical entities; final normalized schema, relation, uniqueness constraints, indexing এবং retention policy implementation-এর আগে নির্ধারণ করতে হবে।

### Database rules

- Tenant-owned entities-এ `storeId` বা equivalent ownership relation থাকতে হবে।
- Foreign keys এবং unique constraints ব্যবহার করতে হবে।
- Tenant-scoped unique values, যেমন SKU, প্রয়োজন অনুযায়ী composite uniqueness পাবে।
- Orders-এ product name, SKU এবং price snapshot রাখতে হবে, যাতে পরবর্তী product edit পুরোনো order-এর historical information বদলে না দেয়।
- Financial records-এর জন্য precision-safe decimal representation ব্যবহার করতে হবে।
- Important timestamps consistent UTC storage এবং configured timezone display policy অনুসরণ করবে।
- Soft deletion ব্যবহার করলে archived/deleted record-এর visibility এবং restoration rules define করতে হবে।

---

## 28. Frontend Repository Structure

Repository: `cartx-merchant-dashboard`

Suggested structure:

```
cartx-merchant-dashboard/
├── public/
│   ├── images/
│   ├── icons/
│   └── illustrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (onboarding)/
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── orders/
│   │       ├── products/
│   │       ├── inventory/
│   │       ├── customers/
│   │       ├── payments/
│   │       ├── shipping/
│   │       ├── marketing/
│   │       ├── store/
│   │       ├── analytics/
│   │       ├── apps/
│   │       ├── mobile-app/
│   │       ├── team/
│   │       ├── billing/
│   │       ├── support/
│   │       └── settings/
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── charts/
│   │   ├── feedback/
│   │   └── shared/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── payments/
│   │   ├── shipping/
│   │   ├── marketing/
│   │   ├── storefront/
│   │   ├── analytics/
│   │   ├── team/
│   │   └── billing/
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── permissions/
│   │   ├── validation/
│   │   └── formatters/
│   ├── hooks/
│   ├── types/
│   ├── config/
│   └── styles/
├── tests/
├── .env.example
├── README.md
└── package.json
```

Final folder organization existing repository এবং team convention অনুযায়ী adjust করা যাবে; feature logic, shared UI ও API access-এর separation বজায় রাখতে হবে।

---

## 29. UX States & Error Handling

প্রতিটি major page-এ নিচের states implement করতে হবে।

### Loading

- Skeleton placeholders
- Loading indicator for actions
- Disable duplicate submissions

### Empty State

Examples:

- No products yet
- No orders found
- No customers yet
- No transactions available

প্রতিটি empty state-এ relevant next action থাকবে।

### Error State

- Human-readable error message
- Retry action, where safe
- Request/reference ID, useful হলে
- Sensitive backend stack traces hide করতে হবে

### Permission State

- Access denied explanation
- Contact store owner, applicable হলে
- Unauthorized action-এর data render করা যাবে না

### Plan-Limit State

- Current limit
- Current usage
- Required plan/feature, if applicable
- Upgrade link, if enabled

### Offline / Connection State

- Connection lost indicator
- Retry behavior
- Unsaved form changes-এর warning
- Duplicate order/refund/shipment action যেন retry-তে না ঘটে

### Form Validation

- Inline validation
- Required field indication
- Server-side validation errors
- Focus management
- Clear success/error feedback

---

## 30. Responsive Design & Accessibility

### Desktop

- Persistent sidebar।
- Spacious data tables।
- Multi-column forms where useful।
- Detailed order and product layouts।

### Tablet

- Collapsible sidebar।
- Responsive grid।
- Tables-এ horizontal scrolling বা alternate compact layout।

### Mobile Browser

- Drawer navigation।
- Single-column forms।
- Touch-friendly buttons।
- Important order actions সহজে accessible।
- Tables-এর compact/card presentation, যেখানে প্রয়োজন।
- Fixed bottom action bar শুধু meaningful হলে।

### Accessibility

- Keyboard navigation
- Visible focus indicators
- Semantic headings
- Accessible form labels
- Screen-reader-friendly dialogs
- Accessible charts with textual summaries
- Sufficient color contrast
- Error messages associated with relevant fields

---

## 31. Performance Requirements

প্রস্তাবিত initial targets, বাস্তব hosting ও test results অনুযায়ী যাচাই করতে হবে:

- Dashboard initial render responsive হওয়া।
- Routine API requests-এর জন্য reasonable latency budget নির্ধারণ করা।
- Large lists-এ server-side pagination।
- Search ও filters server-side support করা।
- Product images optimize করা।
- Code splitting এবং lazy loading ব্যবহার করা।
- Reports এবং large exports background processing-এ নেওয়া।
- Heavy analytics query-এর জন্য suitable indexes এবং caching ব্যবহার করা।
- Repeated requests-এ unnecessary refetching এড়ানো।
- CDN ব্যবহার করে static assets serve করা।

Campaign spike-এর জন্য শুধু frontend optimization যথেষ্ট নয়; API, database connection limits, Redis, queues এবং external provider rate limits load test করতে হবে।

---

## 32. Testing & Quality Assurance

### 32.1 Unit Tests

- Price calculations
- Discount validation
- Order status transitions
- Permission helpers
- Inventory calculations
- Date/currency formatting
- Form validation

### 32.2 Integration Tests

- Product CRUD
- Order creation
- Stock reservation and release
- Payment callback processing
- Refund workflow
- Shipment creation
- Subscription limit enforcement
- Tenant isolation

### 32.3 End-to-End Tests

- **Scenario 1:** Merchant onboarding
- **Scenario 2:** Product creation and publication
- **Scenario 3:** Customer places an order on storefront
- **Scenario 4:** Merchant processes the order
- **Scenario 5:** Payment is confirmed
- **Scenario 6:** Shipment is created and tracked
- **Scenario 7:** Order is delivered
- **Scenario 8:** Return/refund is processed
- **Scenario 9:** Unauthorized team member is blocked
- **Scenario 10:** A merchant cannot access another merchant's data

### 32.4 Failure Scenarios

- Duplicate payment callback
- Duplicate courier webhook
- Network timeout
- Failed product upload
- Invalid CSV import
- Out-of-stock race condition
- Expired session
- Subscription limit exceeded
- Permission revoked during active session
- Provider API unavailable

### 32.5 Definition of Done

কোনো module complete হবে তখনই, যখন:

- UI implemented।
- API integrated।
- Database persistence works।
- Validation implemented।
- Permission checks implemented।
- Loading, empty, error এবং success states implemented।
- Mobile/tablet responsiveness checked।
- Relevant automated tests pass।
- No critical console errors।
- Documentation updated।
- Feature fake/mock-only অবস্থায় নেই, যদি production-ready হিসেবে marked হয়।

---

## 33. Development Roadmap

### Phase 1 — Foundation & Authentication

- Project setup
- Theme and design system
- Authentication
- Store membership context
- Role-based permissions
- Dashboard layout
- API client
- Error handling

### Phase 2 — Merchant Onboarding & Store Profile

- Store setup wizard
- Store profile
- Store settings
- Basic storefront configuration
- Setup checklist

### Phase 3 — Products & Inventory

- Product CRUD
- Categories
- Variants
- Image uploads
- Stock tracking
- Inventory movements
- Import/export basics

### Phase 4 — Orders & Customers

- Order list
- Order details
- Status transitions
- Order timeline
- Customer records
- Invoice generation

### Phase 5 — Payments & Shipping

- Payment transaction records
- Supported gateway connections
- Refund workflow
- Shipping configuration
- Courier connections
- Shipment tracking

### Phase 6 — Storefront Management

- Themes
- Pages
- Navigation
- Domain setup
- Publish workflow
- SEO configuration

### Phase 7 — Marketing & Analytics

- Coupons
- Discounts
- Campaigns
- Sales reports
- Product reports
- CSV exports

### Phase 8 — Billing, Team & Support

- Team invitations
- Permissions
- Subscription management
- Usage limits
- Support tickets
- Notifications

### Phase 9 — Advanced Modules

- Mobile app management
- Advanced segmentation
- Advanced analytics
- Additional integrations
- Automation features

> **Recommendation:** Phase 1–5-এ core store operations production-ready করার আগে সব advanced module একসঙ্গে তৈরি করার চেষ্টা করা উচিত নয়।

---

## 34. Google Antigravity Development Instructions

এই document-কে `cartx-merchant-dashboard` repository-এর baseline specification হিসেবে ব্যবহার করতে হবে।

Developer/AI agent-এর কাজ:

1. প্রথমে existing repository inspect করতে হবে।
2. Current code, dependencies, routes, components এবং API integration review করতে হবে।
3. Existing implementation থাকলে audit করে missing features identify করতে হবে।
4. Repository-তে project-specific `IMPLEMENTATION_PLAN.md` তৈরি করতে হবে।
5. `FEATURE_STATUS.md`-এ module-wise status track করতে হবে।
6. `API_INTEGRATION.md`-এ actual API endpoints এবং contract document করতে হবে।
7. `SECURITY_CHECKLIST.md`-এ tenant isolation, permissions এবং sensitive actions track করতে হবে।
8. Shared CartX backend-এর existing contract ব্যবহার করতে হবে; নিজের মতো duplicate endpoint বা data model invent করা যাবে না।
9. Backend contract missing হলে assumptions গোপন না রেখে `API_GAPS.md`-এ list করতে হবে।
10. Development-এ reusable components এবং consistent design system ব্যবহার করতে হবে।
11. সব interactive UI control-এর real action থাকতে হবে।
12. Mock data থাকলে development-only হিসেবে clearly identify করতে হবে।
13. Fake analytics, fake payments, fake courier tracking বা false connection status production UI-তে দেখানো যাবে না।
14. Payment, refund, inventory এবং order status-এর authoritative logic backend-এ থাকতে হবে।
15. Tenant isolation এবং authorization-এর automated tests বাধ্যতামূলক।
16. একসঙ্গে সব module implement করার বদলে dependency-aware phase অনুযায়ী কাজ করতে হবে।
17. প্রতিটি phase শেষে lint, type-check, relevant tests এবং build চালাতে হবে।
18. Build failure বা missing integration থাকলে তা document করতে হবে; কাজ complete বলে দাবি করা যাবে না।

---

## 35. Final Acceptance Checklist

### Core Dashboard

- [ ] Login এবং logout works
- [ ] Store context correctly resolved
- [ ] Sidebar permission-aware
- [ ] Dashboard metrics backed by real API data
- [ ] Notifications work

### Products & Inventory

- [ ] Product create/edit/archive
- [ ] Variant management
- [ ] Image uploads
- [ ] SKU validation
- [ ] Inventory adjustment audit trail
- [ ] Overselling protection

### Orders & Customers

- [ ] Order list, filters and search
- [ ] Order details and timeline
- [ ] Valid status transitions
- [ ] Customer history
- [ ] Invoice generation
- [ ] Cancellation/return/refund policy enforced

### Payments & Shipping

- [ ] Transaction status verified
- [ ] Provider credentials protected
- [ ] Duplicate callback protection
- [ ] Courier integration tested
- [ ] Tracking status accurate
- [ ] Provider failures handled

### Storefront & Marketing

- [ ] Theme preview and publishing
- [ ] Domain verification
- [ ] Coupon validation
- [ ] Store settings persisted
- [ ] SEO settings correctly applied

### Subscription & Security

- [ ] Plan limits enforced server-side
- [ ] Billing records accessible
- [ ] Role permissions tested
- [ ] Cross-tenant access blocked
- [ ] Audit logs implemented
- [ ] Sensitive secrets never exposed

### Quality

- [ ] Responsive UI
- [ ] Loading/empty/error states
- [ ] Automated tests pass
- [ ] No critical console errors
- [ ] Production build passes
- [ ] Deployment and rollback procedure documented

---

## 36. Final Product Vision

CartX Merchant Dashboard-এর উদ্দেশ্য শুধু একটি attractive admin panel তৈরি করা নয়। এটি merchant-এর daily e-commerce operations-এর reliable control center হতে হবে।

একজন merchant যেন একই platform থেকে:

**Store Setup → Product Management → Inventory → Order Processing → Payment → Delivery → Marketing → Analytics → Business Growth**

সম্পূর্ণ workflow পরিচালনা করতে পারে।

প্রতিটি feature বাস্তব API, secure permission, reliable business rules এবং measurable acceptance criteria-এর সঙ্গে যুক্ত থাকবে। প্রথমে core commerce workflow production-ready করতে হবে; এরপর integrations, automation এবং white-label mobile app capabilities ধাপে ধাপে expand করতে হবে।

**Final status:** এই document হলো Merchant Dashboard-এর proposed product ও engineering baseline। Production development শুরু করার আগে shared backend-এর actual API contract, subscription policy, payment/courier provider access এবং release-one feature scope-এর সঙ্গে মিলিয়ে final approval নিতে হবে।
