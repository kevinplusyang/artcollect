-- ============================================================
-- PROFILES RLS
-- ============================================================
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- PORTFOLIOS RLS
-- ============================================================
alter table public.portfolios enable row level security;

create policy "Owners can view own portfolios"
  on public.portfolios for select
  using (auth.uid() = owner_id);

create policy "Public portfolios viewable by anyone"
  on public.portfolios for select
  using (is_public = true);

create policy "Owners can insert portfolios"
  on public.portfolios for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update own portfolios"
  on public.portfolios for update
  using (auth.uid() = owner_id);

create policy "Owners can delete own portfolios"
  on public.portfolios for delete
  using (auth.uid() = owner_id);

-- ============================================================
-- ART PIECES RLS
-- ============================================================
alter table public.art_pieces enable row level security;

create policy "Owners can view own art pieces"
  on public.art_pieces for select
  using (auth.uid() = owner_id);

create policy "Public art pieces viewable by anyone"
  on public.art_pieces for select
  using (is_public = true);

create policy "Art pieces in public portfolios are viewable"
  on public.art_pieces for select
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = art_pieces.portfolio_id
        and p.is_public = true
    )
  );

create policy "Owners can insert art pieces"
  on public.art_pieces for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update own art pieces"
  on public.art_pieces for update
  using (auth.uid() = owner_id);

create policy "Owners can delete own art pieces"
  on public.art_pieces for delete
  using (auth.uid() = owner_id);

-- ============================================================
-- ART PHOTOS RLS
-- ============================================================
alter table public.art_photos enable row level security;

create policy "Owners can view own photos"
  on public.art_photos for select
  using (auth.uid() = owner_id);

create policy "Photos of public art pieces viewable by anyone"
  on public.art_photos for select
  using (
    exists (
      select 1 from public.art_pieces a
      where a.id = art_photos.art_piece_id
        and (a.is_public = true or exists (
          select 1 from public.portfolios p
          where p.id = a.portfolio_id and p.is_public = true
        ))
    )
  );

create policy "Owners can insert photos"
  on public.art_photos for insert
  with check (auth.uid() = owner_id);

create policy "Owners can delete own photos"
  on public.art_photos for delete
  using (auth.uid() = owner_id);
