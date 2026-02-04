-- Create profiles table for storing user information
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/YOUR_PROJECT/sql)

-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (for leaderboards, etc.)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_username TEXT;
  base_username TEXT;
  google_name TEXT;
BEGIN
  -- Priority 1: Username from signup form
  new_username := NEW.raw_user_meta_data->>'username';
  
  -- Priority 2: Full name or name from Google OAuth
  IF new_username IS NULL OR new_username = '' THEN
    google_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    );
    
    IF google_name IS NOT NULL AND google_name != '' THEN
      -- Sanitize: lowercase, replace non-alphanumeric with underscore, limit length
      base_username := lower(regexp_replace(google_name, '[^a-zA-Z0-9]+', '_', 'g'));
      base_username := trim(both '_' from base_username);
      base_username := substring(base_username from 1 for 20);
      
      IF base_username != '' THEN
        new_username := base_username;
      END IF;
    END IF;
  END IF;
  
  -- Priority 3: Fallback to user_ID
  IF new_username IS NULL OR new_username = '' THEN
    new_username := 'user_' || substr(NEW.id::text, 1, 8);
  END IF;

  -- Insert profile with conflict handling
  INSERT INTO public.profiles (id, username, email, avatar_url)
  VALUES (
    NEW.id,
    new_username,
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If username already taken, add random suffix
    INSERT INTO public.profiles (id, username, email, avatar_url)
    VALUES (
      NEW.id,
      new_username || '_' || floor(random() * 9000 + 1000)::text,
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
