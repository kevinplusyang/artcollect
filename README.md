# ArtCollect

A cross-platform app for art lovers to photograph, organize, and share their favorite art pieces from galleries and museums.

Built with **Expo SDK 54**, **React Native**, and **Supabase**. Runs on iOS, Android, and Web from a single codebase.

## Features

- **Collections** — Create named portfolios to organize art by theme, museum visit, or personal taste
- **Multi-photo capture** — Photograph artworks from multiple angles plus the museum label, all in one flow
- **Rich metadata** — Record title, artist, year, medium, dimensions, venue, city, visit date, and personal notes
- **Share via link** — Toggle any collection or artwork to public and share a link anyone can view without an account
- **Dark mode** — Follows system theme automatically
- **Offline-ready architecture** — TanStack Query caching with stale-while-revalidate

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo 54 + expo-router 6 |
| Language | TypeScript 5.9 |
| UI | React Native 0.81 + NativeWind 4 (Tailwind CSS) |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Server state | TanStack React Query 5 |
| Client state | Zustand 5 |
| Lists | @shopify/flash-list 2 |
| Camera | expo-camera 17 + expo-image-picker 17 |
| Images | expo-image 3 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/kevinplusyang/artcollect.git
cd artcollect
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in order in the Supabase SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_policies.sql`
3. Create a storage bucket named `art-media` and set it to **public**

### 3. Configure environment

Create `.env.local` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the app

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android

# Web browser
npm run web
```

## Project Structure

```
app/
├── (auth)/                 # Sign in, sign up screens
├── (app)/                  # Authenticated tab navigator
│   ├── (home)/             # Collections grid, portfolio detail, art detail
│   ├── (capture)/          # Quick capture entry from tab bar
│   └── (profile)/          # User profile & settings
├── capture/                # Full-screen multi-step capture modal
│   ├── photos.tsx          # Take artwork photos (multi-shot)
│   ├── label.tsx           # Take label photo (optional)
│   └── metadata.tsx        # Fill in artwork details
└── share/                  # Public share pages (no auth required)
    ├── p/[token].tsx       # Shared portfolio
    └── a/[token].tsx       # Shared art piece

src/
├── components/             # UI components (Button, Input, cards, forms)
├── hooks/                  # React Query hooks for all data operations
├── stores/                 # Zustand stores (auth, capture flow)
├── lib/                    # Supabase client, query client, constants
├── types/                  # TypeScript types matching DB schema
└── utils/                  # Image upload, storage paths, share URLs

supabase/
└── migrations/             # SQL schema, RLS policies, storage policies
```

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profiles, auto-created on signup |
| `portfolios` | Named art collections with share tokens |
| `art_pieces` | Individual artworks with metadata |
| `art_photos` | Multiple photos per artwork (artwork + label types) |
| `friendships` | Social connections (Phase 2, schema-ready) |
| `share_views` | Share analytics (Phase 2, schema-ready) |

All tables have Row Level Security enabled. Owners see their own data; public items are visible to anyone via share tokens.

## How Sharing Works

Every portfolio and art piece gets a stable UUID `share_token` at creation. When toggled to public:

```
https://artcollect.app/share/p/{token}   ← portfolio
https://artcollect.app/share/a/{token}   ← art piece
```

The link opens in the app (via Universal Links) or falls back to the web version. Toggling back to private immediately blocks access — RLS is enforced at query time.

## Phase 2 Roadmap

The database schema is already prepared for these features:

- **OCR** — Auto-read text from label photos (fields: `ocr_status`, `ocr_raw_text`, `ocr_parsed_data`)
- **Smart auto-crop** — Detect and crop artwork boundaries (field: `auto_crop_rect`)
- **Social** — Friend connections and shared feeds (`friendships` table)
- **Analytics** — Track share link views (`share_views` table)
- **Blurhash** — Placeholder images while loading (field: `blurhash`)

## License

MIT
