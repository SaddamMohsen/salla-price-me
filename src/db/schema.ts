

import { serial, text, timestamp, pgTable, numeric, integer, date, boolean, PgNumeric, PgDoublePrecision, } from "drizzle-orm/pg-core";

export const accounts = pgTable('accounts', {
    id: serial("id").primaryKey(),
    access_token: text("access_token"),
    expiredIn: integer('expired_in'),//timestamp('expired_in', { mode: "string" }),
    refresh_token: text("refresh_token"),
    user_id: integer("user_id").references(() => users.id),
});
export const users = pgTable("users", {

    id: integer("id").primaryKey().notNull().unique(),
    name: text("name"),
    email: text("email"),
    mobile: text("mobile"),
    role: text("role"),    //.$type<"admin" | "user">(),
    createdAt: text("created_at"),
    updatedAt: text("updated_at"),

});

export const merchants = pgTable("merchants", {
    id: integer("id").primaryKey(),//1500169364,
    username: text("username"),
    name: text('name'),// 'متجر تجريبي',
    avatar: text('avatar'), //'https://salla-dev.s3.eu-central-1.amazonaws.com/logo/logo-fashion.jpg',
    store_location: text('location'),
    plan: text('plan'),//'pro',
    status: text('status'),//'active',
    domain: text('domain'), // 'https://salla.sa/dev-fhopssdfrv7rpkp9',
    tax_number: integer('tax_number'),
    commercial_number: integer('commercial_number'),// null,
    created_at: text('created_at'), // '2024-07-11 23:31:34',
    owner: integer('owner').references(() => users.id)
});

export const products=pgTable("products",{
  id:integer("id"),
  sku:text("sku"),
  mpn:text('mpn') ,
  gtin:text('gtin'),
  type:text('type'), //VARCHAR(20) NOT NULL CHECK(type IN ('product')),
  name:text("name"),// VARCHAR(255) NOT NULL,
  // short_link_code:text('') VARCHAR(20) NOT NULL,
  description:text("description"),// TEXT NOT NULL,
  quantity:integer("quantity"),// INTEGER NULL,
  status:text("status"),// VARCHAR(20) NOT NULL CHECK(status IN ('sale')),
  is_available:boolean("is_available"),// BOOLEAN NOT NULL DEFAULT TRUE,
  // views: INTEGER NOT NULL DEFAULT 0,
  cost_price:numeric("cost_price",{precision:2,scale:10}), 
  price:numeric("price",{precision:2,scale:10}),
  regular_price:numeric('regular_price',{scale:10,precision:2}),
  taxed_price:numeric("taxed_price",{precision:2,scale:10}),
   pre_tax_price:numeric('pre_tax_price',{precision:2,scale:10}),
   tax:numeric('tax',{precision:2,scale:10}),
  weight:numeric('weight'), //DECIMAL(10, 2) NOT NULL DEFAULT 0,
  weight_type:text('weight_type').default('g'),// VARCHAR(10) NOT NULL CHECK(weight_type IN ('kg')),
  with_tax:boolean(" with_tax"), // BOOLEAN NOT NULL DEFAULT TRUE

});
/*product data from salla

        "price": {
          "amount": 164,
          "currency": "SAR"
        },
        "taxed_price": {
          "amount": 164,
          "currency": "SAR"
        },
        "pre_tax_price": {
          "amount": 164,
          "currency": "SAR"
        },
        "tax": {
          "amount": 0,
          "currency": "SAR"
        },
        regular_price": {
          "amount": 329,
          "currency": "SAR"
        }

                "cost_price": "",
        "weight": 0,
        "weight_type": "kg",
{
      id: 1548985480,
      promotion: [Object],
      sku: '15504448-30000024230-',
      thumbnail: 'https://salla-dev.s3.eu-central-1.amazonaws.com/nWzD/ACknxzEIkcTdaFr1DETbQlXo5UwupBedJ9ZGyR8v.jpg',
      mpn: null,
      gtin: null,
      type: 'product',
      name: 'فستان',
      short_link_code: 'GYoovGn',
      urls: [Object],
      price: {
          "amount": 164,
          "currency": "SAR"
        },
      taxed_price:{
          "amount": 164,
          "currency": "SAR"
        },
      pre_tax_price: {
          "amount": 164,
          "currency": "SAR"
        },
      tax:{
          "amount": 164,
          "currency": "SAR"
        },
      description: 'المقاس36نصف محيط الخصر17الطول107الكم53818107540191095.542201095.544211126',
      quantity: null,
      status: 'sale',
      is_available: true,
      views: 0,
      cost_price: '',
      weight: 0,
      weight_type: 'kg',
      with_tax: true,
      sale_price: {
          "amount": 164,
          "currency": "SAR"
        },
      sale_end: null,
      require_shipping: true,
      
      url: 'https://salla.sa/dev-fhopssdfrv7rpkp9/فستان/p1548985480',
      main_image: 'https://salla-dev.s3.eu-central-1.amazonaws.com/nWzD/ACknxzEIkcTdaFr1DETbQlXo5UwupBedJ9ZGyR8v.jpg',
      images: [Array],
      sold_quantity: 0,
      rating: [Object],
      regular_price: [Object],
      max_items_per_user: 0,
      maximum_quantity_per_order: null,
      show_in_app: false,
      notify_quantity: null,
      hide_quantity: false,
      unlimited_quantity: true,
      managed_by_branches: false,
      services_blocks: [Object],
      calories: null,
      customized_sku_quantity: false,
      channels: [],
      metadata: [Object],
      allow_attachments: false,
      is_pinned: false,
      pinned_date: '2021-08-26 10:05:20',
      active_advance: true,
      sort: 0,
      enable_upload_image: false,
      updated_at: '2024-07-11 23:31:35',
      options: [Array],
      skus: [Array],
      categories: [Array],
      tags: []
    }
     */ 
//user data from salla: {
//     id: 865761038,
//     name: 'Demo',
//     email: 'fhopssdfrv7rpkp9@email.partners',
//     mobile: '+966500000000',
//     role: 'user',
//     created_at: '2024-07-11 23:31:35',
//     merchant: {
//       id: 1500169364,
//       username: 'dev-fhopssdfrv7rpkp9',
//       name: 'متجر تجريبي',
//       avatar: 'https://salla-dev.s3.eu-central-1.amazonaws.com/logo/logo-fashion.jpg',
//       store_location: null,
//       plan: 'pro',
//       status: 'active',
//       domain: 'https://salla.sa/dev-fhopssdfrv7rpkp9',
//       tax_number: null,
//       commercial_number: null,
//       created_at: '2024-07-11 23:31:34'
//     },