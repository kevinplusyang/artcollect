-- Create the art-media storage bucket (public)
-- NOTE: Run this via Supabase dashboard or CLI:
--   supabase storage create art-media --public

-- Storage RLS: users can only upload to their own folder
-- Path convention: art-media/{owner_id}/{portfolio_id}/{art_piece_id}/{filename}

create policy "Users upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'art-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own files"
  on storage.objects for select
  using (
    bucket_id = 'art-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'art-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read access (bucket is public, URLs are unguessable UUIDs)
create policy "Public read access for art-media"
  on storage.objects for select
  using (bucket_id = 'art-media');
