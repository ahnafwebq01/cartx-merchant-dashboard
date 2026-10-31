import type {
  Customer,
  CustomerFilterParams,
  CustomerOverviewStats,
  PaginatedCustomersResult,
} from "../types";
import type { CustomerFormValues } from "../schemas";

export const CUSTOMERS_STORAGE_KEY = "cartx_demo_customers_v1";

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Tanvir Ahmed",
    phone: "+8801711223344",
    email: "tanvir.ahmed@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    city: "Dhaka",
    division: "Dhaka",
    defaultAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+8801711223344",
      email: "tanvir.ahmed@example.com",
      addressLine1: "House 42, Road 7/A, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    totalOrders: 3,
    totalSpend: 26580,
    averageOrderValue: 8860,
    lastOrderDate: "2026-10-28T14:30:00.000Z",
    tags: ["VIP", "Repeat", "Dhaka"],
    segment: "high_value",
    internalNotes: "Prefers evening courier delivery between 5 PM and 8 PM.",
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "cust-002",
    name: "Nusrat Jahan",
    phone: "+8801819334455",
    email: "nusrat.j@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    city: "Dhaka",
    division: "Dhaka",
    defaultAddress: {
      fullName: "Nusrat Jahan",
      phone: "+8801819334455",
      email: "nusrat.j@example.com",
      addressLine1: "Sector 4, Road 11, House 18, Uttara",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1230",
      country: "Bangladesh",
    },
    totalOrders: 2,
    totalSpend: 12320,
    averageOrderValue: 6160,
    lastOrderDate: "2026-10-27T11:15:00.000Z",
    tags: ["Repeat", "Fashion"],
    segment: "repeat",
    internalNotes: "Prompt bKash payer. Very satisfied with Jamdani collection.",
    createdAt: "2026-07-04T09:30:00.000Z",
    updatedAt: "2026-10-27T11:15:00.000Z",
  },
  {
    id: "cust-003",
    name: "Shakib Al Hasan",
    phone: "+8801912445566",
    email: "shakib.h@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    city: "Chattogram",
    division: "Chattogram",
    defaultAddress: {
      fullName: "Shakib Al Hasan",
      phone: "+8801912445566",
      email: "shakib.h@example.com",
      addressLine1: "Flat 4B, Green View Tower, Agrabad C/A",
      city: "Chattogram",
      division: "Chattogram",
      postalCode: "4100",
      country: "Bangladesh",
    },
    totalOrders: 2,
    totalSpend: 7840,
    averageOrderValue: 3920,
    lastOrderDate: "2026-10-26T16:45:00.000Z",
    tags: ["VIP", "Chattogram"],
    segment: "high_value",
    internalNotes: "Always uses Nagad gateway.",
    createdAt: "2026-07-20T14:00:00.000Z",
    updatedAt: "2026-10-26T16:45:00.000Z",
  },
  {
    id: "cust-004",
    name: "Farhana Akter",
    phone: "+8801615556677",
    email: "farhana.akter@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    city: "Sylhet",
    division: "Sylhet",
    defaultAddress: {
      fullName: "Farhana Akter",
      phone: "+8801615556677",
      email: "farhana.akter@example.com",
      addressLine1: "Bordighir Paar, Zindabazar",
      city: "Sylhet",
      division: "Sylhet",
      postalCode: "3100",
      country: "Bangladesh",
    },
    totalOrders: 2,
    totalSpend: 8240,
    averageOrderValue: 4120,
    lastOrderDate: "2026-10-29T09:10:00.000Z",
    tags: ["New", "Sylhet"],
    segment: "new",
    internalNotes: "Requested Steadfast delivery to Sylhet hub.",
    createdAt: "2026-09-15T08:20:00.000Z",
    updatedAt: "2026-10-29T09:10:00.000Z",
  },
  {
    id: "cust-005",
    name: "Arifur Rahman",
    phone: "+8801718667788",
    email: "arif.rahman@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    city: "Rajshahi",
    division: "Rajshahi",
    defaultAddress: {
      fullName: "Arifur Rahman",
      phone: "+8801718667788",
      email: "arif.rahman@example.com",
      addressLine1: "Shaheb Bazar Zero Point, Ghoramara",
      city: "Rajshahi",
      division: "Rajshahi",
      postalCode: "6100",
      country: "Bangladesh",
    },
    totalOrders: 2,
    totalSpend: 5080,
    averageOrderValue: 2540,
    lastOrderDate: "2026-10-29T08:00:00.000Z",
    tags: ["Repeat", "Organic"],
    segment: "repeat",
    internalNotes: "Repeated buyer of Mustard Oil and Honey.",
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-10-29T08:00:00.000Z",
  },
  {
    id: "cust-006",
    name: "Sadia Islam",
    phone: "+8801817778899",
    email: "sadia.islam@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    city: "Khulna",
    division: "Khulna",
    defaultAddress: {
      fullName: "Sadia Islam",
      phone: "+8801817778899",
      email: "sadia.islam@example.com",
      addressLine1: "Holding 12, Main Road, Boyra",
      city: "Khulna",
      division: "Khulna",
      postalCode: "9000",
      country: "Bangladesh",
    },
    totalOrders: 2,
    totalSpend: 8240,
    averageOrderValue: 4120,
    lastOrderDate: "2026-10-28T16:00:00.000Z",
    tags: ["New", "COD"],
    segment: "new",
    internalNotes: "Had 1 cancelled order before dispatch, placed replacement order.",
    createdAt: "2026-09-28T11:00:00.000Z",
    updatedAt: "2026-10-28T16:00:00.000Z",
  },
  {
    id: "cust-007",
    name: "Mahmudul Hasan",
    phone: "+8801516889900",
    email: "mahmud.hasan@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    city: "Dhaka",
    division: "Dhaka",
    defaultAddress: {
      fullName: "Mahmudul Hasan",
      phone: "+8801516889900",
      email: "mahmud.hasan@example.com",
      addressLine1: "Block C, Section 10, Mirpur",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1216",
      country: "Bangladesh",
    },
    totalOrders: 1,
    totalSpend: 2310,
    averageOrderValue: 2310,
    lastOrderDate: "2026-08-10T10:00:00.000Z",
    tags: ["Inactive", "Electronics"],
    segment: "inactive",
    internalNotes: "Returned power bank due to port mismatch; refunded.",
    createdAt: "2026-05-10T10:00:00.000Z",
    updatedAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "cust-008",
    name: "Rashedul Karim",
    phone: "+8801713990011",
    email: "rashed.karim@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    city: "Barishal",
    division: "Barishal",
    defaultAddress: {
      fullName: "Rashedul Karim",
      phone: "+8801713990011",
      email: "rashed.karim@example.com",
      addressLine1: "Bogra Road, Kotwali",
      city: "Barishal",
      division: "Barishal",
      postalCode: "8200",
      country: "Bangladesh",
    },
    totalOrders: 1,
    totalSpend: 14120,
    averageOrderValue: 14120,
    lastOrderDate: "2026-10-25T13:00:00.000Z",
    tags: ["VIP", "Wholesale"],
    segment: "high_value",
    internalNotes: "Wholesale corporate client. Paid via Eastern Bank transfer.",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-25T13:00:00.000Z",
  },
];

class MockCustomerService {
  private memoryCustomers: Customer[] = JSON.parse(
    JSON.stringify(INITIAL_CUSTOMERS)
  );

  private safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed;
    } catch {
      return fallback;
    }
  }

  private safeSetItem(key: string, data: unknown): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`[MockCustomerService] Failed to persist ${key}:`, e);
    }
  }

  private loadCustomers(): Customer[] {
    if (typeof window === "undefined") {
      return this.memoryCustomers;
    }
    const raw = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      this.safeSetItem(CUSTOMERS_STORAGE_KEY, this.memoryCustomers);
      return this.memoryCustomers;
    }
    const parsed = this.safeParse<Customer[]>(raw, this.memoryCustomers);
    this.memoryCustomers = parsed;
    return parsed;
  }

  private saveCustomers(customers: Customer[]): void {
    this.memoryCustomers = customers;
    this.safeSetItem(CUSTOMERS_STORAGE_KEY, customers);
  }

  public getCustomers(
    params: CustomerFilterParams = {}
  ): PaginatedCustomersResult {
    let list = [...this.loadCustomers()];

    // Search filter
    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.city.toLowerCase().includes(q)
      );
    }

    // Segment filter
    if (params.segment && params.segment !== "all") {
      list = list.filter((c) => c.segment === params.segment);
    }

    // City filter
    if (params.city?.trim()) {
      list = list.filter(
        (c) => c.city.toLowerCase() === params.city!.toLowerCase()
      );
    }

    // Tag filter
    if (params.tag?.trim()) {
      list = list.filter((c) => c.tags.includes(params.tag!));
    }

    // Sorting
    const sortBy = params.sortBy || "spend_desc";
    list.sort((a, b) => {
      switch (sortBy) {
        case "orders_desc":
          return b.totalOrders - a.totalOrders;
        case "date_desc":
          return (
            new Date(b.lastOrderDate || b.createdAt).getTime() -
            new Date(a.lastOrderDate || a.createdAt).getTime()
          );
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "spend_desc":
        default:
          return b.totalSpend - a.totalSpend;
      }
    });

    const total = list.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      customers: paginated,
      total,
      page: safePage,
      limit,
      totalPages,
    };
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.loadCustomers().find((c) => c.id === id);
  }

  public getCustomerStats(): CustomerOverviewStats {
    const list = this.loadCustomers();
    const totalCustomers = list.length;
    const newCustomers = list.filter((c) => c.segment === "new").length;
    const repeatCustomers = list.filter((c) => c.segment === "repeat").length;
    const highValueCustomers = list.filter(
      (c) => c.segment === "high_value"
    ).length;
    const totalRevenue = list.reduce((acc, c) => acc + c.totalSpend, 0);
    const averageCustomerLifetimeValue =
      totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

    return {
      totalCustomers,
      newCustomers,
      repeatCustomers,
      highValueCustomers,
      totalRevenue,
      averageCustomerLifetimeValue,
    };
  }

  public createCustomer(values: CustomerFormValues): Customer {
    const list = this.loadCustomers();
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      id: `cust-${Date.now().toString(36)}`,
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      city: values.city,
      division: values.division,
      defaultAddress: {
        fullName: values.name,
        phone: values.phone,
        email: values.email || undefined,
        addressLine1: values.addressLine1,
        city: values.city,
        division: values.division,
        country: "Bangladesh",
      },
      totalOrders: 0,
      totalSpend: 0,
      averageOrderValue: 0,
      tags: values.tags || ["New"],
      segment: "new",
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newCustomer);
    this.saveCustomers(list);
    return newCustomer;
  }

  public updateCustomerTags(id: string, tags: string[]): Customer {
    const list = this.loadCustomers();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer ${id} not found`);

    list[idx] = {
      ...list[idx],
      tags,
      updatedAt: new Date().toISOString(),
    };

    this.saveCustomers(list);
    return list[idx];
  }

  public addCustomerNote(id: string, note: string): Customer {
    const list = this.loadCustomers();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer ${id} not found`);

    const existingNotes = list[idx].internalNotes || "";
    const updatedNotes = existingNotes
      ? `${existingNotes}\n[${new Date().toLocaleDateString("en-BD")}]: ${note}`
      : `[${new Date().toLocaleDateString("en-BD")}]: ${note}`;

    list[idx] = {
      ...list[idx],
      internalNotes: updatedNotes,
      updatedAt: new Date().toISOString(),
    };

    this.saveCustomers(list);
    return list[idx];
  }

  public recalculateCustomerMetrics(
    customerId: string,
    orders: {
      customerId: string;
      grandTotal: number;
      orderStatus: string;
      createdAt: string;
    }[]
  ): void {
    const list = this.loadCustomers();
    const idx = list.findIndex((c) => c.id === customerId);
    if (idx === -1) return;

    const customerOrders = orders.filter(
      (o) => o.customerId === customerId && o.orderStatus !== "cancelled"
    );
    const totalOrders = customerOrders.length;
    const totalSpend = customerOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const averageOrderValue =
      totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;

    let segment: Customer["segment"] = "new";
    if (totalSpend >= 10000) {
      segment = "high_value";
    } else if (totalOrders >= 2) {
      segment = "repeat";
    }

    const sortedDates = customerOrders
      .map((o) => new Date(o.createdAt).getTime())
      .sort((a, b) => b - a);
    const lastOrderDate =
      sortedDates.length > 0 ? new Date(sortedDates[0]).toISOString() : undefined;

    list[idx] = {
      ...list[idx],
      totalOrders,
      totalSpend,
      averageOrderValue,
      lastOrderDate,
      segment,
      updatedAt: new Date().toISOString(),
    };

    this.saveCustomers(list);
  }

  public resetDemoCustomers(): Customer[] {
    const initial = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    this.memoryCustomers = initial;
    if (typeof window !== "undefined") {
      this.safeSetItem(CUSTOMERS_STORAGE_KEY, initial);
    }
    return initial;
  }
}

export const mockCustomerService = new MockCustomerService();

