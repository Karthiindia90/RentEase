import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlanSchema, 
  insertTenantSchema, 
  insertBillSchema, 
  insertPaymentSchema,
  insertMessageSchema 
} from "@shared/schema";
import { addDays, addMonths, isAfter, isBefore, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Plan routes
  app.get("/api/plans", async (req, res) => {
    const plans = await storage.getPlans();
    res.json(plans);
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const planData = insertPlanSchema.parse(req.body);
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.updatePlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    const deleted = await storage.deletePlan(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json({ success: true });
  });

  // Tenant routes
  app.get("/api/tenants", async (req, res) => {
    const tenants = await storage.getTenants();
    const bills = await storage.getBills();
    const payments = await storage.getPayments();

    const tenantsWithStatus = tenants.map(tenant => {
      const tenantBills = bills.filter(b => b.tenantId === tenant.id).sort((a, b) => 
        new Date(b.billDate).getTime() - new Date(a.billDate).getTime()
      );
      const tenantPayments = payments.filter(p => p.tenantId === tenant.id);

      const lastBill = tenantBills[0];
      const totalPaid = tenantPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalBilled = tenantBills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
      const balance = totalBilled - totalPaid;

      let status: "paid" | "overdue" | "pending" = "paid";
      if (lastBill) {
        const now = new Date();
        if (balance > 0 && isAfter(now, new Date(lastBill.dueDate))) {
          status = "overdue";
        } else if (balance > 0) {
          status = "pending";
        }
      }

      return {
        ...tenant,
        lastBill: lastBill ? {
          id: lastBill.id,
          amount: parseFloat(lastBill.amount),
          date: lastBill.billDate,
          dueDate: lastBill.dueDate,
        } : null,
        balance,
        status,
        lastPaymentDate: tenantPayments.length > 0 
          ? tenantPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0].paymentDate
          : null,
      };
    });

    res.json(tenantsWithStatus);
  });

  app.get("/api/tenants/:id", async (req, res) => {
    const tenant = await storage.getTenant(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const bills = await storage.getBillsByTenant(req.params.id);
    const payments = await storage.getPaymentsByTenant(req.params.id);
    const plan = tenant.planId ? await storage.getPlan(tenant.planId) : null;

    const totalBilled = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const balance = totalBilled - totalPaid;

    res.json({
      ...tenant,
      plan,
      bills,
      payments,
      balance,
    });
  });

  app.post("/api/tenants", async (req, res) => {
    try {
      const tenantData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(tenantData);

      // Generate first bill if plan exists
      if (tenant.planId) {
        const plan = await storage.getPlan(tenant.planId);
        if (plan) {
          const billDate = new Date();
          let dueDate: Date;
          
          if (tenant.billingCycle === "end_of_month") {
            dueDate = addMonths(startOfDay(billDate), 1);
            dueDate.setDate(0); // Last day of month
          } else {
            const days = parseInt(tenant.billingCycle);
            dueDate = addDays(billDate, days);
          }

          const electricityAmount = tenant.electricityRate && tenant.electricityStartingReading && tenant.electricityCurrentReading
            ? (tenant.electricityCurrentReading - tenant.electricityStartingReading) * parseFloat(tenant.electricityRate)
            : 0;

          const waterAmount = tenant.waterCharges ? parseFloat(tenant.waterCharges) : 0;
          const totalAmount = parseFloat(plan.rate) + electricityAmount + waterAmount;

          await storage.createBill({
            tenantId: tenant.id,
            amount: totalAmount.toString(),
            planAmount: plan.rate,
            electricityAmount: electricityAmount.toString(),
            waterAmount: waterAmount.toString(),
            billDate,
            dueDate,
            status: "pending",
          });
        }
      }

      res.json(tenant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tenants/:id", async (req, res) => {
    try {
      const tenant = await storage.updateTenant(req.params.id, req.body);
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tenants/:id", async (req, res) => {
    const deleted = await storage.deleteTenant(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Tenant not found" });
    }
    res.json({ success: true });
  });

  // Bill routes
  app.get("/api/bills", async (req, res) => {
    const bills = await storage.getBills();
    res.json(bills);
  });

  app.get("/api/bills/tenant/:tenantId", async (req, res) => {
    const bills = await storage.getBillsByTenant(req.params.tenantId);
    res.json(bills);
  });

  app.post("/api/bills/generate", async (req, res) => {
    try {
      const { tenantId } = req.body;
      const tenant = await storage.getTenant(tenantId);
      if (!tenant || !tenant.planId) {
        return res.status(400).json({ error: "Tenant or plan not found" });
      }

      const plan = await storage.getPlan(tenant.planId);
      if (!plan) {
        return res.status(400).json({ error: "Plan not found" });
      }

      const billDate = new Date();
      let dueDate: Date;
      
      if (tenant.billingCycle === "end_of_month") {
        dueDate = addMonths(startOfDay(billDate), 1);
        dueDate.setDate(0);
      } else {
        const days = parseInt(tenant.billingCycle);
        dueDate = addDays(billDate, days);
      }

      const electricityAmount = tenant.electricityRate && tenant.electricityStartingReading && tenant.electricityCurrentReading
        ? (tenant.electricityCurrentReading - tenant.electricityStartingReading) * parseFloat(tenant.electricityRate)
        : 0;

      const waterAmount = tenant.waterCharges ? parseFloat(tenant.waterCharges) : 0;
      const totalAmount = parseFloat(plan.rate) + electricityAmount + waterAmount;

      const bill = await storage.createBill({
        tenantId: tenant.id,
        amount: totalAmount.toString(),
        planAmount: plan.rate,
        electricityAmount: electricityAmount.toString(),
        waterAmount: waterAmount.toString(),
        billDate,
        dueDate,
        status: "pending",
      });

      res.json(bill);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Payment routes
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);

      // Update bill status if billId is provided
      if (payment.billId) {
        const bill = await storage.getBill(payment.billId);
        if (bill) {
          const billAmount = parseFloat(bill.amount);
          const paymentAmount = parseFloat(payment.amount);
          const discount = payment.discount ? parseFloat(payment.discount) : 0;
          
          if (paymentAmount + discount >= billAmount) {
            await storage.updateBill(payment.billId, { status: "paid" });
          }
        }
      }

      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/payments/tenant/:tenantId", async (req, res) => {
    const payments = await storage.getPaymentsByTenant(req.params.tenantId);
    res.json(payments);
  });

  app.delete("/api/payments/:id", async (req, res) => {
    const deleted = await storage.deletePayment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ success: true });
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.get("/api/messages/tenant/:tenantId", async (req, res) => {
    const messages = await storage.getMessagesByTenant(req.params.tenantId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reports routes
  app.get("/api/reports/today", async (req, res) => {
    const payments = await storage.getPayments();
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate >= todayStart && paymentDate <= todayEnd;
    });

    const total = todayPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      total,
      count: todayPayments.length,
      payments: todayPayments,
    });
  });

  app.get("/api/reports/month", async (req, res) => {
    const payments = await storage.getPayments();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate >= monthStart && paymentDate <= monthEnd;
    });

    const total = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      total,
      count: monthPayments.length,
      payments: monthPayments,
    });
  });

  app.get("/api/reports/week", async (req, res) => {
    const payments = await storage.getPayments();
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

    const weekPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate >= weekStart && paymentDate <= weekEnd;
    });

    const total = weekPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      total,
      count: weekPayments.length,
      payments: weekPayments,
    });
  });

  app.get("/api/reports/custom", async (req, res) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const payments = await storage.getPayments();
    const start = startOfDay(new Date(startDate as string));
    const end = endOfDay(new Date(endDate as string));

    const customPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate >= start && paymentDate <= end;
    });

    const total = customPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      total,
      count: customPayments.length,
      payments: customPayments,
    });
  });

  app.get("/api/reports/pending", async (req, res) => {
    const tenants = await storage.getTenants();
    const bills = await storage.getBills();
    const payments = await storage.getPayments();

    const pendingByTenant = tenants.map(tenant => {
      const tenantBills = bills.filter(b => b.tenantId === tenant.id);
      const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
      
      const totalBilled = tenantBills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
      const totalPaid = tenantPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pending = totalBilled - totalPaid;

      return {
        tenantId: tenant.id,
        tenantName: tenant.billingName,
        pending,
      };
    }).filter(t => t.pending > 0);

    const totalPending = pendingByTenant.reduce((sum, t) => sum + t.pending, 0);

    res.json({
      total: totalPending,
      tenants: pendingByTenant,
    });
  });

  // Settings routes
  app.get("/api/settings/currency", async (req, res) => {
    const currency = await storage.getSetting("currency") || "USD";
    res.json({ currency });
  });

  app.post("/api/settings/currency", async (req, res) => {
    const { currency } = req.body;
    await storage.setSetting("currency", currency);
    res.json({ currency });
  });

  const httpServer = createServer(app);
  return httpServer;
}
