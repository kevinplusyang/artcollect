// Auto-generated types placeholder.
// Run `npx supabase gen types typescript --local > src/types/database.types.ts`
// after connecting to your Supabase project to regenerate.

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  share_token: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ArtPiece {
  id: string;
  portfolio_id: string;
  owner_id: string;
  title: string | null;
  artist: string | null;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  notes: string | null;
  venue_name: string | null;
  venue_city: string | null;
  visit_date: string | null;
  is_public: boolean;
  share_token: string;
  ocr_status: "pending" | "processing" | "done" | "failed" | null;
  ocr_raw_text: string | null;
  ocr_parsed_data: Record<string, unknown> | null;
  auto_crop_data: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PhotoType = "artwork" | "label";

export interface ArtPhoto {
  id: string;
  art_piece_id: string;
  owner_id: string;
  storage_path: string;
  public_url: string;
  photo_type: PhotoType;
  sort_order: number;
  width_px: number | null;
  height_px: number | null;
  blurhash: string | null;
  auto_crop_rect: Record<string, unknown> | null;
  created_at: string;
}

export interface ArtPieceWithPhotos extends ArtPiece {
  art_photos: ArtPhoto[];
}

export interface PortfolioWithPieces extends Portfolio {
  art_pieces: ArtPieceWithPhotos[];
  profiles: Pick<Profile, "display_name" | "avatar_url">;
}
