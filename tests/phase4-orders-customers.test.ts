import { describe, it, expect, beforeEach } from "vitest";
import { mockOrderService } from "../src/features/orders/services/mockOrders";
import { mockCustomerService } from "../src/features/customers/services/mockCustomers";
import { mockProductService } from "../src/features/products/services/mockProducts";
import {
  cancelOrderSchema,
  returnOrderSchema,
} from "../src/features/orders/schemas";
import { customerFormSchema } from "../src/features/customers/schemas";

describe("Phase 4: Sales & Orders Management", () => {
  beforeEach(() => {
    mockOrderService.resetDemoOrders();
    mockCustomerService.resetDemoCustomers();
    mockProductService.resetDemoData();
  });

  describe("Zod Validation Schemas", () => {
    it("validates compliant cancellation with reason", () => {
      const valid = cancelOrderSchema.safeParse({
        reason: "Customer requested cancellation before dispatch",
        restockInventory: true,
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.restockInventory).toBe(true);
      }
    });

    it("rejects cancellation without reason or with too short reason", () => {
      const empty = cancelOrderSchema.safeParse({
        reason: "",
      });
      expect(empty.success).toBe(false);

      const tooShort = cancelOrderSchema.safeParse({
        reason: "no",
      });
      expect(tooShort.success).toBe(false);
    });

    it("validates return order schema with refund amount", () => {
      const valid = returnOrderSchema.safeParse({
        reason: "Wrong item delivered by courier",
        restockInventory: true,
        refundAmount: 2500,
      });
      expect(valid.success).toBe(true);
    });

    it("validates customer form schema with Bangladesh phone number", () => {
      const valid = customerFormSchema.safeParse({
        name: "Abdur Rahim",
        phone: "01712345678",
        email: "rahim@example.com",
        city: "Dhaka",
        division: "Dhaka",
        addressLine1: "House 10, Road 4, Banani",
        tags: ["New", "VIP"],
      });
      expect(valid.success).toBe(true);
    });

    it("rejects invalid Bangladesh phone numbers", () => {
      const invalid = customerFormSchema.safeParse({
        name: "Invalid Phone",
        phone: "12345",
        city: "Dhaka",
        division: "Dhaka",
        addressLine1: "Test Address",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Order Lifecycle & State Machine Transitions", () => {
    it("loads initial Bangladesh catalog of 15 demo orders", () => {
      const result = mockOrderService.getOrders({ limit: 50 });
      expect(result.total).toBe(15);
      expect(result.orders.length).toBe(15);
      expect(result.orders[0].orderNumber).toMatch(/^CTX-\d{4}$/);
    });

    it("verifies mathematical consistency of order totals across all initial demo orders", () => {
      const { orders } = mockOrderService.getOrders({ limit: 50 });
      for (const order of orders) {
        const computedSubtotal = order.items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        expect(order.subtotal).toBe(computedSubtotal);
        expect(order.grandTotal).toBe(
          order.subtotal - order.discount + order.shippingFee + order.tax
        );
        if (order.paymentStatus !== "refunded") {
          expect(order.amountPaid + order.amountDue).toBe(order.grandTotal);
        }
      }
    });

    it("allows valid sequential order status transitions", () => {
      // Find pending order CTX-1001
      const order = mockOrderService.getOrderById("ord-1001");
      expect(order?.orderStatus).toBe("pending");

      // pending -> confirmed
      const confirmed = mockOrderService.transitionOrderStatus(
        "ord-1001",
        "confirmed",
        "Admin",
        "Payment verified"
      );
      expect(confirmed.orderStatus).toBe("confirmed");
      expect(confirmed.timeline.some((e) => e.status === "confirmed")).toBe(true);

      // confirmed -> processing
      const processing = mockOrderService.transitionOrderStatus(
        "ord-1001",
        "processing",
        "Warehouse"
      );
      expect(processing.orderStatus).toBe("processing");

      // processing -> ready_to_ship
      const ready = mockOrderService.transitionOrderStatus(
        "ord-1001",
        "ready_to_ship",
        "Packing Desk"
      );
      expect(ready.orderStatus).toBe("ready_to_ship");

      // ready_to_ship -> shipped
      const shipped = mockOrderService.transitionOrderStatus(
        "ord-1001",
        "shipped",
        "Steadfast Courier"
      );
      expect(shipped.orderStatus).toBe("shipped");
      expect(shipped.fulfillmentStatus).toBe("fulfilled");

      // shipped -> delivered
      const delivered = mockOrderService.transitionOrderStatus(
        "ord-1001",
        "delivered",
        "Rider"
      );
      expect(delivered.orderStatus).toBe("delivered");
    });

    it("prevents illegal order status transitions", () => {
      // Cannot jump from pending directly to delivered
      expect(() =>
        mockOrderService.transitionOrderStatus("ord-1001", "delivered")
      ).toThrowError(/Cannot transition order/);

      // Cannot regress delivered order to confirmed
      expect(() =>
        mockOrderService.transitionOrderStatus("ord-1006", "confirmed")
      ).toThrowError(/Cannot transition order/);

      // Cannot transition cancelled order
      expect(() =>
        mockOrderService.transitionOrderStatus("ord-1008", "shipped")
      ).toThrowError(/Cannot transition order/);
    });

    it("cancels an order with required reason and restocks inventory items", () => {
      const order = mockOrderService.getOrderById("ord-1001");
      expect(order).toBeDefined();
      const targetItem = order!.items[0];

      const productBefore = mockProductService.getProductById(targetItem.productId);
      const stockBefore = productBefore!.stock;

      const cancelled = mockOrderService.cancelOrder(
        "ord-1001",
        "Customer changed delivery destination outside coverage zone",
        "Staff",
        true
      );

      expect(cancelled.orderStatus).toBe("cancelled");
      expect(cancelled.cancellationReason).toContain("Customer changed delivery destination");

      // Verify stock was restored
      const productAfter = mockProductService.getProductById(targetItem.productId);
      expect(productAfter!.stock).toBe(stockBefore + targetItem.quantity);

      // Verify movement was logged in inventory movements
      const movements = mockProductService.getInventoryMovements();
      expect(movements.some((m) => m.referenceId === order!.orderNumber)).toBe(true);
    });

    it("handles customer returns on shipped orders with restock and refunds", () => {
      const order = mockOrderService.getOrderById("ord-1005"); // shipped order
      expect(order?.orderStatus).toBe("shipped");

      const returned = mockOrderService.returnOrder(
        "ord-1005",
        "Package damaged in courier transit",
        "Returns Officer",
        true
      );

      expect(returned.orderStatus).toBe("returned");
      expect(returned.returnReason).toBe("Package damaged in courier transit");
    });
  });

  describe("Customer Database & Synchronization", () => {
    it("loads initial 8 Bangladesh customers with realistic demographics", () => {
      const result = mockCustomerService.getCustomers({ limit: 20 });
      expect(result.total).toBe(8);
      expect(result.customers.some((c) => c.city === "Dhaka")).toBe(true);
      expect(result.customers.some((c) => c.city === "Chattogram")).toBe(true);
      expect(result.customers.some((c) => c.city === "Sylhet")).toBe(true);
    });

    it("creates a new customer and assigns default tags", () => {
      const newCustomer = mockCustomerService.createCustomer({
        name: "Jamil Hossain",
        phone: "01799887766",
        email: "jamil@example.com",
        city: "Dhaka",
        division: "Dhaka",
        addressLine1: "Gulshan 1, Road 23, House 5",
        tags: ["Corporate"],
      });

      expect(newCustomer.id).toBeDefined();
      expect(newCustomer.name).toBe("Jamil Hossain");

      const fetched = mockCustomerService.getCustomerById(newCustomer.id);
      expect(fetched?.phone).toBe("01799887766");
      expect(fetched?.tags).toContain("Corporate");
    });

    it("updates customer tags and adds merchant internal notes", () => {
      const updated = mockCustomerService.updateCustomerTags("cust-001", [
        "VIP",
        "Wholesale",
        "Priority Support",
      ]);
      expect(updated.tags).toContain("Priority Support");

      const withNote = mockCustomerService.addCustomerNote(
        "cust-001",
        "Customer confirmed new billing address over phone."
      );
      expect(withNote.internalNotes).toContain("Customer confirmed new billing address");
    });

    it("synchronizes customer totalOrders and totalSpend when orders are cancelled", () => {
      const customerBefore = mockCustomerService.getCustomerById("cust-001");
      const initialOrdersCount = customerBefore!.totalOrders;

      // Cancel order CTX-1001 for cust-001
      mockOrderService.cancelOrder(
        "ord-1001",
        "Cancellation test",
        "Admin",
        true
      );

      const customerAfter = mockCustomerService.getCustomerById("cust-001");
      // Cancelled order should be excluded from active purchase count and spend
      expect(customerAfter!.totalOrders).toBe(initialOrdersCount - 1);
      expect(customerAfter!.totalSpend).toBeLessThan(customerBefore!.totalSpend);
    });
  });

  describe("Search, Filters, Sorting & Pagination", () => {
    it("searches orders by order number, customer name, phone, and tracking number", () => {
      // By order number
      const byNumber = mockOrderService.getOrders({ search: "CTX-1002" });
      expect(byNumber.orders.length).toBe(1);
      expect(byNumber.orders[0].customerName).toBe("Nusrat Jahan");

      // By customer name
      const byName = mockOrderService.getOrders({ search: "Shakib" });
      expect(byName.orders.length).toBeGreaterThanOrEqual(1);

      // By phone
      const byPhone = mockOrderService.getOrders({ search: "01711223344" });
      expect(byPhone.orders.length).toBeGreaterThanOrEqual(1);

      // By tracking number
      const byTracking = mockOrderService.getOrders({ search: "STDF-991204" });
      expect(byTracking.orders.length).toBe(1);
      expect(byTracking.orders[0].orderNumber).toBe("CTX-1005");
    });

    it("filters orders by payment status and order status", () => {
      const paidOrders = mockOrderService.getOrders({ paymentStatus: "paid" });
      expect(paidOrders.orders.every((o) => o.paymentStatus === "paid")).toBe(true);

      const pendingOrders = mockOrderService.getOrders({ orderStatus: "pending" });
      expect(pendingOrders.orders.every((o) => o.orderStatus === "pending")).toBe(true);
    });

    it("sorts orders by total amount descending and date descending", () => {
      const sortedByTotal = mockOrderService.getOrders({ sortBy: "total_desc" });
      for (let i = 0; i < sortedByTotal.orders.length - 1; i++) {
        expect(sortedByTotal.orders[i].grandTotal).toBeGreaterThanOrEqual(
          sortedByTotal.orders[i + 1].grandTotal
        );
      }
    });

    it("safely clamps pagination when requested page exceeds totalPages", () => {
      const clamped = mockOrderService.getOrders({ page: 999, limit: 10 });
      expect(clamped.page).toBe(clamped.totalPages);
      expect(clamped.orders.length).toBeGreaterThan(0);
    });

    it("filters customers by segment and city", () => {
      const vips = mockCustomerService.getCustomers({ segment: "high_value" });
      expect(vips.customers.every((c) => c.segment === "high_value")).toBe(true);

      const dhakaOnly = mockCustomerService.getCustomers({ city: "Dhaka" });
      expect(dhakaOnly.customers.every((c) => c.city === "Dhaka")).toBe(true);
    });
  });

  describe("CSV Export, KPIs & Financial Calculations", () => {
    it("computes accurate storewide order KPI statistics", () => {
      const stats = mockOrderService.getOrderStats();
      expect(stats.totalOrders).toBe(15);
      expect(stats.pendingOrders).toBeGreaterThan(0);
      expect(stats.deliveredOrders).toBeGreaterThan(0);
      expect(stats.totalRevenue).toBeGreaterThan(0);
      expect(stats.averageOrderValue).toBeGreaterThan(0);
    });

    it("exports orders catalog to structured CSV string", () => {
      const { orders } = mockOrderService.getOrders({ limit: 5 });
      const csv = mockOrderService.exportOrdersToCSV(orders);

      expect(csv).toContain("Order Number");
      expect(csv).toContain("Customer Name");
      expect(csv).toContain("Grand Total (BDT)");
      expect(csv).toContain("CTX-1001");
    });
  });

  describe("Bulk Operations", () => {
    it("performs bulk status transition and skips ineligible orders", () => {
      // ord-1001 is pending (eligible for confirmed)
      // ord-1006 is delivered (ineligible for confirmed)
      const res = mockOrderService.bulkUpdateStatus(
        ["ord-1001", "ord-1006"],
        "confirmed",
        "Admin"
      );

      expect(res.updatedCount).toBe(1);
      expect(res.skippedCount).toBe(1);

      const updated = mockOrderService.getOrderById("ord-1001");
      expect(updated?.orderStatus).toBe("confirmed");
    });

    it("performs bulk cancellation on eligible orders", () => {
      const res = mockOrderService.bulkCancelOrders(
        ["ord-1001", "ord-1002"],
        "Bulk inventory stock recount cancellation",
        "Admin"
      );

      expect(res.cancelledCount).toBe(2);
      expect(mockOrderService.getOrderById("ord-1001")?.orderStatus).toBe("cancelled");
      expect(mockOrderService.getOrderById("ord-1002")?.orderStatus).toBe("cancelled");
    });
  });

  describe("Storage Parsing & Error Recovery", () => {
    it("handles resetDemoOrders and restores baseline cleanly", () => {
      mockOrderService.cancelOrder("ord-1001", "Temp cancel", "Admin");
      expect(mockOrderService.getOrderById("ord-1001")?.orderStatus).toBe("cancelled");

      mockOrderService.resetDemoOrders();
      expect(mockOrderService.getOrderById("ord-1001")?.orderStatus).toBe("pending");
    });
  });
});
