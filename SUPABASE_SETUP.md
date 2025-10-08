# Supabase Integration Setup Guide

This guide will help you connect your Tender Management Portal to Supabase and replace all mock data with real database functionality.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- This project cloned locally

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Tender Management Portal
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for setup to complete (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the sidebar
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Add Environment Variables

1. In v0, go to the **Vars** section in the sidebar
2. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon public key

## Step 4: Run Database Setup Scripts

1. In your Supabase project, go to the **SQL Editor** (database icon in sidebar)
2. Click **New Query**
3. Copy and paste the contents of `scripts/01-create-tables.sql`
4. Click **Run** to create all tables
5. Repeat for `scripts/02-enable-rls.sql` to enable Row Level Security
6. Optionally run `scripts/03-seed-data.sql` to add sample tender data

## Step 5: Create Your First User

### Option A: Using Supabase Dashboard

1. Go to **Authentication** > **Users** in Supabase
2. Click **Add user** > **Create new user**
3. Enter email and password
4. Click **Create user**
5. Go to **Table Editor** > **users** table
6. Click **Insert** > **Insert row**
7. Fill in:
   - `id`: Copy the user ID from Authentication section
   - `email`: Same email as auth user
   - `full_name`: Your name
   - `role`: Choose `admin`, `bid_manager`, or `analyst`
8. Click **Save**

### Option B: Using SQL

\`\`\`sql
-- First, create an auth user in Authentication > Users
-- Then run this SQL with the user's ID:

INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'USER_ID_FROM_AUTH',  -- Replace with actual user ID
  'your.email@company.com',
  'Your Full Name',
  'bid_manager'  -- or 'admin' or 'analyst'
);
\`\`\`

## Step 6: Test the Integration

1. Deploy or run your app locally
2. Go to the login page
3. Sign in with the credentials you created
4. You should see:
   - Empty tender inbox (or sample data if you ran seed script)
   - Your user profile in the header
   - All navigation working

## Step 7: Add Real Tender Data

You can add tenders in three ways:

### 1. Using the Upload Tender Button
- Click "Upload Tender" in the Tender Inbox
- Fill in the form
- Data saves directly to Supabase

### 2. Using the SA Gov Tender Search
- Go to "SA Gov Tender Search" in the sidebar
- Search for tenders
- Click "Import" to save to your database

### 3. Using SQL
\`\`\`sql
INSERT INTO public.tenders (
  reference, title, description, issuing_department,
  category, value, location, closing_date, priority
) VALUES (
  'GT-2024-IT-001',
  'IT Infrastructure Upgrade',
  'Comprehensive IT infrastructure modernization...',
  'Department of Infrastructure',
  'Technology',
  25000000.00,
  'Gauteng',
  '2025-12-31',
  'high'
);
\`\`\`

## Troubleshooting

### "Failed to fetch tenders"
- Check that your environment variables are set correctly
- Verify tables were created successfully in Supabase
- Check browser console for detailed error messages

### "Invalid email or password"
- Make sure you created a user in both Authentication AND the users table
- The user ID must match between auth.users and public.users

### "Row Level Security policy violation"
- Make sure you ran the `02-enable-rls.sql` script
- Check that policies were created in Table Editor > [table] > Policies

### Tables not showing up
- Go to SQL Editor and run `01-create-tables.sql` again
- Check for any error messages in the SQL Editor

## Database Schema Overview

### Core Tables
- **users** - User profiles (extends Supabase auth)
- **tenders** - Tender opportunities from eTenders
- **ai_qualifications** - AI analysis results for tenders
- **opportunities** - Tenders being pursued
- **tasks** - Tasks for each opportunity
- **compliance_items** - Compliance requirements tracking
- **documents** - Document management
- **contracts** - Won contracts
- **projects** - Active projects

### Relationships
- Opportunities link to Tenders and AI Qualifications
- Tasks, Compliance, and Documents link to Opportunities
- Projects link to Contracts
- All user-related fields link to Users table

## Next Steps

1. **Customize RLS Policies**: Edit `02-enable-rls.sql` to match your security requirements
2. **Add More Users**: Create accounts for your team members
3. **Import Tenders**: Use the search feature to import real tenders from eTenders
4. **Configure AI**: When ready, integrate real AI for tender qualification
5. **Set up File Storage**: Use Supabase Storage for document uploads

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Create an issue in your repository

---

**Your Tender Management Portal is now connected to Supabase!**
All data will persist in your database and sync across all users in real-time.
