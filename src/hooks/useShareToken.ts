import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { Share, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getPortfolioShareUrl, getArtPieceShareUrl } from "@/src/utils/share";

export function useTogglePublic(
  table: "portfolios" | "art_pieces",
  queryKey: string[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { error } = await supabase
        .from(table)
        .update({ is_public: isPublic })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export async function sharePortfolio(shareToken: string, name: string) {
  const url = getPortfolioShareUrl(shareToken);
  if (Platform.OS === "web") {
    await Clipboard.setStringAsync(url);
    return;
  }
  await Share.share({
    message: `Check out my art collection "${name}": ${url}`,
    url,
    title: name,
  });
}

export async function shareArtPiece(shareToken: string, title: string) {
  const url = getArtPieceShareUrl(shareToken);
  if (Platform.OS === "web") {
    await Clipboard.setStringAsync(url);
    return;
  }
  await Share.share({
    message: `Check out this artwork "${title}": ${url}`,
    url,
    title,
  });
}
