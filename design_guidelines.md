# Design Guidelines: Vending Machine Refill Service Simulator

## Design Approach

**Selected Approach:** Design System - Modern Dashboard Pattern  
**Inspiration:** Linear's clean minimalism + Notion's data organization + Carbon Design's enterprise patterns  
**Rationale:** This is a utility-focused, data-heavy inventory management application where clarity, efficiency, and information hierarchy are paramount.

## Core Design Principles

1. **Data First:** Information visibility without visual clutter
2. **Operational Efficiency:** Quick scanning and action-taking
3. **Status Clarity:** Immediate understanding of machine health and inventory levels
4. **Professional Restraint:** Clean, trustworthy interface for operational staff

---

## Color Palette

### Light Mode
- **Background:** 0 0% 100% (pure white)
- **Surface:** 240 5% 96% (light gray cards)
- **Border:** 240 6% 90% (subtle borders)
- **Text Primary:** 240 10% 10% (near black)
- **Text Secondary:** 240 5% 40% (medium gray)

### Dark Mode
- **Background:** 240 10% 8% (deep charcoal)
- **Surface:** 240 8% 12% (dark cards)
- **Border:** 240 6% 18% (subtle borders)
- **Text Primary:** 0 0% 98% (near white)
- **Text Secondary:** 240 5% 65% (light gray)

### Accent Colors
- **Primary:** 217 91% 60% (professional blue - actions, links)
- **Success:** 142 76% 36% (green - operational status, stock good)
- **Warning:** 38 92% 50% (amber - needs attention, low stock)
- **Danger:** 0 84% 60% (red - critical, out of stock)

---

## Typography

**Font Stack:** Inter (Google Fonts) - clean, highly legible for data

- **Headings:**
  - H1: text-3xl font-semibold (Machine details, page titles)
  - H2: text-2xl font-semibold (Section headers)
  - H3: text-lg font-medium (Card titles, subsections)

- **Body:**
  - Large: text-base (Primary content)
  - Regular: text-sm (Secondary info, table cells)
  - Small: text-xs (Metadata, timestamps)

- **Data Display:**
  - Numbers: font-mono text-base (Stock counts, IDs)
  - Labels: text-xs uppercase tracking-wide font-medium text-secondary

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16  
**Container Max-Width:** max-w-7xl  
**Page Padding:** px-4 md:px-6 lg:px-8  
**Vertical Rhythm:** py-6 to py-8 for sections

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Data tables: Single column with horizontal scroll on mobile
- Form layouts: Single column forms with proper field grouping

---

## Component Library

### Navigation
- **Top Bar:** Sticky header with logo, machine selector dropdown, user menu
- **Machine ID Badge:** Prominent display with status indicator dot
- **Background:** Dark surface (240 8% 12% in dark mode, 240 5% 96% in light)

### Dashboard Cards
- **Container:** Rounded-lg border bg-surface p-6
- **Header:** Flex justify-between with title and action button
- **Content:** Structured data display with clear hierarchy
- **Shadow:** Subtle shadow-sm

### Machine Status Indicators
- **Operational:** Green dot + "Operational" label
- **Needs Refill:** Amber dot + "Needs Refill" label  
- **Maintenance:** Red dot + "Maintenance Required" label
- **Implementation:** Inline-flex items-center gap-2

### Inventory Display
- **Table Layout:** Clean bordered table with alternating row colors
- **Headers:** Sticky top-0 bg-surface font-medium text-xs uppercase
- **Cells:** py-3 px-4 with appropriate text alignment
- **Stock Levels:** Progress bars or color-coded percentage indicators
- **Mobile:** Cards view instead of table

### Refill Interface
- **Number Inputs:** Large touch-friendly inputs with +/- steppers
- **Current Stock Display:** Prominent before/after comparison
- **Submit Actions:** Primary button "Complete Refill" + secondary "Cancel"
- **Validation:** Inline error states and success confirmations

### History Log
- **Timeline Layout:** Vertical timeline with date markers
- **Entry Cards:** Compact cards with timestamp, user, products refilled
- **Filters:** Date range picker and product filter dropdowns
- **Empty State:** Centered illustration + helpful message

### Forms & Inputs
- **Input Style:** Solid border, rounded-md, focus:ring-2 ring-primary
- **Labels:** text-sm font-medium mb-1.5
- **Helper Text:** text-xs text-secondary mt-1
- **Buttons:** Primary (bg-primary), Secondary (variant="outline")

### Data Visualization
- **Stock Level Bars:** Horizontal progress bars with percentage labels
- **Status Badges:** Rounded-full px-3 py-1 text-xs with appropriate bg colors
- **Metrics:** Large numbers with small labels (text-3xl + text-xs pattern)

---

## Key Pages & Layouts

### Machine Detail Page (Main View)
**Hero Section:** NO large hero image - compact header with machine info
- Machine ID badge + location + status in single row
- Last refill date and next scheduled refill
- Quick action buttons (Start Refill, View History)

**Dashboard Grid:**
- Current Inventory Card (table of products)
- Machine Statistics Card (total capacity, current stock %)
- Recent Activity Card (last 3-5 refill events)
- Alerts Card (low stock warnings, maintenance notes)

### Refill Interface Page
- Breadcrumb navigation
- Product list with current stock and refill quantity inputs
- Running total of items being added
- Notes/comments textarea
- Confirmation dialog before submitting

---

## Animations

**Minimal, Purposeful Only:**
- Page transitions: None (instant navigation)
- Data updates: Subtle fade-in for new entries (200ms)
- Button interactions: Native browser states only
- Loading states: Simple spinner, no elaborate animations

---

## Images

**NO hero images for this application.**  
This is a data-focused operational tool - imagery would distract from core functionality.

**Icon Usage:**
- Use Heroicons (outline style) via CDN
- Icons for: navigation, status indicators, action buttons
- Size: w-5 h-5 for inline icons, w-6 h-6 for standalone

---

## Responsive Behavior

- **Mobile:** Single column, card-based layouts, hamburger menu
- **Tablet:** Two-column grids where appropriate
- **Desktop:** Full three-column dashboard, side-by-side comparisons
- **Breakpoints:** Follow Tailwind defaults (sm: 640px, md: 768px, lg: 1024px)