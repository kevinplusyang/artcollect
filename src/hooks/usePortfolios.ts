import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/auth.store";
import { Portfolio } from "@/src/types/database.types";

export function usePortfolios() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["portfolios", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*, art_pieces(count)")
        .eq("owner_id", user!.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Portfolio & { art_pieces: [{ count: number }] })[];
    },
    enabled: !!user,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          owner_id: user!.id,
          name: input.name,
          description: input.description ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Portfolio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      name?: string;
      description?: string;
      cover_image_url?: string;
      is_public?: boolean;
    }) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("portfolios")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Portfolio;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio", data.id] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
}
