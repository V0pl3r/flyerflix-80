
-- Create profiles table for storing user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  downloads_today INTEGER NOT NULL DEFAULT 0,
  last_download_date TIMESTAMP WITH TIME ZONE,
  favorites TEXT[] NOT NULL DEFAULT '{}',
  download_history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the handle_new_user function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
