# Rent Management Mobile App - Design Guidelines

## Design Approach

**Selected Approach**: Design System - Material Design 3
**Justification**: This is a utility-focused, information-dense admin application requiring consistent patterns, efficient data entry, and quick navigation. Material Design 3 provides robust mobile patterns for forms, tables, and dashboards while maintaining excellent usability on smaller screens.

## Core Design Principles

1. **Efficiency First**: Every interaction optimized for speed
2. **Data Clarity**: Financial information must be immediately scannable
3. **Mobile Optimization**: Touch-friendly targets, thumb-zone navigation
4. **Status Visibility**: Payment states, tenant status, and alerts prominently displayed

## Color Palette

### Light Mode
- **Primary**: 221 83% 53% (Professional blue - trust and stability)
- **Primary Container**: 221 100% 95%
- **Secondary**: 142 71% 45% (Success green for payments)
- **Error**: 0 84% 60% (Overdue/unpaid alerts)
- **Warning**: 38 92% 50% (Approaching due dates)
- **Surface**: 0 0% 100%
- **Surface Variant**: 220 14% 96%
- **Outline**: 220 13% 75%

### Dark Mode
- **Primary**: 221 84% 65%
- **Primary Container**: 221 45% 25%
- **Secondary**: 142 50% 55%
- **Error**: 0 72% 70%
- **Warning**: 38 80% 60%
- **Surface**: 220 15% 12%
- **Surface Variant**: 220 12% 18%
- **Outline**: 220 10% 35%

## Typography

**Font Family**: Roboto (via Google Fonts CDN) - optimized for mobile readability

**Scale**:
- **Display**: 32px/700 - Dashboard headers
- **Headline**: 24px/600 - Page titles
- **Title**: 20px/600 - Card headers, section titles
- **Body Large**: 16px/400 - Primary content, form labels
- **Body**: 14px/400 - Secondary content, table data
- **Label**: 12px/500 - Input labels, captions
- **Caption**: 11px/400 - Metadata, timestamps

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent padding: p-4 for cards, p-6 for sections
- Form spacing: gap-4 between fields, gap-6 between sections
- List items: py-3 for comfortable touch targets

**Container Widths**:
- Mobile: Full width with px-4 margins
- Tablet: max-w-3xl centered
- Content areas: px-4 to px-6 responsive

## Component Library

### Navigation
**Bottom Navigation Bar** (Material Design mobile pattern)
- 5 primary sections: Dashboard, Tenants, Plans, Reports, Messages
- Icons from Material Icons CDN
- Active state with primary color fill and label
- 56px height for comfortable thumb access

**Top App Bar**
- 64px height with page title, search icon, and action buttons
- Elevated shadow on scroll
- Back navigation for detail screens

### Dashboard Cards
**Metrics Cards** (3-column grid on mobile landscape, 2-column portrait)
- Total Tenants, Paid This Month, Unpaid, Pending Amount
- Large numbers (32px/700) with icons
- Color-coded: green for paid, red for unpaid, amber for pending
- Tap to filter tenant list

**Quick Actions Card**
- "Collect Payment", "Add Tenant", "Generate Report" buttons
- Filled tonal buttons with icons
- 2-column grid, 48px height targets

### Tenant List
**List Items** (Material Design elevated cards)
- Each card contains: Tenant name (16px/600), Address (14px/400), Status badge, Last payment date, Balance amount (prominent)
- Color-coded left border: green (paid), red (overdue), amber (due soon)
- Swipe actions: Message, View Details
- 80px minimum height for touch comfort

**Filter Chips** (Top of list)
- All, Paid, Unpaid, Due This Month
- Material Design filter chip component
- Selected state with primary container color

### Tenant Detail Screen
**Header Section**
- Tenant name, status badge, contact icons (call, email, message)
- Property address
- Active/Inactive toggle switch

**Information Cards** (Stacked vertically)
1. **Current Status Card**
   - Last bill amount, date, balance, expiration date
   - Large typography for balance (24px/700)
   - Status indicator dot with color coding

2. **Quick Actions Card**
   - "Collect Payment", "Send Bill", "Send Receipt", "Change Balance", "Renew"
   - Icon buttons in 2-column grid

3. **Billing Details Accordion**
   - Plan name and rate
   - Security deposit
   - Electricity: Rate, current/starting/ending readings
   - Water charges
   - Billing cycle, prepaid/postpaid
   - Expandable sections to reduce clutter

4. **Documents Section**
   - Grid of document thumbnails with labels
   - Upload button (FAB style)

5. **Payment History**
   - Timeline view with date, amount, mode, balance markers
   - Scrollable list with dividers

### Forms

**Tenant Creation/Edit** (Multi-step form with progress indicator)
- Step 1: Basic Info (name, address, phone, email)
- Step 2: Billing Setup (plan, cycle, prepaid/postpaid, security deposit)
- Step 3: Utilities (electricity rates and readings, water charges)
- Step 4: Documents & Remarks

**Field Styling**:
- Material Design outlined text fields
- Floating labels
- Helper text below fields
- Error states with red outline and message
- 56px height for text inputs
- Dropdown selectors with material menu component
- Date pickers with material calendar
- Toggle switches for binary choices (active/inactive, prepaid/postpaid)

**Payment Collection Form**
- Current balance displayed prominently at top
- Discount input (optional, clearly labeled)
- New balance auto-calculated and shown
- Payment mode dropdown (Cash, Check, Online, Card)
- Date picker (defaults to today)
- Remarks text area
- Signature capture canvas (white background with border)
- Action buttons: "Save & Print", "Send SMS", "Send Email"
- Material Design filled buttons for primary actions

### Plan Management
**Plan List**
- Simple cards with plan name and rate
- Edit icon button (top right)
- Add button (FAB bottom right)

**Create/Edit Plan Form**
- Plan name text field
- Rate numeric input with currency symbol
- Save button (filled, full width)

### Reports Screen
**Date Range Selector**
- Material date range picker
- Quick filters: Today, This Week, This Month, Custom

**Report Cards** (Stacked)
1. Today's Collection - Large amount with icon
2. Month's Collection - Comparison with last month
3. Pending by Tenant - Expandable list showing tenant name and pending amount

**Visual Data**
- Simple bar charts for monthly trends (using Chart.js library)
- Donut chart for paid vs unpaid ratio
- Color scheme matches primary/secondary/error palette

### Messaging Interface
**Conversation List**
- Material Design list items with tenant avatar (initials), name, last message preview
- Unread indicator badge

**Message Thread**
- Chat bubble design: admin messages right-aligned (primary color), tenant messages left-aligned (surface variant)
- Quick action buttons at bottom: "Share Payment Link", "Share Bill", "Share Receipt"
- Text input with send button

### Data Tables (For larger screens/landscape)
**Tenant Dashboard Table**
- Sticky header row
- Columns: Name, Address, Plan, Last Payment, Amount, Status, Actions
- Row hover state
- Sort indicators on column headers
- Checkbox for bulk actions
- Pagination at bottom

## Overlays & Modals

**Bottom Sheets** (Primary modal pattern for mobile)
- Payment confirmation details
- Quick filters
- Batch actions menu
- Slide up from bottom, drag to dismiss

**Dialogs** (For critical actions)
- Delete confirmations
- Password reset
- Error messages
- Material Design dialog component with scrim

**Snackbars** (Feedback)
- Success: "Payment recorded", "Bill sent"
- Error: "Failed to send email"
- Bottom-aligned, 4-6 second duration
- Action button if applicable (Undo, Retry)

## Status Indicators

**Payment Status Badges**
- Paid: green background, white text, checkmark icon
- Overdue: red background, white text, alert icon
- Due Soon: amber background, dark text, clock icon
- Rounded full, px-3 py-1, 12px/600 text

**Tenant Active Status**
- Toggle switch in forms
- Badge on list items (green dot for active, gray for inactive)

## Interactions & Animations

**Minimal Animation Budget**
- Bottom nav selection: subtle scale and color transition (200ms)
- Card press: slight elevation increase (150ms)
- List item swipe: reveal action buttons with slide
- Form validation: shake animation on error (300ms)
- Loading states: Material circular progress indicator
- **NO scroll-triggered animations**
- **NO elaborate hero section animations**

## Images

**No hero images needed** - This is a utility application focused on data and actions, not marketing.

**Icon Usage**:
- Material Icons CDN exclusively
- 24px size for navigation and actions
- 20px size for inline indicators
- 16px size for small indicators and badges

**Document Previews**:
- Show thumbnails for uploaded documents
- PDF icon placeholder for non-image documents
- Grid layout with 2-3 columns

## Accessibility

- Minimum 44x44px touch targets
- High contrast ratios (WCAG AA compliance)
- Consistent dark mode across all screens including forms
- Focus indicators for keyboard navigation (tablet users)
- Screen reader labels on icon buttons
- Form field validation announcements

## Mobile-Specific Considerations

- Thumb-zone optimization: primary actions in bottom 60% of screen
- Swipe gestures for common actions (list items)
- Pull-to-refresh on lists
- Infinite scroll for long lists with "Load More" fallback
- Bottom navigation over hamburger menu
- Fixed bottom action buttons on forms
- Landscape mode: utilize horizontal space with grid layouts for cards and data

This design prioritizes **speed, clarity, and mobile usability** while maintaining a professional aesthetic appropriate for financial management.