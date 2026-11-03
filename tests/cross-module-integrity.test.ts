import { describe, it, expect, beforeEach } from "vitest";
import { mockProductService } from "@/features/products/services/mockProducts";
import { mockOrderService } from "@/features/orders/services/mockOrders";
import { mockCustomerService } from "@/features/customers/services/mockCustomers";
import { mockMarketingService } from "@/features/marketing/services/mockMarketing";
import { mockSegmentationService } from "@/features/segmentation/services/mockSegmentation";
import { mockAnalyticsService } from "@/features/analytics/services/mockAnalytics";
import { mockShippingService } from "@/features/shipping/services/mockShipping";
import { mockPaymentService } from "@/features/payments/services/mockPayments";
import { mockTeamService } from "@/features/team/services/mockTeam";
import { getDateRangeFromPreset } from "@/features/analytics/constants";
import { resetAllDemoData } from "@/lib/demo/resetDemo";

describe("Cross-Module Realistic Workflows & Data Integrity Lifecycle", () => {
  beforeEach(() => {
    resetAllDemoData();
  });

  it("1. Create a product and update its inventory", () => {
    const initialProducts = mockProductService.getProducts({ limit: 100 }).total;
    const newProduct = mockProductService.createProduct({
      title: "Handloom Jamdani Panjabi",
      slug: "handloom-jamdani-panjabi",
      sku: "JMD-PNJ-01",
      price: 3500,
      costPrice: 2200,
      stock: 50,
      lowStockThreshold: 5,
      allowBackorders: false,
      trackInventory: true,
      category: "Men's Ethnic",
      status: "active",
      images: [],
    });

    expect(newProduct.id).toBeDefined();
    expect(newProduct.stock).toBe(50);
    expect(mockProductService.getProducts({ limit: 100 }).total).toBe(initialProducts + 1);

    // Update inventory via restock adjustment
    const movement = mockProductService.adjustStock({
      productId: newProduct.id,
      type: "restock",
      quantityChange: 20,
      reason: "Factory restock batch #882",
    });

    expect(movement.beforeQuantity).toBe(50);
    expect(movement.afterQuantity).toBe(70);

    const reloadedProduct = mockProductService.getProductById(newProduct.id);
    expect(reloadedProduct?.stock).toBe(70);
  });

  it("2 & 3 & 4. Create an order, verify stock deduction, change status, verify customer statistics", () => {
    // Pick an existing tracked product
    const product = mockProductService.getProductById("prod-001")!;
    expect(product).toBeDefined();
    const initialStock = product.stock;

    // Pick an existing customer
    const customer = mockCustomerService.getCustomerById("cust-001")!;
    expect(customer).toBeDefined();
    const initialCustomerSpend = customer.totalSpend;
    const initialCustomerOrders = customer.totalOrders;

    // Create an order using this product
    const orderQuantity = 2;
    const orderPrice = product.price;
    const order = mockOrderService.createOrder({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      orderStatus: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "bkash",
      items: [
        {
          id: "item-jmd",
          productId: product.id,
          title: product.title,
          sku: product.sku,
          price: orderPrice,
          quantity: orderQuantity,
          discount: 0,
          total: orderPrice * orderQuantity,
        },
      ],
      delivery: {
        courier: "Steadfast",
        shippingFee: 60,
      },
    });

    expect(order.id).toBeDefined();
    expect(order.orderNumber).toBeDefined();
    expect(order.orderStatus).toBe("confirmed");

    // Verify inventory deducted
    const updatedProduct = mockProductService.getProductById(product.id)!;
    expect(updatedProduct.stock).toBe(initialStock - orderQuantity);

    // Verify customer metrics updated
    const updatedCustomer = mockCustomerService.getCustomerById(customer.id)!;
    expect(updatedCustomer.totalOrders).toBe(initialCustomerOrders + 1);
    expect(updatedCustomer.totalSpend).toBe(initialCustomerSpend + order.grandTotal);

    // 3. Transition order status: confirmed -> processing -> ready_to_ship -> shipped -> delivered
    const processingOrder = mockOrderService.transitionOrderStatus(
      order.id,
      "processing",
      "Warehouse Staff"
    );
    expect(processingOrder.orderStatus).toBe("processing");

    const readyOrder = mockOrderService.transitionOrderStatus(
      order.id,
      "ready_to_ship",
      "Packing Station"
    );
    expect(readyOrder.orderStatus).toBe("ready_to_ship");

    const shippedOrder = mockOrderService.transitionOrderStatus(
      order.id,
      "shipped",
      "Steadfast Dispatcher"
    );
    expect(shippedOrder.orderStatus).toBe("shipped");

    const deliveredOrder = mockOrderService.transitionOrderStatus(
      order.id,
      "delivered",
      "Steadfast Courier"
    );
    expect(deliveredOrder.orderStatus).toBe("delivered");
  });

  it("5. Cancel an order and verify inventory restoration and customer metric sync", () => {
    const product = mockProductService.getProductById("prod-002")!;
    expect(product).toBeDefined();
    const initialStock = product.stock;
    const customer = mockCustomerService.getCustomerById("cust-002")!;
    expect(customer).toBeDefined();
    const initialSpend = customer.totalSpend;

    // Create a pending order
    const order = mockOrderService.createOrder({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      orderStatus: "pending",
      paymentStatus: "unpaid",
      items: [
        {
          id: "item-02",
          productId: product.id,
          title: product.title,
          sku: product.sku,
          price: product.price,
          quantity: 3,
          discount: 0,
          total: product.price * 3,
        },
      ],
      delivery: {
        courier: "Pathao",
        shippingFee: 60,
      },
    });

    // Stock was deducted upon order placement
    expect(mockProductService.getProductById(product.id)!.stock).toBe(initialStock - 3);

    // Cancel order with restockInventory: true
    const cancelledOrder = mockOrderService.cancelOrder(
      order.id,
      "Customer requested cancellation due to travel",
      "Support Staff",
      true
    );

    expect(cancelledOrder.orderStatus).toBe("cancelled");
    expect(cancelledOrder.cancellationReason).toContain("Customer requested cancellation");

    // Verify inventory restored
    const restoredProduct = mockProductService.getProductById(product.id)!;
    expect(restoredProduct.stock).toBe(initialStock);

    // Verify customer spend does not count cancelled order
    const refreshedCustomer = mockCustomerService.getCustomerById(customer.id)!;
    expect(refreshedCustomer.totalSpend).toBe(initialSpend);
  });

  it("6. Create a coupon and verify demo validation and discount calculation behavior", () => {
    const coupon = mockMarketingService.createCoupon({
      code: "EIDSPECIAL20",
      campaignName: "Eid Special Promotion",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 1500,
      maxDiscountCap: 500,
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      usageLimit: 100,
      perCustomerLimit: 1,
      customerEligibility: "all",
      status: "active",
      applicableCategories: [],
      applicableProducts: [],
    });

    expect(coupon.id).toBeDefined();
    expect(coupon.code).toBe("EIDSPECIAL20");
    expect(coupon.status).toBe("active");

    // Subtotal below minimum order threshold -> 0 discount
    const discountBelowMin = mockMarketingService.calculateCouponDiscount(coupon, 1000);
    expect(discountBelowMin).toBe(0);

    // Subtotal 2000 -> 20% of 2000 = 400 (under 500 cap)
    const discountNormal = mockMarketingService.calculateCouponDiscount(coupon, 2000);
    expect(discountNormal).toBe(400);

    // Subtotal 4000 -> 20% of 4000 = 800 (capped at 500)
    const discountCapped = mockMarketingService.calculateCouponDiscount(coupon, 4000);
    expect(discountCapped).toBe(500);

    // Toggle coupon inactive -> 0 discount
    mockMarketingService.toggleCouponStatus(coupon.id, "inactive");
    const inactiveCoupon = mockMarketingService.getCouponById(coupon.id)!;
    expect(mockMarketingService.calculateCouponDiscount(inactiveCoupon, 2000)).toBe(0);
  });

  it("7. Create a customer segment and verify matching customer records", async () => {
    // Create VIP segment: total spend >= ৳15,000
    const segment = await mockSegmentationService.createSegment({
      name: "Ultra VIP Merchants",
      description: "Customers who have spent at least ৳15,000",
      groupLogic: "AND",
      isActive: true,
      conditionGroups: [
        {
          id: "grp_1",
          logic: "AND",
          conditions: [
            {
              id: "cond_1",
              field: "total_spend",
              operator: "greater_than_or_equal",
              value: 15000,
            },
          ],
        },
      ],
    });

    expect(segment.id).toBeDefined();
    expect(segment.name).toBe("Ultra VIP Merchants");

    // Preview matching customers
    const preview = mockSegmentationService.evaluateSegment(
      segment.conditionGroups,
      segment.groupLogic
    );
    expect(preview.matchingCount).toBeGreaterThan(0);
    expect(preview.totalCustomers).toBe(8);
  });

  it("8. Generate analytics from updated demo records", async () => {
    const range = getDateRangeFromPreset("30d");
    const sales = mockAnalyticsService.getSalesAnalytics(range);
    expect(sales.totalRevenue).toBeGreaterThan(0);
    expect(sales.totalOrders).toBeGreaterThan(0);
    expect(sales.averageOrderValue).toBeGreaterThan(0);

    const customers = mockAnalyticsService.getCustomerAnalytics(range);
    expect(customers.totalCustomers).toBeGreaterThan(0);
    expect(customers.topCustomers.length).toBeGreaterThan(0);

    const products = mockAnalyticsService.getProductAnalytics(range);
    expect(products.totalProducts).toBeGreaterThan(0);
    expect(products.topSellingProducts.length).toBeGreaterThan(0);

    const overview = await mockAnalyticsService.getAnalyticsOverview(range);
    expect(overview.sales.totalRevenue).toBe(sales.totalRevenue);
  });

  it("9. Reset demo data and verify baseline state restoration across all modules", async () => {
    // Mutate state in various modules:
    // 1. Add product
    mockProductService.createProduct({
      title: "Temporary Product",
      slug: "temp-product",
      sku: "TEMP-SKU-99",
      price: 999,
      costPrice: 500,
      stock: 10,
      lowStockThreshold: 2,
      allowBackorders: false,
      trackInventory: true,
      category: "Test",
      status: "active",
      images: [],
    });

    // 2. Add team member
    await mockTeamService.inviteMember({
      name: "Temporary Staff",
      email: "temp.staff@example.com",
      role: "support",
      customPermissions: [],
    });

    // 3. Add order
    mockOrderService.createOrder({
      customerId: "cust-001",
      customerName: "Test Customer",
      customerPhone: "+8801700000000",
      orderStatus: "pending",
      paymentStatus: "unpaid",
      items: [
        {
          id: "item-temp",
          productId: "prod-001",
          title: "Item",
          sku: "SKU",
          price: 100,
          quantity: 1,
          discount: 0,
          total: 100,
        },
      ],
      delivery: { courier: "Steadfast", shippingFee: 60 },
    });

    // Perform centralized reset
    resetAllDemoData();

    // Verify baseline restored across ALL services:
    expect(mockProductService.getProducts({ limit: 100 }).items.some((p) => p.sku === "TEMP-SKU-99")).toBe(false);
    expect(mockProductService.getProducts({ limit: 100 }).items.length).toBe(12);

    expect(mockOrderService.getOrders({ limit: 100 }).orders.some((o) => o.customerPhone === "+8801700000000")).toBe(false);
    expect(mockOrderService.getOrders({ limit: 100 }).orders.length).toBe(15);

    expect(mockCustomerService.getCustomers().customers.length).toBe(8);

    const teamInvites = await mockTeamService.getTeamInvitations();
    expect(teamInvites.some((i) => i.email === "temp.staff@example.com")).toBe(false);
    const teamMembers = await mockTeamService.getTeamMembers();
    expect(teamMembers.length).toBe(5);

    expect(mockShippingService.getShipments({ limit: 100 }).shipments.length).toBe(5);
    expect(mockPaymentService.getTransactions({ limit: 100 }).transactions.length).toBe(12);
  });
});
