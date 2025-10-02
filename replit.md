# Rent Management Mobile App

## Overview
A comprehensive mobile-first rent management application for property admins to manage tenants, billing, payments, messaging, and reporting. Built with React + TypeScript frontend and Express backend.

## Project Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js with in-memory storage
- **UI Components**: Radix UI + shadcn/ui with Tailwind CSS
- **Database**: In-memory storage (MemStorage) - can be migrated to PostgreSQL later

### Key Features
1. **Plan Management**: Create and delete rental plans with custom rates
2. **Tenant Management**: Full CRUD with document uploads, balance tracking, custom billing, and edit functionality
3. **Automatic Billing**: Bills generated based on billing cycles (end-of-month or custom days)
4. **Payment Collection**: Multiple payment modes with discounts and signature capture
5. **Payment Correction**: Delete wrong payments with automatic balance recalculation
6. **Utility Tracking**: Electricity and water charge calculations
7. **Messaging System**: SMS/Email notifications with payment links and receipts
8. **Reporting**: Today's collection, monthly collection, and pending amounts
9. **Currency Support**: Dynamic multi-currency system with real-time symbol updates across entire app

### Database Schema (shared/schema.ts)

**Plans Table**
- id (auto-generated)
- name
- rate (monthly rent amount)

**Tenants Table**
- id, billingName (required), phoneNumber (optional), email (optional), rentalAddress (optional)
- securityDeposit, planId
- billingType: "prepaid" | "postpaid"
- billingCycle: "end_of_month" | "1" (1st day) | custom day (1-31)
- electricityRate, waterCharges (for utility calculations)
- isActive, remarks, documents: array of file paths

**Bills Table**
- id, tenantId, amount, dueDate
- status: "pending" | "paid" | "overdue"
- electricityUsage, waterUsage, electricityCharge, waterCharge

**Payments Table**
- id, tenantId, billId (optional), amount, discount
- paymentDate, paymentMode, remarks

**Messages Table**
- id, tenantId, content, sender, timestamp
- attachmentType: "payment_link" | "bill" | "receipt"

**Settings Table**
- currency: global currency setting

### API Routes (server/routes.ts)

**Plans**
- GET /api/plans - List all plans
- POST /api/plans - Create new plan
- DELETE /api/plans/:id - Delete plan

**Tenants**
- GET /api/tenants - List tenants (with calculated status)
- GET /api/tenants/:id - Get single tenant details
- POST /api/tenants - Create tenant (auto-generates first bill)
- PATCH /api/tenants/:id - Update tenant (used for edit and isActive toggle)
- DELETE /api/tenants/:id - Delete tenant

**Bills**
- GET /api/bills/tenant/:tenantId - Get bills for tenant
- POST /api/bills - Create bill manually
- PUT /api/bills/:id - Update bill status

**Payments**
- GET /api/payments/tenant/:tenantId - Get payments for tenant
- POST /api/payments - Create payment (updates bill status and tenant balance)
- DELETE /api/payments/:id - Delete payment (recalculates tenant balance)

**Messages**
- GET /api/messages - All messages
- GET /api/messages/tenant/:tenantId - Messages for specific tenant
- POST /api/messages - Send message

**Reports**
- GET /api/reports/today - Today's collection summary
- GET /api/reports/month - This month's collection summary
- GET /api/reports/pending - Pending amounts by tenant

**Settings**
- GET /api/settings/currency - Get currency setting
- POST /api/settings/currency - Update currency

### Frontend Structure

**Pages** (client/src/pages/)
- Dashboard.tsx - Overview with stats and quick actions
- Plans.tsx - Manage rental plans
- TenantList.tsx - List tenants with filtering
- TenantDetail.tsx - Individual tenant details, payment history, and payment deletion
- TenantForm.tsx - Create and edit tenants (dual mode)
- Reports.tsx - Collection and pending reports
- Messages.tsx - Messaging interface

**Components** (client/src/components/)
- TenantCard.tsx - Tenant card with status indicator and quick payment
- PaymentCollectionDialog.tsx - Payment collection form with dynamic currency
- PaymentHistoryItem.tsx - Payment history display with dynamic currency
- PlanCard.tsx - Plan card with delete functionality
- CurrencySelector.tsx - Global currency selector with icon display
- BottomNav.tsx - Mobile navigation
- ui/ - shadcn/ui components

**Hooks** (client/src/hooks/)
- use-currency.tsx - Centralized currency hook providing symbol, code, and available currencies

### Design Approach
- **Material Design 3** inspired mobile-first UI
- **Bottom Navigation** for mobile accessibility
- **Color-coded Status**:
  - Green: Paid
  - Red: Overdue
  - Amber: Due soon
  - Blue: Pending (new bills)

### Billing Logic
1. When tenant is created, first bill is generated immediately
2. Bills are created as "pending" status initially
3. Status updates to "overdue" if unpaid past due date
4. Prepaid tenants: Bill on signup day each month
5. Postpaid tenants: Bill on end-of-month or custom day
6. Electricity/water charges calculated: usage × rate
7. Total bill = plan rate + utility charges

### Payment Flow
1. Collect payment via PaymentCollectionDialog
2. Amount and discount are validated and parsed to numbers
3. Payment date sent as ISO string
4. Backend updates:
   - Creates payment record
   - Updates associated bill status to "paid"
   - Reduces tenant balance
5. Cache invalidated for tenants, payments, reports

### Currency System
1. **Centralized Hook**: `useCurrency()` hook provides single source of truth for currency data
2. **Dynamic Display**: All currency symbols update instantly when user changes currency selection
3. **Components Using Currency**:
   - Dashboard (stats, collections)
   - Plans (plan cards, form labels)
   - TenantCard (balance display)
   - TenantDetail (all monetary values, payment history)
   - Reports (collections, pending amounts)
   - PaymentCollectionDialog (all labels and balances)
   - PaymentHistoryItem (payment amounts)
4. **Backend Persistence**: Currency selection stored in settings table
5. **Supported Currencies**: USD, EUR, GBP, INR, JPY, CNY with proper symbols

### User Preferences
- Mobile-first design with bottom navigation
- Material Design 3 color scheme
- Real data from backend (no mock data in production)
- Optimistic updates for currency changes

## Recent Changes (Latest First)
- **Edit Tenant & Delete Payment Features** (October 2, 2025):
  - **Edit Tenant**: Added dedicated edit route `/tenants/:id/edit` that reuses TenantForm component
    - Edit button (icon) in TenantDetail page header
    - Form automatically pre-fills with existing tenant data
    - Uses PATCH `/api/tenants/:id` for updates
    - Fixed infinite render loop by using useEffect with ref to track form population
    - Redirects to tenant detail page after successful update
  - **Delete Payment**: Added ability to delete incorrect payments
    - DELETE `/api/payments/:id` endpoint with 404 handling for missing payments
    - Trash icon button next to each payment in payment history
    - Disabled state during deletion to prevent duplicate requests
    - Comprehensive cache invalidation: payments, tenants, and all reports
    - Success/error toasts for user feedback
    - Tenant balance automatically recalculated
- **Quick Actions Implementation** (October 2, 2025):
  - **Send Bill**: Sends latest bill to tenant via messaging system with "bill" attachment type
  - **Send Receipt**: Sends latest payment receipt to tenant via messaging system with "receipt" attachment type  
  - **Renew Tenant**: Generates new bill for tenant using POST `/api/bills/generate` endpoint
  - All quick actions have proper error handling, disabled states during pending, and success/error toasts
  - Message cache invalidation ensures Messages page reflects sent bills/receipts immediately
- **Bug Fixes & Feature Enhancements** (October 2, 2025):
  - **Reports Cache Fix**: Fixed today's collection not updating after payment by targeting specific report query keys (`/api/reports/today`, `/api/reports/month`, `/api/reports/pending`) in cache invalidation
  - **Tenant Active/Inactive Toggle**: Added Switch component in TenantDetail page to toggle tenant's `isActive` status
    - Switch disabled during mutation (isPending) to prevent repeated clicks
    - Badge updates to show "Active" (green) or "Inactive" (muted)
    - PATCH `/api/tenants/:id` endpoint used for updates
    - Cache invalidation for both tenant detail and tenants list
- **Tenant Form Enhancements**:
  - Made phone, email, and address optional fields in tenant creation
  - Fixed plan dropdown to show dynamic currency symbol (not hardcoded $)
  - Updated billing cycle options: End of Month, 1st Day of Month, Custom Day (1-31)
  - Added validation for custom billing day when custom option is selected
- **Currency System Enhancement**:
  - Created centralized `useCurrency()` hook for global currency state
  - Updated all components to dynamically display currency symbols
  - Currency selector now shows currency-specific icons
  - All monetary values react instantly to currency changes
- **Plan Management**:
  - Added delete functionality to Plans page with trash icon
  - AlertDialog confirmation before plan deletion (cancel/confirm options)
  - Proper cache invalidation after deletion
  - Delete flow: Click trash → Confirmation appears → Cancel keeps plan / Confirm deletes plan
- **Payment Collection Fixes**:
  - Fixed payment data type issues (amount/discount as numbers, date as ISO string)
  - Added optimistic updates for currency selector
- **Full Backend Integration**:
  - Connected all pages to backend APIs
  - Removed all mock data from frontend

## Development Notes
- Using in-memory storage - data resets on server restart
- All API routes properly validate with Zod schemas
- React Query handles caching and invalidation
- Currency setting persisted in settings table
