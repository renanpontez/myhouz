-- Add new columns to household_item
ALTER TABLE household_item
  ADD COLUMN price NUMERIC(10,2) CHECK (price >= 0),
  ADD COLUMN photos TEXT[] DEFAULT '{}' CHECK (array_length(photos, 1) IS NULL OR array_length(photos, 1) <= 5),
  ADD COLUMN link TEXT CHECK (char_length(link) <= 2083),
  ADD COLUMN tags TEXT[] DEFAULT '{}' CHECK (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 10);

-- GIN index on tags for efficient filtering
CREATE INDEX idx_household_item_tags ON household_item USING GIN (tags);

-- Create item-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images',
  'item-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies

-- Public read
CREATE POLICY "item_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');

-- Authenticated users can upload to their household/user path
CREATE POLICY "item_images_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-images'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can delete their own uploads
CREATE POLICY "item_images_owner_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'item-images'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
