/**
 * Bangladesh Administrative Districts and Commerce Reference Data
 * Target Market: Bangladesh (CARTX_MERCHANT_DASHBOARD.md Section 1.2)
 */

export const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Comilla",
  "Bogura",
  "Cox's Bazar",
  "Feni",
  "Tangail",
  "Jessore",
  "Kushtia",
  "Narsingdi",
  "Dinajpur",
  "Pabna",
  "Noakhali",
  "Brahmanbaria",
  "Faridpur",
  "Jamalpur",
] as const;

export const BUSINESS_CATEGORIES = [
  { id: "clothing_fashion", name: "Fashion & Clothing (পোশাক ও ফ্যাশন)" },
  { id: "electronics_gadgets", name: "Electronics & Gadgets (ইলেকট্রনিক্স ও গ্যাজেট)" },
  { id: "groceries_food", name: "Groceries & Daily Essentials (মুদি ও নিত্যপ্রয়োজনীয়)" },
  { id: "health_beauty", name: "Health & Beauty (সৌন্দর্য ও স্বাস্থ্যসেবা)" },
  { id: "home_living", name: "Home & Lifestyle (হোম ও লিভিং)" },
  { id: "books_stationery", name: "Books & Stationery (বই ও স্টেশনারি)" },
  { id: "footwear_bags", name: "Footwear & Bags (জুতো ও ব্যাগ)" },
  { id: "jewelry_accessories", name: "Jewelry & Accessories (জুয়েলারি ও অনুষঙ্গ)" },
  { id: "general_ecommerce", name: "General Retail (সাধারণ রিটেইল স্টোর)" },
] as const;

export const BUSINESS_TYPES = [
  { id: "individual", label: "Sole Proprietorship / Individual (একক মালিকানা)" },
  { id: "partnership", label: "Partnership (অংশীদারি কারবার)" },
  { id: "registered_company", label: "Private Limited Company (প্রাইভেট লিমিটেড)" },
] as const;

