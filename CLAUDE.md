# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentFlow is a CRM system specialized for travel agencies, built with Next.js 15, TypeScript, Prisma, and PostgreSQL. The application manages customers, trips, passengers, payments, and activities for travel agents.

## Development Commands

### Dependencies
- Install packages: `npm install`
- Start development with Docker DB: `npm run dev` (starts agent_flow_db container + Next.js dev server)
- Development build: `npm run dev:build`

### Database (Prisma)
- Generate Prisma client: `npm run db:generate` or `npx prisma generate`
- Apply migrations to dev DB: `npm run db:migrate` or `npx prisma migrate dev`
- Push schema to DB: `npm run db:push` or `npx prisma db push`
- Seed database: `npm run db:seed` or `npx prisma db seed`
- Open Prisma Studio: `npm run db:studio` or `npx prisma studio`
- Reset database: `npm run db:reset` or `npx prisma migrate reset`

### Build & Deploy
- Production build: `npm run build` (includes Prisma generate + migrate deploy + Next.js build)
- Start production: `npm start`
- Lint code: `npm run lint` or `next lint`

## Architecture

### Directory Structure
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - React components organized by feature
- `/src/lib/` - Utilities, configuration, and shared logic
- `/src/services/` - Business logic layer (client/server services)
- `/src/types/` - TypeScript type definitions
- `/prisma/` - Database schema, migrations, and seeds

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js v4 with credentials provider
- **UI Components**: Custom components built with Tailwind

### Database Schema
Key entities and relationships:
- **Users** (agents/admins) → **Travels** (1:N)
- **Customers** → **Travels** (1:N)
- **Travels** → **Passengers** (1:N)
- **Travels** → **Activities** (1:N) (audit log)
- **Travels** → **Payments** (1:N)

### Authentication Flow
- Uses NextAuth.js with credentials provider
- Password hashing with bcryptjs
- JWT-based sessions
- Role-based access (admin, agent, manager)
- Login page: `/auth/login`

### API Structure
RESTful API routes in `/src/app/api/`:
- `/api/customers` - Customer CRUD operations
- `/api/travels` - Travel CRUD operations
- `/api/travels/[id]/passengers` - Passenger management
- `/api/dashboard/stats` - Dashboard statistics
- `/api/auth/[...nextauth]` - NextAuth endpoints

### Service Layer Pattern
- **Client Services**: Handle frontend API calls (`*ClientService.ts`)
- **Server Services**: Handle backend business logic (`*ServerService.ts`)
- **Database Services**: Direct Prisma interactions
- Clear separation between client and server logic

## Environment Setup

Required environment variables (see `env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/agentflow"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Docker Database

The project expects a PostgreSQL Docker container named `agent_flow_db`. The `npm run dev` command automatically starts this container before running the development server.

## Form Validation

Uses react-hook-form with Zod schemas for type-safe form validation. Validation schemas are centralized in `/src/lib/validations.ts`.

## Styling System

- Tailwind CSS with custom configuration
- Primary color: Blue (#3B82F6)
- Custom design tokens in `tailwind.config.ts`
- Responsive design patterns throughout components