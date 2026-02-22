import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { PortfolioWithPieces, ArtPieceWithPhotos } from "@/src/types/database.types";

export function usePublicPortfolio(shareToken: string) {
  return useQuery({
    queryKey: ["public-portfolio", shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select(
          `
          *,
          profiles ( display_name, avatar_url ),
          art_pieces (
            *,
            art_photos (*)
          )
        `
        )
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (error) throw error;
      return data as PortfolioWithPieces;
    },
    enabled: !!shareToken,
  });
}

export function usePublicArtPiece(shareToken: string) {
  return useQuery({
    queryKey: ["public-art-piece", shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("art_pieces")
        .select(
          `
          *,
          art_photos (*)
        `
        )
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (error) throw error;
      return data as ArtPieceWithPhotos;
    },
    enabled: !!shareToken,
  });
}
