
-- Create a storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', false, false, 5242880, '{image/png,image/jpeg,image/jpg}')
ON CONFLICT (id) DO NOTHING;

-- Set up policy to allow authenticated users to upload their own avatars
CREATE POLICY "Allow users to upload avatars" ON storage.objects
  FOR INSERT TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow users to update their own avatars
CREATE POLICY "Allow users to update avatars" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow users to read their own avatars
CREATE POLICY "Allow users to read avatars" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow users to delete their own avatars
CREATE POLICY "Allow users to delete avatars" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

