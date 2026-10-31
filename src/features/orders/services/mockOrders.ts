import type {
  Order,
  OrderDelivery,
  OrderFilterParams,
  OrderKPIStats,
  OrderStatus,
  PaginatedOrdersResult,
  PaymentStatus,
} from "../types";
import { VALID_ORDER_STATUS_TRANSITIONS } from "../types";
import { mockCustomerService } from "../../customers/services/mockCustomers";
import { mockProductService } from "../../products/services/mockProducts";

export const ORDERS_STORAGE_KEY = "cartx_demo_orders_v1";

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "CTX-1001",
    customerId: "cust-001",
    customerName: "Tanvir Ahmed",
    customerPhone: "+8801711223344",
    customerEmail: "tanvir.ahmed@example.com",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+8801711223344",
      addressLine1: "House 42, Road 7/A, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-101",
        productId: "prod-001",
        title: "Premium Silk Jamdani Saree (Navy & Gold)",
        sku: "JMD-SLK-001",
        variantName: "Navy Blue / Zari Gold",
        imageUrl:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
        price: 12500,
        quantity: 1,
        discount: 0,
        total: 12500,
      },
    ],
    subtotal: 12500,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 12560,
    amountPaid: 0,
    amountDue: 12560,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    delivery: {
      courier: "Pathao",
      shippingFee: 60,
      estimatedDays: "1-2 business days",
      deliveryNotes: "Call customer before dispatch",
    },
    timeline: [
      {
        id: "evt-1001-1",
        status: "pending",
        title: "Order Placed",
        description: "Customer placed order via storefront with Cash on Delivery.",
        actor: "Customer (Tanvir Ahmed)",
        timestamp: "2026-10-29T10:15:00.000Z",
      },
    ],
    internalNotes: "Verified customer phone number via SMS confirmation.",
    createdAt: "2026-10-29T10:15:00.000Z",
    updatedAt: "2026-10-29T10:15:00.000Z",
  },
  {
    id: "ord-1002",
    orderNumber: "CTX-1002",
    customerId: "cust-002",
    customerName: "Nusrat Jahan",
    customerPhone: "+8801819334455",
    customerEmail: "nusrat.j@example.com",
    shippingAddress: {
      fullName: "Nusrat Jahan",
      phone: "+8801819334455",
      addressLine1: "Sector 4, Road 11, House 18, Uttara",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1230",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-102",
        productId: "prod-002",
        title: "Men's Embroidered Cotton Panjabi - Off White",
        sku: "PNJ-COT-002",
        variantName: "Size L (42)",
        imageUrl:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
        price: 3850,
        quantity: 2,
        discount: 0,
        total: 7700,
      },
    ],
    subtotal: 7700,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 7760,
    amountPaid: 7760,
    amountDue: 0,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    paymentReference: "9JH4L18OPZ",
    orderStatus: "confirmed",
    fulfillmentStatus: "unfulfilled",
    delivery: {
      courier: "Steadfast",
      shippingFee: 60,
      estimatedDays: "1-2 business days",
    },
    timeline: [
      {
        id: "evt-1002-1",
        status: "pending",
        title: "Order Placed",
        description: "Customer placed order and paid full amount via bKash.",
        actor: "Customer (Nusrat Jahan)",
        timestamp: "2026-10-29T08:30:00.000Z",
      },
      {
        id: "evt-1002-2",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Merchant verified bKash payment TrxID 9JH4L18OPZ and confirmed stock availability.",
        actor: "Merchant Admin",
        timestamp: "2026-10-29T09:00:00.000Z",
      },
    ],
    internalNotes: "bKash transaction verified manually with merchant statement.",
    createdAt: "2026-10-29T08:30:00.000Z",
    updatedAt: "2026-10-29T09:00:00.000Z",
  },
  {
    id: "ord-1003",
    orderNumber: "CTX-1003",
    customerId: "cust-003",
    customerName: "Shakib Al Hasan",
    customerPhone: "+8801912445566",
    customerEmail: "shakib.h@example.com",
    shippingAddress: {
      fullName: "Shakib Al Hasan",
      phone: "+8801912445566",
      addressLine1: "Flat 4B, Green View Tower, Agrabad C/A",
      city: "Chattogram",
      division: "Chattogram",
      postalCode: "4100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-103a",
        productId: "prod-004",
        title: "Handcrafted Pure Leather Bifold Wallet",
        sku: "LTH-WLT-004",
        variantName: "Dark Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80",
        price: 1850,
        quantity: 1,
        discount: 0,
        total: 1850,
      },
      {
        id: "item-103b",
        productId: "prod-003",
        title: "Organic Sundarban Wild Honey (500g)",
        sku: "HNY-SND-003",
        imageUrl:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80",
        price: 950,
        quantity: 2,
        discount: 0,
        total: 1900,
      },
    ],
    subtotal: 3750,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 3870,
    amountPaid: 3870,
    amountDue: 0,
    paymentMethod: "nagad",
    paymentStatus: "paid",
    paymentReference: "8MN5Q29XYA",
    orderStatus: "processing",
    fulfillmentStatus: "partially_fulfilled",
    delivery: {
      courier: "Steadfast",
      shippingFee: 120,
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1003-1",
        status: "pending",
        title: "Order Placed",
        description: "Customer paid via Nagad gateway.",
        actor: "Customer (Shakib Al Hasan)",
        timestamp: "2026-10-28T14:00:00.000Z",
      },
      {
        id: "evt-1003-2",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Items allocated from warehouse.",
        actor: "Order Manager",
        timestamp: "2026-10-28T14:45:00.000Z",
      },
      {
        id: "evt-1003-3",
        status: "processing",
        title: "Processing & Packaging",
        description: "Packaging team preparing fragile bubble wrap for honey jars.",
        actor: "Packing Team",
        timestamp: "2026-10-28T16:00:00.000Z",
      },
    ],
    internalNotes: "Fragile packaging sticker applied on parcel.",
    createdAt: "2026-10-28T14:00:00.000Z",
    updatedAt: "2026-10-28T16:00:00.000Z",
  },
  {
    id: "ord-1004",
    orderNumber: "CTX-1004",
    customerId: "cust-004",
    customerName: "Farhana Akter",
    customerPhone: "+8801615556677",
    customerEmail: "farhana.akter@example.com",
    shippingAddress: {
      fullName: "Farhana Akter",
      phone: "+8801615556677",
      addressLine1: "Bordighir Paar, Zindabazar",
      city: "Sylhet",
      division: "Sylhet",
      postalCode: "3100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-104",
        productId: "prod-007",
        title: "Aarong Hand-Embroidered Nakshi Kantha",
        sku: "NKS-KNT-007",
        variantName: "Traditional Floral Pattern",
        imageUrl:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80",
        price: 4800,
        quantity: 1,
        discount: 0,
        total: 4800,
      },
    ],
    subtotal: 4800,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 4920,
    amountPaid: 4920,
    amountDue: 0,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    paymentReference: "7KP2R83BXC",
    orderStatus: "ready_to_ship",
    fulfillmentStatus: "partially_fulfilled",
    delivery: {
      courier: "RedX",
      consignmentId: "REDX-DH-90812",
      trackingNumber: "REDX-90812",
      shippingFee: 120,
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1004-1",
        status: "pending",
        title: "Order Placed",
        description: "Order placed via online storefront.",
        actor: "Customer (Farhana Akter)",
        timestamp: "2026-10-28T11:00:00.000Z",
      },
      {
        id: "evt-1004-2",
        status: "confirmed",
        title: "Confirmed",
        description: "bKash payment confirmed.",
        actor: "Merchant Admin",
        timestamp: "2026-10-28T11:30:00.000Z",
      },
      {
        id: "evt-1004-3",
        status: "processing",
        title: "Packed",
        description: "Quality check passed and parcel sealed.",
        actor: "Warehouse Staff",
        timestamp: "2026-10-28T15:00:00.000Z",
      },
      {
        id: "evt-1004-4",
        status: "ready_to_ship",
        title: "Ready to Ship",
        description: "RedX courier pickup scheduled for next dispatch slot.",
        actor: "Dispatch Desk",
        timestamp: "2026-10-28T18:00:00.000Z",
      },
    ],
    createdAt: "2026-10-28T11:00:00.000Z",
    updatedAt: "2026-10-28T18:00:00.000Z",
  },
  {
    id: "ord-1005",
    orderNumber: "CTX-1005",
    customerId: "cust-005",
    customerName: "Arifur Rahman",
    customerPhone: "+8801718667788",
    customerEmail: "arif.rahman@example.com",
    shippingAddress: {
      fullName: "Arifur Rahman",
      phone: "+8801718667788",
      addressLine1: "Shaheb Bazar Zero Point, Ghoramara",
      city: "Rajshahi",
      division: "Rajshahi",
      postalCode: "6100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-105",
        productId: "prod-005",
        title: "Cold-Pressed Organic Mustard Oil (1L Bottle)",
        sku: "MST-OIL-005",
        imageUrl:
          "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
        price: 380,
        quantity: 3,
        discount: 0,
        total: 1140,
      },
    ],
    subtotal: 1140,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 1260,
    amountPaid: 0,
    amountDue: 1260,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "shipped",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Steadfast",
      consignmentId: "STDF-991204",
      trackingNumber: "STDF-991204",
      shippingFee: 120,
      dispatchedAt: "2026-10-28T10:00:00.000Z",
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1005-1",
        status: "pending",
        title: "Order Placed",
        description: "COD order placed by repeat customer.",
        actor: "Customer (Arifur Rahman)",
        timestamp: "2026-10-27T09:00:00.000Z",
      },
      {
        id: "evt-1005-2",
        status: "processing",
        title: "Processing",
        description: "Order processed and packed.",
        actor: "Warehouse",
        timestamp: "2026-10-27T12:00:00.000Z",
      },
      {
        id: "evt-1005-3",
        status: "shipped",
        title: "Shipped via Steadfast",
        description: "Courier collected parcel. Consignment tracking STDF-991204.",
        actor: "Steadfast Courier Integration",
        timestamp: "2026-10-28T10:00:00.000Z",
      },
    ],
    createdAt: "2026-10-27T09:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
  },
  {
    id: "ord-1006",
    orderNumber: "CTX-1006",
    customerId: "cust-001",
    customerName: "Tanvir Ahmed",
    customerPhone: "+8801711223344",
    customerEmail: "tanvir.ahmed@example.com",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+8801711223344",
      addressLine1: "House 42, Road 7/A, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-106",
        productId: "prod-008",
        title: "Eco-Friendly Jute Tote Shopping Bag",
        sku: "JUT-BAG-008",
        imageUrl:
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80",
        price: 350,
        quantity: 4,
        discount: 0,
        total: 1400,
      },
    ],
    subtotal: 1400,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 1460,
    amountPaid: 1460,
    amountDue: 0,
    paymentMethod: "cod",
    paymentStatus: "paid",
    orderStatus: "delivered",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Pathao",
      trackingNumber: "PTH-883011",
      shippingFee: 60,
      dispatchedAt: "2026-10-27T11:00:00.000Z",
      deliveredAt: "2026-10-28T14:30:00.000Z",
    },
    timeline: [
      {
        id: "evt-1006-1",
        status: "pending",
        title: "Placed",
        description: "COD order placed.",
        actor: "Customer",
        timestamp: "2026-10-26T14:00:00.000Z",
      },
      {
        id: "evt-1006-2",
        status: "shipped",
        title: "Handed to Pathao",
        description: "Delivery rider picked up parcel.",
        actor: "Pathao Rider",
        timestamp: "2026-10-27T11:00:00.000Z",
      },
      {
        id: "evt-1006-3",
        status: "delivered",
        title: "Delivered to Customer",
        description: "Customer accepted package and paid ৳1,460 cash to rider.",
        actor: "Pathao Logistics",
        timestamp: "2026-10-28T14:30:00.000Z",
      },
    ],
    createdAt: "2026-10-26T14:00:00.000Z",
    updatedAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "ord-1007",
    orderNumber: "CTX-1007",
    customerId: "cust-002",
    customerName: "Nusrat Jahan",
    customerPhone: "+8801819334455",
    customerEmail: "nusrat.j@example.com",
    shippingAddress: {
      fullName: "Nusrat Jahan",
      phone: "+8801819334455",
      addressLine1: "Sector 4, Road 11, House 18, Uttara",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1230",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-107",
        productId: "prod-010",
        title: "Pure Leather Formal Oxford Shoes",
        sku: "SH-OXF-010",
        variantName: "Black / Size 42",
        imageUrl:
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=300&q=80",
        price: 4500,
        quantity: 1,
        discount: 0,
        total: 4500,
      },
    ],
    subtotal: 4500,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 4560,
    amountPaid: 4560,
    amountDue: 0,
    paymentMethod: "sslcommerz",
    paymentStatus: "paid",
    paymentReference: "SSL-90312",
    orderStatus: "delivered",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Paperfly",
      trackingNumber: "PFLY-661209",
      shippingFee: 60,
      deliveredAt: "2026-10-27T11:15:00.000Z",
    },
    timeline: [
      {
        id: "evt-1007-1",
        status: "shipped",
        title: "Shipped",
        description: "Dispatched with Paperfly.",
        actor: "Merchant",
        timestamp: "2026-10-26T10:00:00.000Z",
      },
      {
        id: "evt-1007-2",
        status: "delivered",
        title: "Delivered",
        description: "Package received and signed by recipient.",
        actor: "Paperfly Courier",
        timestamp: "2026-10-27T11:15:00.000Z",
      },
    ],
    createdAt: "2026-10-25T15:00:00.000Z",
    updatedAt: "2026-10-27T11:15:00.000Z",
  },
  {
    id: "ord-1008",
    orderNumber: "CTX-1008",
    customerId: "cust-006",
    customerName: "Sadia Islam",
    customerPhone: "+8801817778899",
    customerEmail: "sadia.islam@example.com",
    shippingAddress: {
      fullName: "Sadia Islam",
      phone: "+8801817778899",
      addressLine1: "Holding 12, Main Road, Boyra",
      city: "Khulna",
      division: "Khulna",
      postalCode: "9000",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-108",
        productId: "prod-006",
        title: "Terracotta Clay Dinner Set (6 Persons)",
        sku: "TRC-DIN-006",
        imageUrl:
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80",
        price: 3200,
        quantity: 1,
        discount: 0,
        total: 3200,
      },
    ],
    subtotal: 3200,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 3320,
    amountPaid: 0,
    amountDue: 3320,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "cancelled",
    fulfillmentStatus: "unfulfilled",
    cancellationReason:
      "Customer requested cancellation before dispatch due to sudden travel outside Khulna.",
    delivery: {
      courier: "Steadfast",
      shippingFee: 120,
    },
    timeline: [
      {
        id: "evt-1008-1",
        status: "pending",
        title: "Order Placed",
        description: "COD order placed via website.",
        actor: "Customer (Sadia Islam)",
        timestamp: "2026-10-26T18:00:00.000Z",
      },
      {
        id: "evt-1008-2",
        status: "cancelled",
        title: "Order Cancelled",
        description:
          "Customer called support desk to cancel. Items returned to inventory stock.",
        actor: "Support Staff (Farid)",
        timestamp: "2026-10-27T10:00:00.000Z",
        note: "Customer requested cancellation before dispatch due to sudden travel outside Khulna.",
      },
    ],
    createdAt: "2026-10-26T18:00:00.000Z",
    updatedAt: "2026-10-27T10:00:00.000Z",
  },
  {
    id: "ord-1009",
    orderNumber: "CTX-1009",
    customerId: "cust-007",
    customerName: "Mahmudul Hasan",
    customerPhone: "+8801516889900",
    customerEmail: "mahmud.hasan@example.com",
    shippingAddress: {
      fullName: "Mahmudul Hasan",
      phone: "+8801516889900",
      addressLine1: "Block C, Section 10, Mirpur",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1216",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-109",
        productId: "prod-009",
        title: "20,000mAh Fast Charging Power Bank",
        sku: "PWR-BNK-009",
        imageUrl:
          "https://images.unsplash.com/photo-1609592426868-b71576db5fd6?auto=format&fit=crop&w=300&q=80",
        price: 2250,
        quantity: 1,
        discount: 0,
        total: 2250,
      },
    ],
    subtotal: 2250,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 2310,
    amountPaid: 0,
    amountDue: 0,
    paymentMethod: "bkash",
    paymentStatus: "refunded",
    orderStatus: "returned",
    fulfillmentStatus: "fulfilled",
    returnReason:
      "Customer received incompatible port type; requested return to origin.",
    delivery: {
      courier: "Pathao",
      shippingFee: 60,
    },
    timeline: [
      {
        id: "evt-1009-1",
        status: "delivered",
        title: "Delivered",
        description: "Package delivered to customer.",
        actor: "Courier",
        timestamp: "2026-08-08T15:00:00.000Z",
      },
      {
        id: "evt-1009-2",
        status: "returned",
        title: "Return to Origin Processed",
        description:
          "Customer requested return due to cable spec incompatibility. bKash refund issued.",
        actor: "Returns Officer",
        timestamp: "2026-08-10T10:00:00.000Z",
        note: "Customer received incompatible port type; requested return to origin.",
      },
    ],
    createdAt: "2026-08-05T12:00:00.000Z",
    updatedAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "ord-1010",
    orderNumber: "CTX-1010",
    customerId: "cust-008",
    customerName: "Rashedul Karim",
    customerPhone: "+8801713990011",
    customerEmail: "rashed.karim@example.com",
    shippingAddress: {
      fullName: "Rashedul Karim",
      phone: "+8801713990011",
      addressLine1: "Bogra Road, Kotwali",
      city: "Barishal",
      division: "Barishal",
      postalCode: "8200",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-110a",
        productId: "prod-004",
        title: "Handcrafted Pure Leather Bifold Wallet",
        sku: "LTH-WLT-004",
        variantName: "Dark Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80",
        price: 1850,
        quantity: 5,
        discount: 0,
        total: 9250,
      },
      {
        id: "item-110b",
        productId: "prod-003",
        title: "Organic Sundarban Wild Honey (500g)",
        sku: "HNY-SND-003",
        imageUrl:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80",
        price: 950,
        quantity: 5,
        discount: 0,
        total: 4750,
      },
    ],
    subtotal: 14000,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 14120,
    amountPaid: 14120,
    amountDue: 0,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    paymentReference: "EBL-TRX-44019",
    orderStatus: "delivered",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Steadfast",
      consignmentId: "STDF-772199",
      trackingNumber: "STDF-772199",
      shippingFee: 120,
      deliveredAt: "2026-10-25T13:00:00.000Z",
    },
    timeline: [
      {
        id: "evt-1010-1",
        status: "delivered",
        title: "Delivered",
        description: "Corporate consignment delivered to Barishal branch.",
        actor: "Steadfast Courier",
        timestamp: "2026-10-25T13:00:00.000Z",
      },
    ],
    createdAt: "2026-10-23T10:00:00.000Z",
    updatedAt: "2026-10-25T13:00:00.000Z",
  },
  {
    id: "ord-1011",
    orderNumber: "CTX-1011",
    customerId: "cust-003",
    customerName: "Shakib Al Hasan",
    customerPhone: "+8801912445566",
    customerEmail: "shakib.h@example.com",
    shippingAddress: {
      fullName: "Shakib Al Hasan",
      phone: "+8801912445566",
      addressLine1: "Flat 4B, Green View Tower, Agrabad C/A",
      city: "Chattogram",
      division: "Chattogram",
      postalCode: "4100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-111",
        productId: "prod-002",
        title: "Men's Embroidered Cotton Panjabi - Off White",
        sku: "PNJ-COT-002",
        variantName: "Size XL (44)",
        imageUrl:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
        price: 3850,
        quantity: 1,
        discount: 0,
        total: 3850,
      },
    ],
    subtotal: 3850,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 3970,
    amountPaid: 3970,
    amountDue: 0,
    paymentMethod: "nagad",
    paymentStatus: "paid",
    paymentReference: "8MN5Q99KLM",
    orderStatus: "delivered",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Steadfast",
      trackingNumber: "STDF-661100",
      shippingFee: 120,
      deliveredAt: "2026-10-26T16:45:00.000Z",
    },
    timeline: [
      {
        id: "evt-1011-1",
        status: "delivered",
        title: "Delivered",
        description: "Delivered successfully in Chattogram.",
        actor: "Steadfast Rider",
        timestamp: "2026-10-26T16:45:00.000Z",
      },
    ],
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-26T16:45:00.000Z",
  },
  {
    id: "ord-1012",
    orderNumber: "CTX-1012",
    customerId: "cust-001",
    customerName: "Tanvir Ahmed",
    customerPhone: "+8801711223344",
    customerEmail: "tanvir.ahmed@example.com",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+8801711223344",
      addressLine1: "House 42, Road 7/A, Dhanmondi",
      city: "Dhaka",
      division: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-112",
        productId: "prod-001",
        title: "Premium Silk Jamdani Saree (Navy & Gold)",
        sku: "JMD-SLK-001",
        imageUrl:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
        price: 12500,
        quantity: 1,
        discount: 0,
        total: 12500,
      },
    ],
    subtotal: 12500,
    discount: 0,
    shippingFee: 60,
    tax: 0,
    grandTotal: 12560,
    amountPaid: 12560,
    amountDue: 0,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    paymentReference: "9JH4L77QWE",
    orderStatus: "delivered",
    fulfillmentStatus: "fulfilled",
    delivery: {
      courier: "Pathao",
      trackingNumber: "PTH-992811",
      shippingFee: 60,
      deliveredAt: "2026-10-20T17:00:00.000Z",
    },
    timeline: [
      {
        id: "evt-1012-1",
        status: "delivered",
        title: "Delivered",
        description: "Delivered to Dhanmondi residence.",
        actor: "Pathao Logistics",
        timestamp: "2026-10-20T17:00:00.000Z",
      },
    ],
    createdAt: "2026-10-18T10:00:00.000Z",
    updatedAt: "2026-10-20T17:00:00.000Z",
  },
  {
    id: "ord-1013",
    orderNumber: "CTX-1013",
    customerId: "cust-004",
    customerName: "Farhana Akter",
    customerPhone: "+8801615556677",
    customerEmail: "farhana.akter@example.com",
    shippingAddress: {
      fullName: "Farhana Akter",
      phone: "+8801615556677",
      addressLine1: "Bordighir Paar, Zindabazar",
      city: "Sylhet",
      division: "Sylhet",
      postalCode: "3100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-113",
        productId: "prod-006",
        title: "Terracotta Clay Dinner Set (6 Persons)",
        sku: "TRC-DIN-006",
        imageUrl:
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80",
        price: 3200,
        quantity: 1,
        discount: 0,
        total: 3200,
      },
    ],
    subtotal: 3200,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 3320,
    amountPaid: 0,
    amountDue: 3320,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    delivery: {
      courier: "Steadfast",
      shippingFee: 120,
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1013-1",
        status: "pending",
        title: "Order Placed",
        description: "COD order placed from Sylhet.",
        actor: "Customer (Farhana Akter)",
        timestamp: "2026-10-29T09:10:00.000Z",
      },
    ],
    createdAt: "2026-10-29T09:10:00.000Z",
    updatedAt: "2026-10-29T09:10:00.000Z",
  },
  {
    id: "ord-1014",
    orderNumber: "CTX-1014",
    customerId: "cust-005",
    customerName: "Arifur Rahman",
    customerPhone: "+8801718667788",
    customerEmail: "arif.rahman@example.com",
    shippingAddress: {
      fullName: "Arifur Rahman",
      phone: "+8801718667788",
      addressLine1: "Shaheb Bazar Zero Point, Ghoramara",
      city: "Rajshahi",
      division: "Rajshahi",
      postalCode: "6100",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-114",
        productId: "prod-004",
        title: "Handcrafted Pure Leather Bifold Wallet",
        sku: "LTH-WLT-004",
        variantName: "Dark Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80",
        price: 1850,
        quantity: 2,
        discount: 0,
        total: 3700,
      },
    ],
    subtotal: 3700,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 3820,
    amountPaid: 3820,
    amountDue: 0,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    paymentReference: "7KP2R11VBN",
    orderStatus: "confirmed",
    fulfillmentStatus: "unfulfilled",
    delivery: {
      courier: "RedX",
      shippingFee: 120,
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1014-1",
        status: "pending",
        title: "Order Placed",
        description: "Paid in full via bKash.",
        actor: "Customer (Arifur Rahman)",
        timestamp: "2026-10-29T08:00:00.000Z",
      },
      {
        id: "evt-1014-2",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Stock verified and order sent for packaging.",
        actor: "Merchant Admin",
        timestamp: "2026-10-29T08:45:00.000Z",
      },
    ],
    createdAt: "2026-10-29T08:00:00.000Z",
    updatedAt: "2026-10-29T08:45:00.000Z",
  },
  {
    id: "ord-1015",
    orderNumber: "CTX-1015",
    customerId: "cust-006",
    customerName: "Sadia Islam",
    customerPhone: "+8801817778899",
    customerEmail: "sadia.islam@example.com",
    shippingAddress: {
      fullName: "Sadia Islam",
      phone: "+8801817778899",
      addressLine1: "Holding 12, Main Road, Boyra",
      city: "Khulna",
      division: "Khulna",
      postalCode: "9000",
      country: "Bangladesh",
    },
    items: [
      {
        id: "item-115",
        productId: "prod-007",
        title: "Aarong Hand-Embroidered Nakshi Kantha",
        sku: "NKS-KNT-007",
        variantName: "Traditional Floral Pattern",
        imageUrl:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80",
        price: 4800,
        quantity: 1,
        discount: 0,
        total: 4800,
      },
    ],
    subtotal: 4800,
    discount: 0,
    shippingFee: 120,
    tax: 0,
    grandTotal: 4920,
    amountPaid: 4920,
    amountDue: 0,
    paymentMethod: "nagad",
    paymentStatus: "paid",
    paymentReference: "8MN5Q77ZZP",
    orderStatus: "processing",
    fulfillmentStatus: "partially_fulfilled",
    delivery: {
      courier: "Pathao",
      shippingFee: 120,
      estimatedDays: "2-3 business days",
    },
    timeline: [
      {
        id: "evt-1015-1",
        status: "pending",
        title: "Order Placed",
        description: "Paid via Nagad online payment.",
        actor: "Customer (Sadia Islam)",
        timestamp: "2026-10-28T16:00:00.000Z",
      },
      {
        id: "evt-1015-2",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Payment confirmed by accounts.",
        actor: "Accountant",
        timestamp: "2026-10-28T16:30:00.000Z",
      },
      {
        id: "evt-1015-3",
        status: "processing",
        title: "Processing",
        description: "Item undergoing pre-dispatch fabric quality check.",
        actor: "Packaging Desk",
        timestamp: "2026-10-28T17:15:00.000Z",
      },
    ],
    createdAt: "2026-10-28T16:00:00.000Z",
    updatedAt: "2026-10-28T17:15:00.000Z",
  },
];

class MockOrderService {
  private memoryOrders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));

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
      console.warn(`[MockOrderService] Failed to persist ${key}:`, e);
    }
  }

  private loadOrders(): Order[] {
    if (typeof window === "undefined") {
      return this.memoryOrders;
    }
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      this.safeSetItem(ORDERS_STORAGE_KEY, this.memoryOrders);
      return this.memoryOrders;
    }
    const parsed = this.safeParse<Order[]>(raw, this.memoryOrders);
    this.memoryOrders = parsed;
    return parsed;
  }

  private saveOrders(orders: Order[]): void {
    this.memoryOrders = orders;
    this.safeSetItem(ORDERS_STORAGE_KEY, orders);
  }

  public canTransition(current: OrderStatus, target: OrderStatus): boolean {
    if (current === target) return true;
    const allowed = VALID_ORDER_STATUS_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  public getOrders(params: OrderFilterParams = {}): PaginatedOrdersResult {
    let list = [...this.loadOrders()];

    // Search filter: Order number, customer name, phone, tracking number, item SKU/title
    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((o) => {
        const matchNumber = o.orderNumber.toLowerCase().includes(q);
        const matchCustomer = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.toLowerCase().includes(q);
        const matchTracking = o.delivery.trackingNumber?.toLowerCase().includes(q);
        const matchItems = o.items.some(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.sku.toLowerCase().includes(q)
        );
        return matchNumber || matchCustomer || matchPhone || matchTracking || matchItems;
      });
    }

    // Order status filter
    if (params.orderStatus && params.orderStatus !== "all") {
      list = list.filter((o) => o.orderStatus === params.orderStatus);
    }

    // Payment status filter
    if (params.paymentStatus && params.paymentStatus !== "all") {
      list = list.filter((o) => o.paymentStatus === params.paymentStatus);
    }

    // Payment method filter
    if (params.paymentMethod && params.paymentMethod !== "all") {
      list = list.filter((o) => o.paymentMethod === params.paymentMethod);
    }

    // Fulfillment status filter
    if (params.fulfillmentStatus && params.fulfillmentStatus !== "all") {
      list = list.filter((o) => o.fulfillmentStatus === params.fulfillmentStatus);
    }

    // Courier filter
    if (params.courier && params.courier !== "all") {
      list = list.filter(
        (o) => o.delivery.courier.toLowerCase() === params.courier!.toLowerCase()
      );
    }

    // Date preset filter
    if (params.datePreset && params.datePreset !== "all") {
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      list = list.filter((o) => {
        const orderTime = new Date(o.createdAt).getTime();
        const diff = now.getTime() - orderTime;
        switch (params.datePreset) {
          case "today":
            return diff <= oneDay;
          case "yesterday":
            return diff > oneDay && diff <= 2 * oneDay;
          case "last7days":
            return diff <= 7 * oneDay;
          case "last30days":
            return diff <= 30 * oneDay;
          default:
            return true;
        }
      });
    }

    // Sorting
    const sortBy = params.sortBy || "date_desc";
    list.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "total_desc":
          return b.grandTotal - a.grandTotal;
        case "total_asc":
          return a.grandTotal - b.grandTotal;
        case "orderNumber_desc":
          return b.orderNumber.localeCompare(a.orderNumber);
        case "date_desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      orders: paginated,
      total,
      page: safePage,
      limit,
      totalPages,
    };
  }

  public getOrderById(id: string): Order | undefined {
    return this.loadOrders().find((o) => o.id === id || o.orderNumber === id);
  }

  public getOrderStats(): OrderKPIStats {
    const list = this.loadOrders();
    const totalOrders = list.length;
    const pendingOrders = list.filter((o) => o.orderStatus === "pending").length;
    const processingOrders = list.filter(
      (o) =>
        o.orderStatus === "confirmed" ||
        o.orderStatus === "processing" ||
        o.orderStatus === "ready_to_ship"
    ).length;
    const shippedOrders = list.filter((o) => o.orderStatus === "shipped").length;
    const deliveredOrders = list.filter(
      (o) => o.orderStatus === "delivered"
    ).length;
    const cancelledOrders = list.filter(
      (o) => o.orderStatus === "cancelled"
    ).length;
    const returnedOrders = list.filter(
      (o) => o.orderStatus === "returned" || o.orderStatus === "partially_returned"
    ).length;

    const nonCancelled = list.filter((o) => o.orderStatus !== "cancelled");
    const totalRevenue = nonCancelled.reduce((sum, o) => sum + o.grandTotal, 0);
    const averageOrderValue =
      nonCancelled.length > 0
        ? Math.round(totalRevenue / nonCancelled.length)
        : 0;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      totalRevenue,
      averageOrderValue,
    };
  }

  public transitionOrderStatus(
    orderId: string,
    targetStatus: OrderStatus,
    actor: string = "Merchant Admin",
    note?: string
  ): Order {
    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    if (!this.canTransition(order.orderStatus, targetStatus)) {
      throw new Error(
        `Cannot transition order from status "${order.orderStatus}" to "${targetStatus}". Valid transitions: ${
          VALID_ORDER_STATUS_TRANSITIONS[order.orderStatus]?.join(", ") || "None"
        }`
      );
    }

    const now = new Date().toISOString();
    let fulfillmentStatus = order.fulfillmentStatus;
    if (targetStatus === "shipped" || targetStatus === "delivered") {
      fulfillmentStatus = "fulfilled";
    } else if (targetStatus === "processing" || targetStatus === "ready_to_ship") {
      fulfillmentStatus = "partially_fulfilled";
    }

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: targetStatus,
        title: `Status changed to ${targetStatus.replace(/_/g, " ")}`,
        description: note || `Order transitioned to ${targetStatus.replace(/_/g, " ")}.`,
        actor,
        timestamp: now,
        note,
      },
    ];

    list[idx] = {
      ...order,
      orderStatus: targetStatus,
      fulfillmentStatus,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);

    // Sync customer metrics
    mockCustomerService.recalculateCustomerMetrics(order.customerId, list);

    return list[idx];
  }

  public cancelOrder(
    orderId: string,
    reason: string,
    actor: string = "Merchant Admin",
    restockInventory: boolean = true
  ): Order {
    if (!reason || reason.trim().length < 3) {
      throw new Error("Cancellation reason must be at least 3 characters");
    }

    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    if (!this.canTransition(order.orderStatus, "cancelled")) {
      throw new Error(
        `Cannot cancel order with current status "${order.orderStatus}". Orders already shipped or delivered cannot be cancelled directly.`
      );
    }

    const now = new Date().toISOString();

    // Restock items into product inventory if requested
    if (restockInventory) {
      for (const item of order.items) {
        try {
          const product = mockProductService.getProductById(item.productId);
          if (product && product.trackInventory) {
            mockProductService.adjustStock({
              productId: item.productId,
              type: "return_restock",
              quantityChange: item.quantity,
              reason: `Restocked from cancelled order ${order.orderNumber}: ${reason.trim()}`,
              referenceId: order.orderNumber,
            });
          }
        } catch (e) {
          console.warn(`[MockOrderService] Restock failed for product ${item.productId}:`, e);
        }
      }
    }

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: "cancelled" as OrderStatus,
        title: "Order Cancelled",
        description: `Order cancelled. Reason: ${reason.trim()}.${
          restockInventory ? " Items restocked to inventory." : ""
        }`,
        actor,
        timestamp: now,
        note: reason.trim(),
      },
    ];

    list[idx] = {
      ...order,
      orderStatus: "cancelled",
      fulfillmentStatus: "unfulfilled",
      cancellationReason: reason.trim(),
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    mockCustomerService.recalculateCustomerMetrics(order.customerId, list);

    return list[idx];
  }

  public returnOrder(
    orderId: string,
    reason: string,
    actor: string = "Merchant Admin",
    restockInventory: boolean = true,
    refundAmount?: number
  ): Order {
    if (!reason || reason.trim().length < 3) {
      throw new Error("Return reason must be at least 3 characters");
    }

    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    if (!this.canTransition(order.orderStatus, "returned")) {
      throw new Error(
        `Cannot return order with current status "${order.orderStatus}". Returns are permitted for shipped or delivered orders.`
      );
    }

    const now = new Date().toISOString();

    if (restockInventory) {
      for (const item of order.items) {
        try {
          const product = mockProductService.getProductById(item.productId);
          if (product && product.trackInventory) {
            mockProductService.adjustStock({
              productId: item.productId,
              type: "return_restock",
              quantityChange: item.quantity,
              reason: `Return restocked from order ${order.orderNumber}: ${reason.trim()}`,
              referenceId: order.orderNumber,
            });
          }
        } catch (e) {
          console.warn(`[MockOrderService] Return restock failed:`, e);
        }
      }
    }

    let paymentStatus = order.paymentStatus;
    let amountPaid = order.amountPaid;
    if (refundAmount !== undefined && refundAmount > 0) {
      paymentStatus = refundAmount >= order.amountPaid ? "refunded" : "partially_refunded";
      amountPaid = Math.max(0, order.amountPaid - refundAmount);
    }

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: "returned" as OrderStatus,
        title: "Order Returned / Refunded",
        description: `Order return recorded. Reason: ${reason.trim()}.${
          refundAmount ? ` Refund amount: ৳${refundAmount}.` : ""
        }`,
        actor,
        timestamp: now,
        note: reason.trim(),
      },
    ];

    list[idx] = {
      ...order,
      orderStatus: "returned",
      returnReason: reason.trim(),
      paymentStatus,
      amountPaid,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    mockCustomerService.recalculateCustomerMetrics(order.customerId, list);

    return list[idx];
  }

  public updateOrderDelivery(
    orderId: string,
    deliveryUpdate: Partial<OrderDelivery>,
    actor: string = "Logistics Engine"
  ): Order {
    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    const now = new Date().toISOString();
    const updatedDelivery: OrderDelivery = {
      ...order.delivery,
      ...deliveryUpdate,
    };

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: order.orderStatus,
        title: `Shipment Linked with ${deliveryUpdate.courier || order.delivery.courier}`,
        description: `Tracking number: ${deliveryUpdate.trackingNumber || "assigned"}. Consignment ID: ${
          deliveryUpdate.consignmentId || "N/A"
        }`,
        actor,
        timestamp: now,
      },
    ];

    list[idx] = {
      ...order,
      delivery: updatedDelivery,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    return list[idx];
  }

  public recordPaymentRefund(
    orderId: string,
    refundAmount: number,
    refundReference?: string,
    reason?: string,
    actor: string = "Merchant Admin"
  ): Order {
    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    const now = new Date().toISOString();
    const newAmountPaid = Math.max(0, order.amountPaid - refundAmount);
    const newAmountDue = Math.max(0, order.grandTotal - newAmountPaid);
    const newPaymentStatus: PaymentStatus =
      newAmountPaid === 0 ? "refunded" : "partially_refunded";

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: order.orderStatus,
        title: `Payment Refund Processed (৳${refundAmount})`,
        description: `Refund of ৳${refundAmount} recorded.${
          reason ? ` Reason: ${reason}.` : ""
        }${refundReference ? ` Ref: ${refundReference}.` : ""}`,
        actor,
        timestamp: now,
      },
    ];

    list[idx] = {
      ...order,
      paymentStatus: newPaymentStatus,
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    return list[idx];
  }

  public markPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentReference?: string,
    amountPaid?: number,
    actor: string = "Merchant Admin"
  ): Order {
    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    const now = new Date().toISOString();
    const newAmountPaid = amountPaid !== undefined ? amountPaid : order.grandTotal;
    const newAmountDue = Math.max(0, order.grandTotal - newAmountPaid);

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: order.orderStatus,
        title: `Payment marked as ${paymentStatus}`,
        description: `Payment status updated. Reference: ${
          paymentReference || order.paymentReference || "N/A"
        }`,
        actor,
        timestamp: now,
      },
    ];

    list[idx] = {
      ...order,
      paymentStatus,
      paymentReference: paymentReference || order.paymentReference,
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    return list[idx];
  }

  public addOrderNote(
    orderId: string,
    note: string,
    actor: string = "Merchant Admin"
  ): Order {
    if (!note || note.trim().length === 0) {
      throw new Error("Note cannot be empty");
    }

    const list = this.loadOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error(`Order ${orderId} not found`);

    const order = list[idx];
    const now = new Date().toISOString();
    const existing = order.internalNotes || "";
    const updatedNotes = existing
      ? `${existing}\n[${new Date().toLocaleDateString("en-BD")} - ${actor}]: ${note.trim()}`
      : `[${new Date().toLocaleDateString("en-BD")} - ${actor}]: ${note.trim()}`;

    const updatedTimeline = [
      ...order.timeline,
      {
        id: `evt-${Date.now().toString(36)}`,
        status: order.orderStatus,
        title: "Internal Note Added",
        description: note.trim(),
        actor,
        timestamp: now,
      },
    ];

    list[idx] = {
      ...order,
      internalNotes: updatedNotes,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    this.saveOrders(list);
    return list[idx];
  }

  public bulkUpdateStatus(
    orderIds: string[],
    targetStatus: OrderStatus,
    actor: string = "Merchant Admin"
  ): { updatedCount: number; skippedCount: number } {
    let updatedCount = 0;
    let skippedCount = 0;

    for (const id of orderIds) {
      const order = this.getOrderById(id);
      if (order && this.canTransition(order.orderStatus, targetStatus)) {
        this.transitionOrderStatus(id, targetStatus, actor);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    return { updatedCount, skippedCount };
  }

  public bulkCancelOrders(
    orderIds: string[],
    reason: string,
    actor: string = "Merchant Admin"
  ): { cancelledCount: number; skippedCount: number } {
    let cancelledCount = 0;
    let skippedCount = 0;

    for (const id of orderIds) {
      const order = this.getOrderById(id);
      if (order && this.canTransition(order.orderStatus, "cancelled")) {
        this.cancelOrder(id, reason, actor, true);
        cancelledCount++;
      } else {
        skippedCount++;
      }
    }

    return { cancelledCount, skippedCount };
  }

  public exportOrdersToCSV(orders: Order[]): string {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Shipping City",
      "Items Count",
      "Grand Total (BDT)",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Courier",
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString("en-BD")}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.shippingAddress.city}"`,
      o.items.reduce((sum, i) => sum + i.quantity, 0),
      o.grandTotal,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.paymentStatus.toUpperCase()}"`,
      `"${o.orderStatus.replace(/_/g, " ").toUpperCase()}"`,
      `"${o.delivery.courier}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  }

  public resetDemoOrders(): Order[] {
    const initial = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.memoryOrders = initial;
    if (typeof window !== "undefined") {
      this.safeSetItem(ORDERS_STORAGE_KEY, initial);
    }
    return initial;
  }
}

export const mockOrderService = new MockOrderService();
