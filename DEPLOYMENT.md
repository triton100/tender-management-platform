# Deployment Guide

## Quick Deploy to Vercel

### Step 1: Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 3: Add Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://egczxqnlqnttewkrblse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TENDER_API_URL=http://41.72.130.234:8000/tenders
\`\`\`

**Important:** Add the `TENDER_API_URL` environment variable with your FastAPI backend URL.

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd tender-management-portal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials

# Run database migrations (see README.md)

# Start development server
npm run dev
\`\`\`

## Database Setup

Run these SQL scripts in order in your Supabase SQL Editor:

1. `scripts/01-create-tables.sql` - Creates all tables
2. `scripts/02-enable-rls.sql` - Enables Row Level Security
3. `scripts/03-seed-data.sql` - Adds sample data (optional)

## Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database migrations run in Supabase
- [ ] Row Level Security enabled
- [ ] Email confirmation enabled in Supabase Auth settings
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)
- [ ] External Tender API URL configured

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node.js version is 18+
- Clear `.next` folder and rebuild

### Database Errors

- Verify Supabase credentials
- Check that migrations have been run
- Ensure RLS policies are enabled

### Authentication Issues

- Verify redirect URLs in Supabase Auth settings
- Check that email confirmation is properly configured
- Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set for local dev

### Tender API Issues

**Problem:** Tenders not loading or showing sample data only

**Solution:** 
1. Verify `TENDER_API_URL` environment variable is set correctly
2. For HTTP APIs: The v0 preview environment blocks HTTP for security, but your deployed app will work fine
3. Check that your FastAPI backend is running and accessible
4. Test the API directly: `curl http://41.72.130.234:8000/tenders`

**Note about HTTP vs HTTPS:**
- Your FastAPI backend uses HTTP, which is fine for development and internal networks
- The v0 preview environment may block HTTP requests for security reasons
- When deployed to Vercel or running locally, HTTP APIs work perfectly
- For production, consider adding HTTPS to your FastAPI backend using a reverse proxy (nginx) or SSL certificate
