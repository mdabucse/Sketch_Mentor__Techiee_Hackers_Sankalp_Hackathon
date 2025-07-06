
-- First, drop the foreign key constraint before changing the column type
ALTER TABLE public.user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;

-- Drop all RLS policies that reference the user_id column
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.user_activities;

-- Now we can safely alter the column type from UUID to TEXT
ALTER TABLE public.user_activities ALTER COLUMN user_id TYPE TEXT;

-- Disable RLS since we're using Firebase Auth instead of Supabase Auth
ALTER TABLE public.user_activities DISABLE ROW LEVEL SECURITY;
