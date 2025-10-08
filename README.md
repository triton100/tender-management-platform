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

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Run database setup scripts
- Configure environment variables
- Create your first user

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Deploy to Vercel

Click the "Publish" button in v0 or:

\`\`\`bash
vercel deploy
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── tenders/           # Tender management
│   ├── opportunities/     # Opportunity tracking
│   ├── tasks/             # Task management
│   ├── documents/         # Document management
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase client configuration
│   ├── db/               # Database query functions
│   └── ...
├── scripts/              # Database setup scripts
│   ├── 01-create-tables.sql
│   ├── 02-enable-rls.sql
│   └── 03-seed-data.sql
└── middleware.ts         # Auth middleware
\`\`\`

## Database Schema

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete schema documentation.

## Environment Variables

Required environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Features in Detail

### Tender Inbox
- Real-time tender feed from eTenders API
- Advanced filtering and search
- Priority indicators and deadline tracking
- Quick actions for qualification

### AI Qualification
- Automated tender analysis
- Match scoring (0-100)
- Risk assessment (low/medium/high)
- Effort and cost estimation
- Recommendation engine (pursue/consider/skip)

### Opportunity Workspace
- Comprehensive opportunity tracking
- Task management with priorities
- Compliance checklist
- Document organization
- Proposal editing

### Analytics Dashboard
- Pipeline metrics and KPIs
- Win rate analysis
- Category performance
- Task completion tracking
- Visual charts and graphs

## User Roles

- **Admin**: Full system access, user management
- **Bid Manager**: Manage opportunities, assign tasks
- **Analyst**: View and analyze tenders, create reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Proprietary - Bright Innovation Technical Solutions

## Support

For support, email support@bitstech.co.za
