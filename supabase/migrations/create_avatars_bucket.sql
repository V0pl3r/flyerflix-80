
-- Create a storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, false, 5242880, '{image/png,image/jpeg,image/jpg}')
ON CONFLICT (id) DO NOTHING;

-- Set up policy to allow authenticated users to upload avatars
CREATE POLICY "Allow users to upload avatars" ON storage.objects
  FOR INSERT TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow users to update their own avatars
CREATE POLICY "Allow users to update their avatars" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow public access to read avatars
CREATE POLICY "Allow public to read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
