# Funny Learn - EXE201

## Deployment on Cloudflare

### Prerequisites
1. Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler`)
3. Database hosted externally (Neon, Supabase, or similar PostgreSQL provider)

### Environment Variables Setup

Create a `.dev.vars` file for local development and add these to your Cloudflare Worker settings:

```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://your-domain.pages.dev"
```

### Prisma Configuration for Cloudflare

This project uses Prisma with PostgreSQL adapter for Cloudflare compatibility:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
```

**Important Configuration:**
- `next.config.ts` includes `serverExternalPackages: ['@prisma/client', 'pg']`
- This prevents bundling issues on Cloudflare Workers

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npm run seed
```

### Build & Deploy Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Preview deployment
npm run preview
```

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

3. **Set environment variables in Cloudflare Dashboard:**
   - Go to Workers & Pages → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

### Troubleshooting Prisma on Cloudflare

If you encounter `Module '@prisma/client' has no exported member 'PrismaClient'`:

1. Ensure `next.config.ts` has:
   ```typescript
   serverExternalPackages: ['@prisma/client', 'pg']
   ```

2. Run `npx prisma generate` before building

3. Verify your database URL is accessible from Cloudflare

4. For direct database connections, ensure your PostgreSQL provider allows external connections

### Alternative: Using Prisma Accelerate

For better performance and connection pooling, consider Prisma Accelerate:

1. Sign up at https://www.prisma.io/data-platform
2. Create an Accelerate connection string
3. Update `DATABASE_URL` to use Accelerate
4. No need for pg adapter in this case

## Project Structure

```
src/
├── actions/          # Server actions
├── app/             # Next.js 15 App Router
│   ├── (student)/   # Student zone
│   ├── admin/       # Admin panel
│   └── parent/      # Parent dashboard
├── components/      # React components
└── lib/            # Utilities (auth, prisma, etc.)
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Deployment:** Cloudflare Pages
- **Database:** PostgreSQL (via Neon/Supabase)
- **ORM:** Prisma 7 with PostgreSQL adapter
- **Auth:** Better Auth
- **UI:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion

## License

MIT
