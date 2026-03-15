-- =====================================================
-- STORAGE POLICIES FOR images BUCKET
-- Run this in the Supabase SQL Editor Dashboard
-- =====================================================
-- The `images` bucket is PUBLIC, but Supabase still
-- requires explicit RLS policies for INSERT / UPDATE / DELETE.
-- Since this project uses Firebase auth (anon key only),
-- we allow all operations from the anon role.
-- Tighten these policies when auth is added to storage.
-- =====================================================

-- Allow anyone to SELECT (read) objects in the images bucket
CREATE POLICY "images: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow anyone to INSERT (upload) objects into the images bucket
CREATE POLICY "images: public insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow anyone to UPDATE (upsert) objects in the images bucket
CREATE POLICY "images: public update"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images');

-- Allow anyone to DELETE objects from the images bucket
CREATE POLICY "images: public delete"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images');
