# Local Development Setup Guide

This guide will help you clone the repository and run the Tender Management Portal on your local machine at `http://localhost:3000`.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **pnpm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-github-repo-url>
cd tender-management-portal
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or if you prefer pnpm
pnpm install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Then edit `.env.local` with your actual values:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://egczxqnlqnttewkrblse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnY3p4cW5scW50dGV3a3JibHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4Nzk2NTEsImV4cCI6MjA3NTQ1NTY1MX0.WNZywFaLB8BAL0LU70lYBS5BrQ2j38Ab_AWGqAwvL_I

# Development Redirect URL (IMPORTANT for local auth)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# External Tender API
TENDER_API_URL=http://41.72.130.234:8000/tenders
\`\`\`

### 4. Configure Supabase for Local Development

**CRITICAL STEP:** You must add `http://localhost:3000` to your Supabase allowed redirect URLs:

1. Go to your [Supabase Dashboard](https://app.supabase.com/project/egczxqnlqnttewkrblse)
2. Navigate to **Authentication** → **URL Configuration**
3. Add the following to **Redirect URLs**:
   \`\`\`
   http://localhost:3000/**
   http://localhost:3000/dashboard
   \`\`\`
4. Click **Save**

**Without this step, authentication will fail with a redirect error!**

### 5. Set Up the Database

If you haven't already run the database scripts, do so now:

1. Go to your [Supabase SQL Editor](https://app.supabase.com/project/egczxqnlqnttewkrblse/sql)
2. Run the scripts in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-enable-rls.sql`
   - `scripts/03-seed-data.sql` (optional - adds sample data)

### 6. Start the Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

The application will start at **http://localhost:3000**

### 7. Test Authentication

1. Open http://localhost:3000 in your browser
2. Click **"Sign Up"** to create a new account
3. Enter your email and password
4. Check your email for the confirmation link
5. Click the confirmation link (it will redirect to localhost:3000)
6. Return to http://localhost:3000/login and sign in

## Common Issues and Solutions

### Issue: "Invalid Redirect URL" Error

**Cause:** Supabase doesn't recognize `http://localhost:3000` as an allowed redirect URL.

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add `http://localhost:3000/**` to Redirect URLs
3. Save and try again

### Issue: "User not found" or Profile Errors

**Cause:** The user exists in Supabase Auth but not in the `users` table.

**Solution:** The app automatically creates a user profile when you sign up. If you signed up before the latest code, you may need to:
1. Sign out
2. Sign up again with a new email
3. Or manually add a row to the `users` table in Supabase

### Issue: Tenders Not Loading

**Cause:** The external tender API might be unreachable or returning errors.

**Solution:** 
- Check if your FastAPI server is running at `http://41.72.130.234:8000`
- The app includes fallback sample data for testing
- Check the browser console for detailed error messages

### Issue: "Module not found" Errors

**Cause:** Dependencies not installed or corrupted node_modules.

**Solution:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Environment Variables Explained

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Local development redirect | Set to `http://localhost:3000` |
| `TENDER_API_URL` | Your FastAPI backend URL | Your FastAPI server address |

## Development Workflow

1. **Make changes** to the code
2. **Hot reload** will automatically refresh the browser
3. **Check console** for any errors (press F12 in browser)
4. **Test authentication** after any auth-related changes
5. **Commit and push** to GitHub when ready

## Pushing to GitHub

\`\`\`bash
# Add all changes
git add .

# Commit with a message
git commit -m "Your commit message"

# Push to GitHub
git push origin main
\`\`\`

## Next Steps

- **Deploy to Vercel:** Follow the DEPLOYMENT.md guide
- **Customize:** Update branding, colors, and content
- **Add features:** Extend the portal with new functionality
- **Connect real API:** Update TENDER_API_URL to your production API

## Need Help?

- Check the main README.md for general information
- Review DEPLOYMENT.md for deployment instructions
- Check SUPABASE_SETUP.md for database details
- Look at the browser console (F12) for error messages

## Quick Reference Commands

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

Your local development environment is now ready! 🚀
