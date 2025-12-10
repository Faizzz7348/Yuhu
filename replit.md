# Vending Machine Refill Service Simulator

## Overview

This is a web-based vending machine refill service management system designed to help operational staff track inventory, manage refills, and monitor machine status across multiple locations. The application simulates a real-world scenario where technicians can view machine details, check product stock levels, record refill activities, and maintain service history.

The system provides a clean, data-focused interface for managing vending machine inventory with visual indicators for stock levels, operational status, and refill schedules. It's built as a utility-focused dashboard prioritizing clarity and operational efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety and modern component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternatives considered: React Router was deemed too heavy for this simple routing needs)

**UI Component System**
- shadcn/ui components (Radix UI primitives) for accessible, composable UI elements
- Tailwind CSS for utility-first styling with custom design system
- Design follows a "Modern Dashboard Pattern" inspired by Linear's minimalism and Notion's data organization
- Custom color palette supporting light/dark themes with professional, operational focus
- Inter font family for clean, highly legible data presentation

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- Local React state for UI interactions
- No global state management library chosen to keep complexity low for this data-display focused app

**Design Philosophy**
- Data-first approach with information visibility without visual clutter
- Status clarity through color-coded badges and progress bars
- Professional restraint with clean, trustworthy interface for operational staff
- Three-tier stock level system: Good (≥60%, green), Warning (30-60%, amber), Critical (<30%, red)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for RESTful API endpoints
- Node.js runtime environment
- Middleware includes JSON parsing, URL encoding, request logging with timing

**API Structure**
- Routes prefixed with `/api` for clear separation from frontend routes
- Currently using modular route registration system in `server/routes.ts`
- Error handling middleware with proper HTTP status codes

**Storage Layer**
- Currently implements in-memory storage (`MemStorage` class) for development/demo purposes
- Storage interface (`IStorage`) defines contract for CRUD operations
- Designed to be swapped for database implementation (PostgreSQL with Drizzle ORM based on configuration)

### Data Storage Solutions

**Database Schema (Prepared for PostgreSQL)**
- `machines` table: Tracks vending machine locations, operational status, and refill schedules
- `products` table: Manages inventory items per machine with current stock and capacity
- `refillRecords` table: Maintains service history with technician info, dates, and notes
- `users` table: Basic user authentication structure (minimal implementation)

**ORM & Schema Management**
- Drizzle ORM for type-safe database operations
- Drizzle Kit for schema migrations
- Zod integration for runtime validation via `drizzle-zod`
- Schema exports TypeScript types for end-to-end type safety

**Current Implementation**
- In-memory storage using Map data structures for rapid prototyping
- Ready to migrate to Neon PostgreSQL (connection configured via `@neondatabase/serverless`)
- Database credentials expected via `DATABASE_URL` environment variable

### Authentication and Authorization

**Current State**
- Minimal user authentication structure exists in schema
- No active authentication middleware implemented
- Session management prepared via `connect-pg-simple` for PostgreSQL session store

**Design Decision**
- Authentication deferred for MVP since this is a single-team operational tool
- Can be added later without major architectural changes
- User table exists for future expansion

### External Dependencies

**Third-Party Services**
- Neon Database: Serverless PostgreSQL hosting (configured but can use any PostgreSQL provider)
- Google Fonts: Inter font family for typography
- No external APIs for weather, payment processing, or other integrations

**Key NPM Packages**
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Headless UI component primitives
- `drizzle-orm` & `drizzle-kit`: Database ORM and migrations
- `date-fns`: Date formatting and manipulation
- `zod`: Schema validation
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Lightweight routing
- `express`: Web server framework
- `vite`: Frontend build tool

**Development Tools**
- Replit-specific plugins for development experience (`@replit/vite-plugin-*`)
- TypeScript for static type checking
- PostCSS with Autoprefixer for CSS processing