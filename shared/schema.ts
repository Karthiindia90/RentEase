import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billingName: text("billing_name").notNull(),
  password: text("password"),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  rentalAddress: text("rental_address"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  isActive: boolean("is_active").default(true).notNull(),
  planId: varchar("plan_id").references(() => plans.id),
  billingCycle: text("billing_cycle").notNull(), // "end_of_month" or number of days
  billingType: text("billing_type").notNull(), // "prepaid" or "postpaid"
  electricityRate: decimal("electricity_rate", { precision: 10, scale: 4 }),
  electricityCurrentReading: integer("electricity_current_reading"),
  electricityStartingReading: integer("electricity_starting_reading"),
  electricityEndingReading: integer("electricity_ending_reading"),
  waterCharges: decimal("water_charges", { precision: 10, scale: 2 }),
  remarks: text("remarks"),
  documents: text("documents").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  planAmount: decimal("plan_amount", { precision: 10, scale: 2 }).notNull(),
  electricityAmount: decimal("electricity_amount", { precision: 10, scale: 2 }).default("0"),
  waterAmount: decimal("water_amount", { precision: 10, scale: 2 }).default("0"),
  billDate: timestamp("bill_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull(), // "paid", "overdue", "pending"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id).notNull(),
  billId: varchar("bill_id").references(() => bills.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  paymentMode: text("payment_mode").notNull(), // "cash", "check", "online", "card"
  paymentDate: timestamp("payment_date").notNull(),
  remarks: text("remarks"),
  signature: text("signature"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id).notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "admin" or "tenant"
  attachmentType: text("attachment_type"), // "payment_link", "bill", "receipt", null
  attachmentId: varchar("attachment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

// Insert schemas
export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true });
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true });
export const insertBillSchema = createInsertSchema(bills).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true }).extend({
  paymentDate: z.coerce.date(),
});
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// Types
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
