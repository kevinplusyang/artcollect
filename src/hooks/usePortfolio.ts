import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { Portfolio, ArtPieceWithPhotos } from "@/src/types/database.types";

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Portfolio;
    },
    enabled: !!id,
  });
}

export function usePortfolioArtPieces(portfolioId: string) {
  return useQuery({
    queryKey: ["portfolio-art-pieces", portfolioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("art_pieces")
        .select(
          `
          *,
          art_photos (*)
        `
        )
        .eq("portfolio_id", portfolioId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ArtPieceWithPhotos[];
    },
    enabled: !!portfolioId,
  });
}
