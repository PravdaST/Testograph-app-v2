-- Add profile_picture_url column to quiz_results table
ALTER TABLE quiz_results
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add comment
COMMENT ON COLUMN quiz_results.profile_picture_url IS 'URL of the user profile picture stored in Supabase Storage';

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access for Profile Pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete profile pictures" ON storage.objects;

-- Set up storage policies for profile pictures bucket
-- Allow anyone to read (public bucket)
CREATE POLICY "Public Access for Profile Pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update profile pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-pictures');

-- Allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete profile pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-pictures');
