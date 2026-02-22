import { STORAGE_BUCKET } from "@/src/lib/constants";
import { supabase } from "@/src/lib/supabase";

export function buildStoragePath(
  ownerId: string,
  portfolioId: string,
  artPieceId: string,
  fileName: string
): string {
  return `${ownerId}/${portfolioId}/${artPieceId}/${fileName}`;
}

export function getPublicUrl(path: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return publicUrl;
}

export function getThumbnailUrl(publicUrl: string, width: number): string {
  return `${publicUrl}?width=${width}&quality=75&resize=cover`;
}
