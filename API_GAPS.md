# CartX Merchant Dashboard — API Gaps & Backend Dependencies

**Document Purpose:** Transparently record backend endpoints, contracts, or third-party provider specifications that are currently pending deployment or implementation in the shared Express.js backend.  
**Baseline:** `CARTX_MERCHANT_DASHBOARD.md` (Version 1.0)  
**Last Updated:** October 31, 2026 (Phase 4 Final Audit & Repository Verification)

---

## 1. Phase 2 Contracts Status (Onboarding & Settings)

The frontend integration boundary for Phase 2 has been fully implemented, typed, and augmented with a high-fidelity Demo Mode service layer (`mockOnboardingService` and `mockStoreSettingsService`):

- `GET /stores/onboarding` (Draft restoration — fallback: `mockOnboardingService.getDraft()`)
- `PATCH /stores/onboarding/:step` (Step persistence — fallback: `mockOnboardingService.saveStep(step, data)`)
- `GET /stores/check-slug?slug=...` (Subdomain check — fallback: `mockOnboardingService.checkSlugAvailability(slug)`)
- `GET /stores/current` (Store profile fetch — fallback: `mockStoreSettingsService.getSettings()`)
- `PUT /stores/current` (Store settings update — fallback: `mockStoreSettingsService.updateSettings(data)`)
- `POST /stores/current/publish` (Store publication — fallback: `mockOnboardingService.publishStore()`)

---

## 2. Phase 3 Contracts Status (Products & Inventory)

Phase 3 frontend features are fully functional using a local storage service (`src/features/products/services/mockProducts.ts`) and React Query hooks. When the shared Express backend is ready, the following endpoints will be hooked into the typed client:

| Planned Endpoint                 | Method   | Purpose                                | Frontend Hook / Consumer                               |
| -------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------ |
| `/api/v1/products`               | `GET`    | Paginated product listing with filters | `useProductsQuery(params)`                             |
| `/api/v1/products`               | `POST`   | Create product with validation         | `useCreateProductMutation()`                           |
| `/api/v1/products/:id`           | `GET`    | Single product detail                  | `useProductQuery(id)`                                  |
| `/api/v1/products/:id`           | `PATCH`  | Update product details                 | `useUpdateProductMutation()`                           |
| `/api/v1/products/:id`           | `DELETE` | Permanent product deletion             | `useDeleteProductMutation()`                           |
| `/api/v1/products/:id/archive`   | `POST`   | Soft-archive product                   | `useArchiveProductMutation()`                          |
| `/api/v1/products/:id/duplicate` | `POST`   | Duplicate product as draft             | `useDuplicateProductMutation()`                        |
| `/api/v1/products/bulk/archive`  | `POST`   | Bulk archive multiple products         | `useBulkArchiveMutation()`                             |
| `/api/v1/products/bulk/delete`   | `POST`   | Bulk delete multiple products          | `useBulkDeleteMutation()`                              |
| `/api/v1/categories`             | `GET`    | List store taxonomy categories         | `useCategoriesQuery()`                                 |
| `/api/v1/categories`             | `POST`   | Create new category                    | `useCreateCategoryMutation()`                          |
| `/api/v1/collections`            | `GET`    | List merchandising collections         | `useCollectionsQuery()`                                |
| `/api/v1/collections`            | `POST`   | Create merchandising collection        | `useCreateCollectionMutation()`                        |
| `/api/v1/inventory`              | `GET`    | Inventory items & stock stats          | `useInventoryItemsQuery()`, `useInventoryStatsQuery()` |
| `/api/v1/inventory/movements`    | `GET`    | Audit trail of inventory movements     | `useInventoryMovementsQuery()`                         |
| `/api/v1/inventory/adjustments`  | `POST`   | Record stock adjustment                | `useStockAdjustmentMutation()`                         |

---

## 3. Phase 4 Contracts Status (Orders & Customers)

Phase 4 features are fully operational using mock browser persistence (`mockOrders.ts` and `mockCustomers.ts`) and React Query hooks. When the shared Express backend is ready, the following endpoints will be connected to the typed client:

| Planned Endpoint              | Method  | Purpose                                          | Frontend Hook / Consumer             |
| ----------------------------- | ------- | ------------------------------------------------ | ------------------------------------ |
| `/api/v1/orders`              | `GET`   | Paginated orders listing with search and filters | `useOrdersQuery(params)`             |
| `/api/v1/orders/:id`          | `GET`   | Single order details with items and timeline     | `useOrderQuery(id)`                  |
| `/api/v1/orders/:id/status`   | `POST`  | Validated status transition                      | `useTransitionOrderStatusMutation()` |
| `/api/v1/orders/:id/cancel`   | `POST`  | Cancel order with reason and optional restock    | `useCancelOrderMutation()`           |
| `/api/v1/orders/:id/return`   | `POST`  | Return order with reason and refund              | `useReturnOrderMutation()`           |
| `/api/v1/orders/:id/payment`  | `PATCH` | Update payment status and gateway ref            | `useMarkPaymentStatusMutation()`     |
| `/api/v1/orders/:id/notes`    | `POST`  | Append private merchant staff note               | `useAddOrderNoteMutation()`          |
| `/api/v1/orders/bulk/status`  | `POST`  | Bulk transition eligible orders                  | `useBulkUpdateStatusMutation()`      |
| `/api/v1/orders/bulk/cancel`  | `POST`  | Bulk cancel eligible orders                      | `useBulkCancelOrdersMutation()`      |
| `/api/v1/orders/stats`        | `GET`   | Storewide orders KPI statistics                  | `useOrderStatsQuery()`               |
| `/api/v1/customers`           | `GET`   | Paginated customer database with filters         | `useCustomersQuery(params)`          |
| `/api/v1/customers/:id`       | `GET`   | Customer profile, addresses and lifetime metrics | `useCustomerQuery(id)`               |
| `/api/v1/customers`           | `POST`  | Create new customer record                       | `useCreateCustomerMutation()`        |
| `/api/v1/customers/:id/tags`  | `PATCH` | Update segmentation tags                         | `useUpdateCustomerTagsMutation()`    |
| `/api/v1/customers/:id/notes` | `POST`  | Append customer profile note                     | `useAddCustomerNoteMutation()`       |
| `/api/v1/customers/stats`     | `GET`   | Customer segments & LTV stats                    | `useCustomerStatsQuery()`            |

---

## 4. Phase 5 Contracts Status (Payments & Shipping Logistics)

Phase 5 frontend capabilities operate through typed adapter and service boundaries (`mockPayments.ts` and `mockShipping.ts`) backed by TanStack Query hooks. When the shared Express API is deployed, the following endpoints will replace the local service implementations:

### Payment Endpoints

| Planned Endpoint                    | Method  | Purpose                                                                | Frontend Hook / Consumer              |
| ----------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------------- |
| `/api/v1/payments/transactions`     | `GET`   | Paginated transactions ledger with search, gateway, and status filters | `usePaymentTransactionsQuery(params)` |
| `/api/v1/payments/transactions/:id` | `GET`   | Single transaction detail with gateway references and timeline         | `usePaymentTransactionQuery(id)`      |
| `/api/v1/payments/initiate`         | `POST`  | Initialize bKash / Nagad / SSLCommerz checkout session                 | `useInitiatePaymentMutation()`        |
| `/api/v1/payments/verify`           | `POST`  | Authoritative server-side verification of payment execution            | `useVerifyPaymentMutation()`          |
| `/api/v1/payments/refunds`          | `GET`   | Paginated refund requests and settled reversals                        | `useRefundsQuery(params)`             |
| `/api/v1/payments/refunds`          | `POST`  | Idempotent refund request with balance validation                      | `useRequestRefundMutation()`          |
| `/api/v1/payments/methods`          | `GET`   | Configured payment gateway statuses and environments                   | `usePaymentMethodsQuery()`            |
| `/api/v1/payments/methods/:id`      | `PATCH` | Update gateway environment and merchant ID (zero secrets)              | `useUpdatePaymentMethodMutation()`    |
| `/api/v1/payments/stats`            | `GET`   | Storewide payment KPI metrics (gross volume, pending, refunds)         | `usePaymentKPIsQuery()`               |

### Shipping & Courier Endpoints

| Planned Endpoint                               | Method  | Purpose                                                                        | Frontend Hook / Consumer               |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `/api/v1/shipping/shipments`                   | `GET`   | Paginated shipments ledger with courier and transit status filters             | `useShipmentsQuery(params)`            |
| `/api/v1/shipping/shipments/:id`               | `GET`   | Single consignment detail with live tracking timeline                          | `useShipmentQuery(id)`                 |
| `/api/v1/shipping/shipments/by-order/:orderId` | `GET`   | Active shipment linked to a specific order                                     | `useShipmentByOrderQuery(orderId)`     |
| `/api/v1/shipping/shipments`                   | `POST`  | Create courier consignment (Steadfast, Pathao, RedX) with duplicate prevention | `useCreateShipmentMutation()`          |
| `/api/v1/shipping/shipments/:id/cancel`        | `POST`  | Cancel courier consignment before pickup                                       | `useCancelShipmentMutation()`          |
| `/api/v1/shipping/couriers`                    | `GET`   | Configured courier connection statuses and pickup hubs                         | `useCourierConnectionsQuery()`         |
| `/api/v1/shipping/couriers/:id`                | `PATCH` | Update courier pickup address and store client code                            | `useUpdateCourierConnectionMutation()` |
| `/api/v1/shipping/rates`                       | `GET`   | Store shipping rules (inside/outside Dhaka, free threshold)                    | `useShippingRatesQuery()`              |
| `/api/v1/shipping/rates`                       | `PUT`   | Update store delivery charges and COD fees                                     | `useUpdateShippingRatesMutation()`     |
| `/api/v1/shipping/stats`                       | `GET`   | Logistics KPI statistics (in transit, delivered, COD receivables)              | `useShippingKPIsQuery()`               |

---

## 5. Phase 6 Contracts Status (Storefront & Domain Management)

Phase 6 frontend features are fully functional in high-fidelity client demo mode using local browser storage (`src/features/storefront/services/mockStorefront.ts`) and React Query hooks. When the shared Express backend is ready, the following REST endpoints will be connected to the typed client:

### Theme & Storefront Endpoints

| Planned Endpoint                               | Method   | Purpose                                                                | Frontend Hook / Consumer                 |
| ---------------------------------------------- | -------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `/api/v1/storefront/overview`                  | `GET`    | Storefront status, active theme, domain routing, and recent activity   | `useStorefrontOverviewQuery()`           |
| `/api/v1/storefront/status`                    | `PATCH`  | Update operational status (`active`, `draft`, `maintenance`, `offline`)| `useUpdateStorefrontStatusMutation()`    |
| `/api/v1/storefront/themes`                    | `GET`    | List theme catalog with version and presets                            | `useThemesQuery()`                       |
| `/api/v1/storefront/themes/active`             | `GET`    | Active storefront theme and custom configuration                       | `useActiveThemeQuery()`                  |
| `/api/v1/storefront/themes/:id/customize`      | `PATCH`  | Save visual customizations (colors, typography, sections, header)      | `useUpdateThemeCustomizationMutation()`  |
| `/api/v1/storefront/themes/:id/activate`       | `POST`   | Switch active theme for customer storefront                            | `useActivateThemeMutation()`             |
| `/api/v1/storefront/themes/:id/reset`          | `POST`   | Reset theme customizations to factory baseline                         | `useResetThemeCustomizationMutation()`   |

### Domain & DNS Verification Endpoints

| Planned Endpoint                               | Method   | Purpose                                                                | Frontend Hook / Consumer                 |
| ---------------------------------------------- | -------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `/api/v1/storefront/domains`                   | `GET`    | List configured default and custom domain routing records              | `useDomainsQuery()`                      |
| `/api/v1/storefront/domains`                   | `POST`   | Register custom domain for reverse proxy routing                       | `useAddCustomDomainMutation()`           |
| `/api/v1/storefront/domains/:id`               | `DELETE` | Remove custom domain routing from tenant boundary                      | `useRemoveCustomDomainMutation()`        |
| `/api/v1/storefront/domains/:id/verify`        | `POST`   | Authoritative DNS lookup against nameservers for CNAME / A records     | `useVerifyDomainMutation()`              |
| `/api/v1/storefront/domains/:id/ssl`           | `GET`    | Check server-side SSL certificate issuance (Let's Encrypt / Cloudflare)| Future SSL Polling Query                 |

### CMS Pages & Legal Policy Endpoints

| Planned Endpoint                               | Method   | Purpose                                                                | Frontend Hook / Consumer                 |
| ---------------------------------------------- | -------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `/api/v1/storefront/pages`                     | `GET`    | List CMS pages and legal policies with search and status filters       | `usePagesQuery(params)`                  |
| `/api/v1/storefront/pages/:id`                 | `GET`    | Retrieve single CMS page content, metadata, and revision history       | `usePageQuery(id)`                       |
| `/api/v1/storefront/pages`                     | `POST`   | Create new CMS page or legal policy with unique slug validation        | `useCreatePageMutation()`                |
| `/api/v1/storefront/pages/:id`                 | `PATCH`  | Update page title, slug, content, or publication status                | `useUpdatePageMutation()`                |
| `/api/v1/storefront/pages/:id`                 | `DELETE` | Delete CMS page from storefront navigation                             | `useDeletePageMutation()`                |

---

## 6. Phase 7 Contracts Status (Marketing, Promotions & Analytics)

Phase 7 frontend capabilities operate in high-fidelity client demo mode using local browser storage (`src/features/marketing/services/mockMarketing.ts`) and React Query hooks. When the shared Express backend is deployed, the following REST endpoints will replace the local service implementations:

### Coupon Management Endpoints

| Planned Endpoint                         | Method   | Purpose                                                            | Frontend Hook / Consumer                 |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `/api/v1/marketing/coupons`              | `GET`    | Paginated coupons listing with search, status, and type filters    | `useCouponsQuery(params)`                |
| `/api/v1/marketing/coupons/:id`          | `GET`    | Single coupon details, usage stats, and validity bounds            | `useCouponQuery(id)`                     |
| `/api/v1/marketing/coupons`              | `POST`   | Create new coupon with uppercase uniqueness & validation           | `useCreateCouponMutation()`              |
| `/api/v1/marketing/coupons/:id`          | `PATCH`  | Update coupon campaign, discounts, thresholds, or limits           | `useUpdateCouponMutation()`              |
| `/api/v1/marketing/coupons/:id`          | `DELETE` | Delete coupon from catalog                                         | `useDeleteCouponMutation()`              |
| `/api/v1/marketing/coupons/:id/status`   | `PATCH`  | Toggle active/inactive operational status                          | `useToggleCouponStatusMutation()`        |
| `/api/v1/marketing/coupons/validate`     | `POST`   | Authoritative server-side checkout validation of coupon redemption | Checkout Service Boundary                |

### Promotional Discounts & Automatic Markdowns

| Planned Endpoint                         | Method   | Purpose                                                            | Frontend Hook / Consumer                 |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `/api/v1/marketing/discounts`            | `GET`    | List storewide, category, and product promotion campaigns          | `useDiscountsQuery(params)`              |
| `/api/v1/marketing/discounts/:id`        | `GET`    | Single discount campaign details and attributed revenue metrics    | `useDiscountQuery(id)`                   |
| `/api/v1/marketing/discounts`            | `POST`   | Create promotional discount campaign with scope and min spend      | `useCreateDiscountMutation()`            |
| `/api/v1/marketing/discounts/:id`        | `PATCH`  | Update discount rate, schedule, or category/product targets        | `useUpdateDiscountMutation()`            |
| `/api/v1/marketing/discounts/:id`        | `DELETE` | Remove promotional discount campaign                               | `useDeleteDiscountMutation()`            |

### Flash Sales Campaign Endpoints

| Planned Endpoint                         | Method   | Purpose                                                            | Frontend Hook / Consumer                 |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `/api/v1/marketing/flash-sales`          | `GET`    | List time-boxed flash sales with live status and stock quotas      | `useFlashSalesQuery(params)`             |
| `/api/v1/marketing/flash-sales/:id`      | `GET`    | Single flash sale drop details and claimed unit counts             | `useFlashSaleQuery(id)`                  |
| `/api/v1/marketing/flash-sales`          | `POST`   | Create flash sale with stock validation & overlap check            | `useCreateFlashSaleMutation()`           |
| `/api/v1/marketing/flash-sales/:id`      | `PATCH`  | Update flash drop pricing or schedule                              | `useUpdateFlashSaleMutation()`           |
| `/api/v1/marketing/flash-sales/:id`      | `DELETE` | Remove flash sale campaign and restore regular catalog price       | `useDeleteFlashSaleMutation()`           |

### Marketing Analytics & Report Endpoints

| Planned Endpoint                         | Method   | Purpose                                                            | Frontend Hook / Consumer                 |
| ---------------------------------------- | -------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `/api/v1/marketing/overview`             | `GET`    | Storewide marketing KPI summary and recent activities audit log    | `useMarketingOverviewQuery()`            |
| `/api/v1/marketing/analytics`            | `GET`    | Promotion-attributed revenue, redemption rate, timeline trajectory | `useMarketingAnalyticsQuery(preset)`     |
| `/api/v1/marketing/reports/products`     | `GET`    | Product sales ledger under promotions with discounts given         | `useProductPerformanceReportQuery()`     |
| `/api/v1/marketing/reports/campaigns`    | `GET`    | Campaign ROI report comparing revenue vs discount savings given    | `useCampaignPerformanceReportQuery()`    |
| `/api/v1/marketing/reports/coupons`      | `GET`    | Coupon redemptions, average order values, and velocity stats       | `useCouponUsageReportQuery()`            |
| `/api/v1/marketing/reports/discounts`    | `GET`    | Automatic discount savings given ledger and order volume           | `useDiscountPerformanceReportQuery()`    |

---

## 7. Phase 8 Contracts Status (Team, Billing & Operations Support)

Phase 8 capabilities are fully implemented and typed using modular browser services (`mockTeam.ts`, `mockBilling.ts`, `mockSupport.ts`) backed by TanStack Query hooks. When the shared Express API is deployed, the following endpoints will replace the local storage persistence:

### Team & Permissions Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/team/members` | `GET` | List store team members with roles and statuses | `useTeamMembersQuery()` |
| `/api/v1/team/members/:id` | `PATCH` | Update team member role, status, or custom permissions | `useUpdateTeamMemberMutation()` |
| `/api/v1/team/members/:id` | `DELETE` | Remove team member from store (safeguarding Owner) | `useRemoveTeamMemberMutation()` |
| `/api/v1/team/invitations` | `GET` | List pending and historical store invitations | `useTeamInvitationsQuery()` |
| `/api/v1/team/invitations` | `POST` | Create and send email invitation to new staff member | `useInviteMemberMutation()` |
| `/api/v1/team/invitations/:id/cancel` | `POST` | Revoke a pending team invitation | `useCancelInvitationMutation()` |
| `/api/v1/team/invitations/:id/resend` | `POST` | Resend invitation email and extend expiration | `useResendInvitationMutation()` |
| `/api/v1/team/roles` | `GET` | List available merchant roles and default permission grants | `useRoleDefinitionsQuery()` |

### CartX Subscription & Billing Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/billing/subscription` | `GET` | Get active store subscription tier, cycle, and renewal | `useStoreSubscriptionQuery()` |
| `/api/v1/billing/subscription` | `POST` | Upgrade or downgrade subscription tier and cycle | `useChangePlanMutation()` |
| `/api/v1/billing/usage` | `GET` | Current resource consumption vs subscription limits | `usePlanUsageMetricsQuery()` |
| `/api/v1/billing/invoices` | `GET` | Historical billing invoices ledger with payment status | `useInvoicesQuery()` |
| `/api/v1/billing/invoices/:id` | `GET` | Invoice breakdown, VAT calculation, and line items | `useInvoiceQuery(id)` |
| `/api/v1/billing/invoices/:id/pay` | `POST` | Settle pending or failed invoice via default payment method | `usePayInvoiceMutation()` |
| `/api/v1/billing/settings` | `GET` | Merchant legal tax BIN, billing contact, and invoices email | `useBillingSettingsQuery()` |
| `/api/v1/billing/settings` | `PUT` | Update merchant billing and tax information | `useUpdateBillingSettingsMutation()` |
| `/api/v1/billing/payment-methods` | `POST` | Add bKash Auto-Debit, Nagad, or Card payment method | `useAddPaymentMethodMutation()` |
| `/api/v1/billing/payment-methods/:id/default` | `POST` | Set primary payment method for auto-renewal | `useSetDefaultPaymentMethodMutation()` |
| `/api/v1/billing/payment-methods/:id` | `DELETE` | Remove saved payment instrument | `useRemovePaymentMethodMutation()` |

### Support & Help Center Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/support/articles` | `GET` | Searchable knowledge base articles and guides | `useHelpArticlesQuery(query, category)` |
| `/api/v1/support/faqs` | `GET` | Categorized FAQ items for merchant self-service | `useFAQItemsQuery(category)` |
| `/api/v1/support/tickets` | `GET` | List merchant support tickets with filters | `useSupportTicketsQuery(filters)` |
| `/api/v1/support/tickets` | `POST` | Create a new merchant support ticket | `useCreateTicketMutation()` |
| `/api/v1/support/tickets/:id` | `GET` | Ticket conversation history and metadata | `useSupportTicketQuery(id)` |
| `/api/v1/support/tickets/:id/reply` | `POST` | Post merchant reply and reopen resolved tickets | `useReplyTicketMutation()` |
| `/api/v1/support/tickets/:id/status` | `PATCH` | Merchant closes or reopens support ticket | `useUpdateTicketStatusMutation()` |

---

## 8. Phase 9 Contracts Status (Mobile App, Segmentation, Analytics, Integrations & Automation)

Phase 9 frontend features run in high-fidelity demo mode with SSR-safe `localStorage` persistence and TanStack Query state synchronization. When the Express backend implements authoritative services, the following contracts will be integrated:

### Mobile App Management Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/mobile-app/config` | `GET` | Get mobile app branding, layout, and settings | `useMobileAppConfigQuery()` |
| `/api/v1/mobile-app/branding` | `PUT` | Update display name, colors, icons, theme | `useUpdateBrandingMutation()` |
| `/api/v1/mobile-app/content` | `PUT` | Update homepage layout blocks and navigation routes | `useUpdateContentMutation()` |
| `/api/v1/mobile-app/settings` | `PUT` | Update package IDs and push preferences | `useUpdateSettingsMutation()` |
| `/api/v1/mobile-app/build` | `POST` | Trigger cloud compilation pipeline (CI/CD) | `useTriggerBuildMutation()` |

### Customer Segmentation Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/segments` | `GET` | List customer segment definitions | `useSegmentsQuery()` |
| `/api/v1/segments` | `POST` | Create new condition recipe segment | `useCreateSegmentMutation()` |
| `/api/v1/segments/:id` | `GET` | Single segment details and condition groups | `useSegmentQuery(id)` |
| `/api/v1/segments/:id` | `PUT` | Update segment criteria and logic | `useUpdateSegmentMutation()` |
| `/api/v1/segments/:id` | `DELETE` | Delete customer segment | `useDeleteSegmentMutation()` |
| `/api/v1/segments/preview` | `POST` | Evaluate segment conditions against live customer base | `useSegmentPreviewQuery()` |

### Advanced Analytics Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/analytics/overview` | `GET` | Gross revenue, net orders, customer deltas | `useAnalyticsOverviewQuery(range)` |
| `/api/v1/analytics/sales` | `GET` | Daily trends, basket size, status distribution | `useSalesAnalyticsQuery(range)` |
| `/api/v1/analytics/customers` | `GET` | Acquisition rate, 30d retention, VIP rankings | `useCustomerAnalyticsQuery(range)` |
| `/api/v1/analytics/products` | `GET` | Catalog performance, top SKUs, reorder alerts | `useProductAnalyticsQuery(range)` |
| `/api/v1/analytics/marketing` | `GET` | Campaign redemptions, attributed revenue | `useMarketingAnalyticsQuery(range)` |
| `/api/v1/analytics/export` | `POST` | Generate RFC-4180 UTF-8 CSV report file | `useExportAnalyticsReportMutation()` |

### Integrations & Webhooks Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/integrations` | `GET` | Integration catalog with active status | `useIntegrationsQuery()` |
| `/api/v1/integrations/:id/config` | `PUT` | Update integration credentials via proxy | `useUpdateIntegrationConfigMutation()` |
| `/api/v1/integrations/:id/toggle` | `POST` | Enable or disable integration | `useToggleIntegrationMutation()` |
| `/api/v1/integrations/:id/disconnect` | `POST` | Disconnect and clear server credentials | `useDisconnectIntegrationMutation()` |
| `/api/v1/webhooks` | `GET` | List registered webhook endpoints | `useWebhooksQuery()` |
| `/api/v1/webhooks` | `POST` | Register destination HTTPS endpoint | `useCreateWebhookMutation()` |
| `/api/v1/webhooks/:id` | `PUT` | Update webhook URL and subscribed events | `useUpdateWebhookMutation()` |
| `/api/v1/webhooks/:id/toggle` | `POST` | Toggle webhook active state | `useToggleWebhookMutation()` |
| `/api/v1/webhooks/:id` | `DELETE` | Delete webhook endpoint | `useDeleteWebhookMutation()` |
| `/api/v1/webhooks/:id/deliveries` | `GET` | Historical delivery attempts and responses | `useWebhookDeliveriesQuery(id)` |

### Store Automation Builder Endpoints

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/automation/workflows` | `GET` | List store automation recipes | `useWorkflowsQuery()` |
| `/api/v1/automation/workflows` | `POST` | Create trigger-condition-action workflow | `useCreateWorkflowMutation()` |
| `/api/v1/automation/workflows/:id` | `GET` | Single workflow recipe configuration | `useWorkflowQuery(id)` |
| `/api/v1/automation/workflows/:id` | `PUT` | Update workflow steps | `useUpdateWorkflowMutation()` |
| `/api/v1/automation/workflows/:id` | `DELETE` | Delete workflow recipe | `useDeleteWorkflowMutation()` |
| `/api/v1/automation/workflows/:id/toggle` | `POST` | Toggle workflow active state | `useToggleWorkflowMutation()` |
| `/api/v1/automation/workflows/:id/duplicate` | `POST` | Duplicate workflow recipe | `useDuplicateWorkflowMutation()` |
| `/api/v1/automation/workflows/:id/test` | `POST` | Execute simulated test run | `useSimulateExecutionMutation()` |
| `/api/v1/automation/executions` | `GET` | Execution history audit logs | `useWorkflowExecutionsQuery()` |

---

## 9. Storage & File Upload Contracts

| Pending Contract          | Description                                                                                                           | Impact on Frontend                                                                                                              | Required Resolution                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Presigned URL Uploads** | Endpoint `/api/v1/uploads/presigned-url` for direct client upload of product images and store logos to S3/Cloudinary. | Product creation currently accepts web image URLs and local demo presets. Direct binary file upload requires presigned S3 URLs. | Backend to generate presigned S3/Cloudinary upload URLs with content-type and size restrictions. |

---

## 10. Authentication & Session Management Gaps

| Pending Contract               | Description                                                                                      | Impact on Frontend                                                                      | Required Resolution                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **`/api/v1/auth/me` Endpoint** | Backend endpoint returning the active user profile, tenant memberships, and assigned roles.      | Frontend currently uses default initialized state (`user: null`, ready for login flow). | Express API must expose `/auth/me` supporting session cookie or Bearer token verification. |
| **Refresh Token Strategy**     | Formalization of whether refresh tokens are delivered via HttpOnly SameSite cookie or JSON body. | Determines interceptor implementation in `src/lib/api/client.ts`.                       | Recommended: HttpOnly cookie with CSRF header protection.                                  |

---

## 11. Third-Party Gateway & Courier Proxies (Required for Live Mode)

| Pending Contract                       | Description                                                                                                                             | Impact on Frontend                                                                                                     | Required Resolution                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Bangladesh Payment Gateways Proxy**  | Backend proxy endpoints to execute bKash Tokenized, Nagad Direct, and SSLCommerz APIs without exposing merchant secrets in the browser. | Frontend runs in high-fidelity sandbox simulation mode. Live transactions require authoritative server-side execution. | Express API to securely manage merchant API credentials and verify IPN callback signatures. |
| **Bangladesh Courier Providers Proxy** | Backend proxy endpoints to create consignments and sync tracking webhooks with Steadfast, Pathao, and RedX.                             | Consignment booking currently operates in sandbox simulation mode with consistent consignment numbers.                 | Express API to store courier bearer tokens and receive real-time courier tracking webhooks. |
