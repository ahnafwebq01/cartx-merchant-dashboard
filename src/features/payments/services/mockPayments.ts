import type {
  PaymentFilterParams,
  PaymentKPIStats,
  PaymentMethodConfig,
  PaymentRefund,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaginatedPaymentsResult,
  PaginatedRefundsResult,
  RefundStatus,
} from "../types";
import { paymentAdapterRegistry } from "../adapters";
import { mockOrderService } from "../../orders/services/mockOrders";
import type {
  InitiatePaymentInput,
  VerifyPaymentInput,
  RequestRefundInput,
  ConfigurePaymentMethodInput,
} from "../schemas";

export const PAYMENTS_STORAGE_KEY = "cartx_demo_payments_v1";
export const REFUNDS_STORAGE_KEY = "cartx_demo_refunds_v1";
export const PAYMENT_METHODS_STORAGE_KEY = "cartx_demo_payment_methods_v1";

export const INITIAL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "bkash",
    name: "bKash",
    displayNameBn: "বিকাশ পেমেন্ট",
    description: "Accept instant mobile payments via bKash Tokenized Checkout (OTP/PIN).",
    isEnabled: true,
    status: "demo_mode",
    environment: "sandbox",
    accountIdentifier: "01700000000",
    hasCredentials: true,
    supportedChannels: ["App", "USSD", "Checkout URL"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
  {
    id: "nagad",
    name: "Nagad",
    displayNameBn: "নগদ পেমেন্ট",
    description: "Direct checkout for Bangladesh Post Office mobile financial service.",
    isEnabled: true,
    status: "demo_mode",
    environment: "sandbox",
    accountIdentifier: "01800000000",
    hasCredentials: true,
    supportedChannels: ["Direct Checkout", "Challenge URL"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
  {
    id: "sslcommerz",
    name: "SSLCommerz",
    displayNameBn: "এসএসএল কমার্জ",
    description: "Bangladesh gateway for Visa, Mastercard, AMEX, and multi-bank Internet Banking.",
    isEnabled: true,
    status: "demo_mode",
    environment: "sandbox",
    merchantId: "cartx_test_store",
    accountIdentifier: "cartx_test_store",
    hasCredentials: true,
    supportedChannels: ["Cards", "MFS", "Net Banking"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    displayNameBn: "ক্যাশ অন ডেলিভারি (সিওডি)",
    description: "Customer pays cash to courier delivery person upon parcel receipt.",
    isEnabled: true,
    status: "connected",
    environment: "live",
    hasCredentials: true,
    supportedChannels: ["Cash Collection"],
    isDemo: false,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "trx-1001",
    orderId: "ord-1002",
    orderNumber: "CTX-1002",
    customerName: "Nusrat Jahan",
    customerPhone: "+8801819334455",
    provider: "bkash",
    amount: 7760,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "BKH8812903",
    gatewayReference: "BKSH-PAY-1002",
    idempotencyKey: "idem-trx-1002-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T11:20:00.000Z",
    completedAt: "2026-10-29T11:22:15.000Z",
  },
  {
    id: "trx-1002",
    orderId: "ord-1003",
    orderNumber: "CTX-1003",
    customerName: "Mahmudul Hasan",
    customerPhone: "+8801912445566",
    provider: "nagad",
    amount: 7620,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "NGD7721890",
    gatewayReference: "NGD-REF-1003",
    idempotencyKey: "idem-trx-1003-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T14:05:00.000Z",
    completedAt: "2026-10-29T14:07:30.000Z",
  },
  {
    id: "trx-1003",
    orderId: "ord-1004",
    orderNumber: "CTX-1004",
    customerName: "Sharmin Sultana",
    customerPhone: "+8801715667788",
    provider: "bkash",
    amount: 4920,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "BKH9901844",
    gatewayReference: "BKSH-PAY-1004",
    idempotencyKey: "idem-trx-1004-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T16:40:00.000Z",
    completedAt: "2026-10-29T16:42:10.000Z",
  },
  {
    id: "trx-1004",
    orderId: "ord-1007",
    orderNumber: "CTX-1007",
    customerName: "Ayesha Siddiqua",
    customerPhone: "+8801718990011",
    provider: "sslcommerz",
    amount: 4560,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "SSL6610283",
    gatewayReference: "SSL-SESS-1007",
    idempotencyKey: "idem-trx-1007-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-30T10:15:00.000Z",
    completedAt: "2026-10-30T10:18:45.000Z",
  },
  {
    id: "trx-1005",
    orderId: "ord-1009",
    orderNumber: "CTX-1009",
    customerName: "Sadia Afrin",
    customerPhone: "+8801720334455",
    provider: "bkash",
    amount: 2310,
    currency: "BDT",
    status: "refunded",
    gatewayTransactionId: "BKH3329104",
    gatewayReference: "BKSH-PAY-1009",
    idempotencyKey: "idem-trx-1009-initial",
    refundedAmount: 2310,
    initiatedAt: "2026-10-30T12:00:00.000Z",
    completedAt: "2026-10-30T12:03:00.000Z",
  },
  {
    id: "trx-1006",
    orderId: "ord-1011",
    orderNumber: "CTX-1011",
    customerName: "Farhana Yasmin",
    customerPhone: "+8801724778899",
    provider: "nagad",
    amount: 1260,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "NGD4481023",
    gatewayReference: "NGD-REF-1011",
    idempotencyKey: "idem-trx-1011-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-30T15:30:00.000Z",
    completedAt: "2026-10-30T15:33:00.000Z",
  },
  {
    id: "trx-1007",
    orderId: "ord-1012",
    orderNumber: "CTX-1012",
    customerName: "Imran Hossain",
    customerPhone: "+8801825889900",
    provider: "bkash",
    amount: 4860,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "BKH5510291",
    gatewayReference: "BKSH-PAY-1012",
    idempotencyKey: "idem-trx-1012-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-30T16:10:00.000Z",
    completedAt: "2026-10-30T16:13:20.000Z",
  },
  {
    id: "trx-1008",
    orderId: "ord-1014",
    orderNumber: "CTX-1014",
    customerName: "Fariha Tabassum",
    customerPhone: "+8801732001122",
    provider: "bkash",
    amount: 1560,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "BKH2281903",
    gatewayReference: "BKSH-PAY-1014",
    idempotencyKey: "idem-trx-1014-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-30T18:00:00.000Z",
    completedAt: "2026-10-30T18:02:40.000Z",
  },
  {
    id: "trx-1009",
    orderId: "ord-1015",
    orderNumber: "CTX-1015",
    customerName: "Tariqul Islam",
    customerPhone: "+8801833112233",
    provider: "nagad",
    amount: 6250,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "NGD1189201",
    gatewayReference: "NGD-REF-1015",
    idempotencyKey: "idem-trx-1015-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-30T19:20:00.000Z",
    completedAt: "2026-10-30T19:23:15.000Z",
  },
  {
    id: "trx-1010",
    orderId: "ord-1001",
    orderNumber: "CTX-1001",
    customerName: "Tanvir Ahmed",
    customerPhone: "+8801711223344",
    provider: "cod",
    amount: 12560,
    currency: "BDT",
    status: "pending",
    gatewayTransactionId: undefined,
    gatewayReference: "COD-CTX-1001",
    idempotencyKey: "idem-trx-1001-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T10:15:00.000Z",
  },
  {
    id: "trx-1011",
    orderId: "ord-1005",
    orderNumber: "CTX-1005",
    customerName: "Kazi Arif",
    customerPhone: "+8801816778899",
    provider: "cod",
    amount: 3480,
    currency: "BDT",
    status: "pending",
    gatewayReference: "COD-CTX-1005",
    idempotencyKey: "idem-trx-1005-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T17:15:00.000Z",
  },
  {
    id: "trx-1012",
    orderId: "ord-1006",
    orderNumber: "CTX-1006",
    customerName: "Rumana Akter",
    customerPhone: "+8801917889900",
    provider: "cod",
    amount: 1610,
    currency: "BDT",
    status: "successful",
    gatewayTransactionId: "COD-CASH-1006",
    gatewayReference: "COD-CTX-1006",
    idempotencyKey: "idem-trx-1006-initial",
    refundedAmount: 0,
    initiatedAt: "2026-10-29T19:00:00.000Z",
    completedAt: "2026-10-30T11:00:00.000Z",
  },
];

export const INITIAL_REFUNDS: PaymentRefund[] = [
  {
    id: "ref-1001",
    transactionId: "trx-1005",
    orderId: "ord-1009",
    orderNumber: "CTX-1009",
    customerName: "Sadia Afrin",
    amount: 3450,
    reason: "Order returned upon delivery (wrong color sent by warehouse). Full refund issued to bKash wallet.",
    status: "processed",
    gatewayRefundId: "BKH-REF-8921",
    idempotencyKey: "idem-ref-1009-initial",
    requestedBy: "Merchant Admin",
    requestedAt: "2026-10-30T14:00:00.000Z",
    processedAt: "2026-10-30T14:15:00.000Z",
    notes: "Verified return merchandise received at Dhanmondi hub.",
  },
];

export class MockPaymentService {
  private memoryTransactions: PaymentTransaction[] = JSON.parse(
    JSON.stringify(INITIAL_TRANSACTIONS)
  );
  private memoryRefunds: PaymentRefund[] = JSON.parse(
    JSON.stringify(INITIAL_REFUNDS)
  );
  private memoryMethods: PaymentMethodConfig[] = JSON.parse(
    JSON.stringify(INITIAL_PAYMENT_METHODS)
  );

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockPaymentService] LocalStorage set error for key ${key}:`, e);
    }
  }

  public loadTransactions(): PaymentTransaction[] {
    return this.safeGetItem(PAYMENTS_STORAGE_KEY, this.memoryTransactions);
  }

  public saveTransactions(list: PaymentTransaction[]): void {
    this.memoryTransactions = list;
    this.safeSetItem(PAYMENTS_STORAGE_KEY, list);
  }

  public loadRefunds(): PaymentRefund[] {
    return this.safeGetItem(REFUNDS_STORAGE_KEY, this.memoryRefunds);
  }

  public saveRefunds(list: PaymentRefund[]): void {
    this.memoryRefunds = list;
    this.safeSetItem(REFUNDS_STORAGE_KEY, list);
  }

  public loadMethods(): PaymentMethodConfig[] {
    return this.safeGetItem(PAYMENT_METHODS_STORAGE_KEY, this.memoryMethods);
  }

  public saveMethods(list: PaymentMethodConfig[]): void {
    this.memoryMethods = list;
    this.safeSetItem(PAYMENT_METHODS_STORAGE_KEY, list);
  }

  // --- Transactions Query & Mutation ---

  public getTransactions(params: PaymentFilterParams = {}): PaginatedPaymentsResult {
    let list = this.loadTransactions();

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.orderNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerPhone.includes(q) ||
          (t.gatewayTransactionId && t.gatewayTransactionId.toLowerCase().includes(q))
      );
    }

    if (params.status && params.status !== "all") {
      list = list.filter((t) => t.status === params.status);
    }

    if (params.provider && params.provider !== "all") {
      list = list.filter((t) => t.provider === params.provider);
    }

    if (params.datePreset && params.datePreset !== "all") {
      const now = new Date("2026-10-31T12:00:00.000Z").getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      list = list.filter((t) => {
        const itemTime = new Date(t.initiatedAt).getTime();
        if (params.datePreset === "today") return now - itemTime <= oneDay;
        if (params.datePreset === "yesterday") return now - itemTime <= 2 * oneDay && now - itemTime > oneDay;
        if (params.datePreset === "last7days") return now - itemTime <= 7 * oneDay;
        if (params.datePreset === "last30days") return now - itemTime <= 30 * oneDay;
        return true;
      });
    }

    const sortBy = params.sortBy || "date_desc";
    list.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.initiatedAt).getTime() - new Date(a.initiatedAt).getTime();
      }
      if (sortBy === "date_asc") {
        return new Date(a.initiatedAt).getTime() - new Date(b.initiatedAt).getTime();
      }
      if (sortBy === "amount_desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount_asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const clampedPage = Math.min(page, totalPages);
    const startIndex = (clampedPage - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      transactions: paginated,
      total,
      page: clampedPage,
      limit,
      totalPages,
    };
  }

  public getTransactionById(id: string): PaymentTransaction | null {
    const list = this.loadTransactions();
    return list.find((t) => t.id === id) || null;
  }

  public getTransactionByOrderId(orderId: string): PaymentTransaction | null {
    const list = this.loadTransactions();
    return list.find((t) => t.orderId === orderId) || null;
  }

  public getPaymentKPIs(): PaymentKPIStats {
    const list = this.loadTransactions();
    const methods = this.loadMethods();

    let totalGrossVolume = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let totalRefunded = 0;

    for (const t of list) {
      if (t.status === "successful") {
        totalGrossVolume += t.amount;
        successfulCount++;
      } else if (t.status === "pending") {
        pendingCount++;
      } else if (t.status === "failed") {
        failedCount++;
      } else if (t.status === "refunded" || t.status === "partially_refunded") {
        totalGrossVolume += t.amount;
        successfulCount++;
        totalRefunded += t.refundedAmount;
      }
    }

    const activeMethodsCount = methods.filter((m) => m.isEnabled).length;

    return {
      totalGrossVolume,
      successfulTransactionsCount: successfulCount,
      pendingTransactionsCount: pendingCount,
      failedTransactionsCount: failedCount,
      totalRefundedAmount: totalRefunded,
      activeMethodsCount,
    };
  }

  // --- Payment Execution & Verification ---

  public async initiatePayment(input: InitiatePaymentInput): Promise<PaymentTransaction> {
    const list = this.loadTransactions();

    // Idempotency check: prevent duplicate billing
    const existing = list.find((t) => t.idempotencyKey === input.idempotencyKey);
    if (existing) {
      return existing;
    }

    const adapter = paymentAdapterRegistry.get(input.provider);
    const adapterRes = await adapter.initiatePayment({
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      amount: input.amount,
      customerPhone: input.customerPhone,
      customerName: input.customerName,
      idempotencyKey: input.idempotencyKey,
    });

    const newTx: PaymentTransaction = {
      id: adapterRes.transactionId || `trx-${Date.now().toString(36)}`,
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      provider: input.provider,
      amount: input.amount,
      currency: "BDT",
      status: adapterRes.status || "pending",
      gatewayReference: adapterRes.gatewayReference,
      paymentExecutionUrl: adapterRes.redirectUrl,
      idempotencyKey: input.idempotencyKey,
      refundedAmount: 0,
      initiatedAt: new Date().toISOString(),
    };

    list.unshift(newTx);
    this.saveTransactions(list);

    return newTx;
  }

  public async verifyPayment(input: VerifyPaymentInput): Promise<PaymentTransaction> {
    const list = this.loadTransactions();
    const idx = list.findIndex((t) => t.id === input.transactionId);
    if (idx === -1) {
      throw new Error(`Transaction "${input.transactionId}" not found`);
    }

    const tx = list[idx];
    if (tx.status === "successful") {
      return tx; // Already authoritative
    }

    const adapter = paymentAdapterRegistry.get(tx.provider);
    const verifyRes = await adapter.verifyPayment({
      transactionId: tx.id,
      gatewayTransactionId: input.gatewayTransactionId,
      paymentReference: tx.gatewayReference,
    });

    const now = new Date().toISOString();
    const updated: PaymentTransaction = {
      ...tx,
      status: input.status as PaymentTransactionStatus,
      gatewayTransactionId: input.gatewayTransactionId || verifyRes.gatewayTransactionId,
      errorMessage: input.errorMessage,
      completedAt: input.status === "successful" ? now : undefined,
    };

    list[idx] = updated;
    this.saveTransactions(list);

    // Synchronize linked Order if payment was verified as successful
    if (updated.status === "successful") {
      try {
        mockOrderService.markPaymentStatus(
          updated.orderId,
          "paid",
          updated.gatewayTransactionId,
          updated.amount,
          "Payment Gateway Verification"
        );
      } catch (e) {
        console.warn(`[MockPaymentService] Linked order sync failed for ${updated.orderId}:`, e);
      }
    }

    return updated;
  }

  // --- Refunds Management ---

  public getRefunds(params: {
    search?: string;
    status?: RefundStatus | "all";
    page?: number;
    limit?: number;
  } = {}): PaginatedRefundsResult {
    let list = this.loadRefunds();

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          (r.gatewayRefundId && r.gatewayRefundId.toLowerCase().includes(q))
      );
    }

    if (params.status && params.status !== "all") {
      list = list.filter((r) => r.status === params.status);
    }

    list.sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const clampedPage = Math.min(page, totalPages);
    const startIndex = (clampedPage - 1) * limit;

    return {
      refunds: list.slice(startIndex, startIndex + limit),
      total,
      page: clampedPage,
      limit,
      totalPages,
    };
  }

  public async requestRefund(input: RequestRefundInput): Promise<PaymentRefund> {
    const transactions = this.loadTransactions();
    const tx = transactions.find((t) => t.id === input.transactionId);

    if (!tx) {
      throw new Error(`Transaction "${input.transactionId}" not found`);
    }

    if (tx.status !== "successful" && tx.status !== "partially_refunded") {
      throw new Error(
        `Cannot issue refund for transaction with status "${tx.status}". Only successful payments can be refunded.`
      );
    }

    const availableToRefund = tx.amount - tx.refundedAmount;
    if (input.amount > availableToRefund) {
      throw new Error(
        `Refund amount ৳${input.amount} exceeds available refundable balance of ৳${availableToRefund}`
      );
    }

    const refunds = this.loadRefunds();
    // Idempotency check: prevent duplicate refund request
    const existingRefund = refunds.find(
      (r) => r.idempotencyKey === input.idempotencyKey
    );
    if (existingRefund) {
      return existingRefund;
    }

    const adapter = paymentAdapterRegistry.get(tx.provider);
    const adapterRes = await adapter.processRefund({
      transactionId: tx.id,
      gatewayTransactionId: tx.gatewayTransactionId || "N/A",
      amount: input.amount,
      reason: input.reason,
      idempotencyKey: input.idempotencyKey,
    });

    const now = new Date().toISOString();
    const newRefund: PaymentRefund = {
      id: `ref-${Date.now().toString(36)}`,
      transactionId: tx.id,
      orderId: tx.orderId,
      orderNumber: tx.orderNumber,
      customerName: tx.customerName,
      amount: input.amount,
      reason: input.reason,
      status: adapterRes.status || "processed",
      gatewayRefundId: adapterRes.gatewayRefundId,
      idempotencyKey: input.idempotencyKey,
      requestedBy: input.requestedBy || "Merchant Admin",
      requestedAt: now,
      processedAt: adapterRes.status === "processed" ? now : undefined,
    };

    refunds.unshift(newRefund);
    this.saveRefunds(refunds);

    // Update Transaction refundedAmount and status
    const newRefundedTotal = tx.refundedAmount + input.amount;
    const newTxStatus: PaymentTransactionStatus =
      newRefundedTotal >= tx.amount ? "refunded" : "partially_refunded";

    const txIdx = transactions.findIndex((t) => t.id === tx.id);
    if (txIdx !== -1) {
      transactions[txIdx] = {
        ...tx,
        refundedAmount: newRefundedTotal,
        status: newTxStatus,
      };
      this.saveTransactions(transactions);
    }

    // Synchronize linked Order paymentStatus
    try {
      mockOrderService.recordPaymentRefund(
        tx.orderId,
        input.amount,
        adapterRes.gatewayRefundId,
        input.reason,
        input.requestedBy || "Merchant Admin"
      );
    } catch (e) {
      console.warn(`[MockPaymentService] Linked order refund sync error:`, e);
    }

    return newRefund;
  }

  // --- Payment Methods Configuration ---

  public getPaymentMethods(): PaymentMethodConfig[] {
    return this.loadMethods();
  }

  public updatePaymentMethod(input: ConfigurePaymentMethodInput): PaymentMethodConfig {
    const list = this.loadMethods();
    const idx = list.findIndex((m) => m.id === input.provider);
    if (idx === -1) {
      throw new Error(`Provider "${input.provider}" not recognized`);
    }

    const updated: PaymentMethodConfig = {
      ...list[idx],
      isEnabled: input.isEnabled,
      environment: input.environment,
      merchantId: input.merchantId || list[idx].merchantId,
      accountIdentifier: input.accountIdentifier || list[idx].accountIdentifier,
      lastSyncAt: new Date().toISOString(),
    };

    list[idx] = updated;
    this.saveMethods(list);
    return updated;
  }

  // --- CSV Export ---

  public exportTransactionsToCSV(transactions: PaymentTransaction[]): string {
    const headers = [
      "Transaction ID",
      "Order Number",
      "Customer Name",
      "Customer Phone",
      "Provider",
      "Amount (BDT)",
      "Status",
      "Gateway TrxID",
      "Date",
    ];

    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.orderNumber}"`,
      `"${t.customerName.replace(/"/g, '""')}"`,
      `"${t.customerPhone}"`,
      `"${t.provider.toUpperCase()}"`,
      t.amount,
      `"${t.status.toUpperCase()}"`,
      `"${t.gatewayTransactionId || "N/A"}"`,
      `"${new Date(t.initiatedAt).toLocaleDateString("en-BD")}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  }

  public resetDemoPayments(): void {
    this.memoryTransactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.memoryRefunds = JSON.parse(JSON.stringify(INITIAL_REFUNDS));
    this.memoryMethods = JSON.parse(JSON.stringify(INITIAL_PAYMENT_METHODS));

    if (typeof window !== "undefined") {
      this.safeSetItem(PAYMENTS_STORAGE_KEY, this.memoryTransactions);
      this.safeSetItem(REFUNDS_STORAGE_KEY, this.memoryRefunds);
      this.safeSetItem(PAYMENT_METHODS_STORAGE_KEY, this.memoryMethods);
    }
  }
}

export const mockPaymentService = new MockPaymentService();
