-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  avatar_url    text,
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- PORTFOLIOS
-- ============================================================
create table public.portfolios (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  description     text,
  cover_image_url text,
  is_public       boolean not null default false,
  share_token     uuid not null default gen_random_uuid() unique,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index portfolios_owner_id_idx on public.portfolios(owner_id);
create index portfolios_share_token_idx on public.portfolios(share_token);

-- ============================================================
-- ART PIECES
-- ============================================================
create table public.art_pieces (
  id              uuid primary key default gen_random_uuid(),
  portfolio_id    uuid not null references public.portfolios(id) on delete cascade,
  owner_id        uuid not null references public.profiles(id) on delete cascade,

  title           text,
  artist          text,
  year            text,
  medium          text,
  dimensions      text,
  notes           text,

  venue_name      text,
  venue_city      text,
  visit_date      date,

  is_public       boolean not null default false,
  share_token     uuid not null default gen_random_uuid() unique,

  -- Phase 2: OCR
  ocr_status      text check (ocr_status in ('pending', 'processing', 'done', 'failed')),
  ocr_raw_text    text,
  ocr_parsed_data jsonb,

  -- Phase 2: auto-crop
  auto_crop_data  jsonb,

  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index art_pieces_portfolio_id_idx on public.art_pieces(portfolio_id);
create index art_pieces_owner_id_idx on public.art_pieces(owner_id);
create index art_pieces_share_token_idx on public.art_pieces(share_token);
create index art_pieces_visit_date_idx on public.art_pieces(visit_date desc);

-- ============================================================
-- ART PHOTOS
-- ============================================================
create table public.art_photos (
  id              uuid primary key default gen_random_uuid(),
  art_piece_id    uuid not null references public.art_pieces(id) on delete cascade,
  owner_id        uuid not null references public.profiles(id) on delete cascade,

  storage_path    text not null,
  public_url      text not null,
  photo_type      text not null check (photo_type in ('artwork', 'label')),
  sort_order      integer not null default 0,
  width_px        integer,
  height_px       integer,

  -- Phase 2
  blurhash        text,
  auto_crop_rect  jsonb,

  created_at      timestamptz not null default now()
);

create index art_photos_art_piece_id_idx on public.art_photos(art_piece_id);

-- ============================================================
-- SHARE VIEWS (Phase 2 analytics)
-- ============================================================
create table public.share_views (
  id            bigint generated always as identity primary key,
  resource_type text not null check (resource_type in ('portfolio', 'art_piece')),
  resource_id   uuid not null,
  viewed_at     timestamptz not null default now(),
  viewer_ip     inet
);

create index share_views_resource_idx on public.share_views(resource_type, resource_id);

-- ============================================================
-- FRIENDSHIPS (Phase 2, schema-ready)
-- ============================================================
create table public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status       text not null check (status in ('pending', 'accepted', 'blocked')),
  created_at   timestamptz not null default now(),
  unique (requester_id, addressee_id)
);

create index friendships_addressee_idx on public.friendships(addressee_id);
