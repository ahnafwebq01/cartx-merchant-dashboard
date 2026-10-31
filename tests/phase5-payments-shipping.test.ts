import { describe, it, expect, beforeEach } from "vitest";
import { mockPaymentService } from "../src/features/payments/services/mockPayments";
import { mockShippingService } from "../src/features/shipping/services/mockShipping";
import { mockOrderService } from "../src/features/orders/services/mockOrders";
import { mockCustomerService } from "../src/features/customers/services/mockCustomers";
import {
  initiatePaymentSchema,
  verifyPaymentSchema,
  requestRefundSchema,
  configurePaymentMethodSchema,
} from "../src/features/payments/schemas";
import {
  createShipmentSchema,
  cancelShipmentSchema,
  shippingRatesSchema,
} from "../src/features/shipping/schemas";
import {
  BkashPaymentAdapter,
  NagadPaymentAdapter,
  SslcommerzPaymentAdapter,
  CodPaymentAdapter,
  paymentAdapterRegistry,
} from "../src/features/payments/adapters";
import {
  SteadfastCourierAdapter,
  PathaoCourierAdapter,
  RedxCourierAdapter,
  courierAdapterRegistry,
} from "../src/features/shipping/adapters";

describe("Phase 5: Local Payments & Courier Logistics", () => {
  beforeEach(() => {
    mockOrderService.resetDemoOrders();
    mockCustomerService.resetDemoCustomers();
    mockPaymentService.resetDemoPayments();
    mockShippingService.resetDemoShipping();
  });

  describe("1. Payments Schema Validation", () => {
    it("validates compliant payment initiation payload with Bangladesh phone", () => {
      const valid = initiatePaymentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        customerName: "Tanvir Ahmed",
        customerPhone: "01711223344",
        amount: 12560,
        provider: "bkash",
        idempotencyKey: "test-idem-key-1001",
      });
      expect(valid.success).toBe(true);
    });

    it("accepts +880 format for Bangladesh phone in payment initiation", () => {
      const valid = initiatePaymentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        customerName: "Tanvir Ahmed",
        customerPhone: "+8801711223344",
        amount: 12560,
        provider: "nagad",
        idempotencyKey: "test-idem-key-1002",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects non-positive payment amount or invalid phone", () => {
      const invalidAmount = initiatePaymentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        customerName: "Tanvir Ahmed",
        customerPhone: "01711223344",
        amount: 0,
        provider: "bkash",
        idempotencyKey: "test-idem-key-1003",
      });
      expect(invalidAmount.success).toBe(false);

      const invalidPhone = initiatePaymentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        customerName: "Tanvir Ahmed",
        customerPhone: "12345",
        amount: 100,
        provider: "bkash",
        idempotencyKey: "test-idem-key-1004",
      });
      expect(invalidPhone.success).toBe(false);
    });

    it("validates payment verification schema", () => {
      const valid = verifyPaymentSchema.safeParse({
        transactionId: "trx-1001",
        gatewayTransactionId: "BKH8812903",
        status: "successful",
      });
      expect(valid.success).toBe(true);
    });

    it("validates refund request schema requiring positive amount and reason", () => {
      const valid = requestRefundSchema.safeParse({
        transactionId: "trx-1001",
        orderId: "ord-1002",
        orderNumber: "CTX-1002",
        customerName: "Nusrat Jahan",
        amount: 1910,
        reason: "Customer returned merchandise due to incorrect size",
        idempotencyKey: "ref-idem-test-1001",
        requestedBy: "Merchant Admin",
      });
      expect(valid.success).toBe(true);

      const tooShortReason = requestRefundSchema.safeParse({
        transactionId: "trx-1001",
        orderId: "ord-1002",
        orderNumber: "CTX-1002",
        customerName: "Nusrat Jahan",
        amount: 1910,
        reason: "bad",
        idempotencyKey: "ref-idem-test-1002",
        requestedBy: "Merchant Admin",
      });
      expect(tooShortReason.success).toBe(false);
    });

    it("validates payment method configuration schema without exposing secrets", () => {
      const valid = configurePaymentMethodSchema.safeParse({
        provider: "bkash",
        isEnabled: true,
        environment: "sandbox",
        merchantId: "01700000000",
        accountIdentifier: "01700000000",
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("2. Payment Gateways & Adapter Boundaries", () => {
    it("registers all required Bangladesh payment adapters", () => {
      expect(paymentAdapterRegistry.get("bkash")).toBeInstanceOf(BkashPaymentAdapter);
      expect(paymentAdapterRegistry.get("nagad")).toBeInstanceOf(NagadPaymentAdapter);
      expect(paymentAdapterRegistry.get("sslcommerz")).toBeInstanceOf(SslcommerzPaymentAdapter);
      expect(paymentAdapterRegistry.get("cod")).toBeInstanceOf(CodPaymentAdapter);
    });

    it("bKash adapter initializes tokenized checkout with demo simulation disclosure", async () => {
      const bkash = new BkashPaymentAdapter();
      const res = await bkash.initiatePayment({
        orderId: "ord-test",
        orderNumber: "CTX-TEST",
        amount: 2500,
        customerPhone: "01711223344",
        customerName: "Tester",
        idempotencyKey: "idem-bkash-test-1",
      });

      expect(res.status).toBe("pending");
      expect(res.isDemoSimulation).toBe(true);
      expect(res.redirectUrl).toContain("checkout.sandbox.bka.sh");
      expect(res.gatewayReference).toMatch(/^BKSH-PAY-/);
    });

    it("bKash adapter rejects non-positive payment amount or missing idempotency", async () => {
      const bkash = new BkashPaymentAdapter();
      await expect(
        bkash.initiatePayment({
          orderId: "ord-test",
          orderNumber: "CTX-TEST",
          amount: 0,
          customerPhone: "01711223344",
          customerName: "Tester",
          idempotencyKey: "idem-test",
        })
      ).rejects.toThrow(/greater than 0/);

      await expect(
        bkash.initiatePayment({
          orderId: "ord-test",
          orderNumber: "CTX-TEST",
          amount: 500,
          customerPhone: "01711223344",
          customerName: "Tester",
          idempotencyKey: "",
        })
      ).rejects.toThrow(/Idempotency key required/);
    });

    it("Nagad adapter initializes direct checkout session and checks health", async () => {
      const nagad = new NagadPaymentAdapter();
      const res = await nagad.initiatePayment({
        orderId: "ord-test",
        orderNumber: "CTX-TEST",
        amount: 1500,
        customerPhone: "01811223344",
        customerName: "Tester",
        idempotencyKey: "idem-nagad-test-1",
      });

      expect(res.status).toBe("pending");
      expect(res.gatewayReference).toMatch(/^NGD-REF-/);

      const health = await nagad.checkHealth();
      expect(health.provider).toBe("nagad");
      expect(health.status).toBe("demo_mode");
      expect(health.isDemo).toBe(true);
    });

    it("SSLCommerz adapter initializes hosted gateway session", async () => {
      const ssl = new SslcommerzPaymentAdapter();
      const res = await ssl.initiatePayment({
        orderId: "ord-test",
        orderNumber: "CTX-TEST",
        amount: 4500,
        customerPhone: "01711223344",
        customerName: "Tester",
        idempotencyKey: "idem-ssl-test-1",
      });

      expect(res.status).toBe("pending");
      expect(res.redirectUrl).toContain("sandbox.sslcommerz.com");
      expect(res.gatewayReference).toMatch(/^SSL-SESS-/);
    });

    it("Cash on Delivery adapter handles pending collection and local health check", async () => {
      const cod = new CodPaymentAdapter();
      const res = await cod.initiatePayment({
        orderId: "ord-test",
        orderNumber: "CTX-TEST",
        amount: 1200,
        customerPhone: "01711223344",
        customerName: "Tester",
        idempotencyKey: "idem-cod-test-1",
      });

      expect(res.status).toBe("pending");
      expect(res.isDemoSimulation).toBe(false);

      const health = await cod.checkHealth();
      expect(health.provider).toBe("cod");
      expect(health.status).toBe("connected");
      expect(health.isDemo).toBe(false);
    });
  });

  describe("3. Payment Service, Idempotency & Duplicate Prevention", () => {
    it("loads baseline transactions linked to initial orders", () => {
      const { transactions, total } = mockPaymentService.getTransactions();
      expect(total).toBe(12);
      expect(transactions.length).toBeGreaterThan(0);
      expect(transactions.some((t) => t.provider === "bkash")).toBe(true);
      expect(transactions.some((t) => t.provider === "nagad")).toBe(true);
      expect(transactions.some((t) => t.provider === "sslcommerz")).toBe(true);
      expect(transactions.some((t) => t.provider === "cod")).toBe(true);
    });

    it("prevents duplicate payment transactions using idempotency key", async () => {
      const initialTotal = mockPaymentService.getTransactions().total;

      const input = {
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        customerName: "Tanvir Ahmed",
        customerPhone: "01711223344",
        amount: 12560,
        provider: "bkash" as const,
        idempotencyKey: "unique-idem-payment-key-999",
      };

      const first = await mockPaymentService.initiatePayment(input);
      expect(mockPaymentService.getTransactions().total).toBe(initialTotal + 1);

      // Re-dispatching with identical idempotencyKey returns existing record without creating duplicate
      const second = await mockPaymentService.initiatePayment(input);
      expect(second.id).toBe(first.id);
      expect(mockPaymentService.getTransactions().total).toBe(initialTotal + 1);
    });

    it("verifies payment and synchronizes order status to paid", async () => {
      // ord-1001 starts as unpaid COD in initial demo orders
      const orderBefore = mockOrderService.getOrderById("ord-1001");
      expect(orderBefore?.paymentStatus).toBe("unpaid");

      const tx = mockPaymentService.getTransactionByOrderId("ord-1001");
      expect(tx).toBeDefined();

      if (tx) {
        const verified = await mockPaymentService.verifyPayment({
          transactionId: tx.id,
          gatewayTransactionId: "BKH-VERIFIED-9910",
          status: "successful",
        });

        expect(verified.status).toBe("successful");
        expect(verified.gatewayTransactionId).toBe("BKH-VERIFIED-9910");

        // Linked order should now be marked as paid
        const orderAfter = mockOrderService.getOrderById("ord-1001");
        expect(orderAfter?.paymentStatus).toBe("paid");
        expect(orderAfter?.paymentReference).toBe("BKH-VERIFIED-9910");
      }
    });

    it("calculates accurate payment KPI statistics", () => {
      const kpis = mockPaymentService.getPaymentKPIs();
      expect(kpis.totalGrossVolume).toBeGreaterThan(0);
      expect(kpis.successfulTransactionsCount).toBeGreaterThan(0);
      expect(kpis.pendingTransactionsCount).toBeGreaterThan(0);
      expect(kpis.activeMethodsCount).toBe(4);
    });

    it("exports payment transactions to valid CSV format", () => {
      const { transactions } = mockPaymentService.getTransactions({ limit: 5 });
      const csv = mockPaymentService.exportTransactionsToCSV(transactions);
      expect(csv).toContain("Transaction ID");
      expect(csv).toContain("Order Number");
      expect(csv).toContain("Amount (BDT)");
      expect(csv).toContain("CTX-");
    });
  });

  describe("4. Refund Lifecycle & Balance Protection", () => {
    it("processes valid refund against successful transaction", async () => {
      const tx = mockPaymentService.getTransactionById("trx-1001"); // ৳7,760 paid via bKash
      expect(tx).toBeDefined();

      if (tx) {
        const refund = await mockPaymentService.requestRefund({
          transactionId: tx.id,
          orderId: tx.orderId,
          orderNumber: tx.orderNumber,
          customerName: tx.customerName,
          amount: 7760,
          reason: "Defective item returned by customer",
          idempotencyKey: "ref-test-idem-991",
          requestedBy: "Merchant Admin",
        });

        expect(refund.status).toBe("processed");
        expect(refund.amount).toBe(7760);
        expect(refund.gatewayRefundId).toMatch(/^BKH-REF-/);

        // Transaction status should transition to refunded
        const updatedTx = mockPaymentService.getTransactionById("trx-1001");
        expect(updatedTx?.status).toBe("refunded");
        expect(updatedTx?.refundedAmount).toBe(7760);
      }
    });

    it("rejects refund if amount exceeds available refundable balance", async () => {
      const tx = mockPaymentService.getTransactionById("trx-1003"); // ৳1,740
      expect(tx).toBeDefined();

      if (tx) {
        await expect(
          mockPaymentService.requestRefund({
            transactionId: tx.id,
            orderId: tx.orderId,
            orderNumber: tx.orderNumber,
            customerName: tx.customerName,
            amount: 5000, // Exceeds ৳1,740
            reason: "Excessive refund amount",
            idempotencyKey: "ref-test-excessive",
            requestedBy: "Merchant Admin",
          })
        ).rejects.toThrow(/exceeds available refundable balance/);
      }
    });

    it("rejects refund on pending or un-paid transaction", async () => {
      const pendingTx = mockPaymentService.getTransactionById("trx-1010"); // pending COD
      expect(pendingTx?.status).toBe("pending");

      if (pendingTx) {
        await expect(
          mockPaymentService.requestRefund({
            transactionId: pendingTx.id,
            orderId: pendingTx.orderId,
            orderNumber: pendingTx.orderNumber,
            customerName: pendingTx.customerName,
            amount: 500,
            reason: "Attempt refund on unpaid order",
            idempotencyKey: "ref-test-unpaid",
            requestedBy: "Merchant Admin",
          })
        ).rejects.toThrow(/Only successful payments can be refunded/);
      }
    });

    it("prevents duplicate refunds using idempotency key", async () => {
      const tx = mockPaymentService.getTransactionById("trx-1002"); // ৳7,620
      expect(tx).toBeDefined();

      if (tx) {
        const input = {
          transactionId: tx.id,
          orderId: tx.orderId,
          orderNumber: tx.orderNumber,
          customerName: tx.customerName,
          amount: 500,
          reason: "Partial price concession",
          idempotencyKey: "ref-duplicate-prevention-key-1",
          requestedBy: "Merchant Admin",
        };

        const first = await mockPaymentService.requestRefund(input);
        const second = await mockPaymentService.requestRefund(input);

        expect(second.id).toBe(first.id);
      }
    });
  });

  describe("5. Shipping Schemas & Courier Adapter Boundaries", () => {
    it("validates compliant shipment creation payload", () => {
      const valid = createShipmentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        courier: "steadfast",
        recipientName: "Tanvir Ahmed",
        recipientPhone: "01711223344",
        deliveryAddress: "House 42, Road 7/A, Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        weightKg: 0.8,
        codAmount: 12560,
        deliveryCharge: 60,
        deliveryType: "standard",
        pickupLocation: "Dhaka Central Warehouse",
        idempotencyKey: "shp-idem-test-1",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects non-positive parcel weight", () => {
      const invalid = createShipmentSchema.safeParse({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        courier: "steadfast",
        recipientName: "Tanvir Ahmed",
        recipientPhone: "01711223344",
        deliveryAddress: "House 42, Road 7/A, Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        weightKg: 0,
        codAmount: 0,
        deliveryCharge: 60,
        deliveryType: "standard",
        pickupLocation: "Dhaka Central Warehouse",
        idempotencyKey: "shp-idem-test-2",
      });
      expect(invalid.success).toBe(false);
    });

    it("validates cancel shipment schema and shipping rates schema", () => {
      const validCancel = cancelShipmentSchema.safeParse({
        shipmentId: "shp-1001",
        reason: "Customer changed mind before dispatch",
      });
      expect(validCancel.success).toBe(true);

      const validRates = shippingRatesSchema.safeParse({
        insideDhakaRate: 60,
        outsideDhakaRate: 120,
        freeShippingThreshold: 5000,
        codFeePercentage: 1,
        defaultCourier: "steadfast",
      });
      expect(validRates.success).toBe(true);
    });

    it("normalizes Steadfast raw courier statuses correctly", () => {
      const steadfast = new SteadfastCourierAdapter();
      expect(steadfast.normalizeStatus("in_review")).toBe("pending");
      expect(steadfast.normalizeStatus("pending")).toBe("pending");
      expect(steadfast.normalizeStatus("picked_up")).toBe("picked_up");
      expect(steadfast.normalizeStatus("in_transit")).toBe("in_transit");
      expect(steadfast.normalizeStatus("hold")).toBe("in_transit");
      expect(steadfast.normalizeStatus("delivered")).toBe("delivered");
      expect(steadfast.normalizeStatus("partial_delivered")).toBe("delivered");
      expect(steadfast.normalizeStatus("cancelled")).toBe("cancelled");
      expect(steadfast.normalizeStatus("returned")).toBe("returned");
      expect(steadfast.normalizeStatus("delivery_failed")).toBe("failed");
    });

    it("normalizes Pathao raw courier statuses correctly", () => {
      const pathao = new PathaoCourierAdapter();
      expect(pathao.normalizeStatus("Pickup_Requested")).toBe("pending");
      expect(pathao.normalizeStatus("Assigned_For_Pickup")).toBe("pending");
      expect(pathao.normalizeStatus("Picked_Up")).toBe("picked_up");
      expect(pathao.normalizeStatus("In_Transit")).toBe("in_transit");
      expect(pathao.normalizeStatus("Delivered")).toBe("delivered");
      expect(pathao.normalizeStatus("Return")).toBe("returned");
      expect(pathao.normalizeStatus("Delivery_Failed")).toBe("failed");
      expect(pathao.normalizeStatus("Cancelled")).toBe("cancelled");
    });

    it("normalizes RedX raw courier statuses correctly", () => {
      const redx = new RedxCourierAdapter();
      expect(redx.normalizeStatus("ready_for_pickup")).toBe("pending");
      expect(redx.normalizeStatus("pickup_done")).toBe("picked_up");
      expect(redx.normalizeStatus("in_transit")).toBe("in_transit");
      expect(redx.normalizeStatus("delivered")).toBe("delivered");
      expect(redx.normalizeStatus("agent_returning")).toBe("returned");
      expect(redx.normalizeStatus("returned")).toBe("returned");
      expect(redx.normalizeStatus("cancelled")).toBe("cancelled");
    });

    it("registers all required Bangladesh courier adapters", () => {
      expect(courierAdapterRegistry.get("steadfast")).toBeInstanceOf(SteadfastCourierAdapter);
      expect(courierAdapterRegistry.get("pathao")).toBeInstanceOf(PathaoCourierAdapter);
      expect(courierAdapterRegistry.get("redx")).toBeInstanceOf(RedxCourierAdapter);
    });
  });

  describe("6. Shipping Service, Duplicate Prevention & Consignment Creation", () => {
    it("loads initial demo shipments linked to initial orders", () => {
      const { shipments, total } = mockShippingService.getShipments();
      expect(total).toBe(5);
      expect(shipments.length).toBe(5);
      expect(shipments.some((s) => s.courier === "steadfast")).toBe(true);
      expect(shipments.some((s) => s.courier === "pathao")).toBe(true);
      expect(shipments.some((s) => s.courier === "redx")).toBe(true);
    });

    it("creates a new consignment and links tracking info to order", async () => {
      // Order ord-1001 (CTX-1001) has no active consignment initially
      const orderBefore = mockOrderService.getOrderById("ord-1001");
      expect(orderBefore?.delivery.consignmentId).toBeUndefined();

      const newShipment = await mockShippingService.createShipment({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        courier: "steadfast",
        recipientName: "Tanvir Ahmed",
        recipientPhone: "+8801711223344",
        deliveryAddress: "House 42, Road 7/A, Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        weightKg: 1.0,
        codAmount: 12560,
        deliveryCharge: 60,
        deliveryType: "standard",
        pickupLocation: "Dhaka Warehouse",
        idempotencyKey: "test-shp-create-1001",
      });

      expect(newShipment.status).toBe("pending");
      expect(newShipment.consignmentId).toMatch(/^STDF-/);
      expect(newShipment.trackingId).toMatch(/^STDF\d+BD/);

      // Order delivery should now be updated with tracking number and consignment ID
      const orderAfter = mockOrderService.getOrderById("ord-1001");
      expect(orderAfter?.delivery.trackingNumber).toBe(newShipment.trackingId);
      expect(orderAfter?.delivery.consignmentId).toBe(newShipment.consignmentId);
    });

    it("prevents creating duplicate active shipments for the same order", async () => {
      // CTX-1002 already has an active in_transit shipment (shp-1001)
      await expect(
        mockShippingService.createShipment({
          orderId: "ord-1002",
          orderNumber: "CTX-1002",
          courier: "pathao",
          recipientName: "Nusrat Jahan",
          recipientPhone: "+8801819334455",
          deliveryAddress: "Uttara",
          city: "Dhaka",
          district: "Dhaka",
          weightKg: 1.0,
          codAmount: 0,
          deliveryCharge: 60,
          deliveryType: "standard",
          pickupLocation: "Dhaka Warehouse",
          idempotencyKey: "different-idem-key-for-ord-1002",
        })
      ).rejects.toThrow(/Active shipment .* already exists for order CTX-1002/);
    });

    it("prevents duplicate creation via identical idempotencyKey", async () => {
      const initialTotal = mockShippingService.getShipments().total;

      const input = {
        orderId: "ord-1008",
        orderNumber: "CTX-1008",
        courier: "pathao" as const,
        recipientName: "Test Customer",
        recipientPhone: "01711223344",
        deliveryAddress: "Banani",
        city: "Dhaka",
        district: "Dhaka",
        weightKg: 0.5,
        codAmount: 0,
        deliveryCharge: 60,
        deliveryType: "standard" as const,
        pickupLocation: "Dhaka Warehouse",
        idempotencyKey: "idem-shp-retry-test-1008",
      };

      const first = await mockShippingService.createShipment(input);
      expect(mockShippingService.getShipments().total).toBe(initialTotal + 1);

      const second = await mockShippingService.createShipment(input);
      expect(second.id).toBe(first.id);
      expect(mockShippingService.getShipments().total).toBe(initialTotal + 1);
    });

    it("cancels an active shipment and appends timeline event", async () => {
      const shipment = mockShippingService.getShipmentById("shp-1004"); // pending
      expect(shipment?.status).toBe("pending");

      const cancelled = await mockShippingService.cancelShipment({
        shipmentId: "shp-1004",
        reason: "Customer changed delivery address before courier pickup",
      });

      expect(cancelled.status).toBe("cancelled");
      expect(cancelled.timeline.some((e) => e.status === "cancelled")).toBe(true);
    });

    it("rejects cancellation of delivered shipments", async () => {
      const delivered = mockShippingService.getShipmentById("shp-1002"); // delivered
      expect(delivered?.status).toBe("delivered");

      await expect(
        mockShippingService.cancelShipment({
          shipmentId: "shp-1002",
          reason: "Attempt cancel after delivery",
        })
      ).rejects.toThrow(/Delivered shipments cannot be cancelled/);
    });

    it("exports shipments to valid CSV format", () => {
      const { shipments } = mockShippingService.getShipments({ limit: 5 });
      const csv = mockShippingService.exportShipmentsToCSV(shipments);
      expect(csv).toContain("Shipment ID");
      expect(csv).toContain("Consignment ID");
      expect(csv).toContain("Courier");
      expect(csv).toContain("COD Amount (BDT)");
    });
  });

  describe("7. Separation of Concerns & Cross-Module Invariants", () => {
    it("ensures marking payment as successful does NOT automatically mark order as delivered", async () => {
      const order = mockOrderService.getOrderById("ord-1001"); // status: pending, payment: unpaid
      expect(order?.orderStatus).toBe("pending");

      mockOrderService.markPaymentStatus("ord-1001", "paid", "BKH-INDEP-TEST-1");

      const orderAfterPayment = mockOrderService.getOrderById("ord-1001");
      expect(orderAfterPayment?.paymentStatus).toBe("paid");
      // CRITICAL: Order fulfillment stage must remain unchanged!
      expect(orderAfterPayment?.orderStatus).toBe("pending");
      expect(orderAfterPayment?.orderStatus).not.toBe("delivered");
    });

    it("ensures creating a shipment does NOT automatically mark order as delivered", async () => {
      // Create shipment for ord-1001
      await mockShippingService.createShipment({
        orderId: "ord-1001",
        orderNumber: "CTX-1001",
        courier: "pathao",
        recipientName: "Tanvir Ahmed",
        recipientPhone: "+8801711223344",
        deliveryAddress: "Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        weightKg: 1.0,
        codAmount: 12560,
        deliveryCharge: 60,
        deliveryType: "standard",
        pickupLocation: "Dhaka Warehouse",
        idempotencyKey: "test-separate-fulfillment-key-1",
      });

      const orderAfterShipment = mockOrderService.getOrderById("ord-1001");
      // Tracking details are linked
      expect(orderAfterShipment?.delivery.trackingNumber).toBeDefined();
      // But fulfillment state remains pending (not magically delivered)
      expect(orderAfterShipment?.orderStatus).toBe("pending");
      expect(orderAfterShipment?.orderStatus).not.toBe("delivered");
    });

    it("preserves order payment status and amount paid when refunds are processed", async () => {
      const orderBefore = mockOrderService.getOrderById("ord-1002");
      expect(orderBefore?.paymentStatus).toBe("paid");
      expect(orderBefore?.amountPaid).toBe(7760);

      // Process refund for ord-1002
      await mockPaymentService.requestRefund({
        transactionId: "trx-1001",
        orderId: "ord-1002",
        orderNumber: "CTX-1002",
        customerName: "Nusrat Jahan",
        amount: 7760,
        reason: "Defective dress returned",
        idempotencyKey: "ref-customer-sync-test-1",
        requestedBy: "Merchant Admin",
      });

      const orderAfter = mockOrderService.getOrderById("ord-1002");
      expect(orderAfter?.paymentStatus).toBe("refunded");
      expect(orderAfter?.amountPaid).toBe(0);
      expect(orderAfter?.amountDue).toBe(7760);
      expect(orderAfter?.timeline.some((e) => e.title.includes("Refund"))).toBe(true);
    });
  });
});
