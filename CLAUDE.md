# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlphaOption is a Next.js 15 TypeScript application built with the App Router. It's a modern web application focused on trading/financial services with internationalization, authentication, payments, and AI integrations.

## Tech Stack

- **Framework**: Next.js 15 with App Router, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4, Shadcn UI components
- **Authentication**: NextAuth 5.0 (Google, GitHub, Google One-Tap)
- **Payments**: Stripe and Creem integrations
- **Internationalization**: next-intl with multiple locales
- **AI**: Multiple AI SDK providers (OpenAI, DeepSeek, Replicate, OpenRouter)
- **Analytics**: Google Analytics, OpenPanel, Plausible
- **Deployment**: Cloudflare (OpenNext), Docker support

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run analyze          # Bundle analysis

# Database (Drizzle)
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
npm run db:push          # Push schema changes

# Cloudflare deployment
npm run cf:preview       # Preview on Cloudflare
npm run cf:deploy        # Deploy to Cloudflare
npm run cf:upload        # Upload to Cloudflare
npm run cf:typegen       # Generate Cloudflare types

# Docker
npm run docker:build     # Build Docker image
```

## Architecture Overview

### File Structure (from .cursorrules)
- `src/app/`: Next.js App Router pages and API routes
  - `[locale]/`: Locale-specific pages for internationalization
  - `api/`: API routes (checkout, webhooks, etc.)
  - `(legal)/`: Legal pages (privacy, terms)
- `src/components/`: React components
  - `blocks/`: Layout blocks (header, footer) for landing pages
  - `ui/`: Reusable UI components (Shadcn-based)
  - `dashboard/`, `console/`, `feedback/`, etc.: Feature-specific components
- `src/db/`: Database configuration and schema (Drizzle ORM)
- `src/auth/`, `src/lib/auth.ts`: Authentication logic
- `src/integrations/`: External service integrations (Stripe, Creem)
- `src/i18n/`: Internationalization files
  - `messages/`: Global translations
  - `pages/`: Page-specific translations
- `src/types/`: TypeScript type definitions
- `src/services/`, `src/models/`: Business logic and data models
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions

### Key Features
1. **Multi-language Support**: Supports 9+ locales (en, zh, ja, ko, ru, fr, de, ar, es, it)
2. **Authentication**: Multiple providers with conditional enabling via environment variables
3. **Payment Processing**: Dual payment providers (Stripe/Creem) with configurable provider selection
4. **Database**: PostgreSQL with Drizzle ORM, includes users, orders, credits, affiliates, posts, etc.
5. **AI Integrations**: Multiple AI providers for various services
6. **Analytics**: Multiple analytics providers with environment-based configuration

### Database Schema (Key Tables)
- `users`: User profiles with authentication details, affiliate tracking
- `orders`: Payment orders with subscription support
- `credits`: Credit system for transactions
- `apikeys`: User API key management
- `posts`: Content management system
- `categories`: Content categorization
- `affiliates`: Affiliate program tracking
- `feedbacks`: User feedback system

### Database Schema Details

**Schema Location**: `src/db/schema.ts` | **Migrations**: `src/db/migrations/` | **Config**: `src/db/config.ts`

#### 1. users (用户表)
```sql
- id: integer (PK, auto-increment)
- uuid: varchar(255) NOT NULL UNIQUE
- email: varchar(255) NOT NULL
- nickname: varchar(255)
- avatar_url: varchar(255)
- locale: varchar(50)
- signin_type: varchar(50)
- signin_ip: varchar(255)
- signin_provider: varchar(50)
- signin_openid: varchar(255)
- invite_code: varchar(255) NOT NULL DEFAULT ''
- invited_by: varchar(255) NOT NULL DEFAULT ''
- is_affiliate: boolean NOT NULL DEFAULT false
- created_at, updated_at: timestamp with timezone
- UNIQUE INDEX: email + signin_provider
```

#### 2. orders (订单表)
```sql
- id: integer (PK, auto-increment)
- order_no: varchar(255) NOT NULL UNIQUE
- user_uuid, user_email: varchar(255) NOT NULL
- amount: integer NOT NULL
- interval: varchar(50) (付费周期)
- expired_at: timestamp with timezone
- status: varchar(50) NOT NULL
- stripe_session_id: varchar(255)
- credits: integer NOT NULL
- currency: varchar(50)
- sub_id, sub_interval_count, sub_cycle_anchor: subscription fields
- sub_period_start, sub_period_end, sub_times: subscription timing
- product_id, product_name: varchar(255)
- valid_months: integer
- order_detail, paid_detail: text
- paid_at: timestamp, paid_email: varchar(255)
```

#### 3. apikeys (API密钥表)
```sql
- id: integer (PK, auto-increment)
- api_key: varchar(255) NOT NULL UNIQUE
- title: varchar(100)
- user_uuid: varchar(255) NOT NULL
- status: varchar(50)
- created_at: timestamp with timezone
```

#### 4. credits (积分表)
```sql
- id: integer (PK, auto-increment)
- trans_no: varchar(255) NOT NULL UNIQUE
- user_uuid: varchar(255) NOT NULL
- trans_type: varchar(50) NOT NULL
- credits: integer NOT NULL
- order_no: varchar(255) (关联订单)
- expired_at: timestamp with timezone
- created_at: timestamp with timezone
```

#### 5. categories (分类表)
```sql
- id: integer (PK, auto-increment)
- uuid: varchar(255) NOT NULL UNIQUE
- name: varchar(255) NOT NULL UNIQUE
- title: varchar(255) NOT NULL
- description: text
- status: varchar(50)
- sort: integer NOT NULL DEFAULT 0
- created_at, updated_at: timestamp with timezone
```

#### 6. posts (文章表)
```sql
- id: integer (PK, auto-increment)
- uuid: varchar(255) NOT NULL UNIQUE
- slug: varchar(255)
- title: varchar(255)
- description: text
- content: text
- status: varchar(50)
- cover_url: varchar(255)
- author_name, author_avatar_url: varchar(255)
- locale: varchar(50)
- category_uuid: varchar(255)
- created_at, updated_at: timestamp with timezone
```

#### 7. affiliates (推广员表)
```sql
- id: integer (PK, auto-increment)
- user_uuid: varchar(255) NOT NULL
- status: varchar(50) NOT NULL DEFAULT ''
- invited_by: varchar(255) NOT NULL
- paid_order_no: varchar(255) NOT NULL DEFAULT ''
- paid_amount: integer NOT NULL DEFAULT 0
- reward_percent: integer NOT NULL DEFAULT 0
- reward_amount: integer NOT NULL DEFAULT 0
- created_at: timestamp with timezone
```

#### 8. feedbacks (反馈表)
```sql
- id: integer (PK, auto-increment)
- user_uuid: varchar(255)
- content: text
- rating: integer
- status: varchar(50)
- created_at: timestamp with timezone
```

### Configuration
- **Environment**: Uses `.env.development`, `.env.local`, `.env` for configuration
- **Middleware**: Internationalization routing with locale detection
- **Build**: Supports standalone output, MDX pages, bundle analysis
- **Auth**: Conditional authentication enabling based on environment variables

### External Integrations
- **Payment**: Stripe and Creem payment processors
- **Analytics**: Google Analytics, OpenPanel, Plausible
- **Storage**: AWS S3-compatible storage
- **Auth**: Google OAuth, GitHub OAuth, Google One-Tap
- **AI**: Multiple AI model providers via AI SDK

## Development Notes
- Uses React functional components with TypeScript
- Follows Tailwind CSS + Shadcn UI patterns
- Implements responsive design patterns
- Uses React Context for state management
- Component names in CamelCase
- Sonner for toast notifications
- Supports both light and dark themes