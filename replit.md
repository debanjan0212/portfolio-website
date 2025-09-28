# Modern Portfolio Website

## Overview
A modern, responsive portfolio website built for Debanjan Das, showcasing professional experience as a Senior DevOps/SRE Engineer. The application features a contemporary design with dark/light theme support, smooth animations, and a comprehensive contact system with email integration. Built using React with TypeScript, the site includes sections for about, experience, skills, services, portfolio projects, and contact information.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with custom design system based on shadcn/ui components
- **State Management**: React Query for server state and React Context for theme management
- **Animations**: Framer Motion for smooth page transitions and interactive elements
- **Build Tool**: Vite for fast development and optimized production builds

### Design System
- **Component Library**: shadcn/ui with Radix UI primitives for accessibility
- **Theme System**: Dark/light mode toggle with CSS custom properties
- **Typography**: Inter for primary text, JetBrains Mono for code elements
- **Color Palette**: Professional blue-purple gradient scheme with neutral backgrounds
- **Layout**: Responsive grid system with consistent spacing using Tailwind utilities

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **Session Management**: PostgreSQL-based session store with connect-pg-simple

### Development Tools
- **Hot Reload**: Vite HMR for instant development feedback
- **Type Checking**: TypeScript compiler with strict mode enabled
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines

### Form Handling & Validation
- **Form Library**: React Hook Form for performant form management
- **Validation**: Zod schema validation with @hookform/resolvers
- **Input Components**: Custom form components built on Radix UI primitives

### Email Integration
- **Service**: EmailJS for client-side email sending
- **Contact Form**: Integrated contact form with validation and toast notifications
- **Toast System**: Custom toast notifications for user feedback

## External Dependencies

### Core Technologies
- **React & TypeScript**: Frontend framework with static typing
- **Node.js & Express**: Backend runtime and web framework
- **PostgreSQL**: Primary database with ACID compliance
- **Tailwind CSS**: Utility-first CSS framework for styling

### UI & Design Libraries
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Icon library for consistent iconography

### Database & ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL hosting platform
- **drizzle-zod**: Integration between Drizzle and Zod for validation

### Development & Build Tools
- **Vite**: Fast build tool with HMR support
- **esbuild**: Fast JavaScript bundler for server builds
- **tsx**: TypeScript execution engine for development

### Third-Party Services
- **EmailJS**: Client-side email service for contact forms
- **Google Fonts**: Web fonts (Inter, JetBrains Mono, DM Sans, Fira Code)

### State Management & Data Fetching
- **TanStack React Query**: Server state management with caching
- **React Hook Form**: Form state management and validation
- **date-fns**: Date manipulation and formatting utilities

### Session & Security
- **connect-pg-simple**: PostgreSQL session store for Express
- **Express session middleware**: Server-side session management