import { randomUUID } from "crypto";
import type {
  Plan, InsertPlan,
  Tenant, InsertTenant,
  Bill, InsertBill,
  Payment, InsertPayment,
  Message, InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Plans
  createPlan(plan: InsertPlan): Promise<Plan>;
  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  updatePlan(id: string, plan: Partial<InsertPlan>): Promise<Plan | undefined>;
  deletePlan(id: string): Promise<boolean>;

  // Tenants
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenants(): Promise<Tenant[]>;
  getTenant(id: string): Promise<Tenant | undefined>;
  updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant | undefined>;
  deleteTenant(id: string): Promise<boolean>;

  // Bills
  createBill(bill: InsertBill): Promise<Bill>;
  getBills(): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | undefined>;
  getBillsByTenant(tenantId: string): Promise<Bill[]>;
  updateBill(id: string, bill: Partial<InsertBill>): Promise<Bill | undefined>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByTenant(tenantId: string): Promise<Payment[]>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessagesByTenant(tenantId: string): Promise<Message[]>;

  // Settings
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private plans: Map<string, Plan>;
  private tenants: Map<string, Tenant>;
  private bills: Map<string, Bill>;
  private payments: Map<string, Payment>;
  private messages: Map<string, Message>;
  private settings: Map<string, string>;

  constructor() {
    this.plans = new Map();
    this.tenants = new Map();
    this.bills = new Map();
    this.payments = new Map();
    this.messages = new Map();
    this.settings = new Map();
    this.settings.set("currency", "USD");
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = randomUUID();
    const plan: Plan = { ...insertPlan, id, createdAt: new Date() };
    this.plans.set(id, plan);
    return plan;
  }

  async getPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async updatePlan(id: string, planUpdate: Partial<InsertPlan>): Promise<Plan | undefined> {
    const plan = this.plans.get(id);
    if (!plan) return undefined;
    const updated = { ...plan, ...planUpdate };
    this.plans.set(id, updated);
    return updated;
  }

  async deletePlan(id: string): Promise<boolean> {
    return this.plans.delete(id);
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = randomUUID();
    const tenant: Tenant = { 
      ...insertTenant, 
      id, 
      createdAt: new Date(),
      password: insertTenant.password ?? null,
      isActive: insertTenant.isActive ?? true,
      planId: insertTenant.planId ?? null,
      electricityRate: insertTenant.electricityRate ?? null,
      electricityCurrentReading: insertTenant.electricityCurrentReading ?? null,
      electricityStartingReading: insertTenant.electricityStartingReading ?? null,
      electricityEndingReading: insertTenant.electricityEndingReading ?? null,
      waterCharges: insertTenant.waterCharges ?? null,
      remarks: insertTenant.remarks ?? null,
      documents: insertTenant.documents ?? null,
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async updateTenant(id: string, tenantUpdate: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(id);
    if (!tenant) return undefined;
    const updated = { ...tenant, ...tenantUpdate };
    this.tenants.set(id, updated);
    return updated;
  }

  async deleteTenant(id: string): Promise<boolean> {
    return this.tenants.delete(id);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = randomUUID();
    const bill: Bill = { 
      ...insertBill, 
      id, 
      createdAt: new Date(),
      electricityAmount: insertBill.electricityAmount ?? null,
      waterAmount: insertBill.waterAmount ?? null,
    };
    this.bills.set(id, bill);
    return bill;
  }

  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }

  async getBill(id: string): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async getBillsByTenant(tenantId: string): Promise<Bill[]> {
    return Array.from(this.bills.values()).filter(bill => bill.tenantId === tenantId);
  }

  async updateBill(id: string, billUpdate: Partial<InsertBill>): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) return undefined;
    const updated = { ...bill, ...billUpdate };
    this.bills.set(id, updated);
    return updated;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      createdAt: new Date(),
      billId: insertPayment.billId ?? null,
      discount: insertPayment.discount ?? null,
      remarks: insertPayment.remarks ?? null,
      signature: insertPayment.signature ?? null,
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.tenantId === tenantId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      attachmentType: insertMessage.attachmentType ?? null,
      attachmentId: insertMessage.attachmentId ?? null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessagesByTenant(tenantId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(msg => msg.tenantId === tenantId);
  }

  async getSetting(key: string): Promise<string | undefined> {
    return this.settings.get(key);
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.settings.set(key, value);
  }
}

export const storage = new MemStorage();
