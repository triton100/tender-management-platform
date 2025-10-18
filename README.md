# Bright Innovation Technical Solutions - Tender Management Portal

A comprehensive tender management system for tracking, qualifying, and managing government tender opportunities in South Africa.

## Features

- **Real-time Tender Feed**: Integration with South Africa eTenders API
- **AI-Powered Qualification**: Automated tender analysis and recommendations
- **Opportunity Management**: Track tenders from qualification to submission
- **Task Management**: Kanban-style task tracking for bid preparation
- **Compliance Tracking**: Monitor compliance requirements and deadlines
- **Document Management**: Centralized document storage and organization
- **Analytics Dashboard**: Visual insights into pipeline and performance
- **Role-Based Access**: Admin, Bid Manager, and Analyst roles

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: React, Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **State Management**: SWR for data fetching

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- A Supabase account (free tier works)

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd tender-management-portal
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
TENDER_API_URL=https://41.72.130.234:8000/tenders
\`\`\`

**Where to find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 4. Set Up Database

Run these SQL scripts in your Supabase SQL Editor (in order):

1. **Create Tables**: Copy and run `scripts/01-create-tables.sql`
2. **Enable Security**: Copy and run `scripts/02-enable-rls.sql`
3. **Add Sample Data** (optional): Copy and run `scripts/03-seed-data.sql`

**How to run scripts:**
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the sidebar
3. Click "New Query"
4. Paste the script content
5. Click "Run"

### 5. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Create Your First User

1. Navigate to `/login`
2. Click "Sign Up"
3. Enter your email and password
4. Check your email for confirmation link
5. Click the confirmation link
6. Sign in with your credentials

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── tenders/       # Tender API endpoints
│   │   ├── opportunities/ # Opportunity endpoints
│   │   └── tasks/         # Task endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── tenders/           # Tender management
│   ├── opportunities/     # Opportunity tracking
│   ├── tasks/             # Task management
│   ├── documents/         # Document management
│   ├── search/            # SA Gov tender search
│   ├── reports/           # Analytics and reports
│   └── login/             # Authentication
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar-nav.tsx   # Navigation sidebar
│   ├── app-header.tsx    # Application header
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase client configuration
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   ├── db/               # Database query functions
│   │   ├── tenders.ts
│   │   ├── opportunities.ts
│   │   └── tasks.ts
│   ├── auth-context.tsx  # Authentication context
│   └── types.ts          # TypeScript types
├── scripts/              # Database setup scripts
│   ├── 01-create-tables.sql
│   ├── 02-enable-rls.sql
│   └── 03-seed-data.sql
├── middleware.ts         # Auth middleware
└── .env.example          # Environment variables template
\`\`\`

## Database Schema

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete schema documentation.

Key tables:
- `users` - User profiles and roles
- `tenders` - Tender opportunities
- `opportunities` - Tracked opportunities
- `tasks` - Task management
- `documents` - Document storage
- `compliance_items` - Compliance tracking

## Environment Variables

Required for local development:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Redirect (for local auth)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# External Tender API URL
TENDER_API_URL=https://41.72.130.234:8000/tenders
\`\`\`

See `.env.example` for all available variables.

## Features in Detail

### Tender Inbox
- Real-time tender feed from eTenders API
- Advanced filtering and search
- AI relevance scoring (relevant/irrelevant)
- Priority indicators and deadline tracking
- Quick actions for qualification
- Document preview and download

### AI Qualification
- Automated tender analysis
- Match scoring (0-100)
- Risk assessment (low/medium/high)
- Effort and cost estimation
- Recommendation engine (pursue/consider/skip)
- AI reasoning explanations

### Opportunity Workspace
- Comprehensive opportunity tracking
- Task management with priorities
- Compliance checklist
- Document organization
- Proposal editing
- Team collaboration

### Analytics Dashboard
- Pipeline metrics and KPIs
- Win rate analysis
- Category performance
- Task completion tracking
- Visual charts and graphs
- Monthly tender activity

## User Roles

- **Admin**: Full system access, user management
- **Bid Manager**: Manage opportunities, assign tasks
- **Analyst**: View and analyze tenders, create reports

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables in Vercel dashboard
6. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

### "Invalid request, only https is supported" error

**Problem**: The external tender API returns this error when trying to fetch tenders.

**Cause**: The tender API server at `41.72.130.234:8000` requires HTTPS connections and rejects HTTP requests.

**Solution**:
1. In v0: Go to the **Vars** section in the in-chat sidebar
2. Find or add the `TENDER_API_URL` environment variable
3. Set it to: `https://41.72.130.234:8000/tenders` (note the **https://**)
4. For local development, update your `.env.local` file:
   \`\`\`env
   TENDER_API_URL=https://41.72.130.234:8000/tenders
   \`\`\`

**Important**: Always use `https://` not `http://` for the tender API endpoint.

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and restart dev server

### Database connection errors
- Verify your Supabase credentials in `.env.local`
- Check that database migrations have been run
- Ensure your Supabase project is active

### Authentication issues
- Verify redirect URLs in Supabase Auth settings
- Check that email confirmation is enabled
- Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set

### Tenders not loading
- Check that the external API endpoint is accessible
- Verify network connectivity
- Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - Bright Innovation Technical Solutions

## Support

For support, email support@brightinnovation.co.za
